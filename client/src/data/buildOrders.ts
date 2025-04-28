export interface BuildOrder {
  id: number;
  name: string;
  civilization: string;
  god: string;
  type: string;
  description: string;
}

export const godsByCivilization: Record<string, string[]> = {
  "Chinese": ["Fuxi", "Nuwa", "Shennong"],
  "Greek": ["Zeus", "Hades", "Poseidon"],
  "Egyptian": ["Ra", "Isis", "Set"],
  "Norse": ["Thor", "Odin", "Loki", "Freyr"],
  "Atlantean": ["Kronos", "Oranos", "Gaia"]
};

export const buildOrders: BuildOrder[] = [
  {
    id: 1,
    name: "Fast Heroic Age",
    civilization: "Greek",
    god: "Poseidon",
    type: "Economic",
    description: "Focus on economic development to reach the Heroic Age quickly."
  },
  {
    id: 2,
    name: "Archer Rush",
    civilization: "Egyptian",
    god: "Ra",
    type: "Offensive",
    description: "Quickly train archers for an early offensive strategy."
  },
  {
    id: 3,
    name: "Fast Mythical Creatures",
    civilization: "Norse",
    god: "Odin",
    type: "Offensive",
    description: "Rush to produce powerful mythical units to overwhelm opponents."
  },
  {
    id: 4,
    name: "Divine Intervention",
    civilization: "Greek",
    god: "Zeus",
    type: "Divine Powers",
    description: "Focus on favor generation to call upon powerful divine powers."
  },
  {
    id: 5,
    name: "Defender's Stance",
    civilization: "Egyptian",
    god: "Isis",
    type: "Defensive",
    description: "Build strong defensive structures to withstand early attacks."
  },
  {
    id: 6,
    name: "Raiding Party",
    civilization: "Norse",
    god: "Thor",
    type: "Offensive",
    description: "Simple raiding strategy focused on disrupting enemy economy."
  },
  {
    id: 7,
    name: "Mythic Rush",
    civilization: "Atlantean",
    god: "Kronos",
    type: "Offensive",
    description: "Rapidly advance to unlock powerful mythical units and crush opponents."
  },
  {
    id: 8,
    name: "Prosperity Path",
    civilization: "Chinese",
    god: "Nuwa",
    type: "Economic",
    description: "Build a strong economy with focus on resource gathering and trading."
  },
  {
    id: 9,
    name: "Underworld Assault",
    civilization: "Greek",
    god: "Hades",
    type: "Offensive",
    description: "Utilize underworld units for a powerful mid-game attack strategy."
  }
];
