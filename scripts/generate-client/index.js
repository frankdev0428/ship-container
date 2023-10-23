const { spawn } = require('child_process');

const server = 'http://localhost:3000'
const tags = 'default'

/* const generator = spawn('java', [
  '-jar', './script/generate-client/openapi-generator-cli-4.1.3.jar',
  'generate',
  '--input-spec', `${server}/documentation?tags=${tags}`,
  '--generator-name', 'typescript-fetch',
  '-t', './script/generate-client/templates/typescript-fetch',
  '--output', './src/apis-client/',
  '--config', './script/generate-client/config.json',
], { stdio: [process.stdin, process.stdout, process.stderr] }) */

const generator = spawn(`docker run --rm -v ${process.cwd()}:/local --network="host" openapitools/openapi-generator-cli generate \
  -i ${server}/documentation?tags=${tags} \
  -g typescript-fetch \
  -t /local/script/generate-client/templates/typescript-fetch \
  -o /local/src/apis-client \
  --config /local/script/generate-client/config.json`, { stdio: [process.stdin, process.stdout, process.stderr] })

generator.on('close', code => {
  console.log(`Generator exited with code ${code}`)
})
