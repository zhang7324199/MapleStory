﻿var status = 0;
var typed=0;

function start() {
	status = -1;
	action(1, 0, 0);
}

function action(mode, type, selection) {
	if (mode == -1) {
		cm.dispose();
	} else {
		if (mode == 0 && status == 0) {
			cm.dispose();
			return;
		}
		if (mode == 1)
			status++;
		else
			status--;
		if (status == 0) {
			cm.sendYesNo("#d女皇希纳斯手下部下众多,如今需要勇敢的冒险家前往消灭他们,众多将领等待消灭，共 #r20#k #d波怪物。#k\r\n#e#d试炼途中的怪物将会随机掉落#v2431716##v5062002#,#v2431716#。\r\n#e#r副本要求#k#n：#b建议180级以上，自身HP大于10万。#k\r\n#r#e副本提示#n#k：如果中途掉线都是可以重新开始不算次数的\r\n如果你今天领取过奖励后,再进入是不能再领取奖励的");					
		} else if (status == 1) {
		 if (cm.getLevel() <= 179) {
cm.sendOk("#fUI/UIWindow2.img/UtilDlgEx/list1#\r\n\r\n你好像还不具备以下条件。我不能送你们进入。\r\n\r\n\r\n- #e等级需求#n：180级以上");
cm.dispose();
}
/*else if (cm.getHour() != 12 && cm.getHour() != 13 && cm.getHour() != 14 &&cm.getHour() != 20 && cm.getHour() != 22 &&cm.getHour() != 21){
cm.sendOk("时间没到,神之试炼场地暂未准备好。"); 
cm.dispose();
}*/
else if (cm.getParty() == null) {
cm.sendOk("#e#r你好像还没有一个队伍,我是不能送你进去的."); 
cm.dispose();
}
else if(!cm.isLeader()){
cm.sendOk("#e#r请队长来跟我谈话.");
cm.dispose();
}
 else if (cm.getMap(940021000).getCharactersSize() > 0) { // Not Party Leader
cm.sendOk("有人在挑战此副本，请稍等一会，或者换其它线尝试一下！..");
cm.dispose();
}
else if (cm.getParty().getMembers().size() < 1){
cm.sendOk("至少有 #r2#k 名队员"); 
cm.dispose();
}
else if (cm.getPQLog("szsl") >= 1){
cm.sendOk("您已经进入过。"); 
cm.dispose();
}
else if (cm.getEventCount("szsl") >= 1){
cm.sendOk("您已经进入过。"); 
cm.dispose();
}else{
var em = cm.getEventManager("szsl");
if (em == null) {
cm.sendOk("出错啦,请联系GM.");
cm.dispose();
}else{
var party = cm.getParty().getMembers();//获取整个队伍角色信息
var it = party.iterator();
var next = true;
em.startInstance(cm.getParty(), cm.getChar().getMap());
}
cm.spouseMessage(0x16, "『神之试炼』" + " : " + "恭喜" + cm.getChar().getName() + ",和他的队友开始了神之试炼，祝他取得好的成绩");
//cm.sendServerNotice(7, "『神之试练』" + " : " + "玩家 " + cm.getChar().getName() + " 和他的队友开始了神之试炼，祝他取得好的成绩");
cm.dispose(); 
                }
		}
	}
}
