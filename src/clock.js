import Source from './source.js';

export default class Clock extends Source{
    constructor(x, y, width, nameLabel = ""){
        super(x, y, width, nameLabel);
        this.clockSpeed = 1000;
    }
}