/*
 * 巨大的冰块 显示全服玩家积累的能量
 * 菜菜制作 奇幻冒险岛工作室所有
 * 联系QQ：537050710
 * 欢迎定制各种脚本
 * 2015年7月30日 17:06:33
 * 更新：memory
 * QQ：52619941
 */
//进度条
var l = "#fUI/mapleBingo.img/mapleBingo/Gage/leftGage#";
var m = "#fUI/mapleBingo.img/mapleBingo/Gage/middleGage#";
var r = "#fUI/mapleBingo.img/mapleBingo/Gage/rightGage#";
var head = "#fUI/UIWindow2.img/Quest/quest_info/summary_icon/summary#\r\n";
var icon = "#fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#";
var questIcon = "#fUI/UIWindow2.img/QuestGuide/Button/WorldMapQuestToggle/normal/0#\r\n";
var startIcon = "#fUI/UIWindow2.img/Quest/quest_info/summary_icon/startcondition#\r\n";
var status = 0;
var typed;
var em, eim, itemKey;
var showListLimit = 200;
/*********************************************
 *
 *	@ 以下为用户自定义参数区域
 *
 *********************************************/
var needItems = Array(
	//道具ID，每提交1个可获得的贡献点
	Array(2431174, 1),
	Array(4310036, 1),
	Array(4310030, 10),
	Array(4310015, 100),
	Array(4310143, 1000)
);
/*********************************************
 *
 *	@ 设置事件每次掉落多少件物品
 *
 *********************************************/
var dropQuantity = 5; 
/*********************************************
 *
 *	@ 设置事件中最多掉落多少次物品停止
 *
 *********************************************/
var maxDropTimes = 5; 
/*********************************************
 *
 *	@ 设置需要多少能量才能激活事件
 *
 *********************************************/
var needMaxPoints = 100000;
/*********************************************
 *
 *	@ 设置可能出现的道具
 *
 *********************************************/
var itemList = Array(
	//几率999为最大值
	Array(5062000, 999999), 
	Array(5062500, 999999),
	Array(5062002, 999999),
	Array(5062000, 999999), 
	Array(5062500, 999999),
	Array(5062002, 999999),
	Array(5062000, 999999), 
	Array(5062500, 999999),
	Array(5062002, 999999),
	Array(5062000, 999999), 
	Array(5062500, 999999),
	Array(5062002, 999999),
	Array(5062000, 999999), 
	Array(5062500, 999999),
	Array(5062002, 999999),
	Array(2340000, 999999),
	Array(2340000, 999999),
	Array(2340000, 999999),
	Array(2340000, 999999),
	Array(2340000, 999999),
	Array(2613000, 10000), // 星火单手武器攻击力卷轴 - 为单手武器附加提升攻击力的属性。
	Array(2613001, 10000), // 星火单手武器魔法力卷轴 - 为单手武器附加提升魔力的属性。
	Array(2612010, 10000), // 星火双手武器攻击力卷轴 - 为双手武器附加提升攻击力的属性。
	Array(1112915, 10000), //蓝调戒指
	Array(2047818, 3000), //惊人的双手武器攻击力卷轴100%
	Array(2612059, 3000), //惊人的双手武器魔力卷轴100%
	Array(2046996, 3000), //惊人的单手武器攻击力卷轴100%
	Array(2046997, 3000), //惊人的单手武器魔力卷轴100%
	Array(2049752, 50000), //S级潜能卷轴 80%
	Array(2049137, 100000), //惊人正义40%
	Array(2049135, 100000), //惊人正义20%
	Array(2028175, 100000), //宿命随机
	Array(2431944, 99999), //140武器箱子
	Array(2431945, 99999), //140防具箱子
	Array(2049323, 300), //无损强化卷轴*/
	Array(2049005, 59999), // - 白医卷轴—神 - 使砸卷失败而减少的强化次数恢复1。不能用于现金道具。
	Array(2049006, 29999), //  - 诅咒白医卷轴 - 使砸卷失败而减少的强化次数恢复2。不能用于现金道具。
	Array(2049007, 29999), //  - 诅咒白医卷轴 - 使砸卷失败而减少的强化次数恢复2。不能用于现金道具。
	Array(2049008, 29999), //  - 诅咒白医卷轴 - 使砸卷失败而减少的强化次数恢复2。不能用于现金道具。
	Array(2049009, 29999), //  - 白医卷轴10% - 把砸卷失败而减少的强化次数恢复1。不能用于现金道具。
	Array(2049010, 999999), //  - 白医卷轴 - 使砸卷失败而减少的强化次数恢复1。不能用于现金道具。
	Array(2432056, 999999), //- 黄金鹅蛋<下品> - 养鹅场主人出售的黄金鹅蛋。表面有种斑点，因此感觉蛋的品质不是非常好。#c每天可以使用一次，双击使用后#，可以获得特别的宝物。\n#c
	Array(2432057, 9999),// - 黄金鹅蛋<中品> - 养鹅场主人出售的黄金鹅蛋。虽然有些许斑点，但不是特别明显。#c每天可以使用一次，双击使用后#，可以获得特别的宝物。\n#c
	Array(2432058, 999),// - 黄金鹅蛋<上品> - 养鹅场主人出售的黄金鹅蛋。非常干净，没有一个斑点，散发着金黄色光芒。#c每天可以使用一次，双击使用后#，可以获得特别的宝物。\n#c
	Array(2049011, 999999) //  - 白医卷轴 - 把砸卷失败而减少的强化次数恢复1。不能用于现金道具。
);

