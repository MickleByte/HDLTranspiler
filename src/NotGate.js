import Transformer from './transformer.js';

export default class NOT extends Transformer{
    constructor(x, y, width, nameLabel = ""){
        super(x, y, width, 1, 1);
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
        if (this.inputs[0].currentStatus){
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

        super.draw(ctx, 0, 0, simToggle);

        ctx.fillStyle = "#fcba03"; // border colour         
        
        // left hand line
        ctx.beginPath();
        ctx.moveTo(this.minBodyX, this.minBodyY);
        ctx.lineTo(this.minBodyX, this.maxBodyY);
        ctx.stroke();

        // top line
        ctx.beginPath();
        ctx.moveTo(this.minBodyX, this.minBodyY);
        ctx.lineTo(this.maxBodyX, this.minBodyY + (this.measure * 2));
        ctx.stroke();

        // bottom line
        ctx.beginPath();
        ctx.moveTo(this.minBodyX, this.maxBodyY);
        ctx.lineTo(this.maxBodyX, this.minBodyY + (this.measure * 2));
        ctx.stroke();

        // inverter circle
        ctx.beginPath();
        // ctx.arc(x location, y location, size, arcStart location, arcEnd location)
        ctx.arc(this.maxBodyX + (this.measure * 0.5), this.maxBodyY - ( 2 * this.measure), this.measure / 2, 0 * Math.PI, 2 * Math.PI);
        ctx.stroke();
    }
}