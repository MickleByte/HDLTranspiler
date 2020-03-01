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
        super.draw(ctx, this.measure);


        var thickness = 1; // border thickness (in pixels)
        ctx.fillStyle = "black"; // border colour
        ctx.fillRect(this.minBodyX, this.minBodyY, this.maxBodyX - this.minBodyX, this.maxBodyY - this.minBodyY); // draw border
        
        


        if (simToggle){
            ctx.fillStyle = this.colour; // body colour
        }
        else{
            ctx.fillStyle = "#FFFFFF"; // body colour
        }
        
        ctx.fillRect(this.minBodyX + thickness, this.minBodyY + thickness, this.maxBodyX - this.minBodyX - (thickness * 2), this.maxBodyY - this.minBodyY - (thickness * 2)); // draw border
        

        ctx.fillStyle = "#000000";
        var fontSize = (this.maxBodyY - this.minBodyY) * 0.9;
        fontSize = fontSize.toString();
        ctx.font = fontSize.concat("px Arial");

        var textWidth = ctx.measureText(this.nameLabel).width;
        while (textWidth > (this.maxBodyX - this.minBodyX)){
            fontSize--;
            fontSize = fontSize.toString();
            ctx.font = fontSize.concat("px Arial");
            var textWidth = ctx.measureText(this.nameLabel).width;
        }

        // filltext(string to be written, x location, y location)
        ctx.fillText(this.nameLabel, this.minBodyX, this.maxBodyY - (this.measure * 0.5));   
    }
}