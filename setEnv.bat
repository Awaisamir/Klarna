@echo off
set WORKING_DIRECTORY=%cd%
set SCRIPT_VERSION=1

IF "%TOOLS_ROOT%" == "" GOTO toolsRootNotSet
IF "%PATHS_SET%" == "" GOTO pathCanBeSet
GOTO pathAlreadySet

:pathCanBeSet
set TSC_PATH=%TOOLS_ROOT%\typescript\3.8.3\node_modules\.bin
set ANGULAR_CLI_PATH=%TOOLS_ROOT%\angular-cli\9.1.9\node_modules\.bin
set PROTRACTOR_PATH=%TOOLS_ROOT%\protractor\7.0.0\node_modules\.bin
set NPM_PATH=%TOOLS_ROOT%\nvm\v14.15.0

IF NOT EXIST "%NPM_PATH%" (
  echo ERROR %NPM_PATH% path does not exist
)

set "PATH=%NPM_PATH%;%PATH%;%TSC_PATH%;%PROTRACTOR_PATH%;%ANGULAR_CLI_PATH%"
set PATHS_SET="true"
GOTO End

:pathAlreadySet
GOTO End

:toolsRootNotSet
echo "ERROR. TOOLS_ROOT not set."
GOTO End

:pathInvalid
exit /b 1

:End

IF NOT EXIST "%ANGULAR_CLI_PATH%" (
  echo ERROR %ANGULAR_CLI_PATH% path does not exist
  goto pathInvalid;
)

IF NOT EXIST "%TOOLS_ROOT%\NodeModulesManager\get-latest-version.js" (
  echo "ERROR: %TOOLS_ROOT%\NodeModulesManager does not exist. Clone NodeModulesManager to %TOOLS_ROOT%\NodeModulesManager"
  exit /b 1;
)

node %TOOLS_ROOT%\NodeModulesManager\get-latest-version.js %WORKING_DIRECTORY% %SCRIPT_VERSION%

call %TOOLS_ROOT%\NodeModulesManager\installDevTooling.bat %WORKING_DIRECTORY%\tooling.json %SCRIPT_VERSION%

call npm install

exit /b 0
