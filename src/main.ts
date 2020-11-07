import Discord from 'discord.js';
import { config } from 'dotenv';
import { DISCORD_TOKEN, GUILD_ID } from './constants';
import { NotificationManager } from './managers/notificationmanager';
import { NotificationManagerImpl } from './managers/notificationmanagerimpl';
import { RoomManager } from './managers/roommanager';
import { RoomManagerImpl } from './managers/roommanagerimpl';
import { EnvironmentService } from './services/environmentservice';
import { EnvironmentServiceImpl } from './services/environmentserviceimpl';
import { LoggerService } from './services/loggerservice';
import { LoggerServiceImpl } from './services/loggerserviceimpl';
import { MessageStringService } from './services/messagestringservice';
import { MessageStringServiceImpl } from './services/messagestringserviceimpl';
import { TextChannelServiceImpl } from './services/textchannelserviceimpl';
import { VoiceChannelService } from './services/voicechannelservice';
import { VoiceChannelServiceImpl } from './services/voicechannelserviceimpl';
import { TextChannel } from './types/textchannel';
import { VoiceChannel } from './types/voicechannel';

const TIME_5_MIN: number = 1000 * 60 * 5;

config();

const client = new Discord.Client();

const loggerService: LoggerService = new LoggerServiceImpl();
const messageStringService: MessageStringService = new MessageStringServiceImpl();
const voiceChannelService: VoiceChannelService = new VoiceChannelServiceImpl();
const environmentService: EnvironmentService = new EnvironmentServiceImpl();

let roomManager: RoomManager;
let notificationManager: NotificationManager;

function start(guild: any): void {
  loggerService.info('initializing room manager...');
  roomManager = new RoomManagerImpl(
    voiceChannelService,
    loggerService,
    environmentService,
    guild,
  );

  loggerService.info('initializing notification manager...');
  notificationManager = new NotificationManagerImpl(
    new TextChannelServiceImpl(),
    loggerService,
    environmentService,
    guild,
  );

  loggerService.info(`anasbot started: guild=${guild.id}`);
}

client.on('ready', () => {
  const guildID = environmentService.getEnv(GUILD_ID);
  if (guildID) {
    const guild = client.guilds.resolve(guildID);
    if (guild) {
      start(guild);
    }
  }
  client.setInterval(() => {
    if (roomManager) {
      const rooms = roomManager.listAvailableRooms(5);
      if (rooms.length > 0) {
        if (notificationManager) {
          notificationManager.list().forEach((channel) => {
            client.channels.fetch(channel.id).then((resolvedChannel) => {
              if (resolvedChannel instanceof Discord.TextChannel) {
                let content = '';
                content += '**Available Game Channels**\n';
                content +=
                  '_Looking for a quick game? Try using `-q` command in any text channel. I will recommend you good room to join!_\n\n';
                content += messageStringService.printAvailableGameChannels(
                  rooms,
                );
                resolvedChannel.send(content);
              }
            });
          });
        }
      }
    }
  }, TIME_5_MIN);
  loggerService.info('anasbot ready!');
});

client.on('message', (msg) => {
  const splits = msg.content.split(' ');
  if (splits.length < 1) {
    return;
  }
  const command = splits[0];
  const arg1 = splits.length > 1 ? splits[1] : '';
  switch (command) {
    case '-start': {
      if (msg.guild) {
        start(msg.guild);
        msg.reply(`anasbot started: guild=\`${msg.guild.id}\``);
      }
      break;
    }
    case '-quick':
    case '-q': {
      if (roomManager) {
        msg.reply('looking for available game...');
        const rooms = roomManager.listAvailableRooms(1);
        if (rooms.length < 1) {
          msg.channel.send(
            'Looks like no room is looking for players right now :(',
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
      if (notificationManager) {
        msg.channel.fetch().then((channel) => {
          if (channel instanceof Discord.TextChannel) {
            notificationManager.add({
              id: channel.id,
              name: channel.name,
            });
            msg.reply('room added to alerts');
          }
        });
      }
      break;
    }
    case '-unalert': {
      if (notificationManager) {
        notificationManager.removeByChannelID(msg.channel.id);
        msg.reply(`room removed from alerts`);
      }
      break;
    }
    case '-info': {
      msg.reply(`retrieving bot info...`);
      let info = ``;
      if (roomManager) {
        info += messageStringService.printGameChannels(
          roomManager.listTrackedRooms(),
        );
      }
      if (notificationManager) {
        info += messageStringService.printNotificationChannels(
          notificationManager.list(),
        );
      }
      msg.channel.send(info);
      break;
    }
    case '-voicechannels': {
      msg.reply('retrieving voice channels...');
      if (msg.guild) {
        const voiceChannels: VoiceChannel[] = [];
        msg.guild.channels.cache.forEach((channel) => {
          if (channel instanceof Discord.VoiceChannel) {
            voiceChannels.push({
              id: channel.id,
              name: channel.name,
              userCount: channel.members.size,
              userLimit: channel.userLimit,
              link: '',
              position: channel.position,
            });
          }
        });
        msg.channel.send(
          messageStringService.printVoiceChannels(voiceChannels),
        );
      }
      break;
    }
    case '-addvoicechannel': {
      if (roomManager) {
        if (arg1) {
          const channelID = arg1;
          roomManager.add(channelID);
          msg.reply(`room added to tracked rooms: ${channelID}`);
        }
      }
      break;
    }
    case '-removevoicechannel': {
      if (roomManager) {
        if (arg1) {
          const channelID = arg1;
          roomManager.remove(channelID);
          msg.reply(`room removed from tracked rooms: ${channelID}`);
        }
      }
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
      if (notificationManager) {
        if (arg1) {
          const channelID = arg1;
          if (msg.guild) {
            const channel = msg.guild.channels.resolve(channelID);
            if (channel) {
              notificationManager.add({
                id: channel.id,
                name: channel.name,
              });
              msg.reply(`room added to alerts: ${channel.id}`);
            }
          }
        }
      }
      break;
    }
    case '-removetextchannel': {
      if (notificationManager) {
        if (arg1) {
          const channelID = arg1;
          if (msg.guild) {
            const channel = msg.guild.channels.resolve(channelID);
            if (channel) {
              notificationManager.removeByChannelID(channel.id);
              msg.reply(`room removed from alerts: ${channel.id}`);
            }
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
  loggerService.error('something went wrong in discord', e.message);
});

client.login(environmentService.getEnv(DISCORD_TOKEN));
