import { env } from 'node:process';
import winston, { createLogger, transports } from "winston";
import { Syslog } from 'winston-syslog';

export const options = {
  host: env.MYSQL_HOST,
  database: env.MYSQL_DATABASE,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
};

export const jwt_secret: any = env.JWT_SECRET || 'secret';

export function removeEmptyFields(obj: Record<string, any>): Record<string, any> {
  const newObj: Record<string, any> = {};

  for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
          const value = obj[key];

          if (value !== null && value !== undefined && value !== '') {
              if (typeof value === 'object') {
                  newObj[key] = removeEmptyFields(value);
              } else {
                  newObj[key] = value;
              }
          }
      }
  }

  return newObj;
}

/**
 * 业务系统可使用远程日志服务器保存代码。
 * 通过`getLogger`创建的logger将输出日志到远程服务器和console。
 * 示例代码见：winston/syslog.js
 */
export const getLogger = (app_name) => {
    const logger = createLogger({
        level: 'debug', // 设置 logger 的最低日志级别
        transports: [
            new Syslog({
                host: env.SYSLOG_IP || '192.168.0.98', // 根据客户端所在位置设置IP
                port: env.SYSLOG_PORT || 5514, // 根据IP调整端口号
                protocol: 'tcp4',
                app_name,
                eol: '\n',
                level: 'debug',
            }),
            new transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize(), // 为日志级别添加颜色
                    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // 添加时间戳
                    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`) // 自定义输出格式
                ),
            }),
        ],
    });
    return logger;
}

export default {
  options,
  jwt_secret,
  removeEmptyFields,
  getLogger,
}