// You can write more code here
import { IArchetypeData } from '../src/data/ArchetypesData';
import ButtonComponent from '../src/utils/components/buttons/ButtonComponent';
import ButtonComponentEvents from '../src/utils/components/buttons/ButtonComponentEvents';
import SliderComponent from '../src/utils/components/sliders/SliderComponent';
import TextViewComponent from '../src/utils/components/textView/TextViewComponent';

/* eslint-disable */

/* START OF COMPILED CODE */

class DetailsScene extends Phaser.Scene {
  
  constructor() {
    super("DetailsScene");
    
    this.background;
    this.icon_ph;
    this.txtHeader;
    this.txtImageSource;
    this.detailsTextContainer;
    this.rect;
    this.vtSlider;
    this.textField;
    this.back_button_image;
    
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
    
    // icon_ph
    const icon_ph = this.add.image(860, 150, "main", "node");
    icon_ph.scaleX = 6;
    icon_ph.scaleY = 6;
    icon_ph.setOrigin(0.5, 0);
    
    // txtHeader
    const txtHeader = this.add.bitmapText(512, 50, "falco-black", "[header]");
    txtHeader.setOrigin(0.5, 0);
    txtHeader.tintTopLeft = 65535;
    txtHeader.tintTopRight = 65535;
    txtHeader.tintBottomLeft = 65535;
    txtHeader.tintBottomRight = 65535;
    txtHeader.text = "[header]";
    txtHeader.fontSize = 32;
    
    // txtImageSource
    const txtImageSource = this.add.bitmapText(710, 105, "OpenSansBold", "Press to view image source (Opens a new browser window.)");
    txtImageSource.text = "Press to view image source (Opens a new browser window.)";
    txtImageSource.fontSize = 16;
    
    // detailsTextContainer
    const detailsTextContainer = this.add.container(28, 100);
    
    // rect
    const rect = this.add.image(0, 0, "main", "node");
    rect.scaleX = 13;
    rect.scaleY = 11;
    rect.setOrigin(0, 0);
    detailsTextContainer.add(rect);
    
    // vtSlider
    const vtSlider = this.add.container(-875.39697265625, -469.3283386230469);
    detailsTextContainer.add(vtSlider);
    
    // textField
    const textField = this.add.bitmapText(0, 0, "OpenSansBold", "[content]");
    textField.text = "[content]";
    textField.fontSize = 36;
    detailsTextContainer.add(textField);
    
    // back_button_image
    const back_button_image = this.add.image(506, 726, "main", "back-button-norm");
    
    // detailsTextContainer (components)
    const detailsTextContainerTextViewComponent = new TextViewComponent(detailsTextContainer);
    detailsTextContainerTextViewComponent._hzSliderName = "";
    
    // vtSlider (components)
    const vtSliderSliderComponent = new SliderComponent(vtSlider);
    vtSliderSliderComponent._isHorizontal = false;
    vtSliderSliderComponent._bodyImage = {"key":"main","frame":"button_slider_body_vt_body"};
    vtSliderSliderComponent._handleNormImage = {"key":"main","frame":"button_slider_handle_vt_norm"};
    vtSliderSliderComponent._handleOverImage = {"key":"main","frame":"button_slider_handle_vt_over"};
    vtSliderSliderComponent._handleDownImage = {"key":"main","frame":"button_slider_handle_vt_down"};
    vtSliderSliderComponent._handleDisabledImage = {"key":"main","frame":"button_slider_handle_vt_disabled"};
    vtSliderSliderComponent.isVisibleDefault = false;
    
    // back_button_image (components)
    const back_button_imageButtonComponent = new ButtonComponent(back_button_image);
    back_button_imageButtonComponent.normFrame = {"key":"main","frame":"back-button-norm"};
    back_button_imageButtonComponent.overFrame = {"key":"main","frame":"back-button-over"};
    back_button_imageButtonComponent.downFrame = {"key":"main","frame":"back-button-down"};
    back_button_imageButtonComponent.callback = this.onBackPressed;
    back_button_imageButtonComponent.context = this;
    
    this.background = background;
    this.icon_ph = icon_ph;
    this.txtHeader = txtHeader;
    this.txtImageSource = txtImageSource;
    this.detailsTextContainer = detailsTextContainer;
    this.rect = rect;
    this.vtSlider = vtSlider;
    this.textField = textField;
    this.back_button_image = back_button_image;
  }
  
