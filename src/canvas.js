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
        if (this.elements.length != 0){
            var confirmation = confirm("Are you sure? This will delete your diagram");
            if (confirmation){
                this.elements = [];
                this.lines = [];
                if (this.simulationToggle){
                    document.getElementById("simulateToggle").click()
                }
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
            this.calcSimulation(); 
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
                    // traverse the elements array looking for any inputs that point to the deleted transformer
                    for (var j = 0; j < this.elements.length; j++){
                        for (var k = 0; k < this.elements[j].inputs.length; k++){
                            if (!(this.elements[j].inputs[k].source == null)){
                                if (this.elements[j].inputs[k].source[0] == i){
                                    this.elements[j].inputs[k].source = null
                                }
                                else if(this.elements[j].inputs[k].source[0] > i){
                                    this.elements[j].inputs[k].source[0]--;
                                }
                            }
                        }                                     
                    }
                    this.elements.splice(i, 1); // remove the element from the array
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
        for (var i = 0; i < this.elements.length; i++){
            if (this.elements[i] instanceof Clock){
                if (this.elements[i].checkClick(mouseX, mouseY)){
                    var txt;
                    var txt1 = prompt("Set clock speed (ms):", this.elements[i].clockSpeed);
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
        else if(operator == "~||"){
            if (LHS || RHS){
                return false;
            }
            return true;
        }
        else if(operator == "~^"){
            if (LHS && RHS || !LHS && !RHS){
                return true;
            }
            return false;
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
                if (!(rootNode.inputs[0].source == null)){
                    var LHS = this.getState(this.elements[rootNode.inputs[0].source[0]]);
                    signal = this.performCheck(LHS, rootNode.nameLabel);
                }else{
                    signal = null;
                }
            }
            else{
                if (!(rootNode.inputs[0].source == null || rootNode.inputs[1].source == null)){
                    var LHS = this.getState(this.elements[rootNode.inputs[0].source[0]]);
                    var RHS = this.getState(this.elements[rootNode.inputs[1].source[0]]);
                    signal = this.performCheck(LHS, rootNode.nameLabel, RHS);
                }else{
                    signal = null;
                }       
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
                    indicator.colour = "red"; // need to set it at zero before we work out whether it is true or false
                    // need to ensure it is attached to something
                    if (!(indicator.inputs[0].source == null)){
                        // if it is attached to something, we can get it's state from the state of the input source
                        indicator.simulate(this.getState(this.elements[indicator.inputs[0].source[0]]));
                    }          
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

    clockUpdate(){
        this.internalClock++;
        if (this.simulationToggle){
            for(var i=0;i<this.elements.length;i++){
                if (this.elements[i] instanceof Clock){           
                    if (this.internalClock % this.elements[i].clockSpeed == 0){
                        this.elements[i].updateState();
                        this.calcSimulation();
                        this.draw();
                    }
                }
            }
        }
    }

}