import Renderer from "./renderer/Renderer";
import InputHandler from "./InputHandler";

var canvasID = "vertigoCanvas";

export class Engine {
	initialize() {
		//console.log("todo: fix bak code to this workspace");
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>(
			document.getElementById(canvasID)
		);
		if (canvas === undefined)
			throw new Error(
				"Cannot find destination canvas element with name:" + canvasID
			);
        let rend = new Renderer(canvas);
        rend.init();
		
        //Initialize input handling for the current HTML page body
        let inputHandler=new InputHandler(document.body);

	}

    
}
