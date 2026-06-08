/**
 * Cyber Museum of Fecal Modern Art - Structured Art Database Catalog
 * This module acts as the unified "tabular" database and configuration suite for synthesis.
 */

// 1. Synonym & Volatile Organic Compound Artistic Translation Table
export interface IngredientArtVocabRow {
  key: string;
  synonyms: string[];
}

export const INGREDIENT_ART_VOCAB_TABLE: IngredientArtVocabRow[] = [
  { key: "火锅", synonyms: ["高烈度沸腾红油", "高压浸渍辣椒素", "牛脂饱和重油组分", "四川盆地超临界重油混悬液", "川渝高密度川麻焦油"] },
  { key: "麻辣烫", synonyms: ["高烈度花椒挥发油", "浸渍高温红油重脂固形物", "多相辛香多酚悬浮组分", "东北流派骨汤乳化牛脂", "热交换黏稠高盐聚合物"] },
  { key: "冒菜", synonyms: ["蜀地无明火浸解重油多酚", "高浓度辣椒素水脂混合乳", "辛热脂肪酸聚集大分子", "川西重味微流体沉淀物"] },
  { key: "串串", synonyms: ["竹签传导压热可溶性肌纤维", "高辣盐度热力红油浸膏", "超饱和辛香挥发油复合体"] },
  { key: "辣", synonyms: ["高温辣椒素结晶", "蜀地辛香辣椒多酚", "热燥油脂底层沉积", "分子级别辣椒素游离配体", "高爆发性痛觉受体激活源"] },
  { key: "川", synonyms: ["巴蜀复兴香料复合物", "高浓度辣味多肽", "川西重油浸膏", "天府高烈度香辛油"] },
  { key: "湘", synonyms: ["湘江重辣催化因子", "高挥发性辛香酚", "极干热辣聚合物", "辛辣脱水双氧胞嘧啶"] },
  { key: "麻", synonyms: ["麻醇花椒挥发油", "生理性酥麻配体", "高敏感觉受体激活素", "花椒麻素神经毒性轻刺激微粒", "高频机械振荡感脂质"] },
  { key: "螺蛳", synonyms: ["古法发酵酸笋厌氧酸", "高度发酵石螺聚合物", "高浓度腐植酸", "柳州标志性高度发酵甲酚", "极臭还原性风味大分子硫醚"] },
  { key: "臭豆腐", synonyms: ["黑豆厌氧发酵蛋白胶", "高位硫化氢载体", "刺激性臭黑物", "硫酸亚铁诱导黑氧化铁结壳", "极度重度氨基酸降解质"] },
  { key: "榴莲", synonyms: ["高糖分丁酸乙酯凝胶", "硫醇性挥发芳香微粒", "粘稠乳浊酯质", "高危热量三甘醇果糖聚合体"] },
  { key: "香菜", synonyms: ["辛叶醛芳香精油", "植物基因对立芳香因子", "微量碱性绿叶素", "十醛不饱和挥发芳烃"] },
  { key: "大蒜", synonyms: ["大蒜素高挥发有机硫", "极强杀菌二烯丙基硫", "原始刺激性辣素", "高还原度硫代亚磺酸酯"] },
  { key: "韭菜", synonyms: ["纤维素挥发硫醚", "热性胃催化草本纤维", "多孔多孔膳食分子", "重度甲基二硫化物"] },
  { key: "烤鸭", synonyms: ["北京香烤脂肪酸", "高纯度果木烘烤焦糖化表皮组分", "鸭皮不饱和长链多脂胶", "烤挂炉高温热解皮下脂肪流动体", "甜面酱高黏度多糖焦糖化聚合物"] },
  { key: "锅包肉", synonyms: ["精制糖醋梅拉德结晶壳", "高比例短链糊化多糖", "酸甜度缓冲油炸白质复合体", "高硬度脱水木薯淀粉脆化包壳"] },
  { key: "红烧肉", synonyms: ["高饱和度均质化凝结皮脂胶", "纯化蔗糖低温糖色还原体", "东坡流派多相脂肪分子", "微火焖制饱和慢速水解胶原蛋白"] },
  { key: "小笼包", synonyms: ["超饱和高渗肉汁白质水合溶液", "发酵中筋小麦多糖膜", "高浓度肉皮冻明胶还原多肽", "江浙精细中筋多糖拉伸骨架"] },
  { key: "饺子", synonyms: ["手工白面面筋拉伸多肽封套", "多相混合肉浆高聚物", "多糖水合包裹体", "手工高水合麦谷蛋白网膜"] },
  { key: "馄饨", synonyms: ["薄化小麦面筋蛋白微透封装", "鲜味游离多肽悬浮液", "碱性麦谷蛋白包裹颗粒", "猪肉肌纤维高频率捶打碎浆膜"] },
  { key: "抄手", synonyms: ["高烈度红油浸渍水合淀粉体", "巴蜀蒜香挥发有机硫复合体", "多相鲜肉组织高固高聚物", "重油包裹高密度多肽馄饨"] },
  { key: "宫包鸡丁", synonyms: ["醋糖比缓冲梅拉德变性鸡胸多肽", "花生不饱和油酸结晶", "高浓度川香辣椒多微粒", "煳辣荔枝口多相调和浸出物"] },
  { key: "辣子鸡", synonyms: ["高饱和油炸脱水肌原白质", "高频度辣椒素脱水晶体", "高干度香气复合颗粒", "歌乐山超高干度焦脆肌肉多肽"] },
  { key: "麻婆豆腐", synonyms: ["高温高油均质凝结熟石膏白质", "麻醇花椒油多相包被", "牛肉糜高焦梅拉德反应物", "高黏度芡汁多糖包裹体"] },
  { key: "炒饭", synonyms: ["高硬度颗粒化脱水大米多糖", "游离多相非水合脂包膜", "高温锅气碳化微粒", "黄金美拉德反应多孔米粒结构"] },
  { key: "炒河粉", synonyms: ["高度糊化片状支链淀粉胶", "高温老抽焦糖化吸附体", "高浓度牛脂挥发精油", "广式特高温排骨美拉德反应物"] },
  { key: "佛跳墙", synonyms: ["极奢动物黏多糖高浓度胶原", "海洋深底几丁质多肽缓释液", "多相珍奇氨基酸微粒悬浮", "超长时空高盐高蛋白均质胶体"] },
  { key: "奶茶", synonyms: ["高度乳化反式/顺式脂肪乳浊液", "合成多羟基多咖啡因化合物", "高浓度果糖基木薯多糖胶圆", "高果糖高甜高多巴胺乳凝膏"] },
  { key: "咖啡", synonyms: ["高压淬取活性咖啡因", "深度微分子烘焙焦糖", "有机绿原酸复合物", "高浓度咖啡酰奎宁酸聚合物"] },
  { key: "美式", synonyms: ["零糖高压萃取咖啡黑水", "无奶稀释焦油微粒", "酸质咖啡因聚合液", "绝对焦苦高浓度不饱和黑水层"] },
  { key: "拿铁", synonyms: ["乳固形酪蛋白脂肪悬浮", "咖啡单宁酸多酚", "双重多相乳浊液", "高压蒸汽蒸汽水合牛奶脂肪网格"] },
  { key: "茶", synonyms: ["高抗氧化茶单宁", "高分子茶多酚", "儿茶素芳香微元", "植物天然小分子茶碱单体"] },
  { key: "红茶", synonyms: ["全发酵红茶多酚", "焦糖香芳香大分子", "单宁酸沉淀物", "高聚合红茶色素分子"] },
  { key: "乌龙", synonyms: ["半发酵乌龙茶多酚", "高山茶碱结晶", "幽香脂类复合物", "铁观音高山碳焙芳烃结合物"] },
  { key: "可乐", synonyms: ["碳酸高压饱和溶液", "高富集焦糖色素", "游离正磷酸胶体", "高浓度磷酸酸化游离极性溶液"] },
  { key: "雪碧", synonyms: ["碳酸饱和含柠檬酸液", "极高果糖糖浆结晶", "柑橘香轻质挥发油"] },
  { key: "汽水", synonyms: ["重碳酸根释出气体微粒", "柠檬酸多相缓冲液", "果聚糖悬浮溶液"] },
  { key: "汉堡", synonyms: ["高淀粉多糖麦麸骨架", "动物源饱和脂肪酸", "速食梅拉德反应物", "高能量饱和美式牛肉碎脂"] },
  { key: "薯条", synonyms: ["高温脱水脆化淀粉", "高沸点棕榈油脂吸附体", "马铃薯淀粉结构", "比利时流派双重油温脱水淀粉晶"] },
  { key: "批萨", synonyms: ["拉丝高分子酪蛋白", "番茄多酚微酸性底质", "重叠油脂乳浊体", "高饱和意大利干酪高分子网络"] },
  { key: "芝士", synonyms: ["凝聚高浓度酪蛋白脂肪", "乳胶干酪微孔构型", "醇厚香气游离单体", "高度拉丝熟化酪蛋白硬脂"] },
  { key: "奶酪", synonyms: ["乳酸菌发酵胶体酪蛋白", "天然钙脂螯合物", "高粘悬浮粒子"] },
  { key: "牛奶", synonyms: ["多相水包油乳固形脂肪", "活性乳清白质键", "含钙胶体微球"] },
  { key: "海鲜", synonyms: ["深海不饱和几丁质聚糖", "高风味牛磺酸沉积", "海洋微量矿物结晶", "深海盐度多氨基酸混合缩合体"] },
  { key: "螃蟹", synonyms: ["高浓度几丁壳多糖", "游离嘌呤核苷酸胶体", "不饱和脂肪微结构"] },
  { key: "虾", synonyms: ["虾红素抗氧化红色微粒", "肌浆高还原性嘌呤", "高分子甲壳胺", "极高纯度野生不饱和肌球纤维", "高分子甲壳胺几丁质胞衣", "肌浆高还原性嘌呤聚合物"] },
  { key: "鱼", synonyms: ["不饱和Omega-3脂肪酸", "高活性肌动蛋白多肽", "海洋微量硒盐固体", "淡水高嘌呤饱和肌纤维结构", "深海不饱和Omega-3单不饱和键", "变性多肽水相鱼肌浆蛋白", "海洋微量矿物结晶多酚"] },
  { key: "生鱼", synonyms: ["未变性低温鲜甜肌浆蛋白", "天然多不饱和低聚脂", "冷链活性氨基酸菌落", "深海超低温未凝固三甘油脂膜"] },
  { key: "寿司", synonyms: ["醋调和水合白淀粉胶", "多孔海苔高纤维微粒", "风味氨基酸粘着体", "轻度发酵米醋浸渍支链淀粉"] },
  { key: "拉面", synonyms: ["高筋碱水面筋拉伸多肽", "高盐豚骨悬浮多相脂", "重叠膳食碳水胶", "乳白色重油高骨钙均质乳浊液"] },
  { key: "天妇罗", synonyms: ["极松脆油炸脱水淀粉薄壳", "微孔化顺式脂肪包覆体", "海鲜/植物多水分生鲜胶", "高纯度轻质天妇罗精面糊脆微晶"] },
  { key: "鳗鱼", synonyms: ["高丰度不饱和多不饱和油酸", "浓郁蒲烧酱汁果糖糖色结晶", "极富油脂红肉纤维聚合体", "高能量多不饱和软骨结合构型"] },
  { key: "刺身", synonyms: ["极度冷链维持超鲜红肌球多肽", "高敏不饱和鱼油游离悬浮物", "低温活性深海蛋白晶体", "金枪鱼多不饱和暗红肌球素"] },
  { key: "部队锅", synonyms: ["高浓度淀粉高水合辛辣泡菜液", "高度压缩午餐肉饱和脂肪多肽", "脱水复生合成干酪素", "廉价饱腹级反式脂肪及高钠多相乳浊液"] },
  { key: "拌饭", synonyms: ["韩式辣椒酱高黏度聚合单糖", "流质受热变性荷合蛋黄多脂", "多孔多纤维水合山野菜", "石锅过热接触碳化大米坚硬结壳"] },
  { key: "洋葱", synonyms: ["高挥发性二烯丙基二硫有机硫", "低聚果糖焦糖化风味大分子", "多水分纤维素外壳"] },
  { key: "意面", synonyms: ["高精级杜兰杜林高筋面筋白质", "番茄红素低pH缓冲有机酸", "冷榨橄榄油不饱和油酸聚合体", "高密度坚硬角质面筋聚合物"] },
  { key: "热狗", synonyms: ["熟化碎肉乳化合成脂肪管", "精制小麦多糖多孔骨架", "芥末单宁高酸解挥发油"] },
  { key: "啤酒", synonyms: ["发酵麦芽酚有机大麦多糖", "重碳酸根释出活性微气泡", "啤酒花黄酮活性多酚"] },
  { key: "米线", synonyms: ["高干榨支链淀粉水合胶体棒", "高盐豚骨均质乳化汤质", "多孔多膳食纤维浮游颗粒", "重度压滤水合多糖胶体柱"] },
  { key: "热干面", synonyms: ["高浓度碱水小麦硬质多肽", "高稠度研磨脱水芝麻木脂素", "香油高度不饱和油酸网囊", "高压熟制脱水涂油碱性面条骨干"] },
  { key: "煎饼", synonyms: ["高度脱水杂粮均质脆壳", "高糖甜面酱多糖粘着质", "油炸排叉高脆顺式脂肪晶", "绿豆小米高活性低筋多孔膳食薄膜"] },
  { key: "火腿", synonyms: ["古法盐渍高钠脱水肌球蛋白", "陈酿均质不饱和风味脂肪酸", "高硬度结晶微量硝酸盐", "三年陈酿重度饱和盐干酪多肽"] },
  { key: "排骨", synonyms: ["高温脱水焦香梅拉德骨胶原", "骨髓磷脂富集饱和脂肪", "红肉高收缩性蛋白多肽", "猪骨软骨素及游离硬脂酸聚合体"] },
  { key: "小龙虾", synonyms: ["高浓度几丁质麻辣油包衣", "鳃腺浓集脂溶性微量元素", "精细肌球蛋白高紧实纤维", "高浓度虾黄重度卵磷脂结核物"] },
  { key: "方便面", synonyms: ["高度棕榈油炸波状碳水多糖", "超饱和谷氨酸钠脱水颗粒", "高度干制酱包反式脂肪聚合物", "高钠防腐剂脱水凝胶晶体"] },
  { key: "甜甜圈", synonyms: ["高度油炸糖霜多肽", "精制高糖分多巴胺聚合物", "双重反式脂肪构型"] },
  { key: "蛋糕", synonyms: ["高度发泡麦蛋白气孔", "高度精炼植脂牛油", "高浓度精制蔗糖结晶"] },
  { key: "草莓", synonyms: ["天然花青素红色颗粒", "多羟基挥发果酸单体", "高度水合单糖胚胎"] },
  { key: "巧克力", synonyms: ["可可脂高度结晶多型体", "高纯度可可碱单体", "单宁酸多羟基多酚", "极奢黑可可游离异构单体"] },
  { key: "牛排", synonyms: ["梅拉德反应褐变焦香多肽", "高温热缩化红肉纤维", "饱和脂肪酸网状凝胶", "战斧极奢肌肉多肽与高级牛髓甘油酯"] },
  { key: "烤肉", synonyms: ["高度热解梅拉德反应炭", "挥发性油脂熏烤酚", "高度压缩脂肪聚合物"] },
];

