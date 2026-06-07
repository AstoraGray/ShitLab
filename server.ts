import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// List of standard artistic chemical/scientific synonyms for food words
const INGREDIENT_ARTISTIC_MAP: { [key: string]: string[] } = {
  "火锅": ["高烈度沸腾红油", "高压浸渍辣椒素", "牛脂饱和重油组分", "四川盆地超临界重油混悬液", "川渝高密度川麻焦油"],
  "麻辣烫": ["高烈度花椒挥发油", "浸渍高温红油重脂固形物", "多相辛香多酚悬浮组分", "东北流派骨汤乳化牛脂", "热交换黏稠高盐聚合物"],
  "冒菜": ["蜀地无明火浸解重油多酚", "高浓度辣椒素水脂混合乳", "辛热脂肪酸聚集大分子", "川西重味微流体沉淀物"],
  "串串": ["竹签传导压热可溶性肌纤维", "高辣盐度热力红油浸膏", "超饱和辛香挥发油复合体"],
  "辣": ["高温辣椒素结晶", "蜀地辛香辣椒多酚", "热燥油脂底层沉积", "分子级别辣椒素游离配体", "高爆发性痛觉受体激活源"],
  "川": ["巴蜀复兴香料复合物", "高浓度辣味多肽", "川西重油浸膏", "天府高烈度香辛油"],
  "湘": ["湘江重辣催化因子", "高挥发性辛香酚", "极干热辣聚合物", "辛辣脱水双氧胞嘧啶"],
  "麻": ["麻醇花椒挥发油", "生理性酥麻配体", "高敏感觉受体激活素", "花椒麻素神经毒性轻刺激微粒", "高频机械振荡感脂质"],
  "螺蛳": ["古法发酵酸笋厌氧酸", "高度发酵石螺聚合物", "高浓度腐植酸", "柳州标志性高度发酵甲酚", "极臭还原性风味大分子硫醚"],
  "臭豆腐": ["黑豆厌氧发酵蛋白胶", "高位硫化氢载体", "刺激性臭黑物", "硫酸亚铁诱导黑氧化铁结壳", "极度重度氨基酸降解质"],
  "榴莲": ["高糖分丁酸乙酯凝胶", "硫醇性挥发芳香微粒", "粘稠乳浊酯质", "高危热量三甘醇果糖聚合体"],
  "香菜": ["辛叶醛芳香精油", "植物基因对立芳香因子", "微量碱性绿叶素", "十醛不饱和挥发芳烃"],
  "大蒜": ["大蒜素高挥发有机硫", "极强杀菌二烯丙基硫", "原始刺激性辣素", "高还原度硫代亚磺酸酯"],
  "韭菜": ["纤维素挥发硫醚", "热性胃催化草本纤维", "多孔多孔膳食分子", "重度甲基二硫化物"],
  "烤鸭": ["北京香烤脂肪酸", "高纯度果木烘烤焦糖化表皮组分", "鸭皮不饱和长链多脂胶", "烤挂炉高温热解皮下脂肪流动体", "甜面酱高黏度多糖焦糖化聚合物"],
  "锅包肉": ["精制糖醋梅拉德结晶壳", "高比例短链糊化多糖", "酸甜度缓冲油炸白质复合体", "高硬度脱水木薯淀粉脆化包壳"],
  "红烧肉": ["高饱和度均质化凝结皮脂胶", "纯化蔗糖低温糖色还原体", "东坡流派多相脂肪分子", "微火焖制饱和慢速水解胶原蛋白"],
  "小笼包": ["超饱和高渗肉汁白质水合溶液", "发酵中筋小麦多糖膜", "高浓度肉皮冻明胶还原多肽", "江浙精细中筋多糖拉伸骨架"],
  "饺子": ["手工白面面筋拉伸多肽封套", "多相混合肉浆高聚物", "多糖水合包裹体", "手工高水合麦谷蛋白网膜"],
  "馄饨": ["薄化小麦面筋蛋白微透封装", "鲜味游离多肽悬浮液", "碱性麦谷蛋白包裹颗粒", "猪肉肌纤维高频率捶打碎浆膜"],
  "抄手": ["高烈度红油浸渍水合淀粉体", "巴蜀蒜香挥发有机硫复合体", "多相鲜肉组织高固高聚物", "重油包裹高密度多肽馄饨"],
  "宫保鸡丁": ["醋糖比缓冲梅拉德变性鸡胸多肽", "花生不饱和油酸结晶", "高浓度川香辣椒多微粒", "煳辣荔枝口多相调和浸出物"],
  "辣子鸡": ["高饱和油炸脱水肌原白质", "高频度辣椒素脱水晶体", "高干度香气复合颗粒", "歌乐山超高干度焦脆肌肉多肽"],
  "麻婆豆腐": ["高温高油均质凝结熟石膏白质", "麻醇花椒油多相包被", "牛肉糜高焦梅拉德反应物", "高黏度芡汁多糖包裹体"],
  "炒饭": ["高硬度颗粒化脱水大米多糖", "游离多相非水合脂包膜", "高温锅气碳化微粒", "黄金美拉德反应多孔米粒结构"],
  "炒河粉": ["高度糊化片状支链淀粉胶", "高温老抽焦糖化吸附体", "高浓度牛脂挥发精油", "广式特高温排骨美拉德反应物"],
  "佛跳墙": ["极奢动物黏多糖高浓度胶原", "海洋深底几丁质多肽缓释液", "多相珍奇氨基酸微粒悬浮", "超长时空高盐高蛋白均质胶体"],
  "奶茶": ["高度乳化反式/顺式脂肪乳浊液", "合成多羟基多咖啡因化合物", "高浓度果糖基木薯多糖胶圆", "高果糖高甜高多巴胺乳凝膏"],
  "咖啡": ["高压淬取活性咖啡因", "深度微分子烘焙焦糖", "有机绿原酸复合物", "高浓度咖啡酰奎宁酸聚合物"],
  "美式": ["零糖高压萃取咖啡黑水", "无奶稀释焦油微粒", "酸质咖啡因聚合液", "绝对焦苦高浓度不饱和黑水层"],
  "拿铁": ["乳固形酪蛋白脂肪悬浮", "咖啡单宁酸多酚", "双重多相乳浊液", "高压蒸汽蒸汽水合牛奶脂肪网格"],
  "茶": ["高抗氧化茶单宁", "高分子茶多酚", "儿茶素芳香微元", "植物天然小分子茶碱单体"],
  "红茶": ["全发酵红茶多酚", "焦糖香芳香大分子", "单宁酸沉淀物", "高聚合红茶色素分子"],
  "乌龙": ["半发酵乌龙茶多酚", "高山茶碱结晶", "幽香脂类复合物", "铁观音高山碳焙芳烃结合物"],
  "可乐": ["碳酸高压饱和溶液", "高富集焦糖色素", "游离正磷酸胶体", "高浓度磷酸酸化游离极性溶液"],
  "雪碧": ["碳酸饱和含柠檬酸液", "极高果糖糖浆结晶", "柑橘香轻质挥发油"],
  "汽水": ["重碳酸根释出气体微粒", "柠檬酸多相缓冲液", "果聚糖悬浮溶液"],
  "汉堡": ["高淀粉多糖麦麸骨架", "动物源饱和脂肪酸", "速食梅拉德反应物", "高能量饱和美式牛肉碎脂"],
  "薯条": ["高温脱水脆化淀粉", "高沸点棕榈油脂吸附体", "马铃薯淀粉结构", "比利时流派双重油温脱水淀粉晶"],
  "批萨": ["拉丝高分子酪蛋白", "番茄多酚微酸性底质", "重叠油脂乳浊体", "高饱和意大利干酪高分子网络"],
  "芝士": ["凝聚高浓度酪蛋白脂肪", "乳胶干酪微孔构型", "醇厚香气游离单体", "高度拉丝熟化酪蛋白硬脂"],
  "奶酪": ["乳酸菌发酵胶体酪蛋白", "天然钙脂螯合物", "高粘悬浮粒子"],
  "牛奶": ["多相水包油乳固形脂肪", "活性乳清白质键", "含钙胶体微球"],
  "海鲜": ["深海不饱和几丁质聚糖", "高风味牛磺酸沉积", "海洋微量矿物结晶", "深海盐度多氨基酸混合缩合体"],
  "螃蟹": ["高浓度几丁壳多糖", "游离嘌呤核苷酸胶体", "不饱和脂肪微结构"],
  "虾": ["虾红素抗氧化红色微粒", "肌浆高还原性嘌呤", "高分子甲壳胺", "极高纯度野生不饱和肌球纤维", "高分子甲壳胺几丁质胞衣", "肌浆高还原性嘌呤聚合物"],
  "鱼": ["不饱和Omega-3脂肪酸", "高活性肌动蛋白多肽", "海洋微量硒盐固体", "淡水高嘌呤饱和肌纤维结构", "深海不饱和Omega-3单不饱和键", "变性多肽水相鱼肌浆蛋白", "海洋微量矿物结晶多酚"],
  "生鱼": ["未变性低温鲜甜肌浆蛋白", "天然多不饱和低聚脂", "冷链活性氨基酸菌落", "深海超低温未凝固三甘油脂膜"],
  "寿司": ["醋调和水合白淀粉胶", "多孔海苔高纤维微粒", "风味氨基酸粘着体", "轻度发酵米醋浸渍支链淀粉"],
  "拉面": ["高筋碱水面筋拉伸多肽", "高盐豚骨悬浮多相脂", "重叠膳食碳水胶", "乳白色重油高骨钙均质乳浊液"],
  "天妇罗": ["极松脆油炸脱水淀粉薄壳", "微孔化顺式脂肪包覆体", "海鲜/植物多水分生鲜胶", "高纯度轻质天妇罗精面糊脆微晶"],
  "鳗鱼": ["高丰度不饱和多不饱和油酸", "浓郁蒲烧酱汁果糖糖色结晶", "极富油脂红肉纤维聚合体", "高能量多不饱和软骨结合构型"],
  "刺身": ["极度冷链维持超鲜红肌球多肽", "高敏不饱和鱼油游离悬浮物", "低温活性深海蛋白晶体", "金枪鱼多不饱和暗红肌球素"],
  "部队锅": ["高浓度淀粉高水合辛辣泡菜液", "高度压缩午餐肉饱和脂肪多肽", "脱水复生合成干酪素", "廉价饱腹级反式脂肪及高钠多相乳浊液"],
  "拌饭": ["韩式辣椒酱高黏度聚合单糖", "流质受热变性荷合蛋黄多脂", "多孔多纤维水合山野菜", "石锅过热接触碳化大米坚硬结壳"],
  "洋葱": ["高挥发性二烯丙基二硫有机硫", "低聚果糖焦糖化风味大分子", "多水分纤维素外壳"],
  "意面": ["高精级杜兰杜林高筋面筋白质", "番茄红素低pH缓冲有机酸", "冷榨橄榄油不饱和油酸聚合体", "高密度坚硬角质面筋聚合物"],
  "热狗": ["熟化碎肉乳化合成脂肪管", "精制小麦多糖多孔骨架", "芥末单宁高酸解挥发油"],
  "啤酒": ["发酵麦芽酚有机大麦多糖", "重碳酸根释出活性微气泡", "啤酒花黄酮活性多酚"],
  "米线": ["高干榨支链淀粉水合胶体棒", "高盐豚骨均质乳化汤质", "多孔多膳食纤维浮游颗粒", "重度压滤水合多糖胶体柱"],
  "热干面": ["高浓度碱水小麦硬质多肽", "高稠度研磨脱水芝麻木脂素", "香油高度不饱和油酸网囊", "高压熟制脱水涂油碱性面条骨干"],
  "煎饼": ["高度脱水杂粮均质脆壳", "高糖甜面酱多糖粘着质", "油炸排叉高脆顺式脂肪晶", "绿豆小米高活性低筋多孔膳食薄膜"],
  "火腿": ["古法盐渍高钠脱水肌球蛋白", "陈酿均质不饱和风味脂肪酸", "高硬度结晶微量硝酸盐", "三年陈酿重度饱和盐干酪多肽"],
  "排骨": ["高温脱水焦香梅拉德骨胶原", "骨髓磷脂富集饱和脂肪", "红肉高收缩性蛋白多肽", "猪骨软骨素及游离硬脂酸聚合体"],
  "小龙虾": ["高浓度几丁质麻辣油包衣", "鳃腺浓集脂溶性微量元素", "精细肌球蛋白高紧实纤维", "高浓度虾黄重度卵磷脂结核物"],
  "方便面": ["高度棕榈油炸波状碳水多糖", "超饱和谷氨酸钠脱水颗粒", "高度干制酱包反式脂肪聚合物", "高钠防腐剂脱水凝胶晶体"],
  "甜甜圈": ["高度油炸糖霜多肽", "精制高糖分多巴胺聚合物", "双重反式脂肪构型"],
  "蛋糕": ["高度发泡麦蛋白气孔", "高度精炼植脂牛油", "高浓度精制蔗糖结晶"],
  "草莓": ["天然花青素红色颗粒", "多羟基挥发果酸单体", "高度水合单糖胚胎"],
  "巧克力": ["可可脂高度结晶多型体", "高纯度可可碱单体", "单宁酸多羟基多酚", "极奢黑可可游离异构单体"],
  "牛排": ["梅拉德反应褐变焦香多肽", "高温热缩化红肉纤维", "饱和脂肪酸网状凝胶", "战斧极奢肌肉多肽与高级牛髓甘油酯"],
  "烤肉": ["高度热解梅拉德反应炭", "挥发性油脂熏烤酚", "高度压缩脂肪聚合物"],
  "炸鸡": ["高温脱水脆皮淀粉包壳", "饱和反式油脂吸收体", "禽肉纤维游离多胺", "脆皮炸衣高压吸附牛油复合物"],
  "沙拉": ["水合生鲜蔬菜叶绿素", "多孔膳食纤维空间网", "微酸醋酸缓冲涂层"],
  "轻食": ["低卡高活性膳食质组分", "压缩水合植物纤维", "慢消化复合微糖"],
  "健身": ["高纯度重组乳清分离蛋白", "速效极低脂肪多肽复合体", "高纯支链氨基酸BCAA"],
  "鸡胸": ["高密度极简肌纤维白质", "极低脂肪高蛋白结壳", "重组热缩肌浆组分"],
  "咖喱": ["姜黄素高染色性植物固醇", "多元辛香植物微粒悬浮", "厚重风味小茴香多酚"],
  "松露": ["极奢非凡块菌特殊芳香烃", "天然高附生物活性萜类", "凡尔赛古典黑土气味源"],
  "鹅肝": ["凡尔赛极致高饱和胆固醇", "丝滑黄油态均质脂质", "极高纯度动物油脂凝胶"],
  "鱼子酱": ["深海鲟鱼子高盐肽硬脂", "高密度不饱和鱼脂单体", "奢华球形半透膜包裹"],
  "泡菜": ["乳酸菌天然发酵多羟基酸", "乳酸发酵发酵多肽结晶", "鲜红色低pH辣椒胶体"],
  "年糕": ["高度黏稠水合支链淀粉胶", "多糖聚合胶状物", "微量脱水碳水构架"],
  "人参": ["元气大分子人参皂苷单体", "古老草本滋补多糖晶", "微量苦苷有机配体"],
  "枸杞": ["抗氧化高活性枸杞多酚", "天然红萝卜素有机晶", "补肾多糖草本衍生物"],
  "空腹": ["空气二氧化碳微分子", "极轻量微量消化液", "空无虚无零分子度"],

  // 宇宙、地球、石、土 概念组
  "宇宙": ["无限膨胀多元宇宙热寂残留物", "太空中微子穿透性宇宙微尘", "星云级高密度电离气态多肽"],
  "地球": ["盖亚地幔超高压变质长石", "地球生物圈有机碳基骨架", "地壳浅层多温水合硅酸盐"],
  "沙石": ["高密沉积碎屑岩骨架", "硅酸铝微米级微矿质", "地表物理风化晶核"],
  "结石": ["结石级生理重压硅酸钙结晶", "超高压病理性有机钙核"],
  "石头": ["坚固高钙结核玄武岩", "结石级生理重压硅酸钙结晶", "史前沉积碎屑砂岩骨架"],
  "沙土": ["高黏度硅酸铝熟黏土胶体", "古老厌氧富有机质黑土颗粒"],
  "土壤": ["高黏度硅酸铝熟黏土胶体", "土壤高腐殖质活性多酚", "地表富氧无机微量矿物结晶"],
  "山脉": ["褶皱山脉高重力积压沉积岩", "板块碰撞地表隆起物理断层"],
  "混沌": ["宇宙奇点爆胀前无序混合溶液", "高难度卡奥斯耗散多相胶体", "多重纠缠量子叠加态代谢物"],
  "微尘": ["高悬浮气溶胶超微颗粒物", "亚微米级水不溶性二氧化硅", "肺泡级极细碳化变性多肽"],
  "黑洞": ["重力无限大绝对吸收暗物质体", "事件视界多维度折叠奇点结块", "霍金辐射极微量蒸发多肽"],
  "奇点": ["绝对零体积高热能物理原点", "大爆炸前一元化超对称流体", "时空无限弯曲的生理挤压极点"],
  "古老": ["史前奥陶纪地层深埋琥珀", "古法暗室密闭发酵挥发酚", "中生代恐龙骨骼高钙化遗存"],

  // 1-10 数字 (降序排序以最精确匹配双位数，后跟个位数)
  "10": ["十级烈度极沸重油焦糖还原体", "十方俱灭虚无碳化分子群"],
  "1": ["单一宇宙初始奇点能量", "原初单晶态微量元素", "孤立一元活性细胞核心"],
  "2": ["二元对称水合极性分子", "阴阳双极性高压电荷载体", "双重多相乳浊交互体"],
  "3": ["三流派调和饱腹高分子", "三基色偏振高饱和光斑", "三叶草天然多酚衍生物"],
  "4": ["四维时空扭曲晶格基座", "四象限生理极限负荷阻尼", "四重对称结晶多肽网膜"],
  "5": ["五行相生植物多聚糖复合体", "五味调和超极极限风味因子", "五维超弦共振流体微粒"],
  "6": ["六角对称雪花冰晶滑移面", "六重饱和环状烃类大分子", "六面体微晶熟石膏胶体"],
  "7": ["七彩虹光偏振矿物亮片", "七天蓄力超级压坚硬核", "七星北斗时空流体断层"],
  "8": ["八卦和谐多相分子共振体", "八重对称几丁质外骨骼膜", "八百帕高压结肠均质凝聚态"],
  "9": ["九维超弦折叠虚空维度", "九转重制纯化深渊精粹物", "九极度辛辣痛觉释放体"],
  "十": ["十级烈度极沸重油焦糖还原体", "十方俱灭极度脱水碳化层"],
  "一": ["原初一元态极简水合微滴", "独立极性碳链骨架", "单一频率强共振多肽"],
  "二": ["双生伴随流体粒子", "二价电荷对称阳离子螯合体"],
  "三": ["三元相图熔融交界物", "三磷酸腺苷基本储能体"],
  "四": ["四方向电偶极子张量层", "四元交叉互穿网络聚糖"],
  "五": ["五常守序温和水合颗粒", "五瓣梅花状对称胶束基团"],
  "六": ["六角蜂窝炭不饱和石墨烯网", "六元杂环高稳定芳香多肽"],
  "七": ["七级酸碱度中性水合缓冲物", "七色彩虹衍射干涉多相涂层"],
  "八": ["八隅体稳定核外电子排布层", "八重道演化中性流体微粒"],
  "九": ["九品至臻纯化生理沉积物", "九死一生极限憋压硬核残体"],

  // 基础兜底汉字 (放置于最底部，确保更长的词项先匹配)
  "牛": ["高饱和度草饲牛脂硬脂酸", "战斧极奢肌肉多肽分子", "牛骨髓磷脂富集饱和脂肪"],
  "猪": ["白羽猪皮下水解胶原蛋白胶", "高能量饱和猪油乳化微粒", "肌纤维捶打高弹高抗张聚合物"],
  "羊": ["风味特异性葵酸/辛酸脂肪分子", "塞外高寒牧草纤维代谢体", "热性胃催化不饱和羊脂"],
  "鸡": ["原味禽类游离风味多核苷酸", "脱水极简肌纤白质多肽", "极高纯度野生不饱和肌球纤维"],
  "鸭": ["不饱和长链鸭油极低凝固点液体", "鸭皮下不饱和多脂胶原水解物", "烤挂炉高温热解皮下脂肪流动体"],
  "蟹": ["高浓度几丁壳多糖", "游离嘌呤核苷酸胶体", "极高纯度蟹黄卵磷脂结核物"],
  "蛋": ["受热变性多孔卵清蛋白网格", "卵黄高磷脂生物油包水乳液", "高能胆固醇变性球蛋白晶体"],
  "奶": ["多相水包油乳固形脂肪", "活性乳清白质键", "含钙胶体微球结构"],
  "面": ["高精小麦面筋拉伸多肽封套", "碱性麦谷蛋白包裹颗粒", "多糖水合多相面糊骨架"],
  "饭": ["高硬度颗粒化脱水大米多糖", "支链淀粉糊化空间折叠体", "黄金美拉德反应多孔米粒结构"],
  "粉": ["糊化片状支链淀粉胶", "多糖水合包裹体", "重度压滤水合多糖胶体柱"],
  "油": ["高甘油三酯多元不饱和脂肪酸", "高沸点棕榈油脂吸附体", "热燥油脂底层沉积物"],
  "水": ["极强极性高流动性水合自由基", "非结合性自由挥发自由水", "高渗透压结晶水合物"],
  "盐": ["高渗氯化钠电离晶体晶胞", "微量矿物金属卤化物沉淀", "高盐度高压缓冲电解质液"],
  "醋": ["低pH稀乙酸弱酸缓冲液", "高度发酵有机果酸多酚", "酸度缓冲变性肌蛋白沉淀"],
  "香": ["辛香挥发油复合大分子", "植物天然小分子挥发芳烃", "高饱和香气复合微元"],
  "臭": ["硫化氢厌氧降解有机硫醚", "极臭还原性风味大分子硫醚", "极度重度氨基酸降解质"],
  "糖": ["多相重组蔗糖微晶体", "高敏多巴胺诱导剂", "固体多糖聚合物", "麦芽多糖低纯精炼糖体"],
  "肉": ["动物性红肉肌原纤维", "高纯肉类梅拉德褐变物", "蛋白质热缩聚合物"],
  "草": ["天然长碳链膳食纤维", "绿色植物叶绿体微元", "粗木质素多孔壁"],
  "金": ["24K纳米级炫彩活性金箔", "重金属极奢电离子结壳", "金属键多晶态滑移过渡颗粒"],
  "木": ["果木炭化木质素纤维素", "植物细胞壁超顺分子多糖", "树脂烯类高挥发性芳香烃"],
  "土": ["高黏度硅酸铝熟黏土胶体", "古老厌氧富有机质黑土颗粒"],
  "石": ["坚固高钙结核玄武岩", "结石级生理重压硅酸钙结晶", "史前沉积碎屑砂岩骨架"],
  "山": ["褶皱山脉高重力积压沉积岩", "高山融雪微量矿物结晶体", "板块碰撞地表隆起物理断层"],
  "海": ["海洋超高盐度嘌呤聚集水合物", "深海几丁质骨骼高分子共聚物", "大西洋洋流沉降富硒矿物盐"],
  "星": ["恒星核聚变氦核重金属微粒", "偏振星光反光钛白多面体", "星际尘埃富硅质多孔晶格"],
  "月": ["月表斜长岩真空防辐射霜华", "潮汐引力拉伸均质白色流体", "广寒冷寂高分子银华反光涂层"],
  "日": ["太阳光谱高能紫外辐照多肽", "日光烈度灼烧变性顺式脂肪酸", "赤道暖流极高热高水合乳悬液"],
  "云": ["水蒸气凝结多孔气溶胶乳化网", "天基卷云冰晶偏光反射层", "高纯度气态高分子挥发油"],
  "风": ["气流剪切超轻量分子气孔", "狂风脱水快速脆化外壁壳", "强对流扩散芳香精油载体"],
  "雷": ["高压电击电弧碳化微细粉尘", "电离高能活性自由基团", "雷击熔岩酸性硅质熔融体"],
  "电": ["极性电荷转移多相电解质", "高频压电石英晶振微粒", "神经电信号瞬时传导递质"],
  "天": ["平流层高空紫外光解臭氧", "天使级纯白温润酪蛋白泡沫", "苍穹之蓝电离铜盐结晶物"],
  "地": ["地壳构造运动强剪切玄武岩", "地心熔岩超级压力固相结壳", "大自然腐殖酸生物复合物"],
  "空": ["虚无空间真空态负能量微粒", "热解二氧化碳游离极轻微分子", "虚空维度的弦共振无序沉淀"]
};

