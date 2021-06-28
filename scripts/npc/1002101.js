/*
 *  @名称：    坤
 *  @地图：    明珠港
 *  @功能：    传送
 *  @作者：    彩虹工作室
 *  @时间：    2016年12月30日
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
        cm.sendYesNo("你想前往龙沉睡的岛吗?");
    } else if (status == 1) {
        cm.warp(914100000);
        cm.dispose();
    }
}
