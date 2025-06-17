export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.level = data.level || parseInt(localStorage.getItem('nivel')) || 1;
        localStorage.setItem('nivel', this.level);
        console.log('[init] Nível atual:', this.level);
    }

    preload() {
        this.mapKey = `mapa_nivel${this.level}`;
        const mapPath = `assets/maps/nivel${this.level}.json`;

        console.log('[preload] A carregar mapa:', mapPath, 'com chave:', this.mapKey);
        this.load.tilemapTiledJSON(this.mapKey, mapPath);

        if (this.level === 2) {
            this.load.image('Dungeon_level2', 'assets/tilesets/Dungeon_Tileset.png');
            this.load.spritesheet('peaks', 'assets/tilesets/peaks/peaks.png', { frameWidth: 16, frameHeight: 16 });
            this.load.spritesheet('coin', 'assets/tilesets/coin/coin_spritesheet_16x16.png', { frameWidth: 16, frameHeight: 16 });
            this.load.spritesheet('chest_idle', 'assets/tilesets/chest_closed/chest_idle_spritesheet_16x16.png', { frameWidth: 16, frameHeight: 16 });
            this.load.spritesheet('chest_open', 'assets/tilesets/chest_open/chest_open_spritesheet_16x16.png', { frameWidth: 16, frameHeight: 16 });
            this.load.spritesheet('key', 'assets/tilesets/gold_key/key_spritesheet_16x16.png', { frameWidth: 16, frameHeight: 16 });
            this.load.spritesheet('silver_key', 'assets/tilesets/silver_key/silver_key_spritesheet_16x16.png', { frameWidth: 16, frameHeight: 16 });
            this.load.spritesheet('vampire', 'assets/sprites/enemies/vampire/vampire_spritesheet_16x16.png', { frameWidth: 16, frameHeight: 16 });
            this.load.spritesheet('skeleton', 'assets/sprites/enemies/skeleton/skeleton_spritesheet_16x16.png', { frameWidth: 16, frameHeight: 16 });
        } else {
            this.load.image('tilesetFloor', 'assets/tilesets/atlas_floor-16x16.png');
            this.load.image('tilesetWallLow', 'assets/tilesets/atlas_walls_low-16x16.png');
            this.load.image('tilesetWallHigh', 'assets/tilesets/atlas_walls_high-16x32.png');
        }

        this.load.image('player', 'assets/sprites/player.png');
        this.load.image('portal', 'assets/sprites/portal.png');
    }

    create() {
        const tileSize = 16;
        const map = this.make.tilemap({ key: this.mapKey });

        if (this.level === 2) {
            this.anims.create({ key: 'coin', frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'chest_idle', frames: this.anims.generateFrameNumbers('chest_idle', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'chest_open', frames: this.anims.generateFrameNumbers('chest_open', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'key', frames: this.anims.generateFrameNumbers('key', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'silver_key', frames: this.anims.generateFrameNumbers('silver_key', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'vampire', frames: this.anims.generateFrameNumbers('vampire', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'skeleton', frames: this.anims.generateFrameNumbers('skeleton', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'peaks', frames: this.anims.generateFrameNumbers('peaks', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
        }

        const tileset = this.level === 2
            ? map.addTilesetImage('Dungeon_level2', 'Dungeon_level2')
            : [
                map.addTilesetImage('atlas_floor-16x16', 'tilesetFloor'),
                map.addTilesetImage('atlas_walls_low-16x16', 'tilesetWallLow'),
                map.addTilesetImage('atlas_walls_high-16x32', 'tilesetWallHigh')
            ];

        const layer1 = map.createLayer('Camada de Blocos 1', tileset, 0, 0);
        const layer2 = map.createLayer('Camada de Blocos 2', tileset, 0, 0);
        const layer3 = map.getLayer('Camada de Blocos 3') ? map.createLayer('Camada de Blocos 3', tileset, 0, 0) : null;

        layer1.setCollisionByExclusion([-1]);
        layer2.setCollisionByExclusion([-1]);

        if (this.level !== 2) {
            this.lights.enable();
            this.lights.setAmbientColor(0x111111);
            layer1.setPipeline('Light2D');
            layer2.setPipeline('Light2D');
            if (layer3) layer3.setPipeline('Light2D');
        }

        this.player = this.physics.add.sprite(1 * tileSize + tileSize / 2, 13 * tileSize + tileSize / 2, 'player');
        this.player.setDisplaySize(tileSize, tileSize);
        this.player.setCollideWorldBounds(true);
        if (this.level !== 2) this.player.setPipeline('Light2D');

        this.portal = this.physics.add.sprite(18 * tileSize + tileSize / 2, 1 * tileSize + tileSize / 2, 'portal');
        this.portal.setDisplaySize(28, 28);
        if (this.level !== 2) this.portal.setPipeline('Light2D');

        if (this.level !== 2) {
            this.playerLight = this.lights.addLight(this.player.x, this.player.y, 80).setColor(0xffffff).setIntensity(2.2);
        }

        this.physics.add.collider(this.player, layer1);
        this.physics.add.collider(this.player, layer2);
        if (layer3) this.physics.add.collider(this.player, layer3);

        // GRUPOS E HUD (somente chaves)
        this.moedas = this.physics.add.group(); // ainda carregadas, mas ignoradas
        this.chavesOuro = this.physics.add.group();
        this.chavesPrata = this.physics.add.group();

        this.contadorChaves = 0;

        this.textoChaves = this.add.text(80, 60, '🔑 Chaves: 0', {
            fontSize: '12px', fill: '#fff'
        }).setScrollFactor(0).setDepth(10);

        if (this.level === 2) {
            const objetosLayer = map.getObjectLayer('Objetos');
            if (objetosLayer) {
                objetosLayer.objects.forEach(obj => {
                    const { name, x, y } = obj;
                    const posX = x + tileSize / 2;
                    const posY = y - tileSize / 2;
                    let sprite;

                    switch (name) {
                        case 'moeda': sprite = this.moedas.create(posX, posY, 'coin').play('coin'); break;
                        case 'chave': sprite = this.chavesOuro.create(posX, posY, 'key').play('key'); break;
                        case 'chave_prata': sprite = this.chavesPrata.create(posX, posY, 'silver_key').play('silver_key'); break;
                        case 'bau': sprite = this.add.sprite(posX, posY, 'chest_idle').play('chest_idle'); break;
                        case 'bau_aberto': sprite = this.add.sprite(posX, posY, 'chest_open').play('chest_open'); break;
                        case 'vampiro': sprite = this.add.sprite(posX, posY, 'vampire').play('vampire'); break;
                        case 'esqueleto': sprite = this.add.sprite(posX, posY, 'skeleton').play('skeleton'); break;
                        case 'pico': sprite = this.add.sprite(posX, posY, 'peaks').play('peaks'); break;
                    }

                    if (sprite) sprite.setDepth(1);
                });

                // COLETAR chaves (ouro e prata → mesmas regras)
                this.physics.add.overlap(this.player, this.chavesOuro, (player, chave) => {
                    chave.destroy();
                    this.contadorChaves++;
                    this.textoChaves.setText(`🔑 Chaves: ${this.contadorChaves}`);
                });

                this.physics.add.overlap(this.player, this.chavesPrata, (player, chave) => {
                    chave.destroy();
                    this.contadorChaves++;
                    this.textoChaves.setText(`🔑 Chaves: ${this.contadorChaves}`);
                });
            }
        }

        this.physics.add.overlap(this.player, this.portal, () => {
            const nextLevel = this.level + 1;
            fetch(`assets/maps/nivel${nextLevel}.json`)
                .then(res => res.ok ? this.scene.start('LevelIntroScene', { level: nextLevel }) : this.scene.start('EndScene'))
                .catch(() => this.scene.start('EndScene'));
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(this.level === 2 ? 1.2 : 2.2);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update() {
        const speed = 110;
        this.player.setVelocity(0);

        if (this.level !== 2 && this.playerLight) {
            this.playerLight.x = this.player.x;
            this.playerLight.y = this.player.y;
        }

        if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
        else if (this.cursors.right.isDown) this.player.setVelocityX(speed);

        if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
        else if (this.cursors.down.isDown) this.player.setVelocityY(speed);
    }
}
