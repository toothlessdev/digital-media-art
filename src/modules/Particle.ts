import { FlowFieldEffect } from "../animations/FlowFieldEffect";

const colors = ["#d3b967", "#6696d2", "#ea6d6d", "#575759", "#fff"];

export class Particle {
    position: Coordinate2D;
    positionHistory: Coordinate2D[];

    speedX: number;
    speedY: number;

    effect: FlowFieldEffect;

    maxLength = 50;

    angle: number;
    newAngle: number;
    angleCorrector: number;

    speedModifier: number;
    timer: number;

    color: string;

    constructor(effect: FlowFieldEffect) {
        this.effect = effect;

        this.position = { x: 0, y: 0 };
        this.position.x = Math.floor(Math.random() * this.effect.width);
        this.position.y = Math.floor(Math.random() * this.effect.height);

        this.speedX = 0;
        this.speedY = 0;
        this.speedModifier = Math.floor(Math.random() * 5) + 1;

        this.positionHistory = [{ x: this.position.x, y: this.position.y }];
        this.maxLength = Math.floor(Math.random() * 100);

        this.angle = 0;
        this.newAngle = 0;
        this.angleCorrector = Math.random() * 0.5;

        this.timer = this.maxLength * 2;

        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.positionHistory[0].x, this.positionHistory[0].y);

        this.positionHistory.forEach((position) => ctx.lineTo(position.x, position.y));
        ctx.stroke();
    }

    update() {
        this.timer--;

        if (this.timer >= 1) {
            let x = Math.floor(this.position.x / this.effect.cellSize);
            let y = Math.floor(this.position.y / this.effect.cellSize);

            let cellIndex = y * this.effect.cols + x;

            if (this.effect.flowField[cellIndex]) {
                this.newAngle = this.effect.flowField[cellIndex].colorAngle;

                if (this.angle > this.newAngle) this.angle -= this.angleCorrector;
                else if (this.angle < this.newAngle) this.angle += this.angleCorrector;
                else this.angle = this.newAngle;
            }

            this.speedX = Math.cos(this.angle);
            this.speedY = Math.sin(this.angle);

            this.position.x += this.speedX * this.speedModifier;
            this.position.y += this.speedY * this.speedModifier;

            this.positionHistory.push({ x: this.position.x, y: this.position.y });

            if (this.positionHistory.length > this.maxLength) {
                this.positionHistory.shift();
            }
        } else if (this.positionHistory.length > 1) {
            this.positionHistory.shift();
        } else {
            this.reset();
        }
    }

    reset() {
        this.position.x = Math.floor(Math.random() * this.effect.width);
        this.position.y = Math.floor(Math.random() * this.effect.height);
        this.positionHistory = [{ x: this.position.x, y: this.position.y }];
        this.timer = this.maxLength * 2;
    }
}
