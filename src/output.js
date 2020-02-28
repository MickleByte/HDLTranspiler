import canvasObject from './canvasObject.js';

export default class Output extends canvasObject{
    constructor(x, y, width = 5){
        super(x, y, width, width);
        this.currentStatus = false;
    }

    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.width, 0, 2 * Math.PI);
        ctx.stroke();
    }

    checkClick(x, y){
        var difX = this.xPos - x;
        var difY = this.yPos - y;
        difX = difX * difX;
        difY = difY * difY;
        var total = difX + difY;
        total = Math.sqrt(total);
        if (total < this.width){
            return true;
        }
        return false;
    }

}