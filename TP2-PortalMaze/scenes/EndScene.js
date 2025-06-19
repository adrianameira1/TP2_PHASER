export default class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    preload() {
        this.load.image('victory_bg', 'assets/images/menu_bg.png');
        this.load.image('ok_button', 'assets/buttons/ok_button.png');
        this.load.image('victory_title', 'assets/images/victory_title.png');
        this.load.audio('victorySong', 'assets/audio/Victory.mp3');
    }

    create() {

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Para música da fase
        const musica = this.sound.get('musicaFundo');
        if (musica) {
            musica.stop();
        }

        // Toca música de vitória
        if (!this.sound.get('victorySong')) {
            this.sound.add('victorySong', { loop: true, volume: 0.6 }).play();
        }

        // Fundo do menu
        this.add.image(centerX, centerY, 'victory_bg')
        .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
        .setOrigin(0.5);

        // Imagem central de "Victory" com margem maior
        this.add.image(centerX, centerY - 150, 'victory_title')
        .setOrigin(0.5)
        .setScale(1);

        // Botão: OK → volta para o menu principal
        const ok = this.add.image(centerX, centerY + 120, 'ok_button')
        .setInteractive()
        .setScale(0.6);

        ok.on('pointerover', () => ok.setScale(0.65));
        ok.on('pointerout', () => ok.setScale(0.6));
        ok.on('pointerdown', () => this.scene.start('MenuScene'));
    }
}
