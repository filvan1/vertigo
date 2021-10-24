import Renderer from "./renderer/renderer";
import InputHandler from "./input";
import { MessageBus } from "./message/messageBus";
import ImageSource from "./wall.jpg";

var canvasID = "vertigoCanvas";

export class Engine {
	private _canvas: HTMLCanvasElement;
	private _renderer: Renderer;

	constructor(canvasID: string = "vertigoCanvas") {
		this._canvas = <HTMLCanvasElement>document.getElementById(canvasID);
		if (this._canvas === undefined)
			throw new Error(
				"FATAL: Cannot find destination canvas element with name:" + canvasID
			);
	}

	initialize() {
		this._renderer = new Renderer(this._canvas);
		/*var _image = new Image();
		
		console.log(_image);
			
		_image.onload = function(){
			console.log("image loaded!");
			
		};
		_image.src = "src/wall.jpg";*/
		let inputHandler = new InputHandler(this._canvas, this._renderer);
		inputHandler.initInputEvents();
		this.run();
		
	}

	protected static sendInputMessage(message: string): void {}

	public run(): void {
		const gameLoop = () => {
			MessageBus.update();
			window.requestAnimationFrame(gameLoop);
		};

		window.requestAnimationFrame(gameLoop);
	}
}
