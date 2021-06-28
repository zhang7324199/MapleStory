var status = -1;

function start() {
	var menu = im.getSkillMenu(30);
	if (menu == "") {
		im.sendOkS("鐪嬫潵浣犱笉闇€瑕佸叾浠栬兘鎵嬪唽鍟娿€?, 4, 2080009);
		im.dispose();
	} else {
		im.sendSimpleS("浣犲彲浠ユ彁鍗囩殑鎶€鑳界洰褰曞涓嬨€俓r\n" + menu + "\r\n\r\n#r#L0# #fn榛戜綋##fs14##e鍙栨秷浣跨敤鑳芥墜鍐屻€?n#fs##fn##l", 5, 2080009);
	}
}

function action(mode, type, selection) {
	if (mode == 1)
		status++;
	else
		status--;

	if (status == 0) {
		if (selection > 0 && im.canUseSkillBook(selection, 30) && im.used()) {
			im.useSkillBook(selection, 30);
		} else if (selection != 0) {
			im.sendOkS("鐪嬫潵浣犱笉闇€瑕佸叾浠栬兘鎵嬪唽鍟娿€?, 4, 2080009);
		}
		im.dispose();
	} else {
		im.dispose();
	}
}
