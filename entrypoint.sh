#!/bin/sh
# entrypoint.sh

# Echo a message to indicate where the script is starting
echo "Serving your application with NGINX..."

# Start NGINX in the foreground
exec nginx -g 'daemon off;'
