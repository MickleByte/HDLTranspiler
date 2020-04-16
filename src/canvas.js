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
import Clock from './clock.js';
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
        this.internalClock = 0;// this internal clock starts at 0, it is increased by 1 every milisecond by the function clockUpdate() which is called by an interval function in index.js
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

    Erase(){
        // if the number of elements isn't 0 (there has not been nothing drawn yet)
        if (this.elements.length != 0){
            // give user alert to make sure they want to delete
            var confirmation = confirm("Are you sure? This will delete your diagram");
            if (confirmation){
                // clear elements arr
                this.elements = [];
                this.lines = [];
                // and if the sim is currently running stop it
                if (this.simulationToggle){
                    document.getElementById("simulateToggle").click()
                }
                // update UI
                this.draw();
            }
        }     
    }

    generateClockName(id){
        var name = "clk";
        var id = this.generateInputName(id);
        return name.concat(id);
    }

    generateInputName(id){
        // input names will be generated in this list: A, B, C, D, E, F, G, AA, AB, AC, AD, ..., GA, GB, GC, GD, GE, GF, GG.
        // this can be extended to have more possible names by either adding more letters to the array or by adding another division to get a 3 letter name
        var inputs = ["A", "B", "C", "D", "E", "F", "G"];
        var name = "";
        var counter = -1;
        // get remainder from id / inputs.length
        while (id > inputs.length - 1){
            id = id - inputs.length;
            counter++;
        }
        // index of counter is first letter
        if (counter != -1){
            name = name.concat(inputs[counter]);
        }  
        name = name.concat(inputs[id]);
        this.currentNumberOfInputs++;
        return name;
    }

    generateOutputName(id){
        // all letters that there can be possible combinations of
        // output names will be generated in this list: W, X, Y, Z, WW, WX, WY, WZ, XW, XX, XY, XZ, ..., ZY, ZZ.
        var outputs = ["W", "X", "Y", "Z"];
        var name = "";
        var counter = -1;
        // id / outputs.length = counter, with the remainder being left in id
        while (id > outputs.length - 1){
            id = id - outputs.length;
            counter++;
        }
        // concat the letter is at index counter
        if (counter != -1){
            name = name.concat(outputs[counter]);
        }  
        // the next letter to be concat is the index of the remainder (id)
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
            // for each input of the transformer
            for (var j = 0; j < this.elements[i].inputs.length; j++){
                // if the source is not null (it has been set to point to another transformer)
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
        // the start of the line (source) can be found by getting the index that the output is pointing to
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

        // don't want to allow menu item creation and node movement when the simulation is being run
        if (!this.simulationToggle){
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
                    // need to choose the right constructor depending on which menu item was clicked
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
                            this.elements.push(new CustomTrans(this.menu.menuItems[i].xPos, this.menu.menuItems[i].yPos, this.menu.menuItems[i].width, this.menu.menuItems[i].inputs.lenth, this.menu.menuItems[i].outputs.lenth, this.menu.menuItems[i].nameLabel));
                            break;
                        case Clock:
                            this.elements.push(new Clock(this.menu.menuItems[i].xPos, this.menu.menuItems[i].yPos, this.menu.menuItems[i].width, this.generateClockName(this.currentNumberOfInputs)));
                            break;
                        default:
                            console.log("ERROR: Could not find class to make instance of")
                    }
                    this.elements[this.elements.length - 1].isDragging = true;
                }
            }
        }
        else{
            // for each source, check if it was clicked & flip its status if it was
            for (var i = 0; i < this.elements.length; i++){
                if (this.elements[i] instanceof Source){
                    if (this.elements[i].checkClick(xClick, yClick)){
                        this.elements[i].updateState();
                    }
                }   
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

        if (this.simulationToggle){
            var transformerHover = false;
            // for each transformer, check if it was clicked - if it was then set isDragging flag to true
            for (var i = 0; i < this.elements.length; i++){
                if (this.elements[i] instanceof Source){
                    if (this.elements[i].checkClick(newX, newY)){
                        transformerHover = true;
                    }
                }   
            }
            if (transformerHover){
                document.getElementById("canvas").style.cursor = "pointer";
            }
            else{
                document.getElementById("canvas").style.cursor = "auto";
            }
        }
    }

    deleteElement(indexOfDeleted){
         // traverse the elements array and for each node, find out if any of it's inputs/ outputs point to the deleted node
         for (var i = 0; i < this.elements.length; i++){
             // if it's the deleted node then we don't need to bother
            if (i != indexOfDeleted){
                var node = this.elements[i];
                // for each input of node
                for (var j = 0; j < node.inputs.length; j++){
                    var input = node.inputs[j];
                    // if the input doesn't point to anything, ignore it
                    if (input.source != null){
                        // if the input points to the deleted node
                        if (input.source[0] == indexOfDeleted){
                            // reset the input to point to nothing
                            input.source = null
                        }
                        // if the input points to a node in a higher location in the arr than the node we're deleting, it needs to be moved back one place
                        else if(input.source[0] > indexOfDeleted){
                            input.source[0]--;
                        }
                    }
                }    
                
                // this external loop will handle gates with more than one output
                for (var j = 0; j < node.outputs.length; j++){
                    var nodeOut = node.outputs[j]
                    for (var k = 0; k < nodeOut.pointer.length; k++){
                        // go through all the nodes the outputs point to
                        var outputs = nodeOut.pointer;
                        // if it's pointing to the deleted node
                        if (outputs[k][0] == indexOfDeleted){
                            // remove it from the arr of outputs
                            outputs.splice(k, 1);
                        }
                        // if it's pointing to a node with a greater index than the deleted node, we need to move it down one place to fill the gap
                        else if(outputs[k][0] > indexOfDeleted){
                            outputs[k][0]--;
                        }
                    }
                }
                
            }
                                                      
        }

        if (!(this.elements[indexOfDeleted] instanceof Indicator)){
            var deletedNodeOutputs = this.elements[indexOfDeleted].outputs[0].pointer;
            // also need to traverse the deleted nodes outputs to see what they were pointing to and reset them if needed
            for (var i = 0; i < deletedNodeOutputs.length; i++){
                this.elements[deletedNodeOutputs[i][0]].inputs[deletedNodeOutputs[i][1]].currentStatus = false;
            }      
        }
        
        // delete the node by removing it from the array of elements
        this.elements.splice(indexOfDeleted, 1);
    }

    mouseUp(mouseX, mouseY){
        // check if a line is valid (ends in an input node)       
        if (this.drawingLine){
            for (var i = 0; i < this.elements.length; i++){
                for (var j = 0; j < this.elements[i].inputs.length; j++){
                    if (this.elements[i].inputs[j].checkClick(mouseX, mouseY)){
                        this.elements[i].inputs[j].setSource(this.lineSource); // set input to point at a given output
                        this.elements[this.lineSource[0]].outputs[this.lineSource[1]].setOut([i, j]); // set that output to also point at input i, j
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
                   this.deleteElement(i);
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
        if (!this.simulationToggle){
            for (var i = 0; i < this.elements.length; i++){
                if (this.elements[i] instanceof Clock){
                    if (this.elements[i].checkClick(mouseX, mouseY)){
                        var txt;
                        var txt1 = prompt("Set clock speed:", this.elements[i].clockSpeed);
                        if (txt1 == null || txt1 == "") {
                            txt = this.elements[i].nameLabel;
                        } else {
                            txt = txt1;
                        }
                        this.elements[i].clockSpeed = txt;
                    }
                }
                else if (this.elements[i] instanceof Source || this.elements[i] instanceof Indicator){
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
        // update UI
        this.draw();
    }

    clear(){
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    generateGrayArr(n){ 
        // base case 
        if (n <= 0) 
            return; 
    
        // 'arr' will store all generated codes 
        var arr = []; 
    
        // start with one-bit pattern 
        arr.push("0"); 
        arr.push("1"); 
    
        // Every iteration of this loop generates 2*i codes from previously 
        // generated i codes. 
        for (var i = 2; i < (1<<n); i = i<<1) 
        { 
            // Enter the prviously generated codes again in arr[] in reverse 
            // order. Nor arr[] has double number of codes. 
            for (var j = i-1 ; j >= 0 ; j--) {
                arr.push(arr[j]);
            }
                 
    
            // append 0 to the first half 
            for (j = 0 ; j < i ; j++) {
                arr[j] = "0" + arr[j]; 
            }
                
    
            // append 1 to the second half 
            for (j = i ; j < 2*i ; j++) {
                arr[j] = "1" + arr[j]; 
            }
                
        } 
        return arr;
    } 

    generateTestBench(moduleName){
        var testBench = ""
        testBench = testBench.concat("`timescale 1ns / 1ps\nmodule ", moduleName.concat("TestBench"), ";");
        testBench = testBench.concat("\n\t// Inputs:");
        var listOfInputs = []
        var inputStatus = []
        for(var i=0;i<this.elements.length;i++){
            if (this.elements[i] instanceof Source){
                listOfInputs.push(this.elements[i].nameLabel);
                inputStatus.push(0);
                testBench = testBench.concat("\n\treg ")
                testBench = testBench.concat(this.elements[i].nameLabel);
                testBench = testBench.concat(";");
            }
        }
        testBench = testBench.concat("\n\t// Outputs:");
        for(var i=0;i<this.elements.length;i++){
            if (this.elements[i] instanceof Indicator){
                testBench = testBench.concat("\n\twire ")
                testBench = testBench.concat(this.elements[i].nameLabel);
                testBench = testBench.concat(";");
            }
        }
        testBench = testBench.concat("\n\t// Instantiate Unit Under Test (UUT):");
        testBench = testBench.concat("\n\t", moduleName);
        testBench = testBench.concat(" uut (");
        for(var i=0;i<this.elements.length;i++){
            if (this.elements[i] instanceof Source || this.elements[i] instanceof Indicator){
                testBench = testBench.concat("\n\t\t.")
                testBench = testBench.concat(this.elements[i].nameLabel);
                testBench = testBench.concat("(");
                testBench = testBench.concat(this.elements[i].nameLabel);
                testBench = testBench.concat("),");
            }
        }
        testBench = testBench.substring(0, testBench.length - 1);
        testBench = testBench.concat("\n\t);");
        testBench = testBench.concat("\n\n");
        testBench = testBench.concat("\tinitial begin");
        testBench = testBench.concat("\n\t// Initialise Inputs");
        for(var i=0;i<this.elements.length;i++){
            if (this.elements[i] instanceof Source){
                testBench = testBench.concat("\n\t\t")
                testBench = testBench.concat(this.elements[i].nameLabel);
                testBench = testBench.concat(" = 0;");
            }
        }
        testBench = testBench.concat("\n\n");

        var grayArr = this.generateGrayArr(listOfInputs.length);
        for (var i = 0; i < grayArr.length; i++){
            for (var j = 0; j < grayArr[i].length; j++){
                if (grayArr[i][j] != inputStatus[j]){
                    testBench = testBench.concat("\t#20 ", listOfInputs[j], " = ", grayArr[i][j], ";\n");
                    inputStatus[j] = grayArr[i][j];
                }
            }
        }
        testBench = testBench.concat("\t#40;");

        testBench = testBench.concat("\n\tend");
        testBench = testBench.concat("\n");
        testBench = testBench.concat("\n\tinitial begin");
        testBench = testBench.concat("\n\t\t$monitor(\"");
        for(var i=0;i<this.elements.length;i++){
            if (this.elements[i] instanceof Source || this.elements[i] instanceof Indicator){
                testBench = testBench.concat(this.elements[i].nameLabel);
                testBench = testBench.concat("=%d, ");
            }
        }
        testBench = testBench.substring(0, testBench.length - 2);
        testBench = testBench.concat("\", ");
        for(var i=0;i<this.elements.length;i++){
            if (this.elements[i] instanceof Source || this.elements[i] instanceof Indicator){
                testBench = testBench.concat(this.elements[i].nameLabel);
                testBench = testBench.concat(", ");
            }
        }
        testBench = testBench.substring(0, testBench.length - 2);
        testBench = testBench.concat(");\n\tend\n\nendmodule");
        console.log(testBench);
        return testBench;
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
                // ensure that it is connected to an input
                if (this.elements[i].inputs[0].source != null){
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

    simulate(){
        this.simulationToggle = !this.simulationToggle;   
        for(var i=0;i<this.elements.length;i++){
            if (this.elements[i] instanceof Indicator){
                this.elements[i].currentStatus = false;
            }
        }
        this.draw();
    }

    calcSimulation2(){
        for(var i=0;i<this.elements.length;i++){
            // for a given node, we want to propogate it's current state forward to the input of it's child node
            var parent = this.elements[i];
            parent.simulate();
            // go through each thing the output is pointing to
            if (!(parent instanceof Indicator)){
                for(var j = 0; j < parent.outputs[0].pointer.length; j++){
                    // and get the index of the node & which input it's pointing to
                    var index = parent.outputs[0].pointer[j]
                    // set the status of the input to the child node as the same as the parent's corresponding output 
                    var child = this.elements[index[0]].inputs[index[1]];
                    child.currentStatus = parent.outputs[0].currentStatus;
                }
            }
            
        }
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

    clockUpdate(){
        this.internalClock++;
        if (this.simulationToggle){
            for(var i=0;i<this.elements.length;i++){
                if (this.elements[i] instanceof Clock){           
                    if (this.internalClock % this.elements[i].clockSpeed == 0){
                        this.elements[i].updateState();
                        this.draw();
                    }
                }
            }
            this.calcSimulation2();
            this.draw();
        }
    }

    checkCycles(){
        for(var i=0;i<this.elements.length;i++){
            // need an indicator endpoint to work back from
            if( this.elements[i] instanceof Indicator){
                if (this.traverseNet(i)){
                   return true;
                }
            }
        }
        return false;
    }


    traverseNet(index, listVisited = []){
        let listVis = Object.assign([], listVisited);
        if (listVisited.includes(index)){
            return true;
        }
        listVis.push(index);
        for (var i = 0; i < this.elements[index].inputs.length; i++){
            if (this.traverseNet(this.elements[index].inputs[i].source[0], listVis)){
                return true;
            }
        }
        return false;
    }

    getRowTruthTable(){
        var row = "|";
        var state = false;
        for(var i=0;i<this.elements.length;i++){
            // need an indicator endpoint to work back from
            if( this.elements[i] instanceof Source){
                row = row.concat();

                state = this.elements[i].currentStatus
                if (state == false){
                    row = row.concat("  0");
                }
                else{
                    row = row.concat("  1");
                }
                row = row.concat("  |");
            }
        }
        this.calcSimulation2();
   
        for(var i=0;i<this.elements.length;i++){
            // need an indicator endpoint to work back from
            if( this.elements[i] instanceof Indicator){
                var indicator = this.elements[i];
                // need to ensure it is attached to something
                if (!(indicator.inputs[0].source == null)){
                    // if it is attached to something, we can get it's state from the state of the input source
                    state = this.elements[indicator.inputs[0].source[0]].currentStatus;
                    if (state == false){
                        row = row.concat("  0  ");
                    }
                    else{
                        row = row.concat("  1  ");
                    }
                    
                    row = row.concat("|");
                }          
            }
        }
        return row;
    }

    getTruthTable(){
        var truthTable = "|"
        var header = ""
        var numHeaders = 0;
        // get an array of all of the inputs in the network
        var listOfInputs = []
        for(var i=0;i<this.elements.length;i++){
            if (this.elements[i] instanceof Source){
                listOfInputs.push(this.elements[i]);
                this.elements[i].currentStatus = false;
                header = this.elements[i].nameLabel
                for (var j = 0; j < Math.floor((5 - header.length) / 2); j++){
                    truthTable = truthTable.concat(" ");
                }
                
                if (header.length > 5){
                    header = header.substr(0, 5);
                }
                truthTable = truthTable.concat(header)
                for (var j = 0; j < Math.ceil((5 - header.length) / 2); j++){
                    truthTable = truthTable.concat(" ");
                }
                truthTable = truthTable.concat("|");
                numHeaders++;               
            }

            

        }

        for(var i=0;i<this.elements.length;i++){
            if (this.elements[i] instanceof Indicator){
                header = this.elements[i].nameLabel
                for (var j = 0; j < Math.floor((5 - header.length) / 2); j++){
                    truthTable = truthTable.concat(" ");
                }
                
                if (header > 5){
                    header = header.substr(0, 5);
                }
                truthTable = truthTable.concat(header)
                for (var j = 0; j < Math.ceil((5 - header.length) / 2); j++){
                    truthTable = truthTable.concat(" ");
                }
                truthTable = truthTable.concat("|");
                numHeaders++;         
            }
        }


        truthTable = truthTable.concat("\n|")
        for (var i = 0; i < numHeaders; i++){
            truthTable = truthTable.concat("-----|");
        }
        truthTable = truthTable.concat("\n")

        // get the gray array of length n bits where n is the number of inputs
        var grayArrStr = this.generateGrayArr(listOfInputs.length)
        var grayArrBool = []
        for (var i = 0; i < grayArrStr.length; i++){
            var grayRowBool = []
            for (var j = 0; j < grayArrStr[i].length; j++){       
                if (grayArrStr[i][j] == 0){
                    grayRowBool.push(false);
                }
                else{
                    grayRowBool.push(true);
                }
            }
            grayArrBool.push(grayRowBool)
        }

        for (var i = 0; i < grayArrBool.length; i++){
            for (var j = 0; j < grayArrBool[i].length; j++){
                if (grayArrBool[i][j] != listOfInputs[j].currentStatus){
                    listOfInputs[j].currentStatus = grayArrBool[i][j];
                }
            }
            truthTable = truthTable.concat(this.getRowTruthTable())
            truthTable = truthTable.concat("\n")
        }

        return truthTable.substring(0, truthTable.length - 1);
    }

}