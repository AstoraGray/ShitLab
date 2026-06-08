export interface GMbtiProfile {
  key: string; // e.g. "RMSD"
  title: string; // e.g. "【黑曜石熔岩铁骑】"
  englishTitle: string; // e.g. "Obsidian Lava Cavalry"
  description: string;
  bestMatchKey: string;
  bestMatchTitle: string;
  dangerMatchKey: string;
  dangerMatchTitle: string;
  radarScores: {
    frequency: number; // 0 is Release/High Freq, 100 is Hold/Extreme Accumulation
    materials: number; // 0 for Veggie, 100 for Meat
    taste: number;      // 0 for Light, 100 for Spicy
    consistency: number; // 0 for Fluid, 100 for Solid
  };
}

export const G_MBTI_DICT: Record<string, GMbtiProfile> = {
  RMSD: {
    key: "RMSD",
    title: "【卢浮黑曜铁骑】",
    englishTitle: "L'Ordre Noir d'Obsidienne (Obsidian Lava Cavalry)",
    description: "于胃肠高热负重熔炉中锤炼而出的重构沉积。高卡荤脂与暴烈红椒在密集周期中激荡，造就了其雷厉风行、不拖泥带水的巍峨之姿。这是能量丰盈、雷霆万钧的生机代名词，折射出不可估量的雄奇代谢速率与无拘的大无畏自由浪漫。",
    bestMatchKey: "RVLF",
    bestMatchTitle: "【清晨草本丝绸】",
    dangerMatchKey: "HMSF",
    dangerMatchTitle: "【末日硫磺沼泽】",
    radarScores: { frequency: 15, materials: 85, taste: 90, consistency: 80 }
  },
  RMSF: {
    key: "RMSF",
    title: "【蓬皮杜前卫泥流】",
    englishTitle: "Le Flux de Lave Supercritique (Supercritical Lava Mudflow)",
    description: "挣脱一切无谓的憋附压抑，将高能肉脂与烈焰红油化作澎湃不居的生命力宣泄。此物纯然不羁、顺流倾泻，带有达达主义打破秩序的叛逆诗意。它在古典底色上挥洒野性，是极致畅快、生命蓬勃的最生动演绎。",
    bestMatchKey: "HVLD",
    bestMatchTitle: "【极地千褶寒玉】",
    dangerMatchKey: "HVSF",
    dangerMatchTitle: "【美第奇沼泽巫药】",
    radarScores: { frequency: 20, materials: 90, taste: 85, consistency: 25 }
  },
  RMLD: {
    key: "RMLD",
    title: "【凡尔赛钢骨巨物】",
    englishTitle: "Le Monument de Béton Gothique (Steel Concrete Monument)",
    description: "每一颗结晶都是重工业古典主义力学构造。在日出般的精准律动下，高能荤食提振坚实体格，不带任何辣意燥热的冷峻形态展示出极致的秩序感，如同耸立于广袤大地的哥特式方尖巨构，无言却具有永久的结构性震撼。",
    bestMatchKey: "HVLF",
    bestMatchTitle: "【幽避翡翠泉眼】",
    dangerMatchKey: "RVSF",
    dangerMatchTitle: "【波希米亚芥末喷泉】",
    radarScores: { frequency: 10, materials: 80, taste: 15, consistency: 95 }
  },
  RMLF: {
    key: "RMLF",
    title: "【皇家流化反应釜】",
    englishTitle: "Le Réacteur Rhéologique Royal (High-Calorie Rheological Reactor)",
    description: "不动声色的凡尔赛宫廷御用佳作。排空极为温润有序，丝滑高粘的营养脂体如微风拂过凡间。不留丝毫异味喧嚣，处世内敛却怀揣无限深厚的底层体能储存，好似一座在静音模式下优雅驱动的生物质能造币机。",
    bestMatchKey: "HVSD",
    bestMatchTitle: "【法老草本琥珀】",
    dangerMatchKey: "HMSD",
    dangerMatchTitle: "【熔岩黑曜君王】",
    radarScores: { frequency: 18, materials: 75, taste: 20, consistency: 15 }
  },
  RVSD: {
    key: "RVSD",
    title: "【阿玛菲红油仙人掌】",
    englishTitle: "Le Cactus Déshydraté Doré (Chili Dehydrated Cactus)",
    description: "令人迷醉的极度矛盾。一方面吸取健康本草膳食的草木之灵，一方面沐浴在香辛炽烈的余火中。两种极端在大肠中奇迹握手，纤维的多孔拉力在高能热流下收紧，雕琢成犹如在阳光下熠熠生辉的沙漠干燥神像。",
    bestMatchKey: "HMLF",
    bestMatchTitle: "【深海原油沉淀】",
    dangerMatchKey: "RVLF",
    dangerMatchTitle: "【清晨草本丝绸】",
    radarScores: { frequency: 15, materials: 20, taste: 85, consistency: 85 }
  },
  RVSF: {
    key: "RVSF",
    title: "【波希米亚芥末喷泉】",
    englishTitle: "Le Geyser de Wasabi Sauvage (Green Wasabi Geothermal Geyser)",
    description: "清爽草本与极度刺激的佐料在清亮拂晓瞬间迸射，化为震撼山谷的地热泉涌。那微酸而冲鼻的傲然姿态，带着惊心动魄的快意，昭示着一具全然自适应、永不妥协于平庸尘世的年轻炽热肌体。",
    bestMatchKey: "HMLD",
    bestMatchTitle: "【维京幽铁重锚】",
    dangerMatchKey: "RMSD",
    dangerMatchTitle: "【卢浮黑曜铁骑】",
    radarScores: { frequency: 25, materials: 15, taste: 80, consistency: 10 }
  },
  RVLD: {
    key: "RVLD",
    title: "【皇家翡翠方尖碑】",
    englishTitle: "L'Obélisque d'Émeraude Sacré (Sacred Chlorophyll Obelisk)",
    description: "极富神圣隐修气质的素食教皇。极致高浓度大自然造物，在摆脱凡俗辣欲枷锁的平和调和中，每日优雅规律地熔铸出无瑕绿野翠尊。其自律姿态堪称艺术圣地里的至尊方尖碑，令人静心叹服。",
    bestMatchKey: "HMSF",
    bestMatchTitle: "【末日硫磺沼泽】",
    dangerMatchKey: "RMSF",
    dangerMatchTitle: "【蓬皮杜前卫泥流】",
    radarScores: { frequency: 12, materials: 10, taste: 12, consistency: 90 }
  },
  RVLF: {
    key: "RVLF",
    title: "【清晨草本丝绸】",
    englishTitle: "La Soie Verte de Rosée (Morning Dew Green Silk)",
    description: "纯生态与轻盈自如的生命交响。其流淌不带任何粘滞压力，如同一袭细腻绿意绸缎在清晨冷香中滑过幽径。你顺应自然的律动，肠胃澄澈空灵，处处是大地的轻柔抚意与优雅告白。",
    bestMatchKey: "RMSD",
    bestMatchTitle: "【卢浮黑曜铁骑】",
    dangerMatchKey: "RVSD",
    dangerMatchTitle: "【阿玛菲红油仙人掌】",
    radarScores: { frequency: 8, materials: 12, taste: 15, consistency: 12 }
  },
  HMSD: {
    key: "HMSD",
    title: "【熔岩黑曜君王】",
    englishTitle: "La Couronne Impériale d'Obsidienne (Obsidian Lava Emperor)",
    description: "数日高压与极高憋附是在深层蓄谋一尊理化维度的星际奇点。最终大卡高油脂肉食在火山岩浆般的体温下发生壮观质变，淬炼结晶出一顶极高力学密度、黑光凌冽的皇者玄冠。威严霸道，冠绝卢浮！",
    bestMatchKey: "RVLF",
    bestMatchTitle: "【清晨草本丝绸】",
    dangerMatchKey: "RMSF",
    dangerMatchTitle: "【蓬皮杜前卫泥流】",
    radarScores: { frequency: 85, materials: 80, taste: 92, consistency: 88 }
  },
  HMSF: {
    key: "HMSF",
    title: "【末日硫磺沼泽】",
    englishTitle: "Le Marais de Soufre Nucléaire (Critical Nuclear Waste Swamp)",
    description: "长久压抑的时光并未抹消高卡红油荤食底色的汹涌，反而在密闭深蓄中发酵出了惊天动地的解脱洪流。酸香侵蚀与微压澎湃，释放而出如神话中灭世潮汐奔流过境，生化美学张力直接拉满！",
    bestMatchKey: "RVLD",
    bestMatchTitle: "【皇家翡翠方尖碑】",
    dangerMatchKey: "RMSD",
    dangerMatchTitle: "【卢浮黑曜铁骑】",
    radarScores: { frequency: 80, materials: 85, taste: 88, consistency: 20 }
  },
  HMLD: {
    key: "HMLD",
    title: "【维京幽铁重锚】",
    englishTitle: "L'Ancre Royale du Précambrien (Deep-Sunk Ancient Iron Anchor)",
    description: "隐忍而宏大。多日高负荷、重质感、无火气的素朴囤积，在千百次深大肠蠕动高压挤压、滤尽所有水分后，淬锻出犹如古沉船遗址下打捞出的暗铁重锚。每一克干折密度都刻写着忍耐的伟力。",
    bestMatchKey: "RVSF",
    bestMatchTitle: "【波希米亚芥末喷泉】",
    dangerMatchKey: "RMSF",
    dangerMatchTitle: "【蓬皮杜前卫泥流】",
    radarScores: { frequency: 90, materials: 78, taste: 15, consistency: 92 }
  },
  HMLF: {
    key: "HMLF",
    title: "【深海原油沉淀】",
    englishTitle: "Le Brut Abyssal Visqueux (Abyssal Crude Oil Viscous Kettle)",
    description: "在漫漫清淡与无声寂静中，将多日累积的蛋白质精华凝聚。流动之时犹如沉睡在万米大洋底部的重原油，缓缓注视着虚空，透露出无可言喻的尊贵质感与在岁月磨砺下方能凝铸的粘稠叹息。",
    bestMatchKey: "RVSD",
    bestMatchTitle: "【阿玛菲红油仙人掌】",
    dangerMatchKey: "RVLD",
    dangerMatchTitle: "【皇家翡翠方尖碑】",
    radarScores: { frequency: 85, materials: 75, taste: 18, consistency: 25 }
  },
  HVSD: {
    key: "HVSD",
    title: "【法老草本琥珀】",
    englishTitle: "L'Ambre Végétal du Pharaon (Purgatory Vegetarian Amber)",
    description: "行者般的苦修勋章。在体内高能辛香余烬与脱水纤维交融中缓慢结石，最终将植物纤维木质素高度浓缩，化作一尊坚硬粗粝的琥珀。这是一尊隔绝尘世欲望的艺术标本，折射出璀璨的金黄神性。",
    bestMatchKey: "RMLF",
    bestMatchTitle: "【皇家流化反应釜】",
    dangerMatchKey: "HVLF",
    dangerMatchTitle: "【幽避翡翠泉眼】",
    radarScores: { frequency: 78, materials: 15, taste: 82, consistency: 80 }
  },
  HVSF: {
    key: "HVSF",
    title: "【美第奇沼泽巫药】",
    englishTitle: "La Source de Soufre des Médicis (Forest Swamp Viscous Sulfur Source)",
    description: "草本膳食纤维配合狂野辛辣在持久蓄积中相依相伴，经深度微生态发酵，孕育出带有微度汽泡、张力澎湃的大森泥涌。浓烈馥郁的异域辛香如神话女巫的香薰鼎罐，令人驻足合掌、崇高敬畏。",
    bestMatchKey: "RMLD",
    bestMatchTitle: "【凡尔赛钢骨巨物】",
    dangerMatchKey: "HMLD",
    dangerMatchTitle: "【维京幽铁重锚】",
    radarScores: { frequency: 82, materials: 22, taste: 85, consistency: 18 }
  },
  HVLD: {
    key: "HVLD",
    title: "【极地千褶寒玉】",
    englishTitle: "Le Jade Glacial du Groenland (Glacial Cold Jade Sarcophagus)",
    description: "冰封雪山。绝不染尘俗高卡燥物，亦无辣欲之焦，在冷冽长天中安享冥想。经大肠极深折叠、剥除最后一缕湿重，现出如玉屑白雪般空明无暇的冰晶古玉，透露出不食烟火 of 庄严圣洁。",
    bestMatchKey: "RMSF",
    bestMatchTitle: "【蓬皮杜前卫泥流】",
    dangerMatchKey: "HVSF",
    dangerMatchTitle: "【美第奇沼泽巫药】",
    radarScores: { frequency: 95, materials: 12, taste: 10, consistency: 95 }
  },
  HVLF: {
    key: "HVLF",
    title: "【幽避翡翠泉眼】",
    englishTitle: "La Source de Mousse des Chartreux (Moss Rainforest Cold Spring Eye)",
    description: "极致优雅的避世隐逸。高浓度草木素食精华漫流天际，经漫长休眠酝酿成温吞含蓄、通透莹润的翡翠泉流。于万籁俱寂中如甘露解脱，不留任何俗念余音，唯有寂寥而高雅的超然物外。",
    bestMatchKey: "RMLD",
    bestMatchTitle: "【凡尔赛钢骨巨物】",
    dangerMatchKey: "RVSD",
    dangerMatchTitle: "【阿玛菲红油仙人掌】",
    radarScores: { frequency: 80, materials: 15, taste: 15, consistency: 15 }
  }
};

