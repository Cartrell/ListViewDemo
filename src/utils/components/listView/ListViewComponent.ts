// You can write more code here
import { getPropertyImage } from '../../Utils';
import ComponentEvents from '../ComponentEvents';
import SliderComponent from '../sliders/SliderComponent';
import _ListViewEntries from './_ListViewEntries';
import ListViewEntry from './ListViewEntry';
import BaseContentScrollerComponent from '../../contentScroller/BaseContentScrollerComponent';
import ContentScroller from '../../contentScroller/ContentScroller';
import ContentScrollerEvents from '../../contentScroller/ContentScrollerEvents';

// ==============================================================================================
export interface IListViewEntryClass {
  new (scene: Phaser.Scene, x?: number, y?: number,
    children?: Phaser.GameObjects.GameObject[]): ListViewEntry;
}

// ==============================================================================================
/**
 * Interface for a list view item. This is the basic structure to use when adding or referencing
 * items in a list view.
 */
export interface IListViewItem {
  /**
   * The text that is displayed in the label show on th elist view entry item.
   */
  label?: string;

  /**
   * Custom data provided to the list view entry item.
   */
  data?: unknown;
}

// ==============================================================================================

/* eslint-disable */

/* START OF COMPILED CODE */

class ListViewComponent extends BaseContentScrollerComponent {
  
  constructor(gameObject: Phaser.GameObjects.Container) {
    super(gameObject);
    
    gameObject["__ListViewComponent"] = this;
    
    this.gameObject = gameObject;
    this._listEntryClass;
    this.panelName = "panel";
    this.hzSliderName = "hzSlider";
    this.vtSliderName = "vtSlider";
    this.listEntryCallback;
    this.listEntryCallbackContext;
    this.isMultipleSelectionEnabled = false;
    this.defaultEntryMargin = 0;
    
    /* START-USER-CTR-CODE */
    // Write your code here.

    /* eslint-enable */
    
    this.eventEmitter = new Phaser.Events.EventEmitter();
    
    this.gameObject.once(Phaser.Scenes.Events.DESTROY, this.onDestroy, this);
    this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.onSceneUpdateInit, this);
    
    this.entries = new _ListViewEntries(this);

    /* eslint-disable */

