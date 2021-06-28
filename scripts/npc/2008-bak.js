﻿var head = "#fUI/UIWindow2.img/Quest/quest_info/summary_icon/summary#\r\n";
var icon = "#fUI/UIWindow/Minigame/Common/mark#";
var sl1 = 0;//兑换数量

var status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
	if (mode == 1) {
		status++;
	} else {
		if (status >= 0) {
			cm.dispose();
			return;
		}
		status--;
	}
          if (status == 0) {


    if (cm.getPQLog("新手驾到") >= 0 && cm.getPlayerStat("LVL") < 150) {

			var text = "#h0# 欢迎来到" + cm.getServerName() + "#k,先来大概了解一下本服特色：\r\n\r\n";
				text += "· #e#d本服为完美仿官 爆率设置：经验30倍  金币10倍  爆率5倍\r\n";
				text += "· #r主菜单在拍卖按钮可以提供各种便捷服务\r\n";
				text += "· #e#r新手出生将会送你:#v3700134##v3010044##v2000005##v5073000##v5074000##v1004137##v1042314##v1062203##v1102683##v1702510##v3010044##v3015424##v3015047##v1112150##v2430505##v1112262##v1022048##v1012057##v1032024##v1072153##v5150040##v5152053##v5150052##v5153015##v5152057##v5211060##v5360015##v1142310##v5030009##v1112918#\r\n";
				text += "·  \r\n";
				text += "· 各种仿官方流程副本趣味活动丰厚奖励,尽享游戏欢乐,强力的等级奖励,各种独有副本-吊丝.土豪.上班族的天堂\r\n";
				text += "\r\n\r\n更多精彩,敬请期待!";
			cm.sendSimple(text);
		} else {
			cm.dispose();
			cm.sendOk("你已经领取过新人礼包，无法再次领取！");
			cm.dispose();
		}
	} else if (status == 1) {
		cm.dispose();
        cm.setPQLog("新手驾到", 0, -2);
		cm.gainItem(2430241, 1);
		cm.gainItem(2431549, 1);
		cm.gainItem(2430607, 1);
		cm.gainItem(2430154, 1);
		cm.gainMeso(1000000);
        cm.gainPetItem(5000209, 1);
		cm.worldSpouseMessage(0x20,"★★★★★★★『新手驾到』：【"+ cm.getChar().getName() +"】 成功偷渡来到了" +cm.getServerName() +"!★★★★★★★");
	}
}
function Operate(job) {
    switch (job) {
        case 6001://爆莉萌天使
            cm.gainExp(100000);
            cm.gainExp(100000);
            cm.gainExp(100000);
            cm.gainExp(100000);
            cm.gainExp(100000);
            cm.gainExp(100000);
            cm.gainExp(100000);
            cm.gainExp(100000);
            cm.gainExp(100000);//升到10级
            cm.gainItem(1222000, -1);//删除原始道具
            equip(1352600);//佩戴灵魂手镯
            cm.changeJob(6500);
            cm.gainItem(2431305, 1);
            cm.sendY("赠送给你 >>> 火光武器箱 一个，可以根据你的角色等级获取相应的道具！");
            break;
    }
}
function equip(itemId) {
    if (!cm.haveItem(itemId, 1, true, true)) {
        cm.gainItem(itemId, 1);
    }
    cm.gainItemAndEquip(itemId, -10);
}
