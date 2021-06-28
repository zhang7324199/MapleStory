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
			cm.sendOk("请选择功能:\r\n\r\n" + (cm.isQuestFinished(1465) ? "" : "#L0#完成所有五转任务 100元宝#l\r\n") + "#L1#购买1000个V核心 10元宝#l\r\n#L2#打开V核心UI#l");
		} else if (status == 1) {
			if (selection == 0) {
				if (cm.getRMB() > 100) {
					cm.gainRMB(-100)
					cm.forceCompleteQuest(1465)
					cm.gainVCraftCore(1000);
					cm.sendOk("转职完成，免费获取1000个V核心，消耗100元宝");
					cm.playerMessage(5, "[元宝消费提示] 消耗100元宝，剩余元宝：" + cm.getRMB())
				} else {
					cm.sendOk("元宝余额不足！");
				}

			} else if (selection == 1) {
				if (cm.getRMB() > 10) {
					cm.gainRMB(-10)
					cm.gainVCraftCore(1000);
					cm.sendOk("领取完成,获得1000个V核心，消耗10元宝");
					cm.playerMessage(5, "[元宝消费提示] 消耗10元宝，剩余元宝：" + cm.getRMB())
				} else {
					cm.sendOk("元宝余额不足！");
				}

			} else if (selection == 2) {
				if (cm.isQuestFinished(1465)) {
					cm.openUI(1131);
				} else {
					cm.sendOk("我还无法为你提供服务。！");
				}
			}
			cm.dispose();
		}
	}
}