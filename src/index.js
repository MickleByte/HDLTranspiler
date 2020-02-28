import Canvas from './canvas.js';

var canvElem = document.getElementById("canvas");
// var simBtn = document.getElementById("simulateToggle");
var transBtn = document.getElementById("translateBtn");
var offsetX = canvElem.getBoundingClientRect().left;
var offsetY = canvElem.getBoundingClientRect().top;
var ctx = canvElem.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight - 100;




let myCanv = new Canvas(ctx, offsetX, offsetY);

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
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
    // simBtn.onclick = function(){
    //     if (simBtn.innerHTML == "Stop Simulation"){
    //         simBtn.innerHTML = "Start Simulation"
    //     }
    //     else{
    //         simBtn.innerHTML = "Stop Simulation"
    //     }
    //     myCanv.simulate()
    // };
    transBtn.onclick = function(){
        var moduleName = document.getElementById("moduleNameField").value;
        if (moduleName == ""){
            moduleName = "myModule"
        }
        var HDL = myCanv.translate2HDL(moduleName);
        
        download(moduleName + ".v", HDL);
        
    }
}

