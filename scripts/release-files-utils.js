function copyReleaseEnvironmentFiles(release, environmentName, hookName){
  try {
    var fs = require('fs-extra')

    const releaseConfigUtils = require('./release-config-utils');
    var sourceDir = releaseConfigUtils.getReleaseDir(release) + "/environments/" + environmentName + "/" + hookName;
    if (fs.existsSync(sourceDir)){
      fs.copySync(sourceDir, process.cwd())
      console.log("Copied environment specific files " + sourceDir);
    }
  } catch (err) {
    console.error("Failed to copy environmentName files:" + err);
    throw err;
  }
}

function copyReleaseDirExcludingDifferentPlatforms(sourceDir){
  var fs = require('fs-extra');
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

function copyReleaseFiles(release, hookName){
  try {
    var fs = require('fs-extra');
    const releaseConfigUtils = require('./release-config-utils');
    var sourceDir = releaseConfigUtils.getReleaseDir(release) + "/" + hookName;
    if (fs.existsSync(sourceDir)){
      copyReleaseDirExcludingDifferentPlatforms(sourceDir);
    }
  } catch (err) {
    console.error(err)
  }
}

function findReleaseName() {
  var releaseName = process.env.RELEASE_NAME;

  if (!releaseName){
    console.log("RELEASE_NAME not specified, default to product");
    releaseName = "product";
  }

  return releaseName;
}

exports.getReleaseName = function () {
  return findReleaseName();
};

exports.copyFilesForHook = function (hookName) {
  console.log("Copying files for hook:" + hookName);
  var releaseName = findReleaseName();

  copyReleaseFiles("common", hookName);
  copyReleaseFiles(releaseName, hookName);

  const environmentName = process.env.ENVIRONMENT_NAME;

  if (!environmentName){
    console.log("ENVIRONMENT_NAME not specified, skipping");
  }
  else{
    copyReleaseEnvironmentFiles(releaseName, environmentName, hookName);
  }
};
