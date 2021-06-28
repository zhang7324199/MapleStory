var ax = "#fEffect/CharacterEff/1112902/0/1#";  //蓝色爱心
var epp = "#fEffect/SetItemInfoEff/4/7#";  //蓝色四叶草
var xxx = "#fEffect/CharacterEff/1032054/0/0#";  //选项两边
var a = 0;
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
var selStr = "#d" + epp + "副本中心" + epp + "#l\r\n\r\n";
		selStr +="#e#r#L1#"+xxx+"经典副本"+xxx+"#l\t#e#r#L2#"+xxx+"组队副本"+xxx+"#l\t#L3#"+xxx+"娱乐副本"+xxx+"#l#n\r\n\r\n";
		selStr +="#e#r#L4#"+xxx+"英雄副本"+xxx+"#l\t#e#r#L5#"+xxx+"休闲副本"+xxx+"#l\t#L6#"+xxx+"野外副本"+xxx+"#l#n\r\n\r\n";
        selStr +="  \t\t\t\t\t#e#d#L7#"+xxx+"副本重置"+xxx+"#l#n\r\n\r\n";


        cm.sendSimple(selStr);
    } else if (status == 1) {
        switch (selection) {
        case 1:
            cm.dispose();
            cm.openNpc(9310390,"jdfb"); //魔方商城
            break;
        case 2:
            cm.dispose();
            cm.warp(910002000, 0); //卷轴商城
            break;

        case 3:
            cm.dispose();
            cm.openNpc(9310390,"ylfb"); //其他商城
            break;

        case 4:
            cm.dispose();
            cm.openNpc(9310390,"yxfb"); //强化商城
            break;
			 case 5:
            cm.dispose();
            cm.openNpc(9310390,"xxfb"); //强化商城
            break;
			case 6:
            cm.dispose();
            cm.openNpc(9310390,"ywfb"); //强化商城
            break;
			case 7:
            cm.dispose();
            cm.openNpc(9310390,"fbcz"); //强化商城
            break;
			case 8:
            cm.dispose();
            cm.openNpc(9310390,"tsfb"); //强化商城
            break;


        }
    }
}

