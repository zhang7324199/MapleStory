var status = 0;
var Q= "#fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#";
var ca = java.util.Calendar.getInstance();
var day = ca.get(java.util.Calendar.DATE);//获取日
var typeEvent = "#r活动关闭中#k";
var List = Array(
			Array(Q+"[系列]神木村",Array(25,10,19,28),100),//事件名称、开始事件日期（几号）、打开特殊NPC的名字
			Array(Q+"[系列]阿里安特",Array(2,11,20,29),200),
			Array(Q+"[系列]射手村",Array(3,12,21,30),300),
			Array(Q+"[系列]武陵",Array(4,13,22,31),400),
			Array(Q+"[系列]埃德尔斯坦",Array(5,14,23),700),
			Array(Q+"[系列]马加提亚",Array(6,15,24),600),
			Array(Q+"[系列]玩具城",Array(7,16,15),800),
			Array(Q+"[系列]时间神殿",Array(8,17,26),900)
);
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
			var txt = "#fUI/UIWindow2.img/Quest/quest_info/summary_icon/summary#\r\n#fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#亲爱的#r#h ##k您好!想选择什么样的日常任务:\r\n#r#L999##fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#系列任务简介#l\r\n\r\n   #k#fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#积分：#r"+cm.getPlayerPoints()+"#k 点  #fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#活力值：#r"+cm.getPlayerEnergy()+"#k 点 \r\n   #fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#今天在线：#r"+cm.getGamePoints()+"#k 分钟#b\r\n\r\n#fUI/UIWindow2.img/QuestGuide/Button/WorldMapQuestToggle/normal/0#\r\n";
			//cm.sendSimple("#fUI/UIWindow2.img/Quest/quest_info/summary_icon/summary#\r\n#fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#亲爱的#r#h ##k您好!想选择什么样的日常任务:\r\n#r#L1##fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#系列任务简介#l\r\n\r\n   #k#fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#积分：#r"+cm.getPlayerPoints()+"#k 点  #fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#活力值：#r"+cm.getPlayerEnergy()+"#k 点 \r\n   #fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#今天在线：#r"+cm.getGamePoints()+"#k 分钟#b\r\n\r\n#fUI/UIWindow2.img/QuestGuide/Button/WorldMapQuestToggle/normal/0#\r\n#L2##fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#[系列]神木村       (#k目前状态： "+typeEvent1+")#l\r\n#L3##fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#[系列]阿里安特     (#k目前状态： "+typeEvent2+")#l\r\n#L4##fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#[系列]射手村       (#k目前状态： "+typeEvent3+")#l\r\n#L5##fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#[系列]武陵         (#k目前状态： "+typeEvent4+")#l\r\n#L6##fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#[系列]埃德尔斯坦   (#k目前状态： "+typeEvent5+")#l\r\n#L7##fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#[系列]马加提亚     (#k目前状态： "+typeEvent6+")#l\r\n#L8##fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#[系列]玩具城       (#k目前状态： "+typeEvent7+")#l\r\n#L9##fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#[系列]时间神殿     (#k目前状态： "+typeEvent8+")#l");
			for (var i =0;i<List.length ;i++ ){
				if (cm.getPlayer().isGM()){
					typeEvent = "#g活动进行中#k";
				}else{
				for (var a =0;a<List[i][1].length ;a++ ){
					if (day==List[i][1][a]){
						typeEvent = "#g活动进行中#k";
						break;
					}else{
						typeEvent = "#r活动关闭中#k";
					}
				}
				}
				txt += "#L"+i+"##b"+List[i][0]+"#k     (#k目前状态："+typeEvent+")#l\r\n";
			}
			cm.sendSimple(txt);
		
		} else if (status == 1) {
			if (selection == 999) {
				cm.sendOk("#fUI/UIWindow2.img/Quest/quest_info/summary_icon/summary#\r\n#fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#亲爱的#r#h ##k您好,欢迎来到系列任务简介:\r\n  通过系列任务活动可以获得大量游戏道具,在这里让\r\n  你总是意想不到的意外,任务简单-困难模式有趣有乐.杀\r\n  戮 挑战 冒险 极品 这里的任务应有尽有,赶快行动起来吧!\r\n#fUI/UIWindow2.img/Quest/quest_info/summary_icon/startcondition#\r\n#fUI/UIWindow2.img/Quest/quest_info/summary_icon/basic#\r\n#v3010070#椅子 #v2049134#卷轴 #v5062002#魔方  #v1332225#装备 #v1102453#点装\r\n\r\n#fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0##r注：所有系列任务24点重置。\r\n#fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0##r注：系列任务每天轮换,更新不同的系列副本。");
                cm.dispose();
			}else{
				if (cm.getPlayer().isGM()){
					typeEvent = "#g活动进行中#k";
				}else{
				for (var a =0;a<List[selection][1].length ;a++ ){
					if (day==List[selection][1][a]){
						typeEvent = true;
						break;
					}else{
						typeEvent = false;
					}
				}
				}
				if (typeEvent){
					cm.dispose();
					cm.openNpc(2400022,List[selection][2]); 
				}else{
					cm.sendOk("#b"+List[selection][0]+"\r\n#r活动开启日期为每月的"+List[selection][1]+"号开放。");
					cm.dispose();
				}
			}
			}
	   }
}
