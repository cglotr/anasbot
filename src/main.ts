import Discord from 'discord.js';
import { config } from 'dotenv';
import { DiscordGuild } from './discord/discordguild';
import { NotificationManager } from './managers/notificationmanager';
import { NotificationManagerImpl } from './managers/notificationmanagerimpl';
import { QueueManager } from './managers/queuemanager';
import { QueueManagerImpl } from './managers/queuemanagerimpl';
import { QuickManager } from './managers/quickmanager';
import { QuickManagerImpl } from './managers/quickmanagerimpl';
import { RoomManager } from './managers/roommanager';
import { RoomManagerImpl } from './managers/roommanagerimpl';
import { DiscordServiceImpl } from './services/discordserviceimpl';
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

config();

const client = new Discord.Client();

const loggerService: LoggerService = new LoggerServiceImpl();
const messageStringService: MessageStringService = new MessageStringServiceImpl();
const voiceChannelService: VoiceChannelService = new VoiceChannelServiceImpl();
const environmentService: EnvironmentService = new EnvironmentServiceImpl();

let queueManager: QueueManager;
let roomManager: RoomManager;
let notificationManager: NotificationManager;
let quickManager: QuickManager;

function start(guild: DiscordGuild): void {
  loggerService.info('initializing room manager...');
  roomManager = new RoomManagerImpl(
    voiceChannelService,
    new DiscordServiceImpl(),
    loggerService,
    environmentService,
    guild,
  );

  loggerService.info('initializing notification manager...');
  notificationManager = new NotificationManagerImpl(
    new TextChannelServiceImpl(),
    new DiscordServiceImpl(),
    loggerService,
    environmentService,
    guild,
  );

  loggerService.info('initializing quick manager...');
  quickManager = new QuickManagerImpl(
    new TextChannelServiceImpl(),
    new DiscordServiceImpl(),
    loggerService,
    environmentService,
    guild,
  );

  loggerService.info('initializing queue manager...');
  queueManager = new QueueManagerImpl(loggerService, voiceChannelService);

  loggerService.info(`anasbot started: guild=${guild.id}`);
}

client.on('ready', () => {
  const guildID = environmentService.getGuildID();
  if (guildID) {
    const guild = client.guilds.resolve(guildID);
    if (guild) {
      start(guild);
    }
  }
  const alertIntervalSec = environmentService.getAlertInterval();
  client.setInterval(() => {
    if (roomManager) {
      const rooms = roomManager.listAvailableRooms(5);
      if (rooms.length > 0) {
        if (notificationManager) {
          notificationManager.list().forEach((channel) => {
            client.channels.fetch(channel.id).then((resolvedChannel) => {
              if (resolvedChannel instanceof Discord.TextChannel) {
                let content = '';
                content += ':christmas_tree:\n\n';
                content += '**Available Game Channels** :tada: :tada: :tada:\n';
                content +=
                  '_Looking for a quick game? Try using `-q` command._\n\n';
                content += messageStringService.printAvailableGameChannels(
                  rooms,
                );
                content += '\n';
                content +=
                  'https://tenor.com/view/christmas-snow-christmas-tree-gif-7301044\n';
                resolvedChannel.send(content);
              }
            });
          });
        }
      }
    }
  }, alertIntervalSec * 1000);

  const solveQueueIntervalSec = environmentService.getSolveQueueInterval();
  client.setInterval(() => {
    queueManager.solveQueue().forEach(async ({ userId, channelId }) => {
      const user = await client.users.fetch(userId);
      user.createDM().then((msg) => {
        const channel = voiceChannelService
          .list()
          .find((ch) => ch.id === channelId);
        if (channel) {
          msg.send(channel.link);
        } else {
          loggerService.warning(
            `Attempted to ask user with userId:${userId} to join a voice channel with channelId:${channelId} that does not exist in our voice channel service.`,
          );
        }
      });
    });
  }, solveQueueIntervalSec * 1000);

  loggerService.info(`alert interval set at ${alertIntervalSec} sec`);
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
      if (roomManager && quickManager) {
        if (
          !quickManager
            .list()
            .map((channel) => channel.id)
            .includes(msg.channel.id)
        ) {
          msg.author.createDM().then((channel) => {
            let content = ``;
            content += `Hello :wave:,\n\n`;
            content += `Looks like you used \`-q\` command inside an unsupported text channel!\n`;
            content += `Can you try again inside these text channels?\n\n`;
            content += messageStringService.printQuickChannels(
              quickManager.list(),
            );
            content += `\nThanks! :pray:`;
            channel.send(content);
          });
          break;
        }
        // User wants to join _any_ rooms
        if (arg1 === '') {
          msg.reply('looking for available game... :woman_detective:');
          const rooms = roomManager.listAvailableRooms(1);
          if (rooms.length < 1) {
            msg.channel.send(
              'Hmm, looks like no room is looking for players right now :sob:',
            );
            break;
          } else {
            msg.channel.send(
              messageStringService.printAvailableGameChannels(rooms),
            );
          }
        } else {
          const channel = voiceChannelService
            .list()
            .find((ch) => ch.position.toString() === arg1);
          if (channel) {
            queueManager.addUserToQueue(msg.author.id, channel.id);
          }
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
      if (quickManager) {
        info += messageStringService.printQuickChannels(quickManager.list());
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
    case '-addquickchannel': {
      if (quickManager) {
        if (arg1) {
          const channelID = arg1;
          if (msg.guild) {
            const channel = msg.guild.channels.resolve(channelID);
            if (channel) {
              quickManager.add({
                id: channel.id,
                name: channel.name,
              });
              msg.reply(`room added to quicks: ${channel.id}`);
            }
          }
        }
      }
      break;
    }
    case '-removequickchannel': {
      if (quickManager) {
        if (arg1) {
          const channelID = arg1;
          if (msg.guild) {
            const channel = msg.guild.channels.resolve(channelID);
            if (channel) {
              quickManager.removeByChannelID(channel.id);
              msg.reply(`room removed from quicks: ${channel.id}`);
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

client.login(environmentService.getDiscordToken());
