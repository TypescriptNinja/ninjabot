import tmi from 'tmi.js';
import BaseCommand from './base-command';
import type { MessageHandler } from '../services/chat-service';

export default class Dice extends BaseCommand {

    constructor() {
        super();
    }

    public init(): void {
        this._chatService.addCommand('dice', this.roll);
    }

    public roll: MessageHandler = (_channel: string, tags: tmi.ChatUserstate, message: string, _self: boolean): void => {
        const index = message.indexOf(' ');
        let sides = parseInt(message.slice(index + 1));
        sides = !isNaN(sides) && [2, 4, 6, 8, 10, 12, 20, 100].indexOf(sides) !== -1 ? sides : 6;
        const roll = Math.floor(Math.random() * sides) + 1;
        this._chatService.say(`@${tags.username}, you rolled a ${roll} on a D${sides}`);
    }
}