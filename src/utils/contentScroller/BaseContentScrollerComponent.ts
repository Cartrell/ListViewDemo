import BaseComponent from '../components/BaseComponent';
import IContentScrollerTarget from './IContentScrollerTarget';

export default abstract class BaseContentScrollerComponent extends BaseComponent implements
IContentScrollerTarget {
  // ==============================================================================================
  // public
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  abstract get areaHeight(): number;
  
  // ----------------------------------------------------------------------------------------------
  abstract get areaWidth(): number;
  
  // ----------------------------------------------------------------------------------------------
  get component(): BaseComponent {
    return (this);
  }
  
  // ----------------------------------------------------------------------------------------------
  abstract get container(): Phaser.GameObjects.Container;
  
  // ----------------------------------------------------------------------------------------------
  abstract get contentHeight(): number;
  
  // ----------------------------------------------------------------------------------------------
  abstract get contentWidth(): number;
  
  // ----------------------------------------------------------------------------------------------
  abstract get hzSliderName(): string;
  
  // ----------------------------------------------------------------------------------------------
  abstract get vtSliderName(): string;
}
