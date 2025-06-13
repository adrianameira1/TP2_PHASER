
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.add.text(300, 250, 'Portal Maze', { fontSize: '32px', fill: '#ffffff' });
        this.add.text(280, 300, 'Press SPACE to Start', { fontSize: '20px', fill: '#ffffff' });

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
    }
}
