#!/bin/sh -e

# The following is taken from here: https://github.com/coreruleset/modsecurity-crs-docker/blob/master/nginx/docker-entrypoint.sh
export DNS_SERVER=${DNS_SERVER:-$(grep -i '^nameserver' /etc/resolv.conf|head -n1|cut -d ' ' -f2)}

ENV_VARIABLES=$(awk 'BEGIN{for(v in ENVIRON) print "$"v}')

FILES="/etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/logging.conf /etc/modsecurity.d/modsecurity-override.conf"

for FILE in $FILES; do
    if [ -f "$FILE" ]; then
        envsubst "$ENV_VARIABLES" <"$FILE" | sponge "$FILE"
    fi
done

. /opt/modsecurity/activate-rules.sh

# This is inspired by https://developers.redhat.com/blog/2021/03/04/making-environment-variables-accessible-in-front-end-containers#inject_the_environment_variables:
export EXISTING_VARS=$(printenv | awk -F= '{print $1}' | sed 's/^/\$/g' | paste -sd,);
for file in $JSFOLDER; do
  envsubst "$EXISTING_VARS" <"$file" | sponge "$file"
done

exec "$@"