// 2. Tabular Selection Rules for Gastronomic & Diet Themes
export interface DietThemeRow {
  themeName: string;
  triggers: string[];
  colorHex: string;
  accentColorHex: string;
  textureType: string;
  shapeType: string;
  rarity: "N" | "R" | "SR" | "UR";
}

export const DIET_THEMES_TABLE: DietThemeRow[] = [
  {
    themeName: "volcanic_lava",
    triggers: ["火锅", "辣", "川", "湘", "红油", "辣子鸡", "串串", "冒菜", "抄手", "麻婆豆腐", "小龙虾"],
    colorHex: "#C21807", // scarlet hot sauce red
    accentColorHex: "#FF9900", // chili pepper sparks
    textureType: "volcanic_lava",
    shapeType: "fluid_drip",
    rarity: "R"
  },
  {
    themeName: "lava_obelisk",
    triggers: ["火锅", "辣", "川", "湘", "红油", "辣子鸡", "串串", "冒菜", "抄手", "麻婆豆腐", "小龙虾"],
    colorHex: "#B22222", // fire brick red
    accentColorHex: "#FF4500", // red orange
    textureType: "glowing_magma",
    shapeType: "sharp_obelisk",
    rarity: "R"
  },
  {
    themeName: "chili_horn",
    triggers: ["火锅", "辣", "川", "湘", "红油", "辣子鸡", "串串", "冒菜", "排骨"],
    colorHex: "#E53935",
    accentColorHex: "#D81B60",
    textureType: "fluorescent_plasma",
    shapeType: "curvy_chili",
    rarity: "R"
  },
  {
    themeName: "toxic_slime",
    triggers: ["螺蛳", "臭豆腐", "榴莲", "香菜", "大蒜", "韭菜", "肥肠", "臭", "洋葱"],
    colorHex: "#5A781D", // radioactive sludge green
    accentColorHex: "#A3E635", // toxic chartreuse
    textureType: "toxic_slime",
    shapeType: "fluid_drip",
    rarity: "R"
  },
  {
    themeName: "radioactive_waste",
    triggers: ["螺蛳", "臭豆腐", "榴莲", "香菜", "大蒜", "韭菜", "肥肠", "臭", "洋葱"],
    colorHex: "#6B8E23",
    accentColorHex: "#ADFF2F",
    textureType: "neon_toxic_waste",
    shapeType: "space_station",
    rarity: "R"
  },
  {
    themeName: "octopus_sludge",
    triggers: ["螺蛳", "臭豆腐", "榴莲", "肥肠", "臭"],
    colorHex: "#4C1D95",
    accentColorHex: "#06B6D4",
    textureType: "asphalt_tar",
    shapeType: "cute_octopus",
    rarity: "SR"
  },
  {
    themeName: "french_bento",
    triggers: ["巴黎", "法式", "西餐", "红酒", "面包", "意面", "披萨", "芝士", "奶酪"],
    colorHex: "#B45309", // toasted butter pastry amber
    accentColorHex: "#831843", // bordeaux red
    textureType: "smooth",
    shapeType: "eiffel_tower",
    rarity: "R"
  },
  {
    themeName: "croissant_glaze",
    triggers: ["起司", "芝士", "奶酪", "西餐", "巴黎", "面包", "蛋糕"],
    colorHex: "#D97706",
    accentColorHex: "#FBBF24",
    textureType: "frozen_glaze",
    shapeType: "gourmet_croissant",
    rarity: "R"
  },
  {
    themeName: "japanese_tale",
    triggers: ["猫", "日式", "日料", "寿司", "拉面", "刺身", "天妇罗", "鳗鱼"],
    colorHex: "#F8FAFC", // pearly white
    accentColorHex: "#EF4444", // sashimi red
    textureType: "smooth",
    shapeType: "lucky_cat_tail",
    rarity: "R"
  },
  {
    themeName: "boba_milkyway",
    triggers: ["奶茶", "咖啡", "美式", "拿铁", "甜"],
    colorHex: "#4A3728",
    accentColorHex: "#F5DEB3",
    textureType: "bubble_tea",
    shapeType: "spherical_boba",
    rarity: "R"
  },
  {
    themeName: "cyber_sugar",
    triggers: ["甜甜圈", "蛋糕", "草莓", "巧克力", "甜", "沙糖", "糖"],
    colorHex: "#EC4899", // barbie pink
    accentColorHex: "#10B981", // spearmint green contrast
    textureType: "glittery",
    shapeType: "ring_doughnut",
    rarity: "R"
  },
  {
    themeName: "gothic_throne",
    triggers: ["巧克力", "蛋糕", "甜甜圈", "糖"],
    colorHex: "#2E1065",
    accentColorHex: "#F472B6",
    textureType: "gothic_obsidian",
    shapeType: "thor_hammer",
    rarity: "SR"
  },
  {
    themeName: "cyber_grid",
    triggers: ["咖啡", "美式", "拿铁", "红茶", "乌龙茶", "可乐", "汽水", "饮料", "泡面", "方便面"],
    colorHex: "#1E293B", // caffeinated slate black
    accentColorHex: "#00DFFF", // electronic cyan
    textureType: "cyber_grid",
    shapeType: "alien_ufo",
    rarity: "R"
  },
  {
    themeName: "digital_matrix",
    triggers: ["咖啡", "美式", "拿铁", "红茶", "乌龙茶", "方便面"],
    colorHex: "#0B0F19",
    accentColorHex: "#34D399",
    textureType: "carbon_fiber",
    shapeType: "gear_wheel",
    rarity: "R"
  },
  {
    themeName: "luxury_aurum",
    triggers: ["松露", "鹅肝", "鱼子酱", "鲍鱼", "极奢", "和牛", "金箔", "金"],
    colorHex: "#111827", // obsidian black
    accentColorHex: "#F59E0B", // 24k gold
    textureType: "metallic_gold",
    shapeType: "royal_crown",
    rarity: "SR"
  },
  {
    themeName: "emperor_crown",
    triggers: ["极奢", "佛跳墙", "鲍鱼", "金箔", "松露"],
    colorHex: "#171717",
    accentColorHex: "#FCD34D",
    textureType: "gilded_relic",
    shapeType: "royal_crown",
    rarity: "UR"
  },
  {
    themeName: "antique_bronze",
    triggers: ["松露", "鹅肝", "鱼子酱", "极奢", "古老"],
    colorHex: "#374151",
    accentColorHex: "#B45309",
    textureType: "ancient_bronze",
    shapeType: "ancient_totem",
    rarity: "SR"
  },
  {
    themeName: "chinese_imperial",
    triggers: ["烤鸭", "锅包肉", "红烧肉", "小笼包", "饺子", "馄饨", "宫保鸡丁", "抄手", "炒饭", "炒河粉", "佛跳墙", "火腿", "牛排", "烤肉", "炸鸡", "汉堡", "薯条", "热狗", "排骨", "牛肉", "肉"],
    colorHex: "#881337", // deep lacquered rosewood
    accentColorHex: "#F59E0B", // majestic dynasty gold
    textureType: "metallic_gold",
    shapeType: "royal_crown",
    rarity: "SR"
  },
  {
    themeName: "imperial_pagoda",
    triggers: ["烤鸭", "锅包肉", "红烧肉", "小笼包", "饺子", "馄饨", "抄手", "炒饭", "排骨", "肉"],
    colorHex: "#7C2D12",
    accentColorHex: "#FFD700",
    textureType: "porcelain_blue",
    shapeType: "pagoda_spire",
    rarity: "SR"
  },
  {
    themeName: "cosmic_nebula",
    triggers: ["宇宙", "星", "月", "日", "云", "风", "天", "雷", "电", "空", "混沌", "奇点", "黑洞", "暗物质"],
    colorHex: "#3B0764", // deep night purple
    accentColorHex: "#FF00FF", // neon magenta supernova
    textureType: "rainbow_metallic",
    shapeType: "alien_ufo",
    rarity: "UR"
  },
  {
    themeName: "galaxy_nebula",
    triggers: ["宇宙", "星", "月", "日", "云", "空", "混沌"],
    colorHex: "#1E1B4B",
    accentColorHex: "#F43F5E",
    textureType: "cosmic_stardust",
    shapeType: "infinity_loop",
    rarity: "UR"
  },
  {
    themeName: "phoenix_pyre",
    triggers: ["宇宙", "雷", "电", "混沌", "奇点", "黑洞"],
    colorHex: "#1C0A0A",
    accentColorHex: "#EF4444",
    textureType: "phoenix_ashes",
    shapeType: "volcanic_caldera",
    rarity: "UR"
  },
  {
    themeName: "geological_stratum",
    triggers: ["地球", "石", "土", "砂", "泥", "山", "古老", "微尘"],
    colorHex: "#57534E", // deep geological slate gray
    accentColorHex: "#1C1917", // limestone
    textureType: "relic_moss_stone",
    shapeType: "massive_mountain",
    rarity: "SR"
  },
  {
    themeName: "amber_fossil",
    triggers: ["地球", "石", "土", "古老", "山", "微尘"],
    colorHex: "#78350F",
    accentColorHex: "#F59E0B",
    textureType: "honey_amber",
    shapeType: "leaning_tower",
    rarity: "SR"
  },
  {
    themeName: "fossil_totem",
    triggers: ["地球", "石", "土", "古老", "山"],
    colorHex: "#451A03",
    accentColorHex: "#A16207",
    textureType: "petrified_fossil",
    shapeType: "ancient_totem",
    rarity: "SR"
  },
  {
    themeName: "herbal_tonic",
    triggers: ["人参", "枸杞", "补", "药"],
    colorHex: "#D97706", // warm amber medicinal
    accentColorHex: "#DC2626", // active crimson
    textureType: "crystalline",
    shapeType: "double_helix",
    rarity: "SR"
  },
  {
    themeName: "origami_crane_zen",
    triggers: ["人参", "枸杞", "茶", "红茶", "乌龙", "空腹"],
    colorHex: "#F1F5F9",
    accentColorHex: "#0EA5E9",
    textureType: "cotton_candy",
    shapeType: "origami_crane",
    rarity: "SR"
  },
  {
    themeName: "healthy_chlorophyll",
    triggers: ["蔬菜", "草", "沙拉", "轻食", "绿", "健身", "鸡胸"],
    colorHex: "#156534", // rich leafy green chlorophyll
    accentColorHex: "#BBF7D0", // soft lime
    textureType: "grainy",
    shapeType: "standard_swirl",
    rarity: "N"
  },
  {
    themeName: "emerald_pillar",
    triggers: ["蔬菜", "草", "沙拉", "轻食", "绿", "健身", "鸡胸"],
    colorHex: "#022C22",
    accentColorHex: "#10B981",
    textureType: "jadeite_emperor",
    shapeType: "cactus_pillar",
    rarity: "SR"
  },
  {
    themeName: "sea_colloid",
    triggers: ["海鲜", "螃蟹", "虾", "鱼", "刺身", "寿司"],
    colorHex: "#0F766E",
    accentColorHex: "#06B6D4",
    textureType: "sea_salt_colloid",
    shapeType: "chess_knight",
    rarity: "R"
  },
  {
    themeName: "pretzel_loop",
    triggers: ["汉堡", "薯条", "披萨", "意面", "热狗"],
    colorHex: "#78350F",
    accentColorHex: "#D97706",
    textureType: "bamboo_weave",
    shapeType: "twisted_pretzel",
    rarity: "R"
  },
  {
    themeName: "marmoreal_shrine",
    triggers: ["牛肉", "牛排", "烤肉", "排骨", "肉"],
    colorHex: "#27272A",
    accentColorHex: "#E11D48",
    textureType: "marmoreal_onyx",
    shapeType: "abstract_cube",
    rarity: "SR"
  },
  {
    themeName: "mathematical_sequence",
    triggers: ["10", "1", "2", "3", "4", "5", "6", "7", "8", "9", "十", "一", "二", "三", "四", "五", "六", "七", "八", "九"],
    colorHex: "#0F172A", // digital carbon slate
    accentColorHex: "#38BDF8", // math grid cyan
    textureType: "cyber_grid",
    shapeType: "double_helix",
    rarity: "R"
  }
];


