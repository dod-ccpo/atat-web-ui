const { exec } = require("child_process");

const path = require('path');
const fs = require('fs');
const { Console } = require("console");

const distPath = process.argv[2];

if(!distPath){
  throw new Error('dist path not specified');
}

const directoryPath = path.join(__dirname, distPath);

const minify = (file) => {

  const command = `node ./node_modules/terser/bin/terser ${file} -o ${file}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
  });
    
}
fs.readdir(directoryPath, function (err, files) {
  //handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  } 

  console.log('minifying js files...');
  const filesToMinify = files.map(file=> `${distPath}${file}`);
  filesToMinify.forEach(file=>minify(file));
  console.log('minifying complete');
});