// You can write more code here
import { getLocalPoint } from '../../Utils';
import BaseComponent from '../BaseComponent';
import ButtonComponent from '../buttons/ButtonComponent';
import ButtonComponentEvents from '../buttons/ButtonComponentEvents';
import ComponentEvents from '../ComponentEvents';
import ITexturePropertyType from '../ITexturePropertyType';
import SliderComponentEvents from './SliderComponentEvents';
import SliderComponentMetrics from './SliderComponentMetrics';

/* eslint-disable */

/* START OF COMPILED CODE */

class SliderComponent extends BaseComponent {
  
  constructor(gameObject: Phaser.GameObjects.Container) {
    super(gameObject);
    
    gameObject["__SliderComponent"] = this;
    
    this.gameObject = gameObject;
    this.defaultSize = 100;
    this._isHorizontal = true;
    this._bodyImage;
    this._bodyDisabledImage;
    this._handleNormImage;
    this._handleOverImage;
    this._handleDownImage;
    this._handleDisabledImage;
    this._incrementDelay = 500;
    this._incrementRate = 0;
    this._incrementValue = 0.1;
    this.bodyIncrementValue = 0.1;
    this.defaultValue = 0;
    this._decBtnNormImage;
    this._decBtnOverImage;
    this._decBtnDownImage;
    this._decBtnDisabledImage;
    this._incBtnNormImage;
    this._incBtnOverImage;
    this._incBtnDownImage;
    this._incBtnDisabledImage;
    this.defaultIsHandleCentered = false;
    this.defaultEnabled = true;
    this.isVisibleDefault = true;
    this.wheelValue = 0.08;
    
    /* START-USER-CTR-CODE */
    /* eslint-enable */

    this.gameObject.once(Phaser.GameObjects.Events.DESTROY, this.onDestroy, this);
    
    this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.onSceneUpdateInit, this);

