FROM nginx:alpine

# Copiar archivos estáticos
COPY . /usr/share/nginx/html/

# Configuración de nginx
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Configurar MIME types
    location ~* \\.js\$ {
        add_header Content-Type application/javascript;
    }

    location ~* \\.css\$ {
        add_header Content-Type text/css;
    }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
