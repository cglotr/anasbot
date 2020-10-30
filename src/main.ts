import Discord from 'discord.js';
import { config } from 'dotenv';
import { ConsoleLogger, Logger } from './logger';
import { RoomManager } from './managers/roommanager';
import { RoomManagerImpl } from './managers/roommanagerimpl';
import { MessageStringService } from './services/messagestringservice';
import { MessageStringServiceImpl } from './services/messagestringserviceimpl';
import { VoiceChannelService } from './services/voicechannelservice';
import { VoiceChannelServiceImpl } from './services/voicechannelserviceimpl';
import { TextChannelStorage } from './textchannelstorage';

config();

const client = new Discord.Client();
const logger: Logger = new ConsoleLogger();
const notiChanStorage: TextChannelStorage = new TextChannelStorage();

const messageStringService: MessageStringService = new MessageStringServiceImpl();
const voiceChannelService: VoiceChannelService = new VoiceChannelServiceImpl();

let roomManager: RoomManager;

logger.info(`discord token: ${process.env.DISCORD_TOKEN}`);

client.on('ready', () => {
  logger.info('bot started');
  client.setInterval(() => {
    if (roomManager) {
      notiChanStorage.list().forEach((notiChan) => {
        client.channels.fetch(notiChan.id).then((channel) => {
          if (channel instanceof Discord.TextChannel) {
            channel.send(
              messageStringService.printAvailableGameChannels(
                roomManager.listAvailableRooms(5),
              ),
            );
          }
        });
      });
    }
  }, 1000 * 5);
});

client.on('message', (msg) => {
  switch (msg.content.trim()) {
    case '-start': {
      if (msg.guild) {
        roomManager = new RoomManagerImpl(voiceChannelService, msg.guild);
      }
      break;
    }
    case '-quick':
    case '-q': {
      if (roomManager) {
        msg.channel.send(
          messageStringService.printAvailableGameChannels(
            roomManager.listAvailableRooms(1),
          ),
        );
      }
      break;
    }
    case '-alert': {
      msg.channel.fetch().then((channel) => {
        if (channel instanceof Discord.TextChannel) {
          notiChanStorage.add({
            id: channel.id,
            name: channel.name,
          });
        }
      });
      break;
    }
    case '-unalert': {
      notiChanStorage.removeByChannelID(msg.channel.id);
      break;
    }
    case '-info': {
      logger.info(`processing !info command: user=[${msg.author}]`);
      let info = ``;
      info += messageStringService.printGameChannels(
        roomManager.listTrackedRooms(),
      );
      info += `\n`;
      info += messageStringService.printNotificationChannels(
        notiChanStorage.list(),
      );
      msg.channel.send(info);
      break;
    }
    default: {
      break;
    }
  }
});

client.on('error', (e) => {
  logger.error(e.message);
});

client.login(process.env.DISCORD_TOKEN);
