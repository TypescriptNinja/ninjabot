import tmi from 'tmi.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import BaseCommand from './base-command';
import type { MessageHandler } from '../services/chat-service';

export const questions = [
    'If you could meet any historical figure, who would you choose and why?',
    'What\'s the most adventurous thing you\'ve ever done?',
    'If you could be any animal for a day, which would you be?',
    'What\'s the strangest food you\'ve ever eaten?',
    'If you could only listen to one band or artist for the rest of your life, who would it be?',
    'If you could have any superpower, what would it be and why?',
    'If you could live anywhere in the world, where would it be?',
    'What\'s the most unusual job you\'ve ever had?',
    'What was the last book you read and would you recommend it?',
    'If you won the lottery, what\'s the first thing you would do?',
    'If you were stranded on a desert island, which three items would you want to have with you?',
    'If you could visit any planet in our solar system, which one would you choose and why?',
    'What\'s your favorite thing about the city/country you live in?',
    'What is one thing you\'ve always wanted to try, but have been too scared to?',
    'What\'s the most embarrassing thing that has ever happened to you?',
    'What fictional world would you most like to live in?',
    'If you could be an expert in any subject or activity, what would it be?',
    'What is your most treasured possession and why?',
    'What\'s the best piece of advice you\'ve ever received?',
    'If you could invent anything, what would it be?',
    'What\'s the best gift you\'ve ever received?',
    'If you could time travel, would you go to the past or the future?',
    'What was the last movie that made you cry?',
    'If you could be a character in any movie, who would you be?',
    'What\'s the most challenging thing you\'ve ever done?'
];

export default class Questions extends BaseCommand {
    private _questionList: string[] = [];
    private _awkwardSilence = (Math.round(Math.random() * 2) + 3) * 60 * 1000;
    private _timeOut = 0;
    private _unsubscribe: Subject<void> = new Subject();

    constructor() {
        super();
    }

    public init(): void {
        this._chatService.addCommand('question', this.questionHandler);
        this._chatService.$chatted.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            // clearTimeout(this._timeOut);
            // this._timeOut = 0;
            // this._awkwardSilence = (Math.round(Math.random() * 2) + 3) * 60 * 1000;
            // // @ts-ignore
            // this._timeOut = setTimeout(() => this.sayQuestion(), this._awkwardSilence);
        });
    }

    public questionHandler: MessageHandler = (_channel: string, _tags: tmi.ChatUserstate, _message: string, _self: boolean): void => {
        this.sayQuestion();
    }

    private sayQuestion(): void {
            if (!this._questionList.length) {
                this._questionList = questions.slice();
            }
            const question = this._questionList.splice(Math.floor(Math.random() * this._questionList.length), 1)[0];
            this._chatService.say(question);
    }

    public destroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

}