import ContentScroller from './ContentScroller';
import ContentScrollerEvents from './ContentScrollerEvents';

export default class ContentScrollerSwipper {
  // ==============================================================================================
  // properties
  // ==============================================================================================
  static readonly DEFAULT_PRE_SWIPE_DISTANCE = 3;

  static readonly DEFAULT_WHEEL_VALUE = 0.08;

  static readonly DEFAULT_IS_WHEEL_VERTICAL = true;

  isHorizontalEnabled: boolean;

  isVerticalEnabled: boolean;

  preSwipeDistance: number;

  wheelValue: number;

  isWheelVertical: boolean;

  private items: Phaser.GameObjects.GameObject[];

  private scroller: ContentScroller;

  private finishTween: Phaser.Tweens.Tween;

  private tempMaskSize: Phaser.Geom.Point;

  private xPrev: number;

  private yPrev: number;

  private xDeltaPx: number;

  private yDeltaPx: number;

  private isHzSwipe: boolean;

  private isVtSwipe: boolean;

  private _enabled: boolean;

  // ==============================================================================================
  // public
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  constructor(scroller: ContentScroller) {
    this.scroller = scroller;
    this.init();
  }

  // ----------------------------------------------------------------------------------------------
  addItem(item: Phaser.GameObjects.GameObject): void {
    if (!item) {
      return;
    }

    Phaser.Utils.Array.Add(
      this.items,
      item,
      0,
      () => {
        if (!item.input) {
          item.setInteractive();
        }

        item.once(Phaser.GameObjects.Events.DESTROY, this.onItemGameObjectDestroy, this);
        item.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.onItemGameObjectPointerDown,
          this);
        item.on(Phaser.Input.Events.GAMEOBJECT_POINTER_WHEEL,
          this.onItemGameObjectPointerWheel, this);
      },
      this,
    );
  }

  // ----------------------------------------------------------------------------------------------
  destroy(fromGameObject?: boolean): void {
    if (!fromGameObject) {
      const gameObject = this.scroller.component.getGameObject();
      if (gameObject) {
        gameObject.off(Phaser.GameObjects.Events.DESTROY, this.onGameObjectDestroy, this);
      } 
    }
    
    this.removeAllItems();
    this.offInputEvents();
    this.destroyFinishTween();
  }

  // ----------------------------------------------------------------------------------------------
  get enabled(): boolean {
    return (this._enabled);
  }
  
  // ----------------------------------------------------------------------------------------------
  set enabled(value: boolean) {
    const v = !!value;
    if (this._enabled === v) {
      return;
    }

    this._enabled = v;
    
    if (this._enabled) {
      this.resetInputEvents();
    } else {
      this.offInputEvents();
      this.destroyFinishTween();
    }
  }
  
  // ----------------------------------------------------------------------------------------------
  removeItem(item: Phaser.GameObjects.GameObject): void {
    Phaser.Utils.Array.Remove(this.items, item, this.onItemGameObjectRemoved, this);
  }

  // ----------------------------------------------------------------------------------------------
  removeAllItems(): void {
    for (let index = this.items.length - 1; index >= 0; index -= 1) {
      const item = this.items.pop();
      this.onItemGameObjectRemoved(item);
    }
  }

  // ==============================================================================================
  // private
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  private beginTweenFinish(): void {
    // Slow the deltas down a little bit before tweening starts, because it can create a sudden
    // speed up in the sliding stop.
    const DELTA_CLIP = 0.5;
    this.xDeltaPx *= DELTA_CLIP;
    this.yDeltaPx *= DELTA_CLIP;

    const DURATION_MS = 1000;
    
    this.finishTween = this.scroller.scene.tweens.add({
      targets: this,

      props: {
        xDeltaPx: 0,
        yDeltaPx: 0,
      },

      duration: DURATION_MS,

      callbackScope: this,
      onUpdate: this.onTweenFinishUpdate,
    });
  }

  // ----------------------------------------------------------------------------------------------
  private clearPrevPosition(): void {
    this.xPrev = undefined;
    this.yPrev = undefined;
  }

  // ----------------------------------------------------------------------------------------------
  private destroyFinishTween(): void {
    if (this.finishTween) {
      this.finishTween.remove();
      this.finishTween = null;
    }
  }

  // ----------------------------------------------------------------------------------------------
  private handleFinishTweenHorizontal(): void {
    const target = this.scroller.target;
    const maxScrPosPx = target.contentWidth - target.areaWidth;
    const deltaPos = (1 / maxScrPosPx) * this.xDeltaPx;
    this.scroller.horizontalSliderValue += deltaPos;
  }

  // ----------------------------------------------------------------------------------------------
  private handleFinishTweenVertical(): void {
    const target = this.scroller.target;
    
    this.tempMaskSize = this.scroller.getMaskSize(this.tempMaskSize);
    const maxScrPosPx = target.contentHeight - this.tempMaskSize.y;
    if (maxScrPosPx <= 0) {
      return;
    }

    const deltaPos = (1 / maxScrPosPx) * this.yDeltaPx;
    this.scroller.verticalSliderValue += deltaPos;

    this.scroller._handleSliderChanged(this.scroller.verticalSlider);
  }

  // ----------------------------------------------------------------------------------------------
  private handleHorizontal(): void {
    const target = this.scroller.target;
    
    this.tempMaskSize = this.scroller.getMaskSize(this.tempMaskSize);
    const maxScrPosPx = target.contentWidth - this.tempMaskSize.x;
    if (maxScrPosPx <= 0) {
      return;
    }

    const pointer = this.scroller.scene.input.activePointer;
    this.xDeltaPx = this.xPrev !== undefined ? this.xPrev - pointer.x : 0;
    const deltaPos = (1 / maxScrPosPx) * this.xDeltaPx;
    this.scroller.horizontalSliderValue += deltaPos;
    this.xPrev = pointer.x;

    this.scroller._handleSliderChanged(this.scroller.horizontalSlider);
  }

  // ----------------------------------------------------------------------------------------------
  private handleHorizontalPreSwipe(): void {
    const pointer = this.scroller.scene.input.activePointer;
    const xDelta = pointer.getDistanceX();
    if (xDelta < this.preSwipeDistance) {
      return;
    }

    this.isHzSwipe = true;
    this.beginSwipe();
  }

  // ----------------------------------------------------------------------------------------------
  private handleVertical(): void {
    const target = this.scroller.target;
    
    this.tempMaskSize = this.scroller.getMaskSize(this.tempMaskSize);
    const maxScrPosPx = target.contentHeight - this.tempMaskSize.y;
    if (maxScrPosPx <= 0) {
      return;
    }

    const pointer = this.scroller.scene.input.activePointer;
    this.yDeltaPx = this.yPrev !== undefined ? this.yPrev - pointer.y : 0;
    const deltaPos = (1 / maxScrPosPx) * this.yDeltaPx;
    this.scroller.verticalSliderValue += deltaPos;
    this.yPrev = pointer.y;

    this.scroller._handleSliderChanged(this.scroller.verticalSlider);
  }

  // ----------------------------------------------------------------------------------------------
  private handleVerticalPreSwipe(): void {
    const pointer = this.scroller.scene.input.activePointer;
    const yDelta = pointer.getDistanceY();
    if (yDelta < this.preSwipeDistance) {
      return;
    }

    this.isVtSwipe = true;
    this.beginSwipe();
  }

  // ----------------------------------------------------------------------------------------------
  private beginSwipe(): void {
    this.scroller.scene.events.off(Phaser.Scenes.Events.UPDATE,
      this.onScenePointerUpdateMovePreSwipe, this);
    
    this.scroller.scene.events.on(Phaser.Scenes.Events.UPDATE,
      this.onScenePointerUpdateMove, this);
  }

  // ----------------------------------------------------------------------------------------------
  private init(): void {
    this.items = [];

    this.preSwipeDistance = ContentScrollerSwipper.DEFAULT_PRE_SWIPE_DISTANCE;
    this.wheelValue = ContentScrollerSwipper.DEFAULT_WHEEL_VALUE;
    this.isWheelVertical = ContentScrollerSwipper.DEFAULT_IS_WHEEL_VERTICAL;

    const gameObject = this.scroller.component.getGameObject();
    gameObject.once(Phaser.GameObjects.Events.DESTROY, this.onGameObjectDestroy, this);

    this.isHorizontalEnabled = true;
    this.isVerticalEnabled = true;
    this.enabled = true;
  }

  // ----------------------------------------------------------------------------------------------
  private offInputEvents(): void {
    const scene = this.scroller.scene;
    scene.events.off(Phaser.Scenes.Events.UPDATE, this.onScenePointerUpdateMove, this);
    scene.events.off(Phaser.Scenes.Events.UPDATE, this.onScenePointerUpdateMovePreSwipe, this);
    scene.input.off(Phaser.Input.Events.POINTER_UP, this.onScenePointerUp, this);
  }

  // ----------------------------------------------------------------------------------------------
  private onGameObjectDestroy(): void {
    const FROM_GAME_OBJECT = true;
    this.destroy(FROM_GAME_OBJECT);
  }

  // ----------------------------------------------------------------------------------------------
  private onItemGameObjectDestroy(item: Phaser.GameObjects.GameObject): void {
    this.removeItem(item);
  }

  // ----------------------------------------------------------------------------------------------
  private onItemGameObjectPointerDown(): void {
    this.isHzSwipe = false;
    this.isVtSwipe = false;
    this.clearPrevPosition();
    this.destroyFinishTween();

    const scene = this.scroller.scene;
    scene.events.on(Phaser.Scenes.Events.UPDATE, this.onScenePointerUpdateMovePreSwipe, this);
    scene.input.once(Phaser.Input.Events.POINTER_UP, this.onScenePointerUp, this);
  }

  // ----------------------------------------------------------------------------------------------
  private onItemGameObjectPointerWheel(pointer: Phaser.Input.Pointer, xDelta: number,
    yDelta: number): void {
    const valueOffset = this.wheelValue * (yDelta / Math.abs(yDelta));
    let value: number;
    
    if (this.isWheelVertical) {
      this.scroller.verticalSliderValue += valueOffset;
      value = this.scroller.verticalSliderValue;
    } else {
      this.scroller.horizontalSliderValue += valueOffset;
      value = this.scroller.horizontalSliderValue;
    }

    this.scroller.events.emit(ContentScrollerEvents.CHANGED, !this.isWheelVertical, value,
      this.scroller);
  }

  // ----------------------------------------------------------------------------------------------
  private onItemGameObjectRemoved(item: Phaser.GameObjects.GameObject): void {
    item.off(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.onItemGameObjectPointerDown,
      this);
    item.off(Phaser.GameObjects.Events.DESTROY, this.onItemGameObjectDestroy, this);
    item.off(Phaser.Input.Events.GAMEOBJECT_POINTER_WHEEL, this.onItemGameObjectPointerWheel,
      this);
  }

  // ----------------------------------------------------------------------------------------------
  private onScenePointerUpdateMove(): void {
    if (!this.enabled) {
      return;
    }

    if (this.isHzSwipe && this.isHorizontalEnabled) {
      this.handleHorizontal();
    }

    if (this.isVtSwipe && this.isVerticalEnabled) {
      this.handleVertical();
    }
  }

  // ----------------------------------------------------------------------------------------------
  private onScenePointerUpdateMovePreSwipe(): void {
    if (!this.enabled) {
      return;
    }

    if (this.scroller.horizontalSlider && this.isHorizontalEnabled) {
      this.handleHorizontalPreSwipe();
    }

    if (this.scroller.verticalSlider && this.isVerticalEnabled) {
      this.handleVerticalPreSwipe();
    }
  }

  // ----------------------------------------------------------------------------------------------
  private onScenePointerUp(): void {
    if (!this.enabled) {
      return;
    }

    const scene = this.scroller.scene;
    scene.events.off(Phaser.Scenes.Events.UPDATE, this.onScenePointerUpdateMove, this);
    scene.events.off(Phaser.Scenes.Events.UPDATE, this.onScenePointerUpdateMovePreSwipe, this);

    this.beginTweenFinish();
  }

  // ----------------------------------------------------------------------------------------------
  private onTweenFinishUpdate(): void {
    if (this.isHorizontalEnabled && this.isHzSwipe) {
      this.handleFinishTweenHorizontal();
    }

    if (this.isVerticalEnabled && this.isVtSwipe) {
      this.handleFinishTweenVertical();
    }
  }

  // ----------------------------------------------------------------------------------------------
  private resetInputEvents(): void {
    const scene = this.scroller.scene;
    scene.events.off(Phaser.Scenes.Events.UPDATE, this.onScenePointerUpdateMove, this);
    scene.input.off(Phaser.Input.Events.POINTER_UP, this.onScenePointerUp, this);
  }
}
