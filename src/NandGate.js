import Transformer from './transformer.js';

export default class NAND extends Transformer{
    constructor(x, y, width, nameLabel = ""){
        super(x, y, width, 2, 1);
        this.operator = "~&";
        this.nameLabel = "~&";
    }

    simulate(){
        if (this.inputs[0].currentStatus  == true && this.inputs[1].currentStatus == true){
            this.currentStatus = false;
        }
        else{
            this.currentStatus = true;
        }
        for (var i = 0; i < this.outputs.length; i++){
            this.outputs[i].currentStatus = this.currentStatus;
        }
    }


    draw(ctx, simToggle = false){

        super.draw(ctx, 0, this.measure, simToggle);


        // drawing gate body
        ctx.fillStyle = "#fcba03"; // border colour
        
        // left hand line
        ctx.beginPath();
        ctx.moveTo(this.minBodyX, this.minBodyY);
        ctx.lineTo(this.minBodyX, this.maxBodyY);
        ctx.stroke();

        // top line
        ctx.beginPath();
        ctx.moveTo(this.minBodyX, this.minBodyY);
        ctx.lineTo(this.maxBodyX - this.measure, this.minBodyY);
        ctx.stroke();

        // bottom line
        ctx.beginPath();
        ctx.moveTo(this.minBodyX, this.maxBodyY);
        ctx.lineTo(this.maxBodyX - this.measure, this.maxBodyY);
        ctx.stroke();

        // right hand arc
        ctx.beginPath();
        // ctx.arc(x location, y location, size, arcStart location, arcEnd location) - leave last two as 1.5*pi and 0.5*pi
        ctx.arc(this.maxBodyX - this.measure, this.maxBodyY - ( 2 * this.measure), this.measure * 2, 1.5 * Math.PI, 0.5 * Math.PI);
        ctx.stroke();


        // inverter circle
        ctx.beginPath();
        // ctx.arc(x location, y location, size, arcStart location, arcEnd location)
        ctx.arc(this.maxBodyX + (this.measure * 1.5), this.maxBodyY - ( 2 * this.measure), this.measure / 2, 0 * Math.PI, 2 * Math.PI);
        ctx.stroke();
        
    }
}