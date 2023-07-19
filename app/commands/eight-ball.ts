import tmi from 'tmi.js';
import BaseCommand from './base-command';
import type { MessageHandler } from '../services/chat-service';

export const eightBall = [
    'It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes - definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'Outlook good.',
    'Yes.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now...',
    'Cannot predict now.',
    'Concentrate and ask again.',
    'Don\'t count on it.',
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good...',
    'Very doubtful.'
];

export default class EightBall extends BaseCommand {
    constructor() {
        super();
    }

    public init(): void {
        this._chatService.addCommand('8ball', this.shake);
    }

    public shake: MessageHandler = (_channel: string, tags: tmi.ChatUserstate, _message: string, _self: boolean): void => {
        const username = tags.username!;
        const answer = eightBall[Math.floor(Math.random() * eightBall.length)];
        this._chatService.say(`@${username}, ${answer}`);
    }
}