import BaseComponent from '../components/BaseComponent';

interface IContentScrollerTarget {
  /**
   * The pixel height of the visible area that contains the content. Content outside of this
   * area is masked.
   */
  areaHeight: number;

  /**
   * The pixel width of the visible area that contains the content. Content outside of this
   * area is masked.
   */
  areaWidth: number;

  /**
   * The component to which the scroller is associated with.
   */
  component: BaseComponent;

  /**
   * The game object that contains the content.
   */
  container: Phaser.GameObjects.Container;

  /**
   * The pixel height of the content being scrolled.
   */
  contentHeight: number;

  /**
   * The pixel width of the content being scrolled.
   */
  contentWidth: number;

  /**
   * The variable name of the game object to which the horizontal `SliderComponent` is attached.
   */
  hzSliderName: string;

  /**
   * The variable name of the game object to which the vertical `SliderComponent` is attached.
   */
  vtSliderName: string;
}

export default IContentScrollerTarget;
