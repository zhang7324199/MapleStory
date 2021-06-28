var epp = "#fEffect/SetItemInfoEff/297/8#";  //彩光 红色
var ax = "#fEffect/CharacterEff/1112902/0/1#";  //蓝色爱心
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
var selStr = "#d#e" + epp + "" + ax + "休闲副本" + ax + "" + epp + "#l\r\n";
		selStr +="#e#r\t\t#L3#"+xxx+"金币副本"+xxx+"#l\t\t#L997#"+xxx+"家族跑旗"+xxx+"#l#l#n\r\n";
		selStr +="#e#r#L994#"+xxx+"外星访客"+xxx+"#l\t#L993#"+xxx+"鬼魂公园"+xxx+"#l\t#L2#"+xxx+"武陵道场"+xxx+"#l\r\n";
		selStr +="\r\n";




        cm.sendSimple(selStr);
    } else if (status == 1) {
        switch (selection) {
        case 1:
            cm.dispose();
            cm.openNpc(9000113); //魔方商城
            break;
			case 2:
                cm.dispose();
                cm.spouseMessage(0x20, "[武陵道场] ：玩家 " + cm.getChar().getName() + " 进入了武陵道场。");
                cm.warp(925020001);
                break;
							case 3:
				cm.dispose();
				cm.openNpc(9201116,"jbfb");
				            break;
							
							case 5:
				cm.dispose();
				cm.openNpc(9000113);
				            break;
							case 994:
				cm.warp(861000000);
				cm.dispose();
				break;
			case 993:
				cm.warp(956100000);
				cm.dispose();
break;
case 997:
cm.dispose();
				cm.openNpc(9000233);
				break;
  


        }
    }
}

