import * as Phaser from 'phaser';

// ----------------------------------------------------------------------------------------------
export type TextObject = Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;

// ----------------------------------------------------------------------------------------------
export function getScene(gameObject: Phaser.GameObjects.GameObject): Phaser.Scene {
  // kludge to get the 'scene' protected memeber
  const SCENE_PROP = 'scene';
  const scene: Phaser.Scene = gameObject ? gameObject[SCENE_PROP] : null;
  return (scene);
}

// ----------------------------------------------------------------------------------------------
/**
 * Takes the given `x` and `y` coordinates and converts them into local space for this
 * Game Object, taking into account parent and local transforms, and the Display Origin.
 *
 * The returned Vector2 contains the translated point in its properties.
 *
 * A Camera needs to be provided in order to handle modified scroll factors. If no
 * camera is specified, it will use the `main` camera from the Scene to which this
 * Game Object belongs.
 * 
 * (Code taken from  Phaser v3.50.0 Beta 11)
 *
 * @method Phaser.GameObjects.Components.Transform#getLocalPoint
 *
 * @param {unknown} gameObject - The game object to use as the local space. This game object
 * must use the following Phaser mixins:
 * 
 * `Phaser.GameObjects.Components.Origin`
 * `Phaser.GameObjects.Components.ScrollFactor`
 * `Phaser.GameObjects.Components.Transform`
 * @param {number} x - The x position to translate.
 * @param {number} y - The y position to translate.
 * @param {Phaser.Math.Vector2} [pointOut] - A Vector2, or point-like object, to store the
 * results in.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera which is being tested against.
 * If not given will use the Scene default camera.
 * 
 * @return {Phaser.Math.Vector2} The translated point.
 */
export function getLocalPoint(gameObject: unknown, x: number, y: number,
  pointOut?: Phaser.Math.Vector2,
  camera?: Phaser.Cameras.Scene2D.Camera): Phaser.Math.Vector2 {
  if (!gameObject) {
    return (pointOut);
  }

  if (!pointOut) {
    pointOut = new Phaser.Math.Vector2();
  }
  
  if (!camera) {
    const baseGameObject = gameObject as Phaser.GameObjects.GameObject;
    camera = getScene(baseGameObject).sys.cameras.main;
  }

  const gameObjectRecordKludge = <Record<string, unknown>>gameObject;

  const SCROLL_FACTOR_X = 'scrollFactorX';
  const SCROLL_FACTOR_Y = 'scrollFactorY';
  let px: number;
  let py: number;

  if (SCROLL_FACTOR_X in gameObjectRecordKludge && SCROLL_FACTOR_Y in gameObjectRecordKludge) {
    const scrollFactor = gameObject as Phaser.GameObjects.Components.ScrollFactor;
    const csx = camera.scrollX;
    const csy = camera.scrollY;
    px = x + (csx * scrollFactor.scrollFactorX) - csx;
    py = y + (csy * scrollFactor.scrollFactorY) - csy;
  } else {
    px = x;
    py = y;
  }

  const PARENT_CONTAINER = 'parentContainer';
  const transform = gameObject as Phaser.GameObjects.Components.Transform;
  if (PARENT_CONTAINER in gameObjectRecordKludge && gameObject[PARENT_CONTAINER]) {
    transform.getWorldTransformMatrix().applyInverse(px, py, pointOut);
  } else {
    Phaser.Math.TransformXY(px, py, transform.x, transform.y, transform.rotation,
      transform.scaleX, transform.scaleY, pointOut);
  }
  
  // Normalize origin
  const ORIGIN_COMPONENT = '_originComponent';
  if (ORIGIN_COMPONENT in gameObjectRecordKludge) {
    const origin = gameObject as Phaser.GameObjects.Components.Origin;
    pointOut.x += origin.displayOriginX;
    pointOut.y += origin.displayOriginY;
  }

  return (pointOut);
}

// ----------------------------------------------------------------------------------------------
export function getPropertyObject(container: Phaser.Scene | Phaser.GameObjects.Container,
  propertyName: string): Phaser.GameObjects.GameObject | Phaser.GameObjects.Components.Visible {
  return (container && propertyName in container ? container[propertyName] : null);
}

// ----------------------------------------------------------------------------------------------
export function getPropertyBitmapText(container: Phaser.Scene | Phaser.GameObjects.Container,
  propertyName: string): Phaser.GameObjects.BitmapText {
  const text = getPropertyObject(container, propertyName);
  return (text instanceof Phaser.GameObjects.BitmapText ? text : null);
}

// ----------------------------------------------------------------------------------------------
export function getPropertyImage(container: Phaser.Scene | Phaser.GameObjects.Container,
  propertyName: string): Phaser.GameObjects.Image {
  const image = getPropertyObject(container, propertyName);
  return (image instanceof Phaser.GameObjects.Image ? image : null);
}

// ----------------------------------------------------------------------------------------------
export function getPropertySprite(container: Phaser.Scene | Phaser.GameObjects.Container,
  propertyName: string): Phaser.GameObjects.Sprite {
  const sprite = getPropertyObject(container, propertyName);
  return (sprite instanceof Phaser.GameObjects.Sprite ? sprite : null);
}

// ----------------------------------------------------------------------------------------------
export function getPropertyText(container: Phaser.Scene | Phaser.GameObjects.Container,
  propertyName: string): Phaser.GameObjects.Text {
  const text = getPropertyObject(container, propertyName);
  return (text instanceof Phaser.GameObjects.Text ? text : null);
}
