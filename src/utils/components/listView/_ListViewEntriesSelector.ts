import ListViewComponent, { IListViewItem } from './ListViewComponent';
import _ListViewEntries, { _IListViewEntryData } from './_ListViewEntries';
import ListViewEntry from './ListViewEntry';

/**
 * @internal
 */
export default class _ListViewEntriesSelector {
  // ==============================================================================================
  // properties
  // ==============================================================================================
  private selectedEntriesData: _IListViewEntryData[];
  
  private listViewComponent: ListViewComponent;

  private entries: _ListViewEntries;

  private baseOfMultiselectedData: _IListViewEntryData;

  private controlKey: Phaser.Input.Keyboard.Key;

  private shiftKey: Phaser.Input.Keyboard.Key;

  // ==============================================================================================
  // public
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  constructor(listViewComponent: ListViewComponent, entries: _ListViewEntries) {
    this.listViewComponent = listViewComponent;
    this.entries = entries;
    this.selectedEntriesData = [];
    this.initKeys();

    this.listViewComponent.getGameObject().once(Phaser.GameObjects.Events.DESTROY,
      this.onGameObjectDestroy, this);
  }

  // ----------------------------------------------------------------------------------------------
  getSelectedIndexes(): number[] {
    return (this.selectedEntriesData.map((data) => this.entries.getItemIndex(data.item)));
  }

  // ----------------------------------------------------------------------------------------------
  getSelectedItems(): IListViewItem[] {
    return (this.selectedEntriesData.map((data) => data.item));
  }

  // ----------------------------------------------------------------------------------------------
  handleSelect(entryData: _IListViewEntryData, entry: ListViewEntry): void {
    if (this.listViewComponent.isMultipleSelectionEnabled) {
      this.handleSelectMultiple(entryData, entry);
    } else {
      this.handleSelectOne(entryData, entry);
    }
  }

  // ----------------------------------------------------------------------------------------------
  get length(): number {
    return (this.selectedEntriesData.length);
  }

  // ----------------------------------------------------------------------------------------------
  selectAll(): void {
    this.entries.entriesData.forEach((data) => {
      this.selectItem(data.item);
    }, this);
  }

  // ----------------------------------------------------------------------------------------------
  selectEntry(entryData: _IListViewEntryData, entry?: ListViewEntry): void {
    if (!entryData) {
      return;
    }

    if (this.selectedEntriesData.indexOf(entryData) === -1) {
      this.selectedEntriesData.push(entryData);
    }

    entryData.isSelected = true;
    
    if (!entry) {
      entry = this.entries.entriesInUse.find((ent) => ent.getEntryData() === entryData.item);
    }

    if (entry) {
      entry.isSelected = entryData.isSelected;
    }
  }

  // ----------------------------------------------------------------------------------------------
  selectIndexes(values: number[]): void {
    this.unselectAll();

    if (!values) {
      return;
    }

    values.forEach((value) => {
      const item = this.entries.getItemAt(value);
      const data = this.entries.getEntryDataFromItem(item);
      this.selectEntry(data);
    }, this);
  }

  // ----------------------------------------------------------------------------------------------
  selectItem(item: IListViewItem): void {
    const entryData = this.entries.getEntryDataFromItem(item);
    this.selectEntry(entryData);
  }
  
  // ----------------------------------------------------------------------------------------------
  selectItems(values: IListViewItem[]): void {
    this.unselectAll();

    if (!values) {
      return;
    }
    
    values.forEach((value) => {
      const data = this.entries.getEntryDataFromItem(value);
      if (data) {
        this.selectEntry(data);
      }
    }, this);
  }

  // ----------------------------------------------------------------------------------------------
  unselectAll(): void {
    for (let index = this.selectedEntriesData.length - 1; index >= 0; index -= 1) {
      this.unselectEntry(this.selectedEntriesData[index]);
    }
  }

  // ----------------------------------------------------------------------------------------------
  unselectEntry(entryData: _IListViewEntryData, entry?: ListViewEntry): void {
    if (!entryData) {
      return;
    }
    
    const index = this.selectedEntriesData.indexOf(entryData);
    if (index > -1) {
      this.selectedEntriesData.splice(index, 1);
    }

    entryData.isSelected = false;
    
    if (!entry) {
      entry = this.entries.entriesInUse.find((ent) => ent.getEntryData() === entryData.item);
    }

    if (entry) {
      entry.isSelected = entryData.isSelected;
    }
  }

