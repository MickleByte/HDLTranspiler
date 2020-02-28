import Transformer from './transformer.js';

export default class Source extends Transformer{
    constructor(x, y, width, nameLabel = ""){
        super(x, y, width, 0, 1);
        this.currentStatus = true;
        this.nameLabel = nameLabel;
        this.updateState();
    }

    updateState(){
        this.currentStatus = !this.currentStatus;
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
        var fontSize = this.height * 0.9;
        var textHeight = (this.height - fontSize);
        fontSize = fontSize.toString();
        var fontCommand = fontSize.concat("px Arial");
        ctx.font = fontCommand;

        var textWidth = ctx.measureText(this.nameLabel).width;
        textWidth = (this.width - textWidth) / 2;


        ctx.fillText(this.nameLabel, this.xPos + textWidth, this.yPos + this.height - textHeight);   
    }
}