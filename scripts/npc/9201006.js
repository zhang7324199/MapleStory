var status = -1;

function action(mode, type, selection) {
    if (mode == 1) {
	status++;
    } else {
	if (status == 0) {
	    cm.dispose();
	}
	status--;
    }
    if (cm.getMapId() != 680000200) {
	cm.dispose();
	return;
    }
    if (status == 0) {
	cm.sendYesNo("你想进入礼堂吗?");
    } else if (status == 1) {

	    var marr = cm.getQuestRecord(160001);
	    var data = marr.getCustomData();
	    if (data == null) {
		marr.setCustomData("0");
	        data = "0";
	    }
	    if (data.equals("1")) {
		if (cm.getPlayer().getMarriageId() <= 0) {
		    cm.sendOk("你没有和任何人订婚呀");
		    cm.dispose();
		    return;
		}
	    	var chr = cm.getMap().getCharacterById(cm.getPlayer().getMarriageId());
	    	if (chr == null) {
		    cm.sendOk("请确认你的另一半也在这里!.");
		    cm.dispose();
		    return;
	    	}
		var maps = Array(680000210, 680000300, 680000401);
		for (var i = 0; i < maps.length; i++) {
		    if (cm.getMap(maps[i]).getCharactersSize() > 0) {
			cm.sendNext("已经有人在进行婚礼,请稍后再来.");
			cm.dispose();
			return;
		    }
		}
		var map = cm.getMap(680000210);
		cm.getPlayer().changeMap(map, map.getPortal(0));
		chr.changeMap(map, map.getPortal(0));
		cm.worldMessage(5, "<Channel " + cm.getClient().getChannel() + "> " + cm.getPlayer().getName() + " and " + chr.getName() + "'s wedding is about to be started.");
	    } else {
		if (cm.getMap(680000210).getCharactersSize() == 0) {
		    cm.sendNext("没有新人正准备婚礼, 请稍后再试.");
		    cm.dispose();
		    return;
		}
		if (cm.haveItem(4150000)) {
		    cm.warp(680000210,0);
		} else {
		    cm.sendOk("你没有获得邀请.");
		}
	    }
	cm.dispose();
    }
}
