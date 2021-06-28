status = -1;
var itemList = Array(

//椅子
Array(
5062024, 80, 10, 3), // 金鱼
Array(
2431741, 300, 2, 3), // 花蘑菇伪装椅子
Array(
1162007, 200, 1, 3), // 扎纳罗非伪装椅子
Array(
2049750, 300, 2, 3), // 扎纳罗非伪装椅子
Array(
5062009, 200, 30, 3), // 白羊座椅子
Array(
1142950, 300, 1, 3), // 白羊座椅子
Array(
5010150, 300, 1, 3), // 白羊座椅子
Array(
2049323, 300, 10, 3), // 白羊座椅子
Array(
5010110, 300, 1, 3), // 白羊座椅子
Array(
4001715, 300, 1, 3), // 白羊座椅子
Array(
1142249, 300, 1, 3), // 白羊座椅子
Array(
2431945, 300, 1, 3), // 白羊座椅子
Array(
2431944, 300, 1, 3), // 白羊座椅子
Array(
1162032, 100, 1, 3), // 白羊座椅子
Array(
1182150, 100, 1, 3) // 白羊座椅子
 
);
function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        if (status == 0) {
            im.sendOk("你要打开神秘箱子吗？");
            im.dispose();
        }
        status--;
    }
    if (status == 0) {
        var chance = Math.floor(Math.random() * 650);
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
			
			/*
			if (im.getChar().getName() == "Super绝y") {
				im.setPQLog("Super绝y");
				if (im.getPQLog("Super绝y") == 3) {
					itemId = 1242060;
					quantity = 1;
					notice = 3;
				}
			}*/
            item = im.gainGachaponItem(itemId, quantity, "神秘箱子", notice);
            if (item != -1) {
				im.gainItem(2431291, -1);
				//im.gainItem(436030, 10);
                im.sendOk("恭喜您，获得了 #b#t" + item + "##k " + quantity + "个");
            } else {
                im.sendOk("请你确认在背包的装备，消耗，其他窗口中是否有一格以上的空间。");
            }
            im.safeDispose();
        } else {
            im.gainItem(2431291, -1);
            im.sendOk("今天的运气可真差，什么都没有拿到。");
            im.safeDispose();
        }
    }
}
