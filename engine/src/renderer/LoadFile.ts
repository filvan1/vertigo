//import importBinary from "./sampleGLTF.bin";

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array#constructor
import { ReadableStream, toWebReadableStream, toNodeReadable } from "node-web-streams";
//import { ReadableStream } from "DOM";
import { Buffer } from "buffer";

export function LoadGLB(fileName: string) {
	//https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/encodeInto https://github.com/KhronosGroup/glTF/blob/main/specification/2.0/figures/gltfOverview-2.0.0b.png


	import("../../res/" + fileName).then(async (module) => {
		var print=module.default;
		let buff=Buffer.from(print);
		//let reader=stream.getReader();

		console.log(buff.toString('utf-8',0,4));
		//const encoder=new TextEncoder();
		//var data = new DataView(print).getInt32(0, true);
		
		/*const outputStr = String.fromCharCode(
			...print.split(" ").map((bin) => parseInt(bin, 2))
		);*/
		//let array:Uint8Array=encoder.encode(print);
		//console.log(array);
		
		//JSON.parse(json);
	});
	
}
