/* 神奇魔方碎片 */

var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 0) {
        im.dispose();
        return;
    } else {
        status++;
    }
    if (status == 0) {
        im.sendNext("搜集到#r10个#k#b#t2430481##k，可以获得#b#i2049401:##t2049401##k。搜集到#r20个#k#b#t2430481##k可以获得#b#i2049400:##t2049400##k。");
    }
	if (status == 1)
	{
		im.sendYesNo("你是否要进行兑换?");
	}
	if (status == 2)
	{
		im.sendNext("请选择要兑换的物品:\r\n#L1#用#r10个#k#b#t2430481##k兑换1个#b#i2049401:##t2049401##k#l\r\n#L2#用#r20个#k#b#t2430481##k兑换1个#b#i2049400:##t2049400##k")
	}
	if (status == 3)
	{
		if(im.getItemQuantity(2430481) >= selection * 10) {
			im.gainItem(2430481, - selection * 10);
			im.gainItem(2049402 - selection,1);
			im.sendOk("Ok");
			im.dispose();
		} else {
			im.sendOk("你拥有的#b#t2430112##k不够哦!....");
			im.dispose();
		}
	}
}