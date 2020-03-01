import AND from './AndGate.js';
import OR from './OrGate.js';
import NOT from './NotGate.js';
import XOR from './XorGate.js';
import Line from './line.js';
import Indicator from './indicator.js';
import Source from './source.js';
import Menu from './menu.js';
import Bin from './bin.js';
import NAND from './NandGate.js';
import NOR from './NorGate.js';
import XNOR from './XnorGate.js';
import CustomTrans from './customTransformer.js';

export default class Canvas{
    constructor(ctx){
        // initialize variables
        this.simulationToggle = false;
        this.drawCtx = ctx;
        this.elements = [];
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.scaleFactor = this.width / 25; // scales element sizes appropriately to canvas size
        this.ctx = ctx;
        this.lines = [];
        // these store the last place where the mouseDown happened - used to calc travel in mouseMove
        this.lastX = 0;
        this.lastY = 0;
        // remembers if mouse is currently down
        this.mouseIsDown = false;
        // remembers if a line is currently being drawn and where it's being drawn from
        this.drawingLine = false;
        this.lineSource = [0, 0];

        this.deleteLineFlag = false;
        
        this.currentNumberOfInputs = 0;
        this.currentNumberOfOutputs = 0;

        // creaton of menu
        this.menu = new Menu(this.width, this.height, 0, 0);

        // creation of bin
        this.bin = new Bin(this.width, this.height, this.width / 10);
        

        // call draw function
        this.draw();
    }

    generateInputName(id){
        var inputs = ["A", "B", "C", "D", "E", "F", "G"];
        var name = "";
        var counter = -1;
        while (id > inputs.length - 1){
            id = id - inputs.length;
            counter++;
        }
        if (counter != -1){
            name = name.concat(inputs[counter]);
        }  
        name = name.concat(inputs[id]);
        this.currentNumberOfInputs++;
        return name;
    }

    generateOutputName(id){
        var outputs = ["W", "X", "Y", "Z"];
        var name = "";
        var counter = -1;
        while (id > outputs.length - 1){
            id = id - outputs.length;
            counter++;
        }
        if (counter != -1){
            name = name.concat(outputs[counter]);
        }  
        name = name.concat(outputs[id]);
        this.currentNumberOfOutputs++;
        return name;
    }

    draw(){

        // clear canvas
        this.clear();

        // draw menu
        this.menu.draw(this.ctx);

        //draw bin
        this.bin.draw(this.ctx);

        // for each transformer call the draw function
        for (var i = 0; i < this.elements.length; i++){
            this.elements[i].draw(this.ctx, this.simulationToggle);
            for (var j = 0; j < this.elements[i].inputs.length; j++){
                if (this.elements[i].inputs[j].source != null){
                    var [x1, y1, x2, y2] = this.drawLineByID([i,j], this.elements[i].inputs[j].source);
                    this.drawLine(x1, y1, x2, y2);
                }         
            }
        }
        // for each line call the draw function
        for (var i = 0; i < this.lines.length; i++){
            this.lines[i].draw(this.ctx);
        }

        
    }

    drawLineByID(endID, sourceID){
        var source = this.elements[sourceID[0]].outputs[sourceID[1]];
        var end = this.elements[endID[0]].inputs[endID[1]];
        var x1 = end.xPos;
        var y1 = end.yPos;
        var x2 = source.xPos;
        var y2 = source.yPos;
        return [x1, y1, x2, y2];
    }

