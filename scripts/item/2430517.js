var gift = new Array(
	3015304,
	3010696,
	3015224,
	3015155,
	3015338,
	3015075,
	3015002,
	3010070,
	3010519,
	3010520,
	3015181,
	3015343,
	3015036,
	3015349,
	3015328,
	3016101,
	3015315,
	3015157,
	3016000,
	3015131,
	3010853,
	3015051,
	3010788,
	3010658,
	3010621,
	3010670
	);


function start() {
	status = -1;
	action(1, 0, 0);
}

function action(mode, type, selection) {
	if (mode <= 0) {
		im.dispose();
		return;
	} else {
		if (mode == 1) {
			status++;
		} else {
			status--;
		}
	}

	var item = im.gainGachaponItem(gift[Math.floor(Math.random() * gift.length)], 1, "印第安的金饰宝物袋");
	if (item != -1) {
		im.remove(1);
		//im.gainItem(4310030, 10);
		im.sendOk("你获得了 #b#t" + item + "##k 1 个");
	} else {
		im.sendOk("请你确认在背包的装备，消耗，其他窗口中是否有一格以上的空间。");
	}
	im.safeDispose();
}