import {
    Color,
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    WebGLRenderer,
} from 'three';

// create scene
const scene = new Scene();
scene.background = new Color('rgb(233, 236, 239)');
const canvas = document.getElementById('code-jumbotron');
const config = { width: canvas.offsetWidth, height: canvas.offsetHeight };
const camera = new PerspectiveCamera(75, config.width / config.height, 0.1, 1000);
const renderer = new WebGLRenderer({ canvas });
renderer.setSize(config.width, config.height);
// document.body.insertAdjacentElement('afterbegin', renderer.domElement);

// add content
const geometry = new PlaneGeometry();
const material = new MeshBasicMaterial({ color: 0x00ff00, side: DoubleSide });
const cube = new Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
    geometry.rotateX(0.02);
    geometry.rotateY(0.01);
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

export default function() {
    animate();
}