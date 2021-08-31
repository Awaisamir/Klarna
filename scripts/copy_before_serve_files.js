#!/usr/bin/env node
const releaseFilesUtils = require('./release-files-utils');
releaseFilesUtils.copyFilesForHook('before_serve');
