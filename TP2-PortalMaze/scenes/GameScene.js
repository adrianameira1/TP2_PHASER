export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.tilemapTiledJSON('mapa', 'assets/maps/nivel1.json');
        this.load.image('tilesetFloor', 'assets/tilesets/atlas_floor-16x16.png');
        this.load.image('tilesetWallLow', 'assets/tilesets/atlas_walls_low-16x16.png');
        this.load.image('tilesetWallHigh', 'assets/tilesets/atlas_walls_high-16x32.png');
        this.load.image('player', 'assets/sprites/player.png');
        this.load.image('portal', 'assets/sprites/portal.png');
    }

    create() {
        const tileSize = 16;

        // Ativar sistema de luz
        this.lights.enable();
        this.lights.setAmbientColor(0x111111); // escuro no fundo

        const map = this.make.tilemap({ key: 'mapa' });
        const floor = map.addTilesetImage('atlas_floor-16x16', 'tilesetFloor');
        const wallLow = map.addTilesetImage('atlas_walls_low-16x16', 'tilesetWallLow');
        const wallHigh = map.addTilesetImage('atlas_walls_high-16x32', 'tilesetWallHigh');

        const layer1 = map.createLayer('Camada de Blocos 1', [floor, wallLow, wallHigh], 0, 0);
        const layer2 = map.createLayer('Camada de Blocos 2', [floor, wallLow, wallHigh], 0, 0);

        // Tornar os layers afetados por luz
        layer1.setPipeline('Light2D');
        layer2.setPipeline('Light2D');

        layer1.setCollisionByExclusion([-1]);
        layer2.setCollisionByExclusion([-1]);

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Player com luz
        this.player = this.physics.add.sprite(1 * tileSize + tileSize / 2, 13 * tileSize + tileSize / 2, 'player');
        this.player.setDisplaySize(tileSize, tileSize);
        this.player.setCollideWorldBounds(true);
        this.player.setPipeline('Light2D');

        // Portal
        this.portal = this.physics.add.sprite(18 * tileSize + tileSize / 2, 1 * tileSize + tileSize / 2, 'portal');
        this.portal.setDisplaySize(28, 28);
        this.portal.setPipeline('Light2D');

        // Luz que segue o player
        this.playerLight = this.lights.addLight(this.player.x, this.player.y, 80)
            .setColor(0xffffff)
            .setIntensity(2.2);

        this.physics.add.collider(this.player, layer1);
        this.physics.add.collider(this.player, layer2);

        this.physics.add.overlap(this.player, this.portal, () => {
            this.player.setPosition(1 * tileSize + tileSize / 2, 13 * tileSize + tileSize / 2);
        }, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2.2);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update() {
        const speed = 110; // ← um pouco mais lento
        this.player.setVelocity(0);

        // Atualiza a posição da luz para seguir o player
        this.playerLight.x = this.player.x;
        this.playerLight.y = this.player.y;

        if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
        else if (this.cursors.right.isDown) this.player.setVelocityX(speed);

        if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
        else if (this.cursors.down.isDown) this.player.setVelocityY(speed);
    }
}
