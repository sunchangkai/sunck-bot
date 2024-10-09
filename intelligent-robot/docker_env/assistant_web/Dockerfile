FROM registry.cn-zhangjiakou.aliyuncs.com/dvadmin-pro/dvadmin3-base-web:16.19-alpine
LABEL maintainer="bot_system"
WORKDIR /assistant_web/
COPY assistant_web/. .
RUN yarn install --registry=https://registry.npmmirror.com
RUN yarn build

FROM nginx:alpine
COPY ./docker_env/assistant_nginx/my.conf /etc/nginx/conf.d/my.conf
COPY --from=0 /assistant_web/dist /usr/share/nginx/html
