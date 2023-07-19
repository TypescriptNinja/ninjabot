import tmi from 'tmi.js';
import BaseCommand from './base-command';
import type { MessageHandler } from '../services/chat-service';

export default class Shoutout extends BaseCommand {

    constructor() {
        super();
    }

    public init(): void {
        this._chatService.addCommand('so', this.shoutout);
    }

    public shoutout: MessageHandler = (channel: string, tags: tmi.ChatUserstate, message: string, _self: boolean): void => {
        if (tags.badges?.broadcaster !== '1') return;
        const streamer = message.split(' ')[1];
        if (!streamer) return;
        this._chatService.say(`Check out this awesome streamer: https://twitch.tv/${streamer}!`);
    }
}