@echo off

if "%~1"=="" goto INVALID_ARG

call setEnv.bat npm

if not exist .\e2e\results mkdir .\e2e\results

tsc --skipLibCheck --project e2e && protractor conf.js --suite %1
goto END

:INVALID_ARG
echo Suite name is missing in argument. See exports.config.suites in conf.js for possible suites.
goto END:

:END
