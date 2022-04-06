import VertexShaderSource from "./shaders/vertex.glsl";
import FragmentShaderSource from "./shaders/fragment.glsl";
import AltVertexShaderSource from "./shaders/testVert.glsl";
import AltFragmentShaderSource from "./shaders/testFrag.glsl";
import { EventMessageSubscriber } from "../message/EventMessageSubscriber";
import { Message } from "../message/Message";
import { EventMessageHandler } from "../message/EventMessageHandler";
import importImage from "../../res/wall.jpg";
import { glMatrix, mat4, vec3 } from "gl-matrix";
import * as MessageConstants from "../message/MessageConstants";
import Mesh from "./Mesh";
import { LoadGLB } from "./LoadFile";
import { Console, debug } from "console";

export var gl: WebGL2RenderingContext;
var _canvas: HTMLCanvasElement;
var _program, altProgram;
var _vao;
var _texture;
var _ebo;
var _indices;
var model, view, projection;

const fovPerPixel=.1*Math.PI/180;
var _fov=45;

var cameraYaw = -90,
	cameraPitch = 0;
var cameraPos, cameraUp, cameraRight, cameraFront;

var mouseFirst = false;

var deltaTime = 0,
	lastFrame = 0;

var w = false,
	a = false,
	s = false,
	d = false,
	e = false,
	q = false;

export default class Renderer implements EventMessageSubscriber {
	messageBus: EventMessageHandler;

	constructor(target: HTMLCanvasElement) {
		this.messageBus = EventMessageHandler.getInstance();
		_canvas = target;

		if (_canvas == null) {
			throw new Error("Canvas initialization failed!");
		}

		gl = _canvas.getContext("webgl2");
		if (gl === undefined) throw new Error("Unable to initiaze WebGL");

		//Initialize input message subscriptions
		this.messageBus.addSubscription(MessageConstants.inputKeyDown, this);
		this.messageBus.addSubscription(MessageConstants.inputKeyUp, this);
		this.messageBus.addSubscription(MessageConstants.inputMouseDown, this);
		this.messageBus.addSubscription(MessageConstants.inputMouseUp, this);

		var image = new Image();
		image.onload = (event) => {
			this.init(image);
			this.messageBus.post(new Message("renderer_started", this));
		};
		image.onerror = (error) => {
			console.log(error);
		};
		image.src = importImage;
	}

	receiveMessage(message: Message): void {
		let m = message.identifier;
		let p = message.payload;
		if (m == MessageConstants.inputKeyDown) {
			switch (p) {
				case "w":
					w = true;
					break;
				case "a":
					a = true;
					break;
				case "s":
					s = true;
					break;
				case "d":
					d = true;
					break;
				case "e":
					e = true;
					break;
				case "q":
					q = true;
					break;
			}
		} else if (m == MessageConstants.inputKeyUp) {
			switch (p) {
				case "w":
					w = false;
					break;
				case "a":
					a = false;
					break;
				case "s":
					s = false;
					break;
				case "d":
					d = false;
					break;
				case "e":
					e = false;
					break;
				case "q":
					q = false;
					break;
			}
		}

		if (m == MessageConstants.inputMouseDown) {
			this.messageBus.addSubscription(MessageConstants.inputMouseMove, this);
			//message.sender.requestPointerLock();
			mouseFirst = true;
			processMouse(p);
		} else if (m == MessageConstants.inputMouseUp) {
			this.messageBus.removeSubscription(MessageConstants.inputMouseMove, this);
			//message.sender.exitPointerLock();
		}

		if (m == MessageConstants.inputMouseMove) {
			processMouse(p);
		}
	}

	public get getRenderer(): Renderer {
		return this;
	}

