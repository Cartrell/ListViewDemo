// You can write more code here
import ComponentEvents from '../ComponentEvents';
import ITexturePropertyType from '../ITexturePropertyType';
import BaseButtonComponent from './BaseButtonComponent';
import ButtonComponentEvents from './ButtonComponentEvents';

// ==============================================================================================
// interfaces and types
// ==============================================================================================
type ButtonComponentTextureImage = Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;

/* eslint-disable */

/* START OF COMPILED CODE */

class ButtonComponent extends BaseButtonComponent {
  
  constructor(gameObject: Phaser.GameObjects.GameObject) {
    super(gameObject);
    
    gameObject["__ButtonComponent"] = this;
    
    this.gameObject = gameObject;
    this.normFrame;
    this.overFrame;
    this.downFrame;
    this.callback;
    this.context = this.scene;
    this.eventName = "";
    this.disabledFrame;
    this.defaultEnabled = true;
    this.pressedSoundKey = "";
    this.downSoundKey = "";
    
    /* START-USER-CTR-CODE */
    // Write your code here.
    
    /* eslint-enable */
    
    if (this.gameObject) {
      this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.onSceneUpdate, this);
      this.gameObject.once(Phaser.GameObjects.Events.DESTROY, this.onDestroy, this);
    } else {
      console.warn('No Phaser game object specified in ButtonComponent constructor.');
    }

    this.doublePressMaxTime = ButtonComponent.DEFAULT_DOUBLE_PRESS_MAX_TIME;
    this.doublePressSize = ButtonComponent.DEFAULT_DOUBLE_PRESS_SIZE;
    this._isDoublePressEnabled = false;

    /* eslint-disable */

