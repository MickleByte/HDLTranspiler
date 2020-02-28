import canvasObject from './canvasObject.js';

export default class Bin extends canvasObject{
    constructor(x, y, width){
        super(x - width, y - width, width * 2, width * 2);
    }

    draw(ctx){
        super.draw(ctx);



        ctx.fillStyle = "#000000";
        var fontSize = this.height * 0.9;
        var textHeight = (this.height - fontSize);
        fontSize = fontSize.toString();
        var fontCommand = fontSize.concat("px Arial");
        ctx.font = fontCommand;

        var textWidth = ctx.measureText(this.nameLabel).width;
        textWidth = (this.width - textWidth) / 2;


        ctx.fillText("BIN", this.xPos + textWidth, this.yPos + this.height - textHeight);   
    }

    checkClick(x, y){
        return super.checkClick(x, y);
    }
}