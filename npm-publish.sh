#!/bin/sh
WORKING_DIRECTORY=$(pwd)
source ./setEnv.sh
source ./ng-build.sh
$TOOLS_ROOT/NodeModulesManager/npm-publish.sh $WORKING_DIRECTORY
