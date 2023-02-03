require('dotenv').config();
const { EpicFreeGames } = require('epic-free-games');
const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');
const fs = require('fs');

// Store EpicFreeGames functionality in gamesList
const gamesList = new EpicFreeGames({
  country: 'US',
  locale: 'en-US',
  includeAll: true,
});

// Store intents in bot for Discord functionality
const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Use Cron to schedule weekly updates
let task = cron.schedule(
  '30 11 * * 4',
  // '26 * * * *',
  () => {
    //Get Current Free Epic Games and Post them to the Server
    gamesList
      .getGames()
      .then((res) => {
        const channel = bot.channels.cache.get('1026619276368552000');
        let gTitle;
        let gDesc;
        let gImages;
        for (let i = 0; i < res.currentGames.length; i++) {
          gTitle = res.currentGames[i].title;
          gDesc = res.currentGames[i].description;
          channel.send(
            `***${gTitle}*** is currently FREE on the Epic Game Store!\n\n${gDesc}\n\nCheck it out!\n\n`
          );
        }
      })
      .catch((err) => {
        console.log('Something Went Wrong When Trying to Get the Games!');
        console.log(err);
      });
  },
  {
    scheduled: true,
    timezone: 'America/New_York',
  }
);

// When the bot comes online do the following
bot.on('ready', () => {
  console.log('Bot online!');
  task.start();
});

// Allows bot to connect to Discord Server and do it's thing.
bot.login(process.env.TOKEN);
