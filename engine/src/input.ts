import Renderer from "./renderer/renderer";
import { IMessageSubscriber } from "./message/IMessageSubscriber";
import { Message } from "./message/message";
import { MessageBus } from "./message/messageBus";


export default class InputHandler implements IMessageSubscriber{
    targetElement: HTMLCanvasElement;
    renderer: Renderer;
    messageBus:MessageBus;

    constructor(target:HTMLCanvasElement, rend:Renderer){
        this.targetElement=target;
        this.renderer=rend;
        this.messageBus=MessageBus.getInstance();
    }
    receiveMessage(message: Message): void {
    }

    update():void{
        
    }

    onKeyDown(event:KeyboardEvent):void{
        if(event.key==="ArrowUp"){
            console.log("UP!");
        }

    }

    

    public initInputEvents():void{

		

		this.targetElement.onmousemove=event =>{
			//console.log("hi");
		}

		this.targetElement.onmousedown=event=>{
			console.log("X:"+event.pageX+" Y:"+event.pageY);
            this.messageBus.post(new Message("CLICK",this));
		}
	}

}