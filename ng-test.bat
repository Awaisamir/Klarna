call setEnv.bat %1
IF '%ERRORLEVEL%'=='0' GOTO TEST
exit /b 1

:TEST
ng test
goto END:

:END