// 3. Tabular Seasonal / Climatological Hybrid Textures Directory
export interface HybridTextureRow {
  seasonKey: "spring" | "summer" | "autumn" | "winter";
  timeKey: "morning" | "afternoon" | "night";
  displayName: string;
  description: string;
}

export const SEASON_TIME_HYBRID_TABLE: HybridTextureRow[] = [
  {
    seasonKey: "spring",
    timeKey: "morning",
    displayName: "【春曦新绿】",
    description: "呈现出雨后春笋般的盎然嫩绿微光，表层闪烁着晨露折射的微小水合气泡"
  },
  {
    seasonKey: "spring",
    timeKey: "afternoon",
    displayName: "【春樱晴午】",
    description: "带有浪漫轻盈的绯粉色微闪偏光，犹如繁花在春日暖阳下的惬意起伏"
  },
  {
    seasonKey: "spring",
    timeKey: "night",
    displayName: "【春夜微雨】",
    description: "泛着幽蓝月影与樱粉斑驳的双色光晕，宛如暮春细雨打湿的青石小路"
  },
  {
    seasonKey: "summer",
    timeKey: "morning",
    displayName: "【夏荷晨露】",
    description: "绿莹底色上缀着圆润清澈的晶莹液珠，透露出池塘睡莲初醒的生命神性"
  },
  {
    seasonKey: "summer",
    timeKey: "afternoon",
    displayName: "【夏日烈阳】",
    description: "极高饱和度暖金烘烤光波，外壁因高热释放而隐隐呈现海市蜃楼般的流体扭曲"
  },
  {
    seasonKey: "summer",
    timeKey: "night",
    displayName: "【夏夜繁星】",
    description: "深邃纯黑底色上繁星般散落着点点萤粉与夜光尘埃，静谧中有一丝欢跃"
  },
  {
    seasonKey: "autumn",
    timeKey: "morning",
    displayName: "【秋霜枫莹】",
    description: "晨霜银白雾感笼罩着厚重的枫红橙底，诠释了气温初降时的物料凝聚美学"
  },
  {
    seasonKey: "autumn",
    timeKey: "afternoon",
    displayName: "【金秋落叶】",
    description: "金黄干枯的大理石断层干裂感，饰以零星飘落的灿烂落叶金粉与琥珀色斑"
  },
  {
    seasonKey: "autumn",
    timeKey: "night",
    displayName: "【寒秋明月】",
    description: "清冷如银的皎洁月华反光罩在深沉沉淀层上，展现广寒宫殿宇般的空门孤寂"
  },
  {
    seasonKey: "winter",
    timeKey: "morning",
    displayName: "【冬晨初雪】",
    description: "淡淡冰蓝凝霜晶体附着于表，犹如清晨初雪初降在大理石雕塑上的冰透霜华"
  },
  {
    seasonKey: "winter",
    timeKey: "afternoon",
    displayName: "【冬日暖阳】",
    description: "苍茫白雪中透出一抹温暖的杏黄余温，带有松软又沉淀的温存暖意"
  },
  {
    seasonKey: "winter",
    timeKey: "night",
    displayName: "【深冬飞雪】",
    description: "漆黑幽邃的外壳上，凝结着六角雪花冰晶与静电霜痕，呈现绝对零度的极致圣洁"
  }
];


// 4. Tabular Curation Materials & Textures Discussion Registry
export interface TextureDiscussRow {
  textureType: string;
  discussionTemplate: string;
}

