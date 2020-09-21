import {
    Color,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer,
    Vector2,
} from 'three';
import CodeSlide from './_code-slide';

export default class CodeJumbotron {
    constructor() {
        // define general properties
        this.backgroundColor = 'rgb(233, 236, 239)';
        this.canvas = document.getElementById('code-jumbotron');
        this.config = { width: this.canvas.offsetWidth, height: this.canvas.offsetHeight };
        this.direction = .5;

        // init scene
        this.scene = new Scene();
        this.scene.background = new Color(this.backgroundColor);
        this.camera = new PerspectiveCamera(75, this.config.width / this.config.height, 0.1, 1000);
        this.camera.position.set(0, -80, 200);
        this.renderer = new WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(this.config.width, this.config.height);

        // init slide
        this.slide = new CodeSlide({ background: this.backgroundColor, ...this.config });
        this.scene.add(this.slide.mesh);

        this.animate();
    }

    animate() {
        if (
            this.direction > 0 && this.camera.position.y === 80 ||
            this.direction < 0 && this.camera.position.y === -80
        ) {
            this.direction *= -1;
        }
        this.camera.position.y += this.direction;
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.animate.bind(this));
    }
};