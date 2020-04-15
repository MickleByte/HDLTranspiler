import canvasObject from './canvasObject.js';
import Input from './input.js';
import Output from './output.js';

export default class Transformer extends canvasObject{
    constructor(x, y, width, numInputs = 2, numOutputs = 1){
        super(x, y, width, width);

        // define standard measure with which to construct the gate
        this.measure =  this.width / 10;   
        // establish max and minimum locations for the main body of the transformer
        this.maxBodyX = this.xPos + (this.measure * 7);
        this.minBodyX = this.xPos + (this.measure * 3);
        this.maxBodyY = this.yPos + (this.measure * 7);
        this.minBodyY = this.yPos + (this.measure * 3);

        /*
        
        I'll try and explain how all the gates are constructed with some really shoddy Ascii art:
        
                    _______
        0__________|        \_______0
         __________|        / 
        0          |_______/

        Input(s)      Body       output(s)



        The 'body' of the gate is always the bit in the middle which is the actual symbol for the gate
        for an OR that's the spaceship thing, or for an AND it's the semi sircle thing
        The body has 4 vars maxX, maxY, minX and minY that (in theory) bound it but also act as handy reference points for the location of other stuff relative to the gate

        The I/O (represented by the 0s) are connected to the body by lines

        */

        // init arrays of inputs and outputs to the transformer
        this.inputs = [];
        this.outputs = [];

        // this is the radius of the I/O circles
        var radiusOfIO = width / 40;

        var x, y;
        // for the number of required inputs, calculate their X Y coordinates and push them onto the inputs array
        for (var i = 0; i < numInputs; i++){
            [x, y] = this.calcIoPosition(i, true, numInputs)
            this.inputs.push(new Input(x, y, radiusOfIO));
        }

        // for number of outputs, calc x and y coords and push onto the outputs array
        for (var i = 0; i < numOutputs; i++){
            [x, y] = this.calcIoPosition(i, false, numOutputs)
            this.outputs.push(new Output(x, y, radiusOfIO));
        }
    }

    // calculates the x & y coordinates for input or output n. input will be true if the point in question is an input
    calcIoPosition(childIndex, input, numNodes){
        if (input){
            var distanceBetween  = (this.measure * 4) / (numNodes + 1); //divide by number of inputs + 1 - at this stage we are always assuming it is 2
            var x = this.minBodyX - (1.5 * this.measure); // the x is 1.5 measures less than the minimum of the main gate body
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
    draw(ctx, inputParentX = 0, outputParentX = 0, simToggle = false){
        // change colour to blue for I/O
        ctx.strokeStyle = "blue";
        // draw all inputs to transformer
        for (var i = 0; i < this.inputs.length; i++){
            this.inputs[i].draw(ctx, this.inputs[i].xPos + (1.5 * this.measure) + inputParentX, this.inputs[i].yPos, simToggle);
        }
        // draw all outputs of transformer
        for (var i = 0; i < this.outputs.length; i++){
            this.outputs[i].draw(ctx, this.outputs[i].xPos - (2 * this.measure) + outputParentX, this.outputs[i].yPos, simToggle);
        }
        // change colour back to black
        ctx.strokeStyle = "black";
    }

    // move gate in space with a change in x and y
    translate(changeX, changeY){
        super.translate(changeX, changeY);
        for (var i = 0; i < this.inputs.length; i++){
            this.inputs[i].translate(changeX, changeY);
        }

        for (var i = 0; i < this.outputs.length; i++){
            this.outputs[i].translate(changeX, changeY);
        }

        // reset these locations (measure remains the same however as it measures space not location)
        this.maxBodyX = this.xPos + (this.measure * 7);
        this.minBodyX = this.xPos + (this.measure * 3);
        this.maxBodyY = this.yPos + (this.measure * 7);
        this.minBodyY = this.yPos + (this.measure * 3);
    }

    // rather than translating the current coords as Translate() does, this resets the coords to a new X and Y
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

    // check to see if x and y are bounded within the gate body
    checkClick(x, y){
        if (x >= this.minBodyX && x <= this.maxBodyX && y >= this.minBodyY && y <= this.maxBodyY){
            return true;
        }
        return false;
    }

}