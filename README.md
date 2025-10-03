# Discord DM Bot

Bu bot, Discord sunucunuzdaki tüm üyelere `/dm` komutu ile DM mesajı göndermenizi sağlar.

## 🚀 Özellikler

- `/dm` slash komutu ile sunucudaki tüm üyelere DM gönderme
- **Terminal Panel** ile kolay yönetim
- Sadece admin yetkisine sahip kullanıcılar komutu kullanabilir
- Rate limiting ile güvenli mesaj gönderimi
- Detaylı gönderim raporları
- Güzel embed formatında mesajlar
- Spam koruması ve yavaş gönderim

## 📋 Gereksinimler

- Node.js (v16.9.0 veya üzeri)
- Discord Bot Token
- Discord sunucusunda bot için gerekli yetkiler

## 🛠️ Kurulum

### 1. Projeyi İndirin
```bash
git clone <repository-url>
cd discord-dm-bot
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Discord Bot Oluşturun

1. [Discord Developer Portal](https://discord.com/developers/applications) adresine gidin
2. "New Application" butonuna tıklayın
3. Bot'unuz için bir isim verin
4. "Bot" sekmesine gidin
5. "Add Bot" butonuna tıklayın
6. Token'ı kopyalayın (Bu token'ı kimseyle paylaşmayın!)

### 4. Bot Yetkilerini Ayarlayın

Bot'unuzun aşağıdaki yetkilere sahip olması gerekir:
- Send Messages
- Use Slash Commands
- Read Message History
- Read Members

### 5. Bot'u Sunucuya Davet Edin

Discord Developer Portal'da:
1. "OAuth2" > "URL Generator" sekmesine gidin
2. "Scopes" bölümünden "bot" ve "applications.commands" seçin
3. "Bot Permissions" bölümünden gerekli yetkileri seçin
4. Oluşturulan URL'yi kopyalayın ve tarayıcıda açın
5. Bot'u sunucunuza davet edin

### 6. Ortam Değişkenlerini Ayarlayın

Proje klasöründe `.env` dosyası oluşturun:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
```

**Değerleri nereden bulacaksınız:**
- `DISCORD_TOKEN`: Discord Developer Portal > Bot sekmesi
- `CLIENT_ID`: Discord Developer Portal > General Information sekmesi
- `GUILD_ID`: Discord'da sunucu ayarları > Gelişmiş > Sunucu ID'si

### 7. Bot'u Başlatın

**Terminal Panel ile (Önerilen):**
```bash
npm run panel
```

**Normal Bot:**
```bash
npm start
```

**Hızlı Başlatma (Windows):**
- `install.bat` dosyasına çift tıklayın (bağımlılıkları yükler)
- `start-panel.bat` dosyasına çift tıklayın (panel'i başlatır)

## 📖 Kullanım

### Terminal Panel (Önerilen)

Panel'i başlattıktan sonra menüden seçim yapın:

1. **Sunucudaki herkese DM gönder** - Tüm üyelere toplu mesaj
2. **Belirli kullanıcıya DM gönder** - Tek kullanıcıya özel mesaj
3. **Sunucu değiştir** - Farklı sunucular arasında geçiş
4. **Sunucu bilgilerini göster** - Detaylı sunucu istatistikleri
5. **Bot durumunu göster** - Bot performans ve durum bilgileri

### `/dm` Komutu (Discord'da)

```
/dm mesaj: Gönderilecek mesaj buraya yazın
```

**Örnekler:**
- `/dm mesaj: Toplantı var, herkes ses gelsin!`
- `/dm mesaj: Sunucu bakımı yapılacak, 1 saat sonra giriş yapabilirsiniz.`
- `/dm mesaj: Yeni kurallar eklendi, lütfen okuyun.`

### Önemli Notlar

- Sadece **admin yetkisine sahip** kullanıcılar komutu kullanabilir
- Bot kendisine ve diğer botlara DM göndermez
- Komutu kullanan kişiye DM gönderilmez
- Rate limiting nedeniyle mesajlar arasında 1 saniye bekleme vardır
- Büyük sunucularda tüm mesajların gönderilmesi zaman alabilir

## 🔧 Geliştirme

Geliştirme modunda çalıştırmak için:

```bash
npm run dev
```

Bu komut nodemon kullanarak dosya değişikliklerini otomatik olarak algılar ve bot'u yeniden başlatır.

## ⚠️ Uyarılar

- Bu bot'u kullanırken Discord'un ToS'unu ihlal etmemeye dikkat edin
- Spam yapmaktan kaçının
- Kullanıcıların DM'lerini kapatmış olabileceğini unutmayın
- Büyük sunucularda rate limit nedeniyle bazı mesajlar gönderilemeyebilir

## 📝 Lisans

MIT License

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 Destek

Herhangi bir sorun yaşarsanız, lütfen issue oluşturun.
