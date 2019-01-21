import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class Cube extends Drawable {
  //buffer: ArrayBuffer;
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  center: vec4;
  length: number;

  constructor(center: vec3, public radius: number) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    this.length = radius / 2.0;
  }
  create(){
    this.indices = new Uint32Array([
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ]);
    this.normals = new Float32Array([        
        // front
        0, 0, 1, 0,
        0, 0, 1, 0,
        0, 0, 1, 0,
        0, 0, 1, 0,
        // back
        0, 0, -1, 0,
        0, 0, -1, 0,
        0, 0, -1, 0,
        0, 0, -1, 0,
        // top
        0, 1, 0, 0,
        0, 1, 0, 0,
        0, 1, 0, 0,
        0, 1, 0, 0,
        // bottom
        0, -1, 0, 0,
        0, -1, 0, 0,
        0, -1, 0, 0,
        0, -1, 0, 0,
        // right
        1, 0, 0, 0,
        1, 0, 0, 0,
        1, 0, 0, 0,
        1, 0, 0, 0,
        // left
        -1, 0, 0, 0,
        -1, 0, 0, 0,
        -1, 0, 0, 0,
        -1, 0, 0, 0    
    ]);
    let len = this.length;
    let pos = new Float32Array([
      // Front face
      -len, -len,  len, 1,
      len, -len,  len, 1,
      len,  len,  len, 1,
      -len,  len,  len, 1,

      // Back face
      -len, -len, -len, 1,
      -len,  len, -len, 1,
      len,  len, -len, 1,
      len, -len, -len, 1,

      // Top face
      -len,  len, -len, 1,
      -len,  len,  len, 1,
      len,  len,  len, 1,
      len,  len, -len, 1,

      // Bottom face
      -len, -len, -len, 1,
      len, -len, -len, 1,
      len, -len,  len, 1,
      -len, -len,  len, 1,

      // Right face
      len, -len, -len, 1,
      len,  len, -len, 1,
      len,  len,  len, 1,
      len, -len,  len, 1,

      // Left face
      -len, -len, -len, 1,
      -len, -len,  len, 1,
      -len,  len,  len, 1,
      -len,  len, -len, 1,
    ]);
    for(let i = 0; i < 24; i++){
      pos[4*i + 0] += this.center[0];
      pos[4*i + 1] += this.center[1];
      pos[4*i + 2] += this.center[2];
    }
    this.positions = pos;

    this.generateIdx();
    this.generatePos();
    this.generateNor();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    console.log(`Created cube`);
  }
}
export default Cube;