import { Point } from '@pixi/core';
import { BaseObject } from './BaseObject';
import { AppConstants } from '../Constants';
import Emitter from '../util';

export class HPBar extends BaseObject {
    private _isPlayer: boolean;
    private _HP: number;

    constructor(isPlayer: boolean) {
        super(isPlayer ? 'player-hp' : 'bot-hp');

        Emitter.emit('add-to-scene', this.sprite);

        this._isPlayer = isPlayer;
    }

    get HP(): number {
        return this._HP;
    }

    set HP(hp: number) {
        this._HP = hp;
    }

    private changeHPSpriteFollowHP() {

        const hpTexture: string[] = ['1-hp', '2-hp', '3-hp', '4-hp', 'player-hp'];

        this.sprite = hpTexture[this._HP - 1];
    }

    public update(position: Point) {
        const newPosition = new Point(position.x, position.y - AppConstants.distanceOfHpBarAndTank);
        this.position = newPosition;
        this.changeHPSpriteFollowHP();
    }
}