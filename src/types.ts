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
  textureType: string; // "smooth" | "grainy" | "steaming" | "glittery" | "metallic_gold" | "crystalline" | "rainbow_metallic" | "volcanic_lava" | "cyber_grid" | "toxic_slime" | "ancient_bronze" | "petrified_fossil" | "gilded_relic" | "relic_moss_stone" | "carbon_fiber" | "velvet_flock" | "pearl_essence" | "rusty_iron" | "jadeite_emperor" | "frozen_glaze" | "molten_silver" | "honey_amber" | "bubble_tea" | "bamboo_weave" | "cosmic_stardust" | "gothic_obsidian" | "leopard_spotted" | "fluorescent_plasma" | "strawberry_jam" | "matte_clay" | "molten_chocolate" | "milky_way" | "glowing_magma" | "deep_ocean_chitin" | "neon_toxic_waste" | "porcelain_blue" | "ancient_parchment" | "chrome_plating" | "sea_salt_colloid" | "zebra_stripe" | "peacock_feather" | "marmoreal_onyx" | "asphalt_tar" | "phoenix_ashes" | "coral_calcified" | "cotton_candy"
  shapeType: string; // "standard_swirl" | "massive_mountain" | "fluid_drip" | "double_helix" | "eiffel_tower" | "royal_crown" | "ring_doughnut" | "alien_ufo" | "lucky_cat_tail" | "spherical_boba" | "space_station" | "abstract_cube" | "sharp_obelisk" | "cute_octopus" | "rose_bud" | "twisted_pretzel" | "golden_pyramid" | "lucky_bag" | "curvy_chili" | "gear_wheel" | "spiral_stair" | "cactus_pillar" | "leaning_tower" | "chess_knight" | "ancient_totem" | "gourmet_croissant" | "pagoda_spire" | "infinity_loop" | "thor_hammer" | "origami_crane" | "volcanic_caldera" | "cathedral_dome" | "fortune_cookie"
  ingredientsAnalyzed: string[];
  curatorComment: string;
  holdingDays: number;
  heldMealsHistory?: MealInput[];
  season?: "spring" | "summer" | "autumn" | "winter";
  timeOfDay?: "morning" | "afternoon" | "night";
}

export interface GuestComment {
  id: string;
  artId?: string; // Coupled masterpiece ID reference
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
    case "spherical_boba":
      return 4 + Math.min(5, hd);
    case "space_station":
      return 3 + Math.min(3, Math.floor(hd / 2));
    case "abstract_cube":
      return 4 + Math.min(5, hd);
    case "sharp_obelisk":
      return 3 + Math.min(4, Math.floor(hd / 2));
    case "cute_octopus":
      return 5 + Math.min(4, Math.floor(hd / 2));
    case "rose_bud":
      return 4 + Math.min(6, hd);
    case "twisted_pretzel":
      return 4;
    case "golden_pyramid":
      return 4 + Math.min(4, Math.floor(hd / 2));
    case "lucky_bag":
      return 3 + Math.min(3, Math.floor(hd / 3));
    case "curvy_chili":
      return 3 + Math.min(3, Math.floor(hd / 2));
    case "gear_wheel":
      return 3 + Math.min(3, Math.floor(hd / 2));
    case "spiral_stair":
      return 8 + Math.min(8, hd);
    case "cactus_pillar":
      return 4 + Math.min(4, Math.floor(hd / 2));
    case "leaning_tower":
      return 5 + Math.min(5, hd);
    case "chess_knight":
      return 3;
    case "ancient_totem":
      return 4 + Math.min(5, hd);
    case "gourmet_croissant":
      return 5;
    case "pagoda_spire":
      return 5 + Math.min(5, hd);
    case "infinity_loop":
      return 6 + Math.min(6, hd);
    case "thor_hammer":
      return 3;
    case "origami_crane":
      return 4;
    case "volcanic_caldera":
      return 4 + Math.min(4, Math.floor(hd / 2));
    case "cathedral_dome":
      return 4 + Math.min(4, Math.floor(hd / 2));
    case "fortune_cookie":
      return 3;
    default:
      return 4;
  }
}
