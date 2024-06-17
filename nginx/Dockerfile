FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
RUN mkdir /usr/share/nginx/html/media \
    && chown nginx:nginx -R /usr/share/nginx/html/media