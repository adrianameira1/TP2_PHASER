export default class HowToScene extends Phaser.Scene {
  constructor() {
    super('HowToScene');
  }

  preload() {
    this.load.image('howto_bg', 'assets/images/menu_bg.png');
    this.load.image('howto_rules', 'assets/rules/rules_howto_main.png'); // nova imagem com texto que vamos criar
    this.load.image('okButton', 'assets/buttons/ok_button.png');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Fundo com sombra
    this.add.image(width / 2, height / 2, 'howto_bg')
      .setDisplaySize(width, height)
      .setAlpha(0.25)
      .setOrigin(0.5);

    // Painel central com regras do jogo
    this.add.image(width / 2, height / 2 - 20, 'howto_rules')
      .setOrigin(0.5)
      .setDisplaySize(420, 280)
      .setDepth(1);

    // Botão OK
    const okButton = this.add.image(width / 2, height / 2 + 140, 'okButton')
      .setInteractive()
      .setScale(0.3)
      .setDepth(2);

    okButton.on('pointerover', () => okButton.setScale(0.35));
    okButton.on('pointerout', () => okButton.setScale(0.3));
    okButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
