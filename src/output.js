import canvasObject from './canvasObject.js';

export default class Output extends canvasObject{
    constructor(x, y, radius){
        super(x, y, radius, radius);
        this.currentStatus = false;
    }

    draw(ctx, parentX, parentY){
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.width * 2, 0, 2 * Math.PI);
        ctx.stroke();

        // line connecting the output to its parent gate
        ctx.beginPath();
        ctx.moveTo(this.xPos, this.yPos);
        ctx.lineTo(parentX - this.width, parentY);
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