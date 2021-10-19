import { IMessageSubscriber } from "./IMessageSubscriber";
import { Message, MessagePriority } from "./message";

export class MessageBus {
	private static _subscriberMap: {[identifier: string]: IMessageSubscriber[] } = {};
	private static _normalMessageCapacity = 10;
	private static _messageQueue: Message[] = [];

	private constructor() {}

    public static addSubscription(identifier:string,subscriber:IMessageSubscriber):void{
        let current=MessageBus._subscriberMap[identifier];
        if(current === undefined){
            MessageBus._subscriberMap[identifier]=[];
            current=[];
        }

        if(current.indexOf(subscriber)!==-1){
            console.warn(subscriber+" already exists in sub map with key "+identifier);
        } else{
            MessageBus._subscriberMap[identifier].push(subscriber);
        }
    }


    public static removeSubscription(identifier:string,subscriber:IMessageSubscriber):void{
        let current=MessageBus._subscriberMap[identifier];
        if(current ===undefined){
            console.warn(subscriber+" not subscribed to "+identifier);
            return;
        }

        let index=current.indexOf(subscriber);
        if(index!==-1){
            MessageBus._subscriberMap[identifier].splice(index,1);
        }
    }

    public static post(message:Message):void{
        let subscribers=MessageBus._subscriberMap[message.identifier];
        if(subscribers===undefined){
            console.log("Message "+message+" not posted: No subscribers ");
            return;
        }

        for(let s of subscribers){
            if(message.priority==MessagePriority.HIGH){
                s.receiveMessage(message);
            }else{
                MessageBus._messageQueue.push(message);
            }
        }


    }

    public static update():void{
        if(MessageBus._messageQueue.length===0){
            return;
        }

        let messageLimit=Math.min(MessageBus._normalMessageCapacity,MessageBus._messageQueue.length);
        for(let i=0;i<messageLimit;i++){
            let message=MessageBus._messageQueue.pop();
            for(let s of this._subscriberMap[message.identifier]){
                s.receiveMessage(message);
            }
        
        }
    }



}
