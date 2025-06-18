export default class LevelIntroScene extends Phaser.Scene {
    constructor() {
        super('LevelIntroScene');
    }

    preload() {
        this.load.image('rules_1', 'assets/rules/rules_1.png');
        this.load.image('rules_2', 'assets/rules/rules_2.png');
        this.load.image('rules_3', 'assets/rules/rules_3.png');
        this.load.image('level1_bg', 'assets/maps/nivel_1.png');
        this.load.image('level2_bg', 'assets/maps/nivel_2.png');
        this.load.image('level3_bg', 'assets/maps/nivel_3.png'); // novo fundo
        this.load.image('okButton', 'assets/buttons/ok_button.png');

        this.load.audio('musicaFundo', 'assets/audio/dungeon_song.mp3');

    }

    create(data) {
        this.level = data.level || 1;
        localStorage.setItem('nivel', this.level);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const bgKey = this.level === 2 ? 'level2_bg' :
                      this.level === 3 ? 'level3_bg' : 'level1_bg';

        const rulesKey = this.level === 2 ? 'rules_2' :
                         this.level === 3 ? 'rules_3' : 'rules_1';

        // ✅ Fundo escurecido com imagem do mapa
        this.add.image(width / 2, height / 2, bgKey)
            .setOrigin(0.5)
            .setDisplaySize(width, height)
            .setAlpha(0.25); // sombra leve

        // ✅ Quadro com instruções
        this.add.image(width / 2, height / 2 - 20, rulesKey)
            .setOrigin(0.5)
            .setDisplaySize(420, 280)
            .setDepth(1);

        // ✅ Botão OK
        const baseScale = 0.3;
        const hoverScale = 0.35;

        const okButton = this.add.image(width / 2, height / 2 + 140, 'okButton')
            .setInteractive()
            .setScale(baseScale)
            .setDepth(2);

        okButton.on('pointerover', () => okButton.setScale(hoverScale));
        okButton.on('pointerout', () => okButton.setScale(baseScale));

       okButton.on('pointerdown', () => {
            
            if (!this.sound.get('musicaFundo')) {
                this.sound.add('musicaFundo', { loop: true, volume: 0.5 }).play();
            }

            if (this.level === 3) {
                this.scene.start('level3');
            } else {
                this.scene.start('GameScene', { level: this.level });
            }
        });

    }
}
