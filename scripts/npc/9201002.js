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
    if (cm.getMapId() != 680000210) {
	cm.sendOk("如果你想举行婚礼，请和我的助手们说。");
	cm.dispose();
	return;
    }
    if (status == 0) {
	cm.sendYesNo("你想现在就行动起来么?");
    } else if (status == 1) {
	    var marr = cm.getQuestRecord(160001);
	    var data = marr.getCustomData();
	    if (data == null) {
		marr.setCustomData("0");
	        data = "0";
	    }
	    if (data.equals("1")) {
		if (cm.getPlayer().getMarriageId() <= 0) {
		    cm.sendOk("发生了一些错误：你没有与任何人订婚。");
		    cm.dispose();
		    return;
		}
	    	var chr = cm.getMap().getCharacterById(cm.getPlayer().getMarriageId());
	    	if (chr == null) {
		    cm.sendOk("请确认你的另一半在这里");
		    cm.dispose();
		    return;
	    	}
		marr.setCustomData("2_");
		cm.setQuestRecord(chr, 160001, "2_");
		cm.doWeddingEffect(chr);
	    } else if (data.equals("2_") || data.equals("2")) {
		if (cm.getPlayer().getMarriageId() <= 0) {
		    cm.sendOk("发生了一些错误：你没有与任何人订婚。");
		    cm.dispose();
		    return;
		}
	    	var chr = cm.getMap().getCharacterById(cm.getPlayer().getMarriageId());
	    	if (chr == null) {
		    cm.sendOk("请确认你的另一半在这里.");
		    cm.dispose();
		    return;
	    	}
		cm.setQuestRecord(cm.getPlayer(),160001,"3");
		cm.setQuestRecord(chr,160001,"3");
		var dat = parseInt(cm.getQuestRecord(160002).getCustomData());
		if (dat > 10) {
		    cm.warpMap(680000300, 0);
		} else {
		    cm.setQuestRecord(chr,160002,"0");
		    cm.setQuestRecord(cm.getPlayer(),160002,"0");
		    cm.warpMap(680000500, 0);
		}
	    } else {
		cm.sendOk("你还没结婚！");
	    }
	cm.dispose();
    }
}
