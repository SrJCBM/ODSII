@echo off
echo ======================================
echo PLOS Articles Search - Installation
echo ======================================
echo.

REM Install Backend
echo Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Backend installation failed
    exit /b %errorlevel%
)
echo Backend dependencies installed successfully
cd ..

echo.

REM Install Frontend
echo Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Frontend installation failed
    exit /b %errorlevel%
)
echo Frontend dependencies installed successfully
cd ..

echo.
echo ======================================
echo Installation Complete!
echo ======================================
echo.
echo To run the application:
echo.
echo 1. Start Backend:
echo    cd backend
echo    npm start
echo.
echo 2. Start Frontend (in new terminal):
echo    cd frontend
echo    npm start
echo.
echo 3. Open browser at: http://localhost:4200
echo.
pause
