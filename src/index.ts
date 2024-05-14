// app.js
import express from 'express';
import { expressjwt } from 'express-jwt';
import cors from 'cors';
import { jwt_secret } from './utils.ts';
import propertyRoutes from './predicate.ts';
import tripleRoutes from './triple.ts';
import objectRoutes from './object.ts';
import subjectRoutes from './subject.ts';

const app = express();
const PORT = 3000;

// 使⽤ express.json() 中间件解析 JSON 格式的请求体
app.use(express.json());
app.use(cors());
app.use(expressjwt({
  secret: jwt_secret,
  algorithms: ["HS256"],
}));

// 使用中间件加载路由

app.use('/v1/predicate', propertyRoutes);
app.use('/v1/triple', tripleRoutes);
app.use('/v1/object', objectRoutes);
app.use('/v1/subject', subjectRoutes);

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});