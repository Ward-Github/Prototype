@echo off
cd "C:\Users\Ward\Desktop\School\Project - D\Prototype"

REM Start the client
start "Client" cmd /k "cd client & bun expo start"

REM Start the server
start "Server" cmd /k "cd server & bun server.mjs --hot mode"

echo Both the client and server are starting...
