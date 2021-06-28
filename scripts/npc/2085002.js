function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (cm.getMonsterCount(240080500) <= 0 && cm.getMapId() == 240080500) {
            if (status == 0) {
                cm.sendPlayerToNpc("等等,好像还有人?!");
            } else if (status == 1) {
                cm.sendPlayerToNpc("御龙魔那个家伙还活着呀!");
            } else if (status == 2) {
                cm.sendYesNo("你想离开这里么?");
            } else if (status == 3) {
                cm.warp(240080000);
//                var maple = Math.floor(Math.random() * 10) + 20;
                /*if (!cm.canHold(4001713, 1)) {
                 cm.sendOk("请清理其他空间!");
                 cm.dispose();
                 return;
                 }
                 cm.gainItem(4001713, 1);*/
                cm.gainPQPoint();
                if (cm.getEventCount("Dragonica") < 10) {
                    cm.setEventCount("Dragonica");
                    cm.gainNX(2, 1000);
                }
                cm.dispose();
            }
        } else {
            cm.dispose();
        }
    }
}
