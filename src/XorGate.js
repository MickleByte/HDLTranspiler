import Transformer from './transformer.js';

export default class XOR extends Transformer{
    constructor(x, y, width, nameLabel = ""){
        super(x, y, width, 2, 1);
        this.operator = "^"
        this.nameLabel = "^"
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
        
        
        
        // top line
        ctx.beginPath();
        ctx.moveTo(this.xPos  - (this.width * 0.1), this.yPos);
        ctx.lineTo(this.xPos + (this.width * 0.6), this.yPos);
        ctx.stroke();

        // bottom line
        ctx.beginPath();
        ctx.moveTo(this.xPos  - (this.width * 0.1), this.yPos + this.height);
        ctx.lineTo(this.xPos + (this.width * 0.6), this.yPos + this.height);
        ctx.stroke();

        // right hand arc
        ctx.beginPath();
        ctx.moveTo(this.xPos + (this.width * 0.6), this.yPos);
        ctx.quadraticCurveTo(this.xPos + (this.width * 1.4), this.yPos + (this.height * 0.5), this.xPos + (this.width * 0.6), this.yPos + this.height);
        ctx.stroke();


        // left hand arc
        ctx.beginPath();
        ctx.moveTo(this.xPos - (this.width * 0.1), this.yPos);
        ctx.quadraticCurveTo(this.xPos + (this.width * 0.3), this.yPos + (this.height * 0.5), this.xPos - (this.width * 0.1), this.yPos + this.height);
        ctx.stroke();

        // left hand arc
        ctx.beginPath();
        ctx.moveTo(this.xPos - (this.width * 0.2), this.yPos);
        ctx.quadraticCurveTo(this.xPos + (this.width * 0.3), this.yPos + (this.height * 0.5), this.xPos - (this.width * 0.2), this.yPos + this.height);
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