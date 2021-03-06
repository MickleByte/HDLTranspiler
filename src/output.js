import canvasObject from './canvasObject.js';

export default class Output extends canvasObject{
    constructor(x, y, radius){
        super(x, y, radius * 2, radius * 2);
        this.currentStatus = false;
        this.pointer = [];
    }

    draw(ctx, parentX, parentY, simToggle = false){
        
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.width, 0, 2 * Math.PI);
        
        // if simulation is in progress we want to colour the outputs as green for True and red for False
        if (simToggle){
            if (this.currentStatus){
                ctx.fillStyle = 'green';
            }
            else{
                ctx.fillStyle = "red"
            }
            ctx.fill();
        }

        ctx.stroke();

        // line connecting the output to its parent gate
        ctx.beginPath();
        ctx.moveTo(this.xPos - this.width, this.yPos);
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

    setOut([elmID, outputID]){
        this.pointer.push([elmID, outputID]); 
    }

}