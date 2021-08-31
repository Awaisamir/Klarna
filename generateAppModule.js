const path = require('path');
const fs = require('fs-extra');

const TEMPLATE_LOCATION  = 'src/app/app.module.mustache';

const target = process.argv.slice(2)[0];

if(!target) {
  console.log('Please specify a target: build or serve');
  return;
}

if(!fs.pathExistsSync(TEMPLATE_LOCATION)){
  console.log(`${TEMPLATE_LOCATION} does not exist `)
  return;
}

const MPOSExtensionsGenerator = require('@flooid/mpos-extensions-generator/js/mpos-extensions-generator');
const mposExtensionsGenerator= new MPOSExtensionsGenerator();
const destination = path.join(process.cwd(), 'src', 'app', 'app.module.ts');

mposExtensionsGenerator.generateAppModule(TEMPLATE_LOCATION, target, destination);
