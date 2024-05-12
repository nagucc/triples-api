# 使用官方的Node.js镜像
FROM node:20
 
# 设置工作目录
WORKDIR /usr/src/app
 
# 复制package.json文件和package-lock.json文件
COPY package*.json ./
 
# 安装项目依赖
RUN npm install
RUN npm i bun -g
 
# 复制所有源代码到工作目录
COPY . .
 
# 对外暴露的端口号
EXPOSE 3000
 
# 运行Node.js Express应用
CMD ["bun", "run", "./src/index.ts"]