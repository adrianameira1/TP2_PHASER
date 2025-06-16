export default class Victory extends Phaser.Scene {
  constructor() {
    super('victory');
  }

  preload() {
    this.load.image('victory_bg', 'assets/images/victory_background.png'); // substitui pela imagem certa
  }

  create() {
    // Fundo
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'victory_bg').setOrigin(0.5);

    // Texto de parabéns
    const style = { font: '32px serif', fill: '#ffffff' };
    this.add.text(this.cameras.main.centerX, 80, 'Parabéns! Concluíste o jogo!', style).setOrigin(0.5);

    // Botão: Jogar de Novo
    const restartButton = this.add.text(this.cameras.main.centerX, 200, '🔁 Jogar de Novo', style)
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('GameScene'));

    // Botão: Voltar ao Menu
    const menuButton = this.add.text(this.cameras.main.centerX, 260, '🏠 Menu Principal', style)
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('MenuScene'));

    // Botão: Sair (encerra o jogo, pode ser apenas refresh ou reload do site)
    const exitButton = this.add.text(this.cameras.main.centerX, 320, '🚪 Sair', style)
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => window.location.reload());
  }
}
