import ButtonComponentEvents from '../buttons/ButtonComponentEvents';
import ListViewComponent, { IListViewCallbackData, IListViewEntryClass, IListViewItem } from './ListViewComponent';
import _ListViewEntriesSelector from './_ListViewEntriesSelector';
import ListViewEntry from './ListViewEntry';
import ListViewEvents from './ListViewEvents';

// ==============================================================================================
interface IListViewFirstEntryData {
  index?: number;
  y?: number;
}

// ==============================================================================================
/**
 * @internal
 */
export interface _IListViewEntryData {
  item: IListViewItem;
  width?: number;
  height?: number;
  isSelected?: boolean;
}

/**
 * @internal
 */
export default class _ListViewEntries {
  // ==============================================================================================
  // properties
  // ==============================================================================================
  listEntryClass: IListViewEntryClass;

  entriesData: _IListViewEntryData[];

  entriesInUse: ListViewEntry[];

  selector: _ListViewEntriesSelector;

  private freeEntries: ListViewEntry[];

  private listViewComponent: ListViewComponent;

  private panelArea: Phaser.Geom.Rectangle;

  private updateMaskSize: Phaser.Geom.Point;

  // ==============================================================================================
  // public
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  constructor(listViewComponent: ListViewComponent) {
    this.listViewComponent = listViewComponent;
    this.freeEntries = [];
    this.entriesInUse = [];
    this.entriesData = [];
    this.selector = new _ListViewEntriesSelector(listViewComponent, this);
  }

  // ----------------------------------------------------------------------------------------------  
  addItem(itemOrLabel: IListViewItem | string, data?: unknown): IListViewItem {
    return (this.addItemAt(itemOrLabel, this.entriesData.length, data));
  }

  // ----------------------------------------------------------------------------------------------  
  addItemAt(itemOrLabel: IListViewItem | string, index: number, data?: unknown): IListViewItem {
    if (!itemOrLabel) {
      return (null);
    }

    let item: IListViewItem;

    if (typeof itemOrLabel === 'string') {
      item = {
        data,
        label: itemOrLabel,
      };
    } else {
      item = itemOrLabel;
    }

    const entry = this.getFreeOrCreateEntry();
    if (!entry) {
      return (null);
    }

    entry.setEntryData(item);
    const entrySize = entry.getContentSize();
    const entryData: _IListViewEntryData = {
      item,
      width: entrySize.x,
      height: entrySize.y,
      isSelected: false,
    };
    
    index = Phaser.Math.Clamp(index, 0, this.entriesData.length);
    if (index === this.entriesData.length) {
      this.entriesData.push(entryData);
    } else if (index === 0) {
      this.entriesData.unshift(entryData);
    } else {
      this.entriesData.splice(index, 0, entryData);
    }
    
    entry.clearEntryData();
    this.freeEntries.push(entry);
    
    return (item);
  }

  // ----------------------------------------------------------------------------------------------  
  clear(): void {
    this.entriesData.length = 0;
    this.selector.unselectAll();
  }

  // ----------------------------------------------------------------------------------------------  
  get contentHeight(): number {
    let totalHeight = 0;
    
    this.entriesData.forEach((entryData) => {
      totalHeight += entryData.height;
    });

    const entryMargin = Math.max(0, this.listViewComponent.entryMargin);
    const totalMarginsHeight = (this.entriesData.length - 1) * entryMargin;
    return (totalHeight + totalMarginsHeight);
  }
  
  // ----------------------------------------------------------------------------------------------  
  get contentWidth(): number {
    let maxEntryWidth = 0;

    this.entriesData.forEach((entryData) => {
      maxEntryWidth = Math.max(entryData.width, maxEntryWidth);
    });

    return (maxEntryWidth);
  }

  // ----------------------------------------------------------------------------------------------
  getEntryDataFromItem(item: IListViewItem): _IListViewEntryData {
    return (this.entriesData.find((data) => data.item === item));
  }

  // ----------------------------------------------------------------------------------------------
  getItemAt(index: number): IListViewItem {
    const data = this.entriesData[index];
    return (data ? data.item : null);
  }

  // ----------------------------------------------------------------------------------------------
  getItemIndex(item: IListViewItem): number {
    return (this.entriesData.findIndex((entryData) => entryData.item === item));
  }

  // ----------------------------------------------------------------------------------------------
  get numSelectedEntries(): number {
    return (this.selector.length);
  }

  // ----------------------------------------------------------------------------------------------
  get numVisibleEntries(): number {
    return (this.entriesInUse.length);
  }

  // ----------------------------------------------------------------------------------------------
  removeItem(item: IListViewItem): boolean {
    const index = this.getItemIndex(item);
    return (this.removeItemAt(index) !== null);
  }

  // ----------------------------------------------------------------------------------------------
  removeItemAt(index: number): IListViewItem {
    if (index < 0 || index >= this.entriesData.length) {
      // sanity check
      return (null);
    }

    const data = this.entriesData[index];
    if (!data) {
      // sanity check
      return (null);
    }

    this.selector.unselectEntry(data);

    this.entriesData.splice(index, 1);
    return (data.item);
  }

