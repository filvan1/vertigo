
export enum MessagePriority{
    NORMAL,
    HIGH
}

export class Message{

    

    public identifier:string;
    public payload:any;
    public priority:MessagePriority;
    public sender:any;
    

    public constructor(identifier:string,sender:any,payload?:any,priority=MessagePriority.NORMAL){
        this.identifier=identifier;
        this.sender=sender;
        this.payload=payload;
        this.priority=priority;
    }

}