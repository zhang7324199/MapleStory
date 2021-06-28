var status = 0;
var selStr;
var sel;
var selitem;
var aaa = "#fUI/UIWindow.img/PvP/Scroll/enabled/next2#";
var bbb = "#fUI/UIWindow.img/Shop/meso#";
var vvv = "#fUI/UIWindow2.img/ValuePack/button/complete/0#";//领取完成
var xx = "#fEffect/CharacterEff/1082565/4/0#";
var epp = "#fEffect/CharacterEff/1082312/0/0#";  //彩光
var xxx = "#fEffect/CharacterEff/1082565/2/0#"; //星系

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
			selStr = "#r#e\t\t\t\t<羊羊大作战>#n#k.\r\n#d#e\t\t#b\r\n你目前拥有： #r" + cm.getChar().getCSPoints(1)  + "#k#r#d点卷\r\n\r\n";
			selStr+="#e#r#L2#" + xxx + " 羊羊副本能获得什么#l\r\n";
			//selStr+="#L6#" + aaa + " #r#z4032496##k#b为武器增加全属性#b#l\r\n";
			selStr+="#e#r#L1#" + xxx + " 羊羊大作战（2张#t2431181#免费入场）#l\r\n";
			selStr+="#e#r#L4#" + xxx + " 羊羊大作战（使用88888点卷入场）#l\r\n";
			//selStr+="#e#r#L7#" + xxx + " 羊羊大作战（3人组队）（扣队长3张#i2431181#）#l\r\n";
			//selStr+="#e#r#L8#" + xxx + " 羊羊大作战（3人组队）（使用88888点卷入场）#l";
			cm.sendSimple(selStr);
    } else if (status == 1) {
		sel=selection;
        if(sel==1){
              if (cm.getParty() == null) { // No Party
                    cm.sendOk("需要先#b开启#k一个组队,而且只能是你一个人~.zzzZZZZZ..");
                    cm.dispose();

                } else if (!cm.isLeader()) { // Not Party Leader
                    cm.sendOk("请叫队长跟我说话.");
                    cm.dispose();

					  } else if (cm.getPlayer().getLevel() >= 240) { // Not Party Leader
                    cm.sendOk("超过了240级无法进入了...");
                    cm.dispose();

                } else if (cm.getMap(915010001).getCharactersSize() > 0) { // Not Party Leader
                    cm.sendOk("有人在挑战此副本，请稍等一会，或者换其它线尝试一下！..");
                    cm.dispose();

          } else if (!cm.haveItem(2431181,2)) { 
	cm.sendOk("你没有2张宝石嘭嘭入场券");
                    cm.dispose();

                } else {
                    var party = cm.getParty().getMembers();
                    if (party.size() > 1) {
                        cm.sendOk("#r对不起,为了彻底的测试你的能力,只能一人前往..");
                        cm.dispose();
                        return;
                    }
                    var em = cm.getEventManager("yydzz");
                    if (em == null) {
                        cm.sendOk("此副本出错啦,请联系管管修复吧.");
                        cm.dispose();

                    } else {
		    em.startInstance(cm.getPlayer().getParty(), cm.getPlayer().getMap(), 120);
                    cm.gainItem(2431181,-2);
                                        cm.worldSpouseMessage(0x0F0, "[经验副本] ：玩家 " + cm.getChar().getName() + " 进入了羊羊大作战经验副本.升级咻咻咻~。");
                        cm.dispose();
                    }
}
        } else if(sel==4){
              if (cm.getParty() == null) { // No Party
                    cm.sendOk("需要先#b开启#k一个组队,而且只能是你一个人~.zzzZZZZZ..");
                    cm.dispose();

                } else if (!cm.isLeader()) { // Not Party Leader
                    cm.sendOk("请叫队长跟我说话.");
                    cm.dispose();

                } else if (cm.getMap(915010001).getCharactersSize() > 0) { // Not Party Leader
                    cm.sendOk("有人在挑战此副本，请稍等一会，或者换其它线尝试一下！..");
                    cm.dispose();

					  } else if (cm.getPlayer().getLevel() >= 240) { // Not Party Leader
                    cm.sendOk("超过了240级无法进入了...");
                    cm.dispose();

                } else if (cm.getChar().getCSPoints(1) < 88888) { // Not Party Leader
                    cm.sendOk("你的点卷不足88888");
                    cm.dispose();

                } else {
                    var party = cm.getParty().getMembers();
                    if (party.size() > 1) {
                        cm.sendOk("#r对不起,为了彻底的测试你的能力,只能一人前往..");
                        cm.dispose();
                        return;
                    }
                    var em = cm.getEventManager("yydzz");
                    if (em == null) {
                        cm.sendOk("此副本出错啦,请联系管管修复吧.");
                        cm.dispose();

                    } else {
		    em.startInstance(cm.getPlayer().getParty(), cm.getPlayer().getMap(), 120);
		    cm.gainNX(1, -88888);
                                        cm.worldSpouseMessage(0x0F0, "[经验副本] ：玩家 " + cm.getChar().getName() + " 进入了羊羊大作战经验副本.升级咻咻咻~。");
                        cm.dispose();
                    }
}
        } else if(sel==7){
              if (cm.getParty() == null) { // No Party
                    cm.sendOk("需要先#b开启#k一个组队");
                    cm.dispose();

                } else if (!cm.isLeader()) { // Not Party Leader
                    cm.sendOk("请叫队长跟我说话.");
                    cm.dispose();

                } else if (cm.getMap(915010001).getCharactersSize() > 0) { // Not Party Leader
                    cm.sendOk("有人在挑战此副本，请稍等一会，或者换其它线尝试一下！..");
                    cm.dispose();

                } else if (cm.haveItem(2431181) < 3) { // Not Party Leader
                    cm.sendOk("你没有3张宝石嘭嘭入场券");
                    cm.dispose();

                } else {
                    var party = cm.getParty().getMembers();
                    if (party.size() > 3 && party.size() < 2 ) {
                        cm.sendOk("#r对不起,组队必须2人以上，4人以下或者选择单人模式");
                        cm.dispose();
                        return;
                    }
                    var em = cm.getEventManager("yydzz");
                    if (em == null) {
                        cm.sendOk("此副本出错啦,请联系管管修复吧.");
                        cm.dispose();

                    } else {
		    em.startInstance(cm.getPlayer().getParty(), cm.getPlayer().getMap(), 120);
                    cm.gainItem(2431181,-3);
                    cm.getC().getChannelServer().broadcastPacket(Packages.tools.MaplePacketCreator.serverNotice(0x09, cm.getC().getChannel(), "『羊羊大作战』" + " : " + "玩家<" + cm.getChar().getName() + ">带领Ta的队员进入了天空之城宝物仓库进行掠夺财宝[组队模式]"));
                        cm.dispose();
                    }
}
        } else if(sel==8){
              if (cm.getParty() == null) { // No Party
                    cm.sendOk("需要先#b开启#k一个组队");
                    cm.dispose();

                } else if (!cm.isLeader()) { // Not Party Leader
                    cm.sendOk("请叫队长跟我说话.");
                    cm.dispose();

                } else if (cm.getMap(915010001).getCharactersSize() > 0) { // Not Party Leader
                    cm.sendOk("有人在挑战此副本，请稍等一会，或者换其它线尝试一下！..");
                    cm.dispose();

                } else if (cm.getChar().getCSPoints(1) < 88888) { // Not Party Leader
                    cm.sendOk("你的点卷不足88888");
                    cm.dispose();

                } else {
                    var party = cm.getParty().getMembers();
                    if (party.size() > 3 && party.size() < 2) {
                        cm.sendOk("#r对不起,组队必须2人以上，4人以下,或者选择单人模式");
                        cm.dispose();
                        return;
                    }
                    var em = cm.getEventManager("yydzz");
                    if (em == null) {
                        cm.sendOk("此副本出错啦,请联系管管修复吧.");
                        cm.dispose();

                    } else {
		    em.startInstance(cm.getPlayer().getParty(), cm.getPlayer().getMap(), 120);
		    cm.gainNX(1, -88888);
                    cm.getC().getChannelServer().broadcastPacket(Packages.tools.MaplePacketCreator.serverNotice(0x09, cm.getC().getChannel(), "『羊羊大作战』" + " : " + "玩家<" + cm.getChar().getName() + ">带领Ta的队员进入了天空之城宝物仓库进行掠夺财宝[组队模式]"));
                        cm.dispose();
                    }
}
		} else if (sel==3){
			cm.dispose();
              	        cm.openNpc(1061009,2);  
		} else if (sel==5){
			cm.dispose();
              	        cm.openNpc(1061009,3);                        
		} else if (sel==2){
			cm.sendOkS("#r#e<羊羊大作战>\r\n#r#e副本特色：#k#n进入后，每次15秒刷新一批怪物,获得海量经验\r\n#r#e进入条件#k#n：宝石嘭嘭入场券.或者点券入场，宝石嘭嘭入场券可以在在线时间奖励领取",2);
			cm.dispose();
		} else if (sel==6){
			cm.sendOkS("暂未开放",2);
			cm.dispose();
	 }
}
}