  // ----------------------------------------------------------------------------------------------
  setAt(index: number, entry: ListViewEntry): boolean {
    if (entry && index > -1) {
      this.entriesInUse[index] = entry;
      return (true);
    }

    return (false);
  }

  // ----------------------------------------------------------------------------------------------
  setDoublePressEnabled(isEnabled: boolean): void {
    this.entriesInUse.forEach((entry) => {
      entry.setDoublePressEnabled(isEnabled);
    });
  }

  // ----------------------------------------------------------------------------------------------
  setItemAt(index: number, item: IListViewItem): boolean {
    if (index < 0 || index >= this.entriesData.length) {
      // sanity check
      return (false);
    }

    const entryData = this.entriesData[index];
    if (!entryData) {
      // sanity check
      return (false);
    }

    const firstEntryData: IListViewFirstEntryData = {};
    this.getFirstVisibleEntryIndex(firstEntryData);
    
    let entry: ListViewEntry;
    let isTempEntry = false;
    
    if (firstEntryData.index <= index && index < firstEntryData.index + this.entriesInUse.length) {
      const entryIndex = index - firstEntryData.index;
      entry = this.entriesInUse[entryIndex];
    } else {
      entry = this.getFreeOrCreateEntry();
      isTempEntry = true;
    }
    
    if (!entry) {
      return (false);
    }

    entry.setEntryData(item);
    entryData.item = item;
    entryData.width = entry.getContentWidth();
    entryData.height = entry.getContentHeight();
    
    if (isTempEntry) {
      entry.clearEntryData();
      this.freeEntries.push(entry);
    }

    return (true);
  }

  // ----------------------------------------------------------------------------------------------
  update(): void {
    this.panelArea = this.listViewComponent.getPanelArea(this.panelArea);
    this.updateMaskSize = this.listViewComponent.getMaskSize(this.updateMaskSize);

    const firstEntryData: IListViewFirstEntryData = {};
    this.getFirstVisibleEntryIndex(firstEntryData);

    let entryIndex = firstEntryData.index;
    let y = firstEntryData.y;
    let entriesInUseIndex = 0;
    let entrySize: Phaser.Types.Math.Vector2Like;

    const entryMargin = this.listViewComponent.entryMargin;
    const length = this.entriesData.length;
    while (entryIndex < length && y <= this.panelArea.bottom) {
      let entry = this.entriesInUse[entriesInUseIndex];
      if (!entry) {
        entry = this.getFreeOrCreateEntry();
        this.entriesInUse[entriesInUseIndex] = entry;
        this.listViewComponent.container.add(entry);
        entry.visible = true;
      }

      entry.x = 0;
      entry.y = y;

      const entryData = this.entriesData[entryIndex];
      if (entry.getEntryData() !== entryData.item) {
        entry.isSelected = false;
        entry.setEntryData(entryData.item);
        entry.isSelected = entryData.isSelected;

        entrySize = entry.getContentSize(entrySize);
        entryData.width = entrySize.x;
        entryData.height = entrySize.y;
      }

      y += (entryData.height + entryMargin);

      entryIndex += 1;
      entriesInUseIndex += 1;
    }

    if (entriesInUseIndex < this.entriesInUse.length) {
      this.removeToEnd(entriesInUseIndex);
    }

    const areaWidth = Math.max(this.contentWidth, this.updateMaskSize.x);
    this.entriesInUse.forEach((entry) => {
      entry.setAreaWidth(areaWidth);
      entry.updateMask(this.updateMaskSize);
    });
  }

  // ==============================================================================================
  // private
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  private _createEntry(): ListViewEntry {
    const scene = this.listViewComponent.scene;
    const ListEntryClass = this.listEntryClass;
    const entry = ListEntryClass && scene ? new ListEntryClass(scene) : null;
    
    if (entry) {
      entry.callback = this.onEntryCallback;
      entry.once(Phaser.GameObjects.Events.DESTROY, _ListViewEntries.OnEntryDestroy);
      entry.on(ButtonComponentEvents.POINTER_DOWN, this.onEntryButtonDown, this);
      entry.on(ButtonComponentEvents.POINTER_OUT, this.onEntryButtonOut, this);
      entry.on(ButtonComponentEvents.POINTER_OVER, this.onEntryButtonOver, this);
      entry.on(ButtonComponentEvents.POINTER_UP, this.onEntryButtonUp, this);
      entry.on(ButtonComponentEvents.DOUBLE_PRESS, this.onEntryDoublePressed, this);
      entry.context = this;
    }

    return (entry);
  }

  // ----------------------------------------------------------------------------------------------
  private emitListItemEvent(eventType: string, entry: ListViewEntry,
    entryIndex = -1): IListViewCallbackData {
    if (entryIndex === -1) {
      entryIndex = this.getEntryIndex(entry);
      if (entryIndex === -1) {
        console.warn(`Invalid entry ${entry} with event type ${eventType}.`);
        return (null);
      }
    }

    const entryData = this.entriesData[entryIndex];
    const callbackData: IListViewCallbackData = {
      index: entryIndex,
      item: entryData.item,
      listViewComponent: this.listViewComponent,
    };

    this.listViewComponent.events.emit(eventType, callbackData);
    return (callbackData);
  }

