import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import LevelIntroScene from './scenes/LevelIntroScene.js';
import GameScene from './scenes/GameScene.js';
import Level3 from './scenes/Level3.js'; 
import Victory from './scenes/Victory.js'; 
import EndScene from './scenes/EndScene.js';
import DeathScene from './scenes/DeathScene.js'; // ✅

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
    scene: [
        BootScene,
        MenuScene,
        LevelIntroScene,
        GameScene,
        Level3,
        Victory,
        EndScene,
        DeathScene 
    ]
};

const game = new Phaser.Game(config);
