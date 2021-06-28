var status = 0;
var text;
var sel;
var credits;
var itemlist = new Array(
	// 礼包金额，道具ID，全属性数值
	Array(10, 1112915, 1),		//蓝调戒指
	Array(1000, 1112668, 10),	//传说戒指
	Array(3000, 1012057, 10),	//透明面具
	Array(3000, 1022048, 10),	//透明眼饰
	Array(5000, 1112178, 20),	//梦幻雪景名片戒指
	Array(5000, 1112290, 20),	//梦幻雪景聊天戒指
	Array(10000, 1182140, 50),	//冒险岛潮流徽章
	Array(10000, 1003719, 50),	//进阶精灵帽
	Array(10000, 1112012, 20)	//红玫瑰戒指
	);
var hypay = 0;

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
    	credits = new Array();
    	for (var i in itemlist) {
    		var contain = false;
    		for (var j in credits) {
    			if (itemlist[i][0] == credits[j]) {
    				contain = true;
    			}
    		}
    		if (!contain) {
    			credits.push(itemlist[i][0]);
    		}
    	}
    	hypay = im.getHyPay(3);
    	text = "充点小钱玩玩吧。您当前充值总额为：" + im.getHyPay(3) + "\r\n\r\n#b";
    	for (var i in credits) {
    		text += "#L" + i + "#查看" + credits[i] + "元礼包\r\n";
    	}
    	im.sendSimple(text);
    } else if (status == 1) {
    	sel = selection;
    	text = "以下是" + credits[sel] + "元礼包的内容：\r\n\r\n#r";
		for (var i in itemlist) {
			if (itemlist[i][0] == credits[sel]) {
				text += "#i" + itemlist[i][1] + "# #z" + itemlist[i][1] + "# 全属性+" + itemlist[i][2] + "\r\n";
			}
		}
		text += "\r\n\r\n#b#L0#领取礼包#l";
		im.sendSimple(text);
    } else if (status == 2) {
    	if (hypay < credits[sel]) {
    		im.sendOk("您当前充值总额不足" + credits[sel] + "元。");
    		im.dispose();
    		return;
    	}
    	if (im.getBossLogAcc("毛莫的口袋" + credits[sel] + "元礼包") == -1) {
    		im.sendOk("您已经领取过该奖励。");
    		im.dispose();
    		return;
    	}
    	if (im.getSpace(1) < getSize(credits[sel])) {
    		im.sendOk("装备栏空间不足" + getSize(credits[sel]) + "格");
    		im.dispose();
    		return;
    	}

		var ii = im.getItemInfo();
		for (var i in itemlist) {
			if (itemlist[i][0] == credits[sel]) {
				var itemid = itemlist[i][1];
				var stat = itemlist[i][2];
				var toDrop = ii.randomizeStats(ii.getEquipById(itemid)).copy();
				toDrop.setStr(stat);
				toDrop.setDex(stat);
				toDrop.setInt(stat);
				toDrop.setLuk(stat);
				toDrop.setWatk(stat);
				toDrop.setMatk(stat);
				im.addFromDrop(im.getC(), toDrop, true);
			}
		}
		im.setBossLogAcc("毛莫的口袋" + credits[sel] + "元礼包", -2);
		im.sendOk("领取成功");
		im.worldSpouseMessage(0x20,"『毛莫的口袋』：玩家 "+ im.getChar().getName() +" 领取了" + credits[sel] + "元礼包！");
		im.dispose();
    }
}

function getSize(edu) {
	var ret = 0;
	for (var i in itemlist) {
		if (itemlist[i][0] == edu) {
			ret++;
		}
	}
	return ret;
}
