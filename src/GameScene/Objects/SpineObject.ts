import 'pixi-spine';
import '@pixi-spine/loader-3.8';
import { ISkeletonData, Spine } from 'pixi-spine';
import { BaseObject } from './BaseObject';
import { IPointData, Assets } from '../../pixi';
import { AddAnimationOption, AnimationOption } from '../type';
import Emitter from '../util';
import { AppConstants } from '../Constants';

export class SpineObject extends BaseObject {
    private _url: string;
    private _spineData: ISkeletonData;
    protected _spine: Spine;
    private _animationName: string;
    private _animationSpeed: number;

    constructor() {
        super();

        // set speed for spine
        this._animationSpeed = AppConstants.spineAnimationSpeed;

    }

    /** method to get current animation name */
    get animationName(): string {
        return this._animationName;
    }

    get spine(): Spine {
        return this._spine;
    }

    /** method to set position of spine which override on base object set position */
    override set position(position: IPointData) {
        this._spine.position.x = position.x;
        this._spine.position.y = position.y;
    }

    /** method to return position of spine */
    override get position(): IPointData {
        const position = this._spine.position;
        return position;
    }

    override show() {
        Emitter.emit(AppConstants.eventEmitter.addToScene, this.spine);
    }

    override remove() {
        Emitter.emit(AppConstants.eventEmitter.removeFromScene, this.spine);
    }

    /**
     * method to set animation for spine with option
     * @param option option for set animation
     * @param option.trackIndex the id of animation
     * @param option.animationName the name of animation define at json file
     * @param option.loop set true to animation repeat
     */
    public setAnimation(option: AnimationOption) {
        this._spine.state.setAnimation(option.trackIndex, option.animationName, option.loop);

        // for define current animation on change
        this._animationName = option.animationName;
    }

    /**
     * method to add animation after set animation to change animation with time delay to show the animation
     * @param option option same with setAnimation but have delay time
     * @param option.delay time to delay change animation
     */
    public addAnimation(option: AddAnimationOption) {
        this._spine.state.addAnimation(option.trackIndex, option.animationName, option.loop, option.delay);
    }

    /**
     * method to remove animation follow track index
     * @param trackIndex id of animation want to remove
     */
    public removeTrack(trackIndex: number) {
        this._spine.state.clearTrack(trackIndex);
    }

    /**
     * method to flip image
     * @param isFlip set true to the face of character turn left, false to turn right
     */
    public set flip(flip: boolean) {
        this._spine.scale.x = (flip ? - 1 : 1) * Math.abs(this._spine.scale.x);
    }

    /**
     * method to load src of spine
     * @param url link where json file be placed
     */
    public async loadBundle(url: string) {
        await Assets.load(url).then((resource) => {
            this._url = url;

            this._spineData = resource.spineData;

            this._spine = new Spine(this._spineData);

            this._spine.autoUpdate = true;

            this._spine.state.timeScale = this._animationSpeed;
        });
    }
}