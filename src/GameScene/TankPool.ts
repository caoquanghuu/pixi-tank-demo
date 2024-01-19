import { TankController } from "./Controller/TankController";
import { Tank } from "./Objects/Tank";

export class TankPool {
    private static instance: TankPool;
    /**a variable to limit bot tank pool */
    private _maxTanks: number = 20;
    /**a array to contain bot tank */
    private _tanksPool: Tank[] = [];

    /**
     * constructor tank pool base on number of tank
     */
    constructor(fireBulletCallBack: Function) {
        /**a loop to create tank and add it to tank pool */
        for (let i = 0; i < this._maxTanks; i++) {
            const tank = new Tank(false, fireBulletCallBack);
            this._tanksPool.push(tank);
        }
    }

    public static getInstance(fireBulletCallBack: Function): TankPool {
        if (!TankPool.instance) {
            TankPool.instance = new TankPool(fireBulletCallBack);
        }
        return TankPool.instance;
    }

    public releaseTank() {
        /** get tank from tank pool and return that tank */
        const tank = this._tanksPool.pop();
        // return tank;
        return tank;

    }

    public getTank(tank: Tank) {
        /** get tank die from tank controller */
        /** return tank to tank pool when tank die */
        this._tanksPool.push(tank);
    }
}