export const TEXTURE_DISCUSSION_TABLE: TextureDiscussRow[] = [
  {
    textureType: "gilded_relic",
    discussionTemplate: "。极奢至极的【{primaryArtisticIng}】金箔镀层在其顶部凝聚，流线型的 {shapeName} 轮廓完全被灿烂夺目的土豪金遮蔽。这是对长达 {holdingDays} 天极限负重的一次充满庄严感的肉体表彰，堪称无价的赛博古董"
  },
  {
    textureType: "ancient_bronze",
    discussionTemplate: "。斑驳暗淡的【{primaryArtisticIng}】铜锈绿晶在其氧化表面如苔藓般侵染，古朴迷离。憋拉 {holdingDays} 日的时光结晶，让干枯坚固的胚体表面拥有一种美索不达米亚平原青铜圣器般的静谧，神圣而带有荒凉诗意"
  },
  {
    textureType: "relic_moss_stone",
    discussionTemplate: "。作品完美呈现出【{primaryArtisticIng}】颗粒石质感。由于经历了长达 {holdingDays} 天的厌氧洗礼，表面滋生出类似矿物绿霉与活性多肽黏丝的“微型生态绿原”。这是一种人造文明遗迹被自然森林缓慢吞噬的、极其凄美的极简生态神话"
  },
  {
    textureType: "petrified_fossil",
    discussionTemplate: "。坚固得如同高钙玄武岩一般的【{primaryArtisticIng}】岩壁上，凝结着粗砺的历史干裂纤维。这是过去 {holdingDays} 天在强腹压、低水合生理博弈下结出的“坚不可摧之舍利”，彰显出大肠蠕动机制对软弱有机基质的铁兽般规训"
  },
  {
    textureType: "volcanic_lava",
    discussionTemplate: "。狂暴的【{primaryArtisticIng}】通红岩浆沿着流线外壁缓缓渗流，极温辛香料中的油脂素与辣椒多酚在大气中几乎处于正在蒸腾的虚设气孔态。火红与焦黑的撞击，是宿主在享受极辣美食那一瞬间肾上腺素暴涨的、极具侵略性的身体快感自画像"
  },
  {
    textureType: "toxic_slime",
    discussionTemplate: "。泛着异样光泽的【{primaryArtisticIng}】有毒绿色黏膜正从外层断口处向四周发散出带有刺鼻大蒜、酸笋与香菜气孔的强侵蚀液滴，让人在距离十米开外即可对宿主的消化黑箱产生极度敬畏。这是关于快餐垃圾堆里生物发酵奇迹的一次极其朋克的无序抗议"
  },
  {
    textureType: "smooth",
    discussionTemplate: "。作品外部极为难得地表现出了白瓷般光滑的【{primaryArtisticIng}】丝滑流线。高贵圆润的面筋弹性多肽拉近了整件雕像的圣洁质感，极具巴洛克女性雕像的流线之美，消解了所有本源宿命物料的污浊印记"
  },
  {
    textureType: "grainy",
    discussionTemplate: "。质感扎实的【{primaryArtisticIng}】颗粒度与谷物麦麸的坚硬残屑完美糅合，带来一种类似于红土高原风化砂岩的质朴粗糙度。这是一次极速回归田园本质的、去修饰的身体诚实投影"
  },
  {
    textureType: "steaming",
    discussionTemplate: "。带有水汽余温 of 【{primaryArtisticIng}】液泡外壁散发着若有似无的淡淡气旋，暗示该作刚刚脱离主厨肠道三十秒的“崭新鲜活度”。雾霭笼罩的边缘轮廓，平添了一种朦胧而具有时效限定的哀伤美感"
  },
  {
    textureType: "glittery",
    discussionTemplate: "。闪耀着荧光粉色泡泡多酚 of 【{primaryArtisticIng}】多羟基糖结晶覆盖全身，在射灯下闪烁着诡异的多巴胺光芒。粉嫩与甜蜜包装之下的本质排泄，以赤裸裸又梦幻的视觉语言戏弄了现代工业消费社会对人体的粉饰"
  },
  {
    textureType: "cyber_grid",
    discussionTemplate: "。咖啡焦黑色泽凝聚而成的【{primaryArtisticIng}】碳粉质感完美契合了 {shapeName} 形态。其微小的几何多孔外壳下，封存着大量无奶冰美式中尚未重组的酸类，是数字时代码农、设计师生存现状的冰冷代谢图纸"
  },
  {
    textureType: "metallic_gold",
    discussionTemplate: "。黑曜石般焦黑的底座烘托着宛如璀璨夜星的【{primaryArtisticIng}】鎏金屑点，两种极高对比的明暗度直接颠覆了传统的垃圾废料认知。黑与金交织出的贵族气派，是消费主义精致晚宴大快朵颐之后的终极物理嬗变"
  },
  {
    textureType: "rainbow_metallic",
    discussionTemplate: "。奇迹般的、流动着量子阴阳极偏色干涉偏光光谱的【{primaryArtisticIng}】五彩极光反光涂层包裹着整尊胚体，流光溢彩，宛若事件视界外层的时空折变。这直接将排泄物的物理形态升华至恒星创生、星轨流变的宇宙超验高度，令人叹为观止"
  },
  {
    textureType: "crystalline",
    discussionTemplate: "。其主体呈现出一种神圣半透明的、温润如极地冰川晶体般的【{primaryArtisticIng}】微晶矿物结晶。淡雅又高贵的折光度透露出一丝凉爽、纯粹而不可侵犯的精炼自律，彻底挣脱了凡俗世俗饮食的所有烟火与油脂味"
  },
  {
    textureType: "carbon_fiber",
    discussionTemplate: "。作品采用了高强度的【{primaryArtisticIng}】碳纤维编织肌理。细密的斜纹多层交叉网格在不同光角下呈现出极度硬核的技术工业美感，宛若来自硅谷实验室最深处的一件超模量精密装甲"
  },
  {
    textureType: "velvet_flock",
    discussionTemplate: "。其表层覆盖着一层吸光率高达99%的【{primaryArtisticIng}】天鹅绒植绒织物，散发出犹如黑洞般令人战栗的、吸收射灯光子的高贵哑光感，在虚实边缘挑起观众战栗的手感触电"
  },
  {
    textureType: "pearl_essence",
    discussionTemplate: "。作品被珍珠母贝般的柔美【{primaryArtisticIng}】珠光涂层包裹，多向曲面散射着莹润梦幻的粉青双色折亮。这成功消解了排泄的物理重力，使之蒙上一层浪漫古典的美声歌剧薄雾"
  },
  {
    textureType: "rusty_iron",
    discussionTemplate: "。高盐分带来的【{primaryArtisticIng}】严重氧化铁锈绿和斑驳红褐色结核侵蚀全身。它是经历大肠内残酷物理挤摩擦、并暴露于冷空气后瞬间锈蚀的生命金属废墟，极具末日工业铁锈美学"
  },
  {
    textureType: "jadeite_emperor",
    discussionTemplate: "。堪称瑰宝级半透温润的【{primaryArtisticIng}】翡翠色泽在核心流溢。那是翠绿底色与乳白玉棉纠合而出的高贵透明体，仿佛大自然经历千万年压强挤制而出的缅甸帝王晶脉"
  },
  {
    textureType: "frozen_glaze",
    discussionTemplate: "。精妙呈现出【{primaryArtisticIng}】汝窑裂纹釉的清天色。冰裂网纹在微脆的保护釉壳上纵横，带有宋代极简主义手艺人对至高器皿的极致物料和解"
  },
  {
    textureType: "molten_silver",
    discussionTemplate: "。作品外部如同流动着沸腾的【{primaryArtisticIng}】液态镜面水银，高反射偏光将展厅的每一束聚光灯扭曲在它圆润而极具未来张力的金属肌腱之上"
  },
  {
    textureType: "honey_amber",
    discussionTemplate: "。高透光性蜂蜜般的【{primaryArtisticIng}】暖橙琥珀凝胶完美封存着内部的有机质。光照下宛如史前侏罗纪树脂在地下千米瞬时熟化的有机晶核，温暖、松厚且透露着永恒的生物蜡光色"
  },
  {
    textureType: "bubble_tea",
    discussionTemplate: "。其表面由极其饱满圆滑的、散落着高弹性【{primaryArtisticIng}】珍珠波霸颗粒的黑糖流层堆砌，犹如一杯在大肠深层被重力极纯压缩、尚未搅拌的赛博奶茶黑冰原"
  },
  {
    textureType: "bamboo_weave",
    discussionTemplate: "。作品展现出鬼斧神工的【{primaryArtisticIng}】竹缕编织纤维质感。纵横交错的质朴草木脉络以有机的韵律将水分紧密禁锢，透着巴蜀乡村极简手工艺品对材料的本真尊重"
  },
  {
    textureType: "cosmic_stardust",
    discussionTemplate: "。无数粒散发着紫色、粉红及钴蓝色的【{primaryArtisticIng}】超新星超微尘埃在黑暗底座上闪耀。宛如猎户座旋臂深处的星云微尘降落在人体废料之上，让人陷入无尽的时空格局冥思"
  },
  {
    textureType: "gothic_obsidian",
    discussionTemplate: "。纯由黑曜石般的【{primaryArtisticIng}】极墨晶体微粒重构成硬朗锐利的物理切面，光影在各处微晶楞骨上发生干净利落的反差。这是暗夜之子在黑色祭坛上敬献的克苏鲁系生理图纸"
  },
  {
    textureType: "leopard_spotted",
    discussionTemplate: "。作品大胆披覆了【{primaryArtisticIng}】野生黑金斑斓豹纹团。金棕交错的多酚油脂斑块在边缘形成极具狂野攻击性、热带草原气息的野兽生理图腾"
  },
  {
    textureType: "fluorescent_plasma",
    discussionTemplate: "。在展厅射灯下突兀激发出荧光粉红与高频电紫的【{primaryArtisticIng}】带电离子外膜。它在气溶胶边界上若有似无地颤栗，是对消费时代人造色素与香精化工配料的终极生化嘲谑"
  },
  {
    textureType: "strawberry_jam",
    discussionTemplate: "。果酱一般的【{primaryArtisticIng}】艳红凝结在它的周圈，饱含纤维果肉的细密悬浮小颗粒在红润胶体下清晰可辨。甜蜜中蕴含着狂欢的代价，以极具调色张力的甜美血色挑逗视觉"
  },
  {
    textureType: "matte_clay",
    discussionTemplate: "。朴质安宁、近乎呼吸态的【{primaryArtisticIng}】陶土磨砂质感。完全剥离了凡尘的所有精油反光与化工修饰，向观众袒露其最本真、最诚实的大地泥土容貌"
  },
  {
    textureType: "molten_chocolate",
    discussionTemplate: "。散发着【{primaryArtisticIng}】浓郁可可甘脂反光弧度的黑巧克力熔岩流线，将排泄的主题极度诡谲地嫁接在顶级甜品的丝滑快感之上，让所有的生理抗拒在大脑皮层的甜蜜幻觉中彻底交融"
  },
  {
    textureType: "milky_way",
    discussionTemplate: "。极具浪漫色彩的【{primaryArtisticIng}】粉紫、幽蓝、璨金三色相间银河渐变带缠绕而上，无数太空尘埃和气泡在胚体上微茫明灭，令人对如此辽远的时空画幅发出崇高惊叹"
  },
  {
    textureType: "glowing_magma",
    discussionTemplate: "。红油淬炼而出的【{primaryArtisticIng}】火焰岩浆巨温网络在深褐干旱的开裂缝中亮起，仿佛沉睡千万年的休眠火地核在此刻迎来了大肠物理蠕动的最终激醒"
  },
  {
    textureType: "deep_ocean_chitin",
    discussionTemplate: "。呈现出深海鲟鱼子般的【{primaryArtisticIng}】深蓝及靛黑几丁质贝壳鳞面，细腻而带有略微粘性反光，将大洋千米下的高压物理秩序完美移植在陆地主厨的消化果实侧"
  },
  {
    textureType: "neon_toxic_waste",
    discussionTemplate: "。刺目的【{primaryArtisticIng}】霓虹生化黄绿废弃流流淌而下，亮黄与亮绿在微缩刻度上剧烈冲撞。其外层凝聚的微小液泡宛若生化实验废液池表面的剧毒呼吸，荒诞又迷幻"
  },
  {
    textureType: "porcelain_blue",
    discussionTemplate: "。温润如玉的白色背景中，不可思议地浸染开几抹【{primaryArtisticIng}】青花海水钴蓝纹饰。蓝白极度高雅的对比在巴洛克起伏下分外夺目，是东方传统柴窑艺术品在赛博时代的一场生理意外"
  },
  {
    textureType: "ancient_parchment",
    discussionTemplate: "。表皮泛着【{primaryArtisticIng}】羊皮纸般的枯黄干缩褶皱。那些失水结焦的长条纤维仿佛古罗马被掩埋在火山灰下的莎草圣卷，写满了肠腔对物料理学加工时烙刻下的古老真言"
  },
  {
    textureType: "chrome_plating",
    discussionTemplate: "。镜面铬一般【{primaryArtisticIng}】绝对金属反射外衣将周围的防护线和观众投射其上。这以物理学的硬性机制，将旁观者的凝视毫无保留、也毫不体面地再度弹回其视网膜，概念感惊艳"
  },
  {
    textureType: "sea_salt_colloid",
    discussionTemplate: "。粗砺半透明的【{primaryArtisticIng}】白色海盐大质体团簇在其全身，在展灯的穿透下泛出略微苍白圣洁的水晶盐度反光，消解了任何人间快餐的驳杂油脂感"
  },
  {
    textureType: "zebra_stripe",
    discussionTemplate: "。极高反差的【{primaryArtisticIng}】斑马黑白条纹层叠流动，视觉频率极具后现代波普艺术的炫目幻觉，使整尊雕塑在空旷寂静的展馆中成为一个强扭曲视觉重心波"
  },
  {
    textureType: "peacock_feather",
    discussionTemplate: "。作品散发出【{primaryArtisticIng}】孔雀羽毛般流光溢彩的皇家青黛与羽绿偏光，细小的微羽纹理极其细致地贴附于侧，让人恍惚间以为有一只神鸟曾在宿主梦境中展翅"
  },
  {
    textureType: "marmoreal_onyx",
    discussionTemplate: "。呈现高品阶【{primaryArtisticIng}】玉髓大理石飘花纹路，暗红、焦黑与暖黄在胚体温软的底子内交错流移，形成一副不规则、冷艳、几乎永恒的矿物山水风景画幅"
  },
  {
    textureType: "asphalt_tar",
    discussionTemplate: "。浓稠焦灼至极的【{primaryArtisticIng}】柏油沥青黏质。其几乎丧失了所有流动能，带着惊人的高亮泽黑色反光，宛若地球工业革命初期最沉重、最黏稠的动力黑色燃料"
  },
  {
    textureType: "phoenix_ashes",
    discussionTemplate: "。作品全身闪烁着【{primaryArtisticIng}】浴火涅槃后的凤凰火黑灰烬，边缘在沉穆黑晶内部仍然明灭散落着暗红炭温。它用毁灭的余波，表彰了碳水和蛋白质在胃口里最后一次庄严的退役"
  },
  {
    textureType: "coral_calcified",
    discussionTemplate: "。极为罕见的【{primaryArtisticIng}】钙化珊瑚蜂窝多孔粗质。苍白、干燥、千疮百孔的珊瑚网状物吸附周侧，将生理排泄的潮湿记忆完全转化为深海枯竭残骨的静穆定格"
  },
  {
    textureType: "cotton_candy",
    discussionTemplate: "。不可思议地展现蓬松如【{primaryArtisticIng}】粉红与粉蓝棉花糖的气泡云。它柔软地浮起在底盘之上，将原本沉底的物理重力极度幽默地轻量化为乐园里最梦幻多巴胺的甜蜜幻影"
  }
];


