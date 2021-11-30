const Discord = require('discord.js');

exports.run = (client, message, args) => {
    const kisi = message.mentions.users.first() || client.users.cache.get(args[0]);
    if(!kisi) return message.reply(`:x: Yanlış kullanım! Birini etiketlemelisin.`)

    const avataremb = new Discord.MessageEmbed()
    .setTitle(`Buyur İstediğin Avatar`)
    .setDescription(`**[[PNG]](${kisi.displayAvatarURL({ format: 'png', size: 1024 })})** | **[[JPEG]](${kisi.displayAvatarURL({ format: 'jpeg', size: 1024 })})** | **[[GIF]](${kisi.displayAvatarURL({ format: 'gif', size: 1024 })})** | **[[WEBP]](${kisi.displayAvatarURL({ format: 'webp', size: 1024 })})**`)
    .setImage(kisi.displayAvatarURL( { dynamic: true, size: 1024 } ))
    .setFooter(`© 2021 Akhyls | ${message.author.tag} Tarafından İstendi.`, client.user.avatarURL())
    .setColor("BLACK")
    .setTimestamp()
    message.channel.send(avataremb)
}

exports.conf = {
    aliases: [],
    permLevel: 0,
    enabled: true,
    guildOnly: true,
};

exports.help = {
    name: "avatar",
};