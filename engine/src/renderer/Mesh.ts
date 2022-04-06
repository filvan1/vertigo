import Renderer from "./Renderer";
import {vec2,vec3 } from "gl-matrix";
import { debug } from "console";

type Vertex={
  position:number[],
  normal:number[],
  texCoord:number[]
}

type MeshData={
    vertices:number[],
    indices:number[]
}



export default class Mesh{

    private static _buffers={};

    private static _bufferData(info,name,GL:WebGL2RenderingContext){
        if (name == 'index') {
          info.buffer = GL.createBuffer();
          GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, info.buffer);
          GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(info.data), GL.STATIC_DRAW);
        } else {
          info.buffer = GL.createBuffer();
          GL.bindBuffer(GL.ARRAY_BUFFER, info.buffer);
          GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(info.data), GL.STATIC_DRAW);
        }
    
        this._buffers[name] = info;
      }

    public static CreateCube():MeshData{

    var result:MeshData;
    var vertices:number[];      

        const positions = [
          // Front face
          -1.0, -1.0,  1.0,
          1.0, -1.0,  1.0,
          1.0,  1.0,  1.0,
          -1.0,  1.0,  1.0,
    
          // Back face
          -1.0, -1.0, -1.0,
          -1.0,  1.0, -1.0,
          1.0,  1.0, -1.0,
          1.0, -1.0, -1.0,
    
          // Top face
          -1.0,  1.0, -1.0,
          -1.0,  1.0,  1.0,
          1.0,  1.0,  1.0,
          1.0,  1.0, -1.0,
    
          // Bottom face
          -1.0, -1.0, -1.0,
          1.0, -1.0, -1.0,
          1.0, -1.0,  1.0,
          -1.0, -1.0,  1.0,
    
          // Right face
          1.0, -1.0, -1.0,
          1.0,  1.0, -1.0,
          1.0,  1.0,  1.0,
          1.0, -1.0,  1.0,
    
          // Left face
          -1.0, -1.0, -1.0,
          -1.0, -1.0,  1.0,
          -1.0,  1.0,  1.0,
          -1.0,  1.0, -1.0,
        ];
    
        const uvs = [
          // Front face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
    
          // Back face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
    
          // Top face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
    
          // Bottom face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
    
          // Right face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
    
          // Left face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
        ];
    
        const normals = [
          // Front face
          0.0, 0.0, 1.0,
          0.0, 0.0, 1.0,
          0.0, 0.0, 1.0,
          0.0, 0.0, 1.0,
    
          // Back face
          0.0, 0.0, -1.0,
          0.0, 0.0, -1.0,
          0.0, 0.0, -1.0,
          0.0, 0.0, -1.0,
    
          // Top face
          0.0, 1.0, 0.0,
          0.0, 1.0, 0.0,
          0.0, 1.0, 0.0,
          0.0, 1.0, 0.0,
    
          // Bottom face
          0.0, -1.0, 0.0,
          0.0, -1.0, 0.0,
          0.0, -1.0, 0.0,
          0.0, -1.0, 0.0,
    
          // Right face
          1.0, 0.0, 0.0,
          1.0, 0.0, 0.0,
          1.0, 0.0, 0.0,
          1.0, 0.0, 0.0,
    
          // Left face
          -1.0, 0.0, 0.0,
          -1.0, 0.0, 0.0,
          -1.0, 0.0, 0.0,
          -1.0, 0.0, 0.0,
        ];
    
        const tangents = [
          // Front face
          -1.0, 0.0, 0.0,
          -1.0, 0.0, 0.0,
          -1.0, 0.0, 0.0,
          -1.0, 0.0, 0.0,
    
          // Back face
          0.0, 1.0, 0.0,
          0.0, 1.0, 0.0,
          0.0, 1.0, 0.0,
          0.0, 1.0, 0.0,
    
          // Top face
          0.0, 0.0, 1.0,
          0.0, 0.0, 1.0,
          0.0, 0.0, 1.0,
          0.0, 0.0, 1.0,
    
          // Bottom face
          -1.0, 0.0, 0.0,
          -1.0, 0.0, 0.0,
          -1.0, 0.0, 0.0,
          -1.0, 0.0, 0.0,
    
          // Right face
          0.0, 1.0, 0.0,
          0.0, 1.0, 0.0,
          0.0, 1.0, 0.0,
          0.0, 1.0, 0.0,
    
          // Left face
          0.0, 0.0, -1.0,
          0.0, 0.0, -1.0,
          0.0, 0.0, -1.0,
          0.0, 0.0, -1.0,
        ];
    
    
        // Set up vertex buffer; Vertex= [pos:x,y,z; colour:r,g,b; texture:s,t]:
        try{
          for(let i=0;i<positions.length;i+=3){
            for(let j=0;j<3;j++){
              vertices.push(positions[i+j]);
            }
            for(let j=0;j<3;j++){
              vertices.push(normals[i+j]);
            }
            for(let j=0;j<2;j++){
              vertices.push(uvs[i+j]);
            }
          }
        } catch(e){
          console.log("Invalid vertex data!")
        }
        

        const indices = [
          0,  1,  2,      0,  2,  3,    // front
          4,  5,  6,      4,  6,  7,    // back
          8,  9,  10,     8,  10, 11,   // top
          12, 13, 14,     12, 14, 15,   // bottom
          16, 17, 18,     16, 18, 19,   // right
          20, 21, 22,     20, 22, 23,   // left
        ];

        result={vertices,indices};

        return result;

        /*
        this._bufferData({size: 3, data: positions}, 'positions',GL);
        this._bufferData({size: 3, data: normals}, 'normals',GL);
        this._bufferData({size: 3, data: tangents}, 'tangents',GL);
        this._bufferData({size: 4, data: colours}, 'colours',GL);
        this._bufferData({size: 2, data: uvs}, 'uvs',GL);
        this._bufferData({data: indices}, 'index',GL);
       */
      }
}