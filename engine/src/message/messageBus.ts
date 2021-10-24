import { IMessageSubscriber } from "./IMessageSubscriber";
import { Message, MessagePriority } from "./message";

export class MessageBus {
	private  _subscriberMap: {[identifier: string]: IMessageSubscriber[] } = {};
	private  _normalMessageCapacity = 10;
	private  _messageQueue: Message[] = [];

    private static _instance:MessageBus;

	private constructor() {}

    public static getInstance(){
        if(MessageBus._instance==null){
            MessageBus._instance=new MessageBus();
        }
        return MessageBus._instance;
    }

    public addSubscription(identifier:string,subscriber:IMessageSubscriber):void{
        let current=this._subscriberMap[identifier];
        if(current === undefined){
            this._subscriberMap[identifier]=[];
            current=[];
        }

        if(current.indexOf(subscriber)!==-1){
            console.warn(subscriber+" already exists in sub map with key "+identifier);
        } else{
            this._subscriberMap[identifier].push(subscriber);
        }
    }


    public  removeSubscription(identifier:string,subscriber:IMessageSubscriber):void{
        let current=this._subscriberMap[identifier];
        if(current ===undefined){
            console.warn(subscriber+" not subscribed to "+identifier);
            return;
        }

        let index=current.indexOf(subscriber);
        if(index!==-1){
            this._subscriberMap[identifier].splice(index,1);
        }
    }

    public  post(message:Message):void{
        let subscribers=this._subscriberMap[message.identifier];
        if(subscribers===undefined){
            console.log("Message "+message+" not posted: No subscribers ");
            return;
        }

        for(let s of subscribers){
            if(message.priority==MessagePriority.HIGH){
                s.receiveMessage(message);
            }else{
                this._messageQueue.push(message);
                console.log("pushed "+message.identifier)
            }
        }


    }

    public  update():void{
        if(this._messageQueue.length===0){
            return;
        }

        let messageLimit=Math.min(this._normalMessageCapacity,this._messageQueue.length);
        for(let i=0;i<messageLimit;i++){
            let message=this._messageQueue.pop();
            for(let s of this._subscriberMap[message.identifier]){
                s.receiveMessage(message);
            }
        
        }
    }



}
