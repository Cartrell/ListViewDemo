import BaseComponent from '../components/BaseComponent';
import SliderComponent from '../components/sliders/SliderComponent';
import SliderComponentEvents from '../components/sliders/SliderComponentEvents';
import { getPropertyObject } from '../Utils';
import ContentScrollerEvents from './ContentScrollerEvents';
import ContentScrollerSwipper from './ContentScrollerSwipper';
import IContentScrollerTarget from './IContentScrollerTarget';

export default class ContentScroller {
  // ==============================================================================================
  // properties
  // ==============================================================================================
  isLockedHorizontal: boolean;

  isLockedVertical: boolean;

  readonly target: IContentScrollerTarget;

  private _scrollerSwiper: ContentScrollerSwipper;

  private hzSlider: SliderComponent;

  private vtSlider: SliderComponent;
  
  private maskGraphics: Phaser.GameObjects.Graphics;

  private tempBounds: Phaser.Geom.Rectangle;

  private maskSize: Phaser.Geom.Point;

  private tempHzSliderDims: Phaser.Geom.Point;

  private tempVtSliderDims: Phaser.Geom.Point;

  private tempMaskSize: Phaser.Geom.Point;

  private _enabled: boolean;

  // ==============================================================================================
  // public
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  constructor(target: IContentScrollerTarget) {
    this.target = target;
    this.isLockedHorizontal = false;
    this.isLockedVertical = false;
    this._enabled = true;
    this.initMask();
    this.initSliders();
    this.initScrollerSwipper();
    this.update();
  }

  // ----------------------------------------------------------------------------------------------
  get component(): BaseComponent {
    const target = this.target;
    return (target ? target.component : null);
  }

  // ----------------------------------------------------------------------------------------------
  destroy(): void {
    this.destroyMask();
    this.destroySliders();
    this.destroySwiper();
  }

  // ----------------------------------------------------------------------------------------------
  get enabled(): boolean {
    return (this._enabled);
  }
  
  // ----------------------------------------------------------------------------------------------
  set enabled(value: boolean) {
    this._enabled = value;
    
    if (this.hzSlider) {
      this.hzSlider.enabled = this._enabled;
    }

    if (this.vtSlider) {
      this.vtSlider.enabled = this._enabled;
    }

    if (this._scrollerSwiper) {
      this._scrollerSwiper.enabled = this._enabled;
    }
  }
  
  // ----------------------------------------------------------------------------------------------
  get events(): Phaser.Events.EventEmitter {
    const comp = this.component;
    return (comp ? comp.events : null);
  }

  // ----------------------------------------------------------------------------------------------
  getMaskSize(sizeOut?: Phaser.Geom.Point): Phaser.Geom.Point {
    if (sizeOut) {
      sizeOut.setTo(this.maskSize.x, this.maskSize.y);
    } else {
      sizeOut = Phaser.Geom.Point.Clone(this.maskSize);
    }

    return (sizeOut);
  }

  // ----------------------------------------------------------------------------------------------
  get horizontalSlider(): SliderComponent {
    return (this.hzSlider);
  }

  // ----------------------------------------------------------------------------------------------
  get horizontalSliderValue(): number {
    return (this.hzSlider ? this.hzSlider.value : 0);
  }

  // ----------------------------------------------------------------------------------------------
  set horizontalSliderValue(value: number) {
    if (this.hzSlider) {
      this.hzSlider.value = value;
      this.update();
    }
  }

  // ----------------------------------------------------------------------------------------------
  get scene(): Phaser.Scene {
    const comp = this.component;
    return (comp ? comp.scene : null);
  }
  
  // ----------------------------------------------------------------------------------------------
  setPosition(x?: number, y?: number): void {
    x = x || this.x;
    y = y || this.y;

    this.maskGraphics.setPosition(x, y);
  }

  // ----------------------------------------------------------------------------------------------
  get swiper(): ContentScrollerSwipper {
    return (this._scrollerSwiper);
  }

