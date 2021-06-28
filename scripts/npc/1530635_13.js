var status = 0;
var typed = 0;
var head = "#fUI/UIWindow2.img/Quest/quest_info/summary_icon/summary#\r\n";
var icon = "#fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#";
var monstermaps = Array(Array(50000, "适合 #r#e1级 ~ 10级#n#b 的玩家"), Array(100010100, "适合 #r#e3级 ~ 10级#n#b 的玩家"), Array(101020100, "适合 #r#e8级 ~ 30级#n#b 的玩家"), 
//Array(102030000, "适合 #r#e30级 ~ 60级#n#b 的玩家"),
Array(551000200, "适合 #r#e50级 ~ 70级#n#b 的玩家"), Array(600020300, "适合 #r#e70级 ~ 90级#n#b 的玩家"),
Array(541010010, "适合 #r#e90级 ~ 100级#n#b 的玩家"),
Array(251010402, "适合 #r#e120级 ~ 150级#n#b 的玩家"),
Array(270030100, "适合 #r#e150级#n#b以上 的玩家"), Array(703001200, "适合 #r#e160级#n#b以上 的玩家"), Array(273060300, "适合 #r#e190级#n#b以上 的玩家")
);
var startTime = "2016-04-15 21:00:00";
var endTime = "2016-04-15 22:00:00";
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
		if (mode == 1) status++;
		else status--;
		if (status == 0) {
			var text = head + "";
			if (cm.getMapId() != 910000000) {
				text = head + "\t亲爱的#r#h ##k您好，我是新手引导人，当然，你也可以在#b自由市场#k中找到我。\r\n";
			}
			text += "#r#L1#" + icon + " 新手成长系统简介#l\r\n\r\n#b";
			text += "   " + icon + "#k 点卷：#r" + cm.getPlayer().getCSPoints(1) + "#k 点  " + icon + " 活力值：#r" + cm.getPlayerEnergy() + "#k 点 \r\n   " + icon + " 今天在线：#r" + cm.getOnlineTime() + "#k 分钟#b\r\n#fUI/UIWindow2.img/QuestGuide/Button/WorldMapQuestToggle/normal/0# #n\r\n";
			text += "#L5#" + icon + " #r[免费]#b练级引导地图传送#l\r\n";
			//text += "#L8#" + icon + " #r[活动]#b财神120级限量抢礼包活动#b（4月15日）#l\r\n";
			text += "#L2#" + icon + " #r[免费]#b16位序列号兑换礼品#l\r\n";
			text += "#L6#" + icon + " #r[福利]#b新人七天登录奖励#n#k#l\r\n";
			text += "#L7#" + icon + " #r[福利]#b领取伴随等级礼包#n#k#l\r\n";
			//text += "#L4#" + icon + " #r[必须]#b新人6阶段等级奖励#l\r\n";
			text += "#L3#" + icon + " #r[必须]#b领取25星星之力助力徽章#l\r\n";
			
			cm.sendSimple(text);
		} else if (status == 1) {
			if (selection == 1) {
				cm.sendOk("#fUI/UIWindow2.img/Quest/quest_info/summary_icon/summary#\r\n#fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#亲爱的#r#h ##k您好,我是新手成长系统简介:\r\n  职业: 所有\r\n  等级: 10 30 60 100 150 200\r\n  推荐升级地图: 系统引导地图练级\r\n  引导使用某道具: 系统引导使用某道具\r\n  赠送道具: 当前职业对应等级防具,武器\r\n#fUI/UIWindow2.img/Quest/quest_info/summary_icon/startcondition#\r\n#fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#该角色达到等级要求即可完成1次阶段功能.\r\n\r\n#fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0##r注：角色不能超过等级范围或必须与等级对应转职数.\r\n#fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0##r注：装备 消耗 设置 其它 特殊 背包栏 预留 5 格以上.\r\n#fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0##r注：若达到等级未达到转职数,无法领取武器(后果自负).");
				cm.dispose();
			} else if (selection == 2) {
				cm.dispose();
				cm.openNpc(1530635, "cdkey");
			} else if (selection == 3) {
				if (cm.getBossLog("送装备", 1) == 0) {
					if (!cm.haveItem(1190400)) {
						var ii = cm.getItemInfo();
						var toDrop = ii.randomizeStats(ii.getEquipById(1190400)).copy();
						toDrop.setStr(5); //装备力量
						toDrop.setDex(5); //装备敏捷
						toDrop.setInt(5); //装备智力
						toDrop.setLuk(5); //装备运气
						toDrop.setMatk(5); //物理攻击
						toDrop.setWatk(5); //魔法攻击
						toDrop.setEnhance(25); //强化等级
						var timeStamp = java.lang.System.currentTimeMillis();
						var expirationDate = timeStamp + 30 * 86400 * 1000;
						toDrop.setExpiration(expirationDate);
						toDrop.setOwner("30天");
						Packages.server.MapleInventoryManipulator.addFromDrop(cm.getC(), toDrop, false);
						cm.setBossLog("送装备", 1);
						cm.sendOk("领取成功！超强装备已经给您发放.感谢您的支持.");
					} else {
						cm.sendOk("您身上已经有#v1190400#了");
					}
				} else {
					cm.sendOk("您已经领取过该装备，无法重复领取。");
					cm.dispose();
				}
				cm.dispose();
			} else if (selection == 4) {
				cm.dispose();
				cm.openNpc(9300011, 1);
			} else if (selection == 5) {
				var text = "请选择你要接连的地方：\r\n#b";
				for (var i = 0; i < monstermaps.length; i++) {
					text += "#L" + i + "# " + icon + " #m" + monstermaps[i][0] + "# (" + monstermaps[i][1] + ")\r\n"
				}
				cm.sendSimple(text);
			} else if (selection == 6) {
				cm.dispose();
				cm.openNpc(1530635, 14);
			} else if (selection == 7) {
				cm.dispose();
				cm.openNpc(1530635, "Levelreward");
			} else if (selection == 8) {
				var em = getEvent("NewEvent45", 1);
				if (em.getProperty("Caishen_Count") == null) {
					em.setProperty("Caishen_Count", 0);
				}
				var count = parseInt(em.getProperty("Caishen_Count"));
				if (count == null)
				{
					count = 0;
				}
				
				var currentTimestamp = java.lang.System.currentTimeMillis();
				var startTimestamp = java.sql.Timestamp.valueOf(startTime).getTime();
				var endTimestamp = java.sql.Timestamp.valueOf(endTime).getTime();
				if (currentTimestamp < startTimestamp) {
					var minute = Math.floor((startTimestamp - currentTimestamp) / 60000);
					cm.sendOk("距离活动开始还有#r"+minute+"#k分钟");
					cm.dispose();
					return ;
				}
				if (currentTimestamp > endTimestamp) {
					cm.sendOk("活动已经结束");
					cm.dispose();
					return ;
				}
				
				
				if (cm.getPlayer().isGM()) {
					cm.getPlayer().dropMessage(-11, "当前礼包次数："+count);
				}
				
				if (count >= 20) {
					cm.sendOk("礼包已经发放完了！你手慢了！");
					cm.dispose();
					return ;
				}
				
				if (cm.getPlayer().getTodayOnlineTime() < 240 ) {
					cm.sendOk("在线时间不足240分钟！");
					cm.dispose();
					return ;
				}
				
				if (cm.getEventCount("415礼包财神", 1) <= 0) {
					if (cm.getPlayer().getLevel() >= 120) {
						var itemList = Array(
							Array(5062010, 10),
							Array(5062002, 10),
							Array(5062500, 10),
							Array(5062024, 10),
							Array(5150040, 20),
							Array(5152053, 20),
							Array(2431307, 1)
						);
						var text = "恭喜您领取了财神礼包！\r\n";
						for(var i in itemList) {
							var itemid = itemList[i][0];
							var quantity = itemList[i][1];
							cm.gainItem(itemid, quantity);
							text += "#v"+itemid+"##b#t"+itemid+"# [ #r"+quantity+"#k ] 个\r\n";
						}
						cm.gainNX(2, 50000);
						cm.setEventCount("415礼包财神", 1);
						count++;
						em.setProperty("Caishen_Count", count);
						cm.sendOk(text);
						cm.worldSpouseMessage(0x24, "[财神送礼] : 恭喜玩家 "+cm.getPlayer().getName()+" 在自由市场财神处领取了20份限量礼包！");
						cm.dispose();
					} else {
						cm.sendOk("您的等级不足！");
						cm.dispose();
					}
				} else {
					cm.sendOk("您已经抢过礼包了！");
					cm.dispose();
				}
			}
		} else if (status == 2) {
			var sel = selection;
			cm.warp(monstermaps[sel][0]);
		}
	}
}

function getEvent(name, channel) {
	var cserv = Packages.handling.channel.ChannelServer.getInstance(channel);
	var event = cserv.getEventSM().getEventManager(name);
	return event;
}
