import { env } from 'node:process';

export const options = {
  host: env.MYSQL_HOST,
  database: env.MYSQL_DATABASE,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
};

export const jwt_secret: any = env.JWT_SECRET || 'secret';

export default {
  options,
  jwt_secret,
}