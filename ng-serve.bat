call setEnv.bat npm
IF '%ERRORLEVEL%'=='0' GOTO SERVE
exit /b 1

:SERVE
npm run-script start
