status = -1;
var itemList;
var random = java.lang.Math.floor(Math.random() * 7 + 1);
if(random == 1){
itemList = Array(
// ------ 卷轴 ------
Array(2003570, 500, 1, 3),
Array(1122200, 500, 1, 3),//吊坠
Array(1032148, 500, 1, 3),//耳环
Array(1132161, 500, 1, 3),//腰带
Array(1152099, 500, 1, 3),//护肩
Array(1142742, 500, 1, 3),//100奖杯
Array(1102467, 500, 1, 3),//披风
Array(1082438, 500, 1, 3),//手套
Array(1042003, 500, 1, 3),//GM衣服
Array(1112748, 500, 1, 3),//戒指
Array(1072672, 500, 1, 3),//鞋子
Array(2614014, 500, 1, 3),//破攻
Array(1032148, 500, 1, 3),//耳环
Array(1132161, 500, 1, 3),//腰带
Array(1152099, 500, 1, 3),//护肩
Array(1003561, 500, 1, 3),//羽毛帽子
Array(1102467, 500, 1, 3),//披风
Array(1082438, 500, 1, 3),//手套
Array(1322013, 500, 1, 3),//GM武器
Array(1112748, 500, 1, 3),//戒指
Array(1072672, 500, 1, 3),//鞋子
Array(4001812, 500, 1, 3),//MXB
Array(4310088, 500, 1, 3),//red
Array(4310088, 500, 1, 3),
Array(4001812, 500, 1, 3),//MXB
Array(4310088, 500, 1, 3)//red
);
} else if(random == 2){
itemList = Array(
Array(4310088, 500, 1, 3),
Array(4001812, 500, 1, 3),
Array(4310088, 500, 1, 3),
Array(4310088, 500, 1, 3),
Array(4001812, 500, 1, 3),
Array(4310088, 500, 1, 3),
Array(4310088, 500, 1, 3),
Array(4001785, 500, 1, 3),
Array(4310088, 500, 1, 3),
Array(4001812, 500, 1, 3),
Array(4310088, 500, 1, 3),
Array(4001812, 500, 1, 3),
Array(4310088, 500, 1, 3),
Array(4001812, 500, 1, 3),
Array(4310088, 500, 1, 3),
Array(4001812, 500, 1, 3),
Array(4001785, 500, 1, 3),
Array(4001785, 500, 1, 3),
Array(4001785, 500, 1, 3),
Array(4001785, 500, 1, 3),
Array(4001785, 500, 1, 3),
Array(4310088, 500, 1, 3),
Array(4310088, 500, 1, 3),
Array(4310080, 500, 1, 3),
Array(4310080, 500, 1, 3),
Array(4310080, 500, 1, 3),
Array(4310080, 500, 1, 3),
Array(4310080, 500, 1, 3),
Array(4310080, 600, 1, 3),
//Array(1062166, 500, 1, 3),2049100 4310110
Array(4310110, 500, 1, 3)
);
} else if(random == 3){
itemList = Array(
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3)
);
} else if(random == 4){
itemList = Array(
Array(4310110, 500, 1, 3),
Array(4310110, 500, 1, 3),
Array(2049100, 500, 1, 3),
Array(2049100, 500, 1, 3),
Array(2049100, 500, 1, 3),
Array(2049100, 500, 1, 3),
Array(2049100, 500, 1, 3),
Array(2049100, 500, 1, 3),
Array(2049100, 500, 1, 3),
Array(2049100, 500, 1, 3),
Array(2049100, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3)
);
} else if(random == 5){
itemList = Array(
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310034, 500, 1, 3),
Array(4310057, 500, 1, 3),
Array(4310057, 500, 1, 3),
Array(4310057, 500, 1, 3)
);
} else if(random == 6){
itemList = Array(
Array(4310057, 500, 1, 3),
Array(4310057, 500, 1, 3),
Array(4310057, 500, 1, 3),
Array(4310057, 500, 1, 3),
Array(4310057, 500, 1, 3),
Array(4310057, 500, 1, 3),
Array(4310057, 500, 1, 3),
Array(4310057, 500, 1, 3)
);
} else if(random == 7){
itemList = Array(
Array(4310057, 500, 1, 3),
Array(4310057, 500, 1, 3),
Array(4310057, 500, 1, 3),
Array(4001785, 500, 1, 3)
);
}

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
        var chance = Math.floor(Math.random() * 1100);
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
            item = im.gainGachaponItem(itemId, quantity, "神龙礼盒", notice);
            if (item != -1) {
		im.gainItem(2430096, -1);
                im.sendOk("你获得了 #b#t" + item + "##k " + quantity + "个。");
            } else {
                im.sendOk("请你确认在背包的装备，消耗，其他窗口中是否有一格以上的空间。");
            }
            im.safeDispose();
        } else {
	    im.gainItem(2430096, -1);
            im.sendOk("今天的运气可真差，什么都没有拿到。");
            im.safeDispose();
        }
    }
}
