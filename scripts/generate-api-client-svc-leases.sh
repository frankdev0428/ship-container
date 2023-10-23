#!/bin/bash
##############################################################################

# Usage: 
# ./scripts/generate-api-client-svc-leases.sh -e staging -u <USERNAME_HERE> -p <PASSWORD_HERE>

##############################################################################

while getopts ":e:u:p:r:c:" opt; do
  case $opt in
    e) doc_env="$OPTARG"
    ;;
    u) username="$OPTARG"
    ;;
    p) password="$OPTARG"
    ;;
    r) realm="$OPTARG"
    ;;
    c) clientid="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    exit 1
    ;;
  esac

  case $OPTARG in
    -*) echo "Option $opt needs a valid argument"
    exit 1
    ;;
  esac
done

# printf "Argument doc_env is %s\n" "$doc_env"
# printf "Argument username is %s\n" "$username"
# printf "Argument password is %s\n" "$password"
# printf "Argument realm is %s\n" "$realm"
# printf "Argument clientid is %s\n" "$clientid"

##############################################################################

source "${BASH_SOURCE%/*}/set-env-staging.sh" $username $password $clientid $realm 

server=${AELER_URL_BASE:-"http://localhost:3003"}
tags='default'

##############################################################################

echo "Generating doc from URL: $server"

HTTP_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" ${server}/documentation?tags=${tags} -H "Authorization: Bearer $TOKEN")
HTTP_BODY=$(echo $HTTP_RESPONSE | sed -e 's/HTTPSTATUS\:.*//g')
HTTP_STATUS=$(echo $HTTP_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

echo "Got response from doc endpoint: $HTTP_STATUS"
# echo $HTTP_BODY

if !([[ $HTTP_STATUS -eq 200 ]]); then
    echo "Could not retrieve documentation, exiting: $HTTP_BODY"
    exit 0
fi

jq -r '. + {"securityDefinitions": {"jwt": {"type": "apiKey", "name": "Authorization", "in": "header"}}, "security": [{"jwt": []}]}' <<< $HTTP_BODY > ./scripts/spec-leases.json

##############################################################################

# curl ${server}/documentation?tags=${tags} | jq -r '. + {"securityDefinitions": {"jwt": {"type": "apiKey", "name": "Authorization", "in": "header"}}, "security": [{"jwt": []}]}' > ./scripts/spec-leases.json
sed -i -e 's/"format": "date"/"format": "date-time"/g' ./scripts/spec-leases.json

docker run --rm -v ${PWD}:/local --network="host" -u `id -u $USER` openapitools/openapi-generator-cli:v5.1.0 generate \
  -i /local/scripts/spec-leases.json \
  -g typescript-fetch \
  -o /local/src/apis-client \
  --additional-properties=typescriptThreePlus=true \
  --config /local/scripts/generate-client/config.json | grep -E '^|^.*models\/Model.*ts'

  # -t /local/script/generate-client/templates/typescript-fetch \