  // ----------------------------------------------------------------------------------------------
  private getEntryIndex(entry: ListViewEntry): number {
    const firstEntryData: IListViewFirstEntryData = {};
    this.getFirstVisibleEntryIndex(firstEntryData);
    
    for (let index = 0; index < this.entriesInUse.length; index += 1) {
      const entryInUse = this.entriesInUse[index];
      if (entryInUse === entry) {
        return (firstEntryData.index + index);
      }
    }

    return (-1);
  }

  // ----------------------------------------------------------------------------------------------
  private getFirstVisibleEntryIndex(dataOut: IListViewFirstEntryData): void {
    const vtSlider = this.listViewComponent.verticalSlider;
    if (!vtSlider) {
      dataOut.index = 0;
      dataOut.y = 0;
      return;
    }
    
    this.updateMaskSize = this.listViewComponent.getMaskSize(this.updateMaskSize);
    const yMaxPos = this.contentHeight - this.updateMaskSize.y;

    const yStart = -yMaxPos * vtSlider.value;
    const length = this.entriesData.length;

    let y = yStart;
    for (let index = 0; index < length; index += 1) {
      const entryData = this.entriesData[index];
      const y2 = y + entryData.height;
      if (y2 >= 0) {
        dataOut.index = index;
        dataOut.y = y;
        return;
      }
      y = y2;
    }

    dataOut.index = 0;
    dataOut.y = 0;
  }

  // ----------------------------------------------------------------------------------------------
  private _getFreeEntry(): ListViewEntry {
    return (this.freeEntries.pop());
  }

  // ----------------------------------------------------------------------------------------------
  private getFreeOrCreateEntry(): ListViewEntry {
    const entry = this._getFreeEntry() || this._createEntry();
    if (!entry) {
      return (null);
    }

    entry.listViewComponent = this.listViewComponent;
    entry.listViewComponent._addSwipableItem(entry);
    entry.setDoublePressEnabled(entry.listViewComponent.isDoublePressEnabled);
    return (entry);
  }

  // ----------------------------------------------------------------------------------------------
  private onEntryButtonDown(entry: ListViewEntry): void {
    const entryIndex = this.getEntryIndex(entry);
    if (entryIndex === -1) {
      console.warn('No valid entry down');
      return;
    }

    const entryData = this.entriesData[entryIndex];
    this.selector.handleSelect(entryData, entry);

    this.emitListItemEvent(ListViewEvents.LIST_ITEM_POINTER_DOWN, entry, entryIndex);
  }

  // ----------------------------------------------------------------------------------------------
  private static OnEntryDestroy(entry: ListViewEntry): void {
    entry.listViewComponent._removeSwipableItem(entry);
  }

  // ----------------------------------------------------------------------------------------------
  private onEntryDoublePressed(entry: ListViewEntry): void {
    const entryIndex = this.getEntryIndex(entry);
    if (entryIndex === -1) {
      console.warn('No valid entry pressed');
      return;
    }

    this.emitListItemEvent(ListViewEvents.LIST_ITEM_DOUBLE_PRESSED, entry, entryIndex);
  }

  // ----------------------------------------------------------------------------------------------
  private onEntryButtonOut(entry: ListViewEntry): void {
    this.emitListItemEvent(ListViewEvents.LIST_ITEM_POINTER_OUT, entry);
  }
  
  // ----------------------------------------------------------------------------------------------
  private onEntryButtonOver(entry: ListViewEntry): void {
    this.emitListItemEvent(ListViewEvents.LIST_ITEM_POINTER_OVER, entry);
  }
  
  // ----------------------------------------------------------------------------------------------
  private onEntryButtonUp(entry: ListViewEntry): void {
    this.emitListItemEvent(ListViewEvents.LIST_ITEM_POINTER_UP, entry);
  }

  // ----------------------------------------------------------------------------------------------
  private onEntryCallback(entry: ListViewEntry): void {
    const entryIndex = this.getEntryIndex(entry);
    if (entryIndex === -1) {
      console.warn('No valid entry pressed');
      return;
    }

    const callbackData = this.emitListItemEvent(ListViewEvents.LIST_ITEM_PRESSED, entry,
      entryIndex);

    if (this.listViewComponent.listEntryCallback) {
      this.listViewComponent.listEntryCallback.call(
        this.listViewComponent.listEntryCallbackContext,
        callbackData,
      );
    }
  }

  // ----------------------------------------------------------------------------------------------
  private removeToEnd(startEntriesInUseIndex: number): number {
    const endEntriesInUseIndex = this.entriesInUse.length - 1;
    let numRemoved = 0;

    for (let index = endEntriesInUseIndex; index >= startEntriesInUseIndex; index -= 1) {
      const entry = this.entriesInUse[index];
      entry.clearEntryData();
      entry.visible = false;
      this.listViewComponent.container.remove(entry);

      this.freeEntries.push(entry);
      this.entriesInUse.pop();
      
      numRemoved += 1;
    }

    return (numRemoved);
  }
}
