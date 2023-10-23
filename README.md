# README #
# Starting and stopping the containerized application

## CONFIG

Environment variables are defined in the file `config.json`.

## Starting

From the main directory, run:

`./scripts/start.sh` or `./scripts/start.sh --env-file .env.development`


When no file is specified, it will assume ".env.development" as the file with the environment variables.

Any aditional arguents will be passed to docker-compose:

`./scripts/start.sh --build` will re-build the docker image

### Running against local API running instaces

In `config.json`, all API addresses should be pointing to `http://localhost:...` and the respecive service should be running locally

### Using staging APIs

You can configure the environment to call the staging API.

Change `config.json` to call `https://staging.aeler.com/<service_name>`

## Stopping application

Run: `docker-compose -f docker-compose.dev.yml stop`


<!-- OUTDATED -->

<!-- # Starting and stopping containerized storybook
## Starting storybook

You may want to have a local instance of the API running (in port 3002 if using `.env.storybook`) but this is not mandatory.
From the main directory, run:

`./scripts/start.sh --env-file .env.storybook`

or specify any custom file from which to load the environment variables.

## Stopping storybook
Run:

`docker-compose -p storybook stop` or `docker-compose -f docker-compose.storybook.yml stop` -->

