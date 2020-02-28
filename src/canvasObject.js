export default class canvasObject{
    constructor(x, y, width, height){
        // initialize variables
        this.xPos = x;
        this.yPos = y;
        this.width = width;
        this.height = height;
        this.isDragging = false;
        this.colour = "#FFFFFF";
    }

    draw(ctx, borderColour = "#000000"){
        var thickness = 1; // border thickness (in pixels)
        ctx.fillStyle = borderColour; // border colour
        ctx.fillRect(this.xPos, this.yPos, this.width, this.height); // draw border
        
        ctx.fillStyle = this.colour; // body colour
        ctx.fillRect(this.xPos + (thickness), this.yPos + (thickness), this.width - (thickness * 2), this.height - (thickness * 2)); // draw body
    }

    checkClick(x, y){
        if (x >= this.xPos && x <= this.width + this.xPos && y >= this.yPos && y <= this.height + this.yPos){
            return true;
        }
        return false;
    }

    translate(changeX, changeY){
        this.xPos -= changeX;
        this.yPos -= changeY;
    }

    updatePosition(newX, newY){
        var changeX = this.xPos - newX;
        var changeY = this.yPos - newY;
        this.translate(changeX, changeY);
    }
}