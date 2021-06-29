/*
	制作：彩虹工作室
	功能：隐藏箱子，记忆抽奖
	时间：2016年12月24日
 */

var a = 0;
var luckyItem = Array();
var selectedItem;
var pass = true;
var needOnlineTime = 20;		//需要在线时间
var Allitem = Array(
        2001532, //苹果
        1482075, //一代不速之客 指节
        1452104, //三代不速之客弓
        1312077, //传说狂龙怒斩
        1482076, //二代不速之客 指节
        1312068, //冒险岛宝石斧
        2040313, //耳环智力卷轴65%
        2040335, //耳环装饰敏捷卷轴65%
        2040337, //耳环装饰运气卷轴65%
        2040431, //上衣力量卷轴65%
        2040435, //上衣运气卷轴65%
        2040522, //全身盔甲敏捷卷轴65%
        2040528, //全身盔甲幸运卷轴65%
        2040526, //全身盔甲智力卷轴65%
        2040540, //全身盔甲力量卷轴65%
        2040615, //裤裙防御卷轴65%
        2040720, //鞋子跳跃卷轴65%
        2040819, //手套敏捷卷轴65%
        2040635, //裤裙敏捷卷轴65%
        2040821, //手套攻击卷轴65%
        2040941, //盾牌力量卷轴65%
        2041052, //披风智力卷轴65%
        2040937, //盾牌运气卷轴65%
        2041054, //披风敏捷卷轴65%
        2041056, //披风幸运卷轴65%
        2043011, //单手剑攻击卷轴65%
        2043106, //单手斧攻击卷轴65%
        2043206, //单手钝器攻击卷轴65%
        2043403, //刀攻击力卷轴65%
        2043706, //短杖魔力卷轴65%
        2043306, //短剑攻击卷轴65%
        2043806, //长杖魔力卷轴65%
        2044006, //双手剑攻击卷轴65%
        2044106, //双手斧攻击卷轴65%
        2044206, //双手钝器攻击卷轴65%
        2044218, //单手钝器命中卷轴65%
        2044306, //枪攻击卷轴65%
        2044406, //矛攻击卷轴65%
        2044506, //弓攻击卷轴65%
        2044606, //弩攻击卷轴65%
        2044706, //拳套攻击卷轴65%
        2044811, //拳甲攻击卷轴65%
        2044813, //指节命中卷轴65%
        2044906, //短枪攻击卷轴65%
        2045206, //双弩枪攻击力卷轴65%
        2049122, //50%混沌卷
        2049118, //60%混沌卷
        1322007, //皮制手提包
        1322008, //007提包
        1322009, //马桶吸
        1322010, //方形铁铲
        1322011, //三角铁铲
        1322012, //红色砖头
        1322056, //粉色花边游泳圈
        1322060, //永恒惊破天
        1322061, //重生惊破天
        1322065, //圣诞六翼天使武器(单手钝器)
        1322071, //采矿铁锹
        1332053, //野外烧烤串
        1332057, //枫叶3年旗
        1332059, //粉色花边游泳圈
        1332063, //初级盗贼的短剑
        1332066, //新手刮胡刀
        1402006, //高原之剑
        1402007, //半月巨刀
        1402008, //钢铁剑
        1402009, //木球棍
        1402010, //铝球棍
        1402011, //无极剑
        1402012, //霸王剑
        1402013, //白日剑
        1402015, //亚历山大之剑
        3010079, //肥猫猫椅子
        1442111, //至尊不速之客矛
        1442110, //末代不速之客矛
        1432081, //至尊不速之客枪
        1422063, //至尊不速之客双手钝器
        1412062, //至尊不速之客双手斧
        1402090, //至尊不速之客双手剑
        1322090, //至尊不速之客单手钝器
        1312062, //至尊不速之客单手斧
        2045308, //手炮攻击力卷轴65%


        // 椅子部分

        3010106,
//雪狼战椅
//战神最爱的雪狼。\n每10秒HP和MP各恢复50。

        3010107,
//龙龙的蛋壳椅
//坐在上面时，每10秒恢复HP的龙龙的蛋壳。是只有龙神可以拥有的特殊椅子。

        3010108,
//幼龙秋千
//幼龙晃动的秋千椅。坐在上面，每10秒HP恢复40，MP恢复20。

        3010109,
//暖炉椅
//让人感觉温暖的椅子，使用后每10秒恢复HP 40、MP 20。

        3010110,
//舒适大白熊椅子
//抱着非常的温暖，每10秒钟回复HP、MP各50。

        3010111,
//虎虎生威
//王者最爱的椅子。坐在上面每10秒钟可恢复HP50、MP30。

        3010112,
//情书柜子
//堆满情书的柜子,适合送给恋人的椅子..\n每10秒钟恢复HP 50.

        3010113
//幽魂发条熊椅子
//使用后每10秒恢复HP 50。



        /*
         // 能手册部分！
         2290868,
         //英雄的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得英雄所需的一本能手册。
         2290869,
         //圣骑士的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得圣骑士所需的一本能手册。
         
         2290870,
         //黑骑士的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得黑骑士所需的一本能手册。
         
         2290871,
         //火毒魔导师的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得火毒魔导师所需的一本能手册。
         
         2290872,
         //冰雷魔导师的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得冰雷魔导师所需的一本能手册。
         
         2290873,
         //主教的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得主教所需的一本能手册。
         
         2290874,
         //神射手的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得神射手所需的一本能手册。
         
         2290875,
         //箭神的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得箭神所需的一本能手册。
         
         2290876,
         //侠盗的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得侠盗所需的一本能手册。
         
         2290877,
         //隐士的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得隐士所需的一本能手册。
         
         2290878,
         //暗影双刀的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得暗影双刀所需的一本能手册。
         
         2290879,
         //冲锋队长的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得冲锋队长所需的一本能手册。
         
         2290880,
         //船长的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得船长所需的一本能手册。
         
         2290881,
         //火炮手的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得火炮手所需的一本能手册。
         
         2290882,
         //战神的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得战神所需的一本能手册。
         
         2290883,
         //龙神的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得龙神所需的一本能手册。
         
         2290884,
         //双弩精灵的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得双弩精灵所需的一本能手册。
         
         2290885,
         //恶魔猎手的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得恶魔猎手所需的一本能手册。
         
         2290886,
         //唤灵斗师的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得唤灵斗师所需的一本能手册。
         
         2290887,
         //豹弩游侠的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得豹弩游侠所需的一本能手册。
         
         2290888,
         //机械师的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得机械师所需的一本能手册。
         
         2290889,
         //幻影的神秘能手册
         //未知的神秘能手册。双击后，可以随机获得幻影所需的一本能手册。
         
         2290890,
         //夜光法师的神秘的能手册
         //未知的神秘能手册。双击后，可以随机获得夜光法师所需的一本能手册。
         
         2290891,
         //狂龙战士神秘能手册
         //未知的神秘能手册。双击后，可以随机获得狂龙战士所需的一本能手册。
         
         2290892
         //爆莉萌天使神秘能手册
         //未知的神秘能手册。双击后，可以随机获得爆莉萌天使所需的一本能手册。
         */
        )

