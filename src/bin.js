import canvasObject from './canvasObject.js';

export default class Bin extends canvasObject{
    constructor(x, y, width){
        super(x - width, y - width, width * 2, width * 2);
    }

    draw(ctx){
        super.draw(ctx);
        ctx.fillStyle = "#000000";
        ctx.font = "50px Arial";
        ctx.fillText("BIN", this.xPos, this.yPos + this.height, this.width);
    }

    checkClick(x, y){
        return super.checkClick(x, y);
    }
}