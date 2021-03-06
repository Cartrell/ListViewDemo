import * as Phaser from 'phaser';
import scenes from './data/scenes';

// --------------------------------------------------------------------------
class ListViewDemoGame extends Phaser.Game {
  constructor() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1024,
      height: 768,
      scene: scenes,
      scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    super(config);

    this.scene.start('BootScene');
  }
}

window.onload = () => {
  const GAME_PROP = 'listViewDemoGame';
  window[GAME_PROP] = new ListViewDemoGame();
};
