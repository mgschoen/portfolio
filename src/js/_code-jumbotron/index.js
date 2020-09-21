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
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;
        this.direction = .5;

        // init scene
        this.scene = new Scene();
        this.scene.background = new Color(this.backgroundColor);
        this.camera = new PerspectiveCamera(75, this.aspect, 0.1, 1000);
        this.camera.position.set(0, -80, 200);
        this.renderer = new WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(this.width, this.height);

        // init slide
        this.slide = new CodeSlide({
            background: this.backgroundColor,
            width: this.width,
            height: this.height
        });
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

    get aspect() {
        if (!this._dimensions) {
            this._dimensions = { width: 1, height: 1, aspect: 1 };
        }
        return this._dimensions.aspect;
    }

    get width() {
        if (!this._dimensions) {
            this._dimensions = { width: 1, height: 1, aspect: 1 };
        }
        return this._dimensions.width;
    }

    get height() {
        if (!this._dimensions) {
            this._dimensions = { width: 1, height: 1, aspect: 1 };
        }
        return this._dimensions.height;
    }

    set width(value) {
        if (!this._dimensions) {
            this._dimensions = { width: 1, height: 1, aspect: 1 };
        }
        this._dimensions.width = value;
        this._dimensions.aspect = this._dimensions.width / this._dimensions.height;
    }

    set height(value) {
        if (!this._dimensions) {
            this._dimensions = { width: 1, height: 1, aspect: 1 };
        }
        this._dimensions.height = value;
        this._dimensions.aspect = this._dimensions.width / this._dimensions.height;
    }
};