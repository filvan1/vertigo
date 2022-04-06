import { Message } from "./Message";

export interface EventMessageSubscriber{
    
    receiveMessage(message:Message):void;
}