var aa ="#fUI/UIWindow.img/PvP/Scroll/enabled/next2#";
var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (status == 0 && mode == 0) {
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    } else {
        status--;
    }
    if (status == 0) {
            //var selStr = "#fUI/UIWindow2.img/Quest/quest_info/summary_icon/summary#\r\n\r\n";//\r\n#L0#扎昆\r\n#L1#黑龙
			var selStr = "#e#b欢迎使用消除副本挑战次数。#k#n\r\n";
			selStr += "#r#L0#"+aa+" 扎昆  #d(剩余： #r"+(10-cm.getPQLog("扎昆"))+"/10 #d次，20000点券重置)#l\r\n";
			selStr += "#r#L2#"+aa+" 普通黑龙  #d(剩余： #r"+(5-cm.getPQLog("暗黑龙王"))+"/5 #d次，20000点券重置)#l\r\n";             
			selStr += "#r#L3#"+aa+" 进阶黑龙  #d(剩余： #r"+(5-cm.getPQLog("进阶暗黑龙王"))+"/5 #d次，80000点券重置)#l\r\n";
			selStr += "#r#L4#"+aa+" 巨大蝙蝠  #d(剩余： #r"+(3-cm.getPQLog("巨大蝙蝠"))+"/3 #d次，2000W金币重置)#l\r\n";
			selStr += "#r#L5#"+aa+" 困难蝙蝠  #d(剩余： #r"+(1-cm.getPQLog("巨大蝙蝠[困难]"))+"/1 #d次，4000W金币重置)#l\r\n";
			selStr += "#r#L6#"+aa+" 普通ＰＢ  #d(剩余： #r"+(3-cm.getPQLog("品克缤"))+"/3 #d次，50000点券重置)#l\r\n";
			selStr += "#r#L7#"+aa+" 混沌ＰＢ  #d(剩余： #r"+(1-cm.getPQLog("混沌品克缤"))+"/1 #d次，80000点券重置)#l\r\n";
			//selStr += "#r#L8#"+aa+" 阿卡伊勒  #d(剩余： #r"+(3-cm.getPQLog("阿卡伊勒[普通]"))+"/3 #d次，50000点券重置)#l\r\n";
			selStr += "#r#L9#"+aa+" 希拉  #d(剩余： #r"+(5-cm.getPQLog("希拉"))+"/2 #d次，80000点券重置)#l\r\n";
			selStr += "#r#L11#"+aa+" 血腥女王  #d(剩余： #r"+(3-cm.getPQLog("腥血女王"))+"/3 #d次，10现金点重置)#l\r\n";
			selStr += "#r#L12#"+aa+" 进阶女王  #d(剩余： #r"+(1-cm.getPQLog("进阶腥血女王"))+"/1 #d次，30现金点重置)#l\r\n";
			selStr += "#r#L13#"+aa+" 普通皮埃尔#d(剩余： #r"+(3-cm.getPQLog("皮埃尔"))+"/3 #d次，10现金点重置)#l\r\n";
			selStr += "#r#L14#"+aa+" 进阶皮埃尔#d(剩余： #r"+(1-cm.getPQLog("进阶皮埃尔"))+"/1 #d次，30现金点重置)#l\r\n";
			selStr += "#r#L15#"+aa+" 普通半半  #d(剩余： #r"+(3-cm.getPQLog("半半"))+"/3 #d次，10现金点重置)#l\r\n";
			selStr += "#r#L16#"+aa+" 进阶半半  #d(剩余： #r"+(1-cm.getPQLog("进阶半半"))+"/1 #d次，30现金点重置)#l\r\n";
			selStr += "#r#L17#"+aa+" 普通贝伦  #d(剩余： #r"+(3-cm.getPQLog("贝伦"))+"/3 #d次，10现金点重置)#l\r\n";
			selStr += "#r#L18#"+aa+" 进阶贝伦  #d(剩余： #r"+(1-cm.getPQLog("进阶贝伦"))+"/1 #d次，30现金点重置)#l\r\n";
			//selStr += "#r#L19#"+aa+" 女皇希纳斯#d(剩余： #r"+(2-cm.getPQLog("女皇：希纳斯"))+"/2 #d次，50000点券重置)#l\r\n";
			selStr += "#r#L20#"+aa+" 贝勒·德  #d(剩余： #r"+(2-cm.getPQLog("贝勒·德"))+"/2 #d次，50现金点重置)#l\r\n";
			selStr += "#r#L21#"+aa+" 困难暴君  #d(剩余： #r"+(1-cm.getPQLog("麦格纳斯[困难]"))+"/1 #d次，50现金点重置)#l\r\n";
			selStr += "#r#L22#"+aa+" 远征斯乌  #d(剩余： #r"+(1-cm.getPQLog("斯乌<困难>[远征队]"))+"/1 #d次，50现金点重置)#l\r\n";
 	    cm.sendSimple(selStr);
    } else if (status == 1) {
      switch (selection) {
        case 0:
           if (cm.getPlayer().getCSPoints(1) >= 20000 && cm.getPQLog("扎昆") >= 10) {
                    cm.resetPQLog("扎昆");
					cm.gainNX(1, -20000);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 扎昆 的次数.");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的抵用券不够。");
                    cm.dispose();
                }
            	    break;
        case 1:
           if (cm.getPlayer().getCSPoints(2) >= 20000 && cm.getPQLog("进阶扎昆") >= 5) {
                    cm.resetPQLog("进阶扎昆");
					cm.gainNX(2, -20000);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 进阶扎昆 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的抵用券不够。");
                    cm.dispose();
                }
            	    break;
        case 2:
            if (cm.getPlayer().getCSPoints(1) >= 20000 && cm.getPQLog("暗黑龙王") >= 5) {
                    cm.resetPQLog("暗黑龙王");
					cm.gainNX(1, -20000);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 普通黑龙王 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的点券不够。");
                    cm.dispose();
                }
            	    break;
        case 3:
            if (cm.getPlayer().getCSPoints(1) >= 80000 && cm.getPQLog("进阶暗黑龙王") >= 5) {
                    cm.resetPQLog("进阶暗黑龙王");
					cm.gainNX(1, -80000);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 进阶暗黑龙王 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的点券不够。");
                    cm.dispose();
                }
            	    break;
        case 4:
           if (cm.getMeso() >= 20000000 && cm.getPQLog("巨大蝙蝠") >= 3) {
                    cm.resetPQLog("巨大蝙蝠");
					cm.gainMeso( -20000000);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 巨大蝙蝠 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的金币不够。");
                    cm.dispose();
                }
            	    break;
        case 5:
           if (cm.getMeso() >= 40000000 && cm.getPQLog("巨大蝙蝠[困难]") >= 1) {
                    cm.resetPQLog("巨大蝙蝠[困难]");
					cm.gainMeso( -40000000);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 巨大蝙蝠[困难] 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的金币不够。");
                    cm.dispose();
                }
            	    break;
        case 6:
            if (cm.getPlayer().getCSPoints(1) >= 50000 && cm.getPQLog("品克缤") >= 3) {
                    cm.resetPQLog("品克缤");
					cm.gainNX(1, -50000);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 品克缤 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的点券不够。");
                    cm.dispose();
                }
            	    break;
        case 7:
           if (cm.getPlayer().getCSPoints(1) >= 80000 && cm.getPQLog("混沌品克缤") >= 1) {
                    cm.resetPQLog("混沌品克缤");
					cm.gainNX(1, -80000);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 混沌品克缤 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的点券不够。");
                    cm.dispose();
                }
            	    break;
        case 8:
           if (cm.getPlayer().getCSPoints(1) >= 50000 && cm.getPQLog("阿卡伊勒[普通]") >= 3) {
                    cm.resetPQLog("阿卡伊勒[普通]");
					cm.gainNX(1, -50000);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 阿卡伊勒 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的点券不够。");
                    cm.dispose();
                }
            	    break;
		case 9:
           if (cm.getPlayer().getCSPoints(1) >= 20000 && cm.getPQLog("神话副本") >= 2) {
                    cm.resetPQLog("神话副本");
					cm.gainNX(1, -20000);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 希拉[普通] 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的点券不够。");
                    cm.dispose();
                }
            	    break;
        case 10:
           if (cm.getPlayer().getCSPoints(1) >= 50000 && cm.getPQLog("希拉[困难]") >= 3) {
                    cm.resetPQLog("希拉[困难]");
					cm.gainNX(1, -50000);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 希拉[困难] 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的点券不够。");
                    cm.dispose();
                }
            	    break;
		case 11:
           if (cm.getHyPay(1) >= 10 && cm.getPQLog("腥血女王") >= 1) {
                    cm.resetPQLog("腥血女王");
					cm.addHyPay(10);
					cm.gainItem(4033611, 3);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 腥血女王 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的现金点不够。剩余: "+cm.getHyPay(1)+" 元。");
                    cm.dispose();
                }
            	    break;
		case 12:
           if (cm.getHyPay(1) >= 30 && cm.getPQLog("进阶腥血女王") >= 1) {
                    cm.resetPQLog("进阶腥血女王");
					cm.addHyPay(30);
					cm.gainItem(4033611, 1);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 进阶腥血女王 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的现金点不够。剩余: "+cm.getHyPay(1)+" 元。");
                    cm.dispose();
                }
            	    break;
		case 13:
           if (cm.getHyPay(1) >= 10 && cm.getPQLog("皮埃尔") >= 3) {
                    cm.resetPQLog("皮埃尔");
					cm.addHyPay(10);
					cm.gainItem(4033611, 3);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 皮埃尔 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的现金点不够。剩余: "+cm.getHyPay(1)+" 元。");
                    cm.dispose();
                }
            	    break;
		case 14:
           if (cm.getHyPay(1) >= 30 && cm.getPQLog("进阶皮埃尔") >= 1) {
                    cm.resetPQLog("进阶皮埃尔");
					cm.addHyPay(30);
					cm.gainItem(4033611, 1);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 进阶皮埃尔 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的现金点不够。剩余: "+cm.getHyPay(1)+" 元。");
                    cm.dispose();
                }
            	    break;
		case 15:
           if (cm.getHyPay(1) >= 10 && cm.getPQLog("半半") >= 3) {
                    cm.resetPQLog("半半");
					cm.addHyPay(10);
					cm.gainItem(4033611, 3);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 半半 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的现金点不够。剩余: "+cm.getHyPay(1)+" 元。");
                    cm.dispose();
                }
            	    break;
		case 16:
           if (cm.getHyPay(1) >= 30 && cm.getPQLog("进阶半半") >= 1) {
                    cm.resetPQLog("进阶半半");
					cm.addHyPay(30);
					cm.gainItem(4033611, 1);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 进阶半半 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的现金点不够。剩余: "+cm.getHyPay(1)+" 元。");
                    cm.dispose();
                }
            	    break;
		case 17:
           if (cm.getHyPay(1) >= 10 && cm.getPQLog("贝伦") >= 3) {
                    cm.resetPQLog("贝伦");
					cm.addHyPay(10);
					cm.gainItem(4033611, 3);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 进阶贝伦 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的现金点不够。剩余: "+cm.getHyPay(1)+" 元。");
                    cm.dispose();
                }
            	    break;
		case 18:
           if (cm.getHyPay(1) >= 30 && cm.getPQLog("进阶贝伦") >= 1) {
                    cm.resetPQLog("进阶贝伦");
					cm.addHyPay(30);
					cm.gainItem(4033611, 1);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 进阶贝伦 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的现金点不够。剩余: "+cm.getHyPay(1)+" 元。");
                    cm.dispose();
                }
            	    break;
		case 19:
           if (cm.getPlayer().getCSPoints(1) >= 50000 && cm.getPQLog("女皇：希纳斯") >= 2) {
                    cm.resetPQLog("女皇：希纳斯");
					cm.gainNX(1, -50000);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 女皇：希纳斯 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的点券不够。");
                    cm.dispose();
                }
            	    break;
		case 20:
           if (cm.getHyPay(1) >= 50 && cm.getPQLog("贝勒·德") >= 2 && cm.getPQLog("重置贝勒机会") < 3) {
                    cm.resetPQLog("贝勒·德");
					cm.setPQLog("重置贝勒机会");
					cm.gainItem(4033981, 2);
					cm.addHyPay(50);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 贝勒·德 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的现金点不够。剩余: "+cm.getHyPay(1)+" 元。\r\n3). 当天还能重置 "+ (3-cm.getPQLog("重置贝勒机会")) +" 次");
                    cm.dispose();
                }
            	    break;
		case 21:
           if (cm.getHyPay(1) >= 50 && cm.getPQLog("麦格纳斯[困难]") >= 1 && cm.getPQLog("重置暴君机会") < 3) {
                    cm.resetPQLog("麦格纳斯[困难]");
					cm.setPQLog("重置暴君机会");
					cm.addHyPay(50);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 麦格纳斯[困难] 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的现金点不够。剩余: "+cm.getHyPay(1)+" 元。\r\n3). 当天还能重置 "+ (3-cm.getPQLog("重置暴君机会")) +" 次");
                    cm.dispose();
                }
            	    break;
		case 22:
           if (cm.getHyPay(1) >= 50 && cm.getPQLog("斯乌<困难>[远征队]") >= 1 && cm.getPQLog("重置斯乌机会") < 3) {
                    cm.resetPQLog("斯乌<困难>[远征队]");
					cm.setPQLog("重置斯乌机会");
					cm.addHyPay(50);
                    cm.sendOk("温馨提示：#b\r\n副本重置成功，勇士行动起来吧！");
					cm.spouseMessage(0x20, "『BOSS重置』 : [" + cm.getChar().getName() + "] 重置了 [远征队]斯乌 的次数");
					cm.dispose();
                } else {
                    cm.sendOk("温馨提示：#b\r\n\r\n1). 挑战的副本次数没用完，请使用后再试，以免浪费。\r\n2). 您的现金点不够。剩余: "+cm.getHyPay(1)+" 元。\r\n3). 当天还能重置 "+ (3-cm.getPQLog("重置斯乌机会")) +" 次");
                    cm.dispose();
                }
            	    break;
        }
    }
}
