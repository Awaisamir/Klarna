const fs = require('fs-extra');
const concat = require('concat');

concatenate = async () =>{
  const files = [
    './dist/klarna-web-component/runtime-es2015.js',
    './dist/klarna-web-component/polyfills-es2015.js',
    './dist/klarna-web-component/main-es2015.js'
  ];

  await fs.ensureDir('output');
  await fs.emptyDir('output');
  await concat(files, 'output/klarna-web-component.js');
}
concatenate().then(()=> {
  fs.removeSync('demo/klarna-web-component.js');
  fs.copySync('output/klarna-web-component.js','demo/klarna-web-component.js');
});
