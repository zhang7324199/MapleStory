status = -1;
var itemList = Array(
        Array(1532098, 600, 1, 3), //
        Array(1522094, 600, 1, 3), //
        Array(1492179, 600, 1, 3), //
        Array(1482168, 600, 1, 3), //
        Array(1472214, 600, 1, 3), //
        Array(1462193, 600, 1, 3), //
        Array(1452205, 600, 1, 3), //
        Array(1442223, 600, 1, 3), //
        Array(1432167, 300, 1, 3), //
        Array(1422140, 600, 1, 3), //
        Array(1412135, 600, 1, 3), //
        Array(1402196, 600, 1, 3), //
        Array(1382208, 600, 1, 3), //
        Array(1372177, 600, 1, 3), //
        Array(1342082, 600, 1, 3), //
        Array(1332225, 600, 1, 3), //
        Array(1322203, 600, 1, 3), //
        Array(1312153, 600, 1, 3), // 
        Array(1302275, 600, 1, 3), //
        Array(1242061, 600, 1, 3), //
        Array(1242060, 600, 1, 3), //
        Array(1232057, 600, 1, 3), //
        Array(1222058, 600, 1, 3), //
        Array(1003797, 600, 1, 3), //
        Array(1003798, 600, 1, 3), //
        Array(1003799, 600, 1, 3), //
        Array(1003800, 600, 1, 3), //
        Array(1003801, 600, 1, 3), //
        Array(1042254, 600, 1, 3), //
        Array(1042255, 600, 1, 3), //
        Array(1042256, 600, 1, 3), //
        Array(1042257, 600, 1, 3), //
        Array(1042258, 600, 1, 3), //
        Array(1062165, 600, 1, 3), //
        Array(1062166, 600, 1, 3), //
        Array(1062167, 600, 1, 3), //
        Array(1062168, 600, 1, 3), //
        Array(1062169, 600, 1, 3), //
        Array(1212063, 600, 1, 3), //
        Array(2046074, 600, 1, 3), //
        Array(2046075, 600, 1, 3), //
        Array(2046149, 600, 1, 3), //
        Array(2046074, 600, 1, 3), //
        Array(2046075, 600, 1, 3), //
        Array(2046149, 600, 1, 3), //
        Array(2046074, 600, 1, 3), //
        Array(2046075, 600, 1, 3), //
        Array(2046149, 600, 1, 3), //
        Array(1122122, 600, 1, 3), //
        Array(1122123, 600, 1, 3), //
        Array(1122124, 600, 1, 3), //
        Array(1122125, 600, 1, 3), //
        Array(1122126, 600, 1, 3), //
        Array(1152112, 600, 1, 3), //
        Array(1152111, 600, 1, 3), //
        Array(1152113, 600, 1, 3), //
        Array(1152110, 600, 1, 3), //
        Array(1152108, 600, 1, 3),
        Array(1152112, 600, 1, 3), //
        Array(1152111, 600, 1, 3), //
        Array(1152113, 600, 1, 3), //
        Array(1152110, 600, 1, 3), //
        Array(1152108, 600, 1, 3)
        );

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (status == 0 && mode == 0) {
        im.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    } else {
        status--;
    }
    if (status == 0) {
        var chance = Math.floor(Math.random() * 600);
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
            item = im.gainGachaponItem(itemId, quantity, "饲养礼包", notice);
            if (item != -1) {
                im.gainItem(2430066, -1);
                im.sendOk("你获得了 #b#t" + item + "##k " + quantity + "个。");
            } else {
                im.sendOk("请你确认在背包的装备，消耗，其他窗口中是否有一格以上的空间。");
            }
            im.safeDispose();
        } else {
            im.sendOk("今天的运气可真差，什么都没有拿到。");
             im.gainItem(2430066, -1);
            im.safeDispose();
        }
    }
}