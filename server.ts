import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily to avoid crashing if API_KEY is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Fallback logic for local mock generation when API key is not present or calls fail
function generateLocalMockArt(
  meals: { breakfast: string; lunch: string; dinner: string }, 
  holdingDays: number,
  heldMealsHistory: any[] = []
) {
  const allHistoryMeals = Array.isArray(heldMealsHistory) ? heldMealsHistory : [];
  const allMealsCombined = [...allHistoryMeals, meals];
  const allIngredients: string[] = [];
  allMealsCombined.forEach(m => {
    if (m && m.breakfast) allIngredients.push(m.breakfast);
    if (m && m.lunch) allIngredients.push(m.lunch);
    if (m && m.dinner) allIngredients.push(m.dinner);
  });
  
  const foods = allIngredients.slice(0, 8).join("、") || "空气";
  
  // Decide colors based on food keyword mapping
  let color = "#8B5A2B"; // default warm brown
  let accent = "#5C3818";
  let texture = "smooth";
  let shape = "standard_swirl";
  let rarity: "N" | "R" | "SR" | "UR" = "N";
  
  const textLower = foods.toLowerCase();

  // Keyword-rich creative mapping to new shapes and textures
  if (holdingDays >= 7) {
    color = "#A88734"; // aged bronze / gilded gold
    accent = "#5B3A29";
    texture = "gilded_relic";
    shape = "royal_crown";
    rarity = "UR";
  } else if (holdingDays >= 5) {
    color = "#8C6E40"; // deep oxidized copper bronze
    accent = "#4A5D4E";
    texture = "ancient_bronze";
    shape = "double_helix";
    rarity = "UR";
  } else if (holdingDays >= 4) {
    color = "#7F8C7D"; // granite grey
    accent = "#446A37"; // forest moss
    texture = "relic_moss_stone";
    shape = "massive_mountain";
    rarity = "SR";
  } else if (holdingDays >= 2) {
    color = "#9A8C81"; // prehistoric stone
    accent = "#544C45";
    texture = "petrified_fossil";
    shape = "massive_mountain";
    rarity = "SR";
  } else if (textLower.includes("火锅") || textLower.includes("辣") || textLower.includes("川菜") || textLower.includes("湘菜")) {
    color = "#E63946"; // boiling lava orange-red
    accent = "#FFD166";
    texture = "volcanic_lava";
    shape = "fluid_drip";
    rarity = "R";
  } else if (textLower.includes("螺蛳粉") || textLower.includes("臭豆腐") || textLower.includes("香菜") || textLower.includes("韭菜")) {
    color = "#4D7C0F"; // toxic acid green
    accent = "#84CC16";
    texture = "toxic_slime";
    shape = "fluid_drip";
    rarity = "R";
  } else if (textLower.includes("巴黎") || textLower.includes("法式") || textLower.includes("面包") || textLower.includes("西餐")) {
    color = "#F59E0B"; // golden pastry orange
    accent = "#D97706";
    texture = "smooth";
    shape = "eiffel_tower";
    rarity = "R";
  } else if (textLower.includes("猫") || textLower.includes("日式") || textLower.includes("寿司") || textLower.includes("日料")) {
    color = "#EEF2F6"; // pure porcelain white stripe
    accent = "#F43F5E"; // pink-red stripes
    texture = "smooth";
    shape = "lucky_cat_tail";
    rarity = "R";
  } else if (textLower.includes("甜甜圈") || textLower.includes("圈") || textLower.includes("贝果") || textLower.includes("糖")) {
    color = "#EC4899"; // glaze pink
    accent = "#10B981";
    texture = "glittery";
    shape = "ring_doughnut";
    rarity = "R";
  } else if (textLower.includes("外星") || textLower.includes("神秘") || textLower.includes("飞碟") || textLower.includes("太")) {
    color = "#6366F1"; // cosmic purple
    accent = "#A855F7";
    texture = "crystalline";
    shape = "alien_ufo";
    rarity = "SR";
  } else if (textLower.includes("蔬菜") || textLower.includes("草") || textLower.includes("沙拉") || textLower.includes("绿")) {
    color = "#556B2F"; // olive green
    accent = "#8FBC8F";
    texture = "grainy";
    shape = "standard_swirl";
    rarity = "R";
  } else if (textLower.includes("冰") || textLower.includes("咖啡") || textLower.includes("奶茶") || textLower.includes("水")) {
    color = "#BC8F8F"; // chocolatey puddle
    accent = "#D2691E";
    texture = "steaming";
    shape = "fluid_drip";
    rarity = "R";
  } else {
    // Random fallback among our fantastic options so they always shine
    const randomTextures = [
      "smooth", "grainy", "steaming", "glittery", "crystalline", 
      "rainbow_metallic", "volcanic_lava", "cyber_grid", "toxic_slime",
      "ancient_bronze", "petrified_fossil", "gilded_relic", "relic_moss_stone"
    ];
    const randomShapes = ["standard_swirl", "massive_mountain", "fluid_drip", "double_helix", "eiffel_tower", "royal_crown", "ring_doughnut", "alien_ufo", "lucky_cat_tail"];
    
    texture = randomTextures[Math.floor(Math.random() * randomTextures.length)];
    shape = randomShapes[Math.floor(Math.random() * randomShapes.length)];
    
    if (texture === "rainbow_metallic" || texture === "cyber_grid" || texture === "volcanic_lava") {
      rarity = "SR";
      color = texture === "cyber_grid" ? "#0A0D1A" : (texture === "volcanic_lava" ? "#E33D26" : "#A855F7");
      accent = texture === "cyber_grid" ? "#00FFFF" : (texture === "volcanic_lava" ? "#FFAB00" : "#FA8072");
    }
  }

  const titles = [
    `《重塑的${foods.slice(0, 4) || "虚无"}：时间维度的沉淀》`,
    `《关于${foods.slice(0, 3) || "饥饿"}与碳水化合物的宏大叙事》`,
    `《${foods.slice(0, 3) || "空虚"}之后：重力的艺术回答》`,
    `《宿命的${foods.slice(0, 4) || "流星"}：肠道的终极谱系占卜》`
  ];
  const title = titles[Math.floor(Math.random() * titles.length)];

  const comments = [
    `这是一场横跨时间周期的自我博弈。在这部多维堆叠的软雪糕雕像中，从底部的【古老发酵层】到顶部的【新鲜释出层】，${foods.slice(0, 15) || "虚无组分"}依次排布，控诉着时间的厚重。`,
    `该作品具有极其惊人的时间跨度与视觉张力！数日来蓄积憋附的媒介底盘（如早期的${allIngredients[0] || "空腹发酵"}）在下方形成扎实的质地积累，与释出当下的表层组分相得益彰，极具戏剧批判性。`,
    `在这件复合质感雕塑中，我们见证了多日堆积的发酵流体力学美学。那些较早摄入的材料由于受压沉淀，呈现出历史断层般的地质剖面，彰显出大肠生命意志的史诗级宿命感。`,
    `厚重的气势之下，其实是一份多重食材跨越时间的灵魂会师。长期积压所赋予的庞大发酵热能与气孔，让其表面闪烁着克制自省而又蓄力待发的高贵微光。`
  ];
  const curatorComment = comments[Math.floor(Math.random() * comments.length)] + ` (来自本地主厨策划案)`;

  const ingredientsAnalyzed = allIngredients.length > 0 ? allIngredients : ["饥饿/空气"];

  return {
    title,
    colorHex: color,
    accentColorHex: accent,
    textureType: texture,
    shapeType: shape,
    ingredientsAnalyzed,
    curatorComment,
    rarity
  };
}

