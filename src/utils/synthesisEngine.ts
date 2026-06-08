import {
  INGREDIENT_ART_VOCAB_TABLE,
  DIET_THEMES_TABLE,
  SEASON_TIME_HYBRID_TABLE,
  TEXTURE_DISCUSSION_TABLE,
  TITLE_TEMPLATES_TABLE,
  CURATOR_ESSAY_TABLE,
  queryIngredientSynonyms,
  queryThemeConfig,
  queryHybridTexture,
  queryTextureDiscuss,
  queryTitleTemplates
} from "./artDatabase";

// Maintain backward compatibility with the rest of the application
export const INGREDIENT_ARTISTIC_MAP: { [key: string]: string[] } = INGREDIENT_ART_VOCAB_TABLE.reduce(
  (acc, row) => {
    acc[row.key] = row.synonyms;
    return acc;
  },
  {} as { [key: string]: string[] }
);

/**
 * Translate normal food ingredients into highly sophisticated, ultra-hilarious art components
 * powered by the tabular art database vocabulary.
 */
export function translateIngredientsToArtWords(allIngredients: string[]): string[] {
  const resultList: string[] = [];
  const uniqueNormalized = Array.from(new Set(
    allIngredients
      .map(i => i.trim())
      .filter(i => i && i.length > 0)
  ));

  if (uniqueNormalized.length === 0) {
    return ["纯净代谢虚空物"];
  }

  uniqueNormalized.forEach(food => {
    const synonyms = queryIngredientSynonyms(food);
    if (synonyms && synonyms.length > 0) {
      const word = synonyms[Math.floor(Math.random() * synonyms.length)];
      resultList.push(word);
    } else {
      if (food.length <= 4) {
        resultList.push(`生鲜级大分子[${food}]高聚物`);
      } else {
        resultList.push(`[${food}]复风味有机质`);
      }
    }
  });

  return resultList.slice(0, 8); // Max 8 unique ingredients representation
}

/**
 * Complete offline programmatic art generator with incredible depth.
 * Dynamically queries rows from tabular structures for thematic configuration, hybrid textures, 
 * titles, discussions, and essays.
 */
