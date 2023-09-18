"use strict"

let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = {
    'Tiffany Blue': [153, 224, 217, 255],
    'Cornsilk': [255, 245, 227, 255],
    'Cerulean': [28, 110, 140, 255],
    'Bittersweat shimmer': [188, 75, 81, 255],
    'Cool gray': [197, 180, 227, 255]
}

const terrain_color = []
colors['Cool gray'].forEach((colorVal) => terrain_color.push(colorVal/255))

const background_color = [];
colors['Tiffany Blue'].forEach((colorVal) => background_color.push(colorVal/255))

window.addEventListener("load", setupWebGL, false);

const {vec3, vec4, mat3, mat4} = window.glMatrix;

//must be 2 or higher (there must be at least 4 points to make one square)
const planeSize = 25;

//plane is square so there is a^2 points
const numOfPoints = planeSize**2;

//number of dimensions
let num_dims = 3
const verticies_len = num_dims * numOfPoints
let vertices = new Array(verticies_len).fill(0.0);

// * 2 because there are 2 triangles per square * num_dims because every triangle has x y z position
const numOfTrianglesPoints = verticies_len * 2;

let indices = new Array(numOfTrianglesPoints).fill(0.0);

let vertexNormals = new Array(numOfTrianglesPoints).fill(0.0);

let yAxisAlg = {
        hVal: [],
        planeSize: planeSize,
        yAxis: [],
        yAxisAlg: function(x= 7, y= 0, z= 7){
            this.hVal.push([x, y, z])
        },
        yAxisGet: function (heightDivider){
            const l = this.planeSize;
            this.yAxis = new Array(this.planeSize).fill(new Array(l).fill(0))
            for (let i= 0; i < this.planeSize; i++) {
                let tempArr = new Array(l).fill(0)
                for (let j= 0; j < l; j++) {
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

function setUpYAxis() {
    yAxisAlg.hVal = [];
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max-min)) + min;
    }

    const hillCount = getRandomInt(5, 11);
    const heightDivider = getRandomInt(2, 4);

    for (let i= 0; i<hillCount; i++){
        let y = getRandomInt(-10, 5) + i
        yAxisAlg.yAxisAlg(getRandomInt(0, yAxisAlg.planeSize-1), y, getRandomInt(0, yAxisAlg.planeSize-1));
    }
    let yAxis = yAxisAlg.yAxisGet(heightDivider);

    for (let i= 0; i<yAxisAlg.planeSize; i++){
        for (let j= 0; j<yAxisAlg.planeSize; j++){
            vertices[1 + 3*(i * yAxisAlg.planeSize + j)] = yAxis[i][j];
        }
    }

    let x = -yAxisAlg.planeSize/4;
    for (let i = 0; i < numOfTrianglesPoints; ++i) {
        x += 0.5;
        if (i % yAxisAlg.planeSize === 0/*one row size*/){
            x = -yAxisAlg.planeSize/4;
        }
        vertices[i * num_dims] = x;
    }

    //set z
    let z = -yAxisAlg.planeSize/4;
    for (let i = 0; i < numOfTrianglesPoints; ++i) {
        if (i % yAxisAlg.planeSize === 0/*one column size*/)
            z += 0.5;
        vertices[(i * num_dims) + 2] = z - 0.5;
    }

    //set indices
    for (let i = 0, j = 0, k = 0; i < numOfTrianglesPoints; i += 3, k++) {
        if (i % 2 === 0) {
            indices[i] = j;
            indices[i + 1] = j + 1;
            indices[i + 2] = j + yAxisAlg.planeSize;
            j++;
        } else {
            indices[i] = j;
            indices[i + 1] = j + yAxisAlg.planeSize - 1;
            indices[i + 2] = j + yAxisAlg.planeSize;
        }
    }
    for (let i= 0; i<yAxisAlg.planeSize*2; i++){
        if (i%2 === 0){
            let floor_point = (yAxisAlg.planeSize-1)*6 + yAxisAlg.planeSize*i*3;
            indices[floor_point + 2] = indices[floor_point + 2];
            indices[floor_point + 3] = indices[floor_point + 2];
            indices[floor_point + 1] = indices[floor_point + 2];
        }
    }
}

function initPositionBuffer(gl) {
    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    return positionBuffer;
}

function initColorBuffer(gl) {
    let faceColors = [];

    for (let i= 0, j= 0, y_index= 1; i<verticies_len; i++){
        faceColors.push([...terrain_color])
    }
    // Convert the array of colors into a table for all the vertices.
    let colors = [];

    for (let i = 0; i < verticies_len; ++i) {
        const c = faceColors[i];
        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(...terrain_color);
    }

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
    return colorBuffer;
}

function initIndexBuffer(gl) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // Send the element array to GL
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.DYNAMIC_DRAW
    );

    return indexBuffer;
}

