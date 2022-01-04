import Renderer from "./renderer/renderer";
import { IMessageSubscriber } from "./message/IMessageSubscriber";
import { Message } from "./message/message";
import { MessageBus } from "./message/messageBus";
import * as MessageConstants from "./message/messageConstants";

export default class InputHandler implements IMessageSubscriber {
	targetElement: HTMLCanvasElement;
	renderer: Renderer;
	messageBus: MessageBus;

	constructor(target: HTMLCanvasElement, rend: Renderer) {
		this.targetElement = target;
		this.renderer = rend;
		this.messageBus = MessageBus.getInstance();
	}
	receiveMessage(message: Message): void {}

	update(): void {}

	onKeyDown(event: KeyboardEvent): void {
		if (event.key === "ArrowUp") {
			console.log("UP!");
		}
	}

	public initInputEvents(): void {
		this.targetElement.tabIndex = 1000;

		this.targetElement.onkeydown = (event) => {
			if (event.repeat) return;
			let key = event.key;

			console.log(key);
			this.messageBus.post(new Message(MessageConstants.inputKeyDown, this, key));
		};

		this.targetElement.onkeyup = (event) => {
			if (event.repeat) return;
			let key = event.key;

			console.log("-" + key);
			this.messageBus.post(new Message(MessageConstants.inputKeyUp, this, key));
		};

		this.targetElement.onmousedown = (event) => {
			console.log("X:" + event.pageX + " Y:" + event.pageY);
			this.messageBus.post(new Message(MessageConstants.inputMouseDown, this));
		};

		this.targetElement.onmouseup = (event) => {
			console.log("X:" + event.pageX + " Y:" + event.pageY);
			this.messageBus.post(new Message(MessageConstants.inputMouseUp, this));
		};
	}
}