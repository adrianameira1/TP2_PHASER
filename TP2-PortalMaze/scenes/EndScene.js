export default class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    preload() {
        this.load.audio('victorySong', 'assets/audio/Victory.mp3');
    }

    create() {
        // Para música da fase
        const musica = this.sound.get('musicaFundo');
        if (musica) {
            musica.stop();
        }

        // Toca música de vitória
        if (!this.sound.get('victorySong')) {
            this.sound.add('victorySong', { loop: true, volume: 0.6 }).play();
        }

        this.add.text(300, 250, 'Parabéns!', { fontSize: '32px', fill: '#ffffff' });
        this.add.text(280, 300, 'Pressione R para Recomeçar', { fontSize: '20px', fill: '#ffffff' });

        this.input.keyboard.once('keydown-R', () => {
            const victory = this.sound.get('victorySong');
            if (victory) {
                victory.stop();
            }

            this.scene.start('MenuScene');
        });
    }
}
