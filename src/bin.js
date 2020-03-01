import canvasObject from './canvasObject.js';

export default class Bin extends canvasObject{
    constructor(x, y, width){
        super(x - width, y - width, width, width);
    }

    draw(ctx){
        var thickness = 1; // border thickness (in pixels)
        ctx.fillStyle = "black"; // border colour
        ctx.fillRect(this.xPos, this.yPos, this.xPos + this.width, this.yPos + this.height); // draw border
        
        ctx.fillStyle = "#FFFFFF"; // body colour
        
        
        ctx.fillRect(this.xPos + thickness, this.yPos + thickness, this.xPos + this.width - (thickness * 2), this.yPos + this.height - (thickness * 2)); // draw border
        

        ctx.fillStyle = "#000000";
        var fontSize = (this.height) * 0.9;
        fontSize = fontSize.toString();
        ctx.font = fontSize.concat("px Arial");

        var textWidth = ctx.measureText("BIN").width;
        while (textWidth > (this.xPos + this.width - this.xPos)){
            fontSize--;
            fontSize = fontSize.toString();
            ctx.font = fontSize.concat("px Arial");
            var textWidth = ctx.measureText("BIN").width;
        }

        // filltext(string to be written, x location, y location)
        ctx.fillText("BIN", this.xPos, this.yPos + this.height);   
    }

    checkClick(x, y){
        return super.checkClick(x, y);
    }
}