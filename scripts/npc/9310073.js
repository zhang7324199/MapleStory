var status = -1
var questid = [1460, 1461, 1462, 1463, 1464, 1465, 1466, 1478]

function start() {
	action(1, 0, 0)
}

function action(mode, type, selection) {
	if (mode == 0) {
		cm.dispose()
	} else {
		if (mode == 1)
			status++
		else
			status--

		if (status == 0) {
			cm.sendOk("请选择功能:\r\n\r\n#L0#完成所有五转任务#l\r\n#L1#领取1000个V核心#l\r\n#L2#打开V核心UI#l\r\n#L3#陨石效果#l");
			cm.worldSpouseMessage(0x23, "heheheda ：呵呵哒 : 呵呵");
		} else if (status == 1) {
			if (selection == 0) {
        		cm.forceCompleteQuest(1465)
        		cm.sendOk("转职完成");
			} else if (selection == 1) {
		    	cm.gainVCraftCore(1000);
		    	cm.sendOk("领取完成");
			} else if (selection == 2) {
	            if (cm.isQuestFinished(1465)) {
	                cm.openUI(1131);
	            } else {
	                cm.forceCompleteQuest(1465)
	                cm.sendOk("我还无法为你提供服务。！");
	            }
			} else if (selection == 3) {
				cm.getMap().obtacleFall(3, 0x30, 0x33);
			}
		    cm.dispose();
		}
	}
}