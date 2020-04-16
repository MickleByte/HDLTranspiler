import Transformer from './transformer.js';

export default class Source extends Transformer{
    constructor(x, y, width, nameLabel = ""){
        super(x, y, width, 0, 1);
        this.currentStatus = false;
        this.nameLabel = nameLabel;
        this.updateState();
    }

    updateState(){
        this.currentStatus = !this.currentStatus;
    }

    simulate(){
        for (var i = 0; i < this.outputs.length; i++){
            this.outputs[i].currentStatus = this.currentStatus;
        }
    }


    draw(ctx, simToggle = false){
        super.draw(ctx, 0, -this.measure, simToggle);


        var thickness = 1; // border thickness (in pixels)
        ctx.fillStyle = "black"; // border colour
        ctx.fillRect(this.minBodyX, this.minBodyY, this.maxBodyX - this.minBodyX, this.maxBodyY - this.minBodyY); // draw border
        
        


        if (simToggle){
            if (this.currentStatus){
                this.colour = "green";
            }
            else{
                this.colour = "red";
            }
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

    setName(){
        var txt;
        var txt1 = prompt("Rename Node:", this.nameLabel);
        if (txt1 == null || txt1 == "") {
            txt = this.nameLabel;
        } else {
            txt = txt1;
        }
        this.nameLabel = txt;
    }   

}