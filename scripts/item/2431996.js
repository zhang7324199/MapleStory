status = -1;
var selectJob = Array("战士","魔法师","弓箭手","飞侠","海盗");
var itemList = Array(
	//战士
	Array(
		//Array(1102476, 300), // 诺巴西亚戴斯披风 // (无描述)
		//Array(1072737, 300), // 诺巴西亚戴斯靴 // (无描述)
		//Array(1132169, 300), // 诺巴西亚戴斯腰带 // (无描述)
		//Array(1082543, 220), // 暴君西亚戴斯手套 // (无描述)
		//Array(1102481, 220), // 暴君西亚戴斯披风 // (无描述)
		//Array(1072743, 220), // 暴君西亚戴斯靴 // (无描述)
		//Array(1132174, 220), // 暴君西亚戴斯腰带 // (无描述)
		Array(1122122, 220)
	),
	//魔法师
	Array(
		//Array(1102477, 300), // 诺巴赫尔梅斯披风 // (无描述)
		//Array(1072738, 300), // 诺巴赫尔梅斯靴 // (无描述)
		//Array(1132170, 300), // 诺巴赫尔梅斯腰带 // (无描述)
		//Array(1082544, 220), // 暴君赫尔梅斯手套 // (无描述)
		//Array(1102482, 220), // 暴君赫尔梅斯披风 // (无描述)
		//Array(1072744, 220), // 暴君赫尔梅斯靴 // (无描述)
		//Array(1132175, 220), // 暴君赫尔梅斯腰带 // (无描述)
		Array(1122123, 220)
	
	),
	//弓箭手
	Array(
		//Array(1102478, 300), // 诺巴凯伦披风 // (无描述)
		//Array(1072739, 300), // 诺巴凯伦靴 // (无描述)
		//Array(1132171, 300), // 诺巴凯伦腰带 // (无描述)
		//Array(1082545, 220), // 暴君凯伦手套 // (无描述)
		//Array(1102483, 220), // 暴君凯伦披风 // (无描述)
		//Array(1072745, 220), // 暴君凯伦靴 // (无描述)
		//Array(1132176, 220), // 暴君凯伦腰带 // (无描述)
		Array(1122124, 220)// -
	
	),
	//飞侠
	Array(
		//Array(1102479, 300), // 诺巴利卡昂披风 // (无描述)
		//Array(1072740, 300), // 诺巴利卡昂靴 // (无描述)
		//Array(1132172, 300), // 诺巴利卡昂腰带 // (无描述)
		//Array(1082546, 220), // 暴君利卡昂手套 // (无描述)
		//Array(1102484, 220), // 暴君利卡昂披风 // (无描述)
		//Array(1072746, 220), // 暴君利卡昂靴 // (无描述)
		//Array(1132177, 220),// 暴君利卡昂腰带 // (无描述)
		Array(1122125, 220)//  - 
	
	),
	//海盗
	Array(
		//Array(1102480, 300), // 诺巴阿尔泰披风 // (无描述)
		//Array(1072741, 300), // 诺巴阿尔泰靴 // (无描述)
		//Array(1132173, 300), // 诺巴阿尔泰腰带 // (无描述)
		//Array(1082547, 220), // 暴君阿尔泰手套 // (无描述)
		//Array(1102485, 220), // 暴君阿尔泰披风 // (无描述)
		//Array(1072747, 220), // 暴君阿尔泰靴 // (无描述)
		//Array(1132178, 220),// 暴君阿尔泰腰带 // (无描述)
		Array(1122126, 220)//  -
	)
);

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
       if (mode == 0 && status == 0) {
			im.dispose();
			return;
		}
        status--;
    }
    if (status == 0) {
        var text = "";
		for(var i=0; i<selectJob.length; i++) {
			text+="#L"+i+"#"+selectJob[i]+"#l\t";
			if (!((i+1)%3)) {
				text+="\r\n\r\n";
			}
		}
		im.sendSimple("打开箱子可以获得暴君装备或者冒险之心，请选择你要抽取的装备职业：\r\n#b"+text);
    } else if(status == 1) {
		var _itemList = itemList[selection];
		var chance = Math.floor(Math.random() * 220);
        var finalitem = Array();
        for (var i = 0; i < _itemList.length; i++) {
            if (_itemList[i][1] >= chance) {
                finalitem.push(_itemList[i]);
            }
        }
        if (finalitem.length != 0) {
            var item;
            var random = new java.util.Random();
            var finalchance = random.nextInt(finalitem.length);
            var itemId = finalitem[finalchance][0];
            var quantity = 1;
            var notice = 3;
            item = im.gainGachaponItem(itemId, quantity, "神装箱子", notice);
            if (item != -1) {
			im.gainItem(2431996, -1);
                im.sendOk("你获得了 #b#t" + item + "##k " + quantity + "个。");
            } else {
                im.sendOk("请你确认在背包的装备，消耗，其他窗口中是否有一格以上的空间。");
            }
            im.safeDispose();
        } else {
            im.sendOk("今天的运气可真差，什么都没有拿到。");
            im.safeDispose();
        }
	}
}
