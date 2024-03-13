// Tank class
import { Point } from '@pixi/core';
import { RandomEngine } from '../Engine/RandomEngine';
import { BaseObject } from './BaseObject';
import { Direction } from '../type';
import { ControlEngine } from '../Engine/ControlEngine';
import Emitter, { getRandomArbitrary, keyboard } from '../util';
import { HPBar } from './HPBar';
import { sound } from '@pixi/sound';
import { AppConstants } from '../constants';

export class Tank extends BaseObject {

    // this tank is player or bot
    private _isPlayerTank: boolean;

    // hp of this tank
    private _HPBar: HPBar;

    private _fireBulletTime: number;

    constructor(isPlayer: boolean) {
        // set image of tank is player tank or bot tank
        super('tank-stand-up');

        // set speed of tank
        this.speed = 100;

        // set last direction of tank
        this.lastDirection = Direction.UP;

        // set size of tank
        this.size = AppConstants.tankSpriteSize;

        this._isPlayerTank = isPlayer;

        this._HPBar = new HPBar(isPlayer);

        // set move engine and type trigger fire bullet for tank base on is player or not
        if (isPlayer) {

            //set control move
            this.moveEngine = new ControlEngine();

            // set hp
            this._HPBar.HP = AppConstants.maxHpOfPlayerTank;

            // set control fire key event by space keyboard
            const fire = keyboard(' ');
            fire.press = () => {
                this.fire(this.position, this.lastDirection, true);
            };
        } else {

            // set random move
            this.moveEngine = new RandomEngine();

            //set hp
            this._HPBar.HP = AppConstants.maxHpOfAiTank;

            //change color for bot tank
            this.sprite.tint = AppConstants.colorOfAiTank;

            // set time for fire bullet
            this._fireBulletTime = AppConstants.timeFireBulletOfAiTank;
        }
    }

    /**
     * tank start to fire bullet
     */
    public fire(position: Point, direction: Direction, isPlayer: boolean) {

        // call fire bullet to tank controller
        // this._fireBulletCallBack(position, direction, isPlayer);
        Emitter.emit('fire-bullet', { position, direction, isPlayer });
    }

    /**
     *  tank hp reduce to 0 and tank will be destroy
     */
    public destroy() {
        if (this.HPBar.HP === 0) {
            // call tank die to tank controller
            Emitter.emit('tank-die', this);
        }
    }

    private playTankMovingSound(direction: Direction) {
        // check sound only for player tank
        if (!this.isPlayerTank) return;

        // when tank moving
        if (direction != Direction.STAND) {

            // check sound is playing or not
            const movingSound = sound.find('tank-moving-sound');

            if (!movingSound.isPlaying) {

                // if sound not playing then play
                sound.play('tank-moving-sound', { volume: AppConstants.volumeOfTankMoving, loop: true });
            }
        } else {
            // stop playing moving sound when tank stop
            sound.stop('tank-moving-sound');
        }

    }

    /**
     * change texture and size of tank when direction of tank change
     * @param direction new direction changed
     */
    private changeTextureFollowDirection(direction: Direction) {
        const tankMoveTextures: string[] = ['tank-move-up', 'tank-move-down', 'tank-move-left', 'tank-move-right'];
        const tankStandTextures: string[] = ['tank-stand-up', 'tank-stand-down', 'tank-stand-left', 'tank-stand-right'];

        // change texture when tank move
        this.sprite = tankMoveTextures[direction - 1];

        // when tank stop move:
        if (direction === Direction.STAND) {
            this.sprite = tankStandTextures[this.lastDirection - 1];
        }
    }

    /**
     * Update tank
     * @param dt delta time from ticker
     */
    update(dt: number): void {

        // move
        this.move(dt, false);

        // check hp tank and destroy it if hp = 0
        this.destroy();

        // update new direction for random move
        this.moveEngine.update(dt);

        // update this HP
        this._HPBar.update(this.position);

        // change texture when direction of tank change
        this.changeTextureFollowDirection(this.direction);

        // // play tank moving sound
        this.playTankMovingSound(this.direction);

        // set fire bullet call for bot tank
        if (!this._isPlayerTank) {
            this._fireBulletTime -= dt;
            if (this._fireBulletTime <= 0) {
                this.fire(this.position, this.lastDirection, false);
                this._fireBulletTime = getRandomArbitrary(3000, 5000);
            }
        }
    }

    get HPBar(): HPBar {
        return this._HPBar;
    }

    get HP(): number {
        return this._HPBar.HP;
    }

    get direction(): Direction {
        return this._moveEngine.direction;
    }

    get isPlayerTank(): boolean {
        return this._isPlayerTank;
    }

    get fireBulletTime(): number {
        return this._fireBulletTime;
    }

    set fireBulletTime(time: number) {
        this._fireBulletTime = time;
    }

    set HP(hp: number) {
        this._HPBar.HP = hp;
    }

    set direction(direction: Direction) {
        this._moveEngine.direction = direction;
    }
}