// You can write more code here
import BaseComponent from '../BaseComponent';
import ListViewEntry from './ListViewEntry';

export type listViewEntryColor = number | string;

/* eslint-disable */

/* START OF COMPILED CODE */

class ListViewEntryComponent extends BaseComponent {
  
  constructor(gameObject: ListViewEntry) {
    super(gameObject);
    
    gameObject["__ListViewEntryComponent"] = this;
    
    this.gameObject = gameObject;
    this.backNormColor = -1;
    this.backOverColor = -1;
    this.backDownColor = -1;
    this.labelNormColor = -1;
    this.labelOverColor = -1;
    this.labelDownColor = -1;
    this.backSelectedNormColor = -1;
    this.backSelectedOverColor = -1;
    this.backSelectedDownColor = -1;
    this.labelSelectedNormColor = -1;
    this.labelSelectedOverColor = -1;
    this.labelSelectedDownColor = -1;
    
    /* START-USER-CTR-CODE */
    // Write your code here.
    
    /* eslint-enable */

    gameObject._onComponentAssigned(this);

    /* eslint-disable */

    /* END-USER-CTR-CODE */
  }
  
  private gameObject: ListViewEntry;
  
  public backNormColor: listViewEntryColor;
  
  public backOverColor: listViewEntryColor;
  
  public backDownColor: listViewEntryColor;
  
  public labelNormColor: listViewEntryColor;
  
  public labelOverColor: listViewEntryColor;
  
  public labelDownColor: listViewEntryColor;
  
  public backSelectedNormColor: listViewEntryColor;
  
  public backSelectedOverColor: listViewEntryColor;
  
  public backSelectedDownColor: listViewEntryColor;
  
  public labelSelectedNormColor: listViewEntryColor;
  
  public labelSelectedOverColor: listViewEntryColor;
  
  public labelSelectedDownColor: listViewEntryColor;
  
  static getComponent(gameObject: ListViewEntry): ListViewEntryComponent {
    return gameObject["__ListViewEntryComponent"];
  }
  
  /* START-USER-CODE */

  // Write your code here.
  
  /* eslint-enable */

  // ==============================================================================================
  // properties
  // ==============================================================================================

  // ==============================================================================================
  // public
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------  
  getGameObject(): ListViewEntry {
    return (this.gameObject);
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
export default ListViewEntryComponent;
