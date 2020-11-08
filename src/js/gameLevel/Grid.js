import Config from "../Config.js";
import Block from "./Block.js";
import Row from "./Row.js";

export default class Grid extends PIXI.Container {
    constructor(app) {
        super();
        this.app = app;
        this.level = app.level;
        this.config = Config;
        this.moveCoordinates = { startX: 0, startY: 0, lastX: 0, lastY: 0 }
        this.interactive = true;
        this.gridArrays = [];
        this.globalBlocksPositions = [[], [], [], [], [], [], [], []];
        this.blocks = [[], [], [], [], [], [], [], []];

        // this.createGrid();
    }

    createGrid() {
        for (let row = 0; row < 8; row++) {
            let rowContainer = new Row(this.app, row, this);
            this.addChild(rowContainer);
            this.gridArrays.push(rowContainer.children.map(c => c.type));
        }
    }

    swapBlocks(block1_x, block1_y, dir) {
        this.dragging = false;
        this.swapDirection = dir;
        this.blockBeingSwappedWith = null;
        let item1 = this.children[block1_y].children[block1_x];
        let itemOneOldImg = item1.img;
        let itemTwoOldImg = null;;
        this.selectedBlock = { row: block1_y, col: block1_x, type: item1.type, oldX: item1.blockImg.x, oldY: item1.blockImg.y };
        let item2;
        switch (dir) {
            case "down":
                item2 = this.children[block1_y + 1].children[block1_x];
                this.blockBeingSwappedWith = { row: block1_y + 1, col: block1_x, type: item2.type, oldX: item2.blockImg.x, oldY: item2.blockImg.y };
                break;
            case "up":
                item2 = this.children[block1_y - 1].children[block1_x];
                this.blockBeingSwappedWith = { row: block1_y - 1, col: block1_x, type: item2.type, oldX: item2.blockImg.x, oldY: item2.blockImg.y };
                break;
            case "left":
                item2 = this.children[block1_y].children[block1_x - 1];
                this.blockBeingSwappedWith = { row: block1_y, col: block1_x - 1, type: item2.type, oldX: item2.blockImg.x, oldY: item2.blockImg.y };
                break;
            case "right":
                item2 = this.children[block1_y].children[block1_x + 1];
                this.blockBeingSwappedWith = { row: block1_y, col: block1_x + 1, type: item2.type, oldX: item2.blockImg.x, oldY: item2.blockImg.y };
            default:
                break;
        }

        itemTwoOldImg = item2.img;

        TweenMax.to(item1.children[0], 0.2, {
            y: item2.children[0].y,
            x: item2.children[0].x,
            ease: Linear.easeNone,
            onComplete: () => {

            }
        });
        //        TweenMax.to(item1.scale, 0.2, {x: 1.01, y: 1.01, repeat: 1, yoyo: true});    //works

        TweenMax.to(item2.children[0], 0.2, {
            y: item1.children[0].y,
            x: item1.children[0].x,
            ease: Linear.easeNone,
            onComplete: () => {
                let type1 = item1.type;
                let gridPosition1 = item1.gridPosition;
                item1.type = item2.type;
                item1.gridPosition = item2.gridPosition;
                item2.type = type1;
                item2.gridPosition = gridPosition1;
                //              START OF PROTON EFFECT AFTER MATCH
                let matches = this.checkGridForMatches();

                if (matches.length !== 0) {
                    for (let m = 0; m < matches.length; m++) {
                        if (matches[m].row === item2.row && matches[m].col === item2.col) {
                            matches[m].beingSwapped = true;
                            this.matchingSwappedItem = 1;
                        } else if (((matches[m].row === item1.row) && (matches[m].col === item1.col))) {
                            matches[m].beingSwapped = true;
                            this.matchingSwappedItem = 2;
                        }
                        else {
                            matches[m].dir = this.swapDirection;
                        }
                    }

                    this.gridArrays[this.selectedBlock.row][this.selectedBlock.col] = itemTwoOldImg;
                    this.gridArrays[this.blockBeingSwappedWith.row][this.blockBeingSwappedWith.col] = itemOneOldImg;

                    let item_2_Old_X = this.globalBlocksPositions[this.selectedBlock.row][this.selectedBlock.col].x;
                    let item_2_Old_Y = this.globalBlocksPositions[this.selectedBlock.row][this.selectedBlock.col].y;
                    let item_2_OldType = this.children[this.selectedBlock.row].children[this.selectedBlock.col].type;

                    item2.children[0].x = this.globalBlocksPositions[this.blockBeingSwappedWith.row][this.blockBeingSwappedWith.col].x;
                    item2.children[0].y = this.globalBlocksPositions[this.blockBeingSwappedWith.row][this.blockBeingSwappedWith.col].y;
                    item2.type = this.children[this.blockBeingSwappedWith.row].children[this.blockBeingSwappedWith.col].type;
                    item2.children[0].texture = PIXI.Texture.fromImage(`images/${item2.type}.png`);

                    item1.children[0].x = item_2_Old_X;
                    item1.children[0].y = item_2_Old_Y;
                    item1.type = item_2_OldType;
                    item1.children[0].texture = PIXI.Texture.fromImage(`images/${item1.type}.png`);

                    this.gatherMatchingBlocks(matches);
                    TweenMax.delayedCall(0, () => {
                        this.increaseCardsPointsAfterMatch(matches);
                    })
                }
                else {
                    TweenMax.to(item1.children[0], 0.2, {
                        y: this.selectedBlock.oldY,
                        x: this.selectedBlock.oldX,
                        ease: Linear.easeNone,
                        onComplete: () => {
                            this.animationInProgress = false;
                        }
                    });
                    TweenMax.to(item2.children[0], 0.2, {
                        y: this.blockBeingSwappedWith.oldY,
                        x: this.blockBeingSwappedWith.oldX,
                        ease: Linear.easeNone,
                        onComplete: () => {
                            this.animationInProgress = false;
                        }
                    });
                }
            }
        });
    }

