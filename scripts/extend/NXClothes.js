/*      
 *  
 *  功能：绝版点装
 *  
 */


﻿var a = 0;
var text;
var selects; //记录玩家的选项
var buynum = 0;
var itemlist = Array(
        Array(1004156, 300), // 来自星星的你 // 由中国冒险岛玩家"小术"设计。人物带上耳罩后，漂浮起来。后面出现动画效果。
        Array(1004157, 300), // 来自心心的我 // 由中国冒险岛玩家"小术"设计。带上耳罩后，漂浮起来。后面出现动画效果。
        Array(1402037, 200), //龙背
        Array(1402014, 200),
        Array(1072337, 50), // 喜洋洋拖鞋 // (无描述)
        Array(1042198, 80), // 彩虹T恤 // (无描述)
        Array(1042321, 50), // 心花怒放T恤 // (无描述)
        Array(1112254, 80), // 豪华珍珠聊天戒指 // 由中国冒险岛玩家小术设计，在海底珍珠玲珑光芒的环绕下轻松愉快的聊天吧。
        Array(1112143, 80), // 豪华珍珠名片戒指 // 由中国冒险岛玩家小术设计，在海底珍珠玲珑光芒的环绕下展示自己的昵称吧。
        Array(1112118, 50), // 可乐名片戒指 // 角色造型下面，以可口可乐颜色作为底色，以白色字体显示角色名称。
        Array(1112119, 50), // 可乐(Red) 名片戒指 // 角色造型下面，以可口可乐颜色作为底色，以白色字体显示角色名称。
        Array(1112120, 50), // 可乐(White) 名片戒指 // 角色造型下面，以可口可乐颜色作为底色，以红色字体显示角色名称。
        Array(1112228, 50), // 可乐聊天戒指 // 角色对话的时候，聊天窗会变成可口可乐样子
        Array(1112229, 50), // 可乐(Red)聊天戒指 // 角色对话的时候，聊天窗会变成类似可口可乐样子
        Array(1112230, 50), // 可乐(White)聊天戒指 // 角色对话的时候，聊天窗会变成类似可口可乐样子
        Array(1002524, 50), // 可乐帽 // (无描述)
        Array(1702533, 100), // 奶兔立拍得 // 由中国玩家“小术”设计的奶兔立拍得。\n可以装备在#c所有武器#上的武器。
        Array(1702020, 10), // 棒棒糖 // 可装备在#c/单手剑/单手斧/单手钝器/短杖/长杖/短刀/魔法棒/的主武器#上。
        Array(1702459, 100), // 棉花糖武器 // 攻击时可以看到羊形态的棉花糖。可装备在#c所有的主武器#上。
        Array(1702302, 100), // 杯具 // 可装备在#c除了/手炮/双弩枪/以外的主武器#上。
        Array(1042285, 50), // 拼色点点T恤 // (无描述)
        Array(1042204, 50), // 汉堡T恤 // (无描述)
        Array(1000050, 30), // 薄荷雪水晶 // 装备后可以漂浮在空中，同时伴随雪花特效。
        Array(1112103, 20), // 嫩黄名片戒指 // 在角色的下面出来黄底黑字角色名。
        Array(1112253, 50), // 木乃伊对话框戒指 // 角色对话时, 显示绷带对话框。
        Array(1112142, 50), // 木乃伊名片戒指 // 在角色下面的绷带上显示角色名。
        Array(1112135, 50), // 水墨花名片戒指 // 在角色脚底下，用以水墨画背景用白色的字体显示角色名字。
        Array(1112238, 50), // 水墨花聊天戒指 // 角色在聊天时，会出现水墨画对话框。
        Array(1004014, 50),
        Array(1004026, 25),
        Array(1004027, 25),
        Array(1004028, 25),
        Array(1004029, 30),
        Array(1003588, 50), // 玩具粉熊帽子 // (无描述)
        Array(1003843, 300), // 奇怪的狐狸面具 // 平时附在头顶，会根据动作显示不一样的形象。攻击时会戴在脸上的面具型帽子
        Array(1002846, 20), //华尔兹丝带贝雷帽
        Array(1050152, 15), //水兵服(男)
        Array(1051180, 15), //水兵服(女)
        Array(1042104, 15), //小绿叶T恤
        Array(1042105, 15), //小红叶T恤
        Array(1002845, 20), //粉红兔耳帽
        Array(1052224, 20), //草莓baby装
        Array(1702228, 30), //可可香蕉
        Array(1002721, 10), //狸毛护耳
        Array(1002568, 10), //手工编织发夹
        Array(1702155, 30), //绚丽彩虹
        Array(1042142, 30), //彩虹条背心
        Array(1062093, 30), //嫩绿休闲短裤
        Array(1112904, 50), //彩虹星环绕戒指
        Array(1041142, 20), //巨星蛋糕吊带
        Array(1061148, 20), //巨星粉色短裙
        Array(1702182, 50), //洛丽波板糖
        Array(1002888, 10), //丝带发箍(红色)
        Array(1002890, 10), //丝带发箍(蓝色)
        Array(1052200, 30), //罗丽粉色娃娃套服
        Array(1702208, 50), //搞怪鳄鱼
        Array(1002863, 10), //小熊熊可爱帽
        Array(1052061, 5), //巴西足球服No.9
        Array(1052059, 5), //法国足球服No.14
        Array(1003207, 30), //胡萝卜兔爆炸头
        Array(1702285, 50), //蓝色蝴蝶结手提包
        Array(1012131, 5), //好白的牙
        Array(1702261, 50), //樱花棒
        Array(1702091, 50), //网球拍
        Array(1702168, 100), //闪亮圣诞树
        Array(1003051, 50), //小狐狸
        Array(1003048, 20), //圣诞装饰帽
        Array(1002995, 20), //皇家海军帽
        Array(1003012, 5), //嫦娥发式
        Array(1002876, 10), //圣诞红发夹
        Array(1002839, 20), //南瓜棒球帽
        Array(1001048, 20), //鬼娃娃帽
        Array(1102225, 20), //嫦娥披风
        Array(1102217, 20), //九尾披风
        Array(1102157, 15), //傀儡枷锁
        Array(1051131, 20), //圣诞女孩子服
        Array(1112916, 50), //寂寞单身戒指
        Array(1012179, 10), //鹿鼻子
        Array(1051152, 10), //玫瑰红晚宴裙
        Array(1050210, 30), //蓝色小背带服
        Array(1112141, 10), //红玫瑰名片戒指
        Array(1112252, 10), //红玫瑰聊天戒指
        Array(1051280, 20), //端庄航服
        Array(1052426, 20), //战斗修女服
        Array(1051278, 20), //樱桃雪套服
        Array(1050229, 20), //端庄韩服
        Array(1050227, 20), //薄荷雪套服
        Array(1051235, 10), //橙色小鸡裙子
        Array(1052201, 10), //闪亮水手外套
        Array(1050232, 10), //甘菊下午茶
        Array(1051282, 10), //迷迭香下午茶
        Array(1052425, 10), //战斗牧师服
        Array(1052412, 10), //淘气王子
        Array(1102503, 30), //猫咪洛丽塔披风
        Array(1052455, 10), //小蜜蜂外套
        Array(1052503, 10), //凉爽夏日全身装
        Array(1051261, 10), //童话幻想
        Array(1050230, 10), //淘淘可爱礼服
        Array(1050231, 10), //侍女服
        Array(1051149, 10), //韩式公主服
        Array(1051192, 10), //海洋裹裹短裙
        Array(1051255, 10), //黄色晚礼服
        Array(1051256, 10), //蓝色小背带裙
        Array(1112422, 100), //炫色板戒指
        Array(1112424, 100), //黑羽笔戒指
        Array(1112930, 50), //西红柿效果90天
        Array(1112136, 5), //香腊肠名片戒指
        Array(1102453, 50),
        Array(1102450, 50),
        Array(1102451, 50),
        Array(1102452, 50),
        Array(1102511, 50),
        Array(1102385, 50),
        Array(1102386, 50),
        Array(1102487, 50),
        Array(1112920, 15), //
        Array(1702367, 15),
        Array(1702341, 15),
        Array(1322102, 15),
        Array(1702366, 15),
        Array(1702352, 15),
        Array(1302037, 15),
        Array(1302061, 15),
        Array(1302063, 15),
        Array(1302080, 15),
        Array(1302084, 15),
        Array(1302085, 15),
        Array(1302087, 15),
        Array(1302169, 15),
        Array(1322051, 15),
        Array(1332032, 15),
        Array(1332053, 15),
        Array(1372017, 15),
        Array(1372031, 15),
        Array(1402049, 15),
        Array(1402063, 15),
        Array(1422011, 15),
        Array(1432039, 15),
        Array(1432046, 15),
        Array(1442026, 15),
        Array(1442065, 15),
        Array(1442088, 15),
        Array(1472063, 15),
        Array(1702342, 15),
        Array(1702337, 15),
        Array(1702335, 15),
        Array(1702330, 15),
        Array(1702346, 15),
        Array(1702341, 15),
        Array(1702340, 15),
        Array(1702324, 15),
        Array(1322102, 15),
        Array(1412056, 15),
        Array(1402110, 15),
        Array(1702310, 15),
        Array(1702329, 15),
        Array(1702316, 15),
        Array(1702309, 15),
        Array(1102380, 15),
        Array(1102385, 15),
        Array(1102386, 15),
        Array(1102238, 15),
        Array(1102241, 15),
        Array(1102248, 15),
        Array(1102245, 15),
        Array(1102265, 15),
        Array(1102285, 15),
        Array(1102286, 15),
        Array(1102287, 15),
        Array(1102270, 15),
        Array(1102273, 15),
        Array(1102288, 15),
        Array(1102253, 15),
        Array(1102298, 15),
        Array(1102299, 15),
        Array(1102297, 15),
        Array(1102310, 15),
        Array(1102319, 15),
        Array(1102272, 15),
        Array(1102323, 15),
        Array(1102324, 15),
        Array(1102349, 15),
        Array(1102325, 15),
        Array(1102326, 15),
        Array(1102338, 15),
        Array(1102350, 15),
        Array(1102374, 15),
        Array(1102353, 15),
        Array(1102357, 15),
        Array(1003214, 15),
        Array(1003141, 15),
        Array(1003269, 15),
        Array(1003268, 15),
        Array(1003492, 15),
        Array(1003493, 15),
        Array(1003494, 15),
        Array(1003495, 15),
        Array(1003496, 15),
        Array(1003519, 15),
        Array(1003520, 15),
        Array(1002726, 15),
        Array(1002524, 15),
        Array(1002714, 15),
        Array(1002841, 15),
        Array(1003220, 15),
        Array(1003219, 15),
        Array(1003170, 15),
        Array(1003226, 15),
        Array(1003227, 15),
        Array(1003232, 15),
        Array(1001064, 15),
        Array(1001075, 15),
        Array(1003252, 15),
        Array(1003249, 15),
        Array(1001036, 15),
        Array(1002425, 15),
        Array(1002677, 15),
        Array(1002702, 15),
        Array(1002707, 15),
        Array(1002728, 15),
        Array(1002743, 15),
        Array(1002749, 15),
        Array(1002758, 15),
        Array(1002788, 15),
        Array(1002812, 15),
        Array(1002851, 15),
        Array(1002858, 15),
        Array(1002867, 15),
        Array(1002939, 15),
        Array(1002971, 15),
        Array(1002972, 15),
        Array(1002980, 15),
        Array(1002997, 15),
        Array(1002998, 15),
        Array(1003091, 15),
        Array(1003114, 15),
        Array(1003075, 15),
        Array(1000043, 15),
        Array(1003149, 15),
        Array(1002988, 15),
        Array(1003154, 15),
        Array(1003159, 15),
        Array(1003169, 15),
        Array(1003193, 15),
        Array(1003194, 15),
        Array(1003195, 15),
        Array(1003196, 15),
        Array(1003271, 15),
        Array(1003360, 15),
        Array(1003359, 15),
        Array(1003417, 15),
        Array(1112204, 15),
        Array(1003581, 20),
        Array(1042263, 20),
        Array(1062173, 10),
        Array(1072820, 10),
        Array(1702422, 20),
        Array(1112101, 10),
        Array(1112937, 20),
        Array(1012134, 10),
        Array(1112907, 20),
        Array(1112928, 20),
        Array(1050119, 20),
        Array(1042198, 20),
        Array(1062072, 20),
        Array(1002566, 20),
        Array(1112145, 20),
        Array(1112257, 20),
        Array(1112146, 20),
        Array(1112258, 20),
        Array(1082549, 20),
        Array(1082548, 20),
        Array(1072843, 20),
        Array(1072832, 20),
        Array(1062174, 20),
        Array(1042204, 20),
        Array(1012208, 20),
        Array(1012165, 20),
        Array(1012412, 20),
        Array(1012413, 20),
        Array(1702442, 20),
        Array(1702422, 20),
        Array(1702446, 20),
        Array(1702460, 20),
        Array(1702408, 20),
        Array(1702415, 20),
        Array(1702403, 20),
        Array(1702402, 20),
        Array(1702375, 20),
        Array(1702348, 20),
        Array(1003965, 20),
        Array(1003964, 20),
        Array(1003920, 20),
        Array(1003921, 20),
        Array(1003918, 20),
        Array(1003861, 20),
        Array(1003865, 20),
        Array(1003919, 20),
        Array(1102593, 20),
        Array(1102564, 20),
        Array(1102615, 20),
        Array(1052661, 20),
        Array(1042277, 20),
        Array(1060181, 20),
        Array(1052593, 20),
        Array(1052536, 20),
        Array(1050312, 20),
        Array(1042236, 20),
        Array(1042240, 20),
        Array(1062157, 20),
        Array(1042265, 20),
        Array(1042241, 20),
        Array(1062156, 20),
        Array(1042238, 20),
        Array(1040192, 20),
        Array(1041194, 20),
        Array(1003505, 20),
        Array(1003504, 20),
        Array(1061207, 20)
        );

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
            text = "#h0#,您可以在这里兑换#e#b绝版点装#r(试穿模式)#n#k,所购买物品#r试穿时间为5分钟#k，请选择你想要购买的物品\r\n#b#L0#点我进入到永久商城#l\r\n\r\n#b";
            for (var i = 1; i <= itemlist.length; i++) {
                if (!cm.isCash(itemlist[i - 1][0]))
                {
                    continue;
                }
                text += "#L" + (i) + "##i" + itemlist[i - 1] + ":##t" + itemlist[i - 1] + "# - #r" + (itemlist[i - 1][1] * 10) + "#b抵用券  \r\n";
                if (i != 0 && (i + 1) % 5 == 0) {
                    text += "\r\n";
                }
            }
            cm.sendSimple(text);
        } else if (a == 1) {
            if (selection == 0) {
                cm.dispose();
                cm.openNpc(9000069, 1);
                return;
            } else {
                selects = (selection - 1);
                // cm.sendGetNumber("请输入你请你输入想要购买的数量#v"+itemlist[selects]+"#\r\n\r\n#r1个需要" + (itemlist[selects][1]*10) + "个#b抵用券#k", 0, 0, 999999);
            }
            buynum = 1;
            cm.sendYesNo("你想购买" + buynum + "个#r#i" + itemlist[selects][0] + "##k？\r\n你将使用掉" + (buynum * itemlist[selects][1] * 10) + "抵用券。");
        } else if (a == 2) {
            if (cm.getPlayer().getCSPoints(2) >= buynum * itemlist[selects][1] * 10) {
                cm.gainNX(2, -buynum * itemlist[selects][1] * 10);
                cm.gainItemPeriod(itemlist[selects][0], buynum, 5 * 60 * 1000);
                cm.sendOk("购买成功了！#r试穿时间为5分钟#k");
                cm.dispose();
            } else {
                cm.sendOk("对不起，你没有足够的抵用券。");
                cm.dispose();
            }
        }
    }//mode
}//f