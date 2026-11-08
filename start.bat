@echo off
setlocal
title QuickCalc Server
cd /d "%~dp0"

set "URL=http://127.0.0.1:5000"
set "VENV_PY=.venv\Scripts\python.exe"

echo.
echo  ===============================
echo     QuickCalc - starting...
echo  ===============================
echo.

if exist "%VENV_PY%" goto deps

rem --- Find Python: prefer the py launcher, then python on PATH ---
set "PY="
py -3 --version >nul 2>&1 && set "PY=py -3"
if not defined PY python --version >nul 2>&1 && set "PY=python"
if not defined PY goto nopython

echo [1/3] Creating virtual environment...
%PY% -m venv .venv
if errorlevel 1 goto fail

:deps
echo [2/3] Installing requirements...
"%VENV_PY%" -m pip install --disable-pip-version-check -q -r requirements.txt
if errorlevel 1 goto fail

echo [3/3] Starting server at %URL%
echo        Browser will open automatically. Close this window to stop the server.
echo.

rem --- Open the browser once the server answers ---
start "" /b powershell -NoProfile -ExecutionPolicy Bypass -Command "for($i=0;$i -lt 60;$i++){try{Invoke-WebRequest '%URL%' -UseBasicParsing -TimeoutSec 1 | Out-Null; Start-Process '%URL%'; break}catch{Start-Sleep -Milliseconds 500}}"

"%VENV_PY%" app.py
echo.
echo Server stopped.
pause
exit /b 0

:nopython
echo ERROR: Python 3 was not found.
echo Install it from https://www.python.org/downloads/ and check "Add python.exe to PATH".
pause
exit /b 1

:fail
echo.
echo ERROR: Setup failed. See the messages above.
pause
exit /b 1
