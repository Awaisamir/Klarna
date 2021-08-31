/*
 * Copyright (c) Flooid Limited 2021. All rights reserved.
 * This source code is confidential to and the copyright of Flooid Limited ("Flooid"), and must not be
 * (i) copied, shared, reproduced in whole or in part; or
 * (ii) used for any purpose other than the purpose for which it has expressly been provided by Flooid under the terms of a license agreement; or
 * (iii) given or communicated to any third party without the prior written consent of Flooid.
 * Flooid at all times reserves the right to modify the delivery and capabilities of its products and/or services.
 * "Flooid", "FlooidCore", "FlooidCommerce", "Flooid Hub", "PCMS", "Vision", "VISION Commerce Suite", "VISION OnDemand", "VISION eCommerce",
 * "VISION Engaged", "DATAFIT", "PCMS DATAFIT" and "BeanStore" are registered trademarks of Flooid.
 * All other brands and logos (that are not registered and/or unregistered trademarks of Flooid) are registered and/or
 * unregistered trademarks of their respective holders and should be treated as such.
 */
var jasmineReporters = require('karma-jasmine-html-reporter');
const fs = require('fs');
exports.config = {
  directConnect: true,
  specs: ['out-tsc/app/**/*spec.js'],
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine2',
  suites: {
    all: ['out-tsc/app/**/*spec.js']
  },
  onPrepare: function() {
    var jasmineReporters = require('jasmine-reporters');
    var junitReporter = new jasmineReporters.JUnitXmlReporter({
      savePath: 'e2e/results/',
      consolidateAll: false
    });

    var originalAddExpectationResult = jasmine.Spec.prototype.addExpectationResult;
    jasmine.Spec.prototype.addExpectationResult = function(passed, data) {
      // take screenshot
      var specDescription = this.description;
      if (!passed) {
        console.log('FAILURE:' + specDescription);
        // this.description and arguments[1].message can be useful to constructing the filename.
        browser.takeScreenshot().then(function(png) {
          var outputDir = 'e2e/results/';
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
          }

          var stream = fs.createWriteStream(outputDir + specDescription + '.png');
          stream.write(new Buffer(png, 'base64'));
          stream.end();
        });
      } else {
        console.log('SUCCESS:' + specDescription);
      }
      return originalAddExpectationResult.apply(this, arguments);
    };

    jasmine.getEnv().addReporter(junitReporter);
  },
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 1200000
  },
  // Special option for Angular2, to test against all Angular2 applications
  // on the page. This means that Protractor will wait for every app to be
  // stable before each action, and search within all apps when finding
  // elements.
  useAllAngular2AppRoots: true
};
