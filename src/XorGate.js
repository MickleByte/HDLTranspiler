import Transformer from './transformer.js';

export default class XOR extends Transformer{
    constructor(x, y, width, nameLabel = ""){
        super(x, y, width, 2, 1);
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
        if (this.inputs[0].currentStatus && this.inputs[1].currentStatus || !this.inputs[0].currentStatus && !this.inputs[1].currentStatus){
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
        super.draw(ctx, this.measure, 0, simToggle);

        // drawing gate body
        ctx.fillStyle = "#fcba03"; // border colour
        
        // left hand arc (inner)
        ctx.beginPath();
        // (curve start x, start y)
        ctx.moveTo(this.minBodyX, this.minBodyY);
        // (control point x, control y, end x, end y)
        ctx.quadraticCurveTo(this.minBodyX + (this.measure * 2), this.minBodyY + (this.measure * 2), this.minBodyX, this.maxBodyY);
        ctx.stroke();

        // left hand arc (outside)
        ctx.beginPath();
        // (curve start x, start y)
        ctx.moveTo(this.minBodyX - this.measure, this.minBodyY);
        // (control point x, control y, end x, end y)
        ctx.quadraticCurveTo(this.minBodyX + (this.measure), this.minBodyY + (this.measure * 2), this.minBodyX - this.measure, this.maxBodyY);
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
        // (curve start x, start y)
        ctx.moveTo(this.maxBodyX - this.measure, this.minBodyY);
        // (control point x, control y, end x, end y)
        ctx.quadraticCurveTo(this.maxBodyX + (this.measure * 3),  this.minBodyY + (this.measure * 2), this.maxBodyX - this.measure, this.maxBodyY);
        ctx.stroke();
    }
}