@echo off
echo ======================================
echo   SkillMate Job Portal - Full Stack
echo ======================================
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d c:\Users\findy\Downloads\ONLINE-JOB-PORTAL\backend && python main.py"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d c:\Users\findy\Downloads\ONLINE-JOB-PORTAL\frontend && npm start"

echo.
echo ======================================
echo Both servers are starting!
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo ======================================
echo.
echo Press any key to exit...
pause > nul