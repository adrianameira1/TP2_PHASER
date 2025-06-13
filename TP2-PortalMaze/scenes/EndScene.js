
export default class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    create() {
        this.add.text(300, 250, 'Parabéns!', { fontSize: '32px', fill: '#ffffff' });
        this.add.text(280, 300, 'Pressione R para Recomeçar', { fontSize: '20px', fill: '#ffffff' });

        this.input.keyboard.once('keydown-R', () => {
            this.scene.start('MenuScene');
        });
    }
}
