exports.getReleaseConfig = function (releaseName) {
  const lodash = require('lodash');
  const commonJSON = getReleaseConfigFile('common');
  const releaseJSON = getReleaseConfigFile(releaseName);
  const config = lodash.merge(commonJSON, releaseJSON);
  return config;
};

exports.isValidatedRelease = function (releaseName) {
  const lodash = require('lodash');
  const commonJSON = getReleaseConfigFile('common');
  const releaseJSON = getReleaseConfigFile(this.getReleaseName());
  const config = lodash.merge(commonJSON, releaseJSON);
  if (releaseJSON.config.validatedReleases && releaseName !== 'product') {
    config.config.validatedReleases = releaseJSON.config.validatedReleases;
  }

  const match = config.config.validatedReleases.find((release) => {
    return release.name === releaseName;
  });
  return match ? true : false;
};

function getReleaseConfigFile(releaseName) {
  const releaseConfigFilename = getReleaseDirInternal(releaseName) + "/releaseConfig.json";
  let environmentReleaseConfigFilename = getReleaseDirInternal(releaseName) + "/environments/" + process.env.ENVIRONMENT_NAME + "/releaseConfig.json";
  const fs = require('fs');
  let environmentFileExists = fs.existsSync(environmentReleaseConfigFilename);
  let filename = environmentFileExists ? environmentReleaseConfigFilename : releaseConfigFilename;
  return getFileAsJSON(filename);
};

exports.getCurrentReleaseConfigFile = function () {
  return this.getReleaseConfig(this.getReleaseName());
};

exports.getReleaseName = function () {
  let releaseName = process.env.RELEASE_NAME;
  if (!releaseName){
    releaseName = "product";
  }
  return releaseName;
};

function getDirectories(path) {
  const fs = require('fs');
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}

exports.getReleases = function () {
  const path = require('path');
  const releasesDir = path.join(getRootDir(), 'releases');
  let dirs = getDirectories(releasesDir);

  if (isRunningInJenkins()) {
    dirs = dirs.filter((dir) => {
      return dir === 'common' || this.isValidatedRelease(dir);
    });
  } else {
    getDirectories(path.join(getRootDir(), "../")).forEach((dir) => {
      if (dir.indexOf(getReleaseConfigPrefix()) > -1) {
        if (this.isValidatedRelease(getReleaseWithoutPrefix(dir))) {
          dirs.push(getReleaseWithoutPrefix(dir));
        }
      }
    });
  }

  return dirs;
}

function isRunningInJenkins() {
  return process.env.BUILD_NUMBER ? true : false;
}

function getReleaseConfigPrefix() {
  return 'mpos-release-';
}

function getReleaseWithoutPrefix(release) {
  let index = release.indexOf(getReleaseConfigPrefix());
  return release.substring(index + getReleaseConfigPrefix().length);
}

exports.getCurrentReleaseDir = function() {
  let releaseName = process.env.RELEASE_NAME ? process.env.RELEASE_NAME : "product";
  return this.getReleaseDir(releaseName);
}

exports.getReleaseDir = function (releaseName) {
  return getReleaseDirInternal(releaseName);
}

function getReleaseDirInternal(releaseName) {
  const path = require('path');
  const fs = require('fs');
  let releaseDir = getRootDir() + "/releases/" + releaseName;
  if (!fs.existsSync(releaseDir)) {
    if (isReleaseDirSet()) {
      releaseDir = process.env.RELEASE_DIR;
    } else {
      releaseDir = path.join(getRootDir(), "/../", getReleaseConfigPrefix() + releaseName);
    }
  }

  const mfeDirName = "mfe/" + process.env.MFE_NAME;
  const releaseMfeDir = releaseName !== 'product' && releaseName !== 'common' ? '/' + mfeDirName : '';
  releaseDir = releaseDir + releaseMfeDir;
  return releaseDir;
}

function getFileAsJSON(filename) {
  const fs = require('fs');
  if (fs.existsSync(filename)) {
    return require(filename);
  } else {
    return null;
  }
}

function getRootDir() {
  return process.cwd();
}

function isReleaseDirSet() {
  return !!process.env.RELEASE_DIR;
}
