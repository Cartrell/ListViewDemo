import ListViewEntry from './ListViewEntry';
import ListViewEntryComponent, { listViewEntryColor } from './ListViewEntryComponent';

/**
 * @internal
 */
export default abstract class _ListViewEntryColor {
  // ==============================================================================================
  // public
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  static Resolve(entry: ListViewEntry, isBack: boolean): Phaser.Display.Color {
    return (entry ? _ListViewEntryColor.ResolveColor(entry, isBack) : null);
  }

  // ==============================================================================================
  // private
  // ==============================================================================================
  
  // ----------------------------------------------------------------------------------------------
  private static GetColor(entryColor: listViewEntryColor): Phaser.Display.Color {
    return (entryColor !== -1 ? Phaser.Display.Color.ValueToColor(entryColor) : null);
  }

  // ----------------------------------------------------------------------------------------------
  private static GetFirstValidEntryColor(entryColors: listViewEntryColor[]): listViewEntryColor {
    const color = entryColors.find((entryColor) => entryColor !== -1);
    return (color || entryColors[0]);
  }

  // ----------------------------------------------------------------------------------------------
  private static ResolveColor(entry: ListViewEntry, isBack: boolean): Phaser.Display.Color {
    const comp = ListViewEntryComponent.getComponent(entry);
    if (!comp) {
      // sanity check
      return (null);
    }

    const normColor = isBack ? comp.backNormColor : comp.labelNormColor;
    const overColor = isBack ? comp.backOverColor : comp.labelOverColor;
    const downColor = isBack ? comp.backDownColor : comp.labelDownColor;
    const selectedNormColor = isBack ? comp.backSelectedNormColor : comp.labelSelectedNormColor;
    const selectedOverColor = isBack ? comp.backSelectedOverColor : comp.labelSelectedOverColor;
    const selectedDownColor = isBack ? comp.backSelectedDownColor : comp.labelSelectedDownColor;

    let entryColor: listViewEntryColor = -1;

    if (entry.buttonComponent.isDown) {
      if (entry.buttonComponent.isOver) {
        entryColor = _ListViewEntryColor.GetFirstValidEntryColor(
          entry.isSelected
            ? [selectedDownColor, selectedOverColor, selectedNormColor]
            : [downColor, overColor, normColor],
        );
      } else {
        entryColor = entry.isSelected ? selectedNormColor : normColor;
      }
    } else if (entry.buttonComponent.isOver) {
      entryColor = _ListViewEntryColor.GetFirstValidEntryColor(
        entry.isSelected
          ? [selectedOverColor, selectedNormColor]
          : [overColor, normColor],
      );
    } else {
      entryColor = entry.isSelected ? selectedNormColor : normColor;
    }
  
    return (_ListViewEntryColor.GetColor(entryColor));
  }
}
