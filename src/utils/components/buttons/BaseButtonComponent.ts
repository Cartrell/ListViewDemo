import * as Phaser from 'phaser';
import BaseComponent from '../BaseComponent';

export default abstract class BaseButtonComponent extends BaseComponent {
  // ==============================================================================================
  // public
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  abstract get downSoundKey(): string;

  // ----------------------------------------------------------------------------------------------
  abstract set downSoundKey(value: string);

  // ----------------------------------------------------------------------------------------------
  abstract get enabled(): boolean;
  
  // ----------------------------------------------------------------------------------------------
  abstract set enabled(value: boolean);

  // ----------------------------------------------------------------------------------------------
  abstract get isDown(): boolean;
  
  // ----------------------------------------------------------------------------------------------
  abstract get isOver(): boolean;

  // ----------------------------------------------------------------------------------------------
  abstract get pressedSoundKey(): string;

  // ----------------------------------------------------------------------------------------------
  abstract set pressedSoundKey(value: string);

  // ----------------------------------------------------------------------------------------------
  getVisibleComponent(): Phaser.GameObjects.Components.Visible {
    return ((this.getGameObject() as unknown) as Phaser.GameObjects.Components.Visible);
  }
}
