import Renderer from "./renderer/Renderer";
import InputHandler from "./Input";
import { EventMessageHandler } from "./message/EventMessageHandler";
import { EventMessageSubscriber } from "./message/EventMessageSubscriber";
import { Message } from "./message/Message";

var canvasID = "vertigoCanvas";

export class Engine implements EventMessageSubscriber{
	private _canvas: HTMLCanvasElement;
	private _renderer: Renderer;
	private _messageBus:EventMessageHandler;
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
		this._messageBus=EventMessageHandler.getInstance();
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
