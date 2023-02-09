const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('connectvoice')
		.setDescription('Connect to the voice channel you are currently in.'),
	async execute(interaction) {
    try {
      const connection = getVoiceConnection(myVoiceChannel.guild.id);
      console.log(connection);
    } catch (error) {
      console.log(error);
    }
  },
}