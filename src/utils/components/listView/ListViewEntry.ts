import { TextObject } from '../../Utils';
import ButtonComponent from '../buttons/ButtonComponent';
import ButtonComponentEvents from '../buttons/ButtonComponentEvents';
import ListViewComponent, { IListViewItem } from './ListViewComponent';
import _ListViewEntryColor from './_ListViewEntryColor';
import ListViewEntryComponent from './ListViewEntryComponent';
import _ListViewEntryBounds from './_ListViewEntryBounds';

// ==============================================================================================
export type ListViewText = Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;

// eslint-disable-next-line no-use-before-define
type listViewCallback = (entry: ListViewEntry) => void;

// ==============================================================================================
export default class ListViewEntry extends Phaser.GameObjects.Container {
  // ==============================================================================================
  // properties
  // ==============================================================================================
  public static readonly DATA_KEY = '__listViewEntryData';

  public listViewComponent: ListViewComponent;

  public txtLabel: ListViewText;

  public callback: listViewCallback;

  public context: unknown;

  private listViewEntryComponent: ListViewEntryComponent;

  private _buttonComponent: ButtonComponent;

  private buttonImage: Phaser.GameObjects.Rectangle;

  private areaWidth: number;

  private _isSelected: boolean;

  // ==============================================================================================
  // public
  // ==============================================================================================
  
