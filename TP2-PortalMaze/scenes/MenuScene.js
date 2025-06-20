export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image('bg', 'assets/images/menu_bg.png');
        this.load.image('buttonPlay', 'assets/buttons/play_button.png');
        this.load.image('buttonHowTo', 'assets/buttons/howto_button.png');
        this.load.image('title', 'assets/images/title.png');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.image(width / 2, height / 2, 'bg')
            .setDisplaySize(width, height)
            .setOrigin(0.5);

        this.add.image(width / 2, height / 2 - 160, 'title')
            .setOrigin(0.5)
            .setScale(1);

        const buttonYStart = height / 2 + 40;
        const buttonSpacing = 100;

        const playButton = this.add.image(width / 2, buttonYStart, 'buttonPlay')
            .setInteractive()
            .setScale(0.75);

        playButton.on('pointerover', () => playButton.setScale(0.8));
        playButton.on('pointerout', () => playButton.setScale(0.75));
        playButton.on('pointerdown', () => {
            this.scene.start('LevelIntroScene', { level: 1 });
        });

        const howToButton = this.add.image(width / 2 + 10, buttonYStart + buttonSpacing, 'buttonHowTo')
            .setInteractive()
            .setScale(0.75);

        howToButton.on('pointerover', () => howToButton.setScale(0.8));
        howToButton.on('pointerout', () => howToButton.setScale(0.75));
        howToButton.on('pointerdown', () => {
            this.scene.start('HowToScene');
        });

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('LevelIntroScene', { level: 1 });
        });
    }
}
