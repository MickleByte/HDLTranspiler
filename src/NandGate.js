import Transformer from './transformer.js';

export default class NAND extends Transformer{
    constructor(x, y, width, nameLabel = ""){
        super(x, y, width, 2, 1);
        this.operator = "~&";
        this.nameLabel = "~&";
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
        ctx.moveTo(this.xPos + (this.width * 0.1), this.yPos  + (this.width * 0.1));
        ctx.lineTo(this.xPos + (this.width * 0.1), this.yPos + this.height  - (this.width * 0.1));
        ctx.stroke();

        // top line
        ctx.beginPath();
        ctx.moveTo(this.xPos + (this.width * 0.1), this.yPos + (this.width * 0.1));
        ctx.lineTo(this.xPos + (this.width * 0.3), this.yPos +  + (this.width * 0.1));
        ctx.stroke();

        // bottom line
        ctx.beginPath();
        ctx.moveTo(this.xPos + (this.width * 0.1), this.yPos + this.height  - (this.width * 0.1));
        ctx.lineTo(this.xPos + (this.width * 0.3), this.yPos + this.height - (this.width * 0.1));
        ctx.stroke();

        // right hand arc
        ctx.beginPath();
        ctx.arc(this.xPos + (this.width * 0.3), this.yPos + (this.height * 0.5), this.width / 2.5, 1.5 * Math.PI, 0.5 * Math.PI);
        ctx.stroke();

        // line connecting output to main gate body
        ctx.beginPath();
        ctx.moveTo(this.xPos + (this.width * 0.9), this.yPos + (this.height * 0.5));
        ctx.lineTo(this.xPos + (this.width), this.yPos + (this.height * 0.5));
        ctx.stroke();

        // top line connecting input to main gate body
        ctx.beginPath();
        ctx.moveTo(this.xPos, this.yPos + (this.height * 0.35));
        ctx.lineTo(this.xPos + (this.width * 0.1), this.yPos + (this.height * 0.35));
        ctx.stroke();

        // bottom line connecting input to main gate body
        ctx.beginPath();
        ctx.moveTo(this.xPos, this.yPos + (this.height * 0.65));
        ctx.lineTo(this.xPos + (this.width * 0.1), this.yPos + (this.height * 0.65));
        ctx.stroke();

        // inverter circle
        ctx.beginPath();
        ctx.arc(this.xPos + (this.width * 0.8), this.yPos + (this.height * 0.5), this.width / 10, 0, 2 * Math.PI);
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