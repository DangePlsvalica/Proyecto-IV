@echo off
set "RUTA_PROYECTO=C:\Users\Admin\Documents\Trabajo\Proyecto-IV"

echo.
echo Cambiando al directorio del proyecto: %RUTA_PROYECTO%
REM El comando /d permite cambiar de disco si fuera necesario
cd /d "%RUTA_PROYECTO%"

echo ==========================================================
echo Iniciando el servidor Next.js con npm run dev...
echo ==========================================================

REM Lanza "npm run dev" en un proceso hijo en segundo plano
start "Next.js Server" cmd /c "npm run dev"

echo.
echo Esperando 5 segundos para que el servidor arranque...
REM Pausa para dar tiempo a Next.js a compilar y levantar el servidor
timeout /t 5 /nobreak > nul

echo.
echo Abriendo http://localhost:3000 en el navegador.
REM Abre la URL en el navegador por defecto
start "" "http://localhost:3000"

echo.
echo Script finalizado. Revisa la ventana "Next.js Server" para los logs.
REM La ventana actual se cierra.
exit