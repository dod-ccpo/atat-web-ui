/**
 * This script runs automatically right after the npm `build` script.
 */
const servicenowConfig = require('./servicenow.config')
const fs = require('fs')
const dirTree = require('directory-tree')
const clear = require('clear')
const {
  Console
} = require('console')
const PATH_TO_DIST_HTML = 'dist/index.html'
const linkRelRegEx = /<\s*link[^>]*(.*?)>/g;
const scriptTagRegEx = /<script\b[^>]*>[\s\S/]*?<\/script\b[^>]*>/g
const metaTagRegEx = /<\s*meta[^>]*(.*?)>/g
const materialIconsRegEx = /\s*other_assets\/MaterialIcons/g
const robotoFontsRegex = /\s*other_assets\/roboto-/g

decorateIndexHTML(PATH_TO_DIST_HTML)
updateAppAssetPaths()
updateVendorAssetPaths()
outputResults()

/**
 * 
 * @param {*} inputHTML 
 * @returns all link rel tags
 */
function resolveLinks(inputHTML) {
  return inputHTML.match(linkRelRegEx);
}

// function transformCss(link, inputHTML) {
//   const updatedLink = link.replace('/css/', servicenowConfig.CSS_API_PATH);
//   return inputHTML.replace(link, updatedLink);
// }

// function transformLinkJs(link, inputHTML) {
//   const updatedLink = link.replace('/js/', servicenowConfig.JS_API_PATH);
//   return inputHTML.replace(link, updatedLink);
// }

function transformLinks(inputHTML) {

  console.log(`transformLinks`);
  const links = resolveLinks(inputHTML);
  console.table(links);
  links.forEach(link => {

    // //service now requires link tags to be terminated with "</link>"
    // const linkUpdate = link.substring(0, link.length- 1) + '</link>';
    // inputHTML = inputHTML.replace(link, linkUpdate);

    // if (link.includes('/css/')) {
    //   inputHTML = transformCss(link, inputHTML);
    // }

    // if (link.includes('/js/')) {
    //   inputHTML = transformLinkJs(link, inputHTML);
    // }

    //for now we'll just remove the link tags
    inputHTML = inputHTML.replace(link, '');

  });
  return inputHTML;
}

function resolveScriptTags(inputHTML) {

  return inputHTML.match(scriptTagRegEx);

}

function transformScripts(inputHTML) {

  const scriptTags = resolveScriptTags(inputHTML);
  console.table(scriptTags);
  scriptTags.forEach(scriptTag => inputHTML =
    inputHTML.replace(scriptTag, scriptTag.replace('/js/', servicenowConfig.JS_API_PATH)))

  return inputHTML;
}

function resolveMetaTags(inputHTML) {
  return inputHTML.match(metaTagRegEx);
}

function removeMetaTags(inputHTML) {
  const metaTags = resolveMetaTags(inputHTML);
  metaTags.forEach(metaTag => inputHTML = inputHTML.replace(metaTag, ''));

  return inputHTML;
}

function injectJellyWrappers(inputHTML) {
  console.log(`jelly wrapper`);
  console.log(inputHTML);
  const JELLY_WRAPPER_START = `
  
  <?xml version="1.0" encoding="utf-8" ?>
   <j:jelly
     trim="false"
     xmlns:j="jelly:core"
     xmlns:g="glide"
     xmlns:j2="null"
     xmlns:g2="null"
   >`



  const JELLY_WRAPPER_END = `</j:jelly>`

  return JELLY_WRAPPER_START + inputHTML + JELLY_WRAPPER_END
}


function injectJellyDoctype(inputHTML) {
  const DOCTYPE_JELLY = `
  <g:evaluate> var docType = '&lt;!DOCTYPE HTML&gt;';
  </g:evaluate>
  <g2:no_escape>
  $[docType]
  </g2:no_escape>
         <g:evaluate object="true">
          var session = gs.getSession();
  var token = session.getSessionToken();
  </g:evaluate> 
  <script>     
           window.sessionToken = "$[token]"; 
  </script>
     `

  const headIndex = inputHTML.indexOf('<head')

  return (
    inputHTML.substring(0, headIndex) +
    DOCTYPE_JELLY +
    inputHTML.substring(headIndex)
  )
}

