import * as constants from './constants';

test('DEFAULT_NOTIFICATION_CHANNELS', () => {
  expect(constants.DEFAULT_NOTIFICATION_CHANNELS).toEqual(
    'DEFAULT_NOTIFICATION_CHANNELS',
  );
});

test('DEFAULT_VOICE_CHANNELS', () => {
  expect(constants.DEFAULT_VOICE_CHANNELS).toEqual('DEFAULT_VOICE_CHANNELS');
});

test('DISCORD_TOKEN', () => {
  expect(constants.DISCORD_TOKEN).toEqual('DISCORD_TOKEN');
});

test('GUILD_ID', () => {
  expect(constants.GUILD_ID).toEqual('GUILD_ID');
});
