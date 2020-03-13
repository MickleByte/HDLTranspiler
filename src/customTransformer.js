import Transformer from './transformer.js';

export default class AND extends Transformer{
    constructor(x, y, width, numInputs, numOutputs, operation){
        super(x, y, width, numInputs, numOutputs);
        this.nameLabel = operation
    }


    simulate(){
        for (var i = 0; i < this.outputs.length; i++){
            this.outputs[i].currentStatus = this.currentStatus;
        }
    }


    draw(ctx){

        super.draw(ctx, this.measure, -this.measure);


        var thickness = 1; // border thickness (in pixels)
        ctx.fillStyle = "black"; // border colour
        ctx.fillRect(this.minBodyX, this.minBodyY, this.maxBodyX - this.minBodyX, this.maxBodyY - this.minBodyY); // draw border
        
        ctx.fillStyle = "#FFFFFF"; // body colour
        ctx.fillRect(this.minBodyX + thickness, this.minBodyY + thickness, this.maxBodyX - this.minBodyX - (thickness * 2), this.maxBodyY - this.minBodyY - (thickness * 2)); // draw border
        
    }
}