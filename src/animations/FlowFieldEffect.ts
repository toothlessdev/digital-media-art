import { BaseEffect } from "../lib/BaseEffect";
import { Particle } from "../modules/Particle";

import img from "../Group.svg";

type FlowEffectOptions = {
    numberOfParticles: number;
    curve: number;
    zoom: number;
    cellSize: number;
};

export class FlowFieldEffect extends BaseEffect {
    public particles: Particle[];
    public numberOfParticles: number;

    public cellSize: number;
    public rows: number;
    public cols: number;

    public flowField: {
        x: number;
        y: number;
        colorAngle: number;
    }[];
    public curve: number;
    public zoom: number;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, flowFieldOptions: FlowEffectOptions) {
        super(canvas, context);

        this.rows = 0;
        this.cols = 0;
        this.flowField = [];
        this.particles = [];

        this.curve = flowFieldOptions.curve;
        this.zoom = flowFieldOptions.zoom;

        this.cellSize = flowFieldOptions.cellSize;

        this.numberOfParticles = flowFieldOptions.numberOfParticles;

        this.initialize();
    }

    async initialize() {
        await this.drawImage(img);

        this.createFlowField();
        this.createParticles();

        const pixels = this.ctx.getImageData(0, 0, this.width, this.height);

        for (let y = 0; y < this.height; y += this.cellSize) {
            for (let x = 0; x < this.width; x += this.cellSize) {
                const index = (y * this.width + x) * 4;

                const red = pixels.data[index];
                const green = pixels.data[index + 1];
                const blue = pixels.data[index + 2];
                // const _alpha = pixels.data[index + 3];

                const greyScale = (red + green + blue) / 3;
                const colorAngle = ((greyScale / 255) * 6.28).toFixed(2);

                this.flowField.push({
                    x,
                    y,
                    colorAngle: Number(colorAngle),
                });
            }
        }
    }

    public createFlowField() {
        this.flowField = [];
        this.rows = Math.floor(this.height / this.cellSize);
        this.cols = Math.floor(this.width / this.cellSize);
    }

    public createParticles() {
        this.particles = [];
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this));
        }
    }

    public drawText(text: string) {
        this.ctx.fillStyle = "red";
        this.ctx.font = "500px Impact";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
    }

    public drawImage(img: string): Promise<void> {
        return new Promise((resolve) => {
            const imgElement = new Image();
            imgElement.src = img;

            imgElement.onload = () => {
                const ratio = imgElement.width / imgElement.height;

                const imgHeight = this.canvas.height;
                const imgWidth = imgHeight * ratio;
                const x = (this.canvas.width - imgWidth) / 2;
                const y = (this.canvas.height - imgHeight) / 2;

                this.ctx.drawImage(imgElement, x, y, imgWidth, imgHeight);
                resolve();
            };
        });
    }

    public render() {
        // this.drawText("DRAGON");
        this.drawImage(img);
        this.particles.forEach((particle) => {
            particle.draw(this.ctx);
            particle.update();
        });
    }
}
