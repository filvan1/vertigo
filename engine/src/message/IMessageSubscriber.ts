import { Message } from "./message";

export interface IMessageSubscriber{
    
    receiveMessage(message:Message):void;
}