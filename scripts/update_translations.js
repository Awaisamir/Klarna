#!/usr/bin/env node
/**
 * This file takes the releaseConfig.json and uses it to generate translations files using a baseline file.
 * For example, with the following config: -
 *
 * {
 *   "baselineTheme": "product",
 *   "baselineLocale": "en_GB",
 *   "supportedLocales": ["es_ES"]
 * }
 *
 * It would use the 'product' en_GB translations file as a baseline, and create a Spanish translations file.
 * Each key value would have a 'es_' prefix. As this file is modified, and the prefix removed, running this file again
 * will not modify lines which exclude this prefix. However, it will add new lines from the baseline translation file.
 */

function getFileAsJSON(filename) {
  const fs = require('fs');
  if (fs.existsSync(filename)) {
    return require(filename);
  } else {
    return null;
  }
}

function getTranslationFilename(releaseName, locale) {
  const releaseConfigUtils = require('./release-config-utils');
  let filename = releaseConfigUtils.getReleaseDir(releaseName) + "/before_theming/src/assets/config/translations/" + locale + "-translations.json";
  return filename;
}

function deleteFile(file) {
  var fs = require('fs');
  fs.unlinkSync(file);
}

function copyFile(from, to) {
  var fs = require('fs');
  var contents = fs.readFileSync(from, "utf8");
  fs.writeFileSync(to, contents.toString(), "utf8");
}

function getRootDir() {
  return process.cwd();
}

function mergeTranslationsFile(foreignLocale, baselineFilename, foreignFilename, isNewFile) {
  const baseLineJSON = getFileAsJSON(baselineFilename);
  const foreignJSON = getFileAsJSON(foreignFilename);
  const foreignFilenameTmp = foreignFilename + ".tmp";
  copyFile(foreignFilename, foreignFilenameTmp);
  const foreignJSONTmp = getFileAsJSON(foreignFilename);
  console.log(`Foreign Filename is ${foreignFilename} and baseline is ${baselineFilename}`);
  for (let level1Key in baseLineJSON) {
    if (baseLineJSON.hasOwnProperty(level1Key)) {
      let level1Value = baseLineJSON[level1Key];
      for (let level2Key in level1Value) {
        if (level1Value.hasOwnProperty(level2Key)) {
          let level2Value = level1Value[level2Key];
          if (typeof level2Value === 'string') {
            if (isNewFile){
              foreignJSONTmp[level1Key][level2Key] = getLinePrefix(foreignLocale) + level2Value;
            }
            else{
              let foreignLevel2Value = foreignJSON[level1Key][level2Key];
              let level2AlreadyTranslated = isAlreadyTranslated(foreignLevel2Value, foreignLocale);
              if (level2AlreadyTranslated) {
                foreignJSONTmp[level1Key][level2Key] = foreignLevel2Value;
              }
              else if (!foreignLevel2Value){
                foreignJSONTmp[level1Key][level2Key] = getLinePrefix(foreignLocale) + level2Value;
              }
            }
          } else {
            for (let level3Key in level2Value) {
              if (level2Value.hasOwnProperty(level3Key)) {
                let level3Value = level2Value[level3Key];
                if (typeof level3Value === 'string') {
                  if (isNewFile){
                    foreignJSONTmp[level1Key][level2Key][level3Key] = getLinePrefix(foreignLocale) + level3Value;
                  }
                  else{
                    let foreignLevel3Value = foreignJSON[level1Key][level2Key][level3Key];
                    let level3AlreadyTranslated = isAlreadyTranslated(foreignLevel3Value, foreignLocale);
                    if (level3AlreadyTranslated) {
                      foreignJSONTmp[level1Key][level2Key][level3Key] = foreignLevel3Value;
                    }
                    else if (!foreignLevel3Value){
                      foreignJSONTmp[level1Key][level2Key][level3Key] = getLinePrefix(foreignLocale) + level3Value;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  saveFile(foreignFilename, foreignJSONTmp);
  deleteFile(foreignFilenameTmp);
  console.log("Merged translations file for locale:" + foreignLocale + " to " + foreignFilename);
}

function saveFile(filename, json) {
  const fs = require('fs');
  fs.writeFileSync(filename, JSON.stringify(json, null, 2), 'utf8');
}

function isAlreadyTranslated(value, locale) {
  let prefix = getLinePrefix(locale);
  return value == '' || (value && !value.startsWith(prefix));
}

function getLinePrefix(locale){
  return locale.substring(0, 3);
}

function updateTranslationsFiles(){
  let releaseName = process.env.RELEASE_NAME;
  if (!releaseName) {
    console.log("RELEASE_NAME not specified, default to product");
    releaseName = "product";
  }

  const releaseConfigUtils = require('./release-config-utils');
  const releaseConfigFilename = releaseConfigUtils.getReleaseDir(releaseName) + "/releaseConfig.json";
  const fs = require('fs');
  console.log("checking for:" + releaseConfigFilename);
  if (!fs.existsSync(releaseConfigFilename)) {
    console.log("Release config file doesn't exist. Skipping");
  }
  else{
    const releaseConfigJSON = getFileAsJSON(releaseConfigFilename);
    const baselineRelease = releaseConfigJSON['baselineTheme'];
    const baselineLocale = releaseConfigJSON['baselineLocale'];
    const baselineFilename = getTranslationFilename(baselineRelease, baselineLocale);
    const supportedLocales = releaseConfigJSON['supportedLocales'];
    if (supportedLocales){
      supportedLocales.forEach(function(supportedLocale) {
        const foreignFilename = getTranslationFilename(baselineRelease, supportedLocale);
        if (!fs.existsSync(foreignFilename)) {
          console.log(foreignFilename + " doesn't exist, creating.");
          copyFile(baselineFilename, foreignFilename);
          mergeTranslationsFile(supportedLocale, baselineFilename, foreignFilename, true);
        }
        else{
          mergeTranslationsFile(supportedLocale, baselineFilename, foreignFilename);
        }
      });
    }
  }
}

updateTranslationsFiles();
updateTranslationsFiles();
