/*
	热力四射礼盒
*/

var status;
var reward = Array(
					Array(1102481, 1, 1),	 //暴君西亚戴斯披风
					Array(1102482, 1, 1),	 //暴君赫尔梅斯披风
					Array(1102483, 1, 1),	 //暴君凯伦披风
					Array(1102484, 1, 1),	 //暴君利卡昂披风
					Array(1102485, 1, 1),	 //暴君阿尔泰披风
					Array(1082543, 1, 1),	 //
					Array(1082544, 1, 1),	 //
					Array(1082545, 1, 1),	 //
					Array(1082546, 1, 1),	 //
					Array(1082547, 1, 1),	 //
					Array(1072743, 1, 1),	 //
					Array(1072744, 1, 1),	 //
					Array(1072745, 1, 1),	 //
					Array(1072746, 1, 1),	 //
					Array(1072747, 1, 1),	 //
					Array(1132174, 1, 1),	 //
					Array(1132175, 1, 1),	 //
					Array(1132176, 1, 1),	 //
					Array(1132177, 1, 1),	 //
					Array(1132178, 1, 1),	 //
					Array(1132169, 1, 1),	 //诺巴
					Array(1132170, 1, 1),	 //
					Array(1132171, 1, 1),	 //
					Array(1132172, 1, 1),	 //
					Array(1132173, 1, 1),	 //
					Array(1102476, 1, 1),	 //
					Array(1102477, 1, 1),	 //
					Array(1102478, 1, 1),	 //
					Array(1102479, 1, 1),	 //
					Array(1102480, 1, 1),	 //
					Array(1072737, 1, 1),	 //
					Array(1072738, 1, 1),	 //
					Array(1072739, 1, 1),	 //
					Array(1072740, 1, 1),	 //
					Array(1072741, 1, 1),	 //
					Array(1003797, 1, 1),	 //ffn
					Array(1003798, 1, 1),	 //
					Array(1003799, 1, 1),	 //
					Array(1003800, 1, 1),	 //
					Array(1003801, 1, 1),	 //
					Array(1042255, 1, 1),	 //
					Array(1042256, 1, 1),	 //
					Array(1042257, 1, 1),	 //
					Array(1042258, 1, 1),	 //
					Array(1062165, 1, 1),	 //
					Array(1062166, 1, 1),	 //
					Array(1062167, 1, 1),	 //
					Array(1062168, 1, 1),	 //
					Array(1062169, 1, 1)	 //
					);

function start() {
	status = -1;
	action(1, 0, 0);
}

function action(mode, type, selection) {
	if (mode <= 0) {
		im.dispose();
		return;
	} else {
		if (mode == 1) {
			status++;
		} else {
			status--;
		}
	}

	if (status == 0) {
		if (!im.haveSpace(1)) {
			im.sendOk("装备栏空间不足，请整理后再打开");
			im.dispose();
			return;
		}
		var item;
		var index = Math.floor(Math.random() * reward.length);
		var quantity = Math.floor(Math.random() * reward[index][2] + reward[index][1]);
		im.gainItem(2430529, -1);		
		im.gainItem(reward[index][0], quantity);
		im.dispose();
	}
}
