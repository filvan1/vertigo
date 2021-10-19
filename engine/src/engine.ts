import Renderer from "./renderer/renderer";
import InputHandler from "./input";
import { MessageBus } from "./message/messageBus";

var canvasID = "vertigoCanvas";

export class Engine {

	private _canvas:HTMLCanvasElement;
	private _renderer:Renderer;

	constructor(canvasID:string="vertigoCanvas"){
		this._canvas = <HTMLCanvasElement>(
			document.getElementById(canvasID)
		);
		if (this._canvas === undefined)
			throw new Error(
				"FATAL: Cannot find destination canvas element with name:" + canvasID
			);
	}

	initialize() {
        this._renderer = new Renderer(this._canvas);
        this._renderer.init();

		let inputHandler=new InputHandler(this._canvas,this._renderer);
		inputHandler.initInputEvents();
		this.run();
	}

	protected static sendInputMessage(message:string):void{
		
	}

	public run():void{

		const gameLoop=()=>{
			MessageBus.update();


			window.requestAnimationFrame(gameLoop);
		};

		window.requestAnimationFrame(gameLoop);

	}

    
}