export function generateMasterpieceArtProgrammatically(
  meals: { breakfast: string; lunch: string; dinner: string },
  holdingDays: number,
  heldMealsHistory: any[] = [],
  artistName: string = "momo"
) {
  // 1. Calculate Season and Hour of Day
  const now = new Date();
  const month = now.getMonth(); // 0 is January, 11 is December
  const hour = now.getHours();

  let season: "spring" | "summer" | "autumn" | "winter" = "spring";
  if (month >= 2 && month <= 4) {
    season = "spring";
  } else if (month >= 5 && month <= 7) {
    season = "summer";
  } else if (month >= 8 && month <= 10) {
    season = "autumn";
  } else {
    season = "winter";
  }

  let timeOfDay: "morning" | "afternoon" | "night" = "afternoon";
  if (hour >= 6 && hour < 12) {
    timeOfDay = "morning";
  } else if (hour >= 12 && hour < 18) {
    timeOfDay = "afternoon";
  } else {
    timeOfDay = "night";
  }

  const seasonNames = { spring: "新春盎然", summer: "盛夏炽烈", autumn: "金秋静美", winter: "凛冬傲雪" };
  const timeNames = { morning: "晨光熹微", afternoon: "烈照晴午", night: "星夜深邃" };

  // 2. Query Seasonal + Time-of-Day Hybrid Texture from tables
  const hybridRow = queryHybridTexture(season, timeOfDay);
  const currentHybridDescription = hybridRow
    ? `${hybridRow.displayName}质感。${hybridRow.description}`
    : "【时令流体】质感";

  // 3. Process Ingredients
  const allHistoryMeals = Array.isArray(heldMealsHistory) ? heldMealsHistory : [];
  const allMealsCombined = [...allHistoryMeals, meals];

  const allIngredients: string[] = [];
  allMealsCombined.forEach(m => {
    if (m) {
      if (m.breakfast) allIngredients.push(m.breakfast);
      if (m.lunch) allIngredients.push(m.lunch);
      if (m.dinner) allIngredients.push(m.dinner);
    }
  });

  const foodsJoined = allIngredients.join("、") || "空气";
  const textLower = foodsJoined.toLowerCase();

  const primaryBreakfast = meals.breakfast || "空气";
  const primaryLunch = meals.lunch || "空气";
  const primaryDinner = meals.dinner || "空气";
  const randomIng = allIngredients[Math.floor(Math.random() * allIngredients.length)] || "空气";

  const ingredientsAnalyzed = translateIngredientsToArtWords(allIngredients);
  const primaryArtisticIng = ingredientsAnalyzed[0] || "代谢虚空物";

  // 4. Default visual parameters
  let color = "#8B5A2B"; // default warm brown
  let accent = "#5C3818";
  let texture = "smooth";
  let shape = "standard_swirl";
  let rarity: "N" | "R" | "SR" | "UR" = "N";
  let themeName = "classic_clay";
  let hasFoodTheme = false;

  // 5. Query theme config from DIET_THEMES_TABLE
  const themeRow = queryThemeConfig(textLower);
  if (themeRow) {
    color = themeRow.colorHex;
    accent = themeRow.accentColorHex;
    texture = themeRow.textureType;
    shape = themeRow.shapeType;
    rarity = themeRow.rarity;
    themeName = themeRow.themeName;
    hasFoodTheme = true;
  }

  // 6. Multi-day retention/pressure adjustments
  if (hasFoodTheme) {
    if (holdingDays >= 5) {
      rarity = "UR";
    } else if (holdingDays >= 2) {
      rarity = "SR";
    }
  } else {
    // Weathering/Geological themes as holdingDays fallback rules
    if (holdingDays >= 7) {
      color = "#D4AF37"; // beautiful shiny gold
      accent = "#5B3A29";
      texture = "gilded_relic";
      shape = "royal_crown";
      rarity = "UR";
      themeName = "gilded_antique";
    } else if (holdingDays >= 5) {
      color = "#8C6E40"; // bronze gold
      accent = "#3A4F41"; // jade green patina accent
      texture = "ancient_bronze";
      shape = "double_helix";
      rarity = "UR";
      themeName = "ancient_bronze";
    } else if (holdingDays >= 4) {
      color = "#7F8C7D"; // granite green gray
      accent = "#446A37"; // moss green
      texture = "relic_moss_stone";
      shape = "massive_mountain";
      rarity = "SR";
      themeName = "relic_moss";
    } else if (holdingDays >= 2) {
      color = "#9A8C81"; // prehistoric chalky gray-brown
      accent = "#544C45";
      texture = "petrified_fossil";
      shape = "massive_mountain";
      rarity = "SR";
      themeName = "petrified_fossil";
    } else {
      // Basic fallback variations
      const mathSeed = (allIngredients.length + holdingDays) % 3;
      if (mathSeed === 0) {
        color = "#6E473B"; // rich clay reddish brown
        accent = "#C18C5D";
        texture = "grainy";
        shape = "standard_swirl";
      } else if (mathSeed === 1) {
        color = "#4E3629"; // raw timber brown
        accent = "#D97706";
        texture = "steaming";
        shape = "massive_mountain";
      } else {
        color = "#5C3813"; // liquid caramel dark
        accent = "#FBBF24";
        texture = "smooth";
        shape = "fluid_drip";
      }
    }
  }

  // 7. Dynamic Title selection from pool
  const titleTemplates = queryTitleTemplates(themeName);
  const titlePool = (titleTemplates && titleTemplates.length > 0)
    ? titleTemplates.map(tpl => tpl
        .replace(/{holdingDays}/g, String(holdingDays))
        .replace(/{randomIng}/g, randomIng)
        .replace(/{primaryBreakfast}/g, primaryBreakfast)
        .replace(/{primaryLunch}/g, primaryLunch)
        .replace(/{primaryDinner}/g, primaryDinner)
        .replace(/{primaryArtisticIng}/g, primaryArtisticIng)
      )
    : [
        `《重塑的“${randomIng}”：时间维度的沉积与定格》`,
        `《关于饥饿与高分子“${primaryBreakfast}”的宏大代谢叙事》`,
        `《“${primaryLunch}”之后：大肠力学对生理黏膜与消化机能的流体力学回答》`,
        `《无机物质与有机代谢在宿主肠道积压下的史诗级物理和解——致敬“${randomIng}”》`
      ];

  const title = titlePool[Math.floor(Math.random() * titlePool.length)];

  // 8. Ingestion Timeline narrative
  let ingestionTimelineDescription = "";
  if (allHistoryMeals.length > 0) {
    const historicalSummaries = allHistoryMeals.map((h, i) => {
      const bText = h.breakfast ? `早摄[${h.breakfast}]` : "空腹";
      const lText = h.lunch ? `午摄[${h.lunch}]` : "空腹";
      const dText = h.dinner ? `晚摄[${h.dinner}]` : "空腹";
      return `第${i + 1}天由于长期憋附，在底部叠成了以${bText}、${lText}、${dText}为基础的历史性【古老发酵底盘】`;
    });
    ingestionTimelineDescription = `。在结构细节上，该作包含极其清晰的“时空演化断层”。最底部的古老沉淀层可追溯到${historicalSummaries.slice(0, 3).join("，")}，由于长达数日的时间堆叠，这些先驱媒介早已碳化分解，形成了如史前灰岩一般的扎实基座；`;
  } else if (holdingDays > 0) {
    ingestionTimelineDescription = `。鉴于宿主将“${primaryBreakfast}”等物料在结肠腔室中紧密蓄积憋拉了长达 ${holdingDays} 天，整件作品的底层物料表现出了高密度的脱水皱褶，暗示了长达数日的发酵与重力压缩，将快餐转化为带有大理石质感的“地层标本”；`;
  } else {
    ingestionTimelineDescription = `。作为一次快速释放的即兴“速度艺术”，从“${primaryBreakfast}”的摄入到最终在大肠终点的瞬时凝固几乎一气呵成。其表面闪烁着因极速行进所拉伸而出的纤细流须线，完全不受多日陈化发酵的沉闷拘束，轻盈而充满本能张力；`;
  }

  // 9. Texture discussion template substitution
  const SHAPE_CHINESE_MAP: { [key: string]: string } = {
    standard_swirl: "“经典罗马螺旋塔”",
    massive_mountain: "“沉穆群峦大山”",
    fluid_drip: "“地心重力流滴”",
    double_helix: "“生命密码双螺旋”",
    eiffel_tower: "“巴黎埃菲尔铁塔”",
    royal_crown: "“路易十四皇家皇冠”",
    ring_doughnut: "“拓扑多孔圆环”",
    alien_ufo: "“深空未知飞碟”",
    lucky_cat_tail: "“昭和招财猫卷尾”",
    spherical_boba: "“梦幻多碳珍珠波霸”",
    space_station: "“赛博中继太空站”",
    abstract_cube: "“新先锋抽象魔方”",
    sharp_obelisk: "“古巴比伦锐利方尖碑”",
    cute_octopus: "“深海巨兽八爪章鱼”",
    rose_bud: "“清晨初绽玫瑰花蕾”",
    twisted_pretzel: "“德式扭结普雷特 pretzels”",
    golden_pyramid: "“胡夫帝王金字塔”",
    lucky_bag: "“纳祥纳福吉兆福袋”",
    curvy_chili: "“热辣风情弯辣椒”",
    gear_wheel: "“工业重工机械齿轮”",
    spiral_stair: "“巴洛克旋转阶梯”",
    cactus_pillar: "“荒漠傲慢绿仙人掌柱”",
    leaning_tower: "“比萨梦幻斜塔”",
    chess_knight: "“骑士精神西洋棋马”",
    ancient_totem: "“美索不达米亚古老图腾”",
    gourmet_croissant: "“香榭丽舍起司金可颂”",
    pagoda_spire: "“东方清雅琉璃佛塔”",
    infinity_loop: "“宇宙奇点莫比乌斯无限环”",
    thor_hammer: "“瓦坎达重质雷神之锤”",
    origami_crane: "“纯真飞鸟手工纸鹤”",
    volcanic_caldera: "“极温休眠火山破火山口”",
    cathedral_dome: "“文艺复兴圣保罗大穹顶”",
    fortune_cookie: "“好运吉兆幸运饼干”"
  };

  const rawDiscussTpl = queryTextureDiscuss(texture);
  const shapeNameCh = SHAPE_CHINESE_MAP[shape] || "“经典罗马螺旋塔”";
  let currentTextureDiscuss = `表体材料由极其特殊的【${primaryArtisticIng}】组成，带有斑驳繁复的肌理断层，极其忠实地还原了生物体内物料消化沉淀的基本热物理演变`;
  
  if (rawDiscussTpl) {
    currentTextureDiscuss = rawDiscussTpl
      .replace(/{primaryArtisticIng}/g, primaryArtisticIng)
      .replace(/{shapeName}/g, shapeNameCh)
      .replace(/{holdingDays}/g, String(holdingDays));
  }

  const seasonCommentary = `。值得赞叹的是，作品诞生于年岁流转中的` + seasonNames[season] + `之季，且恰值` + timeNames[timeOfDay] + `，天然吸纳了时序的气候环境。在核心材质之外，该作不可思议地糅合了一层精妙绝伦的` + currentHybridDescription;

  // 10. Generate Curatorial Essay array formatted by query rows
  const shapeChinese = SHAPE_CHINESE_MAP[shape] || "“经典罗马螺旋塔”";
  const seasonChinese = seasonNames[season] || "";
  const timeChinese = timeNames[timeOfDay] || "";

  const templates = CURATOR_ESSAY_TABLE.map(row => {
    return row.template
      .replace(/{artistName}/g, artistName)
      .replace(/{shapeChinese}/g, shapeChinese)
      .replace(/{primaryBreakfast}/g, primaryBreakfast)
      .replace(/{primaryLunch}/g, primaryLunch)
      .replace(/{primaryDinner}/g, primaryDinner)
      .replace(/{primaryArtisticIng}/g, primaryArtisticIng)
      .replace(/{ingestionTimelineDescription}/g, ingestionTimelineDescription)
      .replace(/{currentTextureDiscuss}/g, currentTextureDiscuss)
      .replace(/{seasonChinese}/g, seasonChinese)
      .replace(/{timeChinese}/g, timeChinese)
      .replace(/{currentHybridDescription}/g, currentHybridDescription)
      .replace(/{seasonKey}/g, season)
      .replace(/{timeKey}/g, timeOfDay)
      .replace(/{holdingDays}/g, String(holdingDays));
  });

  // Deterministically select the template based on title + shape + texture hash, so the same item keeps its coherent report
  let hashVal = 0;
  const hashKey = title + shape + texture + artistName;
  for (let idx = 0; idx < hashKey.length; idx++) {
    hashVal = hashKey.charCodeAt(idx) + ((hashVal << 5) - hashVal);
  }
  const chosenIndex = Math.abs(hashVal) % templates.length;
  const curatorCommentCore = templates[chosenIndex];

  return {
    title,
    colorHex: color,
    accentColorHex: accent,
    textureType: texture,
    shapeType: shape,
    ingredientsAnalyzed,
    curatorComment: curatorCommentCore + ` ——主厨艺术家：${artistName || "momo"}` + seasonCommentary,
    season,
    timeOfDay,
    rarity
  };
}
