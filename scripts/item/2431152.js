status = -1;
var itemList = Array(
// ------ 音符 ------
Array(5062002, 500, 2, 3), //音符X1 
Array(5062002, 500, 1, 3), //音符X2
Array(5062002, 500, 3, 3), //音符X1 
Array(5062002, 500, 3, 3), //音符X2
Array(5062002, 500, 2, 3), //音符X1 
Array(5062002, 500, 1, 3), //音符X1 
Array(5062002, 500, 1, 3), //音符X2 
Array(5062002, 500, 3, 3) //音符X1 
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
            item = im.gainGachaponItem(itemId, quantity, "每日礼物箱子", notice);
            if (item != -1) {
		im.gainItem(2431152, -1);
                im.sendOk("你获得了 #b#t" + item + "##k " + quantity + "个。");
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
