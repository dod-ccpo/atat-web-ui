const { exec } = require("child_process");

const path = require('path');
const fs = require('fs');
const { Console } = require("console");
const directoryPath = path.join(__dirname, 'dist/js');

const minify = (file) => {

    const command = `node ./node_modules/uglify-js/bin/uglifyjs ${file} -o ${file}`;

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
    const filesToMinify = files.map(file=> `dist/js/${file}`);
    filesToMinify.forEach(file=>minify(file));
});
