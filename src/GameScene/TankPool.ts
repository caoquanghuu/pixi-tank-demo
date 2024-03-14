
import { Tank } from './Objects/Tank';
import { AddToSceneFn, FireBulletFn, TankDieFn } from './type';

export class TankPool {
    private static instance: TankPool;

    // a variable to limit bot tank pool
    private _maxTanks: number = 20;

    // a array to contain bot tank
    private _tanksPool: Tank[] = [];
    private _fireBulletCallBack: FireBulletFn;
    private _tankDieCall: TankDieFn;
    private _addToSceneCall: AddToSceneFn;

    /**
     * constructor tank pool base on number of tank
     */
    constructor(fireBulletCallBack: FireBulletFn, tankDieCallBack: TankDieFn, addToSceneCallBack: AddToSceneFn) {
        this._fireBulletCallBack = fireBulletCallBack;
        this._tankDieCall = tankDieCallBack;
        this._addToSceneCall = addToSceneCallBack;

        // a loop to create tank and add it to tank pool
        for (let i = 0; i < this._maxTanks; i++) {
            const tank = new Tank(false, this._fireBulletCallBack, this._tankDieCall, this._addToSceneCall);
            this._tanksPool.push(tank);
        }
    }

    // public static getInstance(fireBulletCallBack: FireBulletFn, tankDieCallBack: TankDieFn, addToSceneCallBack: AddToSceneFn): TankPool {
    //     if (!TankPool.instance) {
    //         TankPool.instance = new TankPool(fireBulletCallBack, tankDieCallBack, addToSceneCallBack);
    //     }
    //     return TankPool.instance;
    // }

    public releaseTank(): Tank {

        // get tank from tank pool and return that tank
        const tank = this._tanksPool.pop();

        // return tank;
        return tank;
    }

    public getTank(tank: Tank) {

        // get tank die from tank controller
        // return tank to tank pool when tank die
        this._tanksPool.push(tank);
    }

    get tankPool(): Tank[] {
        return this._tanksPool;
    }
}
