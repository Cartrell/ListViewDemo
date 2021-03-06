import ButtonComponent from '../buttons/ButtonComponent';

export default class SliderComponentMetrics {
  // ==============================================================================================
  // public
  // ==============================================================================================
  
  // ----------------------------------------------------------------------------------------------
  static GetButtonHeight(button: ButtonComponent): number {
    const image = SliderComponentMetrics.ResolveImage(button);
    return (image ? image.displayHeight : 0);
  }

  // ----------------------------------------------------------------------------------------------
  static GetButtonWidth(button: ButtonComponent): number {
    const image = SliderComponentMetrics.ResolveImage(button);
    return (image ? image.displayWidth : 0);
  }

  // ----------------------------------------------------------------------------------------------
  static GetButtonX(button: ButtonComponent): number {
    const image = SliderComponentMetrics.ResolveImage(button);
    return (image ? image.x : 0);
  }

  // ----------------------------------------------------------------------------------------------
  static GetButtonX2(button: ButtonComponent): number {
    return (SliderComponentMetrics.GetButtonX(button)
      + SliderComponentMetrics.GetButtonWidth(button));
  }

  // ----------------------------------------------------------------------------------------------
  static GetButtonY(button: ButtonComponent): number {
    const image = SliderComponentMetrics.ResolveImage(button);
    return (image ? image.y : 0);
  }

  // ----------------------------------------------------------------------------------------------
  static GetButtonY2(button: ButtonComponent): number {
    return (SliderComponentMetrics.GetButtonY(button)
      + SliderComponentMetrics.GetButtonHeight(button));
  }

  // ----------------------------------------------------------------------------------------------
  static ResolveImage(button: ButtonComponent): Phaser.GameObjects.Image {
    const image = button ? button.getGameObject() : null;
    return (image instanceof Phaser.GameObjects.Image ? image : null);
  }

  // ----------------------------------------------------------------------------------------------
  static SetButtonHeight(button: ButtonComponent, height: number): void {
    const image = SliderComponentMetrics.ResolveImage(button);
    if (image) {
      image.displayHeight = height;
    }
  }

  // ----------------------------------------------------------------------------------------------
  static SetButtonOrigin(button: ButtonComponent, xOrigin?: number, yOrigin?: number): void {
    const image = SliderComponentMetrics.ResolveImage(button);
    if (image) {
      image.setOrigin(xOrigin, yOrigin);
    }
  }

  // ----------------------------------------------------------------------------------------------
  static SetButtonScaleX(button: ButtonComponent, scale: number): void {
    const image = SliderComponentMetrics.ResolveImage(button);
    if (image) {
      image.scaleX = scale;
    }
  }

  // ----------------------------------------------------------------------------------------------
  static SetButtonScaleY(button: ButtonComponent, scale: number): void {
    const image = SliderComponentMetrics.ResolveImage(button);
    if (image) {
      image.scaleY = scale;
    }
  }

  // ----------------------------------------------------------------------------------------------
  static SetButtonWidth(button: ButtonComponent, width: number): void {
    const image = SliderComponentMetrics.ResolveImage(button);
    if (image) {
      image.displayWidth = width;
    }
  }

  // ----------------------------------------------------------------------------------------------
  static SetButtonX(button: ButtonComponent, x: number): void {
    const image = SliderComponentMetrics.ResolveImage(button);
    if (image) {
      image.x = x;
    }
  }

  // ----------------------------------------------------------------------------------------------
  static SetButtonY(button: ButtonComponent, y: number): void {
    const image = SliderComponentMetrics.ResolveImage(button);
    if (image) {
      image.y = y;
    }
  }

  // ----------------------------------------------------------------------------------------------
  static SetEnabled(buttons: ButtonComponent | ButtonComponent[], enabled: boolean): void {
    if (!buttons) {
      return;
    }

    let _buttons: ButtonComponent[];

    if (buttons instanceof ButtonComponent) {
      _buttons = [buttons];
    } else {
      _buttons = buttons;
    }

    _buttons.forEach((button) => {
      if (button) {
        button.enabled = enabled;
      }
    });
  }
}
