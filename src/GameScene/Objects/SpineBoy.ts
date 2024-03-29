import { IPointData } from '../../pixi';
import { SpineObject } from './SpineObject';
import { keyboard } from '../util';
import { AppConstants } from '../Constants';

export class SpineBoy extends SpineObject {

    // property to change animation follow key input
    private _left: any;
    private _right: any;
    private _up: any;
    private _down: any;
    private _keyHandler = {
        isUp : false,
        isDown : false,
        isLeft : false,
        isRight : false
    };

    constructor() {
        super();
        this.init().then(() => {
            this.changeAnimation();
        });
    }

    /**
     * method to load bundle of src
     */
    private async init() {
        await this.loadBundle('assets/units/spine2d/spine-boy/spine-boy-pro.json').then(() => {
            this._spine.scale = AppConstants.scaleOfSpineBoy;
        });
    }

    /**
     * method to change animation base on input key
     */
    private changeAnimation() {
        this._left = keyboard(AppConstants.keyboardEvent.moveLeft),
        this._up = keyboard(AppConstants.keyboardEvent.moveUp),
        this._right = keyboard(AppConstants.keyboardEvent.moveRight),
        this._down = keyboard(AppConstants.keyboardEvent.moveDown);

        this._left.press = () => {
            this.setAnimation({ trackIndex:1, animationName: AppConstants.animationName.run, loop: true });
            this.flip = true;
            this._keyHandler.isLeft = true;
        };
        this._left.release = () => {
            this._keyHandler.isLeft = false;
        };
        this._right.press = () => {
            this.setAnimation({ trackIndex:1, animationName: AppConstants.animationName.run, loop: true });
            this.flip = false;
            this._keyHandler.isRight = true;
        };
        this._right.release = () => {
            this._keyHandler.isRight = false;
        };
        this._up.press = () => {
            this.setAnimation({ trackIndex:1, animationName: AppConstants.animationName.hoverBoard, loop: true });
            this._keyHandler.isUp = true;
        };
        this._up.release = () => {
            this._keyHandler.isUp = false;
        };
        this._down.press = () => {
            this.setAnimation({ trackIndex:1, animationName: AppConstants.animationName.hoverBoard, loop: true });
            this._keyHandler.isDown = true;
        };
        this._down.release = () => {
            this._keyHandler.isDown = false;
        };
    }

    /**
     * method for update spine boy
     * @param position cause testing then the position of spine now be getting by player tank position
     */
    public update(position: IPointData) {
        // spine boy have position of player tank
        this.position = position;

        // spine boy have idle animation when tank stop
        if (this._keyHandler.isUp === false && this._keyHandler.isDown === false && this._keyHandler.isLeft === false && this._keyHandler.isRight === false) {
            // check current animation is idle or not
            if (this.animationName === AppConstants.animationName.idle) return;

            // set back animation idle for spine boy when stop moving
            this.setAnimation({ trackIndex:1, animationName: AppConstants.animationName.idle, loop: true });
        }
    }
}