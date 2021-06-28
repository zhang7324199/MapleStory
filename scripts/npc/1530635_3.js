/*
	制作：彩虹工作室
	功能：日常任务
	时间：2016年12月23日
*/
var status = 0;
var random = java.lang.Math.floor(Math.random() * 4);
var eff = "#fEffect/CharacterEff/1051296/1/0#";
var eff1 = "#fEffect/CharacterEff/1112905/0/1#";
var ttt = "#fUI/UIWindow/Quest/icon2/7#";//"+ttt+"//美化1

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (status == 0 && mode == 0) {
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    } else {
        status--;
    }
    if (cm.getMapId() == 180000001 || cm.getMapId() == 910340100 || cm.getMapId() == 910340200 || cm.getMapId() == 910340300 || cm.getMapId() == 910340400 || cm.getMapId() == 910340500 || cm.getMapId() == 910340000) {
        cm.sendOk("很遗憾，您因为在特殊地图无法使用此功能.")
        cm.dispose();
    } else if (status == 0) {
        var selStr = "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + " #e日常任务 " + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "\r\n";
        selStr += "#L0#" + eff + " #r限定签到#l          #L3#" + eff + " #r连续签到#l\r\n";
        selStr += "#L2#" + eff + " #r在线奖励#l          #L1#" + eff + " #r隐藏箱子#l\r\n";
        selStr += "#L4#" + eff + " #r每日寻宝#l          #L5#" + eff + " #r陆续添加#l\r\n";
        selStr += "\r\n" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "" + eff1 + "\r\n";

        selStr += "\r\n\t\t\t#b#L6#" + ttt + " 返回上一页#l#k\r\n";
        cm.sendSimple(selStr);
    } else if (status == 1) {
        switch (selection) {
            case 6:
                cm.dispose();
                cm.openNpc(1530635,0);
                break;
            case 0:
                cm.dispose();
                cm.openNpc(1530635, 9);
                break;
            case 1://猜数字
                cm.dispose();
                cm.openNpc(1530635, 11);
                break;
            case 2://开锁
                cm.dispose();
                cm.openNpc(1530635, "Onlinebonus");
                break;
			case 3:
				cm.dispose();
				cm.openNpc(1530635, 10);
            case 4:
				cm.dispose();
				cm.openNpc(2084001);

        }
    }
}