// REST API for museum synthesis
app.post("/api/synthesize", async (req, res) => {
  try {
    const { meals, holdingDays, heldMealsHistory } = req.body;
    
    if (!meals) {
      return res.status(400).json({ error: "Missing meals input" });
    }

    const client = getGeminiClient();
    
    if (!client) {
      console.log("No Gemini API Key defined. Using delightful local art generator.");
      const fallback = generateLocalMockArt(meals, Number(holdingDays || 0), heldMealsHistory);
      return res.json(fallback);
    }

    const { breakfast, lunch, dinner } = meals;
    
    // Process chronological list of ingested meals
    const historyArray = Array.isArray(heldMealsHistory) ? heldMealsHistory : [];
    let ingestionTimelineText = "";
    if (historyArray.length > 0) {
      historyArray.forEach((hMeal, idx) => {
        const b = hMeal.breakfast || "(空腹)";
        const l = hMeal.lunch || "(空腹)";
        const d = hMeal.dinner || "(空腹)";
        ingestionTimelineText += `憋拉第 ${idx + 1} 天 (底部/古老层): 早膳: ${b} | 午膳: ${l} | 晚膳: ${d}\n`;
      });
    }
    ingestionTimelineText += `释出当日 (顶部/新鲜层): 早膳: ${breakfast || "(空腹)"} | 午膳: ${lunch || "(空腹)"} | 晚膳: ${dinner || "(空腹)"}`;

    const foodDescription = `
      Holding duration before releasing: ${holdingDays || 0} days
      Chronological Ingestion Timeline (from oldest to newest):
      ${ingestionTimelineText}
    `;

    const systemPrompt = `
      You are the Master sommelier-chef and elite Head Curator of the "Cyber Poop Museum" (赛博大屎馆).
      Your job is to transform a standard report of daily meal records and a "Holding Duration" (how many days the player held it in) into a majestic, highly pretentious modern art piece description of feces.
      
      You must respond in a strictly styled JSON format following the schema.
      Rules for generation:
      1. title: Choose a highly poetic, pseudo-philosophical, and preposterously dramatic Chinese art title (e.g. 《午夜的红油狂想曲》, 《虚无的重力方程式》, 《关于金针菇的微缩迷宫》). Keep it beautifully structured.
      2. colorHex: A highly polished modern art aesthetic hex code based on the ingredients (e.g., olive green for leafy veggies, deep spicy red/orange for hotpot, dark charcoal for squid ink, metallic shimmering gold #FFD700 for UR items, deep rich cacao for sweets, chocolate or normal). Choose aesthetic tones, never repulsive neon unless asked.
      3. accentColorHex: A matching accent highlighting texture, glitter, or flecks (e.g. golden sparkle, green leaf contrast, pepper flakes red).
      4. textureType: MUST be exactly one of: "smooth", "grainy", "steaming", "glittery", "metallic_gold", "crystalline", "rainbow_metallic", "volcanic_lava", "cyber_grid", "toxic_slime", "ancient_bronze", "petrified_fossil", "gilded_relic", "relic_moss_stone".
         - Use "rainbow_metallic" for colorful candy, bubble tea, sugary items or high luxury.
         - Use "volcanic_lava" for spicy foods (hotpot, chili, spicy skewers).
         - Use "cyber_grid" for energy drinks, instant noodles, space foods, electronic things, or coffee.
         - Use "toxic_slime" for pungent/stinky items (螺蛳粉, stinky tofu, durian, garlic).
         - Use "gilded_relic" if holdingDays >= 7 (representing an ancient gold-plated precious antique).
         - Use "ancient_bronze" if holdingDays is between 5 and 6 (representing oxidized patinated weathered bronze).
         - Use "relic_moss_stone" if holdingDays is 4 (representing stone overgrown with delicate green moss).
         - Use "petrified_fossil" if holdingDays is 2 or 3 (representing an ancient calcified sedimentary fossil).
      5. shapeType: MUST be exactly one of: "standard_swirl", "massive_mountain", "fluid_drip", "double_helix", "eiffel_tower", "royal_crown", "ring_doughnut", "alien_ufo", "lucky_cat_tail".
         - Use "eiffel_tower" when French dining, pastries, wine, or romantic food are eaten.
         - Use "royal_crown" when premium high-end luxury items (truffles, caviar, wagyu) are eaten.
         - Use "ring_doughnut" when sweet bakery, bagels, donuts, pizza, or cheese are eaten.
         - Use "alien_ufo" when weird ingredients, mystery combo meals, or highly artificial foods are reported.
         - Use "lucky_cat_tail" when Japanese ramen, sushi, raw fish, or cute foods are reported.
      6. rarity:
         - If holding_days >= 7: MUST be "UR" (legendary museum piece, gold/diamond theme).
         - If holding_days >= 3 and < 7: "SR" (epic, obsidian / crystal / cyber theme).
         - If user input triggers a special word (like "enoki mushroom", "squid ink", "wasabi", "chili", "coriander", "truffle"): "R" (avant-garde).
         - Otherwise: "N" (normal exhibition).
      7. ingredientsAnalyzed: Extract a combined list of major unique food ingredients found inside the ENTIRE chronological timeline (including both the older holding days and the releasing day) and style them as short artistic words.
      8. curatorComment: A hilarious, extremely pompous other-worldly modern art-critic review in Chinese (e.g. "创作者通过极具质感的生理反哺，含蓄且优雅地批判了快餐全球化之下的虚无宿命..."). Since the artist held the feces for multiple days, the review MUST explicitly analyze and discuss how the earlier meals ('古老发酵层' / first days) at the bottom layer transition, blend, or contrast with the releasing day's meals ('新鲜释出层' / top layer) at the apex. Discuss temporal evolution, chronological sedimentation, metabolic weight, and spatial gravity with grand post-consumerist eloquence.
    `;

    const result = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Perform the gourmet art synthesis on this ingestion ledger: ${foodDescription}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Highly pretentious Chinese conceptual art work title" },
            colorHex: { type: Type.STRING, description: "Aesthetic color hex code representing the body" },
            accentColorHex: { type: Type.STRING, description: "Accent highlight or sparkling speckles hex color code" },
            textureType: { 
              type: Type.STRING, 
              description: "Must be smooth, grainy, steaming, glittery, metallic_gold, crystalline, rainbow_metallic, volcanic_lava, cyber_grid, toxic_slime, ancient_bronze, petrified_fossil, gilded_relic, or relic_moss_stone" 
            },
            shapeType: { 
              type: Type.STRING, 
              description: "Must be standard_swirl, massive_mountain, fluid_drip, double_helix, eiffel_tower, royal_crown, ring_doughnut, alien_ufo, or lucky_cat_tail" 
            },
            ingredientsAnalyzed: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Extracted and stylized ingredients identified"
            },
            curatorComment: { 
              type: Type.STRING, 
              description: "A funny, extremely pretentious and theoretical art critique review in Chinese" 
            },
            rarity: { 
              type: Type.STRING, 
              description: "One of N, R, SR, UR based on instructions" 
            }
          },
          required: [
            "title", 
            "colorHex", 
            "accentColorHex", 
            "textureType", 
            "shapeType", 
            "ingredientsAnalyzed", 
            "curatorComment", 
            "rarity"
          ]
        }
      }
    });

    const responseText = result.text;
    if (!responseText) {
      throw new Error("No response text from Gemini API");
    }

    const payload = JSON.parse(responseText.trim());
    return res.json(payload);

  } catch (error: any) {
    console.error("Synthesize API Error:", error);
    // Graceful fallback on API issues
    const meals = req.body.meals || { breakfast: "冰美式", lunch: "烤冷面", dinner: "螺蛳粉" };
    const holdingDays = Number(req.body.holdingDays || 0);
    const heldMealsHistory = req.body.heldMealsHistory || [];
    const mock = generateLocalMockArt(meals, holdingDays, heldMealsHistory);
    return res.json(mock);
  }
});

// Setup Vite & Server routing
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
