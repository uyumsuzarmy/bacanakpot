@echo off
echo ========================================
echo    DISCORD BOT KURULUM
echo ========================================
echo.
echo Bağımlılıklar yükleniyor...
echo.

REM Node.js kontrolü
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo HATA: Node.js yüklü değil!
    echo Lütfen https://nodejs.org adresinden Node.js'i indirin ve yükleyin.
    pause
    exit /b 1
)

echo Node.js bulundu!
echo.

REM npm install çalıştır
echo npm install komutu çalıştırılıyor...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo HATA: Bağımlılıklar yüklenirken hata oluştu!
    pause
    exit /b 1
)

echo.
echo ========================================
echo    KURULUM TAMAMLANDI!
echo ========================================
echo.
echo Şimdi .env dosyasını oluşturmanız gerekiyor.
echo README.md dosyasındaki talimatları takip edin.
echo.
echo Panel'i başlatmak için start-panel.bat dosyasını çalıştırın.
echo.
pause
