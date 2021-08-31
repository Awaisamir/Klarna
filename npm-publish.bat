set WORKING_DIRECTORY=%cd%
call setEnv.bat
call %TOOLS_ROOT%\NodeModulesManager\npm-publish.bat %WORKING_DIRECTORY%
