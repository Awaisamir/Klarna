source ./setEnv.sh npm
source $TOOLS_ROOT/NodeModulesManager/installE2eTooling.sh $WORKING_DIRECTORY/tooling.json $SCRIPT_VERSION

if [ "$1" = "" ]
then
  echo ERROR - Missing suite name
else
  tsc --skipLibCheck --project e2e && protractor conf.js --suite $1
fi
