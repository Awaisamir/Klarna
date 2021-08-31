function getReleaseDir(release) {
  const releaseConfigUtils = require('./release-config-utils');
  return releaseConfigUtils.getReleaseDir(release);
}

function getDirectories(path) {
  const fs = require('fs');
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}

function getReleases() {
  const releaseConfigUtils = require('./release-config-utils');
  const path = require('path');
  return releaseConfigUtils.getReleases();
}


function findSettingsTranslationsFiles() {
  const path = require('path');
  const files = [];
  const releases = getReleases();
  releases.forEach((release) => {
    files.push(path.join(getReleaseDir(release), 'before_theming', 'src', 'settings', 'settings-translations-en_GB.json'));
    files.push(path.join(getReleaseDir(release), 'before_theming', 'src', 'settings', 'settings-translations-es_ES.json'));
    files.push(path.join(getReleaseDir(release), 'before_theming', 'src', 'settings', 'settings-translations-overrides-en_GB.json'));
    files.push(path.join(getReleaseDir(release), 'before_theming', 'src', 'settings', 'settings-translations-overrides-es_ES.json'));
  });
  return files;
}

function findSettingsFiles() {
  const path = require('path');
  const files = [];
  const releases = getReleases();
  releases.forEach((release) => {
    files.push(path.join(getReleaseDir(release), 'before_theming', 'src', 'settings', 'settings.json'));
    files.push(path.join(getReleaseDir(release), 'before_theming', 'src', 'settings', 'settings-overrides.json'));
  });
  return files;
}

function findTrainingModeFiles() {
  const path = require('path');
  let files = [];
  const releases = getReleases();
  releases.forEach((release) => {
    const trainingModeDir = path.join(getReleaseDir(release), 'before_theming', 'src', 'assets', 'config', 'trainingmode');
    files = files.concat(getJsonFilesInDir(trainingModeDir));
    const themes = getThemes(release);
    themes.forEach((themeFullPath) => {
      const themeDir = path.join(themeFullPath, 'config', 'trainingmode');
      files = files.concat(getJsonFilesInDir(themeDir));
    });
  });
  return files;
}

function getJsonFilesInDir(baseDir) {
  const path = require('path');
  const files = [];
  const fs = require('fs');
  if (fs.existsSync(baseDir)) {
    fs.readdirSync(baseDir).forEach(file => {
      files.push(path.join(baseDir, file));
    });
  }
  return files;
}

function findReleaseConfigFiles() {
  const path = require('path');
  const files = [];
  const releases = getReleases();
  releases.forEach((release) => {
    if (release !== 'common') {
      files.push(path.join(getReleaseDir(release), 'releaseConfig.json'));
    }
  });
  return files;
}

function findFlowFiles() {
  const path = require('path');
  const files = [];
  const releases = getReleases();
  releases.forEach((release) => {
    files.push(path.join(getReleaseDir(release), 'before_theming', 'src', 'assets', 'config', 'flow', 'quickBuyFlow.json'));
    files.push(path.join(getReleaseDir(release), 'before_theming', 'src', 'assets', 'config', 'flow', 'customerAssistFlow.json'));
    files.push(path.join(getReleaseDir(release), 'before_theming', 'src', 'assets', 'config', 'flow', 'plccLookupFlow.json'));
  });
  return files;
}

function findRetailLayoutFiles() {
  const path = require('path');
  const files = [];
  const releases = getReleases();
  releases.forEach((release) => {
    files.push(path.join(getReleaseDir(release), 'before_theming', 'src', 'assets', 'config', 'layout', 'retailLayout.json'));
    const themes = getThemes(release);
    themes.forEach((themeFullPath) => {
      files.push(path.join(themeFullPath, 'config', 'layout', 'retailLayout.json'));
    });
  });
  return files;
}

function findThemeSettingsFiles() {
  const path = require('path');
  const files = [];
  const releases = getReleases();
  releases.forEach((release) => {
    const themes = getThemes(release);
    themes.forEach((themeFullPath) => {
      files.push(path.join(themeFullPath, 'theming', 'theme-settings.json'));
    });
  });
  return files;
}

function validateDeveloperSettings() {
  const path = require('path');
  const schemaFile = path.join(getReleaseDir('common'), 'before_theming', 'src', 'assets', 'config', 'settings', 'developerSettingsSchema.json');
  const files = findDeveloperSettingsFiles();
  files.forEach((file) => {
    validateFileAgainstSchema(schemaFile, file);
  });
}

function validateSettings() {
  const schemaData = getSettingsSchemaData();
  const files = findSettingsFiles();
  files.forEach((file) => {
    validateFileAgainstSchemaData(schemaData, file);
  });
}

function validateSettingsTranslations() {
  const path = require('path');
  const schemaFile = path.join(getReleaseDir('common'), 'before_theming', 'src', 'settings', 'settings-translations-schema.json');
  const files = findSettingsTranslationsFiles();
  files.forEach((file) => {
    validateFileAgainstSchema(schemaFile, file);
  });
}

