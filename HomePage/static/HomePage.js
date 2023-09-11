;(function(){
"use strict"
window.addEventListener("load", setupWebGL, false);
let gl, program;

const numOfPoints = 225;

let vertices = new Array(11 * numOfPoints).fill(0);

const numOfTriangles = 2 * 14 * 14 * 3 + 13 * 2 * 3;

// Indices for vertices order
let indices = new Array(numOfTriangles).fill(0);

let lightVertices = [
        7.0, 3.0, 7.1,
        7.2, 3.0, 7.1,
        7.2, 3.2, 7.0,
        7.0, 3.2, 7.0,
        7.0, 3.0, 7.1,
        7.2, 3.0, 7.1,
        7.2, 3.2, 7.0,
        7.0, 3.2, 7.0
];

let lightIndices =
        [
                0, 1, 2,
                0, 2, 3,
                0, 4, 7,
                0, 7, 3,
                3, 7, 6,
                3, 6, 2,
                2, 6, 5,
                2, 5, 1,
                1, 5, 4,
                1, 4, 0,
                4, 5, 6,
                4, 6, 7
        ];

let yAxisAlg = {
        hVal: [],
        k: 15, 
        l: 15,
        yAxis: [],
        yAxisAlg: function(x= 7, y= 0, z= 7){
            this.hVal.push([x, y, z])
        },
        yAxisGet: function (heightDivider){
            this.yAxis = new Array(this.k).fill(new Array(this.l).fill(0))
            for (let i= 0; i < this.k; i++) {
                let tempArr = new Array(this.l).fill(0)
                for (let j= 0; j < this.l; j++) {
                    let sum = 0;
                    let closest = new Array(3).fill(0);

                    for (let n= 0; n < 3; n++) {
                        closest[n] = this.hVal.at(0).at(n);
                    }

                    let closestDistance = Math.abs(Math.floor(closest[0] - i)) + Math.abs(Math.floor(closest[2]) - j);

                    for (let x= 0; x < this.hVal.length; x++) {
                        let hValElement = this.hVal[x]
                        let distance = Math.abs(Math.floor(hValElement.at(0)) - i) + Math.abs(Math.floor(hValElement.at(2)) - j);

                        sum += distance;

                        if (distance < closestDistance) {
                            for (let n= 0; n < 3; n++) {
                                closest[n] = hValElement.at(n);
                            }
                        }
                        closestDistance = Math.abs(Math.floor(closest[0] - i)) + Math.abs(Math.floor(closest[2]) - j);
                    }

                    let oppositeMeanDistance = 1 / ((sum / this.hVal.length) / this.hVal.length);
                    let oppositeMeanDistanceP1 = 1 / (((sum / this.hVal.length) / this.hVal.length) + 1);

                    let r = Math.random() / (1 / (oppositeMeanDistance - oppositeMeanDistanceP1));
                    // let r = 0;

                    let mean= 0;

                    for (let x= 0; x < this.hVal.length; x++) {
                        let hValElement = this.hVal[x]
                        mean += hValElement.at(1);
                    }

                    mean += 2 * closest[1];

                    mean /= this.hVal.length + heightDivider;

                    tempArr[j] = (mean / ((sum / this.hVal.length) / this.hVal.length)) + r;
                    if(!isFinite(tempArr[j])) {
                        tempArr[j] = 0
                    }
                }
                this.yAxis[i] = tempArr;
            }
            if (this.hVal.length === 1) {
                let hValElement = this.hVal[0]
                const maxRow = this.yAxis.map(function(row){ return Math.max.apply(Math, row); });
                const max = Math.max.apply(null, maxRow);
                this.yAxis[hValElement.at(0)][hValElement.at(2)] = Math.max(max * (1.75 / (heightDivider + 1)), max)
            }
            return this.yAxis;
        },
};

yAxisAlg.yAxisAlg(7, 1, 7);
let heightDivider = 1;

let yAxis = yAxisAlg.yAxisGet(heightDivider);

console.log(yAxis)

function setupWebGL (evt) {
  window.removeEventListener(evt.type, setupWebGL, false);
  if (!(gl = getRenderingContext()))
    return;

  let source = document.querySelector("#vertex-shader").innerHTML;
  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader,source);
  gl.compileShader(vertexShader);
  source = document.querySelector("#fragment-shader").innerHTML
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader,source);
  gl.compileShader(fragmentShader);
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    let linkErrLog = gl.getProgramInfoLog(program);
    cleanup();
    document.querySelector("p").innerHTML = 
      "Shader program did not link successfully. "
      + "Error log: " + linkErrLog;
    return;
  } 

  initializeAttributes();

  gl.useProgram(program);
  gl.drawArrays(gl.POINTS, 0, 1);

  cleanup();
}

let buffer;
function initializeAttributes() {
  gl.enableVertexAttribArray(0);
  buffer = gl.createBuffer();  
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);
}

function cleanup() {
gl.useProgram(null);
if (buffer)
  gl.deleteBuffer(buffer);
if (program) 
  gl.deleteProgram(program);
}

function getRenderingContext() {
  let canvas = document.querySelector("canvas");
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  let gl = canvas.getContext("webgl") 
    || canvas.getContext("experimental-webgl");
  if (!gl) {
    let paragraph = document.querySelector("p");
    paragraph.innerHTML = "Failed to get WebGL context."
      + "Your browser or device may not support WebGL.";
    return null;
  }
  gl.viewport(0, 0, 
    gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  return gl;
}
})();