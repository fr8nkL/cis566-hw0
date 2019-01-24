import {vec3,vec4} from 'gl-matrix';
//import * as Stats from 'stats-js';
var Stats = require('stats-js');
import * as DAT from 'dat-gui';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import Cube from './geometry/Cube';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  tesselations: 5,
  'Load Scene': loadScene, // A function pointer, essentially
  u_Color: [255,0,0,1],
  shader: "lambert",
};

let icosphere: Icosphere;
let square: Square;
let cube: Cube;
let prevTesselations: number = 5;

function loadScene() {
  icosphere = new Icosphere(vec3.fromValues(0, 0, 0), 1, controls.tesselations);
  icosphere.create();
  square = new Square(vec3.fromValues(0, 0, 0));
  square.create();
  cube = new Cube(vec3.fromValues(2, 0, 0), 1);
  cube.create();
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'tesselations', 0, 8).step(1);
  gui.add(controls, 'Load Scene');
  gui.add(controls, 'shader', ['lambert', 'hw0Shader']);
  gui.addColor(controls, 'u_Color');

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 0, 5), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.DEPTH_TEST);
  /*
  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);
  */
  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    if(controls.tesselations != prevTesselations)
    {
      prevTesselations = controls.tesselations;
      icosphere = new Icosphere(vec3.fromValues(0, 0, 0), 1, prevTesselations);
      icosphere.create();
    }
    // this function chooses which shader to use
    function chooseShader(shader: String, gl: WebGL2RenderingContext){
      if(shader == 'hw0Shader'){
        return new ShaderProgram([
          new Shader(gl.VERTEX_SHADER, require('./shaders/hw0-vert.glsl')),
          new Shader(gl.FRAGMENT_SHADER, require('./shaders/hw0-frag.glsl')),
        ]);
      }
      else{
        return new ShaderProgram([
          new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
          new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
        ]);
      }
    }
    // get the new value for u_Color from dat.gui
    let rawColor = controls.u_Color;
    let color = vec4.fromValues(rawColor[0] / 255.0, rawColor[1] / 255.0, rawColor[2] / 255.0, rawColor[3]);
    // get the color with custom shader
    let time = Math.floor( new Date().getTime() / 500 ) ;
    let sin = Math.abs(Math.sin(time));
    let cos = Math.abs(Math.cos(time));
    let temp = vec4.fromValues( sin+cos, Math.abs(sin-cos), Math.pow(sin, cos), 1 );
    // get the shader to use from dat.gui
    const shaderToUse = chooseShader(controls.shader, gl);
    // render
    renderer.render(camera, shaderToUse, color, temp, [
      icosphere,
      //square,
      cube
    ]);
    //console.log(gl.getUniform(lambert.prog, lambert.unifColor));
    //console.log(gl.getUniform(shaderToUse.prog, shaderToUse.unifHw0));
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

main();