function initVertexNormals(verts, indices, rowSize, num_dims) {
    const normals = new Array(vertexNormals.length).fill(0);

    // Iterate through the indices to calculate normals

    //for loop size explained:
    //vertexNormals.length/2: we calculate normal for each square not triangle
    // - 3 * rowSize: we can't calculate normals for last row as we need points in next row to make calculations,
    //                so the 2nd last iteration takes care of last row normals.
    for (let i= 0; i < vertexNormals.length/2 - 3 * rowSize; i+=3) {
        const b = [vertices[i], vertices[i + 1], vertices[i + 2]];
        const s = [vertices[(i + rowSize * num_dims)], vertices[(i + rowSize * num_dims) + 1], vertices[(i + rowSize * num_dims) + 2]];

        let r = new Array(3).fill(0);
        if (i % 2 === 0) {
            r = [vertices[(i + 1 * num_dims)], vertices[(i + 1 * num_dims) + 1], vertices[(i + 1 * num_dims) + 2]];
        } else {
            r = [vertices[(i + (rowSize - 1) * num_dims)], vertices[(i + (rowSize - 1) * num_dims) + 1], vertices[(i + (rowSize - 1) * num_dims) + 2]];
        }

        const QR = [r[0] - b[0], r[1] - b[1], r[2] - b[2]];
        const QS = [s[0] - b[0], s[1] - b[1], s[2] - b[2]];

        let normal = new Array(3).fill(0);
        if (i % 2 === 0) {
            normal = [(QR[0] * QS[0]) / 2, (QR[1] * QS[1]) / 2, (QR[2] * QS[2]) / 2];

            for (let j= 0; j<num_dims; j++){
                normal[j] = 1/Math.abs(normal[j] + 3);
            }

            normals[i] = normal[0];
            normals[i + 1] = normal[1];
            normals[i + 2] = normal[2];

            normals[(i + 1 * num_dims)] = normal[0];
            normals[(i + 1 * num_dims) + 1] = normal[1];
            normals[(i + 1 * num_dims) + 2] = normal[2];

            normals[(i + rowSize * num_dims)] = normal[0];
            normals[(i + rowSize * num_dims) + 1] = normal[1];
            normals[(i + rowSize * num_dims) + 2] = normal[2];
        } else {
            normal = [QR[0] * QS[0], QR[1] * QS[1], QR[2] * QS[2]];

            for (let j= 0; j<num_dims; j++){
                normal[j] = 1/Math.abs(normal[j] + 3);
            }

            normals[i] = normal[0];
            normals[i + 1] = normal[1];
            normals[i + 2] = normal[2];

            normals[(i + (rowSize - 1) * num_dims)] = normal[0];
            normals[(i + (rowSize - 1) * num_dims) + 1] = normal[1];
            normals[(i + (rowSize - 1) * num_dims) + 2] = normal[2];

            normals[(i + rowSize * num_dims)] = normal[0];
            normals[(i + rowSize * num_dims) + 1] = normal[1];
            normals[(i + rowSize * num_dims) + 2] = normal[2];
        }
    }
    return normals;
}


