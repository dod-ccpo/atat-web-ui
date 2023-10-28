/**
 * This script runs automatically right after the npm `build` script.
 */
const servicenowConfig = require("./servicenow.config");
const fs = require("fs");
const path = require("path");
const {
  match
} = require("assert");
const assert = require("node:assert").strict;

const fileEncoding = "utf-8";
const ourFakeExtension = ".html";
// file paths
const DIST_DIR = "./dist";
const JS_DIR = path.join(DIST_DIR, "js");
const IMG_DIR = path.join(DIST_DIR, "img");
const FONTS_DIR = path.join(DIST_DIR, "fonts");
const ASSETS_DIR = path.join(DIST_DIR, "other_assets");
const INDEX_HTML = path.join(DIST_DIR, "index.html");
// regular expressions
const linkRelRegEx = /<\s*link[^>]*(.*?)>/g;
const scriptTagRegEx = /<script\b[^>]*>[\s\S\/]*?<\/script\b[^>]*>/g;
const metaTagRegEx = /<\s*meta[^>]*(.*?)>/g;
const materialIconsRegEx = /\s*other_assets\/materialdesignicons-/g;
const robotoFontsRegex = /\s*other_assets\/roboto-/g;

const imgRegex = /\s*img\//g;
const buildMatches = {};
const fileMapping = {};


decorateIndexHTML(INDEX_HTML);

renameFiles(JS_DIR, ourFakeExtension);
renameFiles(IMG_DIR, ourFakeExtension);
renameFiles(ASSETS_DIR, ourFakeExtension);
updateResourceNames(JS_DIR,"app-");

updateAppAssetsPaths(JS_DIR);
updateAssetPaths(JS_DIR, "app-");

outputResults();

/**
 * Finds all matches in the given input using the specified regular expression.
 * Specify the expected number of matches in the third parameter.
 */
function findMatches(input, regEx, expectedMatchCount) {
  const matches = input.match(regEx);
  //record matches
  if (buildMatches[regEx]) {
    const bm = buildMatches[regEx];
    bm.found = (matches && matches.length > bm.found) ? matches.length : bm.found;
  } else {
    buildMatches[regEx] = {
      expected: expectedMatchCount,
      found: matches ? matches.length : 0
    }
  }

  return matches;
}

/**
 * Removes standard HTML doctype from the given input
 */
function removeDocType(html) {
  return html.replace("<!DOCTYPE html>", "");
}

/**
 * Adds jelly tags for session info before <head> tag
 */
function injectJellyDoctype(html) {
  const headIndex = html.indexOf("<head");
  return `${html.substring(0, headIndex)}
    <g:evaluate>var docType = '&lt;!DOCTYPE HTML&gt;';</g:evaluate>
    <g2:no_escape>$[docType]</g2:no_escape>
    <g:evaluate object="true">
      var session = gs.getSession();
      var token = session.getSessionToken();
    </g:evaluate> 
    <script>
      window.sessionToken = "$[token]";
    </script>
    ${html.substring(headIndex)}`;
}

/**
 * Removes root HTML tags from the given input
 */
function removeHtmlTags(html) {
  return html.replace(/(<html>)|(<html.+>)/, "").replace("</html>", "");
}

/**
 * Removes meta tags from the given input
 * For example, this entire tag will be removed
 * <meta charset="utf-8">
 */
function removeMetaTags(html) {
  const metaTags = findMatches(html, metaTagRegEx, 3);
  metaTags.forEach((metaTag) => (html = html.replace(metaTag, "")));
  return html;
}

/**
 * Removes double newlines from the given input
 */
function removeDoubleNewlines(html) {
  return html.replace(/\s{2,}/gm, "\n");
}

/**
 * Removes link tags from the given input
 * For example, this entire tag will be removed
 * <link href="/foo.js" rel="preload" as="script">
 */
function removeLinks(html) {
  const links = findMatches(html, linkRelRegEx, 1);
  links.forEach((link) => (html = html.replace(link, "")));
  return html;
}

/**
 * Transforms script tags in the given input
 * For example, this tag will be transformed
 * from <script src="/js/foo.js"></script>
 * to <script src="/some/new/path/foo.js"></script>
 */
function transformScripts(html) {
  const scriptTags = findMatches(html, scriptTagRegEx, 2);
  scriptTags.forEach(
    (scriptTag) =>
    (html = html.replace(
      scriptTag,
      scriptTag.replace("/js/", servicenowConfig.JS_API_PATH)
    ))
  );
  findMatches(html, scriptTagRegEx, 2);
  return html;
}

/**
 * Wraps the given input in j:jelly tags
 */
function injectJellyWrappers(html) {
  return `<j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide" xmlns:j2="null" xmlns:g2="null">${html}</j:jelly>`;
}

/**
 * Performs targeted transformations on the specified file
 */
