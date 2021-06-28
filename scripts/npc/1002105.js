/*
 *  @名称：    次元传送口
 *  @地图：    金银岛 = 六岔路口
 *  @功能：    传送到万神殿
 *  @作者：    彩虹工作室
 *  @时间：    2016年12月30日
 */
function start() {
    cm.sendYesNo("要通过#p1002105#移动到万神殿吗？");
}

function action(mode, type, selection) {
    if (mode == 1) {
        cm.warp(400000001, 1);
    }
    cm.dispose();
}
