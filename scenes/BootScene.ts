import * as Phaser from 'phaser';

//-----------------------------------------------------------------------------
/** @constructor */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  // ==========================================================================
  // public
  // ==========================================================================

  //---------------------------------------------------------------------------
  create(): void {
    this.scene.start('PreloaderScene');
  }

  //---------------------------------------------------------------------------
  preload(): void {
    this.load.pack('preloader-pack', 'assets/preloader-pack.json');
  }
}
