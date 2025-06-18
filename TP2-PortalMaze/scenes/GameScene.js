export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.level = data.level || parseInt(localStorage.getItem('nivel')) || 1;
        localStorage.setItem('nivel', this.level);
    }

    preload() {
        this.mapKey = `mapa_nivel${this.level}`;
        const mapPath = `assets/maps/nivel${this.level}.json`;

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

        // POSICIONAMENTO DO PLAYER E PORTAL
        if (this.level === 2) {
            this.player = this.physics.add.sprite(28 * tileSize + tileSize / 2, 1 * tileSize + tileSize / 2, 'player');
            this.portal = this.physics.add.sprite(1 * tileSize + tileSize / 2, 1 * tileSize + tileSize / 2, 'portal');
        } else {
            this.player = this.physics.add.sprite(1 * tileSize + tileSize / 2, 13 * tileSize + tileSize / 2, 'player');
            this.portal = this.physics.add.sprite(18 * tileSize + tileSize / 2, 1 * tileSize + tileSize / 2, 'portal');
        }

        this.player.setDisplaySize(this.level === 2 ? tileSize + 6 : tileSize, this.level === 2 ? tileSize + 6 : tileSize);
        this.player.setCollideWorldBounds(true);
        this.portal.setDisplaySize(28, 28);

        if (this.level !== 2) {
            this.player.setPipeline('Light2D');
            this.portal.setPipeline('Light2D');
            this.playerLight = this.lights.addLight(this.player.x, this.player.y, 80).setColor(0xffffff).setIntensity(2.2);
        }

        this.physics.add.collider(this.player, layer1);
        this.physics.add.collider(this.player, layer2);
        if (layer3) this.physics.add.collider(this.player, layer3);

        this.moedas = this.physics.add.group();
        this.chavesOuro = this.physics.add.group();
        this.contadorChaves = 0;
        this.contadorMoedas = 0;
        this.esqueletos = [];
        this.picos = [];
        this.picoTimers = new Map(); // [MODIFICAÇÃO]

        this.textoChaves = this.add.text(150, 100, '🔑 Chaves: 0', { fontSize: '12px', fill: '#fff' }).setScrollFactor(0).setDepth(10);
        this.textoMoedas = this.add.text(250, 100, '🪙 Moedas: 0', { fontSize: '12px', fill: '#fff' }).setScrollFactor(0).setDepth(10);

        if (this.level === 2) {
            const objetosLayer = map.getObjectLayer('Objetos');
            if (objetosLayer) {
                objetosLayer.objects.forEach(obj => {
                    const { name, x, y } = obj;
                    const posX = x + tileSize / 2;
                    const posY = y - tileSize / 2;
                    let sprite;

                    const portasCoords = {
                        'chave_prata1': [{ x: 19, y: 20 }, { x: 19, y: 21 }],
                        'chave_prata2': [{ x: 2, y: 18 }, { x: 3, y: 18 }],
                        'chave_prata3': [{ x: 8, y: 11 }, { x: 8, y: 12 }],
                        'chave_dourada': [{ x: 10, y: 7 }, { x: 11, y: 7 }]
                    };

                    if (portasCoords[name]) {
                        sprite = this.physics.add.sprite(posX, posY, name.includes('prata') ? 'silver_key' : 'key').play(name.includes('prata') ? 'silver_key' : 'key');
                        this.physics.add.overlap(this.player, sprite, () => {
                            sprite.destroy();
                            this.contadorChaves++;
                            this.textoChaves.setText(`🔑 Chaves: ${this.contadorChaves}`);
                            portasCoords[name].forEach(coord => layer2.removeTileAt(coord.x, coord.y));
                        });
                        sprite.setDepth(1);
                        return;
                    }

                    switch (name) {
                        case 'moeda':
                            sprite = this.moedas.create(posX, posY, 'coin').play('coin');
                            break;

                        case 'bau':
                            sprite = this.physics.add.sprite(posX, posY, 'chest_idle').play('chest_idle');
                            sprite.setDepth(1);
                            sprite.bauAberto = false;

                            this.physics.add.overlap(this.player, sprite, () => {
                                if (!sprite.bauAberto) {
                                    sprite.bauAberto = true;
                                    sprite.play('chest_open');
                                    this.contadorMoedas += 30;
                                    this.textoMoedas.setText(`🪙 Moedas: ${this.contadorMoedas}`);
                                    const textoBonus = this.add.text(sprite.x, sprite.y - 10, '+30', {
                                        fontSize: '12px',
                                        fill: '#ff0',
                                        stroke: '#000',
                                        strokeThickness: 2
                                    }).setOrigin(0.5).setDepth(10);
                                    this.tweens.add({
                                        targets: textoBonus,
                                        y: textoBonus.y - 20,
                                        alpha: 0,
                                        duration: 800,
                                        onComplete: () => textoBonus.destroy()
                                    });
                                }
                            });
                            break;

                        case 'bau_aberto':
                            sprite = this.add.sprite(posX, posY, 'chest_open').play('chest_open');
                            break;

                        case 'vampiro1':
                        case 'vampiro2':
                            sprite = this.physics.add.sprite(posX, posY, 'vampire').play('vampire');
                            sprite.setVelocityX(40);
                            sprite.setCollideWorldBounds(true);
                            sprite.setBounce(1, 0);
                            sprite.setSize(12, 12).setOffset(2, 2); // 👈 Hitbox ajustada
                            this.physics.add.collider(sprite, layer2);
                            this.esqueletos.push({ sprite, axis: 'x', direction: 1 });
                            this.physics.add.overlap(this.player, sprite, () => {
                                this.scene.start('DeathScene', { cause: 'enemy' });
                            });
                            break;

                        case 'esqueleto1':
                            sprite = this.physics.add.sprite(posX, posY, 'skeleton').play('skeleton');
                            sprite.setVelocityX(40);
                            sprite.setCollideWorldBounds(true);
                            sprite.setBounce(1, 0);
                            sprite.setSize(12, 12).setOffset(2, 2); // 👈 Hitbox ajustada
                            this.physics.add.collider(sprite, layer2);
                            this.esqueletos.push({ sprite, axis: 'x', direction: 1 });
                            this.physics.add.overlap(this.player, sprite, () => {
                                this.scene.start('DeathScene', { cause: 'enemy' });
                            });
                            break;

                        case 'esqueleto2':
                            sprite = this.physics.add.sprite(posX, posY, 'skeleton').play('skeleton');
                            sprite.setVelocityX(-40);
                            sprite.setCollideWorldBounds(true);
                            sprite.setBounce(1, 0);
                            sprite.setSize(12, 12).setOffset(2, 2); // 👈 Hitbox ajustada
                            this.physics.add.collider(sprite, layer2);
                            this.esqueletos.push({ sprite, axis: 'x', direction: -1 });
                            this.physics.add.overlap(this.player, sprite, () => {
                                this.scene.start('DeathScene', { cause: 'enemy' });
                            });
                            break;

                        case 'esqueleto3':
                            sprite = this.physics.add.sprite(posX, posY, 'skeleton').play('skeleton');
                            sprite.setVelocityY(40);
                            sprite.setCollideWorldBounds(true);
                            sprite.setBounce(0, 1);
                            sprite.setSize(12, 12).setOffset(2, 2); // 👈 Hitbox ajustada
                            this.physics.add.collider(sprite, layer2);
                            this.esqueletos.push({ sprite, axis: 'y', direction: 1 });
                            this.physics.add.overlap(this.player, sprite, () => {
                                this.scene.start('DeathScene', { cause: 'enemy' });
                            });
                            break;

                            case 'pico':
                                sprite = this.physics.add.sprite(posX, posY, 'peaks').play('peaks');
                                sprite.body.setAllowGravity(false);
                                sprite.body.setImmovable(true);
                                this.picos.push(sprite);
                                this.picoTimers.set(sprite, null);

                                break;

                            }

                    if (sprite) sprite.setDepth(1);
                });

                this.physics.add.overlap(this.player, this.picos, (player, pico) => {
                    pico.touching = true;
                });


                this.physics.add.overlap(this.player, this.moedas, (player, moeda) => {
                    moeda.destroy();
                    this.contadorMoedas++;
                    this.textoMoedas.setText(`🪙 Moedas: ${this.contadorMoedas}`);
                });
            }
        }

        this.physics.add.overlap(this.player, this.portal, () => {
            const moedasRestantes = this.moedas.countActive(true);
            if (moedasRestantes === 0) {
                const nextLevel = this.level + 1;

                if (nextLevel === 3) {
                    this.scene.start('LevelIntroScene', { level: 3 });
                } else {
                    fetch(`assets/maps/nivel${nextLevel}.json`)
                        .then(res => res.ok ? this.scene.start('LevelIntroScene', { level: nextLevel }) : this.scene.start('EndScene'))
                        .catch(() => this.scene.start('EndScene'));
                }
            }
        });

        if (this.level === 2) {
            this.cameras.main.setZoom(1.5);
            this.cameras.main.setScroll(0, 0);
        } else {
            this.cameras.main.startFollow(this.player);
            this.cameras.main.setZoom(2.2);
        }

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

   update() {
        if (!this.cursors) return;

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

        // Verificação de morte por pico
        this.picos.forEach(pico => {
            const tileSize = 16;

            const playerTileX = Math.floor(this.player.x / tileSize);
            const playerTileY = Math.floor(this.player.y / tileSize);
            const picoTileX = Math.floor(pico.x / tileSize);
            const picoTileY = Math.floor(pico.y / tileSize);

            const mesmaTile = playerTileX === picoTileX && playerTileY === picoTileY;

            if (!mesmaTile) {
                this.picoTimers.set(pico, null); // saiu da tile
                return;
            }

            const agora = this.time.now;
            const inicio = this.picoTimers.get(pico);

            if (inicio === null || inicio === undefined) {
                this.picoTimers.set(pico, agora);
            } else if (agora - inicio >= 500) {
                this.scene.start('DeathScene', { cause: 'spike' });
            }
        });


        // Movimento dos esqueletos
        if (this.level === 2 && this.esqueletos) {
            this.esqueletos.forEach(e => {
                if (e.axis === 'x') {
                    if (e.sprite.body.blocked.right) {
                        e.sprite.setVelocityX(-40);
                    } else if (e.sprite.body.blocked.left) {
                        e.sprite.setVelocityX(40);
                    }
                } else if (e.axis === 'y') {
                    if (e.sprite.body.blocked.down) {
                        e.sprite.setVelocityY(-40);
                    } else if (e.sprite.body.blocked.up) {
                        e.sprite.setVelocityY(40);
                    }
                }
            });
        }
    }
}
