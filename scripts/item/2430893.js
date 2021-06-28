status = -1;
var itemList = Array(
1353105,
1342095,
1352009,
1352109,
1352206,
1352216,
1352226,
1352276,
1352286,
1352296,
1352406,
1352506,
1352707,
1352815,
1352906,
1352916,
1352935,
1352945,
1352957,
1352967,
1352975,
1353006,
1352928,
1352236,
1352246,
1352256,
1352266,
1352606,
1099011,
1099012,
1353105,
1342095,
1352009,
1352109,
1352206,
1352216,
1352226,
1352276,
1352286,
1352296,
1352406,
1352506,
1352707,
1352815,
1352906,
1352916,
1352935,
1352945,
1352957,
1352967,
1352975,
1353006,
1352928,
1352236,
1352246,
1352256,
1352266,
1352606,
1353205,
1353405
);

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
       if (mode == 0 && status == 0) {
			im.dispose();
			return;
		}
        status--;
    }
    if (status == 0) {
        var text = "";
		for(var i=0; i<itemList.length; i++) {
			text+="#L"+i+"##v"+itemList[i]+"##z"+itemList[i]+"##l\r\n";
		}
		im.sendSimple("请选择你要换取的银河副武器：\r\n#r"+text);
    } else if(status == 1) {
		var itemid = itemList[selection];
		var itemnum = Math.floor(Math.random()*1+1);
		var item = im.gainGachaponItem(itemid, itemnum, "银河副武器箱子（自选）", 3);
		im.gainItem(2430893, -1);
		im.sendOk("恭喜您，获得了"+itemnum+"个#b#z"+itemid+"#");
		im.safeDispose();
	}
}
