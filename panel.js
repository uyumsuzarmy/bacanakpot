const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const readline = require('readline');
require('dotenv').config();

// Bot client'ını oluştur
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

// Terminal interface oluştur
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Global değişkenler
let isBotReady = false;
let currentGuild = null;

// Bot hazır olduğunda
client.once('clientReady', () => {
    console.log(`✅ Bot giriş yaptı: ${client.user.tag}`);
    console.log(`📊 ${client.guilds.cache.size} sunucuda aktif`);
    isBotReady = true;
    
    // İlk sunucuyu seç
    if (client.guilds.cache.size > 0) {
        currentGuild = client.guilds.cache.first();
        console.log(`🎯 Aktif sunucu: ${currentGuild.name}`);
    }
    
    showMainMenu();
});

// Ana menü
function showMainMenu() {
    console.log('\n' + '='.repeat(50));
    console.log('🤖 DISCORD BOT PANEL');
    console.log('='.repeat(50));
    console.log('1. Sunucudaki herkese DM gönder');
    console.log('2. Belirli kullanıcıya DM gönder');
    console.log('3. Sunucu değiştir');
    console.log('4. Sunucu bilgilerini göster');
    console.log('5. Bot durumunu göster');
    console.log('6. Çıkış');
    console.log('='.repeat(50));
    
    rl.question('Seçiminizi yapın (1-6): ', handleMenuChoice);
}

// Menü seçimlerini işle
async function handleMenuChoice(choice) {
    switch(choice.trim()) {
        case '1':
            await sendDMToEveryone();
            break;
        case '2':
            await sendDMToUser();
            break;
        case '3':
            await changeGuild();
            break;
        case '4':
            showGuildInfo();
            break;
        case '5':
            showBotStatus();
            break;
        case '6':
            console.log('👋 Bot kapatılıyor...');
            process.exit(0);
            break;
        default:
            console.log('❌ Geçersiz seçim! Lütfen 1-6 arası bir sayı girin.');
            showMainMenu();
    }
}

// Sunucudaki herkese DM gönder
async function sendDMToEveryone() {
    if (!currentGuild) {
        console.log('❌ Aktif sunucu bulunamadı!');
        showMainMenu();
        return;
    }

    console.log('\n📤 SUNUCUDAKİ HERKESE DM GÖNDER');
    console.log('='.repeat(40));
    
    rl.question('Gönderilecek mesajı yazın: ', async (message) => {
        if (!message.trim()) {
            console.log('❌ Mesaj boş olamaz!');
            showMainMenu();
            return;
        }

        rl.question('Gönderim hızı (saniye, varsayılan: 2): ', async (speed) => {
            const delay = parseInt(speed) || 2;
            
            console.log(`\n🔄 ${currentGuild.name} sunucusundaki üyelere DM gönderiliyor...`);
            console.log(`⏱️  Gönderim hızı: ${delay} saniye`);
            console.log(`📝 Mesaj: ${message}`);
            console.log('='.repeat(50));

            try {
                // Sunucudaki tüm üyeleri al
                await currentGuild.members.fetch();
                const members = currentGuild.members.cache.filter(member => 
                    !member.user.bot && member.user.id !== client.user.id
                );

                console.log(`📊 ${members.size} üyeye DM gönderilecek...`);

                let successCount = 0;
                let failCount = 0;
                const failedUsers = [];

                // Her üyeye DM gönder
                for (const [userId, member] of members) {
                    try {
                        const embed = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle('📨 Sunucu Duyurusu')
                            .setDescription(message)
                            .setFooter({ 
                                text: `${currentGuild.name} sunucusundan gönderildi`,
                                iconURL: currentGuild.iconURL() 
                            })
                            .setTimestamp();

                        await member.send({ embeds: [embed] });
                        successCount++;
                        
                        console.log(`✅ ${member.user.tag} - Gönderildi (${successCount}/${members.size})`);
                        
                        // Rate limit için bekleme
                        if (delay > 0) {
                            await new Promise(resolve => setTimeout(resolve, delay * 1000));
                        }
                        
                    } catch (error) {
                        console.log(`❌ ${member.user.tag} - Gönderilemedi: ${error.message}`);
                        failCount++;
                        failedUsers.push(member.user.tag);
                    }
                }

                // Sonuçları göster
                console.log('\n' + '='.repeat(50));
                console.log('📊 GÖNDERİM SONUÇLARI');
                console.log('='.repeat(50));
                console.log(`✅ Başarılı: ${successCount} kişi`);
                console.log(`❌ Başarısız: ${failCount} kişi`);
                
                if (failedUsers.length > 0) {
                    console.log('\n❌ Gönderilemeyen kullanıcılar:');
                    failedUsers.slice(0, 10).forEach(user => console.log(`   - ${user}`));
                    if (failedUsers.length > 10) {
                        console.log(`   ... ve ${failedUsers.length - 10} kişi daha`);
                    }
                }
                console.log('='.repeat(50));

            } catch (error) {
                console.log(`❌ Hata: ${error.message}`);
            }

            rl.question('\nDevam etmek için Enter tuşuna basın...', () => {
                showMainMenu();
            });
        });
    });
}

// Belirli kullanıcıya DM gönder
async function sendDMToUser() {
    if (!currentGuild) {
        console.log('❌ Aktif sunucu bulunamadı!');
        showMainMenu();
        return;
    }

    console.log('\n👤 BELİRLİ KULLANICIYA DM GÖNDER');
    console.log('='.repeat(40));
    
    rl.question('Kullanıcı adını veya ID\'sini girin: ', async (userInput) => {
        if (!userInput.trim()) {
            console.log('❌ Kullanıcı adı boş olamaz!');
            showMainMenu();
            return;
        }

        try {
            // Kullanıcıyı bul
            let member = null;
            
            // ID ile arama
            if (userInput.match(/^\d+$/)) {
                member = currentGuild.members.cache.get(userInput);
            } else {
                // Kullanıcı adı ile arama
                member = currentGuild.members.cache.find(m => 
                    m.user.username.toLowerCase().includes(userInput.toLowerCase()) ||
                    m.displayName.toLowerCase().includes(userInput.toLowerCase())
                );
            }

            if (!member) {
                console.log('❌ Kullanıcı bulunamadı!');
                showMainMenu();
                return;
            }

            console.log(`✅ Kullanıcı bulundu: ${member.user.tag} (${member.displayName})`);

            rl.question('Gönderilecek mesajı yazın: ', async (message) => {
                if (!message.trim()) {
                    console.log('❌ Mesaj boş olamaz!');
                    showMainMenu();
                    return;
                }

                try {
                    const embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('📨 Özel Mesaj')
                        .setDescription(message)
                        .setFooter({ 
                            text: `${currentGuild.name} sunucusundan gönderildi`,
                            iconURL: currentGuild.iconURL() 
                        })
                        .setTimestamp();

                    await member.send({ embeds: [embed] });
                    console.log(`✅ Mesaj başarıyla gönderildi: ${member.user.tag}`);
                    
                } catch (error) {
                    console.log(`❌ Mesaj gönderilemedi: ${error.message}`);
                }

                rl.question('\nDevam etmek için Enter tuşuna basın...', () => {
                    showMainMenu();
                });
            });

        } catch (error) {
            console.log(`❌ Hata: ${error.message}`);
            showMainMenu();
        }
    });
}

// Sunucu değiştir
async function changeGuild() {
    console.log('\n🔄 SUNUCU DEĞİŞTİR');
    console.log('='.repeat(30));
    
    const guilds = Array.from(client.guilds.cache.values());
    
    if (guilds.length === 0) {
        console.log('❌ Bot hiçbir sunucuda değil!');
        showMainMenu();
        return;
    }

    console.log('Mevcut sunucular:');
    guilds.forEach((guild, index) => {
        console.log(`${index + 1}. ${guild.name} (${guild.memberCount} üye)`);
    });

    rl.question(`Sunucu seçin (1-${guilds.length}): `, (choice) => {
        const index = parseInt(choice) - 1;
        
        if (index >= 0 && index < guilds.length) {
            currentGuild = guilds[index];
            console.log(`✅ Aktif sunucu değiştirildi: ${currentGuild.name}`);
        } else {
            console.log('❌ Geçersiz seçim!');
        }
        
        showMainMenu();
    });
}

// Sunucu bilgilerini göster
function showGuildInfo() {
    if (!currentGuild) {
        console.log('❌ Aktif sunucu bulunamadı!');
        showMainMenu();
        return;
    }

    console.log('\n📊 SUNUCU BİLGİLERİ');
    console.log('='.repeat(30));
    console.log(`🏷️  Sunucu Adı: ${currentGuild.name}`);
    console.log(`🆔 Sunucu ID: ${currentGuild.id}`);
    console.log(`👥 Toplam Üye: ${currentGuild.memberCount}`);
    console.log(`👤 Bot Olmayan Üye: ${currentGuild.members.cache.filter(m => !m.user.bot).size}`);
    console.log(`🤖 Bot Sayısı: ${currentGuild.members.cache.filter(m => m.user.bot).size}`);
    console.log(`👑 Sahip: ${currentGuild.ownerId ? client.users.cache.get(currentGuild.ownerId)?.tag || 'Bilinmiyor' : 'Bilinmiyor'}`);
    console.log(`📅 Oluşturulma: ${currentGuild.createdAt.toLocaleDateString('tr-TR')}`);
    
    rl.question('\nDevam etmek için Enter tuşuna basın...', () => {
        showMainMenu();
    });
}

// Bot durumunu göster
function showBotStatus() {
    console.log('\n🤖 BOT DURUMU');
    console.log('='.repeat(20));
    console.log(`✅ Bot Durumu: ${isBotReady ? 'Aktif' : 'Pasif'}`);
    console.log(`🏷️  Bot Adı: ${client.user?.tag || 'Bilinmiyor'}`);
    console.log(`🆔 Bot ID: ${client.user?.id || 'Bilinmiyor'}`);
    console.log(`📊 Toplam Sunucu: ${client.guilds.cache.size}`);
    console.log(`👥 Toplam Kullanıcı: ${client.users.cache.size}`);
    console.log(`⏰ Ping: ${client.ws.ping}ms`);
    console.log(`💾 Bellek Kullanımı: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
    
    rl.question('\nDevam etmek için Enter tuşuna basın...', () => {
        showMainMenu();
    });
}

// Bot'u başlat
console.log('🚀 Discord Bot başlatılıyor...');
client.login(process.env.DISCORD_TOKEN);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Bot kapatılıyor...');
    rl.close();
    client.destroy();
    process.exit(0);
});