/**
 * Parses user exhibits to derive dimensions score and returns primary G-MBTI profiles
 */
export function calculateMbtiScores(exhibits: any[]) {
  if (!exhibits || exhibits.length === 0) {
    // Default median scores for unseeded empty states
    return {
      scores: { frequency: 50, materials: 50, taste: 50, consistency: 50 },
      key: "RVLD", // Default balanced type
      source: "preset"
    };
  }

  let totalHoldingDays = 0;
  let meatScoreCount = 0;
  let veggieScoreCount = 0;
  let spicyScoreCount = 0;
  let lightScoreCount = 0;
  let solidCount = 0;
  let fluidCount = 0;

  const meatKeywords = ["肉", "牛", "猪", " chicken", "鸡", "羊", "鱼", "排", "辣", "海鲜", "汉堡", "烧烤", "炸", "火锅", "蛋", "奶", "芝士", "奶酪", "烤肉", "肥肠", "烤全羊", "肥牛"];
  const veggieKeywords = ["菜", "笋", "芹", "菇", "菌", "绿", "草", "薯", "豆", "瓜", "叶", "米", "麦", "水果", "苹果", "香蕉", "茶", "燕麦", "西兰花", "沙拉", "青菜", "番茄", "玉米"];
  const spicyKeywords = ["辣", "尖椒", "红油", "剁椒", "麻辣", "川", "湘", "香辣", "咖喱", "火锅", "胡椒", "泡椒", "辣条", "辣椒", "螺蛳粉", "毛血旺", "水煮鱼"];
  const lightKeywords = ["清汤", "白粥", "沙拉", "椰子", "白菜", "清蒸", "水煮", "豆腐", "素", "茶", "奶", "温和", "银耳", "蒸", "煮", "炖", "小米粥"];

  const solidShapes = [
    "standard_swirl", "massive_mountain", "royal_crown", "abstract_cube", 
    "sharp_obelisk", "golden_pyramid", "leaning_tower", "chess_knight", 
    "ancient_totem", "pagoda_spire", "origami_crane", "cathedral_dome"
  ];

  exhibits.forEach((ex) => {
    // 1. Frequency (Holding Days)
    totalHoldingDays += (ex.holdingDays || 0);

    // 2. Material (Meals checklist analysis)
    const bStr = (ex.meals?.breakfast || "").toLowerCase();
    const lStr = (ex.meals?.lunch || "").toLowerCase();
    const dStr = (ex.meals?.dinner || "").toLowerCase();
    const combinedMeals = `${bStr} ${lStr} ${dStr}`;

    let mCount = 0;
    let vCount = 0;
    meatKeywords.forEach(k => { if (combinedMeals.includes(k)) mCount++; });
    veggieKeywords.forEach(k => { if (combinedMeals.includes(k)) vCount++; });

    if (mCount > vCount) meatScoreCount++;
    else if (vCount > mCount) veggieScoreCount++;
    else {
      // Default fallback
      meatScoreCount += 0.5;
      veggieScoreCount += 0.5;
    }

    // 3. Taste (Spice index)
    let sCount = 0;
    let ltCount = 0;
    spicyKeywords.forEach(k => { if (combinedMeals.includes(k)) sCount++; });
    lightKeywords.forEach(k => { if (combinedMeals.includes(k)) ltCount++; });

    if (sCount > ltCount) spicyScoreCount++;
    else if (ltCount > sCount) lightScoreCount++;
    else {
      spicyScoreCount += 0.5;
      lightScoreCount += 0.5;
    }

    // 4. Shape consistency
    if (solidShapes.includes(ex.shapeType)) {
      solidCount++;
    } else {
      fluidCount++;
    }
  });

  const avgHoldingDays = totalHoldingDays / exhibits.length;
  // Hold percentage: 0 days -> 10%, 10 days -> 95%
  const frequencyPercent = Math.min(95, Math.max(5, Math.round(((avgHoldingDays) / 5) * 50 + 20)));

  const totalMV = meatScoreCount + veggieScoreCount;
  const materialsPercent = totalMV > 0 ? Math.round((meatScoreCount / totalMV) * 100) : 50;

  const totalTL = spicyScoreCount + lightScoreCount;
  const tastePercent = totalTL > 0 ? Math.round((spicyScoreCount / totalTL) * 100) : 50;

  const totalSF = solidCount + fluidCount;
  const consistencyPercent = totalSF > 0 ? Math.round((solidCount / totalSF) * 100) : 50;

  // Derive final key
  const fLetter = frequencyPercent >= 50 ? "H" : "R";
  const mLetter = materialsPercent >= 50 ? "M" : "V";
  const tLetter = tastePercent >= 50 ? "S" : "L";
  const cLetter = consistencyPercent >= 50 ? "D" : "F";

  const key = `${fLetter}${mLetter}${tLetter}${cLetter}`;

  return {
    scores: {
      frequency: frequencyPercent,
      materials: materialsPercent,
      taste: tastePercent,
      consistency: consistencyPercent
    },
    key,
    source: "gallery"
  };
}
