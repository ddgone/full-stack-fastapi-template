# 基础Node镜像（开发和构建共用）
FROM node:24-alpine AS base
WORKDIR /app
# 复制依赖文件（优先复制以利用Docker缓存）
COPY package.json package-lock.json ./
# 安装所有依赖（包括devDependencies，开发模式需要）
RUN npm ci

# 开发阶段：用于本地开发，运行Vite热重载服务器
FROM base AS development
# 复制所有源代码（开发时需要实时同步）
COPY . .
# 暴露Vite默认开发端口
EXPOSE 5173
# 开发启动命令（监听所有IP，允许容器外部访问）
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# 构建阶段：用于生产环境，生成静态产物
FROM base AS build-stage
# 复制源代码
COPY . .
# 传递构建参数（API地址）
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
# 执行生产构建
RUN npm run build

# 生产阶段：基于Nginx运行静态文件
FROM nginx:1 AS production
# 从构建阶段复制产物到Nginx
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
# 复制Nginx配置
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx-backend-not-found.conf /etc/nginx/extra-conf.d/backend-not-found.conf
# 暴露Nginx端口
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]