function removeXmlTag(inputHTML) {

  const tag = '<?xml version="1.0" encoding="utf-8" ?>'

  return inputHTML.replace(tag, '');

}

// function injectJellyContent(varName, content){
//   const CONTENT = `
//   <g:evaluate> var ${varName} = '${content}'; 
//   </g:evaluate> 
//   <g2:no_escape> 
//       $[${varName}] 
//   </g2:no_escape>
//     `
//     return CONTENT;
// }

// function injectJellySafeMetaTags(inputHTML){

//   const headStartTag = '<head>';
//   const headIndex = inputHTML.indexOf(headStartTag);
//   const metaTags =  injectJellyContent('metatags', `<meta charset="utf-8"><meta http-equiv="X-UA-Compatible"
//    content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1">`);

//   return (
//     inputHTML.substring(0, headIndex + headStartTag.length) +
//     metaTags +
//     inputHTML.substring(headIndex + headStartTag.length)
//   )
// }

function removeHtmlTags(inputHTML) {
  return inputHTML.replace(/(<html>)|(<html.+>)/, '').replace('</html>', '')
}

function removeDocType(inputHTML) {
  return inputHTML.replace('<!DOCTYPE html>', '')
}

function removeDoubleNewlines(inputHTML) {
  return inputHTML.replace(/\s{2,}/gm, '\n')
}

function decorateIndexHTML(pathToHTML) {
  const indexHTMLContent = fs.readFileSync(pathToHTML, 'utf-8')
  let decoratedHTML = indexHTMLContent
  decoratedHTML = removeDocType(decoratedHTML)
  decoratedHTML = injectJellyDoctype(decoratedHTML)
  decoratedHTML = removeHtmlTags(decoratedHTML)
  decoratedHTML = removeMetaTags(decoratedHTML)
  decoratedHTML = removeDoubleNewlines(decoratedHTML)
  decoratedHTML = transformLinks(decoratedHTML)
  decoratedHTML = transformScripts(decoratedHTML)
  decoratedHTML = injectJellyWrappers(decoratedHTML)
  decoratedHTML = removeXmlTag(decoratedHTML);
  // decoratedHTML = injectJellySafeMetaTags(decoratedHTML)
  fs.writeFileSync(pathToHTML, decoratedHTML)
}

function updateVendorAssetPaths() {

  clear();

  console.log('\n');
  console.log("update assets path");

  const files = fs.readdirSync('./dist/js');
  const vendorJsFile = files.find(file => file.includes('vendor'));

  if (vendorJsFile) {

    //replace all material icon paths with asset api path
    const vendorJsPath = `./dist/js/${vendorJsFile}`;
    const vendorJsContent = fs.readFileSync(vendorJsPath, 'utf-8');
    let vendorJs = vendorJsContent;
    vendorJs = vendorJs.replace(materialIconsRegEx,
      `${servicenowConfig.ASSETS_API_PATH}MaterialIcons`);

    fs.writeFileSync(vendorJsPath, vendorJs, 'utf-8');
  } else {

    console.error("unable to locate vendor js file");
  }
}

function updateAppAssetPaths() {

  clear();

  console.log('\n');
  console.log("update assets path");

  const files = fs.readdirSync('./dist/js');
  const appJsFile = files.find(file => file.includes('app'));

  if (appJsFile) {

    //replace all material icon paths with asset api path
    const appJSPath = `./dist/js/${appJsFile}`;
    const appJsContent = fs.readFileSync(appJSPath, 'utf-8');
    let appJs = appJsContent;
    appJs = appJsContent.replace(robotoFontsRegex,
      `${servicenowConfig.ASSETS_API_PATH}roboto-`);

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
    'Find the production build in the dist/ directory.'
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