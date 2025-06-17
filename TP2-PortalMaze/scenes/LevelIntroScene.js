export default class LevelIntroScene extends Phaser.Scene {
    constructor() {
        super('LevelIntroScene');
    }

    preload() {
        this.load.image('rules_1', 'assets/rules/rules_1.png');
        this.load.image('rules_2', 'assets/rules/rules_2.png');
        this.load.image('level1_bg', 'assets/maps/nivel_1.png');
        this.load.image('level2_bg', 'assets/maps/nivel_2.png');
        this.load.image('okButton', 'assets/buttons/ok_button.png');
    }

    create(data) {
        this.level = data.level || 1;
        localStorage.setItem('nivel', this.level);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const bgKey = this.level === 2 ? 'level2_bg' : 'level1_bg';
        const rulesKey = this.level === 2 ? 'rules_2' : 'rules_1';

        // ✅ Fundo escurecido com imagem do mapa
        this.add.image(width / 2, height / 2, bgKey)
            .setOrigin(0.5)
            .setDisplaySize(width, height)
            .setAlpha(0.25); // sombra leve

        // ✅ Quadro com instruções (ajustado)
        const rulesImage = this.add.image(width / 2, height / 2 - 20, rulesKey)
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
            this.scene.start('GameScene', { level: this.level });
        });
    }
}