// 5. High-Concept Preposterous Title Template Matrix Table
export interface TitleTemplateRow {
  themeName: string;
  templates: string[];
}

export const TITLE_TEMPLATES_TABLE: TitleTemplateRow[] = [
  {
    themeName: "gilded_antique",
    templates: [
      "《时空折叠：历经 {holdingDays} 天憋附之“{randomIng}”黄金纪念碑》",
      "《高贵的惰性沉积物：由 {holdingDays} 日物理抗张力所重塑的 “{primaryBreakfast}” 史诗大典》",
      "《金缕玉衣在人间的最后叹息：有关 “{randomIng}” 的皇家地层学报告》",
      "《卢浮宫的遗物：大肠与意志力共同熔铸的 {holdingDays} 日物理断层》"
    ]
  },
  {
    themeName: "ancient_bronze",
    templates: [
      "《岁月的侵蚀：在宿主腹压下憋足 {holdingDays} 天的原生态两栖流体双螺旋》",
      "《古老原矿：关于由 “{primaryLunch}” 在极度厌氧环境下所衍生的氧化青铜法则》",
      "《美索不达米亚的余温：有关 “{randomIng}” 对古典青铜雕塑重量的解构》",
      "《时序地质学：经历 {holdingDays} 天极干脱水的代谢雕像——“{randomIng}之叹”》"
    ]
  },
  {
    themeName: "relic_moss",
    templates: [
      "《废墟上的新绿：关于 {holdingDays} 日积压之 “{randomIng}” 的长满青苔的雕塑》",
      "《大地的隐喻：多日滞留所造就的 “{primaryDinner}” 砂岩质沉渣物理断层》",
      "《物种起源外的绿色神话：以 “{primaryLunch}” 为培养皿的大叶绿素结痂》",
      "《生命循环史诗：大热量饮食与生理重力极限拉扯 {holdingDays} 天后结成的沉默之山》"
    ]
  },
  {
    themeName: "petrified_fossil",
    templates: [
      "《古拉格碳元素：关于 “{primaryLunch}” 与 “{primaryDinner}” 经由 {holdingDays} 日地化作用的石化标本》",
      "《大肠地质纪年：憋拉 {holdingDays} 天的结石级生理和解》",
      "《寒武纪大爆发遗漏鳞片：以 “{randomIng}” 膳食微碳构效而出的硬化质标本》",
      "《被冻结的时间：宿主由 {holdingDays} 日宿命肠道挤制而出的沉寂玄武岩》"
    ]
  },
  {
    themeName: "volcanic_lava",
    templates: [
      "《肠腔深处的狂暴火山：由“{randomIng}”所触发的极温火色美学》",
      "《午夜的红油狂想曲：关于在消化壁内部发生的麻辣地幔流体力学实验》",
      "《巴蜀红油狂欢：红辣椒素结壳在 “{primaryLunch}” 底盘上的极限喷发》",
      "《沸腾熔岩之冠：“{primaryLunch}”与“{primaryDinner}”的狂热生理宣泄大作》"
    ]
  },
  {
    themeName: "lava_obelisk",
    templates: [
      "《熔岩方尖碑：由 “{randomIng}” 的重油辣椒多酚积淀而出的巨温几何丰碑》",
      "《辣度极点：狂沸川麻红油在宿主直肠中轴铸就的锐利尖碑》",
      "《火神在结肠深处的第 {holdingDays} 次呼喊：关于辣子鸡在消化管道留存的红火巨质》"
    ]
  },
  {
    themeName: "chili_horn",
    templates: [
      "《魔鬼椒之弯角：大火辣素与 “{primaryLunch}” 在高盐压强下挤出的恶魔牛角》",
      "《红色痉挛流线：有关巴蜀极其辛辣之食在年岁时令中凝出的弯角巨制》",
      "《赤色痛觉受体激活手稿：由 “{randomIng}” 激起的巴洛克辣椒弯卷角》"
    ]
  },
  {
    themeName: "toxic_slime",
    templates: [
      "《嗅觉反叛的黑色幽默：关于极其荒诞的 {primaryArtisticIng} 强发酵力学解构》",
      "《重度气体窒息美学：高挥发性“{randomIng}”所留存的绿色核酸侵蚀底稿》",
      "《生化泄露大作：大蒜与发酵酸笋合流后，大肠呈递给物理世界的辛辣答卷》",
      "《毒性沼泽的私密宣告：“{primaryLunch}”与“{primaryDinner}”在酸笋作用下的生化流体溢流》"
    ]
  },
  {
    themeName: "radioactive_waste",
    templates: [
      "《51区遗物：由 “{randomIng}” 等重度发酵硫醚在腹压下催生而出的太空放射物》",
      "《极臭核酸方程式：极高厌氧酸与 “{primaryLunch}” 重叠出的绿色核子悬浮舱》",
      "《切尔诺贝利的微光：有关酸笋、香菜与生化废弃物融合而出的电子废土外壳》"
    ]
  },
  {
    themeName: "octopus_sludge",
    templates: [
      "《深海克苏鲁的召唤：发酵 “{randomIng}” 浸渍于沥青黏土中长出的多触手恶兽》",
      "《重度粘性发酵叹息：由 “{primaryDinner}” 在肠壁高黏挤压而出的紫色纠缠体》",
      "《恶臭章鱼的诞生：有关重高嘌呤与大蒜硫醚在此瞬间极佳定位的流体反叛》"
    ]
  },
  {
    themeName: "french_bento",
    templates: [
      "《在巴黎的黄雨伞下：有关碳水化合物面包与“{randomIng}”在红酒浸渍下的卢浮宫姿态》",
      "《凡尔赛的面粉废墟：黄油、起司与大块“{primaryLunch}”的古典流线雕塑》",
      "《香榭丽舍的叹息：精制西餐在大肠边缘的优雅地质流线》"
    ]
  },
  {
    themeName: "croissant_glaze",
    templates: [
      "《起司熔岩可颂：奶酪与 “{randomIng}” 高聚多糖共同拉伸而出的法式叠酥层叠体》",
      "《香榭丽舍面包房的大黄大理石落叶：面包黄油分子在体内脱水膨胀的浪漫金焦》",
      "《法式高热焦糖黄沙拉叠酥：探究中产阶级日常卡路里之终极物理变样》"
    ]
  },
  {
    themeName: "japanese_tale",
    templates: [
      "《江户前浮世绘：由“{randomIng}”与碱水拉面所勾勒的幸运动物卷尾》",
      "《抹茶与刺身的哲学折叠：“{primaryLunch}”在经历肠壁挤压后的昭和风极简雕刻》",
      "《竹林深处的日和叹息：关于和风清淡食材在宿主腹部的禅意演化》"
    ]
  },
  {
    themeName: "boba_milkyway",
    templates: [
      "《珍珠波霸在黑糖黑曜之侧的星云沉落：探析 “{randomIng}” 糖浆对消化道的极奢灌溉》",
      "《奶与茶高反式脂肪构架的多孔软糯浮雕：有关 “{primaryLunch}” 的重油水合流线》",
      "《多巴胺高糖代谢晶球：木薯粉圆及高压萃取咖啡黑水在排池中的甜腻定影》"
    ]
  },
  {
    themeName: "cyber_sugar",
    templates: [
      "《多巴胺粉红蜜糖废墟：精制糖分与“{randomIng}”对宿主脑垂体的极奢反哺》",
      "《粉色乌托邦之碎：“{primaryLunch}”与高糖蛋糕结合的高温多聚糖巴洛克圆环》",
      "《甜腻生理遗迹：关于糖霜、奶茶与宿命代谢的多彩糖干预曲线》"
    ]
  },
  {
    themeName: "gothic_throne",
    templates: [
      "《可可碱哥特重工尖锤：由黑巧克力的硬脂酸在体内高压结晶而成的尖锐巨像》",
      "《暗夜君王在糖霜废土下的黑曜石祭坛：由 “{randomIng}” 激起的极重高压排池》",
      "《苦涩的宿命救赎：深度烘焙可可脂与 “{primaryDinner}” 在肠腹极冷冷缩后的暗黑之座》"
    ]
  },
  {
    themeName: "cyber_grid",
    templates: [
      "《高压咖啡因序列：由“{primaryBreakfast}”构效而出的数字游民终极代谢结晶》",
      "《深夜代码之灰：无奶黑美式与“{primaryDinner}”构筑的赛博流体物理方程》",
      "《可乐气碳多相多维方程式：可口可乐与泡面在大肠底盘处的科技投影》"
    ]
  },
  {
    themeName: "digital_matrix",
    templates: [
      "《黑客帝国的数字碳纤维矩阵：咖啡因及泡面中极高钠盐铸造的后工业齿轮》",
      "《码农的无眠极点：关于由深度烘焙黑美式与 “{randomIng}” 在宿体中轴的精细斜织斜纹》",
      "《24小时不打烊的数字车间：关于高压淬取奎宁酸在肠室进行精密物料重组之纪实》"
    ]
  },
  {
    themeName: "luxury_aurum",
    templates: [
      "《黑曜石之王在深海松露下的金箔祭祀：关于极致凡尔赛黑色的极致排泄仪式》",
      "《极奢地平线：牛排、鱼子酱与香槟酒的生物高贵熔炼古籍》",
      "《富贵逼人：当代上流餐食“{randomIng}”转化为卢浮宫黑色圆雕的极奢篇章》"
    ]
  },
  {
    themeName: "emperor_crown",
    templates: [
      "《凡尔赛帝王金缕玉冠：“{randomIng}” 经由宿主体内七百帕肠内压强在极奢金箔下熔出的皇家之作》",
      "《豪门盛宴的物理嬗变：鱼子酱、松露与神户和牛合流熔铸的金色冠顶》",
      "《无价的黄金排池手本：有关极其尊贵之食在大肠边缘达成的卢浮宫姿本》"
    ]
  },
  {
    themeName: "chinese_imperial",
    templates: [
      "《宫廷遗韵：由极品“{randomIng}”凝聚而出的紫禁城朱红琉璃》",
      "《满汉全席遗墨：“{primaryLunch}”在皇家肠道力学下完成的九转纯化艺术》",
      "《岁贡圣物：关于传统“{primaryDinner}”在腹压乾坤中所熔铸的江山瑞兽雕像》"
    ]
  },
  {
    themeName: "imperial_pagoda",
    templates: [
      "《雷峰佛塔在青花瓷泥下的重叠飞檐：经典红烧肉及 “{randomIng}” 所熔作的历史图卷》",
      "《九重紫禁城琉璃飞脊：精细小麦谷蛋白与 “{primaryLunch}” 在皇家肠室堆叠而出的重叠画壁》",
      "《岁贡青瓷圣塔：由传统锅包肉及饺子在年岁时令中所塑成的江南烟雨宝塔》"
    ]
  },
  {
    themeName: "cosmic_nebula",
    templates: [
      "《天体大爆炸残留：极深空“{randomIng}”穿透多元宇宙引力波的星云遗存》",
      "《事件视界的边缘：“{primaryLunch}”在黑洞奇点塌缩而出的电离辐射流线》",
      "《星象运转协奏曲：由“{primaryDinner}”跨越时空星系折叠而成的超弦多维几何》"
    ]
  },
  {
    themeName: "galaxy_nebula",
    templates: [
      "《仙女座大星云不饱和纠结物：有关由 “{randomIng}” 尘埃在太空中微子引力下扭出的无限莫比乌斯环》",
      "《深空星际尘埃的大气重组折变：可乐气碳及 “{primaryLunch}” 沉淀出的极深邃多酚星云轨迹》",
      "《引力波纠缠谱系：有关生命奇点爆胀之后星周尘埃的偶然一元凝体》"
    ]
  },
  {
    themeName: "phoenix_pyre",
    templates: [
      "《浴火涅槃的九转火神余烬：有关极温热燥辣椒素结壳在 “{randomIng}” 上刻写的凤凰毁灭底稿》",
      "《时空寂灭前的红巨星爆塌：由 “{primaryLunch}” 与 “{primaryDinner}” 在强腹压下结成的炭红熔岩碗》",
      "《宇宙热寂前夕的绝对余烬：关于宿主肠道瞬间极温电击生成的无序炭灰巨像》"
    ]
  },
  {
    themeName: "geological_stratum",
    templates: [
      "《板块重合的隆起：由史前“{randomIng}”经地幔高压风化的构造学硅酸盐岩石》",
      "《地化纪元沉积：“{primaryLunch}”化身冰川漂砾后的硬质矿物断层》",
      "《盖亚物料密友：关于“{primaryDinner}”与大自然熟粘土进行物理重组的无言碑记》"
    ]
  },
  {
    themeName: "amber_fossil",
    templates: [
      "《白垩纪树脂封存的 “{randomIng}” 时空琥珀大碑：在地下千米瞬时熟化的有机晶核》",
      "《被凝固的时光切片：有关史前砂岩及 “{primaryLunch}” 经由多日极度脱水形成的干枯透明柱》",
      "《盖亚深层藏金：探究由远古植物纤维在大火高热压力下炼出的琥珀地质沉积》"
    ]
  },
  {
    themeName: "herbal_tonic",
    templates: [
      "《本草本源互济：人参皂苷、枸杞多糖在肠道秘境内聚合成的元气大丹》",
      "《补虚泻实：关于“{randomIng}”与百草精华在丹田高热下熔铸的养生金丹》",
      "《温补地层：经历长白山元气熏蒸出的“{primaryLunch}”极度升华双螺旋》"
    ]
  },
  {
    themeName: "origami_crane_zen",
    templates: [
      "《千纸鹤在浮云暮雨间的禅意降落：有关天然草本茶碱及 “{randomIng}” 在宿体中达成的纯白角折叠》",
      "《侘寂之纸：生鲜大豆低筋面粉蛋白在大脑潜意识中轴被折成的白色飞禽》",
      "《大悲无言：茶多酚与 “{primaryDinner}” 过滤杂质后在大肠底端留下的极简一叶孤舟》"
    ]
  },
  {
    themeName: "healthy_chlorophyll",
    templates: [
      "《素食主义的绿色自律告白：高密度纤维素与“{randomIng}”在重力下的绿色纪念章》",
      "《叶绿体在粗粮中的巴洛克螺旋：“{primaryLunch}”及沙拉水合因子的简朴沉淀》",
      "《被净化之躯的简练物料：宿主关于无油水煮鸡胸肉与生菜的纯粹物理投影》"
    ]
  },
  {
    themeName: "emerald_pillar",
    templates: [
      "《帝王极品翡翠仙人掌柱：由生鲜叶绿素与无油水煮 “{randomIng}” 在胃内脱水重组的碧绿石柱》",
      "《翠鸟在森林深处的第一次生理啼鸣：有关 “{primaryLunch}” 多孔粗质在宿宿身体被玉化的全过程》",
      "《自律的极致翠绿色泽标本：由草本粗纤维大分子在宿主肠中轴被雕出的神圣立柱》"
    ]
  },
  {
    themeName: "sea_colloid",
    templates: [
      "《深海盐碱高钠嘌呤结晶之骑士跃迁：有关几丁质海鲜壳与 “{randomIng}” 熔铸的白盐水晶战马》",
      "《大西洋洋流沉降的野生深海鱼动能雕：金枪鱼Omega-3与 “{primaryLunch}” 在极高体内外高盐缓冲下的立构》",
      "《潮汐中的海浪水晶碑：关于螃蟹多糖壳在宿主体中达到的极硬半透折叠》"
    ]
  },
  {
    themeName: "pretzel_loop",
    templates: [
      "《巴伐利亚芝士蝴蝶结的物理拓扑：探究 “{randomIng}” 及不饱和植物油酸在大肠内的环扣重叠》",
      "《麦芽糊精在宿愿排池中织就的竹编网套：有关 “{primaryLunch}” 牛肉饼与芥末的折叠交缠》",
      "《美式快餐的高钠代谢方程式：马铃薯脱水脆化淀粉与芝士拉丝在重力中形成的经典回环》"
    ]
  },
  {
    themeName: "marmoreal_shrine",
    templates: [
      "《梅拉德褐变肌束大理石魔方：有关高温熏烤 “{randomIng}” 与骨髓磷脂结合的硬质立方棱》",
      "《战斧牛排的后现代墓碑：有关高饱和红肉肌纤维与 “{primaryLunch}” 在结肠高压挤干出的多面灰黑岩石》",
      "《烤肉焦香多肽流体方程式：碳化大米多糖在胃下盘构筑的立体大理石神庙》"
    ]
  }
];