  // ----------------------------------------------------------------------------------------------
  update(): void {
    const target = this.target;
    if (!target) {
      return;
    }
    
    this.tempMaskSize = this.getMaskSize(this.tempMaskSize);
    
    const hzSlider = this.horizontalSlider;
    this.tempHzSliderDims = this.getSliderDimensions(hzSlider, this.tempHzSliderDims);

    const vtSlider = this.verticalSlider;
    this.tempVtSliderDims = this.getSliderDimensions(vtSlider, this.tempVtSliderDims);

    let hzChanged: boolean;
    let vtChanged: boolean;

    do {
      hzChanged = this.updateScrollerHz(hzSlider, vtSlider);
      vtChanged = this.updateScrollerVt(vtSlider, hzSlider);
    } while (hzChanged || vtChanged);

    this.updateMask(this.tempMaskSize.x, this.tempMaskSize.y);
  }

  // ----------------------------------------------------------------------------------------------
  get verticalSlider(): SliderComponent {
    return (this.vtSlider);
  }

  // ----------------------------------------------------------------------------------------------
  get verticalSliderValue(): number {
    return (this.vtSlider ? this.vtSlider.value : 0);
  }

  // ----------------------------------------------------------------------------------------------
  set verticalSliderValue(value: number) {
    if (this.vtSlider) {
      this.vtSlider.value = value;
      this.update();
    }
  }

  // ----------------------------------------------------------------------------------------------
  get x(): number {
    return (this.maskGraphics ? this.maskGraphics.x : 0);
  }

  // ----------------------------------------------------------------------------------------------
  set x(value: number) {
    this.setPosition(value);
  }

  // ----------------------------------------------------------------------------------------------
  get y(): number {
    return (this.maskGraphics ? this.maskGraphics.y : 0);
  }

  // ----------------------------------------------------------------------------------------------
  set y(value: number) {
    this.setPosition(undefined, value);
  }

  // ==============================================================================================
  // "internal"
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  /** @internal */
  _handleSliderChanged(slider: SliderComponent): void {
    const events = this.events;
    if (events) {
      events.emit(ContentScrollerEvents.CHANGED, slider.isHorizontal, slider.value, this);
    }
  }

  // ==============================================================================================
  // private
  // ==============================================================================================
  
  // ----------------------------------------------------------------------------------------------
  private destroyMask(): void {
    this.maskGraphics.destroy();

    const target = this.target;
    if (target) {
      const DESTROY_MASK = true;
      target.container.clearMask(DESTROY_MASK);
    }
  }

  // ----------------------------------------------------------------------------------------------
  private destroySliders(): void {
    if (this.hzSlider) {
      this.hzSlider.destroy();
    }

    if (this.vtSlider) {
      this.vtSlider.destroy();
    }
  }

  // ----------------------------------------------------------------------------------------------
  private destroySwiper(): void {
    if (this._scrollerSwiper) {
      this._scrollerSwiper.destroy();
    }
  }

  // ----------------------------------------------------------------------------------------------
  private getSliderDimensions(slider: SliderComponent, out: Phaser.Geom.Point): Phaser.Geom.Point {
    if (!out) {
      out = new Phaser.Geom.Point();
    }

    if (!slider) {
      out.setTo(0, 0);
      return (out);
    }

    const sliderGameObject = slider.getGameObject() as Phaser.GameObjects.Container;
    this.tempBounds = sliderGameObject.getBounds(this.tempBounds);
    out.setTo(this.tempBounds.width, this.tempBounds.height);
    return (out);
  }

  // ----------------------------------------------------------------------------------------------
  private initMask(): void {
    const target = this.target;
    if (target) {
      this.updateMask(target.areaWidth, target.areaHeight);
    }
  }

  // ----------------------------------------------------------------------------------------------
  private initSlider(imagePropName: string, size: number): SliderComponent {
    if (!imagePropName) {
      return (null);
    }

    const gameObject = getPropertyObject(this.scene, imagePropName) as
      Phaser.GameObjects.Container;
    
    if (!gameObject) {
      console.warn(`No slider image with name "${imagePropName}" found.`);
      return (null);
    }

    const slider = SliderComponent.getComponent(gameObject);
    if (!slider) {
      console.warn(`No slider component attached to an image with var name "${imagePropName}".`);
      return (null);
    }

    slider.size = size;
    slider.events.on(SliderComponentEvents.CHANGED, this.onSliderChange, this);

    return (slider);
  }

  // ----------------------------------------------------------------------------------------------
  private initScrollerSwipper(): void {
    this._scrollerSwiper = new ContentScrollerSwipper(this);
  }

