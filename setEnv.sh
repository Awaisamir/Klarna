#!/bin/sh
export CORDOVA_PLATFORM=$1
export SCRIPT_VERSION=1
export WORKING_DIRECTORY=$(pwd)

setEnvironmentVars() {
  export TSC_PATH=$TOOLS_ROOT/typescript/3.8.3/node_modules/.bin
  export NPM_PATH=$TOOLS_ROOT/nvm/versions/node/v10.16.0/bin
  export GRADLE_PATH=$HOME/.sdkman/candidates/gradle/4.10.3/bin
  export ANGULAR_CLI_PATH=$TOOLS_ROOT/angular-cli/9.1.9/node_modules/.bin
  export PROTRACTOR_PATH=$TOOLS_ROOT/protractor/7.0.0/node_modules/.bin
  export DEVELOPER_DIR=/Applications/xcode/11.4/Xcode.app/Contents/Developer
  export IOS_DEPLOY=$TOOLS_ROOT/ios-deploy/1.9.2/node_modules/ios-deploy/build/Release
  export NODE_OPTIONS="--max-old-space-size=4096"
}

checkPaths() {
  if [ -d "$NPM_PATH" ]
  then
    :
  else
    echo "ERROR: NPM_PATH of $NPM_PATH does not exist."
    exit 1;
  fi
}

if [ "$TOOLS_ROOT" = "" ]
then
  echo "WARNING. TOOLS_ROOT not set, using global ionic and cordova, which may not be correct."
else
  setEnvironmentVars
  checkPaths
  export PATH=$NPM_PATH:$PATH:$TSC_PATH:$IOS_DEPLOY:$PROTRACTOR_PATH:$ANGULAR_CLI_PATH
fi

node $TOOLS_ROOT/NodeModulesManager/get-latest-version.js $WORKING_DIRECTORY $SCRIPT_VERSION
$TOOLS_ROOT/NodeModulesManager/installDevTooling.sh $WORKING_DIRECTORY/tooling.json $SCRIPT_VERSION

call npm install

npm install
