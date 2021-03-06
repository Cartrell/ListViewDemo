// You can write more code here
import CheckboxGroup from './CheckboxGroup';
import BaseButtonComponent from '../buttons/BaseButtonComponent';
import ButtonComponent from '../buttons/ButtonComponent';
import ComponentEvents from '../ComponentEvents';

/* eslint-disable */

/* START OF COMPILED CODE */

class CheckboxComponent extends BaseButtonComponent {
  
  constructor(gameObject: Phaser.GameObjects.Image) {
    super(gameObject);
    
    gameObject["__CheckboxComponent"] = this;
    
    this.gameObject = gameObject;
    this.normOnFrame;
    this.overOnFrame;
    this.downOnFrame;
    this.normOffFrame;
    this.overOffFrame;
    this.downOffFrame;
    this.chkCallback;
    this.context = this.scene;
    this.eventName = "";
    this.disabledOnFrame;
    this.disabledOffFrame;
    this.defaultEnabled = true;
    this.defaultIsOn = true;
    this.groupName = "";
    this.isRadioButton = false;
    this.maxSelectedInGroup = -1;
    this._pressedSoundKey = "";
    this._downSoundKey = "";
    
    /* START-USER-CTR-CODE */
    // Write your code here.
    
    /* eslint-enable */
    
    this.gameObject.once(Phaser.GameObjects.Events.DESTROY, this.onDestroy, this);

    this.buttonComponent = new ButtonComponent(this.gameObject);
    this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.onSceneUpdateInit, this);

    /* eslint-disable */

