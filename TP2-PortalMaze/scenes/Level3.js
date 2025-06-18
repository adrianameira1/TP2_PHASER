export default class Level3 extends Phaser.Scene {
  constructor() {
    super('level3');
  }

  preload() {
    this.load.tilemapTiledJSON('nivel3', 'assets/maps/nivel3.json');

    this.load.image('decorative_cracks_floor', 'assets/tilesets/decorative_cracks_floor.png');
    this.load.image('decorative_cracks_coasts_animation', 'assets/tilesets/decorative_cracks_coasts_animation.png');
    this.load.image('decorative_cracks_walls', 'assets/tilesets/decorative_cracks_walls.png');
    this.load.image('walls_floor', 'assets/tilesets/walls_floor.png');
    this.load.image('Water_coasts_animation', 'assets/tilesets/Water_coasts_animation.png');
    this.load.image('water_details_animation', 'assets/tilesets/water_details_animation.png');
    this.load.image('fire_animation', 'assets/tilesets/fire_animation.png');
    this.load.image('fire_animation2', 'assets/tilesets/fire_animation2.png');
    this.load.image('doors_lever_chest_animation', 'assets/tilesets/doors_lever_chest_animation.png');
    this.load.image('Objects', 'assets/tilesets/Objects.png');
    this.load.image('trap_animation', 'assets/tilesets/trap_animation.png');
    this.load.image('portal', 'assets/sprites/portal.png');

    this.load.spritesheet('player', 'assets/sprites/player.png', {
      frameWidth: 16,
      frameHeight: 16
    });
  }

  create() {
    const map = this.make.tilemap({ key: 'nivel3' });

    const tilesets = [
      map.addTilesetImage('decorative_cracks_coasts_animation', 'decorative_cracks_coasts_animation'),
      map.addTilesetImage('decorative_cracks_floor', 'decorative_cracks_floor'),
      map.addTilesetImage('decorative_cracks_walls', 'decorative_cracks_walls'),
      map.addTilesetImage('doors_lever_chest_animation', 'doors_lever_chest_animation'),
      map.addTilesetImage('fire_animation', 'fire_animation'),
      map.addTilesetImage('fire_animation2', 'fire_animation2'),
      map.addTilesetImage('Objects', 'Objects'),
      map.addTilesetImage('trap_animation', 'trap_animation'),
      map.addTilesetImage('walls_floor', 'walls_floor'),
      map.addTilesetImage('Water_coasts_animation', 'Water_coasts_animation'),
      map.addTilesetImage('water_details_animation', 'water_details_animation')
    ];

    // Camadas na ordem do Tiled (de baixo para cima)
    map.createLayer('water_floor3', tilesets);
    map.createLayer('walls_under_water', tilesets);
    map.createLayer('water_detailization2', tilesets);
    map.createLayer('water_detailization', tilesets);
    map.createLayer('Floor2_pool', tilesets);
    map.createLayer('Floor2_darker_surface', tilesets);
    map.createLayer('Floor', tilesets);
    map.createLayer('Floor_darker_surface', tilesets);
    map.createLayer('Objects_under_wall', tilesets);
    map.createLayer('Walls', tilesets);
    map.createLayer('Windows', tilesets);
    map.createLayer('Lights', tilesets);
    map.createLayer('traps', tilesets);
    map.createLayer('Objects', tilesets);
    map.createLayer('Objects2', tilesets);

    const wallLayer = map.getLayer('walls_under_water').tilemapLayer;
    wallLayer.setCollisionByProperty({ collides: true });

    const objects = map.getObjectLayer('logic_objects')?.objects || [];
    const spawn = objects.find(obj => obj.name === 'PlayerSpawn');
    this.player = this.physics.add.sprite(spawn.x + 8, spawn.y + 8, 'player').setDepth(10);

    this.portals = {};
    objects.filter(o => o.type === 'portal').forEach(obj => {
      const target = obj.properties.find(p => p.name === 'target')?.value;
      this.portals[obj.name] = { x: obj.x, y: obj.y, target };

      this.add.image(obj.x + 8, obj.y + 8, 'portal').setDepth(1);
      const zone = this.add.zone(obj.x + 8, obj.y + 8, 16, 16);
      this.physics.world.enable(zone);
      this.physics.add.overlap(this.player, zone, () => {
        const destName = `Portal${this.portals[obj.name].target}`;
        const dest = this.portals[destName];
        if (dest) this.player.setPosition(dest.x + 8, dest.y + 8);
      }, null, this);
    });

    const finalPortal = objects.find(obj => obj.name === 'PortalToNextLevel');
    if (finalPortal) {
      this.add.image(finalPortal.x + 8, finalPortal.y + 8, 'portal').setDepth(1);
      const endZone = this.add.zone(finalPortal.x + 8, finalPortal.y + 8, 16, 16);
      this.physics.world.enable(endZone);
      this.physics.add.overlap(this.player, endZone, () => {
        this.scene.start('victory');
      });
    }

    this.physics.add.collider(this.player, wallLayer);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.contadorMoedas = 0;
    this.contadorChaves = 0;
    this.textoMoedas = this.add.text(16, 16, '🪙 Moedas: 0', { fontSize: '12px', fill: '#fff' }).setScrollFactor(0).setDepth(999);
    this.textoChaves = this.add.text(16, 32, '🔑 Chaves: 0', { fontSize: '12px', fill: '#fff' }).setScrollFactor(0).setDepth(999);

    this.ouros = this.physics.add.group();
    objects.filter(o => o.type === 'ouro').forEach(obj => {
      const sprite = this.ouros.create(obj.x + 8, obj.y + 8, 'Objects');
      this.physics.add.overlap(this.player, sprite, () => {
        sprite.destroy();
        this.contadorMoedas++;
        this.textoMoedas.setText(`🪙 Moedas: ${this.contadorMoedas}`);
      });
    });

    this.chaves = this.physics.add.group();
    objects.filter(o => o.type === 'chave').forEach(obj => {
      const sprite = this.chaves.create(obj.x + 8, obj.y + 8, 'Objects');
      this.physics.add.overlap(this.player, sprite, () => {
        sprite.destroy();
        this.contadorChaves++;
        this.textoChaves.setText(`🔑 Chaves: ${this.contadorChaves}`);
      });
    });

    objects.filter(o => o.type === 'bau').forEach(obj => {
      const sprite = this.physics.add.sprite(obj.x + 8, obj.y + 8, 'doors_lever_chest_animation');
      sprite.bauAberto = false;
      this.physics.add.overlap(this.player, sprite, () => {
        if (!sprite.bauAberto) {
          sprite.bauAberto = true;
          this.contadorMoedas += 10;
          this.textoMoedas.setText(`🪙 Moedas: ${this.contadorMoedas}`);
        }
      });
    });
  }

  update() {
    const speed = 110;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
    else if (this.cursors.right.isDown) this.player.setVelocityX(speed);

    if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
    else if (this.cursors.down.isDown) this.player.setVelocityY(speed);
  }
}
