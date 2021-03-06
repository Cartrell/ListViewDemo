// You can write more code here
import { IArchetypeData } from '../data/ArchetypesData';
import { IListViewItem } from '../utils/components/listView/ListViewComponent';
import ListViewEntry from '../utils/components/listView/ListViewEntry';
import ListViewEntryComponent from '../utils/components/listView/ListViewEntryComponent';

/* eslint-disable */

/* START OF COMPILED CODE */

class DemoListViewEntry extends ListViewEntry {
  
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    
    // txtLabel
    const txtLabel = scene.add.bitmapText(48, 0, "falco-black", "label");
    txtLabel.text = "label";
    txtLabel.fontSize = 32;
    this.add(txtLabel);
    
    // iconImage
    const iconImage = scene.add.image(22, 20, "main", "radio-off-norm");
    this.add(iconImage);
    
    // this (components)
    const thisListViewEntryComponent = new ListViewEntryComponent(this);
    thisListViewEntryComponent.backNormColor = -1;
    thisListViewEntryComponent.backOverColor = 0xFF0020FF;
    thisListViewEntryComponent.backDownColor = 0xFF0010CF;
    thisListViewEntryComponent.labelOverColor = 0xFFFFFF00;
    thisListViewEntryComponent.backSelectedNormColor = 0xFF008000;
    thisListViewEntryComponent.backSelectedOverColor = 0xFF00BF000;
    thisListViewEntryComponent.backSelectedDownColor = 0xFF004000;
    thisListViewEntryComponent.labelSelectedOverColor = 0xFFFFFF00;
    
    this.txtLabel = txtLabel;
    this.iconImage = iconImage;
    
    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }
  
  public txtLabel: Phaser.GameObjects.BitmapText;
  
  private iconImage: Phaser.GameObjects.Image;
  
  /* START-USER-CODE */

  // Write your code here.

  /* eslint-enable */

  // ==============================================================================================
  // public
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  setEntryData(data: IListViewItem): IListViewItem {
    const item = super.setEntryData(data);
    const archetypeData: IArchetypeData = data ? data.data as IArchetypeData : null;

    if (archetypeData) {
      this.iconImage.tint = Phaser.Display.Color.ValueToColor(archetypeData.color).color;
    } else {
      this.iconImage.tint = 0xffffff;
    }

    return (item);
  }
  
  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
export default DemoListViewEntry;