function start() {
	status = -1;
	action(1, 0, 0);
	//初始化过程
	if (em.getObjectProperty("_itemList") == null)
		em.setObjectProperty("_itemList", itemList);
	if (em.getProperty("_maxDropTimes") == null)
		em.setProperty("_maxDropTimes", maxDropTimes);
	if (em.getProperty("_dropQuantity") == null)
		em.setProperty("_dropQuantity", dropQuantity);
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
			em = getEvent("ZiyouPaoItem", 1);
			eim = em.getInstance("ZiyouPaoItem");
			if (em == null || eim == null) {
				cm.sendOk("现在活动还没有开始，或者您还没有被邀请加入！\r\n请留意管理员的公告！感谢支持！");
				 cm.dispose();
			} else {
				if (em.getProperty("state") == needMaxPoints) {
					cm.sendOk("现在已经累计满了能量值，请等待服务器自动发出公告！");
					cm.dispose();
					return;
				}
				if (em.getProperty("dropstart") == "true") {
					cm.sendOk("现在自由市场已经开始了丢道具活动了，请稍后再贡献能量点。");
					cm.dispose();
					return;
				}

				var text = head+ "\t亲爱的#r#h0##k，只要在我这里贡献出我需要的祭品，就可以激活神秘能量，届时萦绕在自由市场的神秘力场会掉落稀有道具哦！\r\n";
				text += startIcon;
				var percent = (em.getProperty("state") * 1 / needMaxPoints * 100).toFixed(2);
				text += "#e#d            目前的能量进度条 #r["+percent+"%]#d\r\n#n";
				text += "\t\t\t\t#B" + parseInt(parseInt(em.getProperty("state")) / needMaxPoints * 100) + "#\r\n#b";
				text += questIcon;
				text += "#b#L1#"+icon+" 我要贡献祭品#l\r\n";
				text += "#b#L4#"+icon+" 贡献点兑换礼品#l\r\n";
				text += "#d#L0#"+icon+" 查看我贡献了多少能量点#l\r\n";
				text += "#d#L3#"+icon+" 查看贡献排行榜#l\r\n";
				
				
				if (cm.getPlayer().isGM()) {
					text += "#r#e#L999#"+icon+" #e[管理]清空能量点#n#k#l\r\n";
					text += "#r#e#L998#"+icon+" #e[管理]刷新物品数据#n#k#l\r\n";
					text += "#r#e#L997#"+icon+" #e[管理]激活神秘力量#n#k#l\r\n";
				}

				cm.sendSimple(text);

			}
		} else if (status == 1) {
			if (selection == -1)
				selection = typed;
			if (selection == 4) {
				
				cm.dispose();
				//cm.sendOk("贡献商店筹备中，请等待管理员通知。");
				cm.openNpc(cm.getNpc(), 1);
			} else if (selection == 3) {
				var conn = cm.getConnection();
				var sql = "SELECT c.name, b.count FROM characters c, bosslog b WHERE c.id = b.characterid AND b.bossid = '神秘贡献点' ORDER BY b.count DESC LIMIT 10";
				var pstmt = conn.prepareStatement(sql);
				var result = pstmt.executeQuery();
				var text = "\t\t\t\t#e#d★ 神秘贡献排行 ★#k#n\r\n\r\n";
				text += "\t#e名次#n\t#e玩家昵称#n\t\t\t#e贡献点#n\r\n";
				for (var i = 1; i <= 10; i++) {
					if (!result.next()) {
						break;
					}
					if (i == 1) {
						text += "#r";
					} else if (i == 2) {
						text += "#g";
					} else if (i == 3) {
						text += "#b";
					}
					text += "\t " + i + "\t\t ";
					
					// 填充名字空格
					text += result.getString("name");
					for (var j = 16 - result.getString("name").getBytes().length; j > 0 ; j--) {
						text += " ";
					}
					text += "\t " + result.getString("count");
				
	
					text += "\r\n";
				}
				result.close();
				pstmt.close();
				cm.sendSimple(text);
				status = -1;
			} else if (selection == 1) {
				typed = 1;
				var text = "请选择您要贡献的道具：\r\n";
				for(var i in needItems) {
					var itemid = needItems[i][0];
					var points = needItems[i][1];
					text += "#L"+i+"##v"+itemid+"##b#t"+itemid+"# #d每提交1个可获得#r"+points+"#d贡献点#l\r\n";
				}
				cm.sendSimple(text);
			} else if (selection == 999) {
				em.setProperty("state", "0");
				cm.sendOk("重置成功。");
				status = -1;
			} else if (selection == 998) {
				var text = "刷新成功。";
				em.setObjectProperty("_itemList", itemList);
				em.setProperty("_maxDropTimes", maxDropTimes);
				em.setProperty("_dropQuantity", dropQuantity);
				cm.sendOk(text);
				cm.dispose();
				return;
				status = -1;
			} else if (selection == 997) {
				em.getIv().invokeFunction("startEvent", em);
				cm.sendOk("激活成功！");
				cm.dispose();
			} else {
				var text = "亲爱的#e#h0##n冒险家：\r\n";
				text += "#d剩余贡献点：#r#e"+cm.getCredit("神秘贡献点")+"#n#k 点\r\n";
				text += "#d截至目前您一共贡献了#r#e" + cm.getBossLog("神秘贡献点", 1) + "#d#n能量点！\r\n";
				cm.sendNext(text);
				status = -1;
			}
		} else if (status == 2) {
			itemKey = selection;
			var item = needItems[selection];
			var maxQuantity = Math.ceil((needMaxPoints-parseInt(em.getProperty("state"))) / item[1]);
			var text = "当前能量点：#r"+parseInt(em.getProperty("state"))+"#k 点\r\n";
			text += "您当前有 #r"+cm.getItemQuantity(item[0])+ " #k个#b#t"+item[0]+"#\r\n";
			text += "#k请输入想要贡献的道具数量：\r\n";
			cm.sendGetNumber(text, 0, 1, maxQuantity)
		} else if (status == 3) {
			if (selection == 0) {
				cm.sendNext("请输入一个大于0的数！");
				status = -1;
			} else if (cm.getItemQuantity(needItems[itemKey][0]) >= selection) {
				var currentPoints = selection * needItems[itemKey][1];
				var points = parseInt(em.getProperty("state")) + currentPoints;
				em.setProperty("state", points);
				cm.sendOk("贡献成功！目前现在全服务器的能量点为：" + em.getProperty("state") + "！\r\n继续加油努力吧！！");
				status = -1;
				gainRankingCP(currentPoints);
				cm.gainItem(needItems[itemKey][0], -selection);
				cm.gainCredit("神秘贡献点", currentPoints);
				//当能量点足够时，触发物品掉落事件
				if (points >= needMaxPoints) {
					em.getIv().invokeFunction("startEvent", em);
				}
				
			} else {
				cm.sendOk("你好像没有足够的#b#t" + needItems[itemKey][0] + "##k！\r\n请检查一下再来。");
				status = -1;
			}
		}
	}
}

function getEvent(name, channel) {
	var cserv = Packages.handling.channel.ChannelServer.getInstance(channel);
	var event = cserv.getEventSM().getEventManager(name);
	return event;
}

function gainRankingCP(num) {
	var points = cm.getBossLog("神秘贡献点", 1);
	var conn = Packages.database.DatabaseConnection.getConnection();
	var sql = "UPDATE bosslog SET count = ?, `time` = CURRENT_TIMESTAMP  WHERE bossid = ? AND characterid = ? AND type = 1";
	var pstmt = conn.prepareStatement(sql);
	pstmt.setInt(1, (points + num));
	pstmt.setString(2, "神秘贡献点");
	pstmt.setInt(3, cm.getPlayer().getId());
	pstmt.executeUpdate();
	if (pstmt!=null) pstmt.close();
}