import { BaseObject } from '../Objects/BaseObject';
import { AddToSceneFn, CreateNewRandomPositionFn, RemoveFromSceneFn } from '../type';
import { Point, Rectangle } from '@pixi/core';
import { getRandomBoolean } from '../util';

export class EnvironmentController {

    // list of environment objects which will be create on map
    private _environmentObjects: BaseObject[] = [];
    private _rewardObjects: BaseObject[] = [];
    private _bunker: BaseObject;
    private _addToSceneCall: AddToSceneFn;
    private _createNewRandomPositionCall: CreateNewRandomPositionFn;
    private _removeFromSceneCall: RemoveFromSceneFn;

    constructor(addToSceneCallBack: AddToSceneFn, createNewRandomPositionCallBack: CreateNewRandomPositionFn, removeFromSceneCallBack: RemoveFromSceneFn) {

        this._addToSceneCall = addToSceneCallBack;
        this._removeFromSceneCall = removeFromSceneCallBack;
        this._createNewRandomPositionCall = createNewRandomPositionCallBack;

        // create a bunker
        this._bunker = new BaseObject('base-bunker');
        const position = new Point(400, 580);
        this._bunker.position = position;
        this._bunker.setImageSize({ w: 50, h: 50 });
        this._addToSceneCall(this._bunker.sprite);
        this._bunker.size = { w: 50, h: 50 };

        // create rock around bunker
        const pos1 = new Point(370, 600);
        const pos2 = new Point(430, 600);
        const pos3 = new Point(381, 560);
        for (let i = 0; i < 6; i++) {
            this.createEnvironmentObject('rock', pos1);
            this.createEnvironmentObject('rock', pos2);
            this.createEnvironmentObject('rock', pos3);
            pos1.y -= 7.5;
            pos2.y -= 7.5;
            pos3.x += 7.5;
        }

        // create environment object with define from begin*/
        for (let i = 0; i < 30; i++) {
            this.createEnvironmentObject('tree-1');
            this.createEnvironmentObject('tree-2');
            this.createEnvironmentObject('rock');
        }
    }

    /**
     * create environment object to map
     * @param name name of object want create base on asset
     * @param position set position for object if require
     */
    private createEnvironmentObject(name: string, position?: Point) {

        // use name to get image from asset
        const object = new BaseObject(name);

        // add sprite to game scene
        this._addToSceneCall(object.sprite);

        // set size */
        object.setImageSize({ w: 15, h: 15 });

        // set size property
        object.size = { w: 15, h: 15 };

        // set position if para is define
        if (!position) {
            // create a rectangle and check that position is available */
            object.rectangle = this._createNewRandomPositionCall(object.size);

            // create new position based on rectangle
            const newPosition = new Point(object.rectangle.x, object.rectangle.y);

            // set position for object
            object.position = newPosition;
        } else {
            object.position = position;
            const rectangle = new Rectangle(position.x, position.y);
            object.rectangle = rectangle;
        }

        // push it to this.environmentObject array
        this._environmentObjects.push(object);
    }

    private createRewardRandomly(position: Point) {

        // get a random number
        const randomBoolean = getRandomBoolean(10);

        // if random number === 1
        if (randomBoolean) {

            // create new object is hp bag
            const rewardObject = new BaseObject('medical-bag');

            // set position of it where it be call
            rewardObject.position = position;

            // set size
            rewardObject.setImageSize({ w: 20, h: 20 });

            rewardObject.size = { w: 20, h : 20 };

            // add hp bag to game scene
            this._addToSceneCall(rewardObject.sprite);

            // push mid hp bag to list
            this._rewardObjects.push(rewardObject);
        }
    }

    public removeEnvironmentObject(environment: BaseObject) {

        this.removeObject(environment, this._environmentObjects);

        const position: Point = environment.position;

        // create reward randomly
        this.createRewardRandomly(position);
    }

    public removeObject(object: BaseObject, objectList: BaseObject[]) {
        this._removeFromSceneCall(object.sprite);

        const p = objectList.findIndex(objects => objects === object);
        objectList.splice(p, 1);
    }

    get rewardObjects(): BaseObject[] {
        return this._rewardObjects;
    }

    // method for collision controller can access to get position of environment objects*/
    get environmentObjects(): BaseObject[] {
        return this._environmentObjects;
    }

    get bunker(): BaseObject {
        return this._bunker;
    }

}