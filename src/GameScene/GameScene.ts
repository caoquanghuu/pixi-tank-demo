import 'pixi-spine';
import '@pixi-spine/loader-3.8';
import { Container, DisplayObject } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { AssetsLoader } from '../AssetsLoader';
import { TankController } from './Controller/TankController';
import { BulletController } from './Controller/BulletController';
import { EnvironmentController } from './Controller/EnvironmentController';
import { Size } from './type';
import { Point, Rectangle } from '@pixi/core';
import { CollisionController } from './Controller/CollisionController';
import { SpineObject } from './Objects/SpineObject';
import { UIController } from './Controller/UIController';
import Emitter from './util';
// import { Color } from '@pixi/core';
// Color.shared.setValue(0xffffff).toHex(); // '#ffffff'


export class GameScene extends Container {
    private _time = 0;
    private _playerScore: number = 0;
    private _scoreSpriteArray: Sprite[];
    private _tankController: TankController;
    private _bulletController: BulletController;
    private _environmentController: EnvironmentController;
    private _collisionController: CollisionController;
    private _UIController: UIController;

    constructor() {
        super();

        this._useEventEffect();

        // create class ui controller
        this._UIController = new UIController();

        // display main menu
        this._UIController.displayMainMenuGame();

        // test spine object
        const spine = new SpineObject();
        spine.loadBundle('assets/units/spine2d/spine-boy/spine-boy-pro.json').then(() => {
            spine.setAnimation({ trackIndex:0, animationName: 'idle', loop: true });
            spine.addAnimation({ trackIndex:0, animationName: 'aim', loop: false, delay:0.5 });
            spine.addAnimation({ trackIndex:1, animationName: 'shoot', loop: false, delay:0.75 });
            spine.addAnimation({ trackIndex:0, animationName: 'walk', loop: true, delay:1.1 });
            spine.addAnimation({ trackIndex:0, animationName: 'run', loop: true, delay:1.5 });
            spine.addAnimation({ trackIndex:0, animationName: 'idle', loop: true, delay:1.65 });
            spine.addAnimation({ trackIndex:1, animationName: 'shoot', loop: false, delay:4.5 });
            spine.spine.scale = { x:-0.2, y:0.2 };
            const position = new Point(400, 400);
            spine.position = position;
            this.addToScene(spine.spine);
        }
        );
    }

    public setNewScore(newScore: number) {
        this._playerScore += newScore;

        // call display score on changed score
        const positionDisplayScore = new Point(760, 10);
        this.displayScore(positionDisplayScore);
    }

    private _useEventEffect() {
        Emitter.on('add-to-scene', (sprite: Sprite) => {
            this.addToScene(sprite);
        });
        Emitter.on('remove-from-scene', (sprite: Sprite) => {
            this.removeFromScene(sprite);
        });
        Emitter.on('start-play-game', () => {
            this.startPlayGame();
        });
        Emitter.on('destroy', () => {
            this.destroy();
        });
        Emitter.on('display-score', (position: Point) => {
            this.displayScore(position);
        });
        Emitter.on('plus-score', (newScore: number) => {
            this.setNewScore(newScore);
        });
    }


    /**
     * method to call start the game
     */
    public startPlayGame() {

        // set a back ground of game
        const bg = new Sprite(AssetsLoader.getTexture('game-back-ground'));
        this.addToScene(bg);
        bg.width = 800;
        bg.height = 600;

        // set position where will display score
        const positionDisplayScore = new Point(760, 10);

        // display score
        this.displayScore(positionDisplayScore);

        // constructor controllers
        this._collisionController = new CollisionController();

        this._bulletController = new BulletController();

        this._tankController = new TankController(this.createNewRandomPositionCall.bind(this));

        this._environmentController = new EnvironmentController(this.createNewRandomPositionCall.bind(this));

    }

    /**
     * method for display score of player
     * @param positionDisplay position which score will be display
     */
    public displayScore(positionDisplay: Point) {

        // remove old sprite of score if have
        if (this._scoreSpriteArray) {
            this._scoreSpriteArray.forEach(sprite => {
                this.removeFromScene(sprite);
            });
        }

        // convert this score to array contain element
        const scoreArray: string[] = `${this._playerScore}`.split('').reverse();

        // create a start position
        const position = positionDisplay;

        // which each element will be convert to a sprite display number of that element
        const scoreSpriteArray: Sprite[] = scoreArray.map(score => {

            // get sprite match with number element
            const scoreSprite = new Sprite(AssetsLoader.getTexture(`score-number-${score}`));

            scoreSprite.width = 30;
            scoreSprite.height = 30;

            this.addToScene(scoreSprite);

            scoreSprite.position.set(position.x, position.y);

            position.x -= 17;

            return scoreSprite;
        });

        // add new score array sprite
        this._scoreSpriteArray = scoreSpriteArray;
    }

    public update(deltaTime: number) {
        this._time += deltaTime;
        if (this._time > 1000) {
            this._time -= 1000;
            console.log('GameScene update');
        }

        if (this._tankController && this._bulletController && this._collisionController) {
            this._tankController.update(deltaTime);
            this._bulletController.update(deltaTime);
            this._collisionController.update();
        }
    }

    public createNewRandomPositionCall(size: Size): Rectangle {
        return this._collisionController.createNewRandomPosition(size);
    }

    private addToScene(displayObject: DisplayObject) {
        this.addChild(displayObject);
    }

    private removeFromScene(sprite: Sprite) {
        this.removeChild(sprite);
    }

    public async init() {
        console.log('GameScene init');
    }
}