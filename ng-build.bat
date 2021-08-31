call setEnv.bat %1
IF '%ERRORLEVEL%'=='0' GOTO BUILD
exit /b 1

:BUILD
npm run build:component
goto END:

:END
