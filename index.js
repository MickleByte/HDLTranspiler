import Canvas from './src/canvas.js';

var canvElem = document.getElementById("canvas");
var simBtn = document.getElementById("simulateToggle");
var transBtn = document.getElementById("translateBtn");
var testBenchBtn = document.getElementById("testBenchBtn");
var helpBtn  = document.getElementById("helpBtn")
var truthTblBtn = document.getElementById("genTruthTblBtn");
var save2Pallet = document.getElementById("addToPalletBtn");
var deleteLine = document.getElementById("deleteLine");
var clearCanvBtn = document.getElementById("clearBtn");
var offsetX = canvElem.getBoundingClientRect().left;
var offsetY = canvElem.getBoundingClientRect().top;
var ctx = canvElem.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight - (window.innerHeight * 0.1);


var myCanv = new Canvas(ctx, offsetX, offsetY);

// this function gets called every milisecond and advances the canvas' internal clock
setInterval(function(){
    myCanv.clockUpdate()
}, 1);

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function getModuleName(){
    var moduleName = document.getElementById("moduleNameField").value;
    if (moduleName == ""){
        moduleName = "myModule"
    }
    return moduleName
}

window.onload = function(){     
    // listen for mouse events
    canvElem.onmousedown = function(e){
        myCanv.mouseDown(e.clientX, e.clientY)
    };
    canvElem.onmousemove = function(e){
        myCanv.mouseMove(e.clientX, e.clientY)
    };
    canvElem.onmouseup = function(e){
        myCanv.mouseUp(e.clientX, e.clientY)
    };
    canvElem.ondblclick = function(e){
        myCanv.dblClick(e.clientX, e.clientY)
    };
    clearCanvBtn.onclick = function(){
        myCanv.Erase();
    };
    deleteLine.onclick = function(){
        if (canvElem.style.cursor != "crosshair"){
            canvElem.style.cursor = "crosshair";
            deleteLine.style.backgroundColor = "grey";
        }
        else{
            canvElem.style.cursor = "auto";
            deleteLine.style.backgroundColor = "buttonface";
        }
        myCanv.deleteLineBtn();
    }
    simBtn.onclick = function(){
        if (simBtn.innerHTML == "Stop Simulation"){
            simBtn.innerHTML = "Start Simulation"
        }
        else{
            simBtn.innerHTML = "Stop Simulation"
        }
        myCanv.simulate()
    };
    transBtn.onclick = function(){
        var moduleName = getModuleName();

        if (myCanv.checkCycles()){
            alert(moduleName + " is a sequential circuit and so cannot be automaticaly converted to Verilog")
        }
        else{
            var HDL = myCanv.translate2HDL(moduleName);
            download(moduleName + ".v", HDL);
        }
    };

    testBenchBtn.onclick = function(){

        var moduleName = getModuleName()
        var testBench = myCanv.generateTestBench(moduleName);
        download(moduleName.concat("TestBench") + ".v", testBench);
        var command = "To test your code open cmd and navigate to the download location, then run: iverilog -o \"", 
        command = command.concat(moduleName);
        command = command.concat(".vvp\" ");
        command = command.concat("\"");
        command = command.concat(moduleName);
        command = command.concat(".v\" ");
        command = command.concat("\"");
        command = command.concat(moduleName.concat("TestBench"));
        command = command.concat(".v\" ");
        command = command.concat("&& vvp \"");
        command = command.concat(moduleName);
        command = command.concat(".vvp\"");
        alert(command);
    };

    truthTblBtn.onclick = function(){
        var newWindow = window.open();
        if (simBtn.innerHTML == "Stop Simulation"){
            simBtn.click();
        }
        var truthTable = myCanv.getTruthTable();
        var newWindowContent = "<title>";
        newWindowContent += getModuleName();

        

        newWindowContent = newWindowContent.concat(" Truth Table</title><style>table, td, th {border: 1px solid black;}th, td { text-align: center;} table{width:50%; margin-left:auto; margin-right:auto;}</style>");
        console.log(truthTable);
        newWindowContent = newWindowContent.concat(truthTable);
        newWindow.document.write(newWindowContent);
    };

    save2Pallet.onclick = function(){
        myCanv.save2Pallet();
    }

    helpBtn.onclick = function(){
        var helpMessage = "Drag components from the menu onto the canvas\n\nDouble clicking inputs in draw mode allows you to rename them or alter their clock speed\n\nClicking an input in simulation mode lets you flip it's state\n\nIn simulation mode Red nodes are false and green nodes are true";
        alert(helpMessage);
    }
}

export { myCanv };