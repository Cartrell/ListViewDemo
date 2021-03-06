// You can write more code here
import ArchetypesData, { IArchetypeData } from '../src/data/ArchetypesData';
import DemoListViewEntry from '../src/ui/DemoListViewEntry';
import ButtonComponent from '../src/utils/components/buttons/ButtonComponent';
import CheckboxComponent from '../src/utils/components/checkboxes/CheckboxComponent';
import ListViewComponent, { IListViewCallbackData, IListViewItem } from '../src/utils/components/listView/ListViewComponent';
import ListViewEvents from '../src/utils/components/listView/ListViewEvents';
import SliderComponent from '../src/utils/components/sliders/SliderComponent';

// ==============================================================================================
interface ITextsJson {
  intro: string | string[];
  multipleSelected: string;
}

/* eslint-disable */

/* START OF COMPILED CODE */

class MainScene extends Phaser.Scene {
  
  constructor() {
    super("MainScene");
    
    this.background;
    this.introTextArea;
    this.txtItemIntro;
    this.txtItemName;
    this.remove_button_image;
    this.add_button_image;
    this.select_all_button_image;
    this.select_none_button_image;
    this.cbx_allow_multiple_selection;
    this.listViewContainer;
    this.panel;
    this.vtSlider;
    this.hzSlider;
    this.soundableButtonImages;
    
    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }
  
