         d   c       >��������9�~�y߲���l�W��Vē            ucall setEnv.bat npm
IF '%ERRORLEVEL%'=='0' GOTO SERVE
exit /b 1

:SERVE
npm run-script start
     d     +   �       i    �������KA�fAV ,���"�gg               M   M   node updateAppModule.js serve
     �     -   �      l   ���������:�#�>����E^�l��               M   l   !node generateAppModule.js serve
     �     d   c      m   ����C�K"AۜG%i9q`�S�            ucall setEnv.bat npm
IF '%ERRORLEVEL%'=='0' GOTO SERVE
exit /b 1

:SERVE
npm run-script start