// Translate normal food items into highly sophisticated, ultra-hilarious art components
function translateIngredientsToArtWords(allIngredients: string[]): string[] {
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
    let matched = false;
    for (const [key, artisticSynonyms] of Object.entries(INGREDIENT_ARTISTIC_MAP)) {
      if (food.includes(key) || key.includes(food)) {
        const word = artisticSynonyms[Math.floor(Math.random() * artisticSynonyms.length)];
        resultList.push(word);
        matched = true;
        break;
      }
    }
    if (!matched) {
      if (food.length <= 4) {
        resultList.push(`生鲜级大分子[${food}]高聚物`);
      } else {
        resultList.push(`[${food}]复风味有机质`);
      }
    }
  });

  return resultList.slice(0, 8); // Max 8 unique ingredients representation
}

// Complete offline programmatic art generator with incredible depth
function generateMasterpieceArtProgrammatically(
  meals: { breakfast: string; lunch: string; dinner: string },
  holdingDays: number,
  heldMealsHistory: any[] = [],
  artistName: string = "momo"
) {
  // Dynamically calculate the current season and time of day based on current date
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
  const hybridTextureNames = {
    "spring_morning": "【春曦新绿】质感。呈现出雨后春笋般的盎然嫩绿微光，表层闪烁着晨露折射的微小水合气泡",
    "spring_afternoon": "【春樱晴午】质感。带有浪漫轻盈的绯粉色微闪偏光，犹如繁花在春日暖阳下的惬意起伏",
    "spring_night": "【春夜微雨】质感。泛着幽蓝月影与樱粉斑驳的双色光晕，宛如暮春细雨打湿的青石小路",
    "summer_morning": "【夏荷晨露】质感。绿莹底色上缀着圆润清澈的晶莹液珠，透露出池塘睡莲初醒的生命神性",
    "summer_afternoon": "【夏日烈阳】质感。极高饱和度暖金烘烤光波，外壁因高热释放而隐隐呈现海市蜃楼般的流体扭曲",
    "summer_night": "【夏夜繁星】质感。深邃纯黑底色上繁星般散落着点点萤粉与夜光尘埃，静谧中有一丝欢跃",
    "autumn_morning": "【秋霜枫莹】质感。晨霜银白雾感笼罩着厚重的枫红橙底，诠释了气温初降时的物料凝聚美学",
    "autumn_afternoon": "【金秋落叶】质感。金黄干枯的大理石断层干裂感，饰以零星飘落的灿烂落叶金粉与琥珀色斑",
    "autumn_night": "【寒秋明月】质感。清冷如银的皎洁月华反光罩在深沉沉淀层上，展现广寒宫殿宇般的空门孤寂",
    "winter_morning": "【冬晨初雪】质感。淡淡冰蓝凝霜晶体附着于表，犹如清晨初雪初降在大理石雕塑上的冰透霜华",
    "winter_afternoon": "【冬日暖阳】质感。苍茫白雪中透出一抹温暖的杏黄余温，带有松软又沉淀的温存暖意",
    "winter_night": "【深冬飞雪】质感。漆黑幽邃的外壳上，凝结着六角雪花冰晶与静电霜痕，呈现绝对零度的极致圣洁"
  };

  const currentHybridKey = `${season}_${timeOfDay}` as keyof typeof hybridTextureNames;
  const currentHybridDescription = hybridTextureNames[currentHybridKey] || "【时令流体】质感";

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

  // Extract primary foods for custom templates
  const primaryBreakfast = meals.breakfast || "空气";
  const primaryLunch = meals.lunch || "空气";
  const primaryDinner = meals.dinner || "空气";
  const randomIng = allIngredients[Math.floor(Math.random() * allIngredients.length)] || "空气";

  // Translate all ingredients to their modern art aliases
  const ingredientsAnalyzed = translateIngredientsToArtWords(allIngredients);
  const primaryArtisticIng = ingredientsAnalyzed[0] || "代谢虚空物";

  let color = "#8B5A2B"; // default warm brown
  let accent = "#5C3818";
  let texture = "smooth";
  let shape = "standard_swirl";
  let rarity: "N" | "R" | "SR" | "UR" = "N";
  let themeName = "classic_clay";

  let hasFoodTheme = false;

  // 1. Check food-specific diet triggers first
  if (textLower.includes("火锅") || textLower.includes("辣") || textLower.includes("川") || textLower.includes("湘") || textLower.includes("红油") || textLower.includes("辣子鸡") || textLower.includes("串串") || textLower.includes("冒菜") || textLower.includes("抄手") || textLower.includes("麻婆豆腐") || textLower.includes("小龙虾")) {
    color = "#C21807"; // scarlet hot sauce red
    accent = "#FF9900"; // chili pepper sparks
    texture = "volcanic_lava";
    shape = "fluid_drip";
    rarity = "R";
    themeName = "volcanic_lava";
    hasFoodTheme = true;
  } else if (textLower.includes("螺蛳") || textLower.includes("臭豆腐") || textLower.includes("榴莲") || textLower.includes("香菜") || textLower.includes("大蒜") || textLower.includes("韭菜") || textLower.includes("肥肠") || textLower.includes("臭") || textLower.includes("洋葱")) {
    color = "#5A781D"; // radioactive sludge green
    accent = "#A3E635"; // toxic chartreuse highlight
    texture = "toxic_slime";
    shape = "fluid_drip";
    rarity = "R";
    themeName = "toxic_slime";
    hasFoodTheme = true;
  } else if (textLower.includes("巴黎") || textLower.includes("法式") || textLower.includes("西餐") || textLower.includes("红酒") || textLower.includes("面包") || textLower.includes("意面") || textLower.includes("披萨") || textLower.includes("芝士") || textLower.includes("奶酪")) {
    color = "#B45309"; // toasted butter pastry amber
    accent = "#831843"; // elegant bordeaux red
    texture = "smooth";
    shape = "eiffel_tower";
    rarity = "R";
    themeName = "french_bento";
    hasFoodTheme = true;
  } else if (textLower.includes("猫") || textLower.includes("日式") || textLower.includes("日料") || textLower.includes("寿司") || textLower.includes("拉面") || textLower.includes("刺身") || textLower.includes("天妇罗") || textLower.includes("鳗鱼")) {
    color = "#F8FAFC"; // pearly sushi rice white
    accent = "#EF4444"; // sashimi red
    texture = "smooth";
    shape = "lucky_cat_tail";
    rarity = "R";
    themeName = "japanese_tale";
    hasFoodTheme = true;
  } else if (textLower.includes("甜甜圈") || textLower.includes("蛋糕") || textLower.includes("草莓") || textLower.includes("巧克力") || textLower.includes("甜") || textLower.includes("沙糖") || textLower.includes("糖")) {
    color = "#EC4899"; // barbie pink cake frosting
    accent = "#10B981"; // spearmint green contrast
    texture = "glittery";
    shape = "ring_doughnut";
    rarity = "R";
    themeName = "cyber_sugar";
    hasFoodTheme = true;
  } else if (textLower.includes("咖啡") || textLower.includes("美式") || textLower.includes("拿铁") || textLower.includes("红茶") || textLower.includes("乌龙茶") || textLower.includes("可乐") || textLower.includes("汽水") || textLower.includes("饮料") || textLower.includes("泡面") || textLower.includes("方便面")) {
    color = "#1E293B"; // caffeinated slate black
    accent = "#00DFFF"; // electronic cyan glow
    texture = "cyber_grid";
    shape = "alien_ufo";
    rarity = "R";
    themeName = "cyber_grid";
    hasFoodTheme = true;
  } else if (textLower.includes("松露") || textLower.includes("鹅肝") || textLower.includes("鱼子酱") || textLower.includes("鲍鱼") || textLower.includes("极奢") || textLower.includes("和牛") || textLower.includes("金箔") || textLower.includes("金")) {
    color = "#111827"; // obsidian black
    accent = "#F59E0B"; // brilliant 24k aurum gold flakes
    texture = "metallic_gold";
    shape = "royal_crown";
    rarity = "SR";
    themeName = "luxury_aurum";
    hasFoodTheme = true;
  } else if (textLower.includes("烤鸭") || textLower.includes("锅包肉") || textLower.includes("红烧肉") || textLower.includes("小笼包") || textLower.includes("饺子") || textLower.includes("馄饨") || textLower.includes("宫保鸡丁") || textLower.includes("炒饭") || textLower.includes("炒河粉") || textLower.includes("佛跳墙") || textLower.includes("火腿") || textLower.includes("牛排") || textLower.includes("烤肉") || textLower.includes("炸鸡") || textLower.includes("汉堡") || textLower.includes("薯条") || textLower.includes("热狗") || textLower.includes("排骨") || textLower.includes("牛肉") || textLower.includes("肉")) {
    color = "#881337"; // deep lacquered rosewood rouge
    accent = "#F59E0B"; // majestic imperial dynasty gold
    texture = "metallic_gold";
    shape = "royal_crown";
    rarity = "SR";
    themeName = "chinese_imperial";
    hasFoodTheme = true;
  } else if (textLower.includes("宇宙") || textLower.includes("星") || textLower.includes("月") || textLower.includes("日") || textLower.includes("云") || textLower.includes("风") || textLower.includes("天") || textLower.includes("雷") || textLower.includes("电") || textLower.includes("空") || textLower.includes("混沌") || textLower.includes("奇点") || textLower.includes("黑洞") || textLower.includes("暗物质")) {
    color = "#3B0764"; // deep night purple
    accent = "#FF00FF"; // neon magenta supernova
    texture = "rainbow_metallic";
    shape = "alien_ufo";
    rarity = "UR";
    themeName = "cosmic_nebula";
    hasFoodTheme = true;
  } else if (textLower.includes("地球") || textLower.includes("石") || textLower.includes("土") || textLower.includes("砂") || textLower.includes("泥") || textLower.includes("山") || textLower.includes("古老") || textLower.includes("微尘")) {
    color = "#57534E"; // deep geological slate gray
    accent = "#1C1917"; // core limestone
    texture = "relic_moss_stone";
    shape = "massive_mountain";
    rarity = "SR";
    themeName = "geological_stratum";
    hasFoodTheme = true;
  } else if (textLower.includes("人参") || textLower.includes("枸杞") || textLower.includes("补") || textLower.includes("药")) {
    color = "#D97706"; // warm amber medicinal glaze
    accent = "#DC2626"; // active crimson
    texture = "crystalline";
    shape = "double_helix";
    rarity = "SR";
    themeName = "herbal_tonic";
    hasFoodTheme = true;
  } else if (textLower.includes("10") || textLower.includes("1") || textLower.includes("2") || textLower.includes("3") || textLower.includes("4") || textLower.includes("5") || textLower.includes("6") || textLower.includes("7") || textLower.includes("8") || textLower.includes("9") || textLower.includes("十") || textLower.includes("一") || textLower.includes("二") || textLower.includes("三") || textLower.includes("四") || textLower.includes("五") || textLower.includes("六") || textLower.includes("七") || textLower.includes("八") || textLower.includes("九")) {
    color = "#0F172A"; // digital carbon slate
    accent = "#38BDF8"; // glowing math grid cyan
    texture = "cyber_grid";
    shape = "double_helix";
    rarity = "R";
    themeName = "mathematical_sequence";
    hasFoodTheme = true;
  } else if (textLower.includes("蔬菜") || textLower.includes("草") || textLower.includes("沙拉") || textLower.includes("轻食") || textLower.includes("绿") || textLower.includes("健身") || textLower.includes("鸡胸")) {
    color = "#156534"; // rich leafy green chlorophyll
    accent = "#BBF7D0"; // soft lime
    texture = "grainy";
    shape = "standard_swirl";
    rarity = "N";
    themeName = "healthy_chlorophyll";
    hasFoodTheme = true;
  }

  // 2. Synthesize with holdingDays for pressure adjustments
  if (hasFoodTheme) {
    // Elevate target rarity based on intestinal persistence without erasing food properties
    if (holdingDays >= 5) {
      rarity = "UR";
    } else if (holdingDays >= 2) {
      rarity = "SR";
    }
  } else {
    // If no diet matches exist, use full collection of physical weathering themes
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
      // Elegant fallback random styles
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

  // Preposterous Title Generator with 10 high-concept templates mapping to themeName
  let title = `《无题：关于${randomIng}的生理学叙事》`;
  const titlesDatabase: { [key: string]: string[] } = {
    gilded_antique: [
      `《时空折叠：历经 ${holdingDays} 天憋附之“${randomIng}”黄金纪念碑》`,
      `《高贵的惰性沉积物：由 ${holdingDays} 日生理抗张力所重塑的 “${primaryBreakfast}” 史诗大典》`,
      `《卢浮宫的遗物：大肠与意志力共同熔铸的 ${holdingDays} 日物理断层》`
    ],
    ancient_bronze: [
      `《岁月的侵蚀：在宿主腹压下憋足 ${holdingDays} 天的原生态两栖流体双螺旋》`,
      `《古老原矿：关于由 “${primaryLunch}” 在极度厌氧环境下所衍生的氧化青铜法则》`,
      `《时序地质学：经历 ${holdingDays} 天极干脱水的代谢雕像——“${randomIng}之叹”》`
    ],
    relic_moss: [
      `《废墟上的新绿：关于 ${holdingDays} 日积压之 “${randomIng}” 的长满青苔的雕塑》`,
      `《大地的隐喻：多日滞留所造就的 “${primaryDinner}” 砂岩质沉渣物理断层》`,
      `《生命循环史诗：大热量饮食与生理重力极限拉扯 ${holdingDays} 天后结成的沉默之山》`
    ],
    petrified_fossil: [
      `《古拉格碳元素：关于 “${primaryLunch}” 与 “${primaryDinner}” 经由 ${holdingDays} 日地化作用的石化标本》`,
      `《大肠地质纪年：憋拉 ${holdingDays} 天的结石级生理和解》`,
      `《被冻结的时间：宿主由 ${holdingDays} 日宿命肠道挤制而出的沉寂玄武岩》`
    ],
    volcanic_lava: [
      `《肠腔深处的狂暴火山：由“${randomIng}”所触发的极温火色美学》`,
      `《午夜的红油狂想曲：关于在消化壁内部发生的麻辣地幔流体力学实验》`,
      `《沸腾熔岩之冠：“${primaryLunch}”与“${primaryDinner}”的狂热生理宣泄大作》`
    ],
    toxic_slime: [
      `《嗅觉反叛的黑色幽默：关于极其荒诞的 ${primaryArtisticIng} 强发酵力学解构》`,
      `《重度气体窒息美学：高挥发性“${randomIng}”所留存的绿色核酸侵蚀底稿》`,
      `《毒性沼泽的私密宣告：“${primaryLunch}”与“${primaryDinner}”在酸笋作用下的生化流体溢流》`
    ],
    french_bento: [
      `《在巴黎的黄雨伞下：有关碳水化合物面包与“${randomIng}”在红酒浸渍下的卢浮宫姿态》`,
      `《凡尔赛的面粉废墟：黄油、起司与大块“${primaryLunch}”的古典流线雕塑》`,
      `《香榭丽舍的叹息：精制西餐在大肠边缘的优雅地质流线》`
    ],
    japanese_tale: [
      `《江户前浮世绘：由“${randomIng}”与碱水拉面所勾勒的幸运动物卷尾》`,
      `《抹茶与刺身的哲学折叠：“${primaryLunch}”在经历肠壁挤压后的昭和风极简雕刻》`,
      `《竹林深处的日和叹息：关于和风清淡食材在宿主腹部的禅意演化》`
    ],
    cyber_sugar: [
      `《多巴胺粉红蜜糖废墟：精制糖分与“${randomIng}”对宿主脑垂体的极奢反哺》`,
      `《粉色乌托邦之碎：“${primaryLunch}”与高糖蛋糕结合的高温多聚糖巴洛克圆环》`,
      `《甜腻生理遗迹：关于糖霜、奶茶与宿命代谢的多彩糖干预曲线》`
    ],
    cyber_grid: [
      `《高压咖啡因序列：由“${primaryBreakfast}”构效而出的数字游民终极代谢结晶》`,
      `《深夜代码之灰：无奶黑美式与“${primaryDinner}”构筑的赛博流体物理方程》`,
      `《可乐气碳多相多维方程式：可口可乐与泡面在大肠底盘处的科技投影》`
    ],
    luxury_aurum: [
      `《黑曜石之王在深海松露下的金箔祭祀：关于极致凡尔赛黑色的极致排泄仪式》`,
      `《极奢地平线：牛排、鱼子酱与香槟酒的生物高贵熔炼古籍》`,
      `《富贵逼人：当代上流餐食“${randomIng}”转化为卢浮宫黑色圆雕的极奢篇章》`
    ],
    chinese_imperial: [
      `《宫廷遗韵：由极品“${randomIng}”凝聚而出的紫禁城朱红琉璃》`,
      `《满汉全席遗墨：“${primaryLunch}”在皇家肠道力学下完成的九转纯化艺术》`,
      `《岁贡圣物：关于传统“${primaryDinner}”在腹压乾坤中所熔铸的江山瑞兽雕像》`
    ],
    cosmic_nebula: [
      `《天体大爆炸残留：极深空“${randomIng}”穿透多元宇宙引力波的星云遗存》`,
      `《事件视界的边缘：“${primaryLunch}”在黑洞奇点塌缩而出的电离辐射流线》`,
      `《星象运转协奏曲：由“${primaryDinner}”跨越时空星系折叠而成的超弦多维几何》`
    ],
    geological_stratum: [
      `《板块重合的隆起：由史前“${randomIng}”经地幔高压风化的构造学硅酸盐岩石》`,
      `《地化纪元沉积：“${primaryLunch}”化身冰川漂砾后的硬质矿物断层》`,
      `《盖亚物料密友：关于“${primaryDinner}”与大自然熟粘土进行物理重组的无言碑记》`
    ],
    herbal_tonic: [
      `《本草本源互济：人参皂苷、枸杞多糖在肠道秘境内聚合成的元气大丹》`,
      `《补虚泻实：关于“${randomIng}”与百草精华在丹田高热下熔铸的养生金丹》`,
      `《温补地层：经历长白山元气熏蒸出的“${primaryLunch}”极度升华双螺旋》`
    ],
    mathematical_sequence: [
      `《斐波那契的完美对称：关于第 “${randomIng}” 号高维数学排泄常量的物理几何》`,
      `《量子极对称数列：将 “${primaryLunch}” 与 “${primaryDinner}” 按数论常数极度挤压所得出的拓扑双螺旋》`,
      `《原初数元和解：在 ${holdingDays} 天内按纯净质数律动构效而成的无限循环公式》`
    ],
    healthy_chlorophyll: [
      `《素食主义的绿色自律告白：高密度纤维素与“${randomIng}”在重力下的绿色纪念章》`,
      `《叶绿体在粗粮中的巴洛克螺旋：“${primaryLunch}”及沙拉水合因子的简朴沉淀》`,
      `《被净化之躯的简练物料：宿主关于无油水煮鸡胸肉与生菜的纯粹物理投影》`
    ]
  };

  const pool = titlesDatabase[themeName] || [
    `《重塑的“${randomIng}”：时间维度的沉积与定格》`,
    `《关于饥饿与高分子“${primaryBreakfast}”的宏大代谢叙事》`,
    `《“${primaryLunch}”之后：大肠力学对生理黏膜与消化机能的流体力学回答》`,
    `《无机物质与有机代谢在宿主肠道积压下的史诗级物理和解——致敬“${randomIng}”》`
  ];
  title = pool[Math.floor(Math.random() * pool.length)];

  // High-concept Chinese modern art critique sentences
  // To construct a completely bespoke critique paragraph matching the history of multi-day ingestion
  let ingestionTimelineDescription = "";
  if (allHistoryMeals.length > 0) {
    const historicalSummaries = allHistoryMeals.map((h, i) => {
      const bText = h.breakfast ? `早摄[${h.breakfast}]` : "空腹";
      const lText = h.lunch ? `午摄[${h.lunch}]` : "空腹";
      const dText = h.dinner ? `晚摄[${h.dinner}]` : "空腹";
      return `第${i+1}天由于长期憋附，在底部叠成了以${bText}、${lText}、${dText}为基础的历史性【古老发酵底盘】`;
    });
    ingestionTimelineDescription = `。在结构细节上，该作包含极其清晰的“时空演化断层”。最底部的古老沉淀层可追溯到${historicalSummaries.slice(0, 3).join("，")}，由于长达数日的时间堆叠，这些先驱媒介早已碳化分解，形成了如史前灰岩一般的扎实基座；`;
  } else if (holdingDays > 0) {
    ingestionTimelineDescription = `。鉴于宿主将“${primaryBreakfast}”等物料在结肠腔室中紧密蓄积憋拉了长达 ${holdingDays} 天，整件作品的底层物料表现出了高密度的脱水皱褶，暗示了长达数日的发酵与重力压缩，将快餐转化为带有大理石质感的“地层标本”；`;
  } else {
    ingestionTimelineDescription = `。作为一次快速释放的即兴“速度艺术”，从“${primaryBreakfast}”的摄入到最终在大肠终点的瞬时凝固几乎一气呵成。其表面闪烁着因极速行进所拉伸而出的纤细流须线，完全不受多日陈化发酵的沉闷拘束，轻盈而充满本能张力；`;
  }

  const textureDiscussions: { [key: string]: string } = {
    gilded_relic: `。极奢至极的【${primaryArtisticIng}】金箔镀层在其顶部凝聚，流线型的 ${shape === "royal_crown" ? "“皇家皇冠”" : "“双螺旋”"} 轮廓完全被灿烂夺目的土豪金遮蔽。这是对长达 ${holdingDays} 天极限负重的一次充满庄严感的肉体表彰，堪称无价的赛博古董`,
    ancient_bronze: `。斑驳暗淡的【${primaryArtisticIng}】铜锈绿晶在其氧化表面如苔藓般侵染，古朴迷离。憋拉 ${holdingDays} 日的时光结晶，让干枯坚固的胚体表面拥有一种美索不达米亚平原青铜圣器般的静谧，神圣而带有荒凉诗意`,
    relic_moss_stone: `。作品完美呈现出【${primaryArtisticIng}】颗粒石质感。由于经历了长达 ${holdingDays} 天的厌氧洗礼，表面滋生出类似矿物绿霉与活性多肽黏丝的“微型生态绿原”。这是一种人造文明遗迹被自然森林缓慢吞噬的、极其凄美的极简生态神话`,
    petrified_fossil: `。坚固得如同高钙玄武岩一般的【${primaryArtisticIng}】岩壁上，凝结着粗砺的历史干裂纤维。这是过去 ${holdingDays} 天在强腹压、低水合生理博弈下结出的“坚不可摧之舍利”，彰显出大肠蠕动机制对软弱有机基质的铁兽般规训`,
    volcanic_lava: `。狂暴的【${primaryArtisticIng}】通红岩浆沿着流线外壁缓缓渗流，极温辛香料中的油脂素与辣椒多酚在大气中几乎处于正在蒸腾的虚设气孔态。火红与焦黑的撞击，是宿主在享受极辣美食那一瞬间肾上腺素暴涨的、极具侵略性的身体快感自画像`,
    toxic_slime: `。泛着异样光泽的【${primaryArtisticIng}】有毒绿色黏膜正从外层断口处向四周发散出带有刺鼻大蒜、酸笋与香菜气孔的强侵蚀液滴，让人在距离十米开外即可对宿主的消化黑箱产生极度敬畏。这是关于快餐垃圾堆里生物发酵奇迹的一次极其朋克的无序抗议`,
    smooth: `。作品外部极为难得地表现出了白瓷般光滑的【${primaryArtisticIng}】丝滑流线。高贵圆润的面筋弹性多肽拉近了整件雕像的圣洁质感，极具巴洛克女性雕像的流线之美，消解了所有本源宿命物料的污浊印记`,
    grainy: `。质感扎实的【${primaryArtisticIng}】颗粒度与谷物麦麸的坚硬残屑完美糅合，带来一种类似于红土高原风化砂岩的质朴粗糙度。这是一次极速回归田园本质的、去修饰的身体诚实投影`,
    steaming: `。带有水汽余温 of 【${primaryArtisticIng}】液泡外壁散发着若有似无的淡淡气旋，暗示该作刚刚脱离主厨肠道三十秒的“崭新鲜活度”。雾霭笼罩的边缘轮廓，平添了一种朦胧而具有时效限定的哀伤美感`,
    glittery: `。闪耀着荧光粉色泡泡多酚的【${primaryArtisticIng}】多羟基糖结晶覆盖全身，在射灯下闪烁着诡异的多巴胺光芒。粉嫩与甜蜜包装之下的本质排泄，以赤裸裸又梦幻的视觉语言戏弄了现代工业消费社会对人体的粉饰`,
    cyber_grid: `。咖啡焦黑色泽凝聚而成的【${primaryArtisticIng}】碳粉质感完美契合了 ${shape === "alien_ufo" ? "“外星飞碟”" : "“流线水滴”"} 形态。其微小的几何多孔外壳下，封存着大量无奶冰美式中尚未重组的酸类，是数字时代码农、设计师生存现状的冰冷代谢图纸`,
    metallic_gold: `。黑曜石般焦黑的底座烘托着宛如璀璨夜星的【${primaryArtisticIng}】鎏金屑点，两种极高对比的明暗度直接颠覆了传统的垃圾废料认知。黑与金交织出的贵族气派，是消费主义精致晚宴大快朵颐之后的终极物理嬗变`,
    rainbow_metallic: `。奇迹般的、流动着量子阴阳极偏色干涉偏光光谱的【${primaryArtisticIng}】五彩极光反光涂层包裹着整尊胚体，流光溢彩，宛若事件视界外层的时空折变。这直接将排泄物的物理形态升华至恒星创生、星轨流变的宇宙超验高度，令人叹为观止`,
    crystalline: `。其主体呈现出一种神圣半透明的、温润如极地冰川晶体般的【${primaryArtisticIng}】微晶矿物结晶。淡雅又高贵的折光度透露出一丝凉爽、纯粹而不可侵犯的精炼自律，彻底挣脱了凡俗世俗饮食的所有烟火与油脂味`
  };

  const currentTextureDiscuss = textureDiscussions[texture] || `。表体材料由极其特殊的【${primaryArtisticIng}】组成，带有斑驳繁复的肌理断层，极其忠实地还原了生物体内物料消化沉淀的基本热物理演变`;

  const seasonCommentary = `。值得赞叹的是，作品诞生于年岁流转中的` + seasonNames[season] + `之季，且恰值` + timeNames[timeOfDay] + `，天然吸纳了时序的气候环境。在核心材质之外，该作不可思议地糅合了一层精妙绝伦的` + currentHybridDescription;

  // Let's create 12 completely distinct curatorial essay styles
  const templates = [
    // 1. 存在主义荒诞派
    `主厨艺术家“${artistName}”在此刻向大众展示了一场荒诞的凡俗生命仪式。该雕塑以特异的 ${shape === "royal_crown" ? "“皇家皇冠”" : (shape === "alien_ufo" ? "“外星飞碟”" : "“双螺旋”")} 拓扑结构矗立，它不仅是一次关于物料挤压的时间定格，更是将今日早膳之“${primaryBreakfast}”与午膳之“${primaryLunch}”所富集的动能彻底结疤${ingestionTimelineDescription}其体躯经受了${currentTextureDiscuss}，恰在${seasonNames[season]}的微澜时令与${timeNames[timeOfDay]}的静美交错时分诞生，由此糅合了华丽的${currentHybridDescription}。这绝非简单的有机过客，而是一个对抗时光虚无、在消化尽头高歌的存在主义幽灵。`,
    
    // 2. 古典浪漫巴洛克
    `这非偶然遗留，而是古典浪漫主义精神在大肠内腔里的瑰丽苏醒！在艺术家“${artistName}”的精湛指挥下，${shape === "royal_crown" ? "“皇家皇冠”" : (shape === "alien_ufo" ? "“外星飞碟”" : "“双螺旋”")} 完美再现了古典大师雕像中的那种神圣重力${ingestionTimelineDescription}其富丽堂皇的${currentTextureDiscuss}，将质朴琐碎的“${primaryLunch}”骤然升华至无可攀登的殿堂高度。正值${seasonNames[season]}的气候轮回与${timeNames[timeOfDay]}的梦幻晕染，其外层凝聚的${currentHybridDescription}宛如梦中的微光，以巴洛克式的奢美弧度，无情嘲弄了中产阶级日常生活的干瘪与虚假。`,
    
    // 3. 解构主义材料学
    `这是一曲关于高分子有机转变、结肠流变学与宏观重力力学的去中心化协奏。“${artistName}”利用“${primaryBreakfast}”与“${primaryLunch}”作为起始物，历经极度的生理压力与肠道博弈，铸就了此尊极富力学张力的 ${shape === "royal_crown" ? "“皇家皇冠”" : (shape === "alien_ufo" ? "“外星飞碟”" : "“双螺旋”")} 胚体${ingestionTimelineDescription}尤为引人瞩目的是其${currentTextureDiscuss}。受${seasonNames[season]}环境冷缩与${timeNames[timeOfDay]}湿度变化的联合作用，表皮结晶而出的${currentHybridDescription}展示了一副无机自组装的微型物理景观，完美解构了“日常废弃”与“崇高媒介”之间的二元隔阂。`,
    
    // 4. 赛博朋克后人类叙事
    `在电子荒原与高频脑机荷尔蒙的末世对峙中，主厨“${artistName}”将大肠改造为温暖、潮湿而诚实的血肉3D打印机。本尊具备科幻感的 ${shape === "royal_crown" ? "“皇家皇冠”" : (shape === "alien_ufo" ? "“外星飞碟”" : "“流线”")} 阵列${ingestionTimelineDescription}其紧实的中枢完好保存了由“${primaryLunch}”所激发的焦油电能。表侧附着的${currentTextureDiscuss}呈现出了高压电路板的粗砺与焦灼。适逢${seasonNames[season]}季节交换与${timeNames[timeOfDay]}的时空侵入，外在增殖出的${currentHybridDescription}犹如芯片上的精密保护膜层，以极冷傲的姿态，披露了后人类时代消费主义宿命的代谢底稿。`,
    
    // 5. 东方禅意侘寂派
    `一花一世界，一草一禅机。主厨艺术家“${artistName}”以这尊超脱世俗的 ${shape === "royal_crown" ? "“皇家皇冠”" : (shape === "alien_ufo" ? "“外星飞碟”" : "“双螺旋”")} 遗墨，将侘寂（Wabi-Sabi）哲学推向了无可言喻的隐秘妙境。今日的“${primaryBreakfast}”与往昔的梦呓在此尘埃落定${ingestionTimelineDescription}抚摸其${currentTextureDiscuss}，在${seasonNames[season]}的落寞岁华与${timeNames[timeOfDay]}的空灵转折之中，作品无比偶然地孕育出了那层${currentHybridDescription}。策展委员会建议观众静立、合十：它用最谦逊、最诚实的生态物理语言，引导我们观照内心深处的生命微澜。`,
    
    // 6. 宿命论地表地质谱系
    `艺术家“${artistName}”在此展现的并非是一时宣泄，而是一部具有地质学纪年重量的、极为私密的生命断层史诗。承接了整整 ${holdingDays} 天的时光孕育，这尊 ${shape === "royal_crown" ? "“皇家皇冠”" : (shape === "alien_ufo" ? "“外星飞碟”" : "“双螺旋”")} 特色形态成为承载并抵御遗忘的物料质地纪念章${ingestionTimelineDescription}表体上流淌着饱含地质结核美感的${currentTextureDiscuss}。在${seasonNames[season]}的时序洗礼与${timeNames[timeOfDay]}的静谧折射下，其独一无二的${currentHybridDescription}具有了出土文物的厚重尊严，彻底撞碎了当代消费社会的快闪滤镜。`,
    
    // 7. 达达主义生物讽刺
    `呸！去他的神圣艺术殿堂，去他的优雅致敬日常！主厨艺术家“${artistName}”以这尊高耸、带有戏谑盘旋的 ${shape === "royal_crown" ? "“皇家皇冠”" : (shape === "alien_ufo" ? "“外星飞碟”" : "“双螺旋”")} 特色艺术，把中产阶级的审美假面撕了个粉碎！这是由“${primaryBreakfast}”与“${primaryLunch}”共同主演的一幕重力戏剧${ingestionTimelineDescription}其任性而张扬的${currentTextureDiscuss}，恰在${seasonNames[season]}与${timeNames[timeOfDay]}的冷酷注视下，极其骄傲地催生了${currentHybridDescription}。这是一出无可替代的、极度朋克的达达主义身体反叛，强迫我们直面那些在喧嚣文明中被极力掩饰的代谢宿命。`,
    
    // 8. 宇宙神秘能量学
    `这件作品正神秘地呼应着银河系暗物质流的物理潮汐！“${artistName}”用这尊具有庞大吸附力的 ${shape === "royal_crown" ? "“皇家皇冠”" : (shape === "alien_ufo" ? "“外星飞碟”" : "“双螺旋”")} 宇宙拓扑，架设起了一座联通肠道微宇宙与宏伟天体相位的量子桥梁${ingestionTimelineDescription}今日“${primaryLunch}”中蕴藏的一丝热能在大肠终点爆发，塑造成具有星际凝聚张力的${currentTextureDiscuss}。由于诞生于${seasonNames[season]}的时空奇点与${timeNames[timeOfDay]}的深空节点上，其散发的${currentHybridDescription}如同宇宙背景微光，令人对未知的生命本源肃然起敬。`,
    
    // 9. 深层潜意识弗洛伊德派
    `作为宿主深层潜意识在生活边缘的惊恐狂飙，“${artistName}”在此刻成功完成了一次极具解脱美学的自我抚慰。这尊 ${shape === "royal_crown" ? "“皇家皇冠”" : (shape === "alien_ufo" ? "“外星飞碟”" : "“双螺旋”")} 构型无声倾吐着控制与释放、占有与离去的激烈精神拉扯${ingestionTimelineDescription}“${primaryBreakfast}”的注入正是本能能量最初的纠缠之因。而其${currentTextureDiscuss}在${seasonNames[season]}与${timeNames[timeOfDay]}的昏黄交织中，以冷酷的${currentHybridDescription}揭示了被包装在文明衣装下的纯粹本我，是一曲震撼心灵的潜意识赞歌。`,
    
    // 10. 后消费时代环境批判
    `在物欲纵横、万物皆可消费并遗弃的宏大工业废墟中，主厨“${artistName}”用这桩具有纪念碑式沉重感的 ${shape === "royal_crown" ? "“皇家皇冠”" : (shape === "alien_ufo" ? "“外星飞碟”" : "“双螺旋”")} 遗骸，拉响了时代的生物质警报。它将“${primaryBreakfast}”与“${primaryLunch}”等现代大生产的消费残留，提炼为恒星般的生命切片${ingestionTimelineDescription}触目惊心的${currentTextureDiscuss}，在${seasonNames[season]}岁序与${timeNames[timeOfDay]}晨昏交织的紧迫感下，激发出极富启示录意味的${currentHybridDescription}。它逼迫观众直面这震撼的一幕，发起最刺耳的环境哲学质询。`,
    
    // 11. 表现主义肉身体验
    `这是一场在湿润肠腔深处发生并战栗的、精神与内脏极限救赎的视觉投影！艺术家“${artistName}”在极意雕塑厚度之 ${shape === "royal_crown" ? "“皇家皇冠”" : (shape === "alien_ufo" ? "“外星飞碟”" : "“双螺旋”")} 形态中，记录下了由“${primaryLunch}”和“${primaryDinner}”所引发的、几乎痉挛的内脏大回旋${ingestionTimelineDescription}气势汹汹的${currentTextureDiscuss}，在${seasonNames[season]}的万物生长与${timeNames[timeOfDay]}的幽暗转换中，融合生出了流淌着的${currentHybridDescription}，这是一篇令人眩晕、却又无可辩驳的、极具力量的肉身体验赞歌。`,
    
    // 12. 极速前卫速度主义
    `机器在深处咆哮，大肠在瞬间超频！主厨“${artistName}”用极速前卫的 ${shape === "royal_crown" ? "“皇家皇冠”" : (shape === "alien_ufo" ? "“外星飞碟”" : "“双螺旋”")} 动能几何，完美捕获了新陈代谢在穿过生命重力前那一毫秒的电光速度${ingestionTimelineDescription}几乎未作任何温吞发酵或胆怯陈化，“${primaryBreakfast}”瞬间化作了极具刚性曲度的${currentTextureDiscuss}。在${seasonNames[season]}与${timeNames[timeOfDay]}的极致碰撞之下，外部凝聚的${currentHybridDescription}闪耀着高效率和现代工业的傲岸光华，宣照了对温含旧态的彻底宣战。`
  ];

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
    curatorComment: curatorCommentCore + ` ——主厨艺术家：${artistName || "momo"}`,
    season,
    timeOfDay
  };
}

// Complete express backend setup containing ZERO AI packages, purely programmatic synthesis and high-coverage static assets rules
app.post("/api/synthesize", (req, res) => {
  try {
    const { meals, holdingDays, artistName, heldMealsHistory } = req.body;
    
    if (!meals) {
      return res.status(400).json({ error: "Missing meals input" });
    }

    const compiledArt = generateMasterpieceArtProgrammatically(
      meals,
      Number(holdingDays || 0),
      heldMealsHistory || [],
      artistName || "momo"
    );

    return res.json(compiledArt);
  } catch (error: any) {
    console.error("Critical: Algorithmic synthesis pipeline error:", error);
    return res.status(500).json({ error: "Algorithmic synthesis pipeline failed gracefully" });
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
