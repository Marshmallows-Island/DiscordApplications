const { Events } = require('discord.js');

const FileSystem = require('node:fs');
const CreateOpenAIRequest = require('../other/creatingNLPRequest.js');
var Config = require("../config.json");
const stopSigns = [Config.ai.nlpSetting.stopSignOne, Config.ai.nlpSetting.stopSignTwo];
const VillNames = require('../other/villNames.js');
const AvatarLinks = require('../other/avatarLinks.js');

var regularNumber = /\d+/;
var currentTime = new Date(new Date().getTime()).toUTCString().replace(/ GMT$/, "");
var currentId = Config.bot.currentId;
var numSplit;
let promptCore = `${Config.ai.nlpSetting.mainPrompt}Right now is ${currentTime}\nMessages from the server:`;
let promptPersonality = Config.ai.nlpSetting.personalities[currentId].prompt;
let responseMessage = ``;

console.log(`Starts with ${VillNames[currentId]}`);

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    client = require(`/home/runner/Vill-V/index.js`);
    Config = await require("../config.json");
    console.log(`New message!\n${message.author.username}`);
    //console.log(`${promptCore}`);
    if (message.author.id == "1047820770723774474") {
      console.log("Message from the bot itself...");
    } else {
      promptCore += `\n_\n${message.author.username}:\n${message}\n_\n`;
      const dataResponseNLP = await CreateOpenAIRequest('text-davinci-002', promptCore, 256, 0.64, stopSigns);
      const responseNLP = dataResponseNLP.data.choices[0].text;
      console.log(`Response:\n"\n${responseNLP}"\n`);
      promptCore += responseNLP;
      let splittedResponse = responseNLP.split("\n");
      console.log(splittedResponse);
      numSplit = 0;
      for (i = 1; i < splittedResponse.length; i++) {
        if (splittedResponse[i].startsWith("Delegate")) {
          currentId = parseInt(splittedResponse[i].match(regularNumber));
          if (currentId >= 0 && currentId < 7) {
            console.log(`Current Id: ${currentId}\nId from config: ${Config.bot.currentId}`);
            if (currentId != Config.bot.currentId) {
              console.log("It's not the same!");
              Config.bot.currentId = currentId;
              Config.bot.currentName = VillNames[currentId];
              FileSystem.writeFile(`/home/runner/Vill-V/config.json`, JSON.stringify(Config), function writeJSON(error) {
                if (error) return console.log(error);
                console.log(`Updating data to "../config.json"`);
              
              });
              //client.on(require(`/home/runner/Vill-V/events/ready.js`).name, (client) => {
            
              //});
              client.user.setAvatar(AvatarLinks[currentId]);
              client.user.setUsername(VillNames[currentId]);
              console.log(`Personality was changed!\nid${currentId}: ${VillNames[currentId]}`);
              promptPersonality = `${Config.ai.nlpSetting.personalities[currentId].prompt}\n_\n${message.author.username}:\n${message}\n_\n${VillNames[currentId]}:\n`;
              const dataCurrentNLP = await CreateOpenAIRequest('text-davinci-002', promptPersonality, 
                                                               256, 0.64, stopSigns);      
              responseMessage = dataCurrentNLP.data.choices[0].text;
              console.log(`Response:\n"\n${responseMessage}\n"\n`);
              promptPersonality += responseMessage;
            
          } else {
              promptPersonality += `\n_\n${message.author.username}:\n${message}\n_\n${VillNames[currentId]}:\n}`;
              const dataCurrentNLP = await CreateOpenAIRequest('text-davinci-002', promptPersonality, 
                                                               256, 0.64, stopSigns);
              responseMessage = await dataCurrentNLP.data.choices[0].text;
              console.log(`Response:\n"\n${responseMessage}"\n`);
              promptPersonality += responseMessage;
            }
          }
          
          promptCore = `${promptCore}\n_\n${VillNames[currentId]}\n${responseMessage}`;  
          // console.log(promptPersonality);
          
          if (responseMessage!=`` || responseMessage!='\n' || responseMessage!=null)
            try{await message.channel.send(responseMessage);} catch (Error) {console.error(Error);}
          } else if (splittedResponse[i].startsWith("Yes, change it")) {
            console.log("Request for changing activity-status");
          } else {
            numSplit++;
          } if (numSplit == splittedResponse.length - 1) {
          for (i = 1; i < splittedResponse.length; i++)
              if (splittedResponse[i]!='' || splittedResponse[i]!='\n')
                await message.channel.send(splittedResponse[i]);
            }
          }
        }
    },
};
//require(`/home/runner/Vill-V/events/ready.js`).execute(client);