
export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        this.player = this.physics.add.sprite(100, 100, 'player');
        this.portal = this.physics.add.sprite(400, 300, 'portal');

        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.overlap(this.player, this.portal, () => {
            this.player.setPosition(100, 400); // teleport to a new location
        }, null, this);
    }

    update() {
        const speed = 150;
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
        if (this.cursors.right.isDown) this.player.setVelocityX(speed);
        if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
        if (this.cursors.down.isDown) this.player.setVelocityY(speed);
    }
}
