export default class Background extends PIXI.Container{

    constructor(app, data) {
        super();
        this.bgData = data
        this.stage = app.stage;
        this.createBG();
    }

    createBG() {
        this.stage.gamePhase = this.bgData.gamePhase;
        let background = PIXI.Texture.fromImage(this.bgData.bgTexture);
        let bg = new PIXI.Sprite(background);
        bg.position.x = this.bgData.bg_x;
        bg.position.y = this.bgData.bg_y;
        bg.width = this.bgData.bg_width;
        bg.height = this.bgData.bg_height;
        this.visible = true;
        this.addChild(bg);
    }
}