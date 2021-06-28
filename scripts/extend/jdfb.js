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



var selStr = "#d" + epp + "经典回忆" + epp + "#l\r\n\r\n";
		selStr +="#e#r#L1#"+xxx+"闹钟"+xxx+"#l\t#L4#"+xxx+"扎昆"+xxx+"#l\t#L5#"+xxx+"黑龙"+xxx+"#l\t#L9#"+xxx+"希拉#l\r\n";
		selStr +="   #e#r#L7#"+xxx+"品克宾"+xxx+"#l\t#L3#"+xxx+" 希纳斯"+xxx+"#l\t#L6#"+xxx+" 班雷昂"+xxx+"#l#n\r\n";
		selStr +="#e#r#L10#"+xxx+"艾菲尼娅"+xxx+"#l\t#L11#"+xxx+"巨大蝙蝠"+xxx+"#l\t#L8#"+xxx+" 阿卡伊勒#l#n\r\n";


        cm.sendSimple(selStr);
    } else if (status == 1) {
        switch (selection) {
        case 1:
            cm.dispose();
            cm.warp(220080000); //魔方商城
            break;
			case 2:
            cm.dispose();
            cm.warp(551030100); //魔方商城
            break;
			case 3:
            cm.dispose();
            cm.warp(271030600); //魔方商城
            break;
			case 4:
            cm.dispose();
            cm.warp(211042200); //魔方商城
            break;
			case 5:
            cm.dispose();
            cm.warp(240040700); //魔方商城
            break;
			case 6:
            cm.dispose();
            cm.warp(211070000); //魔方商城
            break;
			case 7:
            cm.dispose();
            cm.warp(270050000); //魔方商城
            break;
			case 8:
            cm.dispose();
            cm.warp(272030300); //魔方商城
            break;
			case 9:
            cm.dispose();
            cm.warp(262010000); //魔方商城
            break;
			case 10:
            cm.dispose();
            cm.warp(300030300); //魔方商城
            break;
			case 11:
            cm.dispose();
            cm.warp(105100100); //魔方商城
            break;
			case 12:
            cm.dispose();
            cm.warp(932200000); //魔方商城
            break;
  


        }
    }
}
