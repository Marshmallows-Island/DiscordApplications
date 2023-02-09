require('dotenv').config();
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('newinformation')
		.setDescription('Change personality type in config file.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(true),
    //.addIntegerOption(option => option.setName('pNumId').setDescription('Personality number ID')),
	async execute(interaction) {
    var client = require('../index.js');
    console.log(interaction.options);
    const pNum = 1;
    if (pNum < 0 || pNum > 7) {
      return interaction.reply({ content: 'You need to input a number between 0 and 7.', ephemeral: true });
    }
    client.user.setAvatar(`./avatars/Vill${pNum}.jpg`);
    client.user.setUsername(Config.ai.nlpSetting.personalities[pNum].name);
    client.user.setPresence({ activities: [{ name: '' }], status: 'idle' });
    console.log(interaction);
		await interaction.reply({content: 'I changed personality!'}); //, components: [row] 
	},
};