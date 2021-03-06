// You can write more code here
import * as Phaser from 'phaser';

/* eslint-disable */
/* START OF COMPILED CODE */

class PreloaderScene extends Phaser.Scene {
  
  constructor() {
    super("PreloaderScene");
    
    this.background;
    this.preloader_bar;
    
    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }
  
  preload() {
    
    this.load.pack("main-pack", "assets/main-pack.json");
  }
  
  _create() {
    
    // background
    const background = this.add.image(0, 0, "preloader", "background");
    background.scaleX = 1.28;
    background.scaleY = 1.28;
    background.setOrigin(0, 0);
    
    // preloader_bar
    const preloader_bar = this.add.image(512, 384, "preloader", "preloader_bar");
    
    this.background = background;
    this.preloader_bar = preloader_bar;
  }
  
  private background: Phaser.GameObjects.Image;
  
  private preloader_bar: Phaser.GameObjects.Image;
  
  /* START-USER-CODE */

  // Write your code here.
  /* eslint-enable */

  private barMask: Phaser.GameObjects.Graphics;

  // --------------------------------------------------------------------------
  init(): void {
    this._create();
    this._createPreloaderBarMask();

    this.load.on(Phaser.Loader.Events.PROGRESS, () => {
      this.barMask.scaleX = this.load.progress;
    });
  }

  // --------------------------------------------------------------------------
  create(): void {
    this.scene.start('MainScene');
  }

  // ==========================================================================
  // private
  // ==========================================================================

  // --------------------------------------------------------------------------
  private _createPreloaderBarMask(): void {
    const bounds = this.preloader_bar.getBounds();
    
    this.barMask = this.make.graphics({
      x: bounds.x,
      y: bounds.y,
    });

    this.barMask.fillStyle(0, 0);
    this.barMask.fillRect(0, 0, bounds.width, bounds.height);
    this.barMask.scaleX = 0;

    const geomMask = new Phaser.Display.Masks.GeometryMask(this, this.barMask);

    this.preloader_bar.mask = geomMask;
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
export default PreloaderScene;