  // ----------------------------------------------------------------------------------------------
  unselectItem(item: IListViewItem): void {
    const entryData = this.entries.getEntryDataFromItem(item);
    this.unselectEntry(entryData);
  }
  
  // ==============================================================================================
  // private
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  private addSelectedEntriesToBase(entryData: _IListViewEntryData): void {
    this.selectRangeAtBase(this.baseOfMultiselectedData, entryData);
  }

  // ----------------------------------------------------------------------------------------------
  private handleSelectMultiple(entryData: _IListViewEntryData, entry: ListViewEntry): void {
    const isCtrlDown = this.isControlKeyDown();
    const isShftDown = this.isShiftKeyDown();

    if (isCtrlDown && isShftDown) {
      this.addSelectedEntriesToBase(entryData);
    } else if (isShftDown) {
      this.setSelectEntriesFromBase(entryData);
    } else if (isCtrlDown) {
      this.toggleSelectEntry(entryData, entry);
      this.baseOfMultiselectedData = entryData.isSelected ? entryData : null;
    } else {
      this.setSelectEntry(entryData, entry);
      this.baseOfMultiselectedData = entryData.isSelected ? entryData : null;
    }
  }

  // ----------------------------------------------------------------------------------------------
  private handleSelectOne(entryData: _IListViewEntryData, entry: ListViewEntry): void {
    let shouldSetSelection = true;

    if (this.isControlKeyDown()) {
      if (this.baseOfMultiselectedData === entryData) {
        this.unselectEntry(entryData, entry);
        shouldSetSelection = false;
      }
    }

    if (shouldSetSelection) {
      this.setSelectEntry(entryData, entry);
    }

    this.baseOfMultiselectedData = entryData.isSelected ? entryData : null;
  }

  // ----------------------------------------------------------------------------------------------  
  private initKeys(): void {
    const scene = this.listViewComponent.scene;
    this.controlKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
    this.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
  }

  // ----------------------------------------------------------------------------------------------
  private isControlKeyDown(): boolean {
    return (this.controlKey && this.controlKey.isDown);
  }

  // ----------------------------------------------------------------------------------------------
  private isShiftKeyDown(): boolean {
    return (this.shiftKey && this.shiftKey.isDown);
  }

  // ----------------------------------------------------------------------------------------------
  private onGameObjectDestroy(): void {
    if (this.controlKey) {
      this.controlKey.destroy();
      this.controlKey = null;
    }

    if (this.shiftKey) {
      this.shiftKey.destroy();
      this.shiftKey = null;
    }
  }

  // ----------------------------------------------------------------------------------------------
  private selectRangeAtBase(startData: _IListViewEntryData, endData: _IListViewEntryData): void {
    const startIndex = this.entries.entriesData.indexOf(startData);
    const endIndex = this.entries.entriesData.indexOf(endData);
    if (startIndex === -1 || endIndex === -1) {
      // sanity checks
      return;
    }

    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);
    for (let index = minIndex; index <= maxIndex; index += 1) {
      const data = this.entries.entriesData[index];
      this.selectEntry(data);
    }
  }

  // ----------------------------------------------------------------------------------------------
  private setSelectEntriesFromBase(entryData: _IListViewEntryData): void {
    this.unselectAll();
    this.selectRangeAtBase(this.baseOfMultiselectedData, entryData);
  }

  // ----------------------------------------------------------------------------------------------
  private setSelectEntry(entryData: _IListViewEntryData, entry: ListViewEntry): void {
    this.unselectAll();
    this.selectEntry(entryData, entry);
  }

  // ----------------------------------------------------------------------------------------------
  private toggleSelectEntry(entryData: _IListViewEntryData, entry: ListViewEntry): void {
    if (entryData.isSelected) {
      this.unselectEntry(entryData, entry);
    } else {
      this.selectEntry(entryData, entry);
    }
  }
}
