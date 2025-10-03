@echo off
echo ========================================
echo    DISCORD BOT PANEL
echo ========================================
echo.

REM .env dosyası kontrolü
if not exist ".env" (
    echo HATA: .env dosyası bulunamadı!
    echo.
    echo Lütfen önce .env dosyasını oluşturun:
    echo 1. Proje klasöründe .env adında dosya oluşturun
    echo 2. README.md dosyasındaki talimatları takip edin
    echo 3. Discord bot token'ınızı ekleyin
    echo.
    pause
    exit /b 1
)

REM node_modules kontrolü
if not exist "node_modules" (
    echo HATA: Bağımlılıklar yüklenmemiş!
    echo.
    echo Lütfen önce install.bat dosyasını çalıştırın.
    echo.
    pause
    exit /b 1
)

echo Bot panel başlatılıyor...
echo.
echo NOT: Bot'u kapatmak için Ctrl+C tuşlarına basın
echo.

REM Panel'i başlat
call npm run panel

echo.
echo Bot kapatıldı.
pause
