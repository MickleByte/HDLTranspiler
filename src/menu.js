import AND from './AndGate.js';
import XOR from './XorGate.js';
import OR from './OrGate.js';
import NOT from './NotGate.js';
import NAND from './NandGate.js';
import Indicator from './indicator.js';
import Source from './source.js';
import XNOR from './XnorGate.js';
import NOR from './NorGate.js';
import Clock from './clock.js';

export default class Menu{
    constructor(canvWidth, canvHeight, x, y){
        var size = canvWidth / 12; // nuber of canvasWidth / number of menu Items * 2
        this.menuItems = [];
        this.canvHeight = canvHeight;
        this.canvWidth = canvWidth;
        this.xPos = x;
        this.yPos = y;
        this.size = size;
        this.menuItems.push(new Source(x, y, size, "IN"));
        this.menuItems.push(new Indicator(x, y, size, "OUT"));
        this.menuItems.push(new AND(x, y, size));
        this.menuItems.push(new OR(x, y, size));
        this.menuItems.push(new XOR(x, y, size));
        this.menuItems.push(new NOT(x, y, size));
        this.menuItems.push(new NAND(x, y, size));
        this.menuItems.push(new NOR(x, y, size));   
        this.menuItems.push(new XNOR(x, y, size));  
        this.menuItems.push(new Clock(x, y, size, "Clock"));      

        this.menuLabels = ["Input", "Output", "AND", "OR", "XOR", "NOT", "NAND", "NOR", "XNOR", "Clock In"];
    }

    draw(ctx){
        ctx.fillStyle = "#000000"
        // draw line across top of screen
        var heightMenuItems = this.size;
        ctx.beginPath();
        ctx.moveTo(this.xPos, this.yPos + heightMenuItems);
        ctx.lineTo(this.xPos + this.canvWidth, this.yPos + heightMenuItems);
        ctx.stroke();

        // divide width of screen into boxes for each menu item
        var widthMenuItems = this.canvWidth / this.menuItems.length;

        // draw the menu items
        for(var i=0;i<this.menuItems.length;i++){
            ctx.beginPath();
            ctx.moveTo((i) * widthMenuItems, 0);
            ctx.lineTo((i) * widthMenuItems, heightMenuItems);
            ctx.stroke();
            var x = this.xPos + (i * widthMenuItems) + (widthMenuItems / 2) - (this.menuItems[i].width / 2);
            var y = this.yPos + (heightMenuItems / 2) - (this.menuItems[i].height / 2);
            this.menuItems[i].updatePosition(x, y);
            this.menuItems[i].draw(ctx);

            // write menu item name label beneath it
            ctx.fillStyle = "#000000";
            var fontSize = heightMenuItems * 0.9;
            fontSize = fontSize.toString();
            ctx.font = fontSize.concat("px Arial");
    
            var textWidth = ctx.measureText(this.nameLabel).width;
            while (textWidth > widthMenuItems){
                fontSize--;
                fontSize = fontSize.toString();
                ctx.font = fontSize.concat("px Arial");
                var textWidth = ctx.measureText(this.nameLabel).width;
            }
    
            ctx.textAlign = "center";
            ctx.fillText(this.menuLabels[i], this.xPos + (i * widthMenuItems) + (widthMenuItems / 2), y + heightMenuItems);  
            ctx.textAlign = "left";


        }
    }


    checkMouseDown(mouseX, mouseY){
        for (var i = 0; i < this.menuItems.length; i++){
            if (this.menuItems[i].checkClick(mouseX, mouseY)){
                return this.menuItems[i].constructor.name;
            }
        }
    }
}