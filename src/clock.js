import Source from './source.js';

export default class Clock extends Source{
    constructor(x, y, width, nameLabel = ""){
        super(x, y, width, nameLabel);
        this.clockSpeed = 1000;
    }

    setClockSpeed(){
        var txt;
        var txt1 = prompt("Set clock speed:", this.clockSpeed);
        if (txt1 == null || txt1 == "") {
            txt = this.clockSpeed;
        } else {
            txt = txt1;
        }
        this.clockSpeed = txt;
    }
}