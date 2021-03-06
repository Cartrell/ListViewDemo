import * as Phaser from 'phaser';
import CheckboxComponent from './CheckboxComponent';

export default class CheckboxGroup {
  maxSelectedInGroup: number;
  
  private checkboxes: CheckboxComponent[];
  
  private _scene: Phaser.Scene;

  private _name: string;

  // ==========================================================================
  // public
  // ==========================================================================

  //---------------------------------------------------------------------------
  constructor(scene: Phaser.Scene) {
    this._scene = scene;
    this.checkboxes = [];
    this.maxSelectedInGroup = -1;
  }

  //---------------------------------------------------------------------------
  add(checkboxComponent: CheckboxComponent): void {
    if (!checkboxComponent) {
      return;
    }
    
    if (checkboxComponent.isInGroup) {
      const existingGroup = checkboxComponent.group;
      if (existingGroup === this) {
        // checkbox already in this group; nothing to do
        return;
      }

      existingGroup.remove(checkboxComponent);
      existingGroup.resolveMaxNumSelected(checkboxComponent);
    }

    this.checkboxes.push(checkboxComponent);
    this.resolveMaxNumSelected(checkboxComponent);
  }

  //---------------------------------------------------------------------------
  contains(checkboxComponent: CheckboxComponent): boolean {
    return (checkboxComponent && this.checkboxes.indexOf(checkboxComponent) > -1);
  }

  //---------------------------------------------------------------------------
  getCheckboxes(checkboxes: CheckboxComponent[] = null): CheckboxComponent[] {
    if (!checkboxes) {
      checkboxes = [];
    }

    this.checkboxes.forEach((checkbox) => {
      checkboxes.push(checkbox);
    });
    
    return (checkboxes);
  }

  //---------------------------------------------------------------------------
  getSelected(out?: CheckboxComponent[]): CheckboxComponent[] {
    if (!out) {
      out = [];
    }

    this.checkboxes.forEach((checkbox) => {
      if (checkbox.isOn) {
        out.push(checkbox);
      }
    });
    
    return (out);
  }

  //---------------------------------------------------------------------------
  set enabled(value: boolean) {
    this.checkboxes.forEach((checkbox) => {
      checkbox.enabled = value;
    });
  }

  //---------------------------------------------------------------------------
  get name(): string {
    return (this._name);
  }

  //---------------------------------------------------------------------------
  set name(value: string) {
    this.removeFromSceneData();
    this._name = value;
    this.addToSceneData();
  }

  //---------------------------------------------------------------------------
  remove(checkboxComponent: CheckboxComponent, destroyCheckbox = false): void {
    if (!this.contains(checkboxComponent)) {
      return;
    }

    // remove the ref from the checkbox from this group
    Phaser.Utils.Array.Remove(this.checkboxes, checkboxComponent);
    
    // remove the ref of this group from the checkbox
    checkboxComponent.removeFromGroup();

    if (destroyCheckbox) {
      checkboxComponent.destroy();
    }
  }

  //---------------------------------------------------------------------------
  removeAll(): void {
    while (this.checkboxes.length) {
      const checkbox = this.checkboxes.shift();
      this.remove(checkbox);
    }
  }

  //---------------------------------------------------------------------------
  resolveMaxNumSelected(checkboxComponent: CheckboxComponent): void {
    if (checkboxComponent.maxSelectedInGroup < 0) {
      return;
    }

    let max = -1;
    this.checkboxes.forEach((checkbox) => {
      max = Math.max(max, checkbox.maxSelectedInGroup);
    });

    this.maxSelectedInGroup = max;
  }

  //---------------------------------------------------------------------------
  get scene(): Phaser.Scene {
    return (this._scene);
  }

  //---------------------------------------------------------------------------
  set visible(value: boolean) {
    this.checkboxes.forEach((checkbox) => {
      checkbox.getGameObject().visible = value;
    });
  }

  // ==========================================================================
  // private
  // ==========================================================================
  
  //---------------------------------------------------------------------------
  private addToSceneData(): void {
    if (this._scene && this._name) {
      this._scene.data.set(this._name, this);
    }
  }

  //---------------------------------------------------------------------------
  private removeFromSceneData(): void {
    if (this._scene && this._name) {
      if (this._scene.data.get(this._name) !== undefined) {
        this._scene.data.remove(this._name);
      }
    }
  }
}