// LOOSE_BLOCK_2_START:
interface TextureDiscussRow_OLD {
  textureType: string;
  discussionTemplate: string;
}

const TEXTURE_DISCUSSION_TABLE_OLD: TextureDiscussRow_OLD[] = [
  {
    textureType: "gilded_relic",
    discussionTemplate: "。极奢至极的【{primaryArtisticIng}】金箔镀层在其顶部凝聚，流线型的 {shapeName} 轮廓完全被灿烂夺目的土豪金遮蔽。这是对长达 {holdingDays} 天极限负重的一次充满庄严感的肉体表彰，堪称无价的赛博古董"
  },
  {
    textureType: "ancient_bronze",
    discussionTemplate: "。斑驳暗淡的【{primaryArtisticIng}】铜锈绿晶在其氧化表面如苔藓般侵染，古朴迷离。憋拉 {holdingDays} 日的时光结晶，让干枯坚固的胚体表面拥有一种美索不达米亚平原青铜圣器般的静谧，神圣而带有荒凉诗意"
  },
  {
    textureType: "relic_moss_stone",
    discussionTemplate: "。作品完美呈现出【{primaryArtisticIng}】颗粒石质感。由于经历了长达 {holdingDays} 天的厌氧洗礼，表面滋生出类似矿物绿霉与活性多肽黏丝的“微型生态绿原”。这是一种人造文明遗迹被自然森林缓慢吞噬的、极其凄美的极简生态神话"
  },
  {
    textureType: "petrified_fossil",
    discussionTemplate: "。坚固得如同高钙玄武岩一般的【{primaryArtisticIng}】岩壁上，凝结着粗砺的历史干裂纤维。这是过去 {holdingDays} 天在强腹压、低水合生理博弈下结出的“坚不可摧之舍利”，彰显出大肠蠕动机制对软弱有机基质的铁兽般规训"
  },
  {
    textureType: "volcanic_lava",
    discussionTemplate: "。狂暴的【{primaryArtisticIng}】通红岩浆沿着流线外壁缓缓渗流，极温辛香料中的油脂素与辣椒多酚在大气中几乎处于正在蒸腾的虚设气孔态。火红与焦黑的撞击，是宿主在享受极辣美食那一瞬间肾上腺素暴涨的、极具侵略性的身体快感自画像"
  },
  {
    textureType: "toxic_slime",
    discussionTemplate: "。泛着异样光泽的【{primaryArtisticIng}】有毒绿色黏膜正从外层断口处向四周发散出带有刺鼻大蒜、酸笋与香菜气孔的强侵蚀液滴，让人在距离十米开外即可对宿主的消化黑箱产生极度敬畏。这是关于快餐垃圾堆里生物发酵奇迹的一次极其朋克的无序抗议"
  },
  {
    textureType: "smooth",
    discussionTemplate: "。作品外部极为难得地表现出了白瓷般光滑的【{primaryArtisticIng}】丝滑流线。高贵圆润的面筋弹性多肽拉近了整件雕像的圣洁质感，极具巴洛克女性雕像的流线之美，消解了所有本源宿命物料的污浊印记"
  },
  {
    textureType: "grainy",
    discussionTemplate: "。质感扎实的【{primaryArtisticIng}】颗粒度与谷物麦麸的坚硬残屑完美糅合，带来一种类似于红土高原风化砂岩的质朴粗糙度。这是一次极速回归田园本质的、去修饰的身体诚实投影"
  },
  {
    textureType: "steaming",
    discussionTemplate: "。带有水汽余温 of 【{primaryArtisticIng}】液泡外壁散发着若有似无的淡淡气旋，暗示该作刚刚脱离主厨肠道三十秒的“崭新鲜活度”。雾霭笼罩的边缘轮廓，平添了一种朦胧而具有时效限定的哀伤美感"
  },
  {
    textureType: "glittery",
    discussionTemplate: "。闪耀着荧光粉色泡泡多酚的【{primaryArtisticIng}】多羟基糖结晶覆盖全身，在射灯下闪烁着诡异的多巴胺光芒。粉嫩与甜蜜包装之下的本质排泄，以赤裸裸又梦幻的视觉语言戏弄了现代工业消费社会对人体的粉饰"
  },
  {
    textureType: "cyber_grid",
    discussionTemplate: "。咖啡焦黑色泽凝聚而成的【{primaryArtisticIng}】碳粉质感完美契合了 {shapeName} 形态。其微小的几何多孔外壳下，封存着大量无奶冰美式中尚未重组的酸类，是数字时代码农、设计师生存现状的冰冷代谢图纸"
  },
  {
    textureType: "metallic_gold",
    discussionTemplate: "。黑曜石般焦黑的底座烘托着宛如璀璨夜星的【{primaryArtisticIng}】鎏金屑点，两种极高对比的明暗度直接颠覆了传统的垃圾废料认知。黑与金交织出的贵族气派，是消费主义精致晚宴大快朵颐之后的终极物理嬗变"
  },
  {
    textureType: "rainbow_metallic",
    discussionTemplate: "。奇迹般的、流动着量子阴阳极偏色干涉偏光光谱的【{primaryArtisticIng}】五彩极光反光涂层包裹着整尊胚体，流光溢彩，宛若事件视界外层的时空折变。这直接将排泄物的物理形态升华至恒星创生、星轨流变的宇宙超验高度，令人叹为观止"
  },
  {
    textureType: "crystalline",
    discussionTemplate: "。其主体呈现出一种神圣半透明的、温润如极地冰川晶体般的【{primaryArtisticIng}】微晶矿物结晶。淡雅又高贵的折光度透露出一丝凉爽、纯粹而不可侵犯的精炼自律，彻底挣脱了凡俗世俗饮食的所有烟火与油脂味"
  }
];


