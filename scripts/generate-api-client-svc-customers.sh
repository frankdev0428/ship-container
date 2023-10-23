#!/bin/bash

server='http://localhost:3004'
tags='default'

docker run --rm -v ${PWD}:/local --network="host" -u `id -u $USER` openapitools/openapi-generator-cli:v5.1.0 generate \
  -i ${server}/documentation?tags=${tags} \
  -g typescript-fetch \
  -o /local/src/apis-client/svc-customers \
  --additional-properties=typescriptThreePlus=true \
  --config /local/scripts/generate-client/config.json | grep -E '^|^.*models\/Model.*ts'

  # -t /local/script/generate-client/templates/typescript-fetch \