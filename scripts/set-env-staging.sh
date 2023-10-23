#!/bin/bash

# Get auth
username=$1
password=$2
api=${3:-""}
client_id=${4:-"aeler-ecosystem-demo-test"}
realm=${5:-"aeler-ecosystem-demo"}
# client_id=${3:-"admin-frontend-local"}
# realm=${4:-"Fleet-test"}
HTTP_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -d "username=${username}&password=${password}&grant_type=password&client_id=${client_id}" "https://auth.aeler.com/auth/realms/${realm}/protocol/openid-connect/token")

# extract the body
HTTP_BODY=$(echo $HTTP_RESPONSE | sed -e 's/HTTPSTATUS\:.*//g')

# extract the status
HTTP_STATUS=$(echo $HTTP_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

# echo $HTTP_BODY
echo "Got response from token endpoint: $HTTP_STATUS"

if !([[ $HTTP_STATUS -eq 200 ]]); then
    echo "Could not retrive token, exiting: $HTTP_BODY"
    exit 0
fi


export REALM=$realm
export CLIENTID=$client_id
export TOKEN=$(jq -r ".access_token" <<< $HTTP_BODY)
export AELER_URL_BASE="https://staging.aeler.com/${api}"