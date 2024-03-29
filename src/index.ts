
import 'pixi-spine';

import { Application } from './pixi';
import bundles from './bundles.json';
import { AssetsLoader } from './AssetsLoader';
import { GameScene } from './GameScene/GameScene';
import '@pixi-spine/loader-3.8';
import { sound } from '@pixi/sound';
import { AppConstants } from './GameScene/Constants';
import Emitter from './GameScene/util';

class Main {

    private _gameScene: GameScene;
    private _pixiApp: Application;
    private _isUpdate: boolean = true;

    constructor() {

        // Create application
        this._pixiApp = new Application({
            width: AppConstants.screenWidth,
            height: AppConstants.screenHeight,
            backgroundColor: 0xE8EAED,
            antialias: true,
            resolution: 1
        });

        console.log(this._pixiApp);
        // @ts-ignore
        document.body.appendChild(this._pixiApp.view);

        this._pixiApp.start();

        this._init();
    }

    private async _init() {

        // load resources
        new AssetsLoader();
        await AssetsLoader.loadBundle(bundles);

        this._useEventEffect();

        // create scene
        this.createNewGame();

        // Update function
        this._pixiApp.ticker.add(this._update.bind(this));

        sound.add(AppConstants.soundCfg.mainMusic, 'sound/main-menu-music.mp3');

        // add sound collect reward effect
        sound.add(AppConstants.soundCfg.collectReward, 'sound/collect-reward-sound.mp3');

        // set moving sound
        sound.add(AppConstants.soundCfg.tankMoving, 'sound/tank-moving.mp3');

        // add fire sound
        sound.add(AppConstants.soundCfg.fire, 'sound/bullet-fire.mp3');

        // add explosion sound
        sound.add(AppConstants.soundCfg.explosion, 'sound/explosion.mp3');
    }

    private _useEventEffect() {
        Emitter.on(AppConstants.eventEmitter.stopUpdate, () => {
            this._isUpdate = false;
        });
        Emitter.on(AppConstants.eventEmitter.startUpDate, () => {
            this._isUpdate = true;
        });
    }

    private createNewGame() {
        this._gameScene = new GameScene();
        this._gameScene.init();
        this._pixiApp.stage.eventMode = 'static';

        // Add scene to render stage
        this._pixiApp.stage.addChild(this._gameScene);
    }

    private _update(deltaTime: number) {

        const dt = deltaTime / 60 * 1000;

        if (this._isUpdate) {
            this._gameScene.update(dt);
        }
    }
}


window.onload = () => {
    new Main();
};