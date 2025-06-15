export default class LevelIntroScene extends Phaser.Scene {
    constructor() {
        super('LevelIntroScene');
    }

    preload() {
        this.load.image('rules_1', 'assets/rules/rules_1.png');
        this.load.image('level1_bg', 'assets/maps/nivel_1.png');
        this.load.image('okButton', 'assets/buttons/ok_button.png'); // Atualize o path se necessário
    }

    create(data) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Fundo do nível
        this.add.image(width / 2, height / 2, 'level1_bg')
            .setOrigin(0.5)
            .setDisplaySize(width, height);

        // Painel de instruções
        const rulesImage = this.add.image(width / 2, height / 2 - 50, 'rules_1')
            .setOrigin(0.5)
            .setScale(0.85);

        // Botão OK — menor e centralizado com a imagem de regras
        const baseScale = 0.3; // <<< Tamanho menor do botão
        const hoverScale = 0.35;

        const okButton = this.add.image(rulesImage.x, rulesImage.y + rulesImage.displayHeight / 2 + 30, 'okButton')
            .setInteractive()
            .setScale(baseScale);

        // Efeitos de hover como o botão PLAY
        okButton.on('pointerover', () => okButton.setScale(hoverScale));
        okButton.on('pointerout', () => okButton.setScale(baseScale));
        okButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
