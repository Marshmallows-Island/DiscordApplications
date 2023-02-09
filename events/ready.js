const { Events } = require('discord.js');
const VillNames = require('../other/villNames.js');
const AvatarLinks = require('../other/avatarLinks.js');

module.exports = {
	name: Events.ClientReady,
	once: false,
	execute (client) {
    var CurrentConfig = require('../config.js');
    var CurrentId = CurrentConfig.bot.currentId;
    var AName = CurrentConfig.bot.currentActivity.name;
    var AType = CurrentConfig.bot.currentActivity.type;
    var AStatus = CurrentConfig.bot.currentActivity.status;
    console.log(`It's ${VillNames[CurrentId]} with follow link ${AvatarLinks[CurrentId]}`);
    client.user.setUsername(VillNames[CurrentId]);
    client.user.setAvatar(AvatarLinks[CurrentId]);
    client.user.setPresence({ activities: [{ name: AName }], status: AStatus, type: AType });
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};