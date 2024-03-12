
import { Sprite } from '@pixi/sprite';
import { AssetsLoader } from '../../AssetsLoader';
import { Text } from '@pixi/text';
import { Point } from '@pixi/core';
import Emitter from '../util';

export class UIController {

    constructor() {
        Emitter.on('display-game-over', () => {
            this.displayGameOver();
        });
    }

    /**
     * method to display main menu game
     */
    public displayMainMenuGame() {
        // define event emitter

        // create a main game back ground
        const mainBg = new Sprite(AssetsLoader.getTexture('main-back-ground'));
        mainBg.width = 800;
        mainBg.height = 600;

        const title = new Sprite(AssetsLoader.getTexture('title'));
        title.anchor.set(0.5);

        // create a text for start button
        const textStart = new Text('start', {
            fontSize: 14,
            fill: 0xff1010,
            align: 'center'
        });
        textStart.anchor.set(0.5);

        // create a sprite which will be like a button
        const btnSprite = new Sprite(AssetsLoader.getTexture('button-sprite'));
        btnSprite.anchor.set(0.5);

        // add text to sprite
        btnSprite.addChild(textStart);

        // when player tap start game will start
        btnSprite.eventMode = 'static';
        btnSprite.cursor = 'pointer';

        // player tap on start button to start play game
        btnSprite.on('pointertap', () => { Emitter.emit('start-play-game', null); });

        // set title and button in side main bg
        mainBg.addChild(title, btnSprite);
        title.position.x = 180;
        title.position.y = 60;

        btnSprite.position.x = 180;
        btnSprite.position.y = 180;

        // this._addToSceneCall(mainBg);
        Emitter.emit('add-to-scene', mainBg);

        // play game music
        // sound.play('main-menu-music', { volume: 0.5, loop: true });
    }

    public displayGameOver() {
        // create a bg for display option when end game

        // game over back ground
        const overBg = new Sprite(AssetsLoader.getTexture('main-back-ground'));
        overBg.width = 800;
        overBg.height = 600;

        // create text content which will be display on game over bg
        const textGameOver = new Text('Game Over', {
            fontSize: 24,
            fill: 0xff1010,
            align: 'center'
        });
        textGameOver.anchor.set(0.5);

        const textYourScore = new Text('your score:', {
            fontSize: 14,
            fill: 0xff1010
        });
        textYourScore.anchor.set(0.5);

        // create a sprite which will be like a button
        const btnReplay = new Sprite(AssetsLoader.getTexture('button-sprite'));
        btnReplay.anchor.set(0.5);

        const textReplay = new Text('replay', {
            fontSize: 11,
            fill: 0xff1010
        });
        textReplay.anchor.set(0.5);

        btnReplay.addChild(textReplay);

        // when player tap start game will start
        btnReplay.eventMode = 'static';
        btnReplay.cursor = 'pointer';

        // player tap on start button to start play game
        btnReplay.on('pointertap', () => {
            Emitter.emit('destroy', null);
            // this._destroyCall();
            Emitter.emit('create-new-game', null);
            // this.displayMainMenuGame();
        });

        // add there text to game over back ground and set position for it
        overBg.addChild(textGameOver, textYourScore, btnReplay);
        textGameOver.x = 180;
        textGameOver.y = 80;

        textYourScore.x = 180;
        textYourScore.y = 110;

        btnReplay.x = 180;
        btnReplay.y = 180;

        // add bg game to game scene
        // this._addToSceneCall(overBg);
        Emitter.emit('add-to-scene', overBg);

        // display score at position
        const positionDisplayScore = new Point(400, 340);
        Emitter.emit('display-score', positionDisplayScore);
    }
}