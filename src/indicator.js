import Transformer from './transformer.js';

export default class Indicator extends Transformer{
    constructor(x, y, width, nameLabel = ""){
        super(x, y, width, 1, 0);
        this.nameLabel = nameLabel;
    }

    simulate(currentStatus){
        if (currentStatus){
            this.colour = "green";
        }
        else{
            this.colour = "red";
        }
    }

    draw(ctx){
        super.draw(ctx); 
        ctx.fillStyle = "#000000";
        ctx.font = "50px Arial";
        ctx.fillText(this.nameLabel, this.xPos, this.yPos + this.height, this.width);   
    }
}