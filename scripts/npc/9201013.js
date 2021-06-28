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
    if (status == 0) {
	cm.sendYesNo("怎么? 你想预约婚礼吗?");
    } else if (status == 1) {
	if (cm.getPlayer().getMarriageId() <= 0) {
	    cm.sendOk("你还没有订婚.");
	} else if (!cm.canHold(4150000,60)) {
	    cm.sendOk("请确定其他空间.");
	} else if (!cm.haveItem(5251004,1) && !cm.haveItem(5251005,1) && !cm.haveItem(5251006,1)) {
	    cm.sendOk("Please purchase a Wedding Ticket from the Cash Shop.");
	} else {
	    var chr = cm.getMap().getCharacterById(cm.getPlayer().getMarriageId());
	    if (chr == null) {
		cm.sendOk("请确认你的另一半也在这里.");
		cm.dispose();
		return;
	    }
	    var marr = cm.getQuestRecord(160001);
	    var data = marr.getCustomData();
	    if (data == null) {
		marr.setCustomData("0");
	        data = "0";
	    }
	    if (data.equals("0")) {
		marr.setCustomData("1");
		cm.setQuestRecord(chr, 160001, "1");
		var num = 0;
		if (cm.haveItem(5251006,1)) {
		    cm.gainItem(5251006,-1);
		    num = 60;
		} else if (cm.haveItem(5251005,1)) {
		    cm.gainItem(5251005,-1);
		    num = 30;
		} else if (cm.haveItem(5251004,1)) {
		    cm.gainItem(5251004,-1);
		    num = 10;
		}
		cm.setQuestRecord(cm.getPlayer(), 160002, num + "");
		cm.setQuestRecord(chr, 160002, num + "");
		cm.sendNext("你现在已经预约了婚礼。这里是婚礼邀请，你想邀请的客人都需要他们。");
		cm.gainItemPeriod(4150000,num,1);
	    } else {
		cm.sendOk("我想你已经结婚了，或者已经预约了。");
	    }
	}
	cm.dispose();
    }
}
