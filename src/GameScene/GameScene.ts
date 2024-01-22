import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { AssetsLoader } from '../AssetsLoader';
import { TankController } from './Controller/TankController';
import { BulletController } from './Controller/BulletController';
import { EnvironmentController } from './Controller/EnvironmentController';
import { Direction } from './type';
import { Point } from '@pixi/core';

export class GameScene extends Container {
    private _playerScore: number;
    private _tankController: TankController;
    private _bulletController: BulletController;
    private _environmentController: EnvironmentController;
    constructor() {
        super();
        /**constructor controller */
        this._bulletController = new BulletController(this.addToScene.bind(this), this.removeFromScene.bind(this));
        this._tankController = new TankController(this.addToScene.bind(this), this.createBulletCall.bind(this));
        this._environmentController = new EnvironmentController();
    }

    /**
     * function to send request to bullet controller create a bullet
     * @param position position start of bullet which get from tank
     * @param direction direction of bullet which get from tank last direction
     * @param isPlayerBullet this bullet is player bullet or bot bullet
     */
    public createBulletCall(position: Point, direction: Direction, isPlayerBullet: boolean) {
        this._bulletController.createBullet(position, direction, isPlayerBullet);
    }

    public init() {
        console.log('GameScene init');


        const img = new Sprite(AssetsLoader.getTexture('tank'));

        // this.addChild(img);

        img.position.set(100, 100);
    }

    private addToScene(sprite: Sprite) {
        this.addChild(sprite);
    }

    private removeFromScene(sprite : Sprite) {
        this.removeChild(sprite);
    }

    private time = 0;
    public update(deltaTime: number) {
        this.time += deltaTime;
        if (this.time > 1000) {
            this.time -= 1000;
            console.log('GameScene update');
        }
        this._tankController.update(deltaTime);
        this._bulletController.update(deltaTime);
    }

    public destroy() {
        console.log('GameScene destroy');
    }
}