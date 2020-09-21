import {
    CanvasTexture,
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry
} from 'three';
import exampleCode from './_example-code';

export default class CodeSlide {
    constructor(config) {
        this.config = config;

        this.canvas = null;
        this.ctx = null;
        this.codeContent = null;

        this.texture = null;
        this.geometry = null;
        this.material = null;
        this.mesh = null;

        this.initCanvas();
        this.initMesh();
    }

    initCanvas() {
        // create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height * 2;
        this.ctx = this.canvas.getContext('2d');

        // add background
        this.ctx.fillStyle = this.config.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // add text
        const lines = exampleCode.split('\n');
        const snippetLength = 50;
        let startIndex = lines.length > snippetLength ?
            Math.floor(Math.random() * (lines.length - snippetLength)) :
            0;
        this.codeContent = lines.slice(startIndex, startIndex + snippetLength);
        const lineHeight = 20;
        this.ctx.fillStyle = 'black';
        this.ctx.font = '16px monospace';
        this.codeContent.forEach((line, index) => {
            this.ctx.fillText(line, 20, 20 + (index * lineHeight));
        });
    }

    initMesh() {
        this.texture = new CanvasTexture(this.canvas);
        this.geometry = new PlaneGeometry(500, 500);
        this.geometry.rotateX((Math.random() * 0.5) - 0.25);
        this.material = new MeshBasicMaterial({ map: this.texture });
        this.mesh = new Mesh(this.geometry, this.material);
    }
}