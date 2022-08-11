/**
 * This script runs automatically right after the npm `build` script.
 */
 const fs = require('fs')
 const dirTree = require('directory-tree')
 const clear = require('clear')
 const {
   Console
 } = require('console')
 const PATH_TO_DIST_HTML = 'dist_testing/index.html'
 const linkRelRegEx = /<\s*link[^>]*(.*?)>/g;
 const scriptTagRegEx = /<script[\s\S]*?>[\s\S]*?<\/script>/gi
 const metaTagRegEx = /<\s*meta[^>]*(.*?)>/g
 const materialIconsRegEx = /\s*other_assets\/MaterialIcons/g
 const robotoFontsRegex = /\s*other_assets\/roboto-/g
 const imgRegex = /\s*img\//g
 decorateIndexHTML(PATH_TO_DIST_HTML)
 updateAppWebPackPaths()
 outputResults()
 
 /**
  * 
  * @param {*} inputHTML 
  * @returns all link rel tags
  */
 function resolveLinks(inputHTML) {
   return inputHTML.match(linkRelRegEx);
 }
 
 
 function resolveScriptTags(inputHTML) {
   return inputHTML.match(scriptTagRegEx);
 }
 
 function transformScripts(inputHTML) {
   return inputHTML.replace(/\/js\//g, './js/');
 }
 
 function resolveMetaTags(inputHTML) {
   return inputHTML.match(metaTagRegEx);
 }
 
 
 function decorateIndexHTML(pathToHTML) {
   clear();
   console.log('Cypress Test Post build ');
   const indexHTMLContent = fs.readFileSync(pathToHTML, 'utf-8')
 
   if (!indexHTMLContent) {
     return;
   } else {
     let decoratedHTML = indexHTMLContent
     decoratedHTML = transformScripts(decoratedHTML)
     fs.writeFileSync(pathToHTML, decoratedHTML)
   }
 }
 
 function updateAppWebPackPaths() {
 
   clear();
 
   console.log('\n');
   console.log("update app webpack paths");
 
   const files = fs.readdirSync('./dist_testing/js');
   const appJsFile = files.find(file => file.includes('app'));
 
   if (appJsFile) {
 
     //replace all material icon paths with asset api path
     const appJSPath = `./dist_testing/js/${appJsFile}`;
     const appJsContent = fs.readFileSync(appJSPath, 'utf-8');
     let appJs = appJsContent;
     appJs = appJsContent.replace('__webpack_require__.p = "/";', '__webpack_require__.p = "";');
 
     fs.writeFileSync(appJSPath, appJs, 'utf-8');
   } else {
 
     console.error("unable to locate app js file");
   }
 }
 
 
 
 
 function bytesNumToKbsStr(bytesNum) {
   return Math.round(bytesNum / 1000) + 'kB'
 }
 
 function outputResults() {
   console.log('\n')
   console.log(
     'Find the production build in the dist_testing/ directory.'
   )
   console.log('\n')
 
   try {
     const tree = dirTree('./dist', {})
     const indexHtml = tree.children.find(child => child.name === 'index.html')
     const roundedSizeKbs = bytesNumToKbsStr(indexHtml.size)
     console.log(indexHtml.path.replace('/index.html', ''))
     console.log('├── ' + indexHtml.name + ', ' + roundedSizeKbs)
     console.log('\n')
 
     const totalSize = bytesNumToKbsStr(tree.size)
 
     console.log('Total bundle size: ' + totalSize)
     console.log('See the build files above.')
     console.log('\n')
 
     console.log(
 
       'Your app production build is ready for deployment in ServiceNow.'
 
     )
     console.log('\n')
   } catch (err) {
     console.log(err.message)
     console.log(
 
       'Something went wrong. There should be an error message above.'
 
     )
   }
 }