function initNormalBuffer(gl) {
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertexNormals),
        gl.DYNAMIC_DRAW,
    );

    return normalBuffer;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(
          `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
        );
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error(
          `Unable to initialize the shader program: ${gl.getProgramInfoLog(
            shaderProgram
          )}`
        );
        return null;
    }

    return shaderProgram;
}

function initBuffers(gl) {
    const positionBuffer = initPositionBuffer(gl);

    const colorBuffer = initColorBuffer(gl);

    const indexBuffer = initIndexBuffer(gl);

    const normalBuffer = initNormalBuffer(gl);

    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
        normal: normalBuffer
    };
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(gl, buffers, programInfo) {
    const numComponents = 3;
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

// Tell WebGL how to pull out the colors from the color buffer
// into the vertexColor attribute.
function setColorAttribute(gl, buffers, programInfo) {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

function setNormalAttribute(gl, buffers, programInfo) {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
    programInfo.attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}

let cubeRotation = 0.0;
let deltaTime = 0;
function setupWebGL (evt) {
    evt.length;
    let gl = canvas.getContext("webgl");
    if (!gl) {
        console.error('No gl');
    }

    setUpYAxis();

    vertexNormals = initVertexNormals(vertices, indices, yAxisAlg.planeSize, num_dims);

    gl.clearColor(...background_color);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute vec3 aVertexNormal;
    
    uniform vec3 u_lightWorldPosition;
 
    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying lowp vec4 vColor;
    varying float vLight;
    
    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
        
        // Apply lighting effect
        // compute the world position of the surface
        vec3 surfaceWorldPosition = (uModelViewMatrix * aVertexPosition).xyz;
    
        // compute the vector of the surface to the light
        // and pass it to the fragment shader
        vec3 v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
    
        mat3 normalMatrix = mat3(uNormalMatrix);
        vec3 normal = normalize(normalMatrix * aVertexNormal);
        
        vLight = dot(normal, normalize(v_surfaceToLight));
    }
    `;

    const fsSource = `
    precision highp float;
    
    varying lowp vec4 vColor;
    varying float vLight;
    
    void main(void) {
        gl_FragColor = vColor;
        gl_FragColor.rgb *= vLight;
    }
    `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
            vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
            lightWorldPosition: gl.getUniformLocation(shaderProgram, "u_lightWorldPosition"),
            world: gl.getUniformLocation(shaderProgram, "u_world"),
        },
    };

    const buffers = initBuffers(gl);

    let then = 0;

    function drawScene() {
        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(...background_color);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const fieldOfView = (45 * Math.PI) / 180; // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 1000.0;
        const projectionMatrix = mat4.create();

        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

        const modelViewMatrix = mat4.create();

        // Now move the drawing position a bit to where we want to
        // start drawing the square.
        mat4.translate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to translate
            [0.0, 0.0, -20.0]
        ); // amount to translate

        mat4.rotate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to rotate
            0.2, // amount to rotate in radians
            [1, 0, 0]
        )  // axis to rotate around (X)

        function rotateObject(){
            mat4.rotate(
                modelViewMatrix, // destination matrix
                modelViewMatrix, // matrix to rotate
                -Math.cos(cubeRotation)/1.5, // amount to rotate in radians
                [0, 1, 0]
            ); // axis to rotate around (Y)
        }
        rotateObject();

        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        setPositionAttribute(gl, buffers, programInfo);

        setColorAttribute(gl, buffers, programInfo);

        setNormalAttribute(gl, buffers, programInfo);

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

        gl.useProgram(programInfo.program);
        // Set the shader uniforms
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix
        );
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix
        );
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.normalMatrix,
            false,
            normalMatrix,
        );

        gl.uniform3fv(programInfo.uniformLocations.lightWorldPosition, [cubeRotation, cubeRotation, cubeRotation]);

        {
            const vertexCount = numOfTrianglesPoints;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }
    function render(now) {
        now *= 0.001; // convert to seconds
        deltaTime = now - then;
        then = now;

        drawScene(gl, programInfo, buffers, cubeRotation);
        cubeRotation += deltaTime/2;

        if (Math.floor(now*100)%1000 === 0){
            setupWebGL(evt);
            return;
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}