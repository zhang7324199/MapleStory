﻿status = -1;
var itemList = Array(
// ------ 卷轴 ------
Array(1012270, 500, 1, 3), //祥龙单手武器攻击卷99% 
Array(1122162, 500, 1, 3), //祥龙单手武器魔力卷99% 
Array(1152085, 500, 1, 3),
Array(1182001, 500, 1, 3),
Array(1182000, 500, 1, 3),
Array(1182005, 500, 1, 3),
Array(1182004, 500, 1, 3),
Array(1182003, 500, 1, 3),
Array(1182002, 500, 1, 3),
Array(1132145, 500, 1, 3),
Array(1102327, 500, 1, 3),
Array(1122007, 500, 1, 3),//祥龙双手武器攻击卷99%
Array(1182016, 50, 1, 3),
Array(1182017, 30, 1, 3),
Array(1112401, 500, 1, 3),
Array(1112402, 500, 1, 3)
);

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        if (status == 0) {
            im.sendOk("不想使用吗？…我的肚子里有各类#b奇特座椅或卷轴、装备、新奇道具#k哦！");
            im.dispose();
        }
        status--;
    }
    if (status == 0) {
        var chance = Math.floor(Math.random() * 500);
        var finalitem = Array();
        for (var i = 0; i < itemList.length; i++) {
            if (itemList[i][1] >= chance) {
                finalitem.push(itemList[i]);
            }
        }
        if (finalitem.length != 0) {
            var item;
            var random = new java.util.Random();
            var finalchance = random.nextInt(finalitem.length);
            var itemId = finalitem[finalchance][0];
            var quantity = finalitem[finalchance][2];
            var notice = finalitem[finalchance][3];
            item = im.gainGachaponItem(itemId, quantity, "迷你礼物箱", notice);
            if (item != -1) {
		im.gainItem(2433243, -1);
		//im.gainNX(1, -20000);
             //im.warp(910000000, 0);
                im.sendOk("恭喜你获得了 #b#t" + item + "##k ");
            } else {
                im.sendOk("请你确认在背包的装备，消耗，其他窗口中是否有一格以上的空间。");
            }
            im.safeDispose();
        } else {
            im.sendOk("今天的运气可真差，什么都没有拿到。");
            im.safeDispose();
        }
    }
}