    /* END-USER-CTR-CODE */
  }
  
  private gameObject: Phaser.GameObjects.Image;
  
  public normOnFrame: {key:string,frame?:string|number};
  
  public overOnFrame: {key:string,frame?:string|number};
  
  public downOnFrame: {key:string,frame?:string|number};
  
  public normOffFrame: {key:string,frame?:string|number};
  
  public overOffFrame: {key:string,frame?:string|number};
  
  public downOffFrame: {key:string,frame?:string|number};
  
  public chkCallback: checkboxComponentCallback;
  
  public context: any;
  
  public eventName: string;
  
  public disabledOnFrame: {key:string,frame?:string|number};
  
  public disabledOffFrame: {key:string,frame?:string|number};
  
  public defaultEnabled: boolean;
  
  public defaultIsOn: boolean;
  
  public groupName: string;
  
  public isRadioButton: boolean;
  
  public maxSelectedInGroup: number;
  
  public _pressedSoundKey: string;
  
  public _downSoundKey: string;
  
  static getComponent(gameObject: Phaser.GameObjects.Image): CheckboxComponent {
    return gameObject["__CheckboxComponent"];
  }
  
  /* START-USER-CODE */

  // Write your code here.

  /* eslint-enable */

  // ==================================================================================================================
  // properties
  // ==================================================================================================================
  private buttonComponent: ButtonComponent;

  private _group: CheckboxGroup;

  private _isOn: boolean;

  // ==============================================================================================
  // public
  // ==============================================================================================
  
  //-----------------------------------------------------------------------------------------------
  createGroup(groupName?: string): CheckboxGroup {
    if (!this._group) {
      this._group = new CheckboxGroup(this.scene);
      this._group.name = groupName;
    }
    return (this._group);
  }

  //-----------------------------------------------------------------------------------------------
  destroy(fromGameObject = false): void {
    super.destroy(fromGameObject);
    
    this.removeFromGroup();
    
    if (this.buttonComponent) {
      this.buttonComponent.destroy();
      this.buttonComponent = null;
    }

    if (!fromGameObject) {
      if (this.gameObject) {
        this.gameObject.destroy();
        this.gameObject = null;
      }
    }
  }

  //-----------------------------------------------------------------------------------------------
  get downSoundKey(): string {
    return (this.buttonComponent.downSoundKey);
  }
  
  //-----------------------------------------------------------------------------------------------
  set downSoundKey(value: string) {
    this.buttonComponent.downSoundKey = value;
  }

  //-----------------------------------------------------------------------------------------------
  get enabled(): boolean {
    return (this.buttonComponent.enabled);
  }

  //-----------------------------------------------------------------------------------------------
  set enabled(value: boolean) {
    this.buttonComponent.enabled = value;
  }
  
  //-----------------------------------------------------------------------------------------------
  getGameObject(): Phaser.GameObjects.Image {
    return (this.gameObject);
  }

  //-----------------------------------------------------------------------------------------------
  get group(): CheckboxGroup {
    return (this.createGroup());
  }

  //-----------------------------------------------------------------------------------------------
  get isDown(): boolean {
    return (this.buttonComponent.isDown);
  }

  //-----------------------------------------------------------------------------------------------
  get isInGroup(): boolean {
    return (this._group && this._group.contains(this));
  }

  //-----------------------------------------------------------------------------------------------
  get isOn(): boolean {
    return (this._isOn);
  }

  //-----------------------------------------------------------------------------------------------
  set isOn(value: boolean) {
    this._isOn = value;
    this.updateCheckboxFrameReferences();
    this.buttonComponent.updateButtonImage();
  }
  
  //-----------------------------------------------------------------------------------------------
  get isOver(): boolean {
    return (this.buttonComponent.isOver);
  }

  //-----------------------------------------------------------------------------------------------
  get pressedSoundKey(): string {
    return (this.buttonComponent.pressedSoundKey);
  }
  
  //-----------------------------------------------------------------------------------------------
  set pressedSoundKey(value: string) {
    this.buttonComponent.pressedSoundKey = value;
  }

  //-----------------------------------------------------------------------------------------------
  removeFromGroup(): void {
    if (this._group) {
      this._group.remove(this);
    }
  }

  //-----------------------------------------------------------------------------------------------
  updateCheckboxFrameReferences(): void {
    const component = this.buttonComponent;
    if (this._isOn) {
      component.normFrame = this.normOnFrame;
      component.overFrame = this.overOnFrame;
      component.downFrame = this.downOnFrame;
      component.disabledFrame = this.disabledOnFrame;
    } else {
      component.normFrame = this.normOffFrame;
      component.overFrame = this.overOffFrame;
      component.downFrame = this.downOffFrame;
      component.disabledFrame = this.disabledOffFrame;
    }
  }

  // ==============================================================================================
  // private
  // ==============================================================================================

  //-----------------------------------------------------------------------------------------------
  private callback(/* component: ButtonComponent */): void {
    if (this.group && this.group.maxSelectedInGroup > -1) {
      const currentNumSelected = this.group.getSelected().length;
      if (currentNumSelected >= this.group.maxSelectedInGroup) {
        return;
      }
    }

    if (this.isRadioButton) {
      this.handleRadioPressed();
    } else {
      this.handleCheckPressed();
    }
  }

  //-----------------------------------------------------------------------------------------------
  private handleCheckPressed(): void {
    this.isOn = !this.isOn;
    this.notifyPressed();
  }

  //-----------------------------------------------------------------------------------------------
  private handleRadioPressed(): void {
    if (this.isOn) {
      return;
    }

    this.isOn = true;

    this.group.getCheckboxes().forEach((checkbox) => {
      if (checkbox !== this) {
        checkbox.isOn = false;
      }
    });

    this.notifyPressed();
  }

  //-----------------------------------------------------------------------------------------------
  private init(): void {
    this.isOn = this.defaultIsOn;

    // init button component
    this.buttonComponent.callback = this.callback;
    this.buttonComponent.context = this;
    this.buttonComponent.downSoundKey = this._downSoundKey;
    this.buttonComponent.pressedSoundKey = this._pressedSoundKey;

    // init group
    if (this.groupName) {
      const existingGroup = this.scene.data.get(this.groupName) as CheckboxGroup;
      
      if (existingGroup instanceof CheckboxGroup) {
        this._group = existingGroup;
      } else {
        this.createGroup(this.groupName);
      }

      this._group.add(this);
    }

    this.events.emit(ComponentEvents.INIT, this);
  }

  //-----------------------------------------------------------------------------------------------
  private notifyPressed(): void {
    if (this.chkCallback) {
      this.chkCallback.call(this.context, this);
    }
    
    if (this.eventName) {
      this.scene.events.emit(this.eventName, this);
    }
  }

  //-----------------------------------------------------------------------------------------------
  private onDestroy(): void {
    this.removeFromGroup();
  }

  //-----------------------------------------------------------------------------------------------
  private onSceneUpdateInit(): void {
    this.init();
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
type checkboxComponentCallback = (component: CheckboxComponent) => void;

export default CheckboxComponent;
