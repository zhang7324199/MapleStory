/*
	制作：彩虹工作室
	功能：查看地图怪物爆率
	时间：2016年12月23日
*/

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
        if (cm.getMap().getAllMonstersThreadsafe().size() <= 0) {
            cm.sendOk("当前地图没有刷新怪物，无法查看爆率。");
            cm.dispose();
            return;
        }
        var selStr = "请选择你要查看怪物的爆率。\r\n\r\n#b";
        var iz = cm.getMap().getAllUniqueMonsters().iterator();
        while (iz.hasNext()) {
            var zz = iz.next();
            selStr += "#L" + zz + "##o" + zz + "##l\r\n";
        }
        if (cm.getPlayer().isAdmin()) {
            selStr += "\r\n#L0# #r查看地图爆率#k#l";
        }
        cm.sendSimple(selStr);
    } else if (status == 1) {
        if (selection == 0) {
            cm.sendNext(cm.checkMapDrop());
        } else {
            cm.sendNext(cm.checkDrop(selection));
        }
        cm.dispose();
    }
}