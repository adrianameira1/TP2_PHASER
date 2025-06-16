export default class Level3 extends Phaser.Scene {
  constructor() {
    super('level3');
  }

  preload() {
    // Mapa
    this.load.tilemapTiledJSON('nivel3', 'assets/maps/nivel3.json');

    // Tilesets
    this.load.image('cracked_tiles', 'assets/tilesets/cracked_tiles.png');
    this.load.image('cracked_tiles_floor', 'assets/tilesets/cracked_tiles_floor.png');
    this.load.image('walls_floor', 'assets/tilesets/walls_floor.png');
    this.load.image('Water_coasts_animation', 'assets/tilesets/Water_coasts_animation.png');
    this.load.image('Water_detilazation', 'assets/tilesets/Water_detilazation.png');
    this.load.image('Water_coasts_animation_decorative_cracks', 'assets/tilesets/Water_coasts_animation_decorative_cracks.png');
    this.load.image('fire_animation', 'assets/tilesets/fire_animation.png');
    this.load.image('fire_animation2', 'assets/tilesets/fire_animation2.png');
    this.load.image('doors_lever_chest_animation', 'assets/tilesets/doors_lever_chest_animation.png');
    this.load.image('Objects', 'assets/tilesets/Objects.png');
    this.load.image('trap_animation', 'assets/tilesets/trap_animation.png');

    // Sprite do jogador
    this.load.spritesheet('player', 'assets/sprites/player.png', {
      frameWidth: 16,
      frameHeight: 16
    });
  }

  create() {
    const map = this.make.tilemap({ key: 'nivel3' });

    const tilesets = [
      map.addTilesetImage('cracked_tiles', 'cracked_tiles'),
      map.addTilesetImage('cracked_tiles_floor', 'cracked_tiles_floor'),
      map.addTilesetImage('walls_floor', 'walls_floor'),
      map.addTilesetImage('Water_coasts_animation', 'Water_coasts_animation'),
      map.addTilesetImage('Water_detilazation', 'Water_detilazation'),
      map.addTilesetImage('Water_coasts_animation_decorative_cracks', 'Water_coasts_animation_decorative_cracks'),
      map.addTilesetImage('fire_animation', 'fire_animation'),
      map.addTilesetImage('fire_animation2', 'fire_animation2'),
      map.addTilesetImage('doors_lever_chest_animation', 'doors_lever_chest_animation'),
      map.addTilesetImage('Objects', 'Objects'),
      map.addTilesetImage('trap_animation', 'trap_animation')
    ];

    // Criar layers (exemplo com 2 principais, podes adicionar mais)
    map.createLayer('Floor', tilesets);
    const wallLayer = map.createLayer('Walls', tilesets);
    wallLayer.setCollisionByProperty({ collides: true });

    // Criar jogador no PlayerSpawn
    const objects = map.getObjectLayer('logic_objects').objects;
    const spawn = objects.find(obj => obj.name === 'PlayerSpawn');
    this.player = this.physics.add.sprite(spawn.x + 8, spawn.y + 8, 'player');

    // Portais
    this.portals = {};
    objects.filter(o => o.type === 'portal').forEach(obj => {
      const target = obj.properties.find(p => p.name === 'target')?.value;
      this.portals[obj.name] = { x: obj.x, y: obj.y, target };

      const zone = this.add.zone(obj.x + 8, obj.y + 8, 16, 16);
      this.physics.world.enable(zone);
      this.physics.add.overlap(this.player, zone, () => {
        const destName = `Portal${this.portals[obj.name].target}`;
        const dest = this.portals[destName];
        if (dest) {
          this.player.setPosition(dest.x + 8, dest.y + 8);
        }
      }, null, this);
    });

    // Verificar portal final
    const finalPortal = objects.find(obj => obj.name === 'PortalToNextLevel');
    if (finalPortal) {
      const endZone = this.add.zone(finalPortal.x + 8, finalPortal.y + 8, 16, 16);
      this.physics.world.enable(endZone);
      this.physics.add.overlap(this.player, endZone, () => {
        this.scene.start('victory');
      });
    }

    // Colisão
    this.physics.add.collider(this.player, wallLayer);

    // Limites da câmara e mundo
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Controlo do teclado
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    const speed = 110;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
    }
  }
}
