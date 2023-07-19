import tmi from 'tmi.js';
import { Service} from 'typedi';
import { Subject } from 'rxjs';

export type MessageHandler = (channel: string, tags: tmi.ChatUserstate, message: string, self: boolean) => void;

@Service()
export default class ChatService {
    private _client: tmi.Client;
    private _commands: { [key: string]: MessageHandler } = {};
    private _chatted: Subject<void> = new Subject();

    public $chatted = this._chatted.asObservable();

    constructor() {
        this._client= new tmi.Client({
            options: { debug: true },
            identity: {
                username: process.env.TWITCH_BOT_USERNAME,
                password: process.env.TWITCH_OAUTH_TOKEN
            },
            channels: [process.env.TWITCH_CHANNEL_NAME!]
        });
        this._client.connect().catch(console.error);
        this._client.on('message', this.handleMessages);
    }

    public addCommand(command: string, handler: MessageHandler): void {
        this._commands[command] = handler;
    }

    public say(message: string): void {
        this._client.say(`#${process.env.TWITCH_CHANNEL_NAME}`, message);
    }

    private handleMessages = (channel: string, tags: tmi.ChatUserstate, message: string, self: boolean): void => {
        if (self) return;
        const commandData = message.trim().match(/^\!\w*/);
        if (!!commandData && commandData.length) {
            const command = commandData[0].slice(1);
            if (this._commands[command]) {
                this._commands[command](channel, tags, message, self);
            }
        }    
    }

}