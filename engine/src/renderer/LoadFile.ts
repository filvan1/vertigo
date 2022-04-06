//import importBinary from "./sampleGLTF.bin";
import { Document, Scene, WebIO } from '@gltf-transform/core';

import { createRequire } from "module";

export function LoadGLB(fileName: string) {
	//const binaryFile=require(filePath); https://github.com/KhronosGroup/glTF/blob/main/specification/2.0/figures/gltfOverview-2.0.0b.png

	import("../../res/" + fileName).then((module) => {
		var print:Uint8Array =module.default;
		//var data = new DataView(print).getInt32(0, true);
		
		/*const outputStr = String.fromCharCode(
			...print.split(" ").map((bin) => parseInt(bin, 2))
		);*/
		console.log(print);
	});
	
}