  _create() {
    
    // background
    const background = this.add.image(0, 0, "preloader", "background");
    background.scaleX = 1.28;
    background.scaleY = 1.28;
    background.setOrigin(0, 0);
    
    // introTextArea
    const introTextArea = this.add.image(400, 140, "main", "node");
    introTextArea.scaleX = 12;
    introTextArea.scaleY = 9.5;
    introTextArea.setOrigin(0, 0);
    
    // txtItemIntro
    const txtItemIntro = this.add.bitmapText(400, 140, "OpenSansBold", "[intro]");
    txtItemIntro.tintTopLeft = 16776960;
    txtItemIntro.tintTopRight = 16776960;
    txtItemIntro.tintBottomLeft = 16776960;
    txtItemIntro.tintBottomRight = 16776960;
    txtItemIntro.text = "[intro]";
    txtItemIntro.fontSize = 28;
    
    // txtItemName
    const txtItemName = this.add.bitmapText(400, 100, "OpenSansBold", "[item name]");
    txtItemName.tintTopLeft = 65535;
    txtItemName.tintTopRight = 65535;
    txtItemName.tintBottomLeft = 65535;
    txtItemName.tintBottomRight = 65535;
    txtItemName.text = "[item name]";
    txtItemName.fontSize = 28;
    
    // txtHeader
    const txtHeader = this.add.bitmapText(512, 20, "falco-black", "list view demo");
    txtHeader.setOrigin(0.5, 0);
    txtHeader.text = "list view demo";
    txtHeader.fontSize = 42;
    
    // remove_button_image
    const remove_button_image = this.add.image(380, 680, "main", "remove-button-norm");
    
    // add_button_image
    const add_button_image = this.add.image(150, 680, "main", "add-button-norm");
    
    // select_all_button_image
    const select_all_button_image = this.add.image(610, 680, "main", "select-all-button-norm");
    
    // select_none_button_image
    const select_none_button_image = this.add.image(840, 680, "main", "select-none-button-norm");
    
    // cbx_allow_multiple_selection
    const cbx_allow_multiple_selection = this.add.image(320, 738, "main", "checkbox-off-norm");
    
    // bmpTxtAllowMultipleSelection
    const bmpTxtAllowMultipleSelection = this.add.bitmapText(350, 723, "falco-black", "allow multiple selections");
    bmpTxtAllowMultipleSelection.text = "allow multiple selections";
    bmpTxtAllowMultipleSelection.fontSize = 28;
    
    // listViewContainer
    const listViewContainer = this.add.container(20, 80);
    
    // panel
    const panel = this.add.image(0, 0, "main", "list-view-panel");
    panel.scaleY = 1.4;
    panel.setOrigin(0, 0);
    listViewContainer.add(panel);
    
    // vtSlider
    const vtSlider = this.add.container(0, 0);
    listViewContainer.add(vtSlider);
    
    // hzSlider
    const hzSlider = this.add.container(0, 0);
    listViewContainer.add(hzSlider);
    
    // lists
    const soundableButtonImages = [remove_button_image, add_button_image, cbx_allow_multiple_selection]
    
    // remove_button_image (components)
    const remove_button_imageButtonComponent = new ButtonComponent(remove_button_image);
    remove_button_imageButtonComponent.normFrame = {"key":"main","frame":"remove-button-norm"};
    remove_button_imageButtonComponent.overFrame = {"key":"main","frame":"remove-button-over"};
    remove_button_imageButtonComponent.downFrame = {"key":"main","frame":"remove-button-down"};
    remove_button_imageButtonComponent.callback = this.onRemovePressed;
    remove_button_imageButtonComponent.context = this;
    remove_button_imageButtonComponent.disabledFrame = {"key":"main","frame":"remove-button-disabled"};
    
    // add_button_image (components)
    const add_button_imageButtonComponent = new ButtonComponent(add_button_image);
    add_button_imageButtonComponent.normFrame = {"key":"main","frame":"add-button-norm"};
    add_button_imageButtonComponent.overFrame = {"key":"main","frame":"add-button-over"};
    add_button_imageButtonComponent.downFrame = {"key":"main","frame":"add-button-down"};
    add_button_imageButtonComponent.callback = this.onAddPressed;
    add_button_imageButtonComponent.context = this;
    add_button_imageButtonComponent.disabledFrame = {"key":"main","frame":"add-button-disabled"};
    
    // select_all_button_image (components)
    const select_all_button_imageButtonComponent = new ButtonComponent(select_all_button_image);
    select_all_button_imageButtonComponent.normFrame = {"key":"main","frame":"select-all-button-norm"};
    select_all_button_imageButtonComponent.overFrame = {"key":"main","frame":"select-all-button-over"};
    select_all_button_imageButtonComponent.downFrame = {"key":"main","frame":"select-all-button-down"};
    select_all_button_imageButtonComponent.callback = this.onSelectAllPressed;
    select_all_button_imageButtonComponent.context = this;
    select_all_button_imageButtonComponent.disabledFrame = {"key":"main","frame":"select-all-button-disabled"};
    
    // select_none_button_image (components)
    const select_none_button_imageButtonComponent = new ButtonComponent(select_none_button_image);
    select_none_button_imageButtonComponent.normFrame = {"key":"main","frame":"select-none-button-norm"};
    select_none_button_imageButtonComponent.overFrame = {"key":"main","frame":"select-none-button-over"};
    select_none_button_imageButtonComponent.downFrame = {"key":"main","frame":"select-none-button-down"};
    select_none_button_imageButtonComponent.callback = this.onSelectNonePressed;
    select_none_button_imageButtonComponent.context = this;
    select_none_button_imageButtonComponent.disabledFrame = {"key":"main","frame":"select-none-button-disabled"};
    
    // cbx_allow_multiple_selection (components)
    const cbx_allow_multiple_selectionCheckboxComponent = new CheckboxComponent(cbx_allow_multiple_selection);
    cbx_allow_multiple_selectionCheckboxComponent.normOnFrame = {"key":"main","frame":"checkbox-on-norm"};
    cbx_allow_multiple_selectionCheckboxComponent.overOnFrame = {"key":"main","frame":"checkbox-on-over"};
    cbx_allow_multiple_selectionCheckboxComponent.downOnFrame = {"key":"main","frame":"checkbox-on-down"};
    cbx_allow_multiple_selectionCheckboxComponent.normOffFrame = {"key":"main","frame":"checkbox-off-norm"};
    cbx_allow_multiple_selectionCheckboxComponent.overOffFrame = {"key":"main","frame":"checkbox-off-over"};
    cbx_allow_multiple_selectionCheckboxComponent.downOffFrame = {"key":"main","frame":"checkbox-off-down"};
    cbx_allow_multiple_selectionCheckboxComponent.chkCallback = this.onChkAllowMultipleSelectionsPressed;
    cbx_allow_multiple_selectionCheckboxComponent.disabledOnFrame = {"key":"main","frame":"checkbox-on-disabled"};
    cbx_allow_multiple_selectionCheckboxComponent.disabledOffFrame = {"key":"main","frame":"checkbox-off-disabled"};
    cbx_allow_multiple_selectionCheckboxComponent.defaultIsOn = false;
    
    // listViewContainer (components)
    const listViewContainerListViewComponent = new ListViewComponent(listViewContainer);
    listViewContainerListViewComponent._listEntryClass = DemoListViewEntry;
    
    // vtSlider (components)
    const vtSliderSliderComponent = new SliderComponent(vtSlider);
    vtSliderSliderComponent._isHorizontal = false;
    vtSliderSliderComponent._bodyImage = {"key":"main","frame":"button_slider_body_vt_body"};
    vtSliderSliderComponent._handleNormImage = {"key":"main","frame":"button_slider_handle_vt_norm"};
    vtSliderSliderComponent._handleOverImage = {"key":"main","frame":"button_slider_handle_vt_over"};
    vtSliderSliderComponent._handleDownImage = {"key":"main","frame":"button_slider_handle_vt_down"};
    vtSliderSliderComponent._handleDisabledImage = {"key":"main","frame":"button_slider_handle_vt_disabled"};
    vtSliderSliderComponent.isVisibleDefault = false;
    
    // hzSlider (components)
    const hzSliderSliderComponent = new SliderComponent(hzSlider);
    hzSliderSliderComponent._bodyImage = {"key":"main","frame":"list_slider_body_hz_body"};
    hzSliderSliderComponent._handleNormImage = {"key":"main","frame":"button_slider_handle_hz_norm"};
    hzSliderSliderComponent._handleOverImage = {"key":"main","frame":"button_slider_handle_hz_over"};
    hzSliderSliderComponent._handleDownImage = {"key":"main","frame":"button_slider_handle_hz_down"};
    hzSliderSliderComponent._handleDisabledImage = {"key":"main","frame":"button_slider_handle_hz_disabled"};
    hzSliderSliderComponent.isVisibleDefault = false;
    
    this.background = background;
    this.introTextArea = introTextArea;
    this.txtItemIntro = txtItemIntro;
    this.txtItemName = txtItemName;
    this.remove_button_image = remove_button_image;
    this.add_button_image = add_button_image;
    this.select_all_button_image = select_all_button_image;
    this.select_none_button_image = select_none_button_image;
    this.cbx_allow_multiple_selection = cbx_allow_multiple_selection;
    this.listViewContainer = listViewContainer;
    this.panel = panel;
    this.vtSlider = vtSlider;
    this.hzSlider = hzSlider;
    this.soundableButtonImages = soundableButtonImages;
  }
  