	async init(image) {
		var vert = Renderer.createShader(gl, gl.VERTEX_SHADER, VertexShaderSource);
		var frag = Renderer.createShader(
			gl,
			gl.FRAGMENT_SHADER,
			FragmentShaderSource
		);

		var altVert = Renderer.createShader(
			gl,
			gl.VERTEX_SHADER,
			AltVertexShaderSource
		);
		var altFrag = Renderer.createShader(
			gl,
			gl.FRAGMENT_SHADER,
			AltFragmentShaderSource
		);

		altProgram = Renderer.createProgram(gl, altVert, altFrag);

		_program = Renderer.createProgram(gl, vert, frag);

		var currentProgram=_program;
		
		//Tell WebGL to use our program
		gl.useProgram(currentProgram);

		if (currentProgram == null) {
			throw new Error("Program creation failed!");
		}

		//Maybe not delete?

		/* 
		gl.deleteShader(vert);
		gl.deleteShader(frag);
 */
		//Resize the GL Canvas to the size determined by CSS
		Renderer.resizeCanvasToDisplaySize(_canvas);

		//Camera
		cameraPos = vec3.fromValues(0, 0, 3);
		cameraFront = vec3.fromValues(0, 0, -1);
		cameraUp = vec3.fromValues(0, 1, 0);
		cameraRight = vec3.create;
//REMOVE
		
		/*var test=Mesh.CreateCube();
		console.log("created mesh :\n"+test)
		

		var vertices=test.vertices;
		_indices=test.indices;*/
		LoadGLB("binaryCube.glb");
		//pos:x,y,z; colour:r,g,b; texture:s,t
		
		var vertices = [
			-0.5, -0.5, -0.5, 0.0, 0.0, 0.5, -0.5, -0.5, 1.0, 0.0, 0.5, 0.5, -0.5,
			1.0, 1.0, 0.5, 0.5, -0.5, 1.0, 1.0, -0.5, 0.5, -0.5, 0.0, 1.0, -0.5, -0.5,
			-0.5, 0.0, 0.0, -0.5, -0.5, 0.5, 0.0, 0.0, 0.5, -0.5, 0.5, 1.0, 0.0, 0.5,
			0.5, 0.5, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0, -0.5, 0.5, 0.5, 0.0, 1.0,
			-0.5, -0.5, 0.5, 0.0, 0.0, -0.5, 0.5, 0.5, 1.0, 0.0, -0.5, 0.5, -0.5, 1.0,
			1.0, -0.5, -0.5, -0.5, 0.0, 1.0, -0.5, -0.5, -0.5, 0.0, 1.0, -0.5, -0.5,
			0.5, 0.0, 0.0, -0.5, 0.5, 0.5, 1.0, 0.0, 0.5, 0.5, 0.5, 1.0, 0.0, 0.5,
			0.5, -0.5, 1.0, 1.0, 0.5, -0.5, -0.5, 0.0, 1.0, 0.5, -0.5, -0.5, 0.0, 1.0,
			0.5, -0.5, 0.5, 0.0, 0.0, 0.5, 0.5, 0.5, 1.0, 0.0, -0.5, -0.5, -0.5, 0.0,
			1.0, 0.5, -0.5, -0.5, 1.0, 1.0, 0.5, -0.5, 0.5, 1.0, 0.0, 0.5, -0.5, 0.5,
			1.0, 0.0, -0.5, -0.5, 0.5, 0.0, 0.0, -0.5, -0.5, -0.5, 0.0, 1.0, -0.5,
			0.5, -0.5, 0.0, 1.0, 0.5, 0.5, -0.5, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 0.0,
			0.5, 0.5, 0.5, 1.0, 0.0, -0.5, 0.5, 0.5, 0.0, 0.0, -0.5, 0.5, -0.5, 0.0,
			1.0
		];
		_indices = new Uint16Array([0, 1, 3, 1, 2, 3]);


		
		model = mat4.create();
		model = mat4.rotate(
			model,
			model,
			glMatrix.toRadian(-55),
			vec3.fromValues(1, 0, 0)
		);

		view = mat4.create();
		view = mat4.lookAt(
			view,
			vec3.fromValues(0, 0, 3),
			vec3.fromValues(0, 0, 0),
			vec3.fromValues(0, 1, 0)
		);

		_fov=gl.canvas.clientHeight*fovPerPixel; // before: glMatrix.toRadian(90);

		projection = mat4.create();
		projection = mat4.perspective(
			projection,
			_fov,
			_canvas.clientWidth /_canvas.clientHeight ,
			0.1,
			100
		);

		/*
			OBJ READING -----------------------------------------
		*/
		
		/* const response= await fetch('../../res/cube.obj');
		const text=await response.text;
		const data = parseOBJ(text);
		
		 */

		//Bind vertex array object, contains vertex buffer objects
		_vao = gl.createVertexArray();
		gl.bindVertexArray(_vao);

		//Copy vertices from array to vertex buffer object vbo
		var vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		//Copy indices from array to element buffer object ebo
		_ebo = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _ebo);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, _indices, gl.STATIC_DRAW);


		//position attribute
		/*
		 This fucker is obscure. First attribute is buffer value index, 
		 second value is number of attributes in the vertex buffer,
		 second to last is the size of the data of each vertex,
		 last is the step size in the vertex, as in index of the first value for the data.
		 */
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * 4, 0);
		gl.enableVertexAttribArray(0);

		//texture coordinate attribute
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 5 * 4, 3 * 4);
		gl.enableVertexAttribArray(1);

		//Texture coordinate buffer handling
		_texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, _texture);

		//Texture render parameters
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_MIN_FILTER,
			gl.LINEAR_MIPMAP_LINEAR
		);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

		let target = gl.TEXTURE_2D;
		let mipMapLevel = 0;
		let internalFormat = gl.RGBA;
		let format = gl.RGBA;
		let type = gl.UNSIGNED_BYTE;

		gl.texImage2D(target, mipMapLevel, internalFormat, format, type, image);
		gl.generateMipmap(gl.TEXTURE_2D);

		gl.enable(gl.DEPTH_TEST);

		this.render();
	}

	public render(): void {
		//Set accurate time
		var currentFrame = Date.now();
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;

		//Process input
		this.processInput();

		//Resize the GL Canvas to the size determined by CSS
		if(Renderer.resizeCanvasToDisplaySize(_canvas)){
			projection = mat4.perspective(
				projection,
				_fov,
				_canvas.clientWidth /_canvas.clientHeight ,
				0.1,
				100
			);
		}
		//Tell WebGL how to convert from clip space to pixels!
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		//Scrub the canvas
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.clearColor(0, 0, 0, 1);

		//Tell it to use the program
		gl.useProgram(_program);

		gl.bindTexture(gl.TEXTURE_2D, _texture);
		gl.bindVertexArray(_vao);

		model = mat4.rotate(
			model,
			model,
			glMatrix.toRadian(-1 / 2),
			vec3.fromValues(1, 1, 0.5)
		);

		//Camera/view matrix transform
		//cameraPos=vec3.add(cameraPos,cameraPos,vec3.fromValues(1,1,1));
		var cameraCenter = vec3.fromValues(0, 0, 0);
		vec3.add(cameraCenter, cameraPos, cameraFront);
		mat4.lookAt(view, cameraPos, cameraCenter, cameraUp);

		let mLoc = gl.getUniformLocation(_program, "model");
		let vLoc = gl.getUniformLocation(_program, "view");
		let pLoc = gl.getUniformLocation(_program, "projection");

		gl.uniformMatrix4fv(mLoc, false, model);
		gl.uniformMatrix4fv(vLoc, false, view);
		gl.uniformMatrix4fv(pLoc, false, projection);

		var primitiveType = gl.TRIANGLES;
		var offset = 0;
		var count = 6;
		/*componentType         Size in bytes
			5120 (BYTE)           1
			5121 (UNSIGNED_BYTE)  1
			5122 (SHORT)          2
			5123 (UNSIGNED_SHORT) 2
			5125 (UNSIGNED_INT)   4
			5126 (FLOAT)          4*/
		//if less than 256 indices, use UNSIGNED_SHORT! See table above
		var indexType = gl.UNSIGNED_SHORT;

		//gl.drawElements(primitiveType, count, indexType, offset);
		gl.drawArrays(gl.TRIANGLES, 0, 36);
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

		//const dpr =window.devicePixelRatio;

		// Check if the canvas is not the same size.
		const needResize =
			canvas.width !== displayWidth || canvas.height !== displayHeight;

		if (needResize) {
			// Make the canvas the same size
			canvas.width = displayWidth;
			canvas.height = displayHeight;
		}

		return needResize;
	}

	processInput() {
		let cameraSpeed = 0.005 * deltaTime;
		if (w) {
			vec3.scaleAndAdd(cameraPos, cameraPos, cameraFront, cameraSpeed);
		}
		if (a) {
			vec3.cross(cameraRight, cameraFront, cameraUp);
			vec3.scaleAndAdd(cameraPos, cameraPos, cameraRight, -cameraSpeed);
		}
		if (s) {
			vec3.scaleAndAdd(cameraPos, cameraPos, cameraFront, -cameraSpeed);
		}
		if (d) {
			vec3.cross(cameraRight, cameraFront, cameraUp);
			vec3.scaleAndAdd(cameraPos, cameraPos, cameraRight, cameraSpeed);
		}
		if (e) {
			vec3.cross(cameraRight, cameraFront, cameraUp);
			vec3.scaleAndAdd(cameraPos, cameraPos, cameraUp, cameraSpeed);
		}
		if (q) {
			vec3.cross(cameraRight, cameraFront, cameraUp);
			vec3.scaleAndAdd(cameraPos, cameraPos, cameraUp, -cameraSpeed);
		}
	}
	//#endregion
}

var xPos, yPos;
function processMouse(position: Array<number>) {
	if (mouseFirst) {
		xPos = position[0];
		yPos = position[1];
		mouseFirst = false;
	}

	let xOffset = position[0] - xPos;
	let yOffset = yPos - position[1];
	xPos = position[0];
	yPos = position[1];

	let mouseSensitivity = 0.1;
	xOffset *= mouseSensitivity;
	yOffset *= mouseSensitivity;

	cameraYaw += xOffset;
	cameraPitch += yOffset;

	cameraPitch = cameraPitch > 89.0 ? 89.0 : cameraPitch;
	cameraPitch = cameraPitch < -89.0 ? -89.0 : cameraPitch;
	let pitchRadian = glMatrix.toRadian(cameraPitch);
	let yawRadian = glMatrix.toRadian(cameraYaw);
	let front = vec3.fromValues(
		Math.cos(yawRadian) * Math.cos(pitchRadian),
		Math.sin(pitchRadian),
		Math.sin(yawRadian) * Math.cos(pitchRadian)
	);

	vec3.normalize(cameraFront, front);
}
