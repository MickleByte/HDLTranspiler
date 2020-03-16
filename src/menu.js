import AND from './AndGate.js';
import XOR from './XorGate.js';
import OR from './OrGate.js';
import NOT from './NotGate.js';
import NAND from './NandGate.js';
import Indicator from './indicator.js';
import Source from './source.js';
import XNOR from './XnorGate.js';
import NOR from './NorGate.js';

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
    }

    draw(ctx){
        ctx.fillStyle = "#000000"
        // draw line across top
        var heightMenuItems = this.size;
        ctx.beginPath();
        ctx.moveTo(this.xPos, this.yPos + heightMenuItems);
        ctx.lineTo(this.xPos + this.canvWidth, this.yPos + heightMenuItems);
        ctx.stroke();

        var widthMenuItems = this.canvWidth / this.menuItems.length;
        for(var i=0;i<this.menuItems.length;i++){
            ctx.beginPath();
            ctx.moveTo((i) * widthMenuItems, 0);
            ctx.lineTo((i) * widthMenuItems, heightMenuItems);
            ctx.stroke();
            this.menuItems[i].updatePosition(this.xPos + (i * widthMenuItems) + (widthMenuItems / 2) - (this.menuItems[i].width / 2), this.yPos + (heightMenuItems / 2) - (this.menuItems[i].height / 2));
            this.menuItems[i].draw(ctx);
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