// 5. High-Concept Preposterous Title Template Matrix Table
interface TitleTemplateRow_OLD {
  themeName: string;
  templates: string[];
}

const TITLE_TEMPLATES_TABLE_OLD: TitleTemplateRow_OLD[] = [
  {
    themeName: "gilded_antique",
    templates: [
      "《时空折叠：历经 {holdingDays} 天憋附之“{randomIng}”黄金纪念碑》",
      "《高贵的惰性沉积物：由 {holdingDays} 日生理抗张力所重塑的 “{primaryBreakfast}” 史诗大典》",
      "《卢浮宫的遗物：大肠与意志力共同熔铸的 {holdingDays} 日物理断层》"
    ]
  },
  {
    themeName: "ancient_bronze",
    templates: [
      "《岁月的侵蚀：在宿主腹压下憋足 {holdingDays} 天的原生态两栖流体双螺旋》",
      "《古老原矿：关于由 “{primaryLunch}” 在极度厌氧环境下所衍生的氧化青铜法则》",
      "《时序地质学：经历 {holdingDays} 天极干脱水的代谢雕像——“{randomIng}之叹”》"
    ]
  },
  {
    themeName: "relic_moss",
    templates: [
      "《废墟上的新绿：关于 {holdingDays} 日积压之 “{randomIng}” 的长满青苔的雕塑》",
      "《大地的隐喻：多日滞留所造就的 “{primaryDinner}” 砂岩质沉渣物理断层》",
      "《生命循环史诗：大热量饮食与生理重力极限拉扯 {holdingDays} 天后结成的沉默之山》"
    ]
  },
  {
    themeName: "petrified_fossil",
    templates: [
      "《古拉格碳元素：关于 “{primaryLunch}” 与 “{primaryDinner}” 经由 {holdingDays} 日地化作用的石化标本》",
      "《大肠地质纪年：憋拉 {holdingDays} 天的结石级生理和解》",
      "《被冻结的时间：宿主由 {holdingDays} 日宿命肠道挤制而出的沉寂玄武岩》"
    ]
  },
  {
    themeName: "volcanic_lava",
    templates: [
      "《肠腔深处的狂暴火山：由“{randomIng}”所触发的极温火色美学》",
      "《午夜的红油狂想曲：关于在消化壁内部发生的麻辣地幔流体力学实验》",
      "《沸腾熔岩之冠：“{primaryLunch}”与“{primaryDinner}”的狂热生理宣泄大作》"
    ]
  },
  {
    themeName: "toxic_slime",
    templates: [
      "《嗅觉反叛的黑色幽默：关于极其荒诞的 {primaryArtisticIng} 强发酵力学解构》",
      "《重度气体窒息美学：高挥发性“{randomIng}”所留存的绿色核酸侵蚀底稿》",
      "《毒性沼泽的私密宣告：“{primaryLunch}”与“{primaryDinner}”在酸笋作用下的生化流体溢流》"
    ]
  },
  {
    themeName: "french_bento",
    templates: [
      "《在巴黎的黄雨伞下：有关碳水化合物面包与“{randomIng}”在红酒浸渍下的卢浮宫姿态》",
      "《凡尔赛的面粉废墟：黄油、起司与大块“{primaryLunch}”的古典流线雕塑》",
      "《香榭丽舍的叹息：精制西餐在大肠边缘的优雅地质流线》"
    ]
  },
  {
    themeName: "japanese_tale",
    templates: [
      "《江户前浮世绘：由“{randomIng}”与碱水拉面所勾勒的幸运动物卷尾》",
      "《抹茶与刺身的哲学折叠：“{primaryLunch}”在经历肠壁挤压后的昭和风极简雕刻》",
      "《竹林深处的日和叹息：关于和风清淡食材在宿主腹部的禅意演化》"
    ]
  },
  {
    themeName: "cyber_sugar",
    templates: [
      "《多巴胺粉红蜜糖废墟：精制糖分与“{randomIng}”对宿主脑垂体的极奢反哺》",
      "《粉色乌托邦之碎：“{primaryLunch}”与高糖蛋糕结合的高温多聚糖巴洛克圆环》",
      "《甜腻生理遗迹：关于糖霜、奶茶与宿命代谢的多彩糖干预曲线》"
    ]
  },
  {
    themeName: "cyber_grid",
    templates: [
      "《高压咖啡因序列：由“{primaryBreakfast}”构效而出的数字游民终极代谢结晶》",
      "《深夜代码之灰：无奶黑美式与“{primaryDinner}”构筑的赛博流体物理方程》",
      "《可乐气碳多相多维方程式：可口可乐与泡面在大肠底盘处的科技投影》"
    ]
  },
  {
    themeName: "luxury_aurum",
    templates: [
      "《黑曜石之王在深海松露下的金箔祭祀：关于极致凡尔赛黑色的极致排泄仪式》",
      "《极奢地平线：牛排、鱼子酱与香槟酒的生物高贵熔炼古籍》",
      "《富贵逼人：当代上流餐食“{randomIng}”转化为卢浮宫黑色圆雕的极奢篇章》"
    ]
  },
  {
    themeName: "chinese_imperial",
    templates: [
      "《宫廷遗韵：由极品“{randomIng}”凝聚而出的紫禁城朱红琉璃》",
      "《满汉全席遗墨：“${primaryLunch}”在皇家肠道力学下完成的九转纯化艺术》",
      "《岁贡圣物：关于传统“{primaryDinner}”在腹压乾坤中所熔铸的江山瑞兽雕像》"
    ]
  },
  {
    themeName: "cosmic_nebula",
    templates: [
      "《天体大爆炸残留：极深空“{randomIng}”穿透多元宇宙引力波的星云遗存》",
      "《事件视界的边缘：“{primaryLunch}”在黑洞奇点塌缩而出的电离辐射流线》",
      "《星象运转协奏曲：由“{primaryDinner}”跨越时空星系折叠而成的超弦多维几何》"
    ]
  },
  {
    themeName: "geological_stratum",
    templates: [
      "《板块重合的隆起：由史前“{randomIng}”经地幔高压风化的构造学硅酸盐岩石》",
      "《地化纪元沉积：“{primaryLunch}”化身冰川漂砾后的硬质矿物断层》",
      "《盖亚物料密友：关于“{primaryDinner}”与大自然熟粘土进行物理重组的无言碑记》"
    ]
  },
  {
    themeName: "herbal_tonic",
    templates: [
      "《本草本源互济：人参皂苷、枸杞多糖在肠道秘境内聚合成的元气大丹》",
      "《补虚泻实：关于“{randomIng}”与百草精华在丹田高热下熔铸的养生金丹》",
      "《温补地层：经历长白山元气熏蒸出的“{primaryLunch}”极度升华双螺旋》"
    ]
  },
  {
    themeName: "mathematical_sequence",
    templates: [
      "《斐波那契的完美对称：关于第 “{randomIng}” 号高维数学排泄常量的物理几何》",
      "《量子极对称数列：将 “{primaryLunch}” 与 “{primaryDinner}” 按数论常数极度挤压所得出的拓扑双螺旋》",
      "《原初数元和解：在 {holdingDays} 天内按纯净质数律动构效而成的无限循环公式》"
    ]
  },
  {
    themeName: "healthy_chlorophyll",
    templates: [
      "《素食主义的绿色自律告白：高密度纤维素与“{randomIng}”在重力下的绿色纪念章》",
      "《叶绿体在粗粮中的巴洛克螺旋：“{primaryLunch}”及沙拉水合因子的简朴沉淀》",
      "《被净化之躯的简练物料：宿主关于无油水煮鸡胸肉与生菜的纯粹物理投影》"
    ]
  }
];


