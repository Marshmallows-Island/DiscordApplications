require('dotenv').config();
const { Client, Events, Collection, GatewayIntentBits, Partials } = require('discord.js');
const Wait = require('node:timers/promises').setTimeout;
const Config = require('./config.json');
const FileSystem = require('node:fs');
const Path = require('node:path');
const token = process.env.TOKEN;
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel],
	allowedMentions: {
		parse: ['users', 'roles']
	}
});
currentId = Config.bot.currentId;

client.commands = new Collection();


const commandsPath = Path.join(__dirname, 'commands');
const commandFiles = FileSystem.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = Path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

const eventsPath = Path.join(__dirname, 'events');
const eventFiles = FileSystem.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = Path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => {event.execute(...args)});
	}
}
module.exports = client;

client.login(token);
