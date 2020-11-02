import Discord from 'discord.js';
import { config } from 'dotenv';
import { RoomManager } from './managers/roommanager';
import { RoomManagerImpl } from './managers/roommanagerimpl';
import { LoggerService } from './services/loggerservice';
import { LoggerServiceImpl } from './services/loggerserviceimpl';
import { MessageStringService } from './services/messagestringservice';
import { MessageStringServiceImpl } from './services/messagestringserviceimpl';
import { TextChannelService } from './services/textchannelservice';
import { TextChannelServiceImpl } from './services/textchannelserviceimpl';
import { VoiceChannelService } from './services/voicechannelservice';
import { VoiceChannelServiceImpl } from './services/voicechannelserviceimpl';
import { TextChannel } from './types/textchannel';

const TIME_5_MIN: number = 1000 * 60 * 5;

config();

const client = new Discord.Client();

const loggerService: LoggerService = new LoggerServiceImpl();
const messageStringService: MessageStringService = new MessageStringServiceImpl();
const textChannelService: TextChannelService = new TextChannelServiceImpl();
const voiceChannelService: VoiceChannelService = new VoiceChannelServiceImpl();

let roomManager: RoomManager;

loggerService.info(`discord token: ${process.env.DISCORD_TOKEN}`);

client.on('ready', () => {
  if (process.env.GUILD_ID) {
    const guild = client.guilds.resolve(process.env.GUILD_ID);
    if (guild) {
      roomManager = new RoomManagerImpl(voiceChannelService, guild);
      if (process.env.DEFAULT_NOTIFICATION_CHANNELS) {
        const defaultNotificationChannelIDs = process.env.DEFAULT_NOTIFICATION_CHANNELS.split(
          ',',
        );
        defaultNotificationChannelIDs.forEach((channelID) => {
          const channel = guild.channels.resolve(channelID);
          if (channel instanceof Discord.TextChannel) {
            textChannelService.add({
              id: channel.id,
              name: channel.name,
            });
            loggerService.info(
              `room added to alerts: id=${channel.id}, name=${channel.name}`,
            );
          }
        });
      }
      loggerService.info(`anasbot started: \`${guild.id}\``);
    }
  }
  loggerService.info('anasbot ready!');
  client.setInterval(() => {
    if (roomManager) {
      const rooms = roomManager.listAvailableRooms(5);
      if (rooms.length < 1) {
        return;
      }
      textChannelService.list().forEach((channel) => {
        client.channels.fetch(channel.id).then((resolvedChannel) => {
          if (resolvedChannel instanceof Discord.TextChannel) {
            let content = ``;
            content += `**Available Game Channels**\n`;
            content += `_Looking for a quick game? Try using \`-q\` command in any text channel. I will recommend you good room to join!_\n\n`;
            content += messageStringService.printAvailableGameChannels(rooms);
            resolvedChannel.send(content);
          }
        });
      });
    }
  }, TIME_5_MIN);
});

client.on('message', (msg) => {
  const splits = msg.content.split(' ');
  if (splits.length < 1) {
    return;
  }
  const command = splits[0];
  switch (command) {
    case '-start': {
      if (msg.guild) {
        roomManager = new RoomManagerImpl(voiceChannelService, msg.guild);
        if (process.env.DEFAULT_NOTIFICATION_CHANNELS) {
          const defaultNotificationChannelIDs = process.env.DEFAULT_NOTIFICATION_CHANNELS.split(
            ',',
          );
          defaultNotificationChannelIDs.forEach((channelID) => {
            if (msg.guild) {
              const channel = msg.guild.channels.resolve(channelID);
              if (channel instanceof Discord.TextChannel) {
                textChannelService.add({
                  id: channel.id,
                  name: channel.name,
                });
                loggerService.info(
                  `room added to alerts: id=${channel.id}, name=${channel.name}`,
                );
              }
            }
          });
        }
        msg.reply(`anasbot started: \`${msg.guild.id}\``);
      }
      break;
    }
    case '-quick':
    case '-q': {
      if (roomManager) {
        msg.reply(`looking for available game...`);
        const rooms = roomManager.listAvailableRooms(1);
        if (rooms.length < 1) {
          msg.channel.send(
            `Looks like no room is looking for players right now. Why don't you start one :)`,
          );
          break;
        } else {
          msg.channel.send(
            messageStringService.printAvailableGameChannels(rooms),
          );
        }
      }
      break;
    }
    case '-alert': {
      msg.channel.fetch().then((channel) => {
        if (channel instanceof Discord.TextChannel) {
          textChannelService.add({
            id: channel.id,
            name: channel.name,
          });
          msg.reply(`room added to alerts`);
        }
      });
      break;
    }
    case '-unalert': {
      textChannelService.removeByChannelID(msg.channel.id);
      msg.reply(`room removed from alerts`);
      break;
    }
    case '-info': {
      if (!roomManager) {
        return;
      }
      msg.reply(`retrieving bot info...`);
      let info = ``;
      info += messageStringService.printGameChannels(
        roomManager.listTrackedRooms(),
      );
      info += messageStringService.printNotificationChannels(
        textChannelService.list(),
      );
      msg.channel.send(info);
      break;
    }
    case '-textchannels': {
      msg.reply('retrieving text channels...');
      if (msg.guild) {
        const textChannels: TextChannel[] = [];
        msg.guild.channels.cache.forEach((channel) => {
          if (channel instanceof Discord.TextChannel) {
            textChannels.push({
              id: channel.id,
              name: channel.name,
            });
          }
        });
        msg.channel.send(messageStringService.printTextChannels(textChannels));
      }
      break;
    }
    case '-addtextchannel': {
      if (splits.length > 1) {
        const channelID = splits[1];
        if (msg.guild) {
          const channel = msg.guild.channels.resolve(channelID);
          if (channel) {
            textChannelService.add({
              id: channel.id,
              name: channel.name,
            });
            msg.reply(`room added to alerts: ${channel.id}`);
          }
        }
      }
      break;
    }
    case '-removetextchannel': {
      if (splits.length > 1) {
        const channelID = splits[1];
        if (msg.guild) {
          const channel = msg.guild.channels.resolve(channelID);
          if (channel) {
            textChannelService.removeByChannelID(channel.id);
            msg.reply(`room removed from alerts: ${channel.id}`);
          }
        }
      }
      break;
    }
    default: {
      break;
    }
  }
});

client.on('voiceStateUpdate', (oldState, newState) => {
  if (roomManager) {
    if (oldState.channel) {
      roomManager.updateRoomUserCount(
        oldState.channel.id,
        oldState.channel.members.size,
      );
    }
    if (newState.channel) {
      roomManager.updateRoomUserCount(
        newState.channel.id,
        newState.channel.members.size,
      );
    }
  }
});

client.on('error', (e) => {
  loggerService.error(e.message);
});

client.login(process.env.DISCORD_TOKEN);
