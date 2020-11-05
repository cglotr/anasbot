# anasbot
[![Build Status](https://travis-ci.org/cglotr/anasbot.svg?branch=master)](https://travis-ci.org/cglotr/anasbot)
[![codecov](https://codecov.io/gh/cglotr/anasbot/branch/master/graph/badge.svg?token=38CCR2C7IW)](undefined)

_anasbot_ is a bot that helps to keep track of available voice channels to play [Among Us](http://www.innersloth.com/gameAmongUs.php).

![anasbot](https://i.imgur.com/X10tf9H.png "anasbot in action")

| Command                                 | Description                                             |
| --------------------------------------- | ------------------------------------------------------- |
| `-start`                                | Initializes the bot.                                    |
| `-info`                                 | Get the bot's info.                                     |
| `-voicechannels`                        | List all voice channels.                                |
| `-addvoicechannel <channel-id>`         | Add voice channel to tracked voice channels.            |
| `-removevoicechannel <channel-id>`      | Remove voice channel from tracked voice channels.       |
| `-textchannels`                         | List all text  channels.                                |
| `-addtextchannel <channel-id>`          | Add text channel to alerts.                             |
| `-removetextchannel <channel-id>`       | Remove text channel from alerts.                        |
| `-alert`                                | Add text channel to alerts.                             |
| `-unalert`                              | Remove text channel from alerts.                        |
| `-quick`, `-q`                          | Show recommended game.                                  |
|                                         |                                                         |

## Development

1. Create `.env` file using `.env.sample` & specify the token.
2. `npm install`
3. `npm run watch-ts`
4. `npm run serve-debug`

## Test

`npm run test`

## Lint

`npm run lint`

## Deployment

#### Heroku

1. `heroku login`
2. `heroku create anasbot`
3. `heroku scale worker=1`
4. `git push heroku master`
5. `heroku logs -t`
