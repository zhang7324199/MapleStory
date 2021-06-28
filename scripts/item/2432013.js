//女神之泪
var status = 0;
var itemPosition=0;
//基础成功率
var rate = 90;
//成功率的递减值
var decreaseRate = 20;
//升级消耗的个数
var expendNum = 10;
var typed = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (status == 0 && mode == 0) {
        im.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    } else {
        status--;
    }
	if (status == 0) {
		var text = "你想做什么？\r\n";
		text+= "#b#L1#升级神话耳环#l\r\n";
		text+= "#b#L2#合成女神之血滴#l\r\n";
		im.sendSimple(text);
	} else if (status == 1) {
		if (selection == 1) {
			typed = 1;
			if (!im.haveItem(2432013, expendNum))
			{
				im.sendOk("你需要"+expendNum+"滴#b女神之泪#k才可以进行神话耳环升级");
				im.dispose();
				return;
			}
			var itemList = im.getInventory(1).list().iterator();
			var text = "请选择您要升级的耳环：\r\n";
			var indexof = 0;
			while(itemList.hasNext()) {
				var item = itemList.next();
				var flag = false;
				switch(item.getItemId()) {
					case 1032205: // 神话耳环 - (无描述)
					case 1032206: // 神话耳环复原第1阶段 - (无描述)
					case 1032207: // 神话耳环复原第2阶段 - (无描述)
					case 1032208: // 神话耳环复原第3阶段 - (无描述)
					case 1032209: // 神话耳环复原第4阶段 - (无描述)
						flag = true;
						break;
					//1032219 // 遗忘之神话耳环 - (无描述)
				}
				if (!flag)
					continue;
				if (indexof > 1 && indexof % 5 == 0) {
					text += "\r\n";
				}
				indexof++;
				text += "#L"+item.getPosition()+"##v"+item.getItemId()+"##l";
			}
			text+="\r\n\r\n#d不同复原程度升级时成功率不同，失败时装备不损坏";
			if (indexof==0)
				text = "没有可以进行升级的神话耳环";
			im.sendSimple(text);
		} else if (selection == 2) {
			typed = 2;
			if (!im.haveItem(2432013, 100))
			{
				im.sendOk("你没有#r100#k滴女神之泪，无法进行合成！");
				im.dispose();
				return;
			}
			im.sendYesNo("是否使用#r100#k滴#b女神之泪#k合成一个#r女神之血滴#k？");
		}
	} else if (status == 2) {
		if (typed == 1) {
			itemPosition = selection;
			itemId = im.getInventory(1).getItem(itemPosition).getItemId();
			if (itemId == 1032209) {
				im.sendOk("#b神话耳环复原第4阶段#k需要#r女神之血滴#k才能进行升级.");
				im.dispose();
				return;
			}
			var chance = Math.floor(Math.random()*100);
			rate = rate-(Math.floor(itemId%1032200)-5)*decreaseRate;
			//java.lang.System.out.println(rate);
			if (chance <= rate) {
			//成功
				var upgradeItemId = (itemId == 1032209) ? parseInt(itemId)+10 : parseInt(itemId)+1;
				im.removeSlot(1, itemPosition, 1);
				im.gainItem(upgradeItemId, 1);
				if (upgradeItemId == 1032219)
					im.worldSpouseMessage(0x15, "[神话耳环] : 恭喜 " + im.getChar().getName() + " 成功将 神话耳环复原第4阶段 升级为 遗忘之神话耳环！");
				im.sendOk("恭喜你，得到了#v"+upgradeItemId+"#");
			} else {
			//失败
				im.sendOk("真遗憾，升级失败了。");
			}
			im.gainItem(2432013, -expendNum);
			im.safeDispose();
		} else if (typed==2) {
			im.gainItem(2432013, -100);
			im.gainItem(2432014, 1);
			im.sendOk("恭喜你获得了一个#b#v2432014##t2432014##k。");
			im.safeDispose();
		}
	}
}