#!/bin/bash

server='http://localhost:3010'
tags='default'

curl ${server}/documentation?tags=${tags} | jq -r '. + {"securityDefinitions": {"jwt": {"type": "apiKey", "name": "Authorization", "in": "header"}}, "security": [{"jwt": []}]}' > ./scripts/spec-boards-kizy.json

docker run --rm -v ${PWD}:/local --network="host" -u `id -u $USER` openapitools/openapi-generator-cli:v5.1.0 generate \
  -i /local/scripts/spec-boards-kizy.json \
  -g typescript-fetch \
  -o /local/src/apis-client/svc-boards-kizy \
  --additional-properties=typescriptThreePlus=true \
  --config /local/scripts/generate-client/config.json | grep -E '^|^.*models\/Model.*ts'

  # -t /local/script/generate-client/templates/typescript-fetch \

