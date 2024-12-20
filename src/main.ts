import { FlowFieldEffect } from "./animations/FlowFieldEffect";
import "./style.css";

const canvas = document.getElementById("app") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

if (!ctx) throw new Error("Canvas not supported");

canvas.width = Math.floor(window.innerWidth / 5) * 5;
canvas.height = Math.floor(window.innerHeight / 5) * 5;

ctx.fillStyle = "white";
ctx.strokeStyle = "white";
ctx.lineWidth = 1;

const effect = new FlowFieldEffect(canvas, ctx, {
    zoom: 0.1,
    curve: 0.1,
    cellSize: 5,
    numberOfParticles: 5000,
});

async function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render();
    requestAnimationFrame(animate);
}

(async () => {
    await effect.initialize();
    animate();
})();

window.addEventListener("resize", () => {
    canvas.width = Math.floor(window.innerWidth / 5) * 5;
    canvas.height = Math.floor(window.innerHeight / 5) * 5;
    effect.resize(window.innerWidth, window.innerHeight);

    canvas.style.top = "50%";
    canvas.style.left = "50%";
});

const lineController = document.getElementById("line") as HTMLInputElement;

lineController.addEventListener("input", () => {
    const lineValue = parseFloat(lineController.value);
    ctx.lineWidth = lineValue;
    effect.numberOfParticles = 5000 / (lineValue * 5);

    console.log(effect.numberOfParticles);
});
