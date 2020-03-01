import canvasObject from './canvasObject.js';
import Input from './input.js';
import Output from './output.js';

export default class Transformer extends canvasObject{
    constructor(x, y, width, numInputs = 2, numOutputs = 1){
        super(x, y, width, width);
        this.measure =  this.width / 10;   // define standard measure with which to construct the gate

        // establish max and minimum locations for the main body of the transformer
        this.maxBodyX = this.xPos + (this.measure * 7);
        this.minBodyX = this.xPos + (this.measure * 3);
        this.maxBodyY = this.yPos + (this.measure * 7);
        this.minBodyY = this.yPos + (this.measure * 3);

        this.inputs = [];
        this.outputs = [];

        var radiusOfIO = width / 40;
        var x, y;
        for (var i = 0; i < numInputs; i++){
            [x, y] = this.calcIoPosition(i, true, numInputs, radiusOfIO)
            this.inputs.push(new Input(x, y, radiusOfIO));
        }

        for (var i = 0; i < numOutputs; i++){
            [x, y] = this.calcIoPosition(i, false, numOutputs, radiusOfIO)
            this.outputs.push(new Output(x, y, radiusOfIO));
        }
    }

    // calculates the x & y coordinates for input or output n. input will be true if the point in question is an input
    calcIoPosition(childIndex, input, numNodes, widthOfNodes = 5){
        if (input){
            var distanceBetween  = (this.measure * 4) / (numNodes + 1); //divide by number of inputs + 1 - at this stage we are always assuming it is 2
            var x = this.minBodyX - (1.5 * this.measure);
            var y = this.minBodyY + (distanceBetween * (childIndex + 1));
            return [x, y];
        }
        else{
            var distanceBetween  = (this.measure * 4) / (numNodes + 1); //divide by number of outputs + 1 - at this stage we are always assuming it is 1
            var x = this.maxBodyX + (3 * this.measure);
            var y = this.minBodyY + (distanceBetween * (childIndex + 1));
            return [x, y];
        }     
    }

    // parentX value can be used to start or finish the connecting line between IO and gate body but it is 0 by default
    draw(ctx, inputParentX = 0, outputParentX = 0){
        // change colour to blue for I/O
        ctx.strokeStyle = "blue";
        // draw all inputs to transformer
        for (var i = 0; i < this.inputs.length; i++){
            this.inputs[i].draw(ctx, this.inputs[i].xPos + (1.5 * this.measure) + inputParentX, this.inputs[i].yPos);
        }
        // draw all outputs of transformer
        for (var i = 0; i < this.outputs.length; i++){
            this.outputs[i].draw(ctx, this.outputs[i].xPos - (2 * this.measure) + outputParentX, this.outputs[i].yPos);
        }
        // change colour back to black
        ctx.strokeStyle = "black";
    }

    translate(changeX, changeY){
        super.translate(changeX, changeY);
        for (var i = 0; i < this.inputs.length; i++){
            this.inputs[i].translate(changeX, changeY);
        }

        for (var i = 0; i < this.outputs.length; i++){
            this.outputs[i].translate(changeX, changeY);
        }
        this.maxBodyX = this.xPos + (this.measure * 7);
        this.minBodyX = this.xPos + (this.measure * 3);
        this.maxBodyY = this.yPos + (this.measure * 7);
        this.minBodyY = this.yPos + (this.measure * 3);
    }

    updatePosition(newX, newY){
        super.updatePosition(newX, newY);
        for (var i = 0; i < this.inputs.length; i++){
            this.calcIoPosition(i, true, this.inputs.length);
        }

        for (var i = 0; i < this.outputs.length; i++){
            this.calcIoPosition(i, false, this.outputs.length);
        }
        this.maxBodyX = this.xPos + (this.measure * 7);
        this.minBodyX = this.xPos + (this.measure * 3);
        this.maxBodyY = this.yPos + (this.measure * 7);
        this.minBodyY = this.yPos + (this.measure * 3);
    }

    simulate(){
        for (var i = 0; i < this.inputs.length; i++){
            this.inputs[i].source[0] //???????
        }
    }


    checkClick(x, y){
        if (x >= this.minBodyX && x <= this.maxBodyX && y >= this.minBodyY && y <= this.maxBodyY){
            return true;
        }
        return false;
    }

}