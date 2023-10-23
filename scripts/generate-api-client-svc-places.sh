#!/bin/bash

server='http://localhost:3003'
tags='default'

curl ${server}/documentation?tags=${tags} | jq -r '. + {"securityDefinitions": {"jwt": {"type": "apiKey", "name": "Authorization", "in": "header"}}, "security": [{"jwt": []}]}' > ./scripts/spec-places.json

docker run --rm -v ${PWD}:/local --network="host" -u `id -u $USER` openapitools/openapi-generator-cli:v5.1.0 generate \
  -i /local/scripts/spec-places.json \
  -g typescript-fetch \
  -o /local/src/apis-client/svc-places \
  --additional-properties=typescriptThreePlus=true \
  --config /local/scripts/generate-client/config.json | grep -E '^|^.*models\/Model.*ts'

  # -t /local/script/generate-client/templates/typescript-fetch \