    drawLine(x1, y1, x2, y2){
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    mouseDown(xClick, yClick){
        this.mouseIsDown = true;
        // store click location to calculate mouse travel in mouseMove()
        this.lastX = xClick;
        this.lastY = yClick;
        // for each transformer, check if it was clicked - if it was then set isDragging flag to true
        for (var i = 0; i < this.elements.length; i++){
            if (this.elements[i].checkClick(xClick, yClick)){
                this.elements[i].isDragging = true;
            }
            // for each output of transformers, check if it was clicked - if it was then set isDragging flag to true
            for (var j = 0; j < this.elements[i].outputs.length; j++){
                if (this.elements[i].outputs[j].checkClick(xClick, yClick)){
                    this.elements[i].outputs[j].isDragging = true;
                    this.lines.push(new Line(this.elements[i].outputs[j].xPos, this.elements[i].outputs[j].yPos, xClick, yClick))
                    this.drawingLine = true;
                    this.lineSource = [i, j];
                }
            }
        }


        // check if menuItem was clicked & if it was, make an instance of that item
        for (var i = 0; i < this.menu.menuItems.length; i++){
            if (this.menu.menuItems[i].checkClick(xClick, yClick)){
                switch(this.menu.menuItems[i].constructor) {
                    case AND:
                        this.elements.push(new AND(this.menu.menuItems[i].xPos, this.menu.menuItems[i].yPos, this.menu.menuItems[i].width));
                        break;
                    case NAND:
                        this.elements.push(new NAND(this.menu.menuItems[i].xPos, this.menu.menuItems[i].yPos, this.menu.menuItems[i].width));
                        break;
                    case OR:
                        this.elements.push(new OR(this.menu.menuItems[i].xPos, this.menu.menuItems[i].yPos, this.menu.menuItems[i].width));
                      break;
                    case XOR:
                        this.elements.push(new XOR(this.menu.menuItems[i].xPos, this.menu.menuItems[i].yPos, this.menu.menuItems[i].width));
                        break;
                    case NOR:
                        this.elements.push(new NOR(this.menu.menuItems[i].xPos, this.menu.menuItems[i].yPos, this.menu.menuItems[i].width));
                        break;
                    case XNOR:
                        this.elements.push(new XNOR(this.menu.menuItems[i].xPos, this.menu.menuItems[i].yPos, this.menu.menuItems[i].width));
                        break;
                    case Indicator:
                        this.elements.push(new Indicator(this.menu.menuItems[i].xPos, this.menu.menuItems[i].yPos, this.menu.menuItems[i].width, this.generateOutputName(this.currentNumberOfOutputs)));
                        break;
                    case Source:
                        this.elements.push(new Source(this.menu.menuItems[i].xPos, this.menu.menuItems[i].yPos, this.menu.menuItems[i].width, this.generateInputName(this.currentNumberOfInputs)));
                        break;
                    case NOT:
                        this.elements.push(new NOT(this.menu.menuItems[i].xPos, this.menu.menuItems[i].yPos, this.menu.menuItems[i].width));
                        break;


                    case CustomTrans:
                        this.elements.push(new CustomTrans(this.menu.menuItems[i].xPos, this.menu.menuItems[i].yPos, this.menu.menuItems[i].width, this.menu.menuItems[i].inputs.lenth, this.menu.menuItems[i].outputs.lenth, this.menu.menuItems[i].operator));
                        break;
                    default:
                      console.log("ERROR: Could not find class to make instance of")
                }
                this.elements[this.elements.length - 1].isDragging = true;
            }
        }
        
    }

    mouseMove(newX, newY){
        if (this.mouseIsDown){
            // calculate change in x from last click location to passed location
            var changeX = this.lastX - newX;
            var changeY = this.lastY - newY;

            var noIOClicked = true;
            // for each element that has isDragging toggled, translate it by the change in x & y
            for (var i = 0; i < this.elements.length; i++){
                // for each input/ output, if isDragging is true, a line needs to be drawn from it to the current cursor position
                for (var j = 0; j < this.elements[i].outputs.length; j++){
                    if (this.elements[i].outputs[j].isDragging){
                        this.lines[this.lines.length - 1].update(changeX, changeY);
                        noIOClicked = false;
                    }
                }

                // don't want to drag any of the transformers if we are trying to connect them up
                if (noIOClicked){
                    if (this.elements[i].isDragging == true){
                        this.elements[i].translate(changeX, changeY);
                    }
                }
                
            }

            if (this.deleteLineFlag){
                // check if mouse move intersects one of the lines

               var col = this.ctx.getImageData(newX, newY, 1, 1);
               if (col.data[0] == 255 && col.data[1] == 255 && col.data[2] == 255){
                   console.log("Black");
               }

            }
            
            this.lastX = newX;
            this.lastY = newY;
            this.draw();
        }  
    }

    mouseUp(mouseX, mouseY){
        // check if a line is valid (ends in an input node)       
        if (this.drawingLine){
            for (var i = 0; i < this.elements.length; i++){
                for (var j = 0; j < this.elements[i].inputs.length; j++){
                    if (this.elements[i].inputs[j].checkClick(mouseX, mouseY)){
                        this.elements[i].inputs[j].setSource(this.lineSource);
                    }
                }
            }
            this.lines.splice(this.lines.length - 1, 1);
        }


        this.drawingLine = false;
        this.mouseIsDown = false;
        // for each element, set isDragging to false
        for (var i = 0; i < this.elements.length; i++){
            if (this.elements[i].isDragging){
                // if the mouse up has occured above the bin & was dragging an element, it should be deleted
                if (this.bin.checkClick(this.elements[i].xPos + (this.elements[i].width / 2), this.elements[i].yPos + (this.elements[i].height / 2))){
                    this.elements.splice(i, 1);
                }       
            }
        }


        for (var i = 0; i < this.elements.length; i++){
            this.elements[i].isDragging = false;
            for (var j = 0; j < this.elements[i].inputs.length; j++){
                this.elements[i].inputs[j].isDragging = false;
            }
            for (var j = 0; j < this.elements[i].outputs.length; j++){
                this.elements[i].outputs[j].isDragging = false;
            }
        }
        this.draw();
    }


    dblClick(mouseX, mouseY){
        if (this.simulationToggle){
            for (var i = 0; i < this.elements.length; i++){
                if (this.elements[i] instanceof Source){
                    if (this.elements[i].checkClick(mouseX, mouseY)){
                        this.elements[i].updateState();
                    }        
                }
            }
            this.calcSimulation();       
        }
        else{
            for (var i = 0; i < this.elements.length; i++){
                if (this.elements[i] instanceof Source || this.elements[i] instanceof Indicator){
                    if (this.elements[i].checkClick(mouseX, mouseY)){
                        var txt;
                        var txt1 = prompt("Rename Node:", this.elements[i].nameLabel);
                        if (txt1 == null || txt1 == "") {
                            txt = this.elements[i].nameLabel;
                        } else {
                            txt = txt1;
                        }
                        this.elements[i].nameLabel = txt;
                    }        
                }
            }
           
        }
        this.draw();
    }

    clear(){
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    translate2HDL(moduleName = "MODULE_NAME"){
        var HDL = ""
        HDL = HDL.concat("module ");
        HDL = HDL.concat(moduleName);
        HDL = HDL.concat(" (");
        // inputs go here

        var inputsAndOutputs = "\n\t"
        for(var i=0;i<this.elements.length;i++){
            if (this.elements[i] instanceof Source){
                inputsAndOutputs = inputsAndOutputs.concat("input ")
                inputsAndOutputs = inputsAndOutputs.concat(this.elements[i].nameLabel);
                inputsAndOutputs = inputsAndOutputs.concat(",\n\t");
            } 
            else if( this.elements[i] instanceof Indicator){
                inputsAndOutputs = inputsAndOutputs.concat("output ")
                inputsAndOutputs = inputsAndOutputs.concat(this.elements[i].nameLabel);
                inputsAndOutputs = inputsAndOutputs.concat(",\n\t");
            }
        }
        inputsAndOutputs = inputsAndOutputs.substring(0, inputsAndOutputs.length - 3);
        HDL = HDL.concat(inputsAndOutputs);

        HDL = HDL.concat("\n\t);\n");

        var assigny = "";
        for(var i=0;i<this.elements.length;i++){
            // need an indicator endpoint to work back from
            if( this.elements[i] instanceof Indicator){
                assigny = "\nassign ";
                assigny = assigny.concat(this.elements[i].nameLabel)
                assigny = assigny.concat(" = ");
                var rootNode = this.elements[i];
                var prevNode = this.elements[rootNode.inputs[0].source[0]]
                var assigny = assigny.concat(this.createEquation(prevNode));
                HDL = HDL.concat(assigny);
                HDL = HDL.concat(";");
            }
        }

        HDL = HDL.concat("\n\nendmodule");

        console.log(HDL);
        return HDL;
    }

    isOperator(node){
        if (!(node instanceof Source || node instanceof Indicator)){
            return true;
        }
        else{
            return false;
        }
    }
    

    createEquation(rootNode){
        var equation = "";
        if (!( rootNode instanceof Source)){
            if (this.isOperator(rootNode)){
                equation = equation.concat("(");
            }
            if (rootNode.inputs[1] == null){
                // if it only has 1 input (a NOT Gate)
                equation = equation.concat(rootNode.nameLabel);
                equation = equation.concat(this.createEquation(this.elements[rootNode.inputs[0].source[0]]));
            }
            else{
                equation = equation.concat(this.createEquation(this.elements[rootNode.inputs[0].source[0]]));
                equation = equation.concat(" ");
                equation = equation.concat(rootNode.nameLabel);
                equation = equation.concat(" ");
                equation = equation.concat(this.createEquation(this.elements[rootNode.inputs[1].source[0]]));
            }
            
            if (this.isOperator(rootNode)){
                equation = equation.concat(")");
            }
        }
        else{
            equation = equation.concat(rootNode.nameLabel);
        }
        return equation;
    }

    performCheck(LHS, operator, RHS = false){
        if (operator == "&&"){
            if (LHS && RHS){
                return true;
            }
            return false;
        }
        else if(operator == "||"){
            if (LHS || RHS){
                return true;
            }
            return false;
        }
        else if(operator == "^"){
            if (LHS && RHS || !LHS && !RHS){
                return false;
            }
            return true;
        }
        else if(operator == "~&"){
            if (LHS && RHS){
                return false;
            }
            return true;
        }
        else if(operator == "!"){
            if (LHS){
                return false;
            }
            return true;
        }
    }

    getState(rootNode){
        var signal = false;
        if (!( rootNode instanceof Source)){
            if (rootNode.inputs[1] == null){
                // if it only has 1 input (a NOT Gate)
                var LHS = this.getState(this.elements[rootNode.inputs[0].source[0]]);
                signal = this.performCheck(LHS, rootNode.nameLabel);
            }
            else{
                var LHS = this.getState(this.elements[rootNode.inputs[0].source[0]]);
                var RHS = this.getState(this.elements[rootNode.inputs[1].source[0]]);
                signal = this.performCheck(LHS, rootNode.nameLabel, RHS);
            }
        }
        else{
            signal = rootNode.currentStatus;
        }
        return signal;
    }

    simulate(){
        this.simulationToggle = !this.simulationToggle;   
        this.calcSimulation(); 
    }

    calcSimulation(){
        if (this.simulationToggle){
            for(var i=0;i<this.elements.length;i++){
                // need an indicator endpoint to work back from
                if( this.elements[i] instanceof Indicator){
                    var indicator = this.elements[i];
                    indicator.simulate(this.getState(this.elements[indicator.inputs[0].source[0]]));
                }
            }
        }
        this.draw();
    }

    save2Pallet(){
        var numInputs = 0;
        var numOutputs = 0;
        var operator = "";
        for(var i=0;i<this.elements.length;i++){
            // need an indicator endpoint to work back from
            if( this.elements[i] instanceof Indicator){
                var indicator = this.elements[i];
                numOutputs++;
                operator = this.createEquation(this.elements[indicator.inputs[0].source[0]]);
            }
            else if(this.elements[i] instanceof Source){
                numInputs++;
            }
        }
        this.menu.menuItems.push(new CustomTrans(0, 0, this.width / 10, numInputs, numOutputs, operator));
        this.draw();
    }

    deleteLineBtn(){
        this.deleteLineFlag = ! this.deleteLineFlag;
    }

}