function start() {
    a = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 1)
            a++;
        else
            a--;
        if (a == -1) {
            cm.dispose();
        } else if (a == 0) {
			if (cm.getPlayer().getTodayOnlineTime() < needOnlineTime) {
				cm.sendNextS("您当前在线时间不足#r" + needOnlineTime + "#k分钟,无法参与该活动,\r\n请#r" + (needOnlineTime - cm.getPlayer().getTodayOnlineTime()) + "#k分钟后再试.", 3);
				cm.dispose();
				return;
			}
            if (cm.getBossLog('HOTTIME隐藏的箱子') >= 1) {
                cm.sendNextS("今天你不能再参加这个活动了。\r\n隐藏的箱子活动一天只能进行一次。", 3)
                cm.dispose();
                return;
            }
            for (var i = 1; i < 5; i++) {
                if (cm.getSpace(i) < 1) {
                    pass = false;
                }
            }
            if (pass) {
                var text = " #e今天我可能领取到的物品为：#n\r\n#r  - 请仔细看好您要的装备，稍后会打乱目录。\r\n  - 打乱目录后的道具将以问号箱子显示。\r\n  - 届时只要点击你想要的问号箱子，就可以领取道具了！\r\n\r\n#b";
                Allitem.sort(function() {
                    return 0.5 - Math.random()
                })//随机打乱道具池
                for (var i = 0; i < Allitem.length; i++) {
                    if (i % 5 == 0 && i % 3 == 0) {
                        luckyItem.push(Allitem[i]);//特定计算部分加载到 可领取数组里面
                    }
                }
                for (var i = 0; i < luckyItem.length; i++) {
                    text += "#i" + luckyItem[i] + "# #z" + luckyItem[i] + "#\r\n"
                }
                cm.sendNextS(text, 3)
                cm.setBossLog('HOTTIME隐藏的箱子')
            } else {
                cm.sendOk("请让你的所有背包栏空出一个格子。")
                cm.dispose();
            }
        } else if (a == 1) {
            luckyItem.sort(function() {
                return 0.5 - Math.random()
            })//随机打乱道具池
            var text = "今天的奖品都变成了可疑的箱子，并且被打乱了。\r\n咦，到底是哪个呢？\r\n\r\n#b"
            for (var i = 0; i < luckyItem.length; i++) {
                text += "#L" + i + "##fUI/UIWindow.img/QuestIcon/5/0#    打开便知晓!#l\r\n"

            }
            cm.sendSimpleS(text, 3)
        } else if (a == 2) {
            var n = selection + 1
            var text = "我刚才选择的是第" + n + "个道具.现在秘密箱子里面的道具跑出来了:\r\n - 点击下一步领取物品。\r\n\r\n#b"
            selectedItem = luckyItem[selection]
            for (var i = 0; i < luckyItem.length; i++) {
                if (selection == i) {
                    text += "#e#i" + luckyItem[i] + "#    #z" + luckyItem[i] + "#   (您选择的箱子 )\r\n#n"
                } else {
                    text += "#i" + luckyItem[i] + "#    #z" + luckyItem[i] + "#\r\n"
                }
            }
            cm.sendNextS(text, 3)
        } else if (a == 3) {
            cm.gainItem(selectedItem, 1);
            cm.sendOk("成功打开箱子，我赠送给你了 #b#t" + selectedItem + "##k。")
            cm.dispose();
        }//a
    }//mode
}//f