import config from "../Config.js";

export default class Card extends PIXI.Container {
    constructor(data) {

        super();

        this.config = config;
        this.font_size = data.font_size;
        this.index = data.index;
        this.stats = data.stats;
        this.cardTexture = data.cardTexture;
        this.card_height = data.card_height;
        this.card_width = data.card_width;
        this.card_x = data.card_x;
        this.card_y = data.card_y;

        this.shoeTexture = data.shoeTexture;
        this.shoe_height = data.shoe_height;
        this.shoe_width = data.shoe_width;
        this.shoe_x = data.shoe_x;
        this.shoe_y = data.shoe_y;

        this.attack_text = data.attack_text;
        this.defense_text = data.defense_text;

        this.gloveTexture = data.gloveTexture;
        this.glove_height = data.glove_height;
        this.glove_width = data.glove_width;
        this.glove_x = data.glove_x;
        this.glove_y = data.glove_y;

        this.border_height = data.border_height;
        this.border_width = data.border_width;
        this.border_x = data.border_x;
        this.border_y = data.border_y;

        this.colors = {
            'FF1D00': "ball_red",     // RED:
            '3052FF': "ball_blue",    // BLUE:
            '2F7F07': "ball_green",   // GREEN:
            'E2D841': "ball_yellow",  // YELLOW:
            'FF9702': "ball_orange",  // ORANGE
            'B200FF': "ball_purple"   // PURPLE:
        }

        this.createCard();
    }

