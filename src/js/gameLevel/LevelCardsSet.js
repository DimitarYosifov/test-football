import Card from "./Card.js";
import LineUps from "../LineUps.js";

export default class LevelCardsSet extends PIXI.Container {

    constructor(dataRecieved, width, height, targetDeck) {
        super();
        this.targetDeck = targetDeck;
        this.stageWidth = width;
        this.stageHeight = height;
        this.dataRecieved = dataRecieved;
        this.lineUps = new LineUps("testClub1", "testClub2", this.onPlayerCardsData);
        this.interactive = false;
    }

    createPlayerDeck() {
        for (let i = 0; i < 6; i++) {
            let card = new Card({
                index: i,
                stats: this.lineUps.player[i],
                font_size: this.stageHeight / 45 + 'px',  //change this shit!!

                cardTexture: `images/players/player_id_${this.lineUps.player[i].player_img_id}.png`,
                card_x: (this.stageWidth / 6) * i,
                card_y: this.stageHeight * 0.88,
                card_width: this.stageWidth / 6,
                card_height: this.stageHeight * 0.12,

                shoeTexture: `images/shoe.png`,
                shoe_x: (this.stageWidth / 5.95) * i,
                shoe_y: this.stageHeight * 0.882,
                shoe_width: this.stageWidth / 21,
                shoe_height: this.stageWidth / 21,

                attack_text: {
                    x: (this.stageWidth / 6) * i + this.stageWidth / 6,
                    y: this.stageHeight * 0.88
                },

                gloveTexture: `images/glove2.png`,
                glove_x: (this.stageWidth / 5.95) * i,
                glove_y: this.stageHeight * 0.968,
                glove_width: this.stageWidth / 21,
                glove_height: this.stageWidth / 21,

                defense_text: {
                    x: (this.stageWidth / 6) * i + this.stageWidth / 6,
                    y: this.stageHeight * 0.97
                },

                border_x: (this.stageWidth / 6) * i,
                border_y: this.stageHeight * 0.879,
                border_width: this.stageWidth / 6,
                border_height: this.stageHeight * 0.12
            })
            this.addChild(card);
        }
    }

    createOpponentDeck() {
        for (let i = 0; i < 6; i++) {

            let card = new Card({
                index: i,
                stats: this.lineUps.opponent[i],
                font_size: this.stageHeight / 45 + 'px',  //idiotic!!!! TODO...

                cardTexture: `images/players/player_id_${this.lineUps.opponent[i].opponent_img_id}.png`,
                card_x: (this.stageWidth / 6) * i,
                card_y: 0,
                card_width: this.stageWidth / 6,
                card_height: this.stageHeight * 0.12,

                shoeTexture: `images/shoe.png`,
                shoe_x: (this.stageWidth / 5.95) * i,
                shoe_y: this.stageHeight * 0.005,
                shoe_width: this.stageWidth / 21,
                shoe_height: this.stageWidth / 21,

                attack_text: {
                    x: (this.stageWidth / 6) * i + this.stageWidth / 6,
                    y: this.stageHeight * 0.002
                },

                gloveTexture: `images/glove2.png`,
                glove_x: (this.stageWidth / 5.95) * i,
                glove_y: this.stageHeight * 0.09,
                glove_width: this.stageWidth / 21,
                glove_height: this.stageWidth / 21,

                defense_text: {
                    x: (this.stageWidth / 6) * i + this.stageWidth / 6,
                    y: this.stageHeight * 0.092
                },

                border_x: (this.stageWidth / 6) * i,
                border_y: this.stageHeight * 0,
                border_width: this.stageWidth / 6,
                border_height: this.stageHeight * 0.122
            })
            this.addChild(card);
        }
    }

    onPlayerCardsData() {
        if (!this.lineUps.player || !this.lineUps.opponent) {
            return;
        }

        this.targetDeck === "player" ? this.createPlayerDeck() : this.createOpponentDeck();

        this.dataRecieved();
    }
}
