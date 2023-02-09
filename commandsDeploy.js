require('dotenv').config();
const { REST, Routes } = require('discord.js');
const FileSystem = require('node:fs');
const Config = require('./config.json');

const token = process.env.TOKEN;
const commands = [];

const commandFiles = FileSystem.readdirSync('./commands').filter(
  file => file.endsWith('.js')
);

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(Config.bot.id, Config.guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
  }
})();