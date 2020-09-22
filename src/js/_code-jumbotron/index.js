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
        this.camera.position.set(0, -80, 140);
        this.renderer = new WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(this.width, this.height);

        // init slide
        this.slide = new CodeSlide({
            background: this.backgroundColor,
            color: 'rgb(206,206,206)',
            width: this.width,
            height: this.height
        });
        this.scene.add(this.slide.mesh);

        this.boundOnWindowResize = () => this.onWindowResize();
        this.boundAnimate = () => this.animate();

        window.addEventListener('resize', this.boundOnWindowResize);

        this.animate();
    }

    onWindowResize() {
        const previousWidth = this.canvas.getAttribute('width');
        const previousHeight = this.canvas.getAttribute('height');
        const previousStyle = this.canvas.getAttribute('style');
        this.canvas.removeAttribute('width');
        this.canvas.removeAttribute('height');
        this.canvas.removeAttribute('style');
        if (
            this.canvas.offsetWidth === this.width &&
            this.canvas.offsetHeight === this.height
        ) {
            this.canvas.setAttribute('width', previousWidth);
            this.canvas.setAttribute('height', previousHeight);
            this.canvas.setAttribute('style', previousStyle);
            return;
        }
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;
        this.camera.aspect = this.aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    animate() {
        if (
            this.direction > 0 && this.camera.position.y >= 80 ||
            this.direction < 0 && this.camera.position.y <= -80
        ) {
            this.direction *= -1;
        }
        this.camera.position.y += (this.direction * 0.2);
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.boundAnimate);
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