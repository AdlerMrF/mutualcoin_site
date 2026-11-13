@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules call npm install
echo Abrindo o site atual. Mantenha esta janela aberta durante a visualizacao.
call npm run dev -- --open /lp-app/
if errorlevel 1 pause
endlocal
