status = -1;
var itemList;
var random = java.lang.Math.floor(Math.random() * 5 + 5);
//var ScrollList = Array(
var itemList = Array(
Array(3010832, 1, 1, 3), //太阳椅子
Array(1102723, 2, 1, 3), //光明天使翅膀
Array(1102724, 2, 1, 3), //黑暗天使翅膀
Array(2435087, 1, 1, 3), //蜡笔随机箱子
Array(2432206, 9, 1, 3), //玫瑰花园箱子
Array(1004423, 1, 1, 3),  //埃苏莱布斯核心帽, 10, 1, 3), //(法师)
Array(1004424, 2, 1, 3),  //埃苏莱布斯核心帽, 10, 1, 3), //(弓箭手)
Array(1004425, 1, 1, 3),  //埃苏莱布斯核心帽, 10, 1, 3), //(飞侠)
Array(1004426, 2, 1, 3),  //埃苏莱布斯核心帽, 10, 1, 3), //(海盗
Array(1073034, 2, 1, 3),  //埃苏莱布斯核心鞋, 10, 1, 3), //(飞侠)
Array(1073035, 1, 1, 3),  //埃苏莱布斯核心鞋, 10, 1, 3), //(海盗)
Array(1212115, 2, 1, 3),  //埃苏莱布斯魔力源泉杖, 10, 1, 3), //(夜光法师)
Array(1472261, 1, 1, 3),  //埃苏莱布斯危险之手, 10, 1, 3), //(飞侠拳套)
Array(1102481, 1, 1, 3),  //暴君
Array(1102482, 1, 1, 3),  //埃苏莱布斯危险之手, 10, 1, 3), //(飞侠拳套)
Array(1102483, 1, 1, 3),  //埃苏莱布斯危险之手, 10, 1, 3), //(飞侠拳套)
Array(1102484, 1, 1, 3),  //埃苏莱布斯危险之手, 10, 1, 3), //(飞侠拳套)
Array(1102485, 1, 1, 3),  //埃苏莱布斯危险之手, 10, 1, 3), //(飞侠拳套)
Array(1482216, 2, 1, 3),  //暴君
Array(1492231, 3, 1, 3),  //埃苏莱布斯左轮枪, 10, 1, 3), //(海盗手枪)
Array(1522138, 3, 1, 3),  //埃苏莱布斯双风翼弩, 10, 1, 3), //(双弩精灵)
Array(1532144, 5, 1, 3),  //埃苏莱布斯荣耀炮, 10, 1, 3), //(火炮手)
Array(1532144, 5, 1, 3),  //埃苏莱布斯荣耀炮, 10, 1, 3), //(火炮手, 3),  1, 3, 3),   
Array(2434235, 5, 1, 3)
	);

function start() {
	action(1, 0, 0);
}

function action(mode, type, selection) {
	if (mode == 1) {
		status++;
	} else {
		if (status == 0) {
			im.sendOk("不想使用吗？");
			im.dispose();
		}
		status--;
	}
	if (status == 0) {
	im.sendYesNo("打开#v2430368#需要60W点卷,有几率获得一下道具哦#v3010832##v2434235##v2432206##v2435087##v2430683##v1102723##v1102724##v1004424##v1522138##v1102481##v1102482##v1102483##v1102484##v1102485#请问是否打开?");
	} else if(status == 1) {
		if (!im.canHoldSlots(1) || im.getPlayer().getCSPoints(1) < 600000) {
			im.sendOk("请确保包裹每个栏位大于1个格子。\r\n或你的点劵不足60W！");
			im.dispose();
			return;
		}
		var items = gainGift(1);
		var text = '恭喜你，获得了\r\n';
		im.gainItem(2430368, -1);
		im.gainNX(1, -600000);//扣除点券
		for(var key in items) {
			var itemId = items[key][0];
			var quantity = items[key][1];
			text += "#v"+ itemId +"##b#t" + itemId + "##k " + quantity + "个。\r\n";
		}
		im.sendOk(text);
		im.safeDispose();
	}
}

function gainGift(num) {
	var lastItem = Array();
	for(var j=0; j<num; j++) {
		var chance = Math.floor(Math.random() * 10);
		var finalitem = Array();
		for (var i = 0; i < itemList.length; i++) {
			if (itemList[i][1] >= chance) {
				finalitem.push(itemList[i]);
			}
		}
		if (finalitem.length != 0) {
			var item;
			var random = new java.util.Random();
			var finalchance = random.nextInt(finalitem.length);
			var itemId = finalitem[finalchance][0];
			var quantity = finalitem[finalchance][2];
			var notice = finalitem[finalchance][3];
			item = im.gainGachaponItem(itemId, quantity, "【恶灵的箱子】", notice);
			if (item != -1)
			{
				lastItem.push(Array(itemId, quantity));
			} else {
				j--;
			}
		}
	}
	return lastItem;
}