  private background: Phaser.GameObjects.Image;
  
  private icon_ph: Phaser.GameObjects.Image;
  
  private txtHeader: Phaser.GameObjects.BitmapText;
  
  private txtImageSource: Phaser.GameObjects.BitmapText;
  
  private detailsTextContainer: Phaser.GameObjects.Container;
  
  private rect: Phaser.GameObjects.Image;
  
  private vtSlider: Phaser.GameObjects.Container;
  
  private textField: Phaser.GameObjects.BitmapText;
  
  private back_button_image: Phaser.GameObjects.Image;
  
  /* START-USER-CODE */

  // Write your code here.

  /* eslint-enable */

  // ==============================================================================================
  // properties
  // ==============================================================================================
  private sourceTextButton: ButtonComponent;

  private iconImage: Phaser.GameObjects.Image;

  private archetypeData: IArchetypeData;

  private source: string;

  // ==============================================================================================
  // public
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  create(data: unknown): void {
    this._create();
    this.archetypeData = data as IArchetypeData;
    this.icon_ph.visible = false;
    this.events.once(Phaser.Scenes.Events.UPDATE, this.onSceneUpdateInit, this);
  }

  // ==============================================================================================
  // private
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  private clearData(): void {
    this.txtHeader.text = '';
    this.setDetailText('');
  }

  // ----------------------------------------------------------------------------------------------
  private onBackPressed(): void {
    this.scene.stop();
    this.scene.wake('MainScene');
  }

  // ----------------------------------------------------------------------------------------------
  private onSceneUpdateInit(): void {
    this.present(this.archetypeData);
  }

  // ----------------------------------------------------------------------------------------------
  private onSourcePressed(): void {
    if (this.source) {
      window.open(this.source, '_blank');
    }
  }

  // ----------------------------------------------------------------------------------------------
  private present(data: IArchetypeData): void {
    if (data) {
      this.setData(data);
    } else {
      this.clearData();
    }
  }

  // ----------------------------------------------------------------------------------------------
  private setData(data: IArchetypeData) {
    this.txtHeader.text = data.name;
    this.setDetailText(data.detail);
    this.setIconImage(data.icon);
    this.setSource(data.source);
  }

  // ----------------------------------------------------------------------------------------------
  private setDetailText(text: string | string[]): void {
    const textView = TextViewComponent.getComponent(this.detailsTextContainer);
    textView.setText(text);
  }

  // ----------------------------------------------------------------------------------------------
  private setIconImage(icon: string): void {
    const TEXTURE = 'archetype-icons';
    this.iconImage = this.add.image(this.icon_ph.x, this.icon_ph.y, TEXTURE, `${icon}.webp`);
    this.iconImage.setOrigin(this.icon_ph.originX, this.icon_ph.originY);
    
    const hzScale = this.icon_ph.displayWidth / this.iconImage.displayWidth;
    const vtScale = this.icon_ph.displayHeight / this.iconImage.displayHeight;
    const scale = Math.min(hzScale, vtScale);
    this.iconImage.scale = scale;
  }

  // ----------------------------------------------------------------------------------------------
  private setSource(source: string): void {
    this.source = source;

    this.txtImageSource.maxWidth = this.icon_ph.displayWidth;

    if (this.txtImageSource.text) {
      this.setSourceImageButton();
    }
  }

  // ----------------------------------------------------------------------------------------------
  private setSourceImageButton(): void {
    this.sourceTextButton = new ButtonComponent(this.iconImage);
    this.sourceTextButton.callback = this.onSourcePressed;
    this.sourceTextButton.context = this;
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
export default DetailsScene;
