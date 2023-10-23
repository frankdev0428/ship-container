#!/bin/bash
# WARN: Needs to be run from the main dir

# Exit imediately if a command exits with a non-sero status
set -e

# List options
show_help () {
  printf "Starts dockerized fleet frontend\n\n"
  printf "Options:\n\n"
  printf "    %-10s \t %-20s\n" "-h, --help" "Show help"
  printf "\n"
  printf "    %-10s \t %-20s\n" "--env-file" "Specify an alternate environment file for starting the application"
  printf "\n"
  printf "    %-10s \t %-20s\n" "*" "Any docker-compose option"
}

# Default environment file
ENV_FILE=.env.development

POSITIONAL=()
while [[ $# -gt 0 ]]; do
  key="$1"

  case $key in
    -h|--help|\?)
      show_help
      exit 0
      ;;
    --env-file)
      ENV_FILE="$2"
      shift # past argument
      shift # past value
      ;;
    *)    # unknown option
      POSITIONAL+=("$1") # save it in an array for later
      shift # past argument
      ;;
  esac
done

set -- "${POSITIONAL[@]}" # restore positional parameters

if [ ! -e $ENV_FILE ]; then
    echo "No environemnt file \"$ENV_FILE\" was found"
    exit 1
fi

# generate api client

docker-compose --env-file $ENV_FILE config
docker-compose --env-file $ENV_FILE up $@ 