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

        if (this.level === 2 || this.level === 3) {
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
        this.load.audio('musicaFundo', 'assets/audio/dungeon_song.mp3');
        this.load.audio('coinSound', 'assets/audio/coin_sound1.mp3');


    }

    create() {
        const tileSize = 16;
        const map = this.make.tilemap({ key: this.mapKey });
        this.coinSound = this.sound.add('coinSound', { volume: 0.5 });



        if (this.level === 2 || this.level === 3) {
            this.anims.create({ key: 'coin', frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'chest_idle', frames: this.anims.generateFrameNumbers('chest_idle', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'chest_open', frames: this.anims.generateFrameNumbers('chest_open', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'key', frames: this.anims.generateFrameNumbers('key', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'silver_key', frames: this.anims.generateFrameNumbers('silver_key', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'vampire', frames: this.anims.generateFrameNumbers('vampire', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'skeleton', frames: this.anims.generateFrameNumbers('skeleton', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'peaks', frames: this.anims.generateFrameNumbers('peaks', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
        }

        const tileset = (this.level === 2 || this.level === 3)
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

        if (this.level !== 2 && this.level !== 3) {
            this.lights.enable();
            this.lights.setAmbientColor(0x111111);
            layer1.setPipeline('Light2D');
            layer2.setPipeline('Light2D');
            if (layer3) layer3.setPipeline('Light2D');
        }

        // POSICIONAMENTO DO PLAYER E PORTAL
        if (this.level === 3) {
            // Player em (1,1)
            this.player = this.physics.add.sprite(1 * tileSize + tileSize / 2, 1 * tileSize + tileSize / 2, 'player');

            // Portal em (largura - 2 tiles)
            const portalX = map.widthInPixels - 2 * tileSize + tileSize / 2;
            this.portal = this.physics.add.sprite(portalX, tileSize / 2, 'portal');
        } else if (this.level === 2) {
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
        this.picoTimers = new Map();

        this.textoChaves = this.add.text(150, 100, '🔑 Chaves: 0', { fontSize: '12px', fill: '#fff' }).setScrollFactor(0).setDepth(10);
        this.textoMoedas = this.add.text(250, 100, '🪙 Moedas: 0', { fontSize: '12px', fill: '#fff' }).setScrollFactor(0).setDepth(10);

        if (this.level === 2 || this.level === 3) {
            const objetosLayer = map.getObjectLayer('Objetos');
            
            let portasCoords = {};
            if (this.level === 2) {
                portasCoords = {
                    'chave_prata1': [{ x: 19, y: 20 }, { x: 19, y: 21 }],
                    'chave_prata2': [{ x: 2, y: 18 }, { x: 3, y: 18 }],
                    'chave_prata3': [{ x: 8, y: 11 }, { x: 8, y: 12 }],
                    'chave_dourada': [{ x: 10, y: 7 }, { x: 11, y: 7 }]
                };
            } else if (this.level === 3) {
                portasCoords = {
                    'chave_prata1': [{ x: 2, y: 7 }, { x: 3, y: 7 }],
                    'chave_prata2': [{ x: 22, y: 14 }, { x: 22, y: 15 }],
                    'chave_prata3': [{ x: 18, y: 7 }, { x: 19, y: 7 }],
                    'chave_dourada': [{ x: 30, y: 9 }, { x: 31, y: 9 }]
                };
            }
            if (objetosLayer) {
                objetosLayer.objects.forEach(obj => {
                    const { name, x, y } = obj;
                    const posX = x + tileSize / 2;
                    const posY = y - tileSize / 2;
                    let sprite;

                   if (portasCoords[name]) {
                        sprite = this.physics.add.sprite(posX, posY, name.includes('prata') ? 'silver_key' : 'key')
                            .play(name.includes('prata') ? 'silver_key' : 'key');
                        sprite.setDepth(1);

                        this.physics.add.overlap(this.player, sprite, () => {
                            console.log('✅ Chave apanhada:', name); // ← ADICIONA ISTO
                            console.log('🔓 Portas a remover:', portasCoords[name]);

                            sprite.destroy();
                            this.contadorChaves++;
                            this.textoChaves.setText(`🔑 Chaves: ${this.contadorChaves}`);
                            portasCoords[name].forEach(coord => {
                            const tile = layer2.getTileAt(coord.x, coord.y);
                            console.log(`⛏️ Verificando tile em (${coord.x}, ${coord.y}):`, tile);
                            if (tile) {
                                layer2.removeTileAt(coord.x, coord.y);
                                console.log(`✅ Tile removido em (${coord.x}, ${coord.y})`);
                            } else {
                                console.warn(`⚠️ Nenhum tile encontrado em (${coord.x}, ${coord.y})`);
                            }
                            });

                        });
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
                                    this.coinSound.play(); 
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

                        // Vampiros que se movem na vertical no nível 3
                        case 'vampiro1':
                        case 'vampiro2':
                        case 'vampiro4':
                        case 'vampiro5':
                            sprite = this.physics.add.sprite(posX, posY, 'vampire').play('vampire');
                            if (this.level === 3) {
                                sprite.setVelocityY(60);
                                sprite.setBounce(0, 1);
                                this.esqueletos.push({ sprite, axis: 'y', direction: 1 });
                            } else {
                                sprite.setVelocityX(40);
                                sprite.setBounce(1, 0);
                                this.esqueletos.push({ sprite, axis: 'x', direction: 1 });
                            }
                            sprite.setCollideWorldBounds(true);
                            sprite.setSize(12, 12).setOffset(2, 2);
                            this.physics.add.collider(sprite, layer2);
                            this.physics.add.overlap(this.player, sprite, () => {
                                this.scene.start('DeathScene', { cause: 'enemy' });
                            });
                            break;

                        // Vampiros que se movem na horizontal no nível 3
                        case 'vampiro3':
                        case 'vampiro6':
                        case 'vampiro7':
                            sprite = this.physics.add.sprite(posX, posY, 'vampire').play('vampire');
                            sprite.setVelocityX(60);
                            sprite.setBounce(1, 0);
                            sprite.setCollideWorldBounds(true);
                            sprite.setSize(12, 12).setOffset(2, 2);
                            this.physics.add.collider(sprite, layer2);
                            this.esqueletos.push({ sprite, axis: 'x', direction: 1 });
                            this.physics.add.overlap(this.player, sprite, () => {
                                this.scene.start('DeathScene', { cause: 'enemy' });
                            });
                            break;

                        // Esqueletos com movimento horizontal no nível 3
                        case 'esqueleto1':
                        case 'esqueleto2':
                        case 'esqueleto3':
                            sprite = this.physics.add.sprite(posX, posY, 'skeleton').play('skeleton');
                            sprite.setVelocityX(60);
                            sprite.setBounce(1, 0);
                            sprite.setCollideWorldBounds(true);
                            sprite.setSize(12, 12).setOffset(2, 2);
                            this.physics.add.collider(sprite, layer2);
                            this.esqueletos.push({ sprite, axis: 'x', direction: 1 });
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
                    this.coinSound.play();
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

        // Movimento dos inimigos
        if (this.esqueletos) {
            this.esqueletos.forEach(e => {
                if (this.level === 2) {
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
                } else if (this.level === 3) {
                    if (e.axis === 'x') {
                        if (e.sprite.body.blocked.right) {
                            e.sprite.setVelocityX(-60);
                        } else if (e.sprite.body.blocked.left) {
                            e.sprite.setVelocityX(60);
                        }
                    } else if (e.axis === 'y') {
                        if (e.sprite.body.blocked.down) {
                            e.sprite.setVelocityY(-60);
                        } else if (e.sprite.body.blocked.up) {
                            e.sprite.setVelocityY(60);
                        }
                    }
                }
            });
        }
    }
}