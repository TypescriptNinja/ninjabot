import tmi from 'tmi.js';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export default class PickMe {
    private _chatters: string[] = [];
    private _endCountdown: Subject<void> = new Subject();
    private _startTime: number = 0;
    
    constructor(private _client: tmi.Client) {}

    public start(): void {
        if (this._startTime) return;
        this._client.say(`#${process.env.TWITCH_CHANNEL_NAME}`, 'Starting Pick Me, type \'!pickme\' to enter!');
        this._startTime = 30;
        this._chatters = [];
        interval(1000)
            .pipe(takeUntil(this._endCountdown))
            .subscribe(() => {
                this._startTime--;
                switch (this._startTime) {
                    case 10:
                        this._client.say(`#${process.env.TWITCH_CHANNEL_NAME}`, '10 seconds left, type \'!pickme\'');
                        break;
                    case 0:
                        this._endCountdown.next();
                        this._startTime = 0;
                        if (this._chatters.length) {
                            const winner = this._chatters.splice(Math.floor(Math.random() * this._chatters.length), 1)[0];
                            this._client.say(`#${process.env.TWITCH_CHANNEL_NAME}`, `@${winner}, I choose you!`);
                        } else {
                            this._client.say(`#${process.env.TWITCH_CHANNEL_NAME}`, 'No one entered !pickme, try again later!');
                        }
                }
            });
    }

    public join(username: string): void {
        if (this._startTime) {
            this._chatters.push(username);
            this._client.say(`#${process.env.TWITCH_CHANNEL_NAME}`, `@${username} entered !pickme!`);
        }
    }
}