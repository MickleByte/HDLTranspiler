import AND from './AndGate.js';
import OR from './OrGate.js';
import XOR from './XorGate.js';
import Line from './line.js';
import Indicator from './indicator.js';
import Source from './source.js';
import Menu from './menu.js'
import Bin from './bin.js'

export default class Canvas{
    constructor(ctx, offsetX, offsetY){
        // initialize variables
        this.simulationToggle = false;
        this.drawCtx = ctx;
        this.elements = [];
        this.menuItems = [];
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.scaleFactor = 50; //this.width / 10; // scales element sizes appropriately to canvas size
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
        
        this.availableInputNames = ["A", "B", "C", "D", "E", "F", "G", "H"]
        this.availableOutputNames = ["Z", "Y", "X", "W"]
        this.availableInputNames.reverse();
        this.availableOutputNames.reverse();

        // creaton of menu
        this.menu = new Menu(this.width, this.height, 0, 0, this.scaleFactor);

        // creation of bin
        this.bin = new Bin(this.width - this.scaleFactor, this.height - this.scaleFactor, this.scaleFactor);
        

        // call draw function
        this.draw();
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
            this.elements[i].draw(this.ctx);
            for (var j = 0; j < this.elements[i].inputs.length; j++){
                if (this.elements[i].inputs[j].source != null){
                    this.drawLineByID([i,j], this.elements[i].inputs[j].source);
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
        this.drawLine(x1, y1, x2, y2);
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
                        this.elements.push(new AND(this.menu.menuItems[i].xPos, this.menu.menuItems[i].yPos, this.scaleFactor));
                        break;
                    case OR:
                        this.elements.push(new OR(this.menu.menuItems[i].xPos, this.menu.menuItems[i].yPos, this.scaleFactor));
                      break;
                    case XOR:
                        this.elements.push(new XOR(this.menu.menuItems[i].xPos, this.menu.menuItems[i].yPos, this.scaleFactor));
                        break;
                    case Indicator:
                        this.elements.push(new Indicator(this.menu.menuItems[i].xPos, this.menu.menuItems[i].yPos, this.scaleFactor, this.availableOutputNames.pop()));
                        break;
                    case Source:
                        this.elements.push(new Source(this.menu.menuItems[i].xPos, this.menu.menuItems[i].yPos, this.scaleFactor, this.availableInputNames.pop()));
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
                if (this.bin.checkClick(this.elements[i].xPos, this.elements[i].yPos)){
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
        for (var i = 0; i < this.elements.length; i++){
            if (this.elements[i] instanceof Source){
                if (this.elements[i].checkClick(mouseX, mouseY)){
                    this.elements[i].updateState();
                }        
            }
        }
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
                // find name of left root
                var assigny = assigny.concat(this.findSource(this.elements[i]));
                HDL = HDL.concat(assigny);
                HDL = HDL.concat(";");
            }
        }

        HDL = HDL.concat("\n\nendmodule");

        console.log(HDL);
        return HDL;
    }

    isOperator(node){
        if (node instanceof AND || node instanceof OR || node instanceof XOR){
            return true;
        }
        else{
            return false;
        }
    }

    createEquation(tree){
        var equation = "";
        if (tree.inputs.length != 0){
            if (this.isOperator(tree)){
                equation = equation.concat("(");
            }
            equation = equation.concat(this.infix(this.elements[tree.inputs[0].source[0]]));
            equation = equation.concat(tree.nameLabel);
            this.infix(this.elements[tree.inputs[1].source[0]]);
            if (this.isOperator(tree)){
                equation = equation.concat(")");
            }
        }
        equation = equation.concat(tree.nameLabel);
        return equation;
    }

    findSource(rootNode){
        var equation = ""
        var prevNode = this.elements[rootNode.inputs[0].source[0]]
        

        if( prevNode instanceof Source){
            equation = equation.concat(prevNode.nameLabel)
        }
        else{
            equation = equation.concat(this.findSource(prevNode));
        }

        // if it is a transformer, we need the operator in the equation
        if(this.isOperator(rootNode)){
            equation = equation.concat(" ", rootNode.operator, " ");
        }
        
        if (rootNode.inputs[1] != undefined){
            var prevNodeRight =  this.elements[rootNode.inputs[1].source[0]]
            if( prevNodeRight instanceof Source){
                equation = equation.concat(prevNodeRight.nameLabel)
            }
            else{
                equation = equation.concat(this.findSource(prevNodeRight));
            }
        }

        
        return equation;
    }


    translateHDL(moduleName = "halfAdder"){

        this.translate2HDL();


        // var HDL = ""; // stores the HDL output

        // HDL = HDL.concat("module ");
        // HDL = HDL.concat(moduleName);
        // HDL = HDL.concat(" (");
        // for(var i=0;i<this.elements.length;i++){
        //     if (this.elements[i] instanceof Source){
        //         HDL = HDL.concat("input ")
        //         HDL = HDL.concat(inputNames[i]);
        //         HDL = HDL.concat(", ");
        //     } 
        //     else if( this.elements[i] instanceof Indicator){
        //         HDL = HDL.concat("output ")
        //         HDL = HDL.concat(inputNames[i]);
        //         HDL = HDL.concat(", ");
        //     }
        // }
        // HDL = HDL.substring(0, HDL.length - 2); // remove last 2 chars from HDL string
        // HDL = HDL.concat(");\n");

        // HDL = HDL.concat("assign ");

        // // operations     
        // for(var i=0;i<this.elements.length;i++){
        //     if( this.elements[i] instanceof Indicator){
        //         HDL = HDL.concat(inputNames[i]);
        //         HDL = HDL.concat(" = ");
        //     }
        //     else if (!(this.elements[i] instanceof Source || this.elements[i] instanceof Indicator)){
        //         HDL = HDL.concat(this.elements[i].operator);
        //         HDL = HDL.concat(" (");
        //         HDL = HDL.concat("unkown, ");
        //         for (var j=0; j < this.elements[i].inputs.length; j++){
        //             HDL = HDL.concat(inputNames[this.elements[i].inputs[j].source[0]]);
        //             HDL = HDL.concat(", ");
        //         }
        //         HDL = HDL.substring(0, HDL.length - 2); // remove last 2 chars from HDL string
        //         HDL = HDL.concat(");\n");
        //     }       
        // }
        
        // HDL = HDL.concat("endmodule");

        // console.log(HDL);
    }

    simulate(){
        this.simulationToggle = !this.simulationToggle;
        if (this.simulationToggle){
            for (var i = 0; i < this.elements.length; i++){
                this.elements[i].simulate();
            }
        }
    }

}