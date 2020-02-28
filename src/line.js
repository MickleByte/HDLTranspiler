export default class canvasObject{
    constructor(startX, startY, endX, endY){
        // initialize variables
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }


    draw(ctx){
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();
    }

    update(changeX, changeY){
        this.endX -= changeX;
        this.endY -= changeY;
    }

}