import Renderer from "./renderer/Renderer";
import { EventMessageSubscriber } from "./message/EventMessageSubscriber";
import { Message } from "./message/Message";
import { EventMessageHandler } from "./message/EventMessageHandler";
import * as MessageConstants from "./message/MessageConstants";

export default class InputHandler implements EventMessageSubscriber {
	targetElement: HTMLCanvasElement;
	renderer: Renderer;
	messageBus: EventMessageHandler;

	constructor(target: HTMLCanvasElement, rend: Renderer) {
		this.targetElement = target;
		this.renderer = rend;
		this.messageBus = EventMessageHandler.getInstance();
	}
	receiveMessage(message: Message): void {}

	update(): void {}

	public initInputEvents(): void {
		this.targetElement.tabIndex = 1000;

		this.targetElement.onkeydown = (event) => {
			if (event.repeat) return;
			var toSent=new Event(MessageConstants.inputKeyDown)
			let key = event.key;
			this.messageBus.post(
				new Message(MessageConstants.inputKeyDown, this, key)
			);
		};

		this.targetElement.onkeyup = (event) => {
			if (event.repeat) return;
			let key = event.key;
			this.messageBus.post(new Message(MessageConstants.inputKeyUp, this, key));
		};

		this.targetElement.onmousedown = (event) => {
			this.messageBus.post(
				new Message(MessageConstants.inputMouseDown, this, [
					event.pageX,
					event.pageY
				])
			);
		};

		this.targetElement.onmouseup = (event) => {
			this.messageBus.post(
				new Message(MessageConstants.inputMouseUp, this, [
					event.pageX,
					event.pageY
				])
			);
		};

		this.targetElement.onmousemove = (event) => {
			this.messageBus.post(
				new Message(MessageConstants.inputMouseMove, this, [
					event.pageX,
					event.pageY
				])
			);
		};

		/* document.onmouseup = (event) => {
			console.log("DOC X:" + event.pageX + " Y:" + event.pageY);
			this.messageBus.post(new Message(MessageConstants.inputMouseUp, document,[event.pageX,event.pageY]));
		};

        document.onmousemove=(event)=>{
            this.messageBus.post(new Message(MessageConstants.inputMouseMove,document,[event.pageX,event.pageY]));
        }; */
	}

	public requestPointerLock() {
		this.targetElement.requestPointerLock();
	}

	public exitPointerLock() {
		document.exitPointerLock();
	}
}
