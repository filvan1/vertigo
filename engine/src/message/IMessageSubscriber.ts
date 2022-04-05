import { Message } from "./Message";

export interface IMessageSubscriber{
    
    receiveMessage(message:Message):void;
}