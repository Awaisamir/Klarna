#!/usr/bin/env node

function copyReleaseFiles(release){
  try {
    const releaseConfigUtils = require('./release-config-utils');
    var sourceDir = releaseConfigUtils.getReleaseDir(release) + "/before_theming";
    copyReleaseDirExcludingDifferentPlatforms(sourceDir);

    console.log("Copied release files " + sourceDir + " to " + process.cwd());
  } catch (err) {
    console.error("Failed to copy release files:" + err);
    throw err;
  }
}

function copyReleaseDirExcludingDifferentPlatforms(sourceDir){
  var fs = require('fs-extra')
  const filterFunc = (src, dest) => {
    let pathsToExclude = ["platforms/ios", 'platforms/android', 'platforms/windows'];
    const platformName = 'platforms/' + process.env.CORDOVA_PLATFORM;
    if (platformName){
      pathsToExclude = pathsToExclude.filter(function(value, index, arr){
        return value !== platformName;
      });
    }

    let path = src.split('\\').join('/');
    let matched = pathsToExclude.find((value) => {
      return path.endsWith(value);
    });
    if (matched){
      console.log("Skipping copying of dir:" + path);
    }

    return matched ? false : true;
  }

  fs.copySync(sourceDir, process.cwd(), { filter: filterFunc });
}

function copyReleaseEnvironmentFiles(release, environmentName){
  try {
    var sourceDir = getEnvironmentBeforeThemingDir(release, environmentName);
    const fs = require('fs');
    if (fs.existsSync(sourceDir)){
      copyReleaseDirExcludingDifferentPlatforms(sourceDir);
      console.log("Copied environment specific files " + sourceDir);
    }
  } catch (err) {
    console.error("Failed to copy environmentName files:" + err);
    throw err;
  }
}

function getEnvironmentBeforeThemingDir(release, environment) {
  const releaseConfigUtils = require('./release-config-utils');
  return releaseConfigUtils.getReleaseDir(release) + "/environments/" + environment + "/before_theming";
}

function rmdir(dir) {
  const fs = require('fs');
  const path = require('path');
  if (fs.existsSync(dir)) {
    var list = fs.readdirSync(dir);
    for(var i = 0; i < list.length; i++) {
      const filename = path.join(dir, list[i]);
      var stat = fs.statSync(filename);
      if(filename == "." || filename == "..") {
      } else if(stat.isDirectory()) {
        rmdir(filename);
      } else {
        fs.unlinkSync(filename);
      }
    }
    fs.rmdirSync(dir);
  }
}

function rmFile(file) {
  const fs = require('fs');
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}

function getFileAsJSON(filename) {
  const fs = require('fs');
  if (fs.existsSync(filename)) {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
  } else {
    return null;
  }
}

function getRootDir() {
  return process.cwd();
}

function getReleaseConfigFile(releaseName){
  const releaseConfigUtils = require('./release-config-utils');
  const releaseConfigFilename = releaseConfigUtils.getReleaseDir(releaseName) + "/releaseConfig.json";
  let environmentReleaseConfigFilename = releaseConfigUtils.getReleaseDir(releaseName) + "/environments/" + process.env.ENVIRONMENT_NAME + "/releaseConfig.json";
  const fs = require('fs');
  let environmentFileExists = fs.existsSync(environmentReleaseConfigFilename);
  let filename = environmentFileExists ? environmentReleaseConfigFilename : releaseConfigFilename;
  return getFileAsJSON(filename);
}

function copyFilesFromReleaseConfig(releaseName){
  const fs = require('fs');
  const config = getReleaseConfigFile(releaseName);
  const releaseFilesToCopy = config.releaseFilesToCopy;
  if (releaseFilesToCopy) {
    releaseFilesToCopy.forEach(function(releaseFileToCopy){
      const destPath = require("path").dirname(releaseFileToCopy.to);
      if (!fs.existsSync(destPath)){
        fs.mkdirSync(destPath);
      }
      fs.createReadStream(releaseFileToCopy.from).pipe(fs.createWriteStream(releaseFileToCopy.to));
      console.log("Copied " + releaseFileToCopy.from + " to " + releaseFileToCopy.to);
    });
  }
}

function extend(target) {
  let sources = [].slice.call(arguments, 1);
  sources.forEach(function (source) {
    for (var prop in source) {
      target[prop] = source[prop];
    }
  });
  return target;
}

function mergeFilesFromReleaseConfig(releaseName, environmentName){
  const fs = require('fs');
  const config = getReleaseConfigFile(releaseName);
  let releaseFilesToMerge = null;
  const environmentDir = getEnvironmentBeforeThemingDir(releaseName, environmentName);
  if (environmentName && fs.existsSync(environmentDir) && config.environments[environmentName]){
    releaseFilesToMerge = config.environments[environmentName].releaseFilesToMerge;
  }
  else{
    releaseFilesToMerge = config.releaseFilesToMerge;
  }

  if (releaseFilesToMerge) {
    releaseFilesToMerge.forEach(function(releaseFileToMerge){
      const allFromFiles = findFilesToMerge(releaseFileToMerge);
      let mergedData = null;
      for (let i = 0; i < allFromFiles.length; i++){
        let data1 = getFileAsJSON(allFromFiles[i]);
        if (mergedData){
          data1 = mergedData;
        }
        let data2 = getFileAsJSON(allFromFiles[i+1]);
        if (data2){
          mergedData = extend({}, data1, data2);
        }
      }
      if (mergedData){
        saveFile(releaseFileToMerge.to, mergedData);
        mergedData = null;
        console.log("Created merged file to " + releaseFileToMerge.to);
      }
    });
  }
}

function findFilesToMerge(releaseFileToMerge) {
  let allFiles = [];
  const glob = require("glob");
  releaseFileToMerge.from.forEach(function(file){
    const ignore = releaseFileToMerge.ignore ?  releaseFileToMerge.ignore : ['**/defaultTrainingModeData.json', '**/flow.json', '**/*Schema.json'];
    const filenames = glob.sync(file,{ "ignore": ignore});
    allFiles = allFiles.concat(filenames);
  });

  return allFiles;
}

function saveFile(filename, json) {
  const fs = require('fs');
  const path = require('path');
  const destPath = path.dirname(filename);
  if (!fs.existsSync(destPath)){
    fs.mkdirSync(destPath);
  }
  fs.writeFileSync(filename, JSON.stringify(json, null, 2), 'utf8');
}

rmFile(process.cwd() + "/app-settings.json");
rmdir(process.cwd() + "/assets/config");
rmdir(process.cwd() + "/assets/images");
rmdir(process.cwd() + "/assets/theme");

const releaseFilesUtils = require('./release-files-utils');
const releaseName = releaseFilesUtils.getReleaseName();
releaseFilesUtils.copyFilesForHook('before_theming');

copyFilesFromReleaseConfig(releaseName);

const environmentName = process.env.ENVIRONMENT_NAME;

if (!environmentName){
  console.log("ENVIRONMENT_NAME not specified, skipping");
}
else{
  copyReleaseEnvironmentFiles(releaseName, environmentName);
}

console.log("copy before theming");
mergeFilesFromReleaseConfig(releaseName, environmentName);
