export default class DeathScene extends Phaser.Scene {
    constructor() {
        super('DeathScene');
    }

    preload() {
        this.load.image('death_spike', 'assets/rules/GameOverSpikes.png');
        this.load.image('death_enemy', 'assets/rules/GameOverEnemy.png');
        this.load.image('level2_bg', 'assets/maps/nivel_2.png');
        this.load.image('okButton', 'assets/buttons/ok_button.png');
    }

    create(data) {
        const { cause } = data;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Fundo escurecido do nível
        this.add.image(width / 2, height / 2, 'level2_bg')
            .setOrigin(0.5)
            .setDisplaySize(width, height)
            .setAlpha(0.25);

        // Define qual imagem mostrar com fallback por segurança
        let imageKey = 'death_enemy';
        if (cause === 'spike') imageKey = 'death_spike';

        try {
            this.add.image(width / 2, height / 2 - 20, imageKey)
                .setOrigin(0.5)
                .setDisplaySize(420, 280)
                .setDepth(1);
        } catch (e) {
            console.error('[ERRO]: Falha ao carregar imagem:', imageKey, e);
            this.add.text(width / 2, height / 2, 'Erro ao carregar aviso', {
                fontSize: '18px',
                fill: '#fff',
                backgroundColor: '#900'
            }).setOrigin(0.5);
        }

        // Botão OK
        const baseScale = 0.3;
        const hoverScale = 0.35;

        const okButton = this.add.image(width / 2, height / 2 + 140, 'okButton')
            .setInteractive()
            .setScale(baseScale)
            .setDepth(2);

        okButton.on('pointerover', () => okButton.setScale(hoverScale));
        okButton.on('pointerout', () => okButton.setScale(baseScale));

        okButton.on('pointerdown', () => {
            this.scene.start('GameScene', { level: 1 }); // Reinicia no nível 1
        });
    }
}
