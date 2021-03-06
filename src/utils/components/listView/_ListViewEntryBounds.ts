import ListViewEntry from './ListViewEntry';

export default abstract class _ListViewEntryBounds {
  // ==============================================================================================
  // public
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  static GetBitmapTextBounds(rectOut: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle {
    if (!rectOut) {
      rectOut = new Phaser.Geom.Rectangle();
    }

    if (!(this instanceof Phaser.GameObjects.BitmapText)) {
      return (rectOut);
    }

    const SHOULD_ROUND = true;
    const size = (<Phaser.GameObjects.BitmapText> this).getTextBounds(SHOULD_ROUND);
    rectOut.x = size.global.x;
    rectOut.y = size.global.y;
    rectOut.width = size.global.width;
    rectOut.height = size.global.height;
    return (rectOut);
  }

  // ----------------------------------------------------------------------------------------------
  static GetBounds(entry: ListViewEntry, output?: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle {
    if (output === undefined) {
      output = new Phaser.Geom.Rectangle();
    } else {
      output.setEmpty();
    }

    const children = entry.list;
    if (children.length === 0) {
      return (output);
    }

    const tempRect = new Phaser.Geom.Rectangle();
    let hasSetFirst = false;

    for (let index = 0; index < children.length; index += 1) {
      const child = children[index];
      if (child instanceof Phaser.GameObjects.BitmapText) {
        const GB_PROP = 'getBounds';
        child[GB_PROP](tempRect);
      } else {
        _ListViewEntryBounds.GetBoundsPosition(child, 'getTopLeft', tempRect);
        const TLx = tempRect.x;
        const TLy = tempRect.y;

        _ListViewEntryBounds.GetBoundsPosition(child, 'getTopRight', tempRect);
        const TRx = tempRect.x;
        const TRy = tempRect.y;

        _ListViewEntryBounds.GetBoundsPosition(child, 'getBottomLeft', tempRect);
        const BLx = tempRect.x;
        const BLy = tempRect.y;

        _ListViewEntryBounds.GetBoundsPosition(child, 'getBottomRight', tempRect);
        const BRx = tempRect.x;
        const BRy = tempRect.y;

        tempRect.x = Math.min(TLx, TRx, BLx, BRx);
        tempRect.y = Math.min(TLy, TRy, BLy, BRy);
        tempRect.width = Math.max(TLx, TRx, BLx, BRx) - tempRect.x;
        tempRect.height = Math.max(TLy, TRy, BLy, BRy) - tempRect.y;
      }

      if (!hasSetFirst) {
        output.setTo(tempRect.x, tempRect.y, tempRect.width, tempRect.height);
        hasSetFirst = true;
      } else {
        Phaser.Geom.Rectangle.Union(tempRect, output, output);
      }
    }

    output.right += output.x;
    output.x = 0;

    output.bottom += output.y;
    output.y = 0;

    return (output);
  }

  // ==============================================================================================
  // private
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  private static GetBoundsPosition(child: Phaser.GameObjects.GameObject, boundsProp: string,
    tempRect: Phaser.Geom.Rectangle): void {
    if (boundsProp in child) {
      child[boundsProp](tempRect);
    }
  }
}
