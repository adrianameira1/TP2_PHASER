
export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('portal', 'assets/portal.png');
    }

    create() {
        this.scene.start('MenuScene');
    }
}
