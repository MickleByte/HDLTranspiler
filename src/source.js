import Transformer from './transformer.js';

export default class Source extends Transformer{
    constructor(x, y, width, nameLabel = ""){
        super(x, y, width, 0, 1);
        this.currentStatus = false;
        this.nameLabel = nameLabel;
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
        super.draw(ctx); 
        ctx.fillStyle = "#000000";
        ctx.font = "50px Arial";
        ctx.fillText(this.nameLabel, this.xPos, this.yPos + this.height, this.width);   
    }
}