    /* END-USER-CTR-CODE */
  }
  
  private gameObject: Phaser.GameObjects.Container;
  
  public _listEntryClass: IListViewEntryClass;
  
  public panelName: string;
  
  public hzSliderName: string;
  
  public vtSliderName: string;
  
  public listEntryCallback: listViewEntryCallback;
  
  public listEntryCallbackContext: unknown;
  
  public isMultipleSelectionEnabled: boolean;
  
  public defaultEntryMargin: number;
  
  static getComponent(gameObject: Phaser.GameObjects.Container): ListViewComponent {
    return gameObject["__ListViewComponent"];
  }
  
  /* START-USER-CODE */

  // Write your code here.

  /* eslint-enable */

  // ==============================================================================================
  // properties
  // ==============================================================================================
  static readonly WAIT_ITEM_TYPE = 'listViewComponent';
  
  private entries: _ListViewEntries;

  private scroller: ContentScroller;
  
  private _entriesContainer: Phaser.GameObjects.Container;

  private _panel: Phaser.GameObjects.Image;

  private eventEmitter: Phaser.Events.EventEmitter;

  private _entryMargin: number;

  private isUpdating: boolean;

  private _isDoublePressEnabled: boolean;

  // ==============================================================================================
  // public
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------  
  /**
   * Adds a new item to the bottom of the list.
   * @param itemOrLabel Can be a `IListViewItem` data, or a string for the label of the item.
   * @param data Custom data for the item.
   * @returns The `IListViewItem` data structure of the item added.
   */
  addItem(itemOrLabel: IListViewItem | string, data?: unknown): IListViewItem {
    return (this.addItemAt(itemOrLabel, Number.MAX_SAFE_INTEGER, data));
  }
  
  // ----------------------------------------------------------------------------------------------  
  /**
   * Adds a new item to the at the specified position in the list. If an item is already at the
   * specified position, this item is placed in front of it.
   * @param itemOrLabel Can be a `IListViewItem` data, or a string for the label of the item.
   * @param index The position within the list to add this item. Values less than zero are added
   * to the beginning of the list. Values greater than the current number of list items will
   * place the item at the end of the list.
   * @param data Custom data for the item.
   * @returns The `IListViewItem` data structure of the item added.
   */
  addItemAt(itemOrLabel: IListViewItem | string, index: number, data?: unknown): IListViewItem {
    const item = this.entries.addItemAt(itemOrLabel, index, data);
    if (item) {
      this.update();
    }
    return (item);
  }
  
  // ----------------------------------------------------------------------------------------------  
  /**
   * The pixel height of the visible area of the list view.
   */
  get areaHeight(): number {
    return (this._panel ? this._panel.displayHeight : 0);
  }

  // ----------------------------------------------------------------------------------------------  
  /**
   * The pixel width of the visible area of the list view.
   */
  get areaWidth(): number {
    return (this._panel ? this._panel.displayWidth : 0);
  }

  // ----------------------------------------------------------------------------------------------  
  /**
   * Removes all items from the list view.
   */
  clear(): void {
    this.entries.clear();
    this.update();
  }

  // ----------------------------------------------------------------------------------------------  
  /**
   * The container that holds all the list view entries.
   */
  get container(): Phaser.GameObjects.Container {
    return (this._entriesContainer);
  }

  // ----------------------------------------------------------------------------------------------  
  /**
   * The pixel height of the list view entries container.
   */
  get contentHeight(): number {
    return (this.entries.contentHeight);
  }
  
  // ----------------------------------------------------------------------------------------------  
  /**
   * The pixel width of the list view entries container.
   */
  get contentWidth(): number {
    return (this.entries.contentWidth);
  }

  // ----------------------------------------------------------------------------------------------  
  /**
   * Destroys this list view and its component Game Object.
   * @param fromGameObject `true` if the this list view is being destroyed because its component
   * Game Object is being destroyed first. Normally, leave this unspecified (default so `false`).
   * If this is `true`m then the list view is still destroyed, but the Game Object will not.
   * Unless you're doing something advanced, normally, you'll not need to do this.
   */
  destroy(fromGameObject = false): void {
    if (this.eventEmitter) {
      this.eventEmitter.emit(ComponentEvents.DESTROY, this);
      this.eventEmitter.destroy();
      this.eventEmitter = null;
    }

    if (this.scroller) {
      this.scroller.destroy();
    }

    if (this.scene) {
      this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.onSceneUpdateInit, this);
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
  /**
   * The vertical pixel margin in between list items. Default is `0`.
   */
  get entryMargin(): number {
    return (this._entryMargin);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * The vertical pixel margin in between list items. Default is `0`.
   */
  set entryMargin(value: number) {
    this.setEntryMargin(value);
    this.update();
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * The Event Emitter.
   */
  get events(): Phaser.Events.EventEmitter {
    return (this.eventEmitter);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The Game Object this list view component is attached to.
   */
  getGameObject(): Phaser.GameObjects.Container {
    return (this.gameObject);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The list item at the specified index or `null` if 
   * @param index 
   */
  getItemAt(index: number): IListViewItem {
    return (this.entries.getItemAt(index));
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The index of list item within this list view or -1 if the item does not exist.
   * @param item The item whose index to retrieve.
   */
  getItemIndex(item: IListViewItem): number {
    return (this.entries.getItemIndex(item));
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The pixel size of the mask used on the list entries container.
   * @param sizeOut If specified, this is filled with the size width and height.
   */
  getMaskSize(sizeOut?: Phaser.Geom.Point): Phaser.Geom.Point {
    return (this.scroller.getMaskSize(sizeOut));
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The rectangular area (position and size) of the panel background.
   * @param rectOut If specified, this is filled with the area 
   */
  getPanelArea(rectOut?: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle {
    if (rectOut) {
      if (this._panel) {
        rectOut.setTo(
          this._panel.x,
          this._panel.y,
          this._panel.displayWidth,
          this._panel.displayHeight,
        );
      } else {
        rectOut.setEmpty();
      }
    } else {
      rectOut = this.getPanelArea(new Phaser.Geom.Rectangle());
    }

    return (rectOut);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The horizontal `SliderComponent`.
   */
  get horizontalSlider(): SliderComponent {
    return (this.scroller.horizontalSlider);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Determines if the list items respond to double-press pointer input.
   */
  get isDoublePressEnabled(): boolean {
    return (this._isDoublePressEnabled);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Specifies if the list items respond to double-press pointer input. If `true`, this component
   * will emit `ListViewEvents.LIST_ITEM_DOUBLE_PRESSED` when an item is double-pressed.
   */
  set isDoublePressEnabled(value: boolean) {
    this._isDoublePressEnabled = value;
    this.entries.setDoublePressEnabled(value);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The class used to create list view entries.
   */
  get listEntryClass(): IListViewEntryClass {
    return (this._listEntryClass);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The class used to create list view entries.
   */
  set listEntryClass(value: IListViewEntryClass) {
    this._listEntryClass = value;
    this.entries.listEntryClass = value;
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The number of list view entries in this list.
   */
  get numEntries(): number {
    return (this.entries.entriesData.length);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The number of currently selected entries in the list.
   */
  get numSelectedEntries(): number {
    return (this.entries.selector.length);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The number of currently visible entries in the list.
   */
  get numVisibleEntries(): number {
    return (this.entries.numVisibleEntries);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The background panel image.
   */
  get panel(): Phaser.GameObjects.Image {
    return (this._panel);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Removes an item from the list.
   * @param item The item to remove.
   * @returns `true` if the item was successfully removed.
   */
  removeItem(item: IListViewItem): boolean {
    const ok = this.entries.removeItem(item);
    if (ok) {
      this.update();
    }
    return (ok);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Removes an item at the specified index from the list.
   * @param index The index of the item to remove.
   * @returns The `IListViewItem` of the item if it was successfully removed, or `null` if not.
   */
  removeItemAt(index: number): IListViewItem {
    const item = this.entries.removeItemAt(index);
    if (item) {
      this.update();
    }
    return (item);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Removes one or more items from the list.
   * @param items An array of the items to remove.
   * @returns The number of items successfully removed from the list.
   */
  removeItems(items: IListViewItem[]): number {
    if (!items) {
      return (0);
    }

    let numRemoved = 0;

    items.forEach((item) => {
      if (this.entries.removeItem(item)) {
        numRemoved += 1;
      }
    }, this);

    if (numRemoved > 0) {
      this.update();
    }

    return (numRemoved);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Selects all the items in the list. Note that this will only work if the
   * `isMultipleSelectionEnabled` property is `true`.
   */
  selectAll(): void {
    if (this.isMultipleSelectionEnabled || this.numEntries === 1) {
      this.entries.selector.selectAll();
    }
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The index of the selected item, or the first selected index if multiple items are
   * selected.
   */
  get selectedIndex(): number {
    return (this.entries.selector.getSelectedIndexes()[0]);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Selects the item at the specified index.
   */
  set selectedIndex(value: number) {
    this.entries.selector.selectIndexes([value]);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns An array of the indexs of all selected items.
   */
  get selectedIndexes(): number[] {
    return (this.entries.selector.getSelectedIndexes());
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Selects multiple items by their index positions within the list.
   */
  set selectedIndexes(values: number[]) {
    this.entries.selector.selectIndexes(values);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns An array of `IListViewItem` of all selected items.
   */
  get selectedItems(): IListViewItem[] {
    return (this.entries.selector.getSelectedItems());
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Selects multiple items by their `IListViewItem` references.
   */
  set selectedItems(values: IListViewItem[]) {
    this.entries.selector.selectItems(values);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Selects or unselects an item in the list.
   * @param item The affected item.
   * @param isSelected `true` if the item should be selected or `false` if it should be unselected.
   */
  selectItem(item: IListViewItem, isSelected: boolean): void {
    if (isSelected) {
      this.entries.selector.selectItem(item);
    } else {
      this.entries.selector.unselectItem(item);
    }
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Selects or unselects an item at the specified index in the list.
   * @param index The index of the affected item.
   * @param isSelected `true` if the item should be selected or `false` if it should be unselected.
   */
  selectItemAt(index: number, isSelected: boolean): void {
    const item = this.entries.getItemAt(index);
    this.selectItem(item, isSelected);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Sets the item data of a list item.
   * @param index The index of the affected item.
   * @param item The new item reference to apply.
   */
  setItemAt(index: number, item: IListViewItem): boolean {
    if (!this.entries.setItemAt(index, item)) {
      return (false);
    }

    this.update();
    return (true);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Sets the position of this list. Note: Use this instead of the Game Object to set the list
   * view's position.
   * @param x The x coordinate of the new position. If `undefined`, the current position is used.
   * @param y The y coordinate of the new position. If `undefined`, the current position is used.
   */
  setPosition(x?: number, y?: number): void {
    x = x === undefined ? this.x : x;
    y = y === undefined ? this.y : y;
    
    if (this.gameObject) {
      this.gameObject.x = x;
      this.gameObject.y = y;
    }

    if (this.scroller) {
      this.scroller.x = x;
      this.scroller.y = y;
    }    
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Unselects all entries in the list.
   */
  unselectAll(): void {
    this.entries.selector.unselectAll();
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Unselects one or more items in the list.
   * @param items A single `IListViewItem` or an array of `IListViewItem` to unselect.
   */
  unselectItems(items: IListViewItem | IListViewItem[]): void {
    if (!Array.isArray(items)) {
      items = [items];
    }

    items.forEach((item) => {
      this.entries.selector.unselectItem(item);
    }, this);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Unselects one or more items in the list using their index positions.
   * @param indexes A single index or an array of indexes of items to unselect.
   */
  unselectItemsAt(indexes: number | number[]): void {
    if (typeof indexes === 'number') {
      const item = this.getItemAt(indexes);
      this.entries.selector.unselectItem(item);
    } else {
      if (!indexes) {
        return;
      }

      const sortedAsc = indexes.concat().sort((index1, index2) => index1 - index2);
      while (sortedAsc.length) {
        this.unselectItemsAt(sortedAsc.pop());
      }
    }
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Updates the inner list entries container and scroll UI. Normally you do not need to call this.
   */
  update(): void {
    if (!this._panel || this.isUpdating) {
      return;
    }

    this.isUpdating = true;
    
    this.scroller.update();
    this.entries.update();

    this.isUpdating = false;  
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The vertical `SliderComponent`.
   */
  get verticalSlider(): SliderComponent {
    return (this.scroller.verticalSlider);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * The scroll value of the mouse wheel.
   */
  get wheelValue(): number {
    return (this.scroller ? this.scroller.swiper.wheelValue : 0);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * The scroll value of the mouse wheel.
   */
  set wheelValue(value: number) {
    if (this.scroller) {
      this.scroller.swiper.wheelValue = value;
    }
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The x position of the list view.
   */
  get x(): number {
    return (this.gameObject ? this.gameObject.x : 0);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Sets the x position of the list view. Note: Use this instead of the Gam Object to set the
   * x position.
   */
  set x(value: number) {
    this.setPosition(value);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The y position of the list view.
   */
  get y(): number {
    return (this.gameObject ? this.gameObject.y : 0);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Sets the y position of the list view. Note: Use this instead of the Gam Object to set the
   * y position.
   */
  set y(value: number) {
    this.setPosition(undefined, value);
  }

  // ==============================================================================================
  // internal
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  /** @internal */
  _addSwipableItem(entry: ListViewEntry): void {
    this.scroller.swiper.addItem(entry.buttonComponent.getGameObject());
  }

  // ----------------------------------------------------------------------------------------------
  /** @internal */
  _removeSwipableItem(entry: ListViewEntry): void {
    this.scroller.swiper.removeItem(entry.buttonComponent.getGameObject());
  }

  // ==============================================================================================
  // private
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  /**
   * Initializes the entries container.
   */
  private initEntriesContainer(): void {
    if (!this.panel) {
      return;
    }

    this._entriesContainer = this.scene.add.container(this.panel.x, this.panel.y);

    const panelIndex = this.getGameObject().getIndex(this.panel);
    this.getGameObject().addAt(this._entriesContainer, panelIndex + 1);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Initializes the background panel.
   */
  private initPanel(): void {
    if (!this.panelName) {
      console.warn('A panel image is required for the ListViewComponent to work.');
      return;
    }

    this._panel = getPropertyImage(this.scene, this.panelName);
    if (!this._panel) {
      console.warn(`No panel image named "${this.panelName}" was found. `
        + 'A panel image is required for the ListViewComponent to work.');
    }
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Initializes the internal scroller. This also handles swiping gestures for scrolling.
   */
  private initScroller(): void {
    this.scroller = new ContentScroller(this);
    this.scroller.isLockedVertical = true;
    this.scroller.swiper.isHorizontalEnabled = false;
    this.scroller.events.on(ContentScrollerEvents.CHANGED, this.onContentScrollerChanged, this);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Callback fired each time the scroller has changed position.
   */
  private onContentScrollerChanged(): void {
    this.update();
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Callback fired if the companent's Game Object has been destroyed. This is not called if
   * you call `destroy` directly on this component.
   */
  private onDestroy(): void {
    const FROM_GAME_OBJECT = true;
    this.destroy(FROM_GAME_OBJECT);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * A one-time Scene update that is fired on the next frame after the component is created. This
   * initializes all the other objects that the list view uses. If you need to use the list view
   * immediately after it is created.
   */
  private onSceneUpdateInit(): void {
    this.entries.listEntryClass = this._listEntryClass;
    this.setEntryMargin(this.defaultEntryMargin);
    this.initPanel();
    this.initEntriesContainer();
    this.initScroller();
    this.events.emit(ComponentEvents.INIT, this);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Sets the entry margin for entries in this list.
   * @param value The pixel value of the margins.
   */
  private setEntryMargin(value: number): void {
    if (Number.isNaN(value) || typeof value !== 'number') {
      this._entryMargin = 0;
    } else {
      this._entryMargin = Math.max(0, value);
    }
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here

// ==============================================================================================

/**
 * Callback data used in `ListViewEvent`.
 */
export interface IListViewCallbackData {
  /**
   * The affected item of the event.
   */
  item: IListViewItem;

  /**
   * The position index of the item within the list.
   */
  index: number;

  /**
   * The list view component of the affected item.
   */
  listViewComponent: ListViewComponent;
}

/**
 * Shorthand type for list view component event callbacks.
 */
export type listViewEntryCallback = (data: IListViewCallbackData) => void;

export default ListViewComponent;
