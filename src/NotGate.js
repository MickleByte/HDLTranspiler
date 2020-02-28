import Transformer from './transformer.js';

export default class NOT extends Transformer{
    constructor(x, y, width, nameLabel = ""){
        super(x, y, width, 1, 1);
        this.operator = "!"
        this.nameLabel = "!"
    }

    updateState(){
        if (this.currentStatus){
            this.colour = "green";
        }
        else{
            this.colour = "red";
        }
    }

    simulate(){
        for (var i = 0; i < this.outputs.length; i++){
            this.outputs[i].currentStatus = this.currentStatus;
        }
    }


    draw(ctx){
        ctx.fillStyle = "#fcba03"; // border colour
        
        
        
        // left hand line
        ctx.beginPath();
        ctx.moveTo(this.xPos, this.yPos);
        ctx.lineTo(this.xPos, this.yPos + this.height);
        ctx.stroke();

        // top line
        ctx.beginPath();
        ctx.moveTo(this.xPos, this.yPos);
        ctx.lineTo(this.xPos + this.width, this.yPos + (this.height / 2));
        ctx.stroke();

        // bottom line
        ctx.beginPath();
        ctx.moveTo(this.xPos, this.yPos + this.height);
        ctx.lineTo(this.xPos + this.width, this.yPos + (this.height / 2));
        ctx.stroke();

        // draw all inputs to transformer
        for (var i = 0; i < this.inputs.length; i++){
            this.inputs[i].draw(ctx);
        }
        // draw all outputs of transformer
        for (var i = 0; i < this.outputs.length; i++){
            this.outputs[i].draw(ctx);
        }
    }
}