  private background: Phaser.GameObjects.Image;
  
  private introTextArea: Phaser.GameObjects.Image;
  
  private txtItemIntro: Phaser.GameObjects.BitmapText;
  
  private txtItemName: Phaser.GameObjects.BitmapText;
  
  private remove_button_image: Phaser.GameObjects.Image;
  
  private add_button_image: Phaser.GameObjects.Image;
  
  private select_all_button_image: Phaser.GameObjects.Image;
  
  private select_none_button_image: Phaser.GameObjects.Image;
  
  private cbx_allow_multiple_selection: Phaser.GameObjects.Image;
  
  private listViewContainer: Phaser.GameObjects.Container;
  
  private panel: Phaser.GameObjects.Image;
  
  private vtSlider: Phaser.GameObjects.Container;
  
  private hzSlider: Phaser.GameObjects.Container;
  
  private soundableButtonImages: Phaser.GameObjects.Image[];
  
  /* START-USER-CODE */

  // Write your code here.

  /* eslint-enable */

  // ==============================================================================================
  // properties
  // ==============================================================================================
  private archetypesData: ArchetypesData;

  private listView: ListViewComponent;

  // ==============================================================================================
  // public
  // ==============================================================================================
  
  // ------------------------------------------------------------------------------------------------------------------
  create(): void {
    this._create();
    this.events.once(Phaser.Scenes.Events.UPDATE, this.onSceneUpdateInit, this);
  }

