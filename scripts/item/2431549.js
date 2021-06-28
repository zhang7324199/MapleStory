var status = 0;
var z = "#fUI/UIWindow/Quest/icon5/1#";//"+z+"//美化
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
        var selStr = "#e#r#fEffect/ItemEff/1112811/0/0##fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k\r\n\r\n";
		selStr += "#b欢迎使用便携服务箱,您可以将我放置在键盘快捷键上使用：#k\r\n";
		selStr += "#r#L0# "+z+" 拍卖中心#l    #L6#"+z+" 新手礼包#l  #L2#"+z+" 赞助网站#l\r\n";
		//selStr += "#L14# "+z+" 专属地图#l    #L6#"+z+" 服务中心#l  #L4#"+z+" 副本重置\r\n";
		//selStr += "#L11# "+z+" 点卷商店#l    #L12#"+z+" 美容美发#l  #L7#"+z+" 打开拍卖#l\r\n";
		//selStr += "#L15# "+z+" 弗兰德里#l    #L13#"+z+" 快速签到#l\r\n";
		selStr += "\r\n\r\n#fEffect/ItemEff/1112811/0/0##fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k#fEffect/ItemEff/1112811/0/0##n#k";
        im.sendSimple(selStr);
    } else if (status == 1) {
        switch (selection) {
        case 0:
			im.dispose();
			im.openNpc(1530635,0);
            break;
        case 2:
			im.dispose();
            im.openWeb("http://www.mxd4.com");
            break;
		case 7:
           if (im.getPQLog("三倍") < 1) { //三倍
            	im.gainItem(5211060,1,1);
				im.gainItem(5360015,1,1);
				im.setPQLog("三倍");
				im.sendOk("恭喜您领取认证特权的每日三倍经验卡一张以及双倍爆率卡.");
				im.worldSpouseMessage(0x20,"『认证系统』 ：玩家 "+ im.getChar().getName() +" 在认证随身NPC里领取每日三倍经验卡以及双倍爆率卡。");
				im.dispose();
            } else {
                im.sendOk("您已经领取过，请明日再领。");
				im.dispose();
            }
            break;
		case 110:
			im.dispose();
			im.openNpc(9310476);
		/*
           if (im.getPQLog("积分") < 1 && im.getPlayerPoints() > 180) { //积分
            	im.gainPlayerPoints(200);
				im.setPQLog("积分");
				im.sendOk("恭喜您领取VIP服务的每日积分200点.");
				im.worldSpouseMessage(0x20,"『认证系统』 ：玩家 "+ im.getChar().getName() +" 在随身NPC里领取每日积分 200 点。");
				im.dispose();
            } else {
                im.sendOk("失败：\r\n\r\n#r1). 您已经领取过，请明日再领。\r\n2). 您当前在线时间不足180分钟。");
				im.dispose();
            }*/
            break;
		case 12:
			im.dispose();
			im.openNpc(2010001);
          /* if (im.getPQLog("活力") < 1 && im.getPlayerPoints() > 180) { //活力
            	im.gainPlayerEnergy(50);
				im.gainPlayerPoints(-180);
				im.setPQLog("活力");
				im.sendOk("恭喜您领取VIP服务的每日活力50点.");
				im.worldSpouseMessage(0x20,"『认证系统』 ：玩家 "+ im.getChar().getName() +" 在随身NPC里领取每日活力 50 点。");
				im.dispose();
            } else {
                im.sendOk("失败：\r\n\r\n#r1). 您已经领取过，请明日再领。\r\n2). 您当前在线积分不足180点。");
				im.dispose();
            }*/
            break;
		case 4:
           if (im.getPQLog("所有副本重置") < 1) { //副本重置
				//im.resetEventCount("抽奖");
				im.resetEventCount("历练");
				im.resetEventCount("养成");
				im.resetEventCount("皇陵");
				im.resetEventCount("罗朱");
				im.resetEventCount("海盗");
				im.resetEventCount("鬼节");
				im.resetPQLog("mrdb");
				im.resetPQLog("进阶扎昆");
				im.resetPQLog("普通扎昆");
				im.resetPQLog("普通黑龙");
				im.resetPQLog("进阶黑龙");
				im.resetPQLog("普通皮埃尔");
				im.resetPQLog("钥匙");
				im.resetPQLog("古树钥匙");
				im.resetPQLog("进阶皮埃尔");
				im.resetPQLog("混沌品克缤");
				im.resetPQLog("希纳斯");
				im.resetPQLog("品克缤");
				im.resetPQLog("狮子王");
				im.resetPQLog("进阶贝伦");
				im.resetPQLog("普通贝伦");
				im.resetPQLog("普通血腥女皇");
				im.resetPQLog("进阶血腥女皇");
				im.resetPQLog("进阶血腥女皇");
				im.resetPQLog("阿里安特竞技场");
				im.setPQLog("所有副本重置");
				im.sendOk("恭喜您使用认证服务的重置了所有的副本.");
				im.worldSpouseMessage(0x20,"『认证系统』 ：玩家 "+ im.getChar().getName() +" 在认证随身NPC里重置了全部副本任务。");
				im.dispose();
            } else {
                im.sendOk("您已经重置过，请明日再重置。");
				im.dispose();
            }
            break;
		case 6:
			im.dispose();
			im.openNpc(2008);
            break;
		case 11:
			im.dispose();
			im.openNpc(9310073);
            break;
		case 13:
			im.dispose();
			im.openNpc(9310144);
            break;
		case 14:
            im.dispose();
            im.warp(706052000,0);//双倍道具
            break;
		case 15:
			im.dispose();
			im.openNpc(9310362);
            break;
		case 150:
			im.dispose();
			im.openNpc(9030000);
			break;
        }
    } else if (status == 2) {
		if (typed == 14) {
			im.worldSpouseMessage(0x07, "[世界]"+im.getPlayer().getMedalText()+im.getChar().getName()+" : "+im.getText());
			im.gainMeso(-200000);
			//im.dispose();
		}
		im.dispose();
	}
}
