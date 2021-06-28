/*      
 *  
 *  
 */

﻿var a = 0;
var selects;
var head = "#fUI/UIWindow2.img/Quest/quest_info/summary_icon/summary#\r\n";
var BossList = Array(
        Array("#r[活动] BOSS竞技场！#k", 932200000),
        Array("[简单/普通] 巨大蝙蝠！", 105100100),
        Array("[普通] 帕普拉图斯！", 220080000),
        Array("[普通] 暴力熊/心疤狮王！", 551030100),
        Array("[简单/普通/进阶] 扎昆任务！", 211042200),
        Array("[普通] 妖精女王 - 艾菲尼娅", 300030300),
        Array("[普通/进阶] 暗黑龙王", 240040700),
        Array("[简单/普通] 次元缝隙 - 阿卡伊勒祭坛", 272030300),
        Array("#d[普通/强化] 强化钻机,弱小勿进#k", 703020000),
        //Array("[强化BOSS] 三头犬 - 血量非常多。", 510101100),
        Array("[世界BOSS] 新加坡 - 千年树精王遗迹Ⅱ", 541020700),
        Array("[简单/普通] 狮子王之城 - 班·雷昂", 211070000),
        Array("[普通/困难] 阿斯旺 - 希拉", 262010000),
        Array("[普通/混沌] 时间宠儿 - 品克缤", 270050000),
        Array("#d[普通/进阶] 鲁塔比斯 - 四大天王BOSS #k", 105200000),
        Array("#r[骑士团] 希纳斯的庭院 - 希纳斯", 271030600),
        Array("#r[噩梦牢笼] 心树守护者之地 - 贝勒德入口#k", 863000100),
        Array("#r[噩梦牢笼] 暴君城堡战场 - 暴君麦格纳斯#k", 401053002),
        Array("#r[噩梦牢笼] 秘密祭坛 - 森兰丸(New~)#k", 807300100),
        Array("#r[噩梦牢笼] 比睿山 - 浓姬副本(New~)#k", 811000099),
        Array("#r[噩梦牢笼] 黑色天堂 - 斯乌(New~)#k", 310070490)
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
            var text = head + "为了更方便的游戏，在这里可以传送到BOSS的传送点。\r\n#b";
            for (var i = 0; i < BossList.length; i++) {
                text += "#L" + i + "# " + BossList[i][0] + "\r\n";
            }
            cm.sendSimple(text);
        } else if (a == 1) {
            selects = selection;
            cm.sendYesNo(head + "你现在想出发到" + BossList[selects][0] + "吗？");
        } else if (a == 2) {
            cm.saveLocation("MULUNG_TC");
            cm.warp(BossList[selects][1], 0);
            cm.dispose();
        }//a
    }//mode
}//f