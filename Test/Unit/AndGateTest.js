import AND from '../../src/AndGate.js'

export default class AndGateTest{
    constructor(){
        this.testObject = new AND(100, 100, 50);
    }
    runTests(){
        var errors = [];
        var errorCount = 0;
        var testCount = 0;
    
        // tests
        testCount++;
        if (this.testObject.nameLabel != "&&"){
            errors.push(testCount + ": Incorrect name label, should be &&")
            errorCount++;
        }
        
       
        // output of tests
        if (errorCount != 0){
            console.log(errorCount + "/" + testCount + " Tests failed in AND GATE unit tests:")
            errors.forEach(element => console.log("\t" + element));
            console.log("\n");
        }
        else{
            console.log(testCount + "/" + testCount + " AND GATE unit tests ran without error")
        }
    
        return errorCount;
    }
}