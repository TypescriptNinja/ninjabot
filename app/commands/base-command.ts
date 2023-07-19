import { Container } from 'typedi';
import ChatService from '../services/chat-service';

export default class BaseCommand {
    protected _chatService: ChatService;

    constructor() {
        this._chatService = Container.get(ChatService);
    }

    public init(): void {
        throw new Error('Method not implemented.');
    }

    public destroy(): void {}
}