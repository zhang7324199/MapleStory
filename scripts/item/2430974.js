var status = 0;
var text;
var itemlist = new Array(
Array(1042254,1), //
Array(1042255,1), //
Array(1042256,1), //
Array(1042257,1), //
Array(1042258,1), //
Array(1003797,1), //
Array(1003798,1), //
Array(1003799,1), //
Array(1003800,1), //
Array(1003801,1), //
Array(1062165,1), //
Array(1062166,1), //
Array(1062167,1), //
Array(1062168,1), //
Array(1062169,1) //
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
		text = "想兑换什么东西呢？\r\n\r\n";
		for (var i in itemlist) {
			text += "#L" + i + "##i" + itemlist[i][0] + "##z" + itemlist[i][0] + "# " + itemlist[i][1] +  "个#l\r\n";
		}
		im.sendSimple(text);
	} else if (status == 1) {
		var item = itemlist[selection];
		im.remove(1);
		im.gainItem(item[0], item[1]);
		im.sendOk("恭喜你获得了#i" + item[0] + "##z" + item[0] + "# " + item[1] + "个。");
		im.dispose();
	}
}