  // ==========================================================================
  // private
  // ==========================================================================

  // ----------------------------------------------------------------------------------------------
  private buildMultipleSelectedText(): string | string[] {
    const jTexts: ITextsJson = this.cache.json.get('texts');
    const numSelected = this.listView.numSelectedEntries;
    return (jTexts.multipleSelected.replace(/\${length}/g, numSelected.toString()));
  }

  // ----------------------------------------------------------------------------------------------
  private static BuildSelectedItemsText(items: IListViewItem[]): string | string[] {
    let out: string;
    const length = items.length;

    for (let index = 0; index < length; index += 1) {
      const item = items[index];
      const archetypeData: IArchetypeData = item.data as IArchetypeData;

      if (index === 0) {
        out = archetypeData.name;
      } else if (index !== length - 1) {
        if (index === 9 && length > 10) {
          out = `${out},\n(... and ${length - index - 1} more)`;
          return (out);
        }

        out = `${out},\n${archetypeData.name}`;
      } else {
        out = `${out}, and\n${archetypeData.name}`;
      }
    }
    
    return (out);
  }

  // ----------------------------------------------------------------------------------------------
  private clearItemTexts(): void {
    this.txtItemName.text = '';
    this.txtItemIntro.text = '';
  }

  // ----------------------------------------------------------------------------------------------
  private handleMultipleItemSelector(archetypeData: IArchetypeData) {
    const selectedItems = this.listView.selectedItems;
    if (selectedItems.length > 1) {
      this.txtItemName.setText(this.buildMultipleSelectedText());
      this.txtItemIntro.setText(MainScene.BuildSelectedItemsText(selectedItems));
    } else if (selectedItems.length === 1) {
      if (!archetypeData) {
        archetypeData = selectedItems[0].data as IArchetypeData;
      }
      this.txtItemName.text = archetypeData.name;
      this.txtItemIntro.text = archetypeData.intro;
    } else {
      this.clearItemTexts();
    }
  }

  // ----------------------------------------------------------------------------------------------
  private handleSingleItemSelector(archetypeData: IArchetypeData) {
    const selectedItems = this.listView.selectedItems;
    if (selectedItems.length === 1) {
      if (!archetypeData) {
        archetypeData = selectedItems[0].data as IArchetypeData;
      }

      this.txtItemName.text = archetypeData.name;
      this.txtItemIntro.text = archetypeData.intro;
    } else {
      this.clearItemTexts();
    }
  }

  // ----------------------------------------------------------------------------------------------
  private initListView(): void {
    this.listView = ListViewComponent.getComponent(this.listViewContainer);
    this.listView.isDoublePressEnabled = true;

    const events = this.listView.events;
    events.on(ListViewEvents.LIST_ITEM_DOUBLE_PRESSED, this.onListViewDoublePressed, this);
    events.on(ListViewEvents.LIST_ITEM_POINTER_DOWN, this.onListViewItemDown, this);
  }

  // ----------------------------------------------------------------------------------------------
  private initIntroTextArea(): void {
    this.txtItemIntro.maxWidth = this.introTextArea.displayWidth;
    const areaGraphics = this.make.graphics({
      x: this.introTextArea.x,
      y: this.introTextArea.y,
    });
    
    areaGraphics.fillRect(0, 0, this.introTextArea.displayWidth,
      this.introTextArea.displayHeight);

    this.txtItemIntro.mask = areaGraphics.createGeometryMask();

    this.introTextArea.visible = false;
  }

