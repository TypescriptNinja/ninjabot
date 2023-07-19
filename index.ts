import 'reflect-metadata';
import { config } from 'dotenv';
import Questions from './app/commands/questions';
import EightBall from './app/commands/eight-ball';
import PickMe from './app/commands/pick-me';
import BaseCommand from './app/commands/base-command';
import Dice from './app/commands/dice';
import { Container } from 'typedi';
import ChatService from './app/services/chat-service';
import Shoutout from './app/commands/shoutout';

config();

// @ts-ignore
const commands: BaseCommand[] = [
    new PickMe(),
    new Questions(),
    new EightBall(),
    new Dice(),
    new Shoutout()
].forEach(command => command.init());

const chatService = Container.get(ChatService);

chatService.addCommand('lurk', (_channel: string, tags: any, _message: string, _self: boolean): void => {
    chatService.say(`@${tags.username}, thanks for watching!`);
});

// Moar commands for later
// !shoutout
// !hug @username