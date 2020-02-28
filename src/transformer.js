import canvasObject from './canvasObject.js';
import Input from './input.js';
import Output from './output.js';

export default class Transformer extends canvasObject{
    constructor(x, y, width, numInputs = 2, numOutputs = 1){
        super(x, y, width, width);
        this.inputs = [];
        this.outputs = [];


        var x, y;
        for (var i = 0; i < numInputs; i++){
            [x, y] = this.calcIoPosition(i, true, numInputs)
            this.inputs.push(new Input(x, y));
        }

        for (var i = 0; i < numOutputs; i++){
            [x, y] = this.calcIoPosition(i, false, numOutputs)
            this.outputs.push(new Output(x, y));
        }
    }

    // calculates the x & y coordinates for input or output n. input will be true if the point in question is an input
    calcIoPosition(childIndex, input, numNodes){
        var widthOfNodes = 5;
        if (input){
            var distanceBetween  = this.height / (numNodes + 1); //divide by number of inputs + 1 - at this stage we are always assuming it is 2
            var x = this.xPos - widthOfNodes;
            var y = this.yPos + (distanceBetween * (childIndex + 1));
            return [x, y];
        }
        else{
            var distanceBetween  = this.height / (numNodes + 1); //divide by number of outputs + 1 - at this stage we are always assuming it is 1
            var x = this.xPos + this.width + widthOfNodes;
            var y = this.yPos + (distanceBetween * (childIndex + 1));
            return [x, y];
        }     
    }

    draw(ctx, borderColour = "#000000"){
        super.draw(ctx, borderColour);
        // draw all inputs to transformer
        for (var i = 0; i < this.inputs.length; i++){
            this.inputs[i].draw(ctx);
        }
        // draw all outputs of transformer
        for (var i = 0; i < this.outputs.length; i++){
            this.outputs[i].draw(ctx);
        }
    }

    translate(changeX, changeY){
        super.translate(changeX, changeY);
        for (var i = 0; i < this.inputs.length; i++){
            this.inputs[i].translate(changeX, changeY);
        }

        for (var i = 0; i < this.outputs.length; i++){
            this.outputs[i].translate(changeX, changeY);
        }
    }

    updatePosition(newX, newY){
        super.updatePosition(newX, newY);
        for (var i = 0; i < this.inputs.length; i++){
            this.calcIoPosition(i, true, this.inputs.length);
        }

        for (var i = 0; i < this.outputs.length; i++){
            this.calcIoPosition(i, false, this.outputs.length);
        }
    }

    simulate(){
        for (var i = 0; i < this.inputs.length; i++){
            this.inputs[i].source[0] //???????
        }
    }


}