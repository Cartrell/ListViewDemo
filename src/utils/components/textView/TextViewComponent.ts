// You can write more code here
import { getPropertyBitmapText, getPropertyImage, getPropertyText } from '../../Utils';
import BaseContentScrollerComponent from '../../contentScroller/BaseContentScrollerComponent';
import ContentScroller from '../../contentScroller/ContentScroller';
import ContentScrollerEvents from '../../contentScroller/ContentScrollerEvents';

type TextViewTextObject = Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;

/* eslint-disable */

/* START OF COMPILED CODE */

class TextViewComponent extends BaseContentScrollerComponent {
  
  constructor(gameObject: Phaser.GameObjects.Container) {
    super(gameObject);
    
    gameObject["__TextViewComponent"] = this;
    
    this.gameObject = gameObject;
    this._textObjectName = "textField";
    this._hzSliderName = "hzSlider";
    this._vtSliderName = "vtSlider";
    this._rectShapeName = "rect";
    this.isEnabledDefault = true;
    
    /* START-USER-CTR-CODE */
    // Write your code here.
    /* eslint-enable */
    
    this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.onSceneUpdateInit, this);

    /* eslint-disable */
    /* END-USER-CTR-CODE */
  }
  
  private gameObject: Phaser.GameObjects.Container;
  
  public _textObjectName: string;
  
  public _hzSliderName: string;
  
  public _vtSliderName: string;
  
  public _rectShapeName: string;
  
  public isEnabledDefault: boolean;
  
  static getComponent(gameObject: Phaser.GameObjects.Container): TextViewComponent {
    return gameObject["__TextViewComponent"];
  }
  
  /* START-USER-CODE */

  // Write your code here.

  /* eslint-enable */

  // ==============================================================================================
  // properties
  // ==============================================================================================
  private textObject: TextViewTextObject;

  private scroller: ContentScroller;
  
  private textContainer: Phaser.GameObjects.Container;

  private zone: Phaser.GameObjects.Zone;

  // ==============================================================================================
  // public
  // ==============================================================================================
  
  // ----------------------------------------------------------------------------------------------
  get areaHeight(): number {
    return (this.zone.displayHeight);
  }
  
  // ----------------------------------------------------------------------------------------------
  get areaWidth(): number {
    return (this.zone.displayWidth);
  }
  
  // ----------------------------------------------------------------------------------------------
  get container(): Phaser.GameObjects.Container {
    return (this.textContainer);
  }
  
  // ----------------------------------------------------------------------------------------------
  get contentHeight(): number {
    if (this.textObject instanceof Phaser.GameObjects.BitmapText) {
      return (this.textObject.height);
    }
    
    if (this.textObject instanceof Phaser.GameObjects.Text) {
      return (this.textObject.displayHeight);
    }

    return (0);
  }
  
  // ----------------------------------------------------------------------------------------------
  get contentWidth(): number {
    if (this.textObject instanceof Phaser.GameObjects.BitmapText) {
      return (this.textObject.width);
    }
    
    if (this.textObject instanceof Phaser.GameObjects.Text) {
      return (this.textObject.displayWidth);
    }

    return (0);
  }
  
  // ----------------------------------------------------------------------------------------------
  getGameObject(): Phaser.GameObjects.GameObject {
    return (this.gameObject);
  }

  // ----------------------------------------------------------------------------------------------
  get hzSliderName(): string {
    return (this._hzSliderName);
  }

  // ----------------------------------------------------------------------------------------------
  get hzSliderPosition(): number {
    return (this.scroller.horizontalSliderValue);
  }

  // ----------------------------------------------------------------------------------------------
  set hzSliderPosition(value: number) {
    this.scroller.horizontalSliderValue = value;
  }

  // ----------------------------------------------------------------------------------------------
  setText(text: string | string[]): void {
    this.textObject.setText(text);
    this.update();
  }

  // ----------------------------------------------------------------------------------------------
  get text(): string {
    return (this.textObject.text);
  }

  // ----------------------------------------------------------------------------------------------
  set text(value: string) {
    this.setText(value);
  }

  // ----------------------------------------------------------------------------------------------
  update(): void {
    this.scroller.update();
  }

  // ----------------------------------------------------------------------------------------------
  get vtSliderName(): string {
    return (this._vtSliderName);
  }

  // ----------------------------------------------------------------------------------------------
  get vtSliderPosition(): number {
    return (this.scroller.verticalSliderValue);
  }

  // ----------------------------------------------------------------------------------------------
  set vtSliderPosition(value: number) {
    this.scroller.verticalSliderValue = value;
  }

  // ----------------------------------------------------------------------------------------------
  get wheelValue(): number {
    return (this.scroller ? this.scroller.swiper.wheelValue : 0);
  }

  // ----------------------------------------------------------------------------------------------
  set wheelValue(value: number) {
    if (this.scroller) {
      this.scroller.swiper.wheelValue = value;
    }
  }

  // ==============================================================================================
  // private
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  private createDefaultText(): void {
    this.textObject = this.scene.add.text(0, 0, '');
    this.gameObject.add(this.textObject);
  }

  // ----------------------------------------------------------------------------------------------
  private createDefaultZone(): void {
    this.zone = this.scene.add.zone(0, 0, 256, 256);
    this.gameObject.add(this.zone);
  }

  // ----------------------------------------------------------------------------------------------
  private initScroller(): void {
    this.scroller = new ContentScroller(this);
    this.scroller.events.on(ContentScrollerEvents.CHANGED, this.onScrollerChanged, this);
    this.scroller.events.on(ContentScrollerEvents.AREA_CHANGING, this.onScrollerAreaChanging, this);
    this.scroller.enabled = this.isEnabledDefault;
  }

  // ----------------------------------------------------------------------------------------------
  private initTextContainer(): void {
    this.textContainer = this.scene.add.container(this.zone.x, this.zone.y);
    this.gameObject.add(this.textContainer);
  }

  // ----------------------------------------------------------------------------------------------
  private initText(): void {
    if (!this._textObjectName) {
      console.warn('No text object name specified. This should be the name of a property that '
        + ' represents either a Phaser Text or BitmapText object.');
      this.createDefaultText();
      return;
    }

    const textObject = getPropertyBitmapText(this.scene, this._textObjectName)
      || getPropertyText(this.scene, this._textObjectName);
    
    if (!textObject) {
      console.warn(`No text object found with the property name: ${this._textObjectName}.`);
      this.createDefaultText();
      return;
    }

    this.textObject = textObject;
    this.setTextWidth(this.zone.displayWidth);
    this.textContainer.add(this.textObject);
  }

  // ----------------------------------------------------------------------------------------------
  private initZone(): void {
    if (!this._rectShapeName) {
      console.warn('No rectangle shape name specified. This should be the var name of an image '
        + ' that defines the visible bounds of the text.');
      this.createDefaultZone();
      return;
    }

    const area = getPropertyImage(this.scene, this._rectShapeName);
    if (!area) {
      console.warn(`No rectangle shape found with the property name: ${this._rectShapeName}.`);
      this.createDefaultZone();
      return;
    }

    this.zone = this.scene.add.zone(area.x, area.y, area.displayWidth, area.displayHeight);
    this.zone.setOrigin(0, 0);
    this.gameObject.add(this.zone);

    area.destroy();
  }

  // ----------------------------------------------------------------------------------------------
  private onSceneUpdateInit(): void {
    this.initZone();
    this.initTextContainer();
    this.initScroller();
    this.initText();
    this.scroller.swiper.addItem(this.zone);
  }

  // ----------------------------------------------------------------------------------------------
  private onScrollerAreaChanging(areaWt: number): void {
    this.setTextWidth(areaWt);
  }

  // ----------------------------------------------------------------------------------------------
  private onScrollerChanged(): void {
    this.update();
  }

  // ----------------------------------------------------------------------------------------------
  private setTextWidth(width: number): void {
    if (this.textObject instanceof Phaser.GameObjects.BitmapText) {
      this.textObject.maxWidth = width;
    } else if (this.textObject instanceof Phaser.GameObjects.Text) {
      this.textObject.setWordWrapWidth(width);
    }
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
export default TextViewComponent;
