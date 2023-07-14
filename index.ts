import tmi from 'tmi.js';
import { config } from 'dotenv';
import { questions } from './app/questions';
import { eightBall } from './app/eight-ball';
import PickMe from './app/pick-me';

config();
let awkwardSilence = (Math.round(Math.random() * 2) + 3) * 60 * 1000;
let timeOut = 0;
let questionList: string[] = [];

const client = new tmi.Client({
    options: { debug: true },
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    },
    // @ts-ignore
    channels: [process.env.TWITCH_CHANNEL_NAME]
});

const sayQuestion = ():void => {
    if (!questionList.length) {
        questionList = questions.slice();
    }
    const question = questionList.splice(Math.floor(Math.random() * questionList.length), 1)[0];
    client.say(`#${process.env.TWITCH_CHANNEL_NAME}`, question);
}

const resetAwkwardSilence = () => {
    // clearTimeout(timeOut);
    // timeOut = 0;
    // awkwardSilence = (Math.round(Math.random() * 2) + 3) * 60 * 1000;
    // // @ts-ignore
    // timeOut = setTimeout(() => {
    //     sayQuestion();
    //     resetAwkwardSilence();
    // }, awkwardSilence);
}

client.connect().catch(console.error);
const lottery = new PickMe(client);
resetAwkwardSilence();
client.on('message', (channel, tags, message, self) => {
    resetAwkwardSilence();
    if (self) return;
    const commandData = message.trim().match(/\!\w*/);
    if (!!commandData && commandData.length) {
        const command = commandData[0].slice(1);
        switch (command) {
            case 'question':
                sayQuestion();
                break;
            case 'pick':
                lottery.start();
                break;
            case 'pickme':
                lottery.join(tags.username!);
                break;
            case '8ball':
                const answer = eightBall[Math.floor(Math.random() * eightBall.length)];
                client.say(channel, `@${tags.username}, ${answer}`);
                break;
            case 'lurk':
                client.say(channel, `@${tags.username}, thanks for watching!`);
                break;
            case 'dice':
                const index = message.indexOf(' ');
                let sides = parseInt(message.slice(index + 1));
                sides = !isNaN(sides) && [2, 4, 6, 8, 10, 12, 20, 100].indexOf(sides) > -1 ? sides : 6;
                const roll = Math.floor(Math.random() * sides) + 1;
                client.say(channel, `@${tags.username}, you rolled a ${roll} on a ${sides} sided die!`);
                break;  
        }
    }
});

// Moar commands for later
// !shoutout
// !hug @username