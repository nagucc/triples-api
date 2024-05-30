import { env } from 'node:process';

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

export default {
  options,
  jwt_secret,
  removeEmptyFields,
}