var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 0 && status == 0) {
        cm.dispose();
        return;
    } else {
        if (mode == 1)
            status++;
        else
            status--;
        var mapId = cm.getMapId();
        if (mapId == 910340000) {
            cm.warp(910002000, 0);
            cm.removeAll(4001007);
            cm.removeAll(4001008);
            cm.dispose();
        } else {
            var outText;
            if (mapId == 910340600) {
                outText = "你准备好离开这个地图吗？";
            } else {
                outText = "一旦你离开地图，你必须重新启动整个任务如果你想再试一次。你还想离开这里吗？";
            }
            if (status == 0) {
                cm.sendYesNo(outText);
            } else if (mode == 1) {
                cm.warp(910340000, "st00");
                cm.dispose();
            }
        }
    }
}