    checkGridForMatches() {
        let matches = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 6; col++) {
                let match = {
                    row: row,
                    col: col,
                    type: this.children[row].children[col].type
                };

                //              check right
                let thisBlock = this.children[row].children[col].type;
                let nextBlock_right1 = this.children[row].children[col + 1] ? this.children[row].children[col + 1].type : null;
                let nextBlock_right2 = this.children[row].children[col + 2] ? this.children[row].children[col + 2].type : null;
                let prevBlock_left1 = this.children[row].children[col - 1] ? this.children[row].children[col - 1].type : null;
                let prevBlock_left2 = this.children[row].children[col - 2] ? this.children[row].children[col - 2].type : null;

                if ((thisBlock === nextBlock_right1 && thisBlock === nextBlock_right2) ||
                    (thisBlock === prevBlock_left1 && thisBlock === prevBlock_left2) ||
                    (thisBlock === nextBlock_right1 && thisBlock === prevBlock_left1)
                ) {
                    matches.push(match);
                    continue; // already match, no need to check downwards    ?????????????????????
                }

                //              check down
                let nextBlock_down1 = null;
                if (this.children[row + 1]) {
                    nextBlock_down1 = this.children[row + 1].children[col] ? this.children[row + 1].children[col].type : null;
                }

                let nextBlock_down2 = null;
                if (this.children[row + 2]) {
                    nextBlock_down2 = this.children[row + 2].children[col] ? this.children[row + 2].children[col].type : null;
                }

                let prevBlock_Up1 = null;
                if (this.children[row - 1]) {
                    prevBlock_Up1 = this.children[row - 1].children[col] ? this.children[row - 1].children[col].type : null;
                }
                let prevBlock_Up2 = null;
                if (this.children[row - 2]) {
                    prevBlock_Up2 = this.children[row - 2].children[col] ? this.children[row - 2].children[col].type : null;
                }

                if ((thisBlock === prevBlock_Up1 && thisBlock === prevBlock_Up2) ||
                    (thisBlock === nextBlock_down1 && thisBlock === nextBlock_down2) ||
                    (thisBlock === nextBlock_down1 && thisBlock === prevBlock_Up1)
                ) {
                    matches.push(match);
                }
                // match.matchIndex = matchIndex;
            }
        }
        return matches;
    }

    //animate matching blocks to currently moved block position
    gatherMatchingBlocks(matches) {
        this.nullifyMatchesInGridArray(matches);

        let beingSwapped = matches.filter(e => e.beingSwapped);


        if (beingSwapped.length === 0) {
            /* in this case this is automatch and we need to set target
                blocks for each match so that the rest of certain color can 
                go to target block position
            */

            // array of all matches types... for example ["ball_red", "ball_green"] etc.
            const arrTypes = [...new Set(matches.map(m => m.type))];

            for (let type of arrTypes) {
                let typeItems = matches.filter(m => m.type === type);
                let centralItem = Math.floor(typeItems.length / 2);
                console.log(centralItem)
                matches[centralItem].beingSwapped = true;   //?? might cause problems!!!!
                beingSwapped.push(matches[centralItem]);
            }
        }

        for (let m = 0; m < beingSwapped.length; m++) {

            let thisColorMatches = matches.filter(e => e.type === beingSwapped[m].type);

            for (let e = 0; e < thisColorMatches.length; e++) {
                let targetBlock = thisColorMatches.filter(x => x.beingSwapped)[0];
                let tweenTarget = this.children[thisColorMatches[e].row].children[thisColorMatches[e].col];

                if (!thisColorMatches[e].beingSwapped) {
                    let newX = this.globalBlocksPositions[targetBlock.row][targetBlock.col].x;
                    let newY = this.globalBlocksPositions[targetBlock.row][targetBlock.col].y;
                    TweenMax.to(tweenTarget.blockImg, .2, {
                        x: newX,
                        y: newY,
                        alpha: 0,
                        ease: Linear.easeNone,
                        onComplete: () => {
                            // TweenMax.killAll();
                            // this.increaseCardsPointsAfterMatch(matches);
                        }
                    });
                }
                else {
                    TweenMax.to(tweenTarget.blockImg, .2, {
                        alpha: 0,
                        delay: .2,
                        onComplete: () => {
                            // TweenMax.killAll();
                            // this.increaseCardsPointsAfterMatch(matches);
                        }
                    });
                }
            }
        }
    }

    nullifyMatchesInGridArray(matches) {
        for (const item of matches) {
            this.gridArrays[item.row][item.col] = null;
        }
    }

    increaseCardsPointsAfterMatch(matches) {
        if (this.parent.playerTurn) {
            for (let cardIdx = 0; cardIdx < this.parent.playerCards.children.length; cardIdx++) {
                let card = this.parent.playerCards.children[cardIdx];
                setTimeout(() => {
                    card.increasePoints(matches);
                }, 75 * cardIdx);
            }
            TweenMax.delayedCall(0.75, () => {
                this.tweenDownMatchingBlocks(matches);
            })
        }
        else {
            // TODO... same for opponent
        }
    }

    // check for automatic matches on the grid after manual match
    checkAutomaticMatch() {
        TweenMax.delayedCall(0.5, () => {
            let matches = this.checkGridForMatches();
            console.log(matches);
            if (matches.length > 0) {
                this.gatherMatchingBlocks(matches);
                TweenMax.delayedCall(0, () => {
                    this.increaseCardsPointsAfterMatch(matches);
                })
            } else {
                // TweenMax.delayedCall(1, () => {
                this.animationInProgress = false;
                // })
            }
        })
    }

    tweenDownMatchingBlocks(matches) {

        // make remaining blocks fall first!
        this.holesInColumns = [
            { holes: 0, onRow: [] },
            { holes: 0, onRow: [] },
            { holes: 0, onRow: [] },
            { holes: 0, onRow: [] },
            { holes: 0, onRow: [] },
            { holes: 0, onRow: [] }
        ];

        /*
            loop thru grid array to find number
            of holes and their row positions
        */
        this.gridArrays.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (this.gridArrays[rowIndex][colIndex] === null) {
                    this.holesInColumns[colIndex].holes++;
                    this.holesInColumns[colIndex].onRow.push(rowIndex);
                }
            });
        });

        /*
            loop thru blocks to determine
            how many rows each block should fall
        */
        this.blocks.forEach((row, rowIndex) => {

            row.forEach((el, colIndex) => {
                this.blocks[rowIndex][colIndex].shouldFall = 0;
                if (this.gridArrays[rowIndex][colIndex] !== null) {
                    this.blocks[rowIndex][colIndex].shouldFall = this.holesInColumns[colIndex].onRow.filter(h => h >= el.row).length;
                }
                let shouldFall = this.blocks[rowIndex][colIndex].shouldFall;
                if (shouldFall > 0) {

                    // this is temp lame solution for single vertical match bug... TODO... fix it!!!
                    //this will definitely brak when matching automaticaly
                    //another solution required here!!!!!!!!!!!!!!!!!!!!!!!!
                    // let singlevVerticalMatch = matches.filter(m => m.beingSwapped).length === 1 &&
                    //     (this.swapDirection === "down" || this.swapDirection === "up" &&
                    //         (matches.filter(m => m.beingSwapped)[0].row === rowIndex &&
                    //             matches.filter(m => m.beingSwapped)[0].col === colIndex)
                    //     ) ? -1 : 0;


                    let newY = this.globalBlocksPositions[rowIndex + shouldFall][colIndex].y;
                    let tweenTarget = this.blocks[rowIndex][colIndex].blockImg;

                    // this.gridArrays[rowIndex + shouldFall][colIndex] = tweenTarget.parent.img;
                    TweenMax.to(tweenTarget, .3 * shouldFall, {
                        y: newY,
                        // delay: fallDelay,
                        onComplete: () => {
                            // TweenMax.killAll();
                            this.gridArrays[rowIndex + shouldFall][colIndex] = tweenTarget.parent.type;
                        }
                    });
                }
            });
        });
        this.createNewBlocks();
    }

    createNewBlocks() {
        let blockHeight = this.globalBlocksPositions[1][0].y - this.globalBlocksPositions[0][0].y;
        let gridY = this.globalBlocksPositions[0][0].y;
        this.holesInColumns.forEach((el, colIndex) => {
            if (el.holes > 0) {
                for (let hole = 0; hole < el.holes; hole++) {
                    let row = el.onRow[hole];
                    let block = this.blocks[row][colIndex].blockImg;

                    let img = block.parent.generateRandomColorBlock();
                    // let img = "ball_green";    //for test only

                    block.texture = PIXI.Texture.fromImage(`images/${img}.png`);
                    let startY = this.globalBlocksPositions[el.holes - hole - 1][colIndex].y;
                    block.y = gridY - (blockHeight * (hole + 1));
                    block.x = this.globalBlocksPositions[row][colIndex].x;
                    block.alpha = 1;
                    TweenMax.to(block, .31 * el.holes, {
                        y: startY,
                        onComplete: () => {
                            // TweenMax.killAll();
                            this.gridArrays[el.holes - hole - 1][colIndex] = block.parent.img = img;
                            // console.table(this.gridArrays);
                            // console.log(this.blocks);
                        }
                    });
                }
            }
        });
        TweenMax.delayedCall(Math.max(...this.holesInColumns.map(h => h.holes)) * .33, () => {
            this.setAccurateBlocksPositions();
        })
        // this.checkAutomaticMatch();
    }

    setAccurateBlocksPositions() {
        this.gridArrays.forEach((row, rowIndex) => {
            row.forEach((el, colIndex) => {
                let img = this.gridArrays[rowIndex][colIndex];
                let type = img;
                let texture = PIXI.Texture.fromImage(`images/${img}.png`);
                let x = this.globalBlocksPositions[rowIndex][colIndex].x;
                let y = this.globalBlocksPositions[rowIndex][colIndex].y;

                this.blocks[rowIndex][colIndex].img = img;
                this.blocks[rowIndex][colIndex].type = type;
                this.blocks[rowIndex][colIndex].blockImg.texture = texture;
                this.blocks[rowIndex][colIndex].blockImg.x = x;
                this.blocks[rowIndex][colIndex].blockImg.y = y;
            })
        })

        console.table(this.gridArrays);
        console.log(this.blocks);

        this.checkAutomaticMatch();
    }

    onDragStart(e) {
        this.moveCoordinates.startX = e.data.global.x;
        this.moveCoordinates.startY = e.data.global.y;
        this.moveCoordinates.lastX = e.data.global.x;
        this.moveCoordinates.lastY = e.data.global.y;

        this.gridPosition_x = e.gridPosition_x;
        this.gridPosition_y = e.gridPosition_y;
        this.data = e.data;
        this.dragging = true;
    }

    onDragMove(e) {
        if (this.dragging && !this.animationInProgress) {
            /*   
             gets block height and divides it by 3,
             the least drag/swipe distance
             to start blocks swap.
             ...needs better solution here!!!
             */

            this.moveCoordinates.lastX = e.data.global.x;
            this.moveCoordinates.lastY = e.data.global.y;

            let dist = this.blocks[0][0].height / 3;

            let directions = {
                left: this.moveCoordinates.startX - this.moveCoordinates.lastX,
                right: this.moveCoordinates.lastX - this.moveCoordinates.startX,
                up: this.moveCoordinates.startY - this.moveCoordinates.lastY,
                down: this.moveCoordinates.lastY - this.moveCoordinates.startY
            };

            let arr = Object.values(directions);
            let max = Math.max(...arr);

            let dir = Object.keys(directions).find(key => directions[key] === max);
            if (
                (this.moveCoordinates.startY === this.moveCoordinates.lastY && this.moveCoordinates.startX === this.moveCoordinates.lastX) ||
                (dir === "down" && this.gridPosition_y === 7) ||
                (dir === "up" && this.gridPosition_y === 0) ||
                (dir === "right" && this.gridPosition_x === 5) ||
                (dir === "left" && this.gridPosition_x === 0) ||
                max < dist) {
                return;
            }

            this.animationInProgress = true;
            this.swapBlocks(this.gridPosition_x, this.gridPosition_y, dir);
        }
    }

    onDragEnd(e) {
        this.dragging = false;
    }

}
