export abstract class BaseEffect {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    public width: number;
    public height: number;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = context;

        this.width = canvas.width;
        this.height = canvas.height;
    }

    public resize(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.canvas.width = width;
        this.canvas.height = height;
    }

    public abstract render(ctx: CanvasRenderingContext2D): void;
}