  // ----------------------------------------------------------------------------------------------
  private onAddPressed(): void {
    const archetypeData = this.archetypesData.removeRandomArcheTypeData();
    if (archetypeData) {
      this.listView.addItem(archetypeData.name, archetypeData);
    }
    
    this.updateButtonsStates();
  }

  // ----------------------------------------------------------------------------------------------
  private onChkAllowMultipleSelectionsPressed(chkbox: CheckboxComponent): void {
    this.listView.isMultipleSelectionEnabled = chkbox.isOn;
    this.updateButtonsStates();
  }

  // ----------------------------------------------------------------------------------------------
  private onListViewDoublePressed(callbackData: IListViewCallbackData): void {
    this.scene.sleep();
    this.scene.run('DetailsScene', callbackData.item.data as IArchetypeData);
  }

  // ----------------------------------------------------------------------------------------------
  private onListViewItemDown(callbackData: IListViewCallbackData): void {
    const archetypeData: IArchetypeData = callbackData.item.data as IArchetypeData;
    this.updateSelectedTexts(archetypeData);
    this.updateButtonsStates();
  }

  // ----------------------------------------------------------------------------------------------
  private onRemovePressed(): void {
    const selectedItemd = this.listView.selectedItems;
    this.listView.removeItems(selectedItemd);
    this.updateSelectedTexts();
    this.updateButtonsStates();
  }

  // ----------------------------------------------------------------------------------------------
  private onSceneUpdateInit(): void {
    this.archetypesData = new ArchetypesData(this);    

    this.initListView();
    this.initIntroTextArea();
    
    this.updateSelectedTexts();
    this.updateButtonsStates();

    this.setIntroText();

    const checkbox = CheckboxComponent.getComponent(this.cbx_allow_multiple_selection);
    this.listView.isMultipleSelectionEnabled = checkbox.isOn;
  }

  // ----------------------------------------------------------------------------------------------
  private onSelectAllPressed(): void {
    this.listView.selectAll();
    this.updateSelectedTexts();
    this.updateButtonsStates();
  }

  // ----------------------------------------------------------------------------------------------
  private onSelectNonePressed(): void {
    this.listView.unselectAll();
    this.updateSelectedTexts();
    this.updateButtonsStates();
  }

  // ----------------------------------------------------------------------------------------------
  private setIntroText(): void {
    const jTexts: ITextsJson = this.cache.json.get('texts');
    this.txtItemIntro.setText(jTexts ? jTexts.intro || '' : '');
  }

  // ----------------------------------------------------------------------------------------------
  private updateAddButtonState(): void {
    const button = ButtonComponent.getComponent(this.add_button_image);
    button.enabled = this.archetypesData.length > 0;
  }

  // ----------------------------------------------------------------------------------------------
  private updateButtonsStates(): void {
    this.updateAddButtonState();
    this.updateRemoveButtonState();
    this.updateSelectAllButtonState();
    this.updateSelectNoneButtonState();
  }

  // ----------------------------------------------------------------------------------------------
  private updateRemoveButtonState(): void {
    const button = ButtonComponent.getComponent(this.remove_button_image);
    button.enabled = this.listView.numSelectedEntries > 0;
  }

  // ----------------------------------------------------------------------------------------------
  private updateSelectAllButtonState(): void {
    const button = ButtonComponent.getComponent(this.select_all_button_image);
    button.enabled = this.listView.isMultipleSelectionEnabled && this.listView.numEntries > 0;
  }

  // ----------------------------------------------------------------------------------------------
  private updateSelectNoneButtonState(): void {
    const button = ButtonComponent.getComponent(this.select_none_button_image);
    button.enabled = this.listView.numSelectedEntries > 0;
  }

  // ----------------------------------------------------------------------------------------------
  private updateSelectedTexts(archetypeData?: IArchetypeData): void {
    if (this.listView.isMultipleSelectionEnabled) {
      this.handleMultipleItemSelector(archetypeData);
    } else {
      this.handleSingleItemSelector(archetypeData);
    }
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
export default MainScene;
