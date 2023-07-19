import tmi from 'tmi.js';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import BaseCommand from './base-command';
import type { MessageHandler } from '../services/chat-service';

export default class PickMe extends BaseCommand {
    private _chatters: string[] = [];
    private _endCountdown: Subject<void> = new Subject();
    private _startTime: number = 0;
    
    constructor() {
        super();
    }

    public init(): void {
        this._chatService.addCommand('pick', this.start);
        this._chatService.addCommand('pickme', this.join);
    }

    public start: MessageHandler = (_channel: string, _tags: tmi.ChatUserstate, _message: string, _self: boolean): void => {
        if (this._startTime) return;
        this._chatService.say('Starting Pick Me, type \'!pickme\' to enter!');
        this._startTime = 30;
        this._chatters = [];
        interval(1000)
            .pipe(takeUntil(this._endCountdown))
            .subscribe(() => {
                this._startTime--;
                switch (this._startTime) {
                    case 10:
                        this._chatService.say('10 seconds left, type \'!pickme\'');
                        break;
                    case 0:
                        this._endCountdown.next();
                        this._startTime = 0;
                        if (this._chatters.length) {
                            const winner = this._chatters.splice(Math.floor(Math.random() * this._chatters.length), 1)[0];
                            this._chatService.say( `@${winner}, I choose you!`);
                        } else {
                            this._chatService.say('No one entered !pickme, try again later!');
                        }
                }
            });
    }

    public join: MessageHandler = (_channel: string, tags: tmi.ChatUserstate, _message: string, _self: boolean): void => {
        const username = tags.username!;
        if (this._startTime && this._chatters.indexOf(username) === -1) {
            this._chatters.push(username);
            this._chatService.say(`@${username} entered !pickme!`);
        }
    }
}