  // ----------------------------------------------------------------------------------------------
  private initSliders(): void {
    const target = this.target;
    if (!target) {
      console.warn('Unable to setup slider components: no content scroller target specified.');
      return;
    }

    this.hzSlider = this.initSlider(target.hzSliderName, target.areaWidth);
    this.vtSlider = this.initSlider(target.vtSliderName, target.areaHeight);
  }

  // ----------------------------------------------------------------------------------------------
  private onSliderChange(slider: SliderComponent): void {
    this._handleSliderChanged(slider);
  }

  // ----------------------------------------------------------------------------------------------
  private updateMask(width: number, height: number): void {
    if (this.maskSize) {
      if (this.maskSize.x === width && this.maskSize.y === height) {
        // specified size same as current mask size; no need to create a new mask
        return;
      }

      this.maskSize.setTo(width, height);
    } else {
      this.maskSize = new Phaser.Geom.Point(width, height);
    }

    if (this.maskGraphics) {
      this.maskGraphics.clear();
    } else {
      const comp = this.component;
      const transform = comp.getGameObject() as unknown as Phaser.GameObjects.Components.Transform;
      this.maskGraphics = comp.scene.make.graphics({
        x: transform.x,
        y: transform.y,
      });

      this.target.container.mask = this.maskGraphics.createGeometryMask();
    }

    this.maskGraphics.fillRect(0, 0, this.maskSize.x, this.maskSize.y);
  }

  // ----------------------------------------------------------------------------------------------
  private updateScrollerHz(hzSlider: SliderComponent, vtSlider: SliderComponent): boolean {
    if (!hzSlider) {
      return (false);
    }
    
    const target = this.target;
    const events = this.events;
    let changed = false;
    
    if (target.contentWidth > this.tempMaskSize.x) {
      if (!hzSlider.visible) {
        changed = true;
        hzSlider.visible = true;
        this.tempMaskSize.y = target.areaHeight - this.tempHzSliderDims.y;

        const sliderGameObject = hzSlider.getGameObject() as Phaser.GameObjects.Container;
        sliderGameObject.x = 0;
        sliderGameObject.y = this.tempMaskSize.y;
      }

      if (vtSlider && vtSlider.visible) {
        hzSlider.size = target.areaWidth - this.tempVtSliderDims.x;
      } else {
        hzSlider.size = target.areaWidth;
      }

      if (!this.isLockedHorizontal) {
        target.container.x = (this.tempMaskSize.x - target.contentWidth) * hzSlider.value;
      }
    } else if (hzSlider.visible) {
      changed = true;
      target.container.x = 0;
      this.tempMaskSize.y = target.areaHeight;
      hzSlider.visible = false;
      hzSlider.value = 0;
    }

    if (changed) {
      events.emit(ContentScrollerEvents.AREA_CHANGING, this.tempMaskSize.x, this.tempMaskSize.y,
        this);
    }

    return (changed);
  }

  // ----------------------------------------------------------------------------------------------
  private updateScrollerVt(vtSlider: SliderComponent, hzSlider: SliderComponent): boolean {
    if (!vtSlider) {
      return (false);
    }
    
    const target = this.target;
    const events = this.events;
    let changed = false;
    
    if (target.contentHeight > this.tempMaskSize.y) {
      if (!vtSlider.visible) {
        changed = true;
        vtSlider.visible = true;
        this.tempMaskSize.x = target.areaWidth - this.tempVtSliderDims.x;
        
        const sliderGameObject = vtSlider.getGameObject() as Phaser.GameObjects.Container;
        sliderGameObject.x = this.tempMaskSize.x;
        sliderGameObject.y = 0;
      }

      if (hzSlider && hzSlider.visible) {
        vtSlider.size = target.areaHeight - this.tempHzSliderDims.y;
      } else {
        vtSlider.size = target.areaHeight;
      }

      if (!this.isLockedVertical) {
        target.container.y = (this.tempMaskSize.y - target.contentHeight) * vtSlider.value;
      }
    } else if (vtSlider.visible) {
      changed = true;
      target.container.y = 0;
      this.tempMaskSize.x = target.areaWidth;
      vtSlider.visible = false;
      vtSlider.value = 0;
    }

    if (changed) {
      events.emit(ContentScrollerEvents.AREA_CHANGING, this.tempMaskSize.x, this.tempMaskSize.y,
        this);
    }

    return (changed);
  }
}
