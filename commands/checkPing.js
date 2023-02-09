require('dotenv').config();
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('checkping')
		.setDescription('Change personality type in config file.')
    //.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(true),
	async execute(interaction) {
		await interaction.reply({
      content: `My approximately current ping is: ${Date.now()-interaction.createdTimestamp}ms`
    }); //, components: [row] 
	},
};