    /* eslint-disable */
    /* END-USER-CTR-CODE */
  }
  
  private gameObject: Phaser.GameObjects.Container;
  
  public defaultSize: number;
  
  public _isHorizontal: boolean;
  
  public _bodyImage: {key:string,frame?:string|number};
  
  public _bodyDisabledImage: {key:string,frame?:string|number};
  
  public _handleNormImage: {key:string,frame?:string|number};
  
  public _handleOverImage: {key:string,frame?:string|number};
  
  public _handleDownImage: {key:string,frame?:string|number};
  
  public _handleDisabledImage: {key:string,frame?:string|number};
  
  public _incrementDelay: number;
  
  public _incrementRate: number;
  
  public _incrementValue: number;
  
  public bodyIncrementValue: number;
  
  public defaultValue: number;
  
  public _decBtnNormImage: {key:string,frame?:string|number};
  
  public _decBtnOverImage: {key:string,frame?:string|number};
  
  public _decBtnDownImage: {key:string,frame?:string|number};
  
  public _decBtnDisabledImage: {key:string,frame?:string|number};
  
  public _incBtnNormImage: {key:string,frame?:string|number};
  
  public _incBtnOverImage: {key:string,frame?:string|number};
  
  public _incBtnDownImage: {key:string,frame?:string|number};
  
  public _incBtnDisabledImage: {key:string,frame?:string|number};
  
  public defaultIsHandleCentered: boolean;
  
  public defaultEnabled: boolean;
  
  public isVisibleDefault: boolean;
  
  public wheelValue: number;
  
  static getComponent(gameObject: Phaser.GameObjects.Container): SliderComponent {
    return gameObject["__SliderComponent"];
  }
  
  /* START-USER-CODE */

  // Write your code here.

  /* eslint-enable */

  // ==============================================================================================
  // properties
  // ==============================================================================================
  static readonly WAIT_ITEM_TYPE = 'sliderComponent';

  private bodyButton: ButtonComponent;

  private decButton: ButtonComponent;

  private incButton: ButtonComponent;

  private handleButton: ButtonComponent;

  private _timerIncrement: Phaser.Time.TimerEvent;

  private dragBounds: Phaser.Geom.Rectangle;

  private dragHandleOfsPt: Phaser.Geom.Point;

  private minThumbPos: number;
  
  private maxThumbPos: number;
  
  private thumbArea: number;

  private _autoIncrement: number;

  private _size: number;

  private _value: number;

  private _isHandleCentered: boolean;

  private _isEnabled: boolean;

  // ==============================================================================================
  // public
  // ==============================================================================================
  
  // ----------------------------------------------------------------------------------------------
  destroy(fromGameObject = false): void {
    super.destroy(fromGameObject);

    this.stopThumbDrag();
    this.stopTimer();
    
    this.initWheelEvents(false);

    if (this.scene) {
      this.scene.events.removeListener(Phaser.Scenes.Events.UPDATE, this.onSceneUpdateInit, this);
      this.scene.events.removeListener(Phaser.Scenes.Events.UPDATE, this.onSceneUpdateInitButtons,
        this);
    }

    if (!fromGameObject) {
      if (this.gameObject) {
        this.gameObject.off(Phaser.GameObjects.Events.DESTROY, this.onDestroy, this);
        this.gameObject.destroy();
      }

      this.gameObject = null;
    }
    
    this.bodyButton = null;
    this.decButton = null;
    this.incButton = null;
    this.handleButton = null;
  }

  // ----------------------------------------------------------------------------------------------
  get enabled(): boolean {
    return (this._isEnabled);
  }

  // ----------------------------------------------------------------------------------------------
  set enabled(value: boolean) {
    this._isEnabled = value;
    this.enableButtons(this._isEnabled);
  }

  // ----------------------------------------------------------------------------------------------
  getGameObject(): Phaser.GameObjects.GameObject {
    return (this.gameObject);
  }

  // ----------------------------------------------------------------------------------------------
  get incrementValue(): number {
    return (this._incrementValue);
  }

  // ----------------------------------------------------------------------------------------------
  set incrementValue(value: number) {
    this._incrementValue = SliderComponent.SetValue(this._incrementValue, value);
  }

  // ----------------------------------------------------------------------------------------------
  get isHandleCentered(): boolean {
    return (this._isHandleCentered);
  }

  // ----------------------------------------------------------------------------------------------
  set isHandleCentered(value: boolean) {
    this._isHandleCentered = value;
    this.updateSlider();
  }

  // ----------------------------------------------------------------------------------------------
  get isHorizontal(): boolean {
    return (this._isHorizontal);
  }

  // ----------------------------------------------------------------------------------------------
  set isHorizontal(value: boolean) {
    this._isHorizontal = value;
    this.updateSlider();
  }
  
  // ----------------------------------------------------------------------------------------------
  set size(value: number) {
    this._size = value;

    if (this.isHorizontal) {
      if (value < 0) {
        SliderComponentMetrics.SetButtonScaleX(this.bodyButton, 1);
      } else {
        const w = value - (SliderComponentMetrics.GetButtonWidth(this.decButton)
          + SliderComponentMetrics.GetButtonWidth(this.incButton));
        SliderComponentMetrics.SetButtonWidth(this.bodyButton, w);
      }
    } else if (value < 0) {
      SliderComponentMetrics.SetButtonScaleY(this.bodyButton, 1);
    } else {
      const h = value - (SliderComponentMetrics.GetButtonHeight(this.decButton)
        + SliderComponentMetrics.GetButtonHeight(this.incButton));
      SliderComponentMetrics.SetButtonHeight(this.bodyButton, h);
    }

    this.updateSlider();
  }

  // ----------------------------------------------------------------------------------------------
  updateSlider(): void {
    if (this.isHorizontal) {
      SliderComponentMetrics.SetButtonX(this.decButton, 0);
      SliderComponentMetrics.SetButtonY(this.decButton, 0);
      SliderComponentMetrics.SetButtonY(this.bodyButton, 0);
      SliderComponentMetrics.SetButtonY(this.decButton, 0);
      SliderComponentMetrics.SetButtonY(this.incButton, 0);
      SliderComponentMetrics.SetButtonY(this.handleButton, 0);
      SliderComponentMetrics.SetButtonX(this.bodyButton,
        SliderComponentMetrics.GetButtonWidth(this.decButton));
      SliderComponentMetrics.SetButtonX(this.incButton,
        SliderComponentMetrics.GetButtonX(this.bodyButton)
        + SliderComponentMetrics.GetButtonWidth(this.bodyButton));
      this.minThumbPos = SliderComponentMetrics.GetButtonX(this.bodyButton);
      if (this.isHandleCentered) {
        this.maxThumbPos = SliderComponentMetrics.GetButtonX2(this.bodyButton);
      } else {
        this.maxThumbPos = SliderComponentMetrics.GetButtonX2(this.bodyButton)
          - SliderComponentMetrics.GetButtonWidth(this.handleButton);
      }
    } else {
      SliderComponentMetrics.SetButtonY(this.decButton, 0);
      SliderComponentMetrics.SetButtonX(this.decButton, 0);
      SliderComponentMetrics.SetButtonX(this.bodyButton, 0);
      SliderComponentMetrics.SetButtonX(this.decButton, 0);
      SliderComponentMetrics.SetButtonX(this.incButton, 0);
      SliderComponentMetrics.SetButtonX(this.handleButton, 0);
      SliderComponentMetrics.SetButtonY(this.bodyButton,
        SliderComponentMetrics.GetButtonHeight(this.decButton));
      SliderComponentMetrics.SetButtonY(this.incButton,
        SliderComponentMetrics.GetButtonY(this.bodyButton)
        + SliderComponentMetrics.GetButtonHeight(this.bodyButton));
      this.minThumbPos = SliderComponentMetrics.GetButtonY(this.bodyButton);
      
      if (this.isHandleCentered) {
        this.maxThumbPos = SliderComponentMetrics.GetButtonY2(this.bodyButton);
      } else {
        this.maxThumbPos = SliderComponentMetrics.GetButtonY2(this.bodyButton)
          - SliderComponentMetrics.GetButtonHeight(this.handleButton);
      }
    }
    
    this.thumbArea = this.maxThumbPos - this.minThumbPos;
    this.updateHandle();
  }

  // ----------------------------------------------------------------------------------------------
  get value(): number {
    return (this._value);
  }

  // ----------------------------------------------------------------------------------------------
  set value(x: number) {
    this._value = SliderComponent.SetValue(this._value, x);
    this.updateSlider();
  }

  // ----------------------------------------------------------------------------------------------
  get visible(): boolean {
    return (this.gameObject && this.gameObject.visible);
  }

  // ----------------------------------------------------------------------------------------------
  set visible(value: boolean) {
    if (this.gameObject) {
      this.gameObject.visible = value;
    }
  }

  // ==============================================================================================
  // private
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  private addImageFromTextureData(textureData: ITexturePropertyType): Phaser.GameObjects.Image {
    const image = textureData ? this.scene.add.image(0, 0, textureData.key, textureData.frame)
      : null;
    if (image) {
      image.setOrigin(0);
      this.gameObject.add(image);
    }
    return (image);
  }

  // ----------------------------------------------------------------------------------------------
  private autoIncrement(): void {
    const prevValue = this._value;
    
    this.value = this._value + this._autoIncrement;
    
    if (prevValue !== this._value) {
      this.events.emit(SliderComponentEvents.CHANGED, this);
    }
  }

  // ----------------------------------------------------------------------------------------------
  private enableButtons(enabled: boolean): void {
    const buttons = [
      this.bodyButton,
      this.decButton,
      this.handleButton,
      this.incButton,
    ];

    SliderComponentMetrics.SetEnabled(buttons, enabled);
  }

  // ----------------------------------------------------------------------------------------------
  private static HitAreaCallback(hitArea: Phaser.Geom.Rectangle, xLocal: number,
    yLocal: number): boolean {
    return (hitArea.contains(xLocal, yLocal));
  }

  // ----------------------------------------------------------------------------------------------
  private initBody(): void {
    const image = this.addImageFromTextureData(this._bodyImage);
    if (!image) {
      return;
    }

    this.bodyButton = new ButtonComponent(image);
    this.bodyButton.normFrame = this._bodyImage;
    this.bodyButton.disabledFrame = this._bodyDisabledImage;
    this.bodyButton.events.on(ButtonComponentEvents.POINTER_DOWN, this.onBodyDown, this);
    this.bodyButton.events.on(ButtonComponentEvents.POINTER_UP, this.onBodyUp, this);
  }

  // ----------------------------------------------------------------------------------------------
  private initDec(): void {
    const image = this.addImageFromTextureData(this._decBtnNormImage);
    if (!image) {
      return;
    }

    this.decButton = new ButtonComponent(image);
    this.decButton.normFrame = this._decBtnNormImage;
    this.decButton.overFrame = this._decBtnOverImage;
    this.decButton.downFrame = this._decBtnDownImage;
    this.decButton.disabledFrame = this._decBtnDisabledImage;
    this.decButton.events.on(ButtonComponentEvents.POINTER_DOWN, this.onDecDown, this);
    this.decButton.events.on(ButtonComponentEvents.POINTER_UP, this.onDecUp, this);
  }

  // ----------------------------------------------------------------------------------------------
  private initHandle(): void {
    const image = this.addImageFromTextureData(this._handleNormImage);
    if (!image) {
      return;
    }

    this.handleButton = new ButtonComponent(image);
    this.handleButton.normFrame = this._handleNormImage;
    this.handleButton.disabledFrame = this._handleDisabledImage;
    this.handleButton.events.on(ButtonComponentEvents.POINTER_DOWN, this.onHandleDown, this);
    this.handleButton.events.on(ButtonComponentEvents.POINTER_UP, this.onHandleUp, this);
  }

  // ----------------------------------------------------------------------------------------------
  private initInc(): void {
    const image = this.addImageFromTextureData(this._incBtnNormImage);
    if (!image) {
      return;
    }

    this.incButton = new ButtonComponent(image);
    this.incButton.normFrame = this._incBtnNormImage;
    this.incButton.overFrame = this._incBtnOverImage;
    this.incButton.downFrame = this._incBtnDownImage;
    this.incButton.disabledFrame = this._incBtnDisabledImage;
    this.incButton.events.on(ButtonComponentEvents.POINTER_DOWN, this.onIncDown, this);
    this.incButton.events.on(ButtonComponentEvents.POINTER_UP, this.onIncUp, this);
  }

  // ----------------------------------------------------------------------------------------------
  private initIncrement(incrementValue: number):void {
    this._autoIncrement = incrementValue;
    
    this.autoIncrement();
    
    this._timerIncrement = this.scene.time.addEvent(
      {
        delay: this._incrementDelay,
        callback: this.onTimerCompleteDelay,
        callbackScope: this,
      },
    );
  }
  
  // ----------------------------------------------------------------------------------------------
  private initWheelEvents(isOn: boolean): void {
    const buttons = [
      this.bodyButton,
      this.decButton,
      this.handleButton,
      this.incButton,
    ];

    buttons.forEach((button) => {
      const buttonGameObject = button ? button.getGameObject() : null;
      if (!buttonGameObject) {
        return;
      }

      if (isOn) {
        buttonGameObject.on(Phaser.Input.Events.GAMEOBJECT_POINTER_WHEEL,
          this.onSubButtonGameObjectPointerWheel, this);
      } else {
        buttonGameObject.off(Phaser.Input.Events.GAMEOBJECT_POINTER_WHEEL,
          this.onSubButtonGameObjectPointerWheel, this);
      }
    }, this);
  }

  // ----------------------------------------------------------------------------------------------
  private isHandleAheadOfPoint(v2: Phaser.Math.Vector2): boolean {
    return (this.isHorizontal
      ? SliderComponentMetrics.GetButtonX(this.handleButton) >= v2.x
      : SliderComponentMetrics.GetButtonY(this.handleButton) >= v2.y);
  }

  // ----------------------------------------------------------------------------------------------
  private onBodyDown(): void {
    // TODO: implement auto-timer
    const pos = this.scene.input.activePointer.position;
    const v2 = getLocalPoint(this.gameObject, pos.x, pos.y);
    
    let newValue: number;

    if (this.bodyIncrementValue >= 0) {
      if (this.isHandleAheadOfPoint(v2)) {
        newValue = this.value - this.bodyIncrementValue;
      } else {
        newValue = this.value + this.bodyIncrementValue;
      }
    } else {
      let tPos: number;

      if (this.isHandleCentered) {
        tPos = this.isHorizontal ? v2.x : v2.y;
      } else {
        tPos = this.isHorizontal
          ? v2.x - SliderComponentMetrics.GetButtonWidth(this.handleButton) / 2
          : v2.y - SliderComponentMetrics.GetButtonHeight(this.handleButton) / 2;
      }

      newValue = (tPos - this.minThumbPos) / this.thumbArea;
    }

    const prevValue: number = this.value;
    this.value = newValue;
    if (prevValue !== this.value) {
      this.events.emit(SliderComponentEvents.CHANGED, this);
    }
  }

  // ----------------------------------------------------------------------------------------------
  // eslint-disable-next-line class-methods-use-this
  private onBodyUp(): void {
    // TODO
  }

  // ----------------------------------------------------------------------------------------------
  private onDecDown(): void {
    this.initIncrement(-this._incrementValue);
  }

  // ----------------------------------------------------------------------------------------------
  private onDecUp(): void {
    this.stopTimer();
  }

  // ----------------------------------------------------------------------------------------------
  private onDestroy(): void {
    const FROM_GAME_OBJECT = true;
    this.destroy(FROM_GAME_OBJECT);
  }

  // ----------------------------------------------------------------------------------------------
  private onHandleDown(): void {
    this.dragBounds = this.dragBounds || new Phaser.Geom.Rectangle();
    this.dragHandleOfsPt = this.dragHandleOfsPt || new Phaser.Geom.Point();
    
    const handleButton = this.handleButton;
    const handleGameObject = handleButton.getGameObject();
    const input = handleGameObject.input;

    if (this.isHorizontal) {
      this.dragBounds.left = this.minThumbPos;
      this.dragBounds.right = this.maxThumbPos;
      this.dragBounds.top = SliderComponentMetrics.GetButtonY(handleButton);
      this.dragBounds.bottom = this.dragBounds.top;

      if (this.isHandleCentered) {
        this.dragHandleOfsPt.x = input.localX
          - SliderComponentMetrics.GetButtonWidth(handleButton) / 2;
        this.dragHandleOfsPt.y = input.localY;
      } else {
        this.dragHandleOfsPt.x = input.localX;
        this.dragHandleOfsPt.y = input.localY;
      }
    } else {
      this.dragBounds.top = this.minThumbPos;
      this.dragBounds.bottom = this.maxThumbPos;
      this.dragBounds.left = SliderComponentMetrics.GetButtonX(handleButton);
      this.dragBounds.right = this.dragBounds.left;

      if (this.isHandleCentered) {
        this.dragHandleOfsPt.y = input.localY
          - SliderComponentMetrics.GetButtonHeight(handleButton) / 2;
        this.dragHandleOfsPt.x = input.localX;
      } else {
        this.dragHandleOfsPt.y = input.localY;
        this.dragHandleOfsPt.x = input.localX;
      }
    }
    
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.onSceneUpdateDragHandle, this);
  }

  // ----------------------------------------------------------------------------------------------
  private onHandleUp(): void {
    this.stopThumbDrag();
    this.stopTimer();
  }

  // ----------------------------------------------------------------------------------------------
  private onIncDown(): void {
    this.initIncrement(this._incrementValue);
  }

  // ----------------------------------------------------------------------------------------------
  private onIncUp(): void {
    this.stopTimer();
  }

  // ----------------------------------------------------------------------------------------------
  private onSceneUpdateDragHandle(): void {
    if (this.thumbArea <= 0) {
      return;
    }

    const pos = this.scene.input.activePointer.position;
    const v2 = getLocalPoint(this.gameObject, pos.x, pos.y);
    
    v2.x = Phaser.Math.Clamp(v2.x - this.dragHandleOfsPt.x, this.dragBounds.left,
      this.dragBounds.right);
    v2.y = Phaser.Math.Clamp(v2.y - this.dragHandleOfsPt.y, this.dragBounds.top,
      this.dragBounds.bottom);
    
    SliderComponentMetrics.SetButtonX(this.handleButton, v2.x);
    SliderComponentMetrics.SetButtonY(this.handleButton, v2.y);

    let newValue: number;

    if (this.isHorizontal) {
      newValue = (v2.x - this.dragBounds.left) / this.thumbArea;
    } else {
      newValue = (v2.y - this.dragBounds.top) / this.thumbArea;
    }

    if (this._value !== newValue) {
      this._value = newValue;
      this.events.emit(SliderComponentEvents.CHANGED, this);
    }
  }
  
  // ----------------------------------------------------------------------------------------------
  private onSceneUpdateInit(): void {
    this.removePlaceholders();
    
    this.visible = this.isVisibleDefault;
    
    this.initBody();
    this.initHandle();
    this.initDec();
    this.initInc();

    this.initWheelEvents(true);

    this._isHandleCentered = this.defaultIsHandleCentered;
    
    this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.onSceneUpdateInitButtons, this);
  }

  // ----------------------------------------------------------------------------------------------
  private onSceneUpdateInitButtons(): void {
    if (this.isHandleCentered) {
      if (this.isHorizontal) {
        SliderComponentMetrics.SetButtonOrigin(this.handleButton, 0.5, 0);
      } else {
        SliderComponentMetrics.SetButtonOrigin(this.handleButton, 0, 0.5);
      }
    }

    if (this._value === undefined) {
      this.value = this.defaultValue;
    }
    
    if (this._size === undefined) {
      this.size = this.defaultSize;
    }

    if (this._isEnabled === undefined) {
      this.enabled = this.defaultEnabled;
    } else {
      this.enableButtons(this.enabled);
    }

    this.events.emit(ComponentEvents.INIT, this);
  }

  // ----------------------------------------------------------------------------------------------
  private onSubButtonGameObjectPointerWheel(pointer: Phaser.Input.Pointer, xDelta: number,
    yDelta: number): void {
    this.events.emit(SliderComponentEvents.WHEEL, yDelta, this, pointer, xDelta);

    const newValue = this._value + this.wheelValue * (yDelta / Math.abs(yDelta));
    if (this._value !== newValue) {
      this.value = newValue;
      this.events.emit(SliderComponentEvents.CHANGED, this);
    }
  }

  // ----------------------------------------------------------------------------------------------
  private onTimerCompleteDelay():void {
    this._timerIncrement = this.scene.time.addEvent({
      delay: this._incrementRate,
      loop: true,
      callback: this.onTimerIncrement,
      callbackScope: this,
    });
  }

  // ----------------------------------------------------------------------------------------------
  private onTimerIncrement():void {
    this.autoIncrement();
  }

  // ----------------------------------------------------------------------------------------------
  private removePlaceholders(): void {
    this.gameObject.removeAll(true);
  }

  // ----------------------------------------------------------------------------------------------
  private static SetValue(curValue: number, value: number): number {
    return (Number.isNaN(value)
      ? curValue
      : Phaser.Math.Clamp(value, 0, 1.0));
  }

  // ----------------------------------------------------------------------------------------------
  private stopThumbDrag(): void {
    if (this.scene) {
      this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.onSceneUpdateDragHandle, this);
    }
  }

  // ----------------------------------------------------------------------------------------------
  private stopTimer(): void {
    if (this._timerIncrement) {
      this._timerIncrement.remove();
      this._timerIncrement = null;
    }
  }

  // ----------------------------------------------------------------------------------------------
  private updateHandle(): void {
    const tValue = this.minThumbPos + this.thumbArea * this._value;
    if (this.isHorizontal) {
      SliderComponentMetrics.SetButtonX(this.handleButton, tValue);
    } else {
      SliderComponentMetrics.SetButtonY(this.handleButton, tValue);
    }
  }

/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
export default SliderComponent;
