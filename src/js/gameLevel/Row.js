import Config from "../Config.js";
import Block from "./Block.js";

export default class Row extends PIXI.Container {
    constructor(app, row, grid) {
        super();
        this.config = Config;
        this.app = app;
        this.rowId = row;
        this.grid = grid;
        this.create();
    }

    create() {
        for (let col = 0; col < 6; col++) {
            let block = new Block(this.rowId, col, this, this.grid, this.app);
            this.addChild(block);
            this.grid.blocks[this.rowId].push(block);
        }
    }
}
