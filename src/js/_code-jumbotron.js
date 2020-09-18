import {
    CanvasTexture,
    Color,
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    WebGLRenderer,
} from 'three';
import exampleCode from './_example-code';

const backgroundColor = 'rgb(233, 236, 239)'

// create scene
const scene = new Scene();
scene.background = new Color(backgroundColor);
const canvas = document.getElementById('code-jumbotron');
const config = { width: canvas.offsetWidth, height: canvas.offsetHeight };
const camera = new PerspectiveCamera(75, config.width / config.height, 0.1, 1000);
const renderer = new WebGLRenderer({ canvas });
renderer.setSize(config.width, config.height);

// create canvas
const textureCanvas = document.createElement('canvas')
textureCanvas.width = config.width;
textureCanvas.height = config.height * 2;
const ctx = textureCanvas.getContext('2d');

// add background
ctx.fillStyle = 'blue'; // backgroundColor;
ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

// add text
const lines = exampleCode.split('\n');
const snippetLength = 50;
let startIndex = lines.length > snippetLength ?
    Math.floor(Math.random() * (lines.length - snippetLength)) :
    0;
const codeSnippet = lines.slice(startIndex, startIndex + snippetLength);
const lineHeight = 20;
ctx.fillStyle = 'black';
ctx.font = '16px monospace';
codeSnippet.forEach((line, index) => {
    ctx.fillText(line, 20, 20 + (index * lineHeight));
});

// add content
const texture = new CanvasTexture(textureCanvas);
const geometry = new PlaneGeometry(500, 500);
const material = new MeshBasicMaterial({ map: texture });
const plane = new Mesh(geometry, material);
scene.add(plane);

camera.position.z = 200;
camera.position.x = 0; // +- 200
camera.position.y = -80; // +-80
geometry.rotateX((Math.random() * 0.5) - 0.25);

let direction = .5;

function animate() {
    if (
        direction > 0 && camera.position.y === 80 ||
        direction < 0 && camera.position.y === -80
    ) {
        direction *= -1;
    }
    camera.position.y += direction;
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

export default function() {
    animate();
}