function decorateIndexHTML(filePath) {
  assert.ok(filePath);
  let fileContent = fs.readFileSync(filePath, fileEncoding);
  fileContent = removeDocType(fileContent);
  fileContent = injectJellyDoctype(fileContent);
  fileContent = removeHtmlTags(fileContent);
  fileContent = removeMetaTags(fileContent);
  fileContent = removeDoubleNewlines(fileContent);
  fileContent = removeLinks(fileContent);
  fileContent = transformScripts(fileContent);
  fileContent = injectJellyWrappers(fileContent);
  fs.writeFileSync(filePath, fileContent, fileEncoding);
}

/**
 * Replaces all roboto font paths with ASSETS api path
 * Replaces all image paths with IMG api path 
 * * @param {*} fileContent 
 * @returns string
 */
function resolveRobotoFontsAndImagePaths(fileContent){

    // roboto fonts
    const robotoMatches = findMatches(fileContent, robotoFontsRegex, 18);
    if (robotoMatches) {
      const newFontPath = `${servicenowConfig.ASSETS_API_PATH}roboto-`;
      fileContent = fileContent.replace(robotoFontsRegex, newFontPath);
    }
  
    // image paths
    const imageMatches = findMatches(fileContent, imgRegex, 12);
    if (imageMatches) {
      const newImagePath = servicenowConfig.IMG_API_PATH;
      fileContent = fileContent.replace(imgRegex, newImagePath);
    }

    return fileContent;
}

/**
 * Updates js files with the modified filenames of resources
 */
function updateResourceNames(directory, beginningPattern) {
  const dir = fs.readdirSync(directory);
  const filename = dir.find((file) => file.startsWith(beginningPattern));
  const filePath = path.join(directory, filename);
  let fileContent = fs.readFileSync(filePath, fileEncoding);
  Object.keys(fileMapping).forEach((key) => {
    // Appending \" to the comparison to account for *woff.html and *woff2.html files both existing
    fileContent = fileContent.replaceAll(key + "\"",fileMapping[key].substring(0,fileMapping[key].lastIndexOf(".html")) + "\"");    
    fileContent = fileContent.replaceAll(key + "'",fileMapping[key].substring(0,fileMapping[key].lastIndexOf(".html")) + "'");    
  });

  fs.writeFileSync(filePath, fileContent, fileEncoding);
}

/**
 * Updates the contents app js file
 */
function updateAppAssetsPaths(directory) {
  const dir = fs.readdirSync(directory);
  const filename = dir.find((file) => file.startsWith("app-"));
  const filePath = path.join(directory, filename);
  assert.ok(filePath);
  let fileContent = fs.readFileSync(filePath, fileEncoding);
  fileContent = resolveRobotoFontsAndImagePaths(fileContent);

  fs.writeFileSync(filePath, fileContent, fileEncoding);
}

/**
 * Updates the contents of a single file in the specified directory.
 * The filename must start with the specified filter.
 * Replaces all material icons paths with ASSETS api path
 */
function updateAssetPaths(directory, filenameFilter) {
  const dir = fs.readdirSync(directory);
  const filename = dir.find((file) => file.startsWith(filenameFilter));
  const filePath = path.join(directory, filename);
  assert.ok(filePath);
  let fileContent = fs.readFileSync(filePath, fileEncoding);

  // material icons
  findMatches(fileContent, materialIconsRegEx, 4);
  const newIconPath = `${servicenowConfig.ASSETS_API_PATH}materialdesignicons-`;
  fileContent = fileContent.replace(materialIconsRegEx, newIconPath);
  // Commented out because the vendor-js.html file contains no references to 
  // roboto fonts or images.
  // fileContent = resolveRobotoFontsAndImagePaths(fileContent);

  fs.writeFileSync(filePath, fileContent, fileEncoding);

}

/**
 * Renames all files in the specified directory by appending an extension
 */
function renameFiles(directory, extensionToAppend) {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    //ignore template (.docx) files
    if (file.toLowerCase().indexOf(".docx")===-1) {
      try {
        const oldFilePath = path.join(directory, file);
        const newFilename = file.replace(/\.([^\.]*)$/, '-' + '$1') + ourFakeExtension;
        const newFilePath = path.join(directory,newFilename);
        // Add old filename and new filename to a key/value pair.  
        fileMapping[file] = file.replace(/\.([^\.]*)$/, '-' + '$1') + ourFakeExtension;
        fs.renameSync(oldFilePath, newFilePath);
      } catch (err) {
        console.error(err);
      }
    }
  });
}


/**
 * Checks for expected output files and displays messages
 */
function outputResults() {
  const jsDir = fs.readdirSync(JS_DIR);
  assert.ok(jsDir);
  const appFile = jsDir.find((file) => file.includes("app"));
  assert.ok(appFile);
  const imgDir = fs.readdirSync(IMG_DIR);
  assert.ok(imgDir);
  const assetsDir = fs.readdirSync(ASSETS_DIR);
  assert.ok(assetsDir);
  console.log(
    `The build in the ${DIST_DIR} directory is ready for deployment in ServiceNow.`
  );
}