// 6. Curatorial Modern Art Critique Essay Templates Table
export interface CuratorEssayRow {
  index: number;
  genre: string;
  template: string;
}

export const CURATOR_ESSAY_TABLE: CuratorEssayRow[] = [
  {
    index: 1,
    genre: "存在主义荒诞派",
    template: "主厨艺术家“{artistName}”在此刻向大众展示了一场荒诞的凡俗生命仪式。该雕塑以特异的 {shapeChinese} 拓扑结构矗立，它不仅是一次关于物料挤压的时间定格，更是将今日早膳之“{primaryBreakfast}”与午膳之“{primaryLunch}”所富集的动能彻底结疤{ingestionTimelineDescription}其体躯经受了{currentTextureDiscuss}，恰在{seasonChinese}的微澜时令与{timeChinese}的静美交错时分诞生，由此糅合了华丽的{currentHybridDescription}。这绝非简单的有机过客，而是一个对抗时光虚无、在消化尽头高歌的存在主义幽灵。"
  },
  {
    index: 2,
    genre: "古典浪漫巴洛克",
    template: "这非偶然遗留，而是古典浪漫主义精神在大肠内腔里的瑰丽苏醒！在艺术家“{artistName}”的精湛指挥下，{shapeChinese} 完美再现了古典大师雕像中的那种神圣重力{ingestionTimelineDescription}其富丽堂皇的{currentTextureDiscuss}，将质朴琐碎的“{primaryLunch}”骤然升华至无可攀登的殿堂高度。正值{seasonChinese}的气候轮回与{timeChinese}的梦幻晕染，其外层凝聚的{currentHybridDescription}宛如梦中的微光，以巴洛克式的奢美弧度，无情嘲弄了中产阶级日常生活的干瘪与虚假。"
  },
  {
    index: 3,
    genre: "解构主义材料学",
    template: "这是一曲关于高分子有机转变、结肠流变学与宏观重力力学的去中心化协奏。“{artistName}”利用“{primaryBreakfast}”与“{primaryLunch}”作为起始物，历经极度的生理压力与肠道博弈，铸就了此尊极富力学张力的 {shapeChinese} 胚体{ingestionTimelineDescription}尤为引人瞩目的是其{currentTextureDiscuss}。受{seasonChinese}环境冷缩与{timeChinese}湿度变化的联合作用，表皮结晶而出的{currentHybridDescription}展示了一副无机自组装的微型物理景观，完美解构了“日常废弃”与“崇高媒介”之间的二元隔阂。"
  },
  {
    index: 4,
    genre: "赛博朋克后人类叙事",
    template: "在电子荒原与高频脑机荷尔蒙的末世对峙中，主厨“{artistName}”将大肠改造为温暖、潮湿而诚实的血肉3D打印机。本尊具备科幻感的 {shapeChinese} 阵列{ingestionTimelineDescription}其紧实的中枢完好保存了由“{primaryLunch}”所激发的焦油电能。表侧附着的{currentTextureDiscuss}呈现出了高压电路板的粗砺与焦灼。适逢{seasonChinese}季节交换与{timeChinese}的时空侵入，外在增殖出的{currentHybridDescription}犹如芯片上的精密保护膜层，以极冷傲的姿态，披露了后人类时代消费主义宿命的代谢底稿。"
  },
  {
    index: 5,
    genre: "东方禅意侘寂派",
    template: "一花一世界，一草一禅机。主厨艺术家“{artistName}”以这尊超脱世俗的 {shapeChinese} 遗墨，将侘寂（Wabi-Sabi）哲学推向了无可言喻的隐秘妙境。今日的“{primaryBreakfast}”与往昔的梦呓在此尘埃落定{ingestionTimelineDescription}抚摸其{currentTextureDiscuss}，在{seasonChinese}的落寞岁华与{timeChinese}的空灵转折之中，作品无比偶然地孕育出了那层{currentHybridDescription}。策展委员会建议观众静立、合十：它用最谦逊、最诚实的生态物理语言，引导我们观照内心深处的生命微澜。"
  },
  {
    index: 6,
    genre: "宿命论地表地质谱系",
    template: "艺术家“{artistName}”在此展现的并非是一时宣泄，而是一部具有地质学纪年重量的、极为私密的生命断层史诗。承接了整整 {holdingDays} 天的时光孕育，这尊 {shapeChinese} 特色形态成为承载并抵御遗忘的物料质地纪念章{ingestionTimelineDescription}表体上流淌着饱含地质结核美感的{currentTextureDiscuss}。在{seasonChinese}的时序洗礼与{timeChinese}的静谧折射下，其独一无二的{currentHybridDescription}具有了出土文物的厚重尊严，彻底撞碎了当代消费社会的快闪滤镜。"
  },
  {
    index: 7,
    genre: "达达主义生物讽刺",
    template: "呸！去他的神圣艺术殿堂，去他的优雅致敬日常！主厨艺术家“{artistName}”以这尊高耸、带有戏谑盘旋的 {shapeChinese} 特色艺术，把中产阶级的审美假面撕了个粉碎！这是由“{primaryBreakfast}”与“{primaryLunch}”共同主演的一幕重力戏剧{ingestionTimelineDescription}其任性而张扬的{currentTextureDiscuss}，恰在{seasonChinese}与{timeChinese}的冷酷注视下，极其骄傲地催生了{currentHybridDescription}。这是一出无可替代的、极度朋克的达达主义身体反叛，强迫我们直面那些在喧嚣文明中被极力掩饰的代谢宿命。"
  },
  {
    index: 8,
    genre: "宇宙神秘能量学",
    template: "这件作品正神秘地呼应着银河系暗物质流的物理潮汐！“{artistName}”用这尊具有庞大吸附力的 {shapeChinese} 宇宙拓扑，架设起了一座联通肠道微宇宙与宏伟天体相位的量子桥梁{ingestionTimelineDescription}今日“{primaryLunch}”中蕴藏的一丝热能在大肠终点爆发，塑造成具有星际凝聚张力的{currentTextureDiscuss}。由于诞生于{seasonChinese}的时空奇点与{timeChinese}的深空节点上，其散发的{currentHybridDescription}如同宇宙背景微光，令人对未知的生命本源肃然起敬。"
  },
  {
    index: 9,
    genre: "深层潜意识弗洛伊德派",
    template: "作为宿主深层潜意识在生活边缘的惊恐狂飙，“{artistName}”在此刻成功完成了一次极具解脱美学的自我抚慰。这尊 {shapeChinese} 构型无声倾吐着控制与释放、占有与离去的激烈精神拉扯{ingestionTimelineDescription}“{primaryBreakfast}”的注入正是本能能量最初的纠缠之因。而其{currentTextureDiscuss}在{seasonChinese}与{timeChinese}的昏黄交织中，以冷酷的{currentHybridDescription}揭示了被包装在文明衣装下的纯粹本我，是一曲震撼心灵的潜意识赞歌。"
  },
  {
    index: 10,
    genre: "后消费时代环境批判",
    template: "在物欲纵横、万物皆可消费并遗弃的宏大工业废墟中，主厨“{artistName}”用这桩具有纪念碑式沉重感的 {shapeChinese} 遗骸，拉响了时代的生物质警报。它将“{primaryBreakfast}”与“{primaryLunch}”等现代大生产的消费残留，提炼为恒星般的生命切片{ingestionTimelineDescription}触目惊心的{currentTextureDiscuss}，在{seasonChinese}岁序与{timeChinese}晨昏交织的紧迫感下，激发出极富启示录意味的{currentHybridDescription}。它逼迫观众直面这震撼的一幕，发起最刺耳的环境哲学质询。"
  },
  {
    index: 11,
    genre: "表现主义肉身体验",
    template: "这是一场在湿润肠腔深处发生并战栗的、精神与内脏极限救赎的视觉投影！艺术家“{artistName}”在极意雕塑厚度之 {shapeChinese} 形态中，记录下了由“{primaryLunch}”和“{primaryDinner}”所引发的、几乎痉挛的内脏大回旋{ingestionTimelineDescription}气势汹汹的{currentTextureDiscuss}，在{seasonChinese}的万物生长与{timeChinese}的幽暗转换中，融合生出了流淌着的{currentHybridDescription}，这是一篇令人眩晕、却又无可辩驳的、极具力量的肉身体验赞歌。"
  },
  {
    index: 12,
    genre: "极速前卫速度主义",
    template: "机器在深处咆哮，大肠在瞬间超频！主厨“{artistName}”用极速前卫的 {shapeChinese} 动能几何，完美捕获了新陈代谢在穿过生命重力前那一毫秒的电光速度{ingestionTimelineDescription}几乎未作任何温吞发酵或胆怯陈化，“{primaryBreakfast}”瞬间化作了极具刚性曲度的{currentTextureDiscuss}。在{seasonChinese}与{timeChinese}的极致碰撞之下，外部凝聚的{currentHybridDescription}闪耀着高效率和现代工业的傲岸光华，宣照了对温含旧态的彻底宣战。"
  }
];


// Helpers to query variables in tables
export function queryIngredientSynonyms(ingredient: string): string[] | undefined {
  const matchedRow = INGREDIENT_ART_VOCAB_TABLE.find(row => 
    ingredient.includes(row.key) || row.key.includes(ingredient)
  );
  return matchedRow?.synonyms;
}

export function queryThemeConfig(textLower: string): DietThemeRow | undefined {
  const matches = DIET_THEMES_TABLE.filter(row => 
    row.triggers.some(trigger => textLower.includes(trigger))
  );
  if (matches.length > 0) {
    return matches[Math.floor(Math.random() * matches.length)];
  }
  return undefined;
}

export function queryHybridTexture(season: string, timeOfDay: string): HybridTextureRow | undefined {
  return SEASON_TIME_HYBRID_TABLE.find(row => 
    row.seasonKey === season && row.timeKey === timeOfDay
  );
}

export function queryTextureDiscuss(textureType: string): string | undefined {
  return TEXTURE_DISCUSSION_TABLE.find(row => row.textureType === textureType)?.discussionTemplate;
}

export function queryTitleTemplates(themeName: string): string[] | undefined {
  return TITLE_TEMPLATES_TABLE.find(row => row.themeName === themeName)?.templates;
}
