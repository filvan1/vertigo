import Renderer from "./renderer/renderer";
import InputHandler from "./input";
import { MessageBus } from "./message/messageBus";
import { IMessageSubscriber } from "./message/IMessageSubscriber";
import { Message } from "./message/message";

var canvasID = "vertigoCanvas";

export class Engine implements IMessageSubscriber{
	private _canvas: HTMLCanvasElement;
	private _renderer: Renderer;
	private _messageBus:MessageBus;
	private _render:boolean=false;

	constructor(canvasID: string = "vertigoCanvas") {
		this._canvas = <HTMLCanvasElement>document.getElementById(canvasID);
		if (this._canvas === undefined)
			throw new Error(
				"FATAL: Cannot find destination canvas element with name:" + canvasID
			);
			
	}
	receiveMessage(message: Message): void {
		console.log("engine received "+message.identifier);
		this._render=true;
	}

	initialize() {
		this._messageBus=MessageBus.getInstance();
		this._messageBus.addSubscription("renderer_started", this);
		this._renderer = new Renderer(this._canvas);
		
		let inputHandler = new InputHandler(this._canvas, this._renderer);
		inputHandler.initInputEvents();
		this.run();
		
	}

	

	protected static sendInputMessage(message: string): void {}

	public run(): void {
		const gameLoop = () => {
			this._messageBus.update();	
			if(this._render)this._renderer.render();		
			window.requestAnimationFrame(gameLoop);
		};

		window.requestAnimationFrame(gameLoop);
	}
}
