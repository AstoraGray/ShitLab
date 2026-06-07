export interface MealInput {
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface PoopArt {
  id: string;
  title: string;
  artist: string;
  meals: MealInput;
  timestamp: string;
  rarity: "N" | "R" | "SR" | "UR";
  colorHex: string;
  accentColorHex: string;
  textureType: string; // "smooth" | "grainy" | "steaming" | "glittery" | "metallic_gold" | "crystalline" | "rainbow_metallic" | "volcanic_lava" | "cyber_grid" | "toxic_slime" | "ancient_bronze" | "petrified_fossil" | "gilded_relic" | "relic_moss_stone"
  shapeType: string; // "standard_swirl" | "massive_mountain" | "fluid_drip" | "double_helix" | "eiffel_tower" | "royal_crown" | "ring_doughnut" | "alien_ufo" | "lucky_cat_tail"
  ingredientsAnalyzed: string[];
  curatorComment: string;
  holdingDays: number;
  heldMealsHistory?: MealInput[];
}

export interface GuestComment {
  id: string;
  author: string;
  emoji: string; // "🧻" | "🏆" | "✨" | "💩" | "💨"
  text: string;
  timestamp: string;
}

/**
 * Calculates the total layers or segments based on the art's shapeType and holdingDays.
 * The longer they hold, the more segments we draw, making the feces taller and richer!
 */
export function getMaximumSegmentsCount(shapeType: string, holdingDays: number): number {
  const hd = Math.floor(holdingDays || 0);
  switch (shapeType) {
    case "double_helix":
      return 6 + Math.min(6, Math.max(0, Math.floor(hd * 0.8)));
    case "standard_swirl":
      return 4 + Math.min(6, Math.max(0, Math.floor(hd * 0.9)));
    case "massive_mountain":
      return 5 + Math.min(6, Math.max(0, Math.floor(hd * 0.9)));
    case "fluid_drip":
      return 3 + Math.min(5, Math.max(0, Math.floor(hd * 0.8)));
    case "eiffel_tower":
      return 6 + Math.min(5, Math.max(0, Math.floor(hd * 0.8)));
    case "royal_crown":
      // cushionsCount(1-2) + band(1) + pointsCount(3-7)
      const cushionsCount = 1 + Math.min(2, Math.max(0, Math.floor(hd / 4)));
      const pointsCount = 3 + Math.min(4, Math.max(0, Math.floor(hd / 2)));
      return cushionsCount + 1 + pointsCount;
    case "ring_doughnut":
      return 8 + Math.min(8, Math.max(0, hd));
    case "alien_ufo":
      // thrusters(1) + saucer(1) + dome(1) + antennas(1-4)
      const antennasCount = 1 + Math.min(3, Math.max(0, Math.floor(hd / 3)));
      return 3 + antennasCount;
    case "lucky_cat_tail":
      return 7 + Math.min(7, Math.max(0, hd));
    default:
      return 4;
  }
}