    /* END-USER-CTR-CODE */
  }
  
  private gameObject: Phaser.GameObjects.GameObject;
  
  public normFrame: {key:string,frame?:string|number};
  
  public overFrame: {key:string,frame?:string|number};
  
  public downFrame: {key:string,frame?:string|number};
  
  public callback: buttonComponentCallback;
  
  public context: any;
  
  public eventName: string;
  
  public disabledFrame: {key:string,frame?:string|number};
  
  public defaultEnabled: boolean;
  
  public pressedSoundKey: string;
  
  public downSoundKey: string;
  
  static getComponent(gameObject: Phaser.GameObjects.GameObject): ButtonComponent {
    return gameObject["__ButtonComponent"];
  }
  
  /* START-USER-CODE */

  // Write your code here.

  /* eslint-enable */

  // ==============================================================================================
  // properties
  // ==============================================================================================
  static readonly WAIT_ITEM_TYPE = 'buttonComponent';

  static readonly DEFAULT_DOUBLE_PRESS_MAX_TIME = 350;

  static readonly DEFAULT_DOUBLE_PRESS_SIZE = 2;

  private static capturedButton: ButtonComponent;
  
  private static overNonCapturedButton: ButtonComponent;
  
  private inputConfig: Phaser.Types.Input.InputConfiguration;

  private doublePressTimer: Phaser.Time.TimerEvent;

  private doublePressArea: Phaser.Geom.Rectangle;

  private lastPressTime: number;
  
  private doublePressMaxTime: number;

  private doublePressSize: number;

  private lastIsVisible: boolean;

  private isHandlingDoublePress: boolean;

  private _isDown: boolean;

  private _isOver: boolean;

  private _enabled: boolean;

  private _isInit: boolean;

  private _isDoublePressEnabled: boolean;

  private wasSceneInputEnabled: boolean;

  // ==============================================================================================
  // public
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  destroy(fromGameObject = false): void {
    super.destroy(fromGameObject);

    this.resetCursorIfOverOrDown();
    this.updateAfterNonVisible();
    this.destroyDoublePressTimer();

    if (this.scene) {
      this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.onSceneUpdate, this);
      this.scene.events.off(Phaser.Scenes.Events.SLEEP, this.onSceneSleep, this);
    }
    
    if (!fromGameObject) {
      if (this.gameObject) {
        this.gameObject.off(Phaser.GameObjects.Events.DESTROY, this.onDestroy, this);
        this.gameObject.destroy();
      }
    }
    
    this.gameObject = null;
  }

  // ----------------------------------------------------------------------------------------------
  get enabled(): boolean {
    return (this._enabled);
  }

  // ----------------------------------------------------------------------------------------------
  set enabled(value: boolean) {
    this._enabled = value;
    
    if (this.gameObject && this.gameObject.input) {
      this.gameObject.input.enabled = this._enabled;
    }
    
    if (this._enabled) {
      this.updateAfterEnabled();
    } else {
      this.updateAfterDisable();
    }
  }
  
  // ----------------------------------------------------------------------------------------------
  getGameObject(): Phaser.GameObjects.GameObject {
    return (this.gameObject);
  }

  // ----------------------------------------------------------------------------------------------
  get isDoublePressEnabled(): boolean {
    return (this._isDoublePressEnabled);
  }

  // ----------------------------------------------------------------------------------------------
  set isDoublePressEnabled(value: boolean) {
    this._isDoublePressEnabled = value;
    if (!this._isDoublePressEnabled) {
      this.destroyDoublePressTimer();
    }
  }

  // ----------------------------------------------------------------------------------------------
  get isDown(): boolean {
    return (this._isDown);
  }

  // ----------------------------------------------------------------------------------------------
  get isOver(): boolean {
    return (this._isOver);
  }

  // ----------------------------------------------------------------------------------------------
  static ResolveFrame(framesOrder: ITexturePropertyType[]): ITexturePropertyType {
    let index = 0;
    for (; index < framesOrder.length - 1; index += 1) {
      const frame = framesOrder[index];
      if (frame) {
        return (frame);
      }
    }

    return (framesOrder[index]);
  }

  // ----------------------------------------------------------------------------------------------
  updateButtonImage(): void {
    const buttonImage = this.getGameObject() as ButtonComponentTextureImage;
    if (!ButtonComponent.IsTextureImage(buttonImage)) {
      return;
    }

    let textureProperty: ITexturePropertyType;

    if (!this.enabled) {
      textureProperty = ButtonComponent.ResolveFrame([this.disabledFrame, this.normFrame]);
    } else if (this._isDown) {
      if (this._isOver) {
        textureProperty = ButtonComponent.ResolveFrame([this.downFrame, this.overFrame, this.normFrame]);
      } else {
        textureProperty = this.normFrame;
      }
    } else if (this._isOver) {
      textureProperty = ButtonComponent.ResolveFrame([this.overFrame, this.normFrame]);
    } else {
      textureProperty = this.normFrame;
    }

    if (textureProperty) {
      buttonImage.setTexture(textureProperty.key, textureProperty.frame);
    }
  }

  // ----------------------------------------------------------------------------------------------
  get visible(): boolean {
    const visibleComp = this.getVisibleComponent();
    return (visibleComp && visibleComp.visible);
  }

  // ----------------------------------------------------------------------------------------------
  set visible(value: boolean) {
    const visibleComp = this.getVisibleComponent();
    if (visibleComp) {
      visibleComp.visible = value;
    }
  }

  // ==============================================================================================
  // private
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  private destroyDoublePressTimer(): void {
    if (this.doublePressTimer) {
      this.doublePressTimer.destroy();
      this.doublePressTimer = null;
    }
  }

  // ----------------------------------------------------------------------------------------------
  private doublePressAction(): void {
    this.events.emit(ButtonComponentEvents.DOUBLE_PRESS, this);
  }

  // ----------------------------------------------------------------------------------------------
  private handleInputDoublePress(localX: number, localY: number): void {
    if (this.isHandlingDoublePress) {
      this.handleInputDoublePressPhase2(localX, localY);
    } else {
      this.handleInputDoublePressPhase1(localX, localY);
    }
  }

  // ----------------------------------------------------------------------------------------------
  private handleInputDoublePressPhase1(localX: number, localY: number): void {
    this.doublePressTimer = this.scene.time.addEvent({
      delay: this.doublePressMaxTime,
      callback: this.onDoublePressTimerComplete,
      callbackScope: this,
    });

    this.lastPressTime = this.scene.game.loop.now;
    this.isHandlingDoublePress = true;
    this.doublePressArea = new Phaser.Geom.Rectangle(
      localX - this.doublePressSize / 2, 
      localY - this.doublePressSize / 2,
      this.doublePressSize,
      this.doublePressSize,
    );
    
    this.handleInputDown();
  }

  // ----------------------------------------------------------------------------------------------
  private handleInputDoublePressPhase2(localX: number, localY: number): void {
    this.isHandlingDoublePress = false;

    const timeElapsedFromLastPress = this.scene.game.loop.now - this.lastPressTime;

    if (this.doublePressArea.contains(localX, localY)
    && timeElapsedFromLastPress < this.doublePressMaxTime) {
      this.destroyDoublePressTimer();
      this.doublePressAction();
    }
  }

  // ----------------------------------------------------------------------------------------------
  private handleInputDown(): void {
    this._isDown = true;
    ButtonComponent.capturedButton = this;
    this.updateButtonImage();
    this.scene.input.once(Phaser.Input.Events.POINTER_UP, this.onScenePointerUp, this);
    this.playDownSound();
    this.events.emit(ButtonComponentEvents.POINTER_DOWN, this);
  }

  // ----------------------------------------------------------------------------------------------
  private handleInputOut(): void {
    const captured = ButtonComponent.capturedButton;
    if (captured) {
      if (captured === this) {
        this._isOver = false;
        this.updateButtonImage();
      } else {
        ButtonComponent.overNonCapturedButton = null;
      }
    } else {
      this._isOver = false;
      this.updateButtonImage();
    }

    this.events.emit(ButtonComponentEvents.POINTER_OUT, this);
  }

  // ----------------------------------------------------------------------------------------------
  private handleInputOver(): void {
    const captured = ButtonComponent.capturedButton;
    if (captured) {
      if (captured === this) {
        this._isOver = true;
        this.updateButtonImage();
      } else {
        ButtonComponent.overNonCapturedButton = this;
      }
    } else if (this.scene.input.activePointer.primaryDown) {
      ButtonComponent.overNonCapturedButton = this;
      this.scene.input.once(Phaser.Input.Events.POINTER_UP,
        this.onScenePointerUp, this);
    } else {
      this._isOver = true;
      this.updateButtonImage();
    }

    this.events.emit(ButtonComponentEvents.POINTER_OVER, this);
  }

  // ----------------------------------------------------------------------------------------------
  private handleInputUp() {
    const captured = ButtonComponent.capturedButton;
    ButtonComponent.capturedButton = null;

    if (captured === this) {
      this._isDown = false;

      this.events.emit(ButtonComponentEvents.POINTER_UP, this);

      if (this._isOver) {
        this.updateButtonImage();
        
        if (!this.isHandlingDoublePress) {
          this.handlePressed();
        }
      }
    }
    
    const nonCaptured = ButtonComponent.overNonCapturedButton;
    if (nonCaptured) {
      ButtonComponent.overNonCapturedButton = null;
      nonCaptured.handleInputOver();
    }
  }

  // ----------------------------------------------------------------------------------------------
  private handlePressed(): void {
    this.playPressedSound();

    if (this.callback) {
      this.callback.call(this.context, this);
    }

    if (this.eventName) {
      this.scene.events.emit(this.eventName, this);
    }
  }

  // ----------------------------------------------------------------------------------------------
  private init(): void {
    this._isInit = true;

    const inputConfig: Phaser.Types.Input.InputConfiguration = {
      pixelPerfect: false,
      useHandCursor: true,
    };

    this.events.emit(ButtonComponentEvents.INIT_INTERACTIVE_DATA, inputConfig);
    
    if (inputConfig.pixelPerfect === undefined) {
      inputConfig.pixelPerfect = false;
    }

    if (inputConfig.useHandCursor === undefined) {
      inputConfig.useHandCursor = true;
    }

    this.inputConfig = inputConfig;
    if (this.gameObject) {
      this.gameObject.setInteractive(this.inputConfig);
      this.gameObject.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.onInputDown, this);
      this.gameObject.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, this.onInputOver, this);
      this.gameObject.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.onInputOut, this);
    }

    if (this._enabled !== undefined) {
      this.enabled = this._enabled;
    } else {
      this.enabled = this.defaultEnabled;
    }

    this.lastIsVisible = this.isVisibleChain();

    this.scene.events.once(Phaser.Scenes.Events.SLEEP, this.onSceneSleep, this);
    this.events.emit(ComponentEvents.INIT, this);
  }

  // ----------------------------------------------------------------------------------------------
  private static IsTextureImage(image: ButtonComponentTextureImage): boolean {
    return (image && 'setTexture' in image);
  }
  
  // ----------------------------------------------------------------------------------------------
  private isVisibleChain(): boolean {
    const visibleObj = this.getVisibleComponent();
    if (!visibleObj || !visibleObj.visible) {
      return (false);
    }

    let parent = this.gameObject ? this.gameObject.parentContainer : null;
    while (parent) {
      if (!parent.visible) {
        return (false);
      }
      parent = parent.parentContainer;
    }
    return (true);
  }

  // ----------------------------------------------------------------------------------------------
  private onDestroy(): void {
    const FROM_GAME_OBJECT = true;
    this.destroy(FROM_GAME_OBJECT);
  }

  // ----------------------------------------------------------------------------------------------
  private onDoublePressTimerComplete(): void {
    this.destroyDoublePressTimer();
    this.isHandlingDoublePress = false;

    if (this.isOver && !this.isDown) {
      this.handlePressed();
    }
  }

  // ----------------------------------------------------------------------------------------------
  private onInputDown(pointer: Phaser.Input.Pointer, localX: number, localY: number,
    eventData: Phaser.Types.Input.EventData): void {
    if (this.isDoublePressEnabled) {
      this.handleInputDoublePress(localX, localY);
    } else {
      this.handleInputDown();
    }

    eventData.stopPropagation();
  }    
  
  // ----------------------------------------------------------------------------------------------
  private onInputOut(pointer: Phaser.Input.Pointer,
    eventData: Phaser.Types.Input.EventData): void {
    this.handleInputOut();
    eventData.stopPropagation();
  }

  // ----------------------------------------------------------------------------------------------
  private onInputOver(pointer: Phaser.Input.Pointer, localX: number, localY: number,
    eventData: Phaser.Types.Input.EventData): void {
    this.handleInputOver();
    eventData.stopPropagation();
  }

  // ----------------------------------------------------------------------------------------------
  private onScenePointerUp(): void {
    this.handleInputUp();
  }

  // ----------------------------------------------------------------------------------------------
  private onSceneSleep(): void {
    this.resetCursorIfOverOrDown();

    this._isDown = false;
    this._isOver = false;

    this.updateCapturedStatesAfterOff();
    this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.onScenePointerUp, this);
    this.scene.events.once(Phaser.Scenes.Events.WAKE, this.onSceneWake, this);
    this.events.emit(ButtonComponentEvents.SLEEP, this);
  }

  // ----------------------------------------------------------------------------------------------
  private onSceneUpdate(): void {
    if (this._isInit) {
      this.updatePostInit();
    } else {
      this.updatePreInit();
    }
  }

  // ----------------------------------------------------------------------------------------------
  private onSceneWake(): void {
    this.updateButtonImage();
    this.scene.events.once(Phaser.Scenes.Events.SLEEP, this.onSceneSleep, this);
    this.events.emit(ButtonComponentEvents.WAKE, this);
  }

  // ----------------------------------------------------------------------------------------------
  private onSoundComplete(sound: Phaser.Sound.BaseSound): void {
    this.events.emit(ButtonComponentEvents.SOUND_COMPLETE, this, sound.key);
    sound.destroy();
  }

  // ----------------------------------------------------------------------------------------------
  private playDownSound(): void {
    this.playSound(this.downSoundKey);
  }

  // ----------------------------------------------------------------------------------------------
  private playPressedSound(): void {
    this.playSound(this.pressedSoundKey);
  }

  // ----------------------------------------------------------------------------------------------
  private playSound(soundKey: string): void {
    if (!soundKey) {
      return;
    }
    
    const sound = this.scene.sound.add(soundKey);
    sound.once(Phaser.Sound.Events.COMPLETE, this.onSoundComplete, this);
    sound.play();
  }

  // ----------------------------------------------------------------------------------------------
  private resetCursorIfOverOrDown(): void {
    if (this.isOver || this.isDown) {
      const inputManager = this.scene.input.manager;
      inputManager.canvas.style.cursor = inputManager.defaultCursor;
    }
  }

  // ----------------------------------------------------------------------------------------------
  private updateAfterDisable(): void {
    this.resetCursorIfOverOrDown();
    this._isDown = false;
    this._isOver = false;
    this.updateButtonImage();
  }

  // ----------------------------------------------------------------------------------------------
  private updateAfterEnabled(): void {
    const input = this.scene.input;
    const gameObjects = input.hitTestPointer(input.activePointer);
    
    this._isOver = gameObjects.indexOf(this.gameObject) > -1;
    this.updateButtonImage();
  }

  // ----------------------------------------------------------------------------------------------
  private updateAfterNonVisible(): void {
    this.resetCursorIfOverOrDown();
    this._isDown = false;
    this._isOver = false;

    this.updateCapturedStatesAfterOff();
    
    if (this.scene) {
      this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.onScenePointerUp, this);
    }

    if (this.gameObject) {
      this.gameObject.removeInteractive();
    }
  }
  
  // ----------------------------------------------------------------------------------------------
  private updateAfterVisible(): void {
    if (!this.gameObject) {
      return;
    }
    
    this.gameObject.setInteractive(this.inputConfig);
    
    if (this.enabled) {
      const objects = this.scene.input.hitTestPointer(this.scene.input.activePointer);
      if (objects.indexOf(this.gameObject) > -1) {
        this.handleInputOver();
      }
    } else {
      this.enabled = false;
    }
  }

  // ----------------------------------------------------------------------------------------------
  private updateCapturedStatesAfterOff(): void {
    if (ButtonComponent.capturedButton === this) {
      ButtonComponent.capturedButton = null;

      const nonCaptured = ButtonComponent.overNonCapturedButton;
      if (nonCaptured) {
        ButtonComponent.overNonCapturedButton = null;
        nonCaptured.handleInputOver();
      }
    } else if (ButtonComponent.overNonCapturedButton === this) {
      ButtonComponent.overNonCapturedButton = null;
    }
  }

  // ----------------------------------------------------------------------------------------------
  private updateSceneEnabled(): void {
    if (!this.isVisibleChain) {
      return;
    }
    
    const input = this.scene ? this.scene.input : null;
    if (!input) {
      return;
    }

    if (this.wasSceneInputEnabled === input.enabled) {
      return;
    }

    this.wasSceneInputEnabled = input.enabled;
    
    if (this.wasSceneInputEnabled) {
      this.updateAfterEnabled();
    } else {
      this.updateAfterDisable();
    }
  }

  // ----------------------------------------------------------------------------------------------
  private updatePostInit(): void {
    this.updateVisibility();
    this.updateSceneEnabled();
  }

  // ----------------------------------------------------------------------------------------------
  private updatePreInit(): void {
    this.init();
  }

  // ----------------------------------------------------------------------------------------------
  private updateVisibility(): void {
    const isCurrentlyVisible = this.isVisibleChain();
    const didVisibilityChange = this.lastIsVisible !== isCurrentlyVisible;
    if (!didVisibilityChange) {
      return;
    }

    this.lastIsVisible = isCurrentlyVisible;
    
    if (this.lastIsVisible) {
      this.updateAfterVisible();
    } else {
      this.updateAfterNonVisible();
    }
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
export type buttonComponentCallback = (component: ButtonComponent) => void;

export default ButtonComponent;
