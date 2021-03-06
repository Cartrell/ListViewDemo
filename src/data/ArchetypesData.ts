export interface IArchetypeData {
  name: string;
  icon: string;
  intro: string;
  detail: string[];
  source: string;
  color: string;
}

export default class ArchetypesData {
  // ==============================================================================================
  // properties
  // ==============================================================================================
  private availableArchetypes: IArchetypeData[];

  // ==============================================================================================
  // public
  // ==============================================================================================
  constructor(scene: Phaser.Scene) {
    this.availableArchetypes = scene.cache.json.get('archetypes');
  }

  // ----------------------------------------------------------------------------------------------
  addArcheTypeData(data: IArchetypeData): void {
    if (data && this.availableArchetypes.indexOf(data) === -1) {
      this.availableArchetypes.push(data);
    }
  }

  // ----------------------------------------------------------------------------------------------
  get length(): number {
    return (this.availableArchetypes.length);
  }

  // ----------------------------------------------------------------------------------------------
  removeRandomArcheTypeData(): IArchetypeData {
    return (Phaser.Utils.Array.RemoveRandomElement(this.availableArchetypes) as IArchetypeData);
  }
}
