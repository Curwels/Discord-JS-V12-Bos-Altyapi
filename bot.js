const Discord = require ('discord.js')
const fs = require('fs')
const client = new Discord.Client()
const db = require('quick.db')

const ayarlar = require("./ayarlar.json")

// Command Handlers

var setup = message => {
    console.log(`Sistem: ${message}`)
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    setup(`${files.length} Komut Hazırlandı!`);
    files.forEach(f => {
        let Kodları = require(`./komutlar/${f}`);
        client.commands.set(Kodları.help.name, Kodları);
        client.commands.set(Kodları.help.name, Kodları);
        Kodları.conf.aliases.forEach(alias => {
            client.aliases.set(alias, Kodları.help.name);
        });
    });
});

client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let Dosya = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, Dosya);
            Dosya.conf.aliases.forEach(alias => {
                client.aliases.set(alias, Dosya.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};


client.on("message", async message => {
    const prefix = "!";

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(ayarlar.prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(ayarlar.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) 
        command.run(client, message, args);
});

// Bot Login

client.on('ready', () => {
    client.user.setPresence({ status: 'dnd', activity: {name: "Rawen için", type: "WATCHING"}});
    console.log(`${client.user.tag} Mekana Giriş Yaptı. Thendra: Tamam Kalkalım da Ayıp Oluyor Ama`);
})


client.login(ayarlar.token)