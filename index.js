const { Client, GatewayIntentBits, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

// Bot client'ını oluştur
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

// Bot hazır olduğunda çalışacak kod
client.once('clientReady', () => {
    console.log(`✅ Bot giriş yaptı: ${client.user.tag}`);
    console.log(`📊 ${client.guilds.cache.size} sunucuda aktif`);
});

// Slash komutları tanımla
const commands = [
    new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Sunucudaki tüm üyelere DM mesajı gönder')
        .addStringOption(option =>
            option
                .setName('mesaj')
                .setDescription('Gönderilecek mesaj')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // Sadece adminler kullanabilir
];

// Slash komutları kaydet
client.on('clientReady', async () => {
    try {
        console.log('🔄 Slash komutları kaydediliyor...');
        
        // Global komutlar için (tüm sunucularda çalışır)
        await client.application.commands.set(commands);
        
        console.log('✅ Slash komutları başarıyla kaydedildi!');
    } catch (error) {
        console.error('❌ Slash komutları kaydedilirken hata:', error);
    }
});

// Slash komut etkileşimlerini işle
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'dm') {
        // Kullanıcının admin yetkisi var mı kontrol et
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: '❌ Bu komutu kullanmak için admin yetkisine sahip olmalısınız!',
                ephemeral: true
            });
        }

        const message = interaction.options.getString('mesaj');
        
        // Mesajı onayla
        await interaction.reply({
            content: `📤 DM mesajı gönderiliyor...\n**Mesaj:** ${message}`,
            ephemeral: true
        });

        try {
            // Sunucudaki tüm üyeleri al
            const guild = interaction.guild;
            await guild.members.fetch(); // Tüm üyeleri cache'e al
            
            const members = guild.members.cache.filter(member => 
                !member.user.bot && member.user.id !== interaction.user.id
            );

            console.log(`📊 ${members.size} üyeye DM gönderiliyor...`);

            let successCount = 0;
            let failCount = 0;
            const failedUsers = [];

            // Her üyeye DM gönder
            for (const [userId, member] of members) {
                try {
                    // Embed oluştur
                    const embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('📨 Sunucu Duyurusu')
                        .setDescription(message)
                        .setFooter({ 
                            text: `${guild.name} sunucusundan gönderildi`,
                            iconURL: guild.iconURL() 
                        })
                        .setTimestamp();

                    await member.send({ embeds: [embed] });
                    successCount++;
                    
                    // Rate limit için kısa bekleme
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                } catch (error) {
                    console.error(`❌ ${member.user.tag} kullanıcısına DM gönderilemedi:`, error.message);
                    failCount++;
                    failedUsers.push(member.user.tag);
                }
            }

            // Sonuçları göster
            const resultEmbed = new EmbedBuilder()
                .setColor(successCount > 0 ? 0x00FF00 : 0xFF0000)
                .setTitle('📊 DM Gönderim Sonuçları')
                .addFields(
                    { name: '✅ Başarılı', value: `${successCount} kişiye gönderildi`, inline: true },
                    { name: '❌ Başarısız', value: `${failCount} kişiye gönderilemedi`, inline: true },
                    { name: '📝 Mesaj', value: message, inline: false }
                )
                .setTimestamp();

            if (failedUsers.length > 0) {
                resultEmbed.addFields({
                    name: '❌ Gönderilemeyen Kullanıcılar',
                    value: failedUsers.slice(0, 10).join('\n') + (failedUsers.length > 10 ? `\n... ve ${failedUsers.length - 10} kişi daha` : ''),
                    inline: false
                });
            }

            await interaction.followUp({
                embeds: [resultEmbed],
                ephemeral: true
            });

        } catch (error) {
            console.error('❌ DM gönderimi sırasında hata:', error);
            await interaction.followUp({
                content: `❌ DM gönderimi sırasında bir hata oluştu: ${error.message}`,
                ephemeral: true
            });
        }
    }
});

// Bot'u başlat
client.login(process.env.DISCORD_TOKEN);