  // ----------------------------------------------------------------------------------------------
  constructor(scene: Phaser.Scene, x?: number, y?: number,
    children?: Phaser.GameObjects.GameObject[]) {
    super(scene, x, y, children);
    this.setDataEnabled();
    this.areaWidth = 0;
    this._isSelected = false;
    this.createButton();
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The internal `ButtonComponent` reference.
   */
  get buttonComponent(): ButtonComponent {
    return (this._buttonComponent);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Clears the custom data of this entry.
   */
  clearEntryData(): IListViewItem {
    return (this.setEntryData(null));
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The pixel width of the visible width of this entry.
   */
  getAreaWidth(): number {
    return (this.areaWidth);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The pixel height of the entire entry's context.
   */
  getContentHeight(): number {
    // temporarily remove the button, because it hsould not be included in the bounds
    this.remove(this.buttonImage);
    const size = _ListViewEntryBounds.GetBounds(this).height;
    this.addAt(this.buttonImage, 0);

    return (size);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Gets the pixel size of the entire content of this entry.
   * @param size If specified, the width (`x`) and height (`y`) are set in this param.
   * @returns The `Phaser.Types.Math.Vector2Like` size object.
   */
  getContentSize(size?: Phaser.Types.Math.Vector2Like): Phaser.Types.Math.Vector2Like {
    // temporarily remove the button, because it hsould not be included in the bounds
    this.remove(this.buttonImage);
    const rect = _ListViewEntryBounds.GetBounds(this);
    this.addAt(this.buttonImage, 0);
    
    if (!size) {
      size = {};
    }
    
    size.x = rect.width;
    size.y = rect.height;
    return (size);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The pixel width of the entire entry's context. This might be wider than the
   * list view's visible area, depending on teh content (if the entry has a long text label,
   * for example).
   */
  getContentWidth(): number {
    this.remove(this.buttonImage);
    const size = _ListViewEntryBounds.GetBounds(this).width;
    this.addAt(this.buttonImage, 0);
    return (size);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The `IListViewItem` of this entry.
   */
  getEntryData(): IListViewItem {
    return (this.data.get(ListViewEntry.DATA_KEY));
  }
  
  // ----------------------------------------------------------------------------------------------
  /**
   * @returns The `string` of this ebtry's label.
   */
  getLabel(): string {
    const data = this.getEntryData();
    return (data.label || '');
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Determines if the entry is selected or not.
   */
  get isSelected(): boolean {
    return (this._isSelected);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Determines if the entry is selected or not. Should not be called directly; this is managed
   * by the list view component.
   * @returns value - Specifies if the entry is selected or not.
   */
  set isSelected(value: boolean) {
    this._isSelected = value;
    this.updateStateColors();
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Sets the visible area width of the entry.
   * @param value The pixel width to set.
   */
  setAreaWidth(value: number): void {
    this.areaWidth = value;
    this.updateStateColors();
    this.buttonImage.displayWidth = this.areaWidth;
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Specifies if this entry supports double-pressed pointer input.
   * @param isEnabled
   */
  setDoublePressEnabled(isEnabled: boolean): void {
    this.buttonComponent.isDoublePressEnabled = isEnabled;
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Specifies the item data for this entry.
   * @param data The `IListViewItem` to set.
   * @returns The previous `IListViewItem` data that was on this entry.
   */
  setEntryData(data: IListViewItem): IListViewItem {
    const prevData = this.getEntryData();
    if (data) {
      this.setLabel(data.label);
      this.data.set(ListViewEntry.DATA_KEY, data);
    } else {
      this.setLabel(null);
      this.data.set(ListViewEntry.DATA_KEY, {});
    }

    return (prevData);
  }

  // ----------------------------------------------------------------------------------------------
  /**
   * Called by the list view component if the button image needs to be resized and/or
   * repositioned, because the button would otherwise place outside the mask of the
   * list view. Do not call this directly.
   * @param entriesContainerMaskSize The size of the list view's mask.
   */
  updateMask(entriesContainerMaskSize: Phaser.Geom.Point): void {
    const maskSize = this.createRectWithinEntryArea(entriesContainerMaskSize);
    this.buttonImage.x = -this.listViewComponent.container.x;
    this.buttonImage.y = this.y < 0 ? -this.y : 0;
    this.buttonImage.displayWidth = maskSize.width;
    this.buttonImage.displayHeight = maskSize.height;
  }

  // ==============================================================================================
  // "internal"
  // ==============================================================================================
  
  // ----------------------------------------------------------------------------------------------
  /**
   * Called by the `ListViewEntryComponent` constructor, and should not be called directly.
   * @internal
   */
  _onComponentAssigned(component: ListViewEntryComponent): void {
    this.listViewEntryComponent = component;
    this.initBitmapLabel();
  }

  // ==============================================================================================
  // protected
  // ==============================================================================================
  
  // ----------------------------------------------------------------------------------------------
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  protected onButtonInitInteractiveData(inputConfig: Phaser.Types.Input.InputConfiguration): void {
  }

  // ----------------------------------------------------------------------------------------------
  protected static SetText(textObject: TextObject, value: number | string, defaultValue = ''): void {
    if (!textObject) {
      return;
    }

    if (value === undefined || value === null || Number.isNaN(value)) {
      textObject.text = defaultValue || '';
    } else {
      textObject.text = value.toString();
    }
  }

  // ==============================================================================================
  // private
  // ==============================================================================================
  
  // ----------------------------------------------------------------------------------------------
  private createButton(): void {
    this._createButtonImage();

    const bc = new ButtonComponent(this.buttonImage);
    bc.events.once(ButtonComponentEvents.INIT_INTERACTIVE_DATA, this.onButtonInitInteractiveData,
      this);
    bc.events.on(ButtonComponentEvents.POINTER_DOWN, this.onButtonDown, this);
    bc.events.on(ButtonComponentEvents.POINTER_OUT, this.onButtonOut, this);
    bc.events.on(ButtonComponentEvents.POINTER_OVER, this.onButtonOver, this);
    bc.events.on(ButtonComponentEvents.POINTER_UP, this.onButtonUp, this);
    bc.events.on(ButtonComponentEvents.DOUBLE_PRESS, this.onButtonDoublePress, this);
    bc.events.on(ButtonComponentEvents.SLEEP, this.onButtonSleep, this);
    bc.events.on(ButtonComponentEvents.WAKE, this.onButtonWake, this);
    bc.callback = this.onButtonCallback;
    bc.context = this;
    this._buttonComponent = bc;
  }

  // ----------------------------------------------------------------------------------------------
  private _createButtonImage(): void {
    this.buttonImage = this.scene.add.rectangle(0, 0, 20, 20, 0x0000ff);
    this.buttonImage.setOrigin(0, 0);
    this.addAt(this.buttonImage, 0);
  }

  // ----------------------------------------------------------------------------------------------
  private createRectWithinEntryArea(entriesContainerMaskSize: Phaser.Geom.Point):
  Phaser.Geom.Rectangle {
    const thisRect = new Phaser.Geom.Rectangle(this.x, this.y, this.getAreaWidth(),
      this.getContentHeight());

    const ecmRect = new Phaser.Geom.Rectangle(0, 0, entriesContainerMaskSize.x,
      entriesContainerMaskSize.y);
    
    return (Phaser.Geom.Rectangle.Intersection(thisRect, ecmRect));
  }

  // ----------------------------------------------------------------------------------------------
  private initBitmapLabel(): void {
    const TXT_PROP = 'text';
    const TXT_PROP_VALUE = 'label';
    const textObject = this.getFirst(TXT_PROP, TXT_PROP_VALUE);
    if (!(textObject instanceof Phaser.GameObjects.BitmapText)) {
      return;
    }

    const bmpText = textObject as Phaser.GameObjects.BitmapText;
    const PROP = 'getBounds';
    bmpText[PROP] = _ListViewEntryBounds.GetBitmapTextBounds.bind(bmpText);
  }

  // ----------------------------------------------------------------------------------------------
  private onButtonCallback(): void {
    if (this.callback) {
      this.callback.call(this.context, this);
    }
  }

  // ----------------------------------------------------------------------------------------------
  private onButtonDoublePress(): void {
    this.updateStateColors();
    this.emit(ButtonComponentEvents.DOUBLE_PRESS, this);
  }

  // ----------------------------------------------------------------------------------------------
  private onButtonDown(): void {
    this.updateStateColors();
    this.emit(ButtonComponentEvents.POINTER_DOWN, this);
  }

  // ----------------------------------------------------------------------------------------------
  private onButtonOut(): void {
    this.updateStateColors();
    this.emit(ButtonComponentEvents.POINTER_OUT, this);
  }

  // ----------------------------------------------------------------------------------------------
  private onButtonOver(): void {
    this.updateStateColors();
    this.emit(ButtonComponentEvents.POINTER_OVER, this);
  }

  // ----------------------------------------------------------------------------------------------
  private onButtonSleep(): void {
    this.updateStateColors();
    this.emit(ButtonComponentEvents.SLEEP, this);
  }

  // ----------------------------------------------------------------------------------------------
  private onButtonUp(): void {
    this.updateStateColors();
    this.emit(ButtonComponentEvents.POINTER_UP, this);
  }

  // ----------------------------------------------------------------------------------------------
  private onButtonWake(): void {
    this.updateStateColors();
    this.emit(ButtonComponentEvents.WAKE, this);
  }

  // ----------------------------------------------------------------------------------------------
  private resolveBackColor(): Phaser.Display.Color {
    const IS_BACK = true;
    return (_ListViewEntryColor.Resolve(this, IS_BACK));
  }

  // ----------------------------------------------------------------------------------------------
  private resolveLabelColor(): Phaser.Display.Color {
    const IS_BACK = false;
    return (_ListViewEntryColor.Resolve(this, IS_BACK));
  }

  // ----------------------------------------------------------------------------------------------
  private setButtonFillColor(colorObject: Phaser.Display.Color): void {
    if (colorObject) {
      this.buttonImage.fillColor = colorObject.color;
      this.buttonImage.alpha = colorObject.alphaGL;
    } else {
      this.buttonImage.fillColor = 0;
      this.buttonImage.alpha = 0.001;
    }
  }

  // ----------------------------------------------------------------------------------------------
  private setLabel(label: string): void {
    ListViewEntry.SetText(this.txtLabel, label);
  }

  // ----------------------------------------------------------------------------------------------
  private setLabelColor(colorObject: Phaser.Display.Color): void {
    if (!this.txtLabel) {
      return;
    }

    if (this.txtLabel instanceof Phaser.GameObjects.Text) {
      this.txtLabel.setColor(colorObject ? colorObject.rgba : '#ffffff');
    } else {
      this.txtLabel.tint = colorObject ? colorObject.color : 0xffffff;
    }

    this.txtLabel.alpha = colorObject ? colorObject.alphaGL : 1.0;
  }

  // ----------------------------------------------------------------------------------------------
  private updateStateColors(): void {
    this.setButtonFillColor(this.resolveBackColor());
    this.setLabelColor(this.resolveLabelColor());
  }
}
