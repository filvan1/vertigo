import VertexShaderSource from "./shaders/vertex.glsl";
import FragmentShaderSource from "./shaders/fragment.glsl";
import { IMessageSubscriber } from "../message/IMessageSubscriber";
import { Message } from "../message/message";
import { MessageBus } from "../message/messageBus";

export var gl: WebGL2RenderingContext;
var _canvas: HTMLCanvasElement;

export default class Renderer implements IMessageSubscriber{
	constructor(target: HTMLCanvasElement) {
		_canvas = target;

        if (_canvas == null) {
			throw new Error("Canvas initialization failed!");
		}

		gl = _canvas.getContext("webgl2");
		if (gl === undefined) throw new Error("Unable to initiaze WebGL");
		MessageBus.addSubscription("CLICK",this);
	}

	receiveMessage(message: Message): void {
		console.log("Renderer received "+message.identifier);
	}

	 
	public get getRenderer() : Renderer {
		return this;
	}
	

	init() {

		var vert = Renderer.createShader(gl, gl.VERTEX_SHADER, VertexShaderSource);
		var frag = Renderer.createShader(gl, gl.FRAGMENT_SHADER, FragmentShaderSource);

		var program = Renderer.createProgram(gl, vert, frag);
        //Tell WebGL to use our program
		gl.useProgram(program);

		if (program == null) {
			throw new Error("Program creation failed!");
		}
		

		//Look up where our compiled attribute ended up
		var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

		//Create a buffer and tell WebGL what it's for
		var positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		var positions = [0, 0, 0, 0.5, 0.7, 0];
		//Bind data to the buffer and tell it that the data won't change that much.
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		//Create and bind vertex list, oh yeah!
		var vao = gl.createVertexArray();
		gl.bindVertexArray(vao);
		//"Turn on" the attribute so that we can use the data. If we don't do this the attribute will be a constant
		gl.enableVertexAttribArray(positionAttributeLocation);

		//Tell WebGL how to get the data out. Binds current ARRAY_BUFFER to the attribute, so now we can bind whatever
		var size = 2; // 2 components per iteration
		var type = gl.FLOAT; // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0; // start at the beginning of the buffer

		//This binds current ARRAY_BUFFER to the vertex attribute, so now the ARRAY_BUFFER can be freely changed without impacting it.
		gl.vertexAttribPointer(
			positionAttributeLocation,
			size,
			type,
			normalize,
			stride,
			offset
		);

		//Resize the GL Canvas to the size determined by CSS
		Renderer.resizeCanvasToDisplaySize(_canvas);
		//Tell WebGL that the viewport has changed!
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		//Scrub the canvas
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		

		var primitiveType = gl.TRIANGLES;
		var offset = 0;
		var count = 3;

		/*Iterates through the array and draws them even if the vertices have been loaded before. 
      gl.drawElements is quicker in many cases, since it caches repeated vertices in the gpu. 
      */
		gl.drawArrays(primitiveType, offset, count);

        

	}

	public render():void{
		//Resize the GL Canvas to the size determined by CSS
		Renderer.resizeCanvasToDisplaySize(_canvas);
		//Tell WebGL how to convert from clip space to pixels!
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		//Scrub the canvas
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		

		var primitiveType = gl.TRIANGLES;
		var offset = 0;
		var count = 3;

		/*Iterates through the array and draws them even if the vertices have been loaded before. 
      gl.drawElements is quicker in many cases, since it caches repeated vertices in the gpu. 
      */
		gl.drawArrays(primitiveType, offset, count);

	}

	//#region Helper functions --------------------------------------------------------

	/**
	 * Compiles a shader and returns it. If compilation fails, log the shader code and delete the shader from the context.
	 * @param gl WebGL Context
	 * @param type Shader Type
	 * @param source Shader source code
	 */
	static createShader(
		gl: WebGL2RenderingContext,
		type: number,
		source: string
	) {
		var shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (success) {
			return shader;
		}

		console.log(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
	}

	/**
	 * Links the compiled shaders with the GL context and creates a program on the GPU.
	 * @param gl WebGL Context
	 * @param vertexShader Vertex shader
	 * @param fragmentShader Fragment shader
	 */
	static createProgram(
		gl: WebGL2RenderingContext,
		vertexShader: WebGLShader,
		fragmentShader: WebGLShader
	) {
		var program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		var success = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (success) {
			return program;
		}

		console.log(gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
	}

	/**
	 * Resizes display to HTML canvas size set by CSS
	 * @param canvas Canvas HTML element
	 */
	static resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
		// Lookup the size the browser is displaying the canvas in CSS pixels.
		const displayWidth = canvas.clientWidth;
		const displayHeight = canvas.clientHeight;
		// Check if the canvas is not the same size.
		const needResize =
			canvas.width !== displayWidth || canvas.height !== displayHeight;

		if (needResize) {
			// Make the canvas the same size
			canvas.width = displayWidth;
			canvas.height = displayHeight;
		}
	}
	//#endregion
}