function validateTrainingMode() {
  const path = require('path');
  const schemaFile = path.join(getReleaseDir('common'), 'before_theming', 'src', 'assets', 'config', 'trainingmode', 'trainingModeSchema.json');
  const files = findTrainingModeFiles();
  files.forEach((file) => {
    validateFileAgainstSchema(schemaFile, file);
  });
}

function validateReleaseConfigs() {
  const path = require('path');
  const schemaFile = path.join(getReleaseDir('common'), 'releaseConfigSchema.json');
  const files = findReleaseConfigFiles();
  files.forEach((file) => {
    validateFileAgainstSchema(schemaFile, file);
  });
}

function validateThemeSettings() {
  const path = require('path');
  const schemaFile = path.join(getReleaseDir('common'), 'before_theming', 'src', 'assets', 'theme', 'themeSettingsSchema.json');
  const files = findThemeSettingsFiles();
  files.forEach((file) => {
    validateFileAgainstSchema(schemaFile, file);
  });
}

function validateFlows(){
  const path = require('path');
  const schemaFile = path.join(getReleaseDir('common'), 'before_theming', 'src', 'assets', 'config', 'flow', 'flowSchema.json');
  const files = findFlowFiles();
  files.forEach((file) => {
    validateFileAgainstSchema(schemaFile, file);
  });
}

function validateRetailLayout(){
  const files = findRetailLayoutFiles();
  const schemaData = getRetailLayoutSchemaData();
  files.forEach((file) => {
    validateFileAgainstSchemaData(schemaData, file);
  });
}

function getSettingsSchemaData() {
  const path = require('path');
  const fs = require('fs');
  const schemaFile = path.join(getReleaseDir('common'), 'before_theming', 'src', 'settings', 'settings-schema.json');
  const schemaFileExtensions = path.join(getReleaseDir(process.env.RELEASE_NAME), 'before_theming', 'src', 'settings', 'settings-schema-extensions.json');
  let config = null;
  if (fs.existsSync(schemaFileExtensions)) {
    const lodash = require('lodash');
    const schemaData = require(schemaFile);
    const extensionsData = require(schemaFileExtensions);
    const settingsKeyEnum = schemaData.definitions.settingKey.enum.concat(extensionsData.definitions.settingKey.enum);
    const groupKeyEnum = schemaData.definitions.groupKey.enum.concat(extensionsData.definitions.groupKey.enum);
    config = lodash.merge(schemaData, extensionsData);
    config.definitions.settingKey.enum = settingsKeyEnum;
    config.definitions.groupKey.enum = groupKeyEnum;
  } else {
    config = require(schemaFile);
  }
  return config;
}

function getRetailLayoutSchemaData() {
  const path = require('path');
  const fs = require('fs');
  const schemaFile = path.join(getReleaseDir('common'), 'before_theming', 'src', 'assets', 'config', 'layout', 'retailLayoutSchema.json');
  const schemaFileExtensions = path.join(getReleaseDir(process.env.RELEASE_NAME), 'before_theming', 'src', 'assets', 'config', 'layout', 'retailLayoutSchemaExtensions.json');
  let config = null;
  if (fs.existsSync(schemaFileExtensions)) {
    const lodash = require('lodash');
    const schemaData = require(schemaFile);
    const extensionsData = require(schemaFileExtensions);
    const buttonsEnum = schemaData.definitions.buttonId.enum.concat(extensionsData.definitions.buttonId.enum);
    config = lodash.merge(schemaData, extensionsData);
    config.definitions.buttonId.enum = buttonsEnum;
  } else {
    config = require(schemaFile);
  }
  return config;
}

function validateFileAgainstSchemaData(schema, sourceFile) {
  const fs = require('fs');
  if (!fs.existsSync(sourceFile)) {
    return;
  }

  const json = require(sourceFile);
  var Validator = require('jsonschema').Validator;
  var v = new Validator();
  try {
    const response = v.validate(json, schema);
    if (response.errors && response.errors.length > 0) {
      console.log("\nERROR: Validation Errors for " + sourceFile + " against merged schema");
      console.log(response);
      process.exit(1);
    }
  } catch (err) {
    console.error('\nERROR: Failed to validate ' + sourceFile + ' against merged schema ' + err);
    process.exit(1);
  }
}

function validateFileAgainstSchema(schemaFile, sourceFile) {
  const fs = require('fs');
  if (!fs.existsSync(sourceFile)) {
    return;
  }

  const json = require(sourceFile);
  const schema = require(schemaFile);
  var Validator = require('jsonschema').Validator;
  var v = new Validator();
  try {
    const response = v.validate(json, schema);
    if (response.errors && response.errors.length > 0) {
      console.log("\nERROR: Validation Errors for " + sourceFile + " against " + schemaFile);
      console.log(response);
      process.exit(1);
    }
  } catch (err) {
    console.error('\nERROR: Failed to validate ' + sourceFile + ' against schema ' + schemaFile + err);
    process.exit(1);
  }
}

console.log("Starting validating configuration files against their schemas...");
validateReleaseConfigs();
validateFlows();
validateRetailLayout();
validateThemeSettings();
validateDeveloperSettings();
validateTrainingMode();
validateSettings();
validateSettingsTranslations();
console.log("Finished validating configuration files against their schemas.");
