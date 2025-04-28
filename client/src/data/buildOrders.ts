export interface BuildOrder {
  id: number;
  name: string;
  civilization: string;
  type: string;
  difficulty: number; // 1-5
  time: string; // format: "00:00"
  description: string;
}

export const buildOrders: BuildOrder[] = [
  {
    id: 1,
    name: "Fast Heroic Age",
    civilization: "Greek",
    type: "Economic",
    difficulty: 3,
    time: "8:30",
    description: "Focus on economic development to reach the Heroic Age quickly."
  },
  {
    id: 2,
    name: "Archer Rush",
    civilization: "Egyptian",
    type: "Offensive",
    difficulty: 2,
    time: "5:45",
    description: "Quickly train archers for an early offensive strategy."
  },
  {
    id: 3,
    name: "Fast Mythical Creatures",
    civilization: "Norse",
    type: "Offensive",
    difficulty: 4,
    time: "7:15",
    description: "Rush to produce powerful mythical units to overwhelm opponents."
  },
  {
    id: 4,
    name: "Divine Intervention",
    civilization: "Greek",
    type: "Divine Powers",
    difficulty: 5,
    time: "12:30",
    description: "Focus on favor generation to call upon powerful divine powers."
  },
  {
    id: 5,
    name: "Defender's Stance",
    civilization: "Egyptian",
    type: "Defensive",
    difficulty: 3,
    time: "6:45",
    description: "Build strong defensive structures to withstand early attacks."
  },
  {
    id: 6,
    name: "Raiding Party",
    civilization: "Norse",
    type: "Offensive",
    difficulty: 1,
    time: "4:30",
    description: "Simple raiding strategy focused on disrupting enemy economy."
  }
];
