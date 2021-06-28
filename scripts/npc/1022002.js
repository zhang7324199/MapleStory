/*
 *  @名称：    麦吉
 *  @地图：    勇士部落
 *  @功能：    挑战蝙蝠魔BOSS
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
    if (cm.getPlayer().getLevel() < 50) {
	cm.sendOk("对不起，你的等级小于50级无法挑战蝙蝠BOSS");
	cm.dispose();
	return;
    }
    if (status == 0) {
	cm.sendYesNo("你看上去很强大，我可以传送你去挑战巨大蝙蝠BOSS，你敢去吗？");
    } else if (status == 1) {
	cm.warp(105100100);
	cm.dispose();
    }
}
