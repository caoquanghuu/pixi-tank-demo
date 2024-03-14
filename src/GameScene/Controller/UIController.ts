
import { Sprite } from '@pixi/sprite';
import { AssetsLoader } from '../../AssetsLoader';
import { Text } from '@pixi/text';
import { Point } from '@pixi/core';
import { CreateNewGameFn, DestroyFn, DisplayScoreFn, StartPlayGameFn } from '../type';
import { AppConstants } from '../Constants';
import Emitter from '../util';


export class UIController {
    private _startPlayGameCall: StartPlayGameFn;
    private _destroyCall: DestroyFn;
    private _createNewGameCall: CreateNewGameFn;
    private _displayScoreCall: DisplayScoreFn;


    constructor(startPlayGameCallBack: StartPlayGameFn, destroyCallBack: DestroyFn, createNewGameCallBack: CreateNewGameFn, displayScoreCallBack: DisplayScoreFn) {
        this._startPlayGameCall = startPlayGameCallBack;
        this._destroyCall = destroyCallBack;
        this._createNewGameCall = createNewGameCallBack;
        this._displayScoreCall = displayScoreCallBack;
    }
    /**
     * method to display main menu game
     */
    public displayMainMenuGame() {
        // create a main game back ground
        const mainBg = new Sprite(AssetsLoader.getTexture('main-back-ground'));
        mainBg.width = AppConstants.screenWidth;
        mainBg.height = AppConstants.screenHeight;

        const title = new Sprite(AssetsLoader.getTexture('title'));
        title.anchor.set(0.5);

        // create a text for start button
        const textStart = new Text('start', {
            fontSize: AppConstants.fontSizeOfStartButton,
            fill: AppConstants.colorOfStartButton,
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
        btnSprite.on('pointertap', this._startPlayGameCall.bind(this));

        // set title and button in side main bg
        mainBg.addChild(title, btnSprite);
        title.position = AppConstants.mainMenuTitlePosition;

        btnSprite.position = AppConstants.mainMenuButtonPosition;

        Emitter.emit('add-to-scene', mainBg);

        // play game music
        // sound.play('main-menu-music', { volume: AppConstants.volumeMainMenuMusic, loop: true });
    }

    public displayGameOver() {
        // create a bg for display option when end game

        // game over back ground
        const overBg = new Sprite(AssetsLoader.getTexture('main-back-ground'));
        overBg.width = AppConstants.screenWidth;
        overBg.height = AppConstants.screenHeight;

        // create text content which will be display on game over bg
        const textGameOver = new Text('Game Over', {
            fontSize: AppConstants.fontSizeOfGameOverText,
            fill: AppConstants.colorOfGameOverText,
            align: 'center'
        });
        textGameOver.anchor.set(0.5);

        const textYourScore = new Text('your score:', {
            fontSize: AppConstants.fontSizeOfYourScoreText,
            fill: AppConstants.colorOfYourScoreText
        });
        textYourScore.anchor.set(0.5);

        // create a sprite which will be like a button
        const btnReplay = new Sprite(AssetsLoader.getTexture('button-sprite'));
        btnReplay.anchor.set(0.5);

        const textReplay = new Text('replay', {
            fontSize: AppConstants.fontSizeOfReplayText,
            fill: AppConstants.colorOfReplayText
        });
        textReplay.anchor.set(0.5);

        btnReplay.addChild(textReplay);

        // when player tap start game will start
        btnReplay.eventMode = 'static';
        btnReplay.cursor = 'pointer';

        // player tap on start button to start play game
        btnReplay.on('pointertap', () => {
            this._destroyCall();
            this._createNewGameCall();
            // this.displayMainMenuGame();
        });

        // add there text to game over back ground and set position for it
        overBg.addChild(textGameOver, textYourScore, btnReplay);
        textGameOver.position = AppConstants.textGameOverPosition;

        textYourScore.position = AppConstants.textYourScorePosition;

        btnReplay.position = AppConstants.buttonReplayPosition;

        // add bg game to game scene
        Emitter.emit('add-to-scene', overBg);

        // display score at position
        const positionDisplayScore = new Point(400, 340);
        this._displayScoreCall(positionDisplayScore);
    }

}