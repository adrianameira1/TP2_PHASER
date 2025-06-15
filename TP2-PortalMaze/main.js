import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import LevelIntroScene from './scenes/LevelIntroScene.js'; //  novo
import GameScene from './scenes/GameScene.js';
import EndScene from './scenes/EndScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [BootScene, MenuScene, LevelIntroScene, GameScene, EndScene]
};

const game = new Phaser.Game(config);
