import canvasObject from './canvasObject.js';

export default class Input extends canvasObject{
    constructor(x, y, radius){
        super(x, y, radius * 2, radius * 2);
        this.source = null;
        this.currentStatus = false;
    }

    draw(ctx, parentX, parentY){
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.width, 0, 2 * Math.PI);
        ctx.stroke();

        // line connecting the output to its parent gate
        ctx.beginPath();
        ctx.moveTo(this.xPos + this.width, this.yPos);
        ctx.lineTo(parentX, parentY);
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

    setSource([elmID, outputID]){
        if (this.source == null){
            this.source = [elmID, outputID];
        }
        
    }
}