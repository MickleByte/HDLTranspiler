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

    draw(ctx, simToggle = false){
        super.draw(ctx);
        var thickness = 1; // border thickness (in pixels)
        ctx.fillStyle = "#000000"; // border colour
        ctx.fillRect(this.xPos, this.yPos, this.width, this.height); // draw border
        
        if (simToggle){
            ctx.fillStyle = this.colour; // body colour
        }
        else{
            ctx.fillStyle = "#FFFFFF"; // body colour
        }
        
        ctx.fillRect(this.xPos + (thickness), this.yPos + (thickness), this.width - (thickness * 2), this.height - (thickness * 2)); // draw body
        
        ctx.fillStyle = "#000000";
        var fontSize = this.width;
        fontSize = fontSize.toString();
        var fontCommand = fontSize.concat("px Arial");
        ctx.font = fontCommand;
        ctx.fillText(this.nameLabel, this.xPos, this.yPos + this.height, this.width);   
    }
}