    createCard() {

        // this = new PIXI();
        this.index = this.index;

        //stats            
        this.stats = this.stats;

        //card background
        let cardTexture = PIXI.Texture.fromImage(this.cardTexture);
        this.cardImg = new PIXI.Sprite(cardTexture);
        this.cardImg.x = this.card_x;
        this.cardImg.y = this.card_y;
        this.cardImg.width = this.card_width;
        this.cardImg.height = this.card_height;

        //attack section
        let shoeTexture = PIXI.Texture.fromImage(this.shoeTexture);
        this.shoe = new PIXI.Sprite(shoeTexture);
        this.shoe.x = this.shoe_x;
        this.shoe.y = this.shoe_y;
        this.shoe.width = this.shoe_width;
        this.shoe.height = this.shoe_height;
        this.shoe.tint = '0x' + this.stats.attack_color;

        //defense section
        let gloveTexture = PIXI.Texture.fromImage(this.gloveTexture);
        this.glove = new PIXI.Sprite(gloveTexture);
        this.glove.x = this.glove_x;
        this.glove.y = this.glove_y;
        this.glove.width = this.glove_width;
        this.glove.height = this.glove_height
        this.glove.tint = '0x' + this.stats.defense_color;

        //border
        this.border = new PIXI.Graphics();
        this.border.lineStyle(1, 0xd0c639, 1);
        this.border.drawRect(this.border_x, this.border_y, this.border_width, this.border_height);

        //add children
        this.addChild(this.cardImg);

        this.attackValuesText = new PIXI.Text(this.stats.attack_current + '/' + this.stats.attack_full, {
            fontFamily: this.config.mainFont,
            fontSize: this.font_size,
            fill: '#' + this.stats.attack_color, align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.attackValuesText.position.set(this.attack_text.x, this.attack_text.y);
        this.attackValuesText.anchor.x = 1;

        this.defenseValuesText = new PIXI.Text(this.stats.defense_current + '/' + this.stats.defense_full, {
            fontFamily: this.config.mainFont,
            fontSize: this.font_size,
            fill: '#' + this.stats.defense_color, align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.defenseValuesText.position.set(this.defense_text.x, this.defense_text.y);
        this.defenseValuesText.anchor.x = 1;

        this.attackValuesText.name = "attackValuesText";
        this.defenseValuesText.name = "defenseValuesText";

        this.addChild(this.attackValuesText);
        this.addChild(this.defenseValuesText);

        this.addChild(this.shoe);
        this.addChild(this.glove);
        this.addChild(this.border);
        //        TweenMax.delayedCall(1, () => {
        //            TweenMax.to(this, 0.5, {alpha: 1});
        //        })
        //        console.log(this);
    }

    increasePoints(matches) {

        let defenceColor = this.colors[this.stats.defense_color];
        let attackColor = this.colors[this.stats.attack_color];
        let def_points = matches.filter(e => e.type === defenceColor).length;
        let atk_points = matches.filter(e => e.type === attackColor).length;

        let initialScaleX = this.cardImg.scale.x;
        let initialScaley = this.cardImg.scale.y;

        if (def_points > 0) {
            this.stats.defense_current += def_points;
            this.defenseValuesText.text = `${this.stats.defense_current}/${this.stats.defense_full}`;
            this.cardImg.tint = "0x" + this.stats.defense_color;
            TweenMax.to(this.cardImg, .15, {
                delay: .7,
                onComplete: () => {
                    this.cardImg.tint = 16777215
                }
            });

            TweenMax.to(this.cardImg.scale, .15, {
                x: initialScaleX * 1.05,
                y: initialScaley * 1.05,
                yoyo: true,
                repeat: 1
            })

            //TODO  create separate class for this and add some delay between text tweens
            let def_text = new PIXI.Text("+" + def_points, {
                fontFamily: this.config.mainFont,
                fontSize: this.cardImg.height / 2,
                fill: '#' + this.stats.defense_color,
                align: 'center',
                stroke: '#000000',
                strokeThickness: 3
            });
            def_text.position.set(this.cardImg.x + this.cardImg.width / 2, this.cardImg.y + this.cardImg.height / 2);
            def_text.anchor.x = 0.5;
            def_text.anchor.y = 0.5;

            this.parent.parent.addChild(def_text);// TODO add picture to +3 for example!!!

            TweenMax.to(def_text, 1.5, {
                y: this.parent.parent.height / 2,
                // alpha: 0.75,
                ease: Linear.easeNone,  //TODO... change ease
                onComplete: () => {
                    def_text.alpha = 0;
                    this.parent.parent.removeChild(def_text);
                }
            })
        }

        if (atk_points > 0) {
            this.stats.attack_current += atk_points;
            this.attackValuesText.text = `${this.stats.attack_current}/${this.stats.attack_full}`;
            this.cardImg.tint = "0x" + this.stats.attack_color;
            TweenMax.to(this.cardImg, .15, {
                delay: .7,
                onComplete: () => {
                    this.cardImg.tint = 16777215
                }
            });
            TweenMax.to(this.cardImg.scale, .15, {
                x: initialScaleX * 1.05,
                y: initialScaley * 1.05,
                yoyo: true,
                repeat: 1
            })

            //TODO  create separate class for this and add some delay between text tweens
            let atk_text = new PIXI.Text("+" + atk_points, {
                fontFamily: this.config.mainFont,
                fontSize: this.cardImg.height / 2,
                fill: '#' + this.stats.attack_color,
                align: 'center',
                stroke: '#000000',
                strokeThickness: 3
            });
            atk_text.position.set(this.cardImg.x + this.cardImg.width / 2, this.cardImg.y + this.cardImg.height / 2);
            atk_text.anchor.x = 0.5;
            atk_text.anchor.y = 0.5;

            this.parent.parent.addChild(atk_text);// TODO add picture to +3 for example!!!

            TweenMax.to(atk_text, 1.5, {
                y: this.parent.parent.height / 2,
                // alpha: 0.75,
                ease: Linear.easeNone,  //TODO... change ease
                onComplete: () => {
                    atk_text.alpha = 0;
                    this.parent.parent.removeChild(atk_text);
                }
            })
        }
        // //TODO... => add opponent points same as player in the function above
        // //TODO... => add yellow card, red card ana injury.....
        // //TODO... => check for full attack or defence
        // //TODO... => add sort of animations to show card gained points...
        // //TODO... => check if card wins with two colors
    }
}
