var epp = "#fEffect/SetEff/11/effect/3#";  //红色枫叶
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


        //Array("[强化BOSS] 三头犬 - 血量非常多。", 510101100),
var selStr = "#r#d" + epp + "" + ax + "英雄副本" + ax + "" + epp + "#l\r\n";
		selStr +="\t\t\t#e#r#L1#"+xxx+"外星入侵 - 超级钻机#l\t\t#n\r\n";
		selStr +="\t\t\t#e#r#L2#"+xxx+"鲁塔比斯 - 四大天王#l\t\t#n\r\n";
		selStr +="\t\t\t#e#r#L4#"+xxx+"心树守护 - 贝勒德#l\t\t#n\r\n";
		selStr +="\t\t\t#e#r#L5#"+xxx+"黑色天堂 - 终极斯乌#l\t\t#n\r\n";
		selStr +="\t\t\t#e#r#L6#"+xxx+"比睿之山 - 浓姬#l\t\t#n\r\n";
		selStr +="\t\t\t#e#r#L7#"+xxx+"秘密祭坛 - 森兰丸#l\t\t#n\r\n";
		selStr +="\t\t\t#e#r#L3#"+xxx+"海底万里 - 深海巨妖#l\t\t#n\r\n";
		selStr +="\t\t\t#e#r#L9#"+xxx+"超级演武 - 龙虎蛇#l\t\t#n\r\n";
		selStr +="\t\t\t#e#r#L10#"+xxx+"暴君城堡 - 麦格纳斯#l\t\t#n\r\n";
		selStr +="\t\t\t#e#r#L11#"+xxx+"起源之塔 - 桃乐丝#l\t\t#n\r\n";
		selStr +="\t\t\t#e#r#L12#"+xxx+"世界树顶 - 戴米安#l\t\t#n\r\n";


        cm.sendSimple(selStr);
    } else if (status == 1) {
        switch (selection) {
        case 1:
            cm.dispose();
            cm.warp(703020000); //魔方商城
            break;
			case 2:
            cm.dispose();
            cm.warp(105200000); //魔方商城
            break;
			case 3:
            cm.dispose();
            cm.openNpc(2470018,"shlw"); //魔方商城
            break;
			case 4:
            cm.dispose();
            cm.warp(863000100); //魔方商城
            break;
			case 5:
            cm.dispose();
            cm.warp(310070490); //魔方商城
            break;
			case 6:
            cm.dispose();
            cm.warp(811000999); //魔方商城
            break;
			case 7:
            cm.dispose();
            cm.warp(807300100); //魔方商城
            break;
			case 8:
			cm.dispose();
            cm.openNpc(2470018,"shjy");
			break;
				case 9:
			cm.dispose();
			cm.openNpc(9310461);
			break;
				case 10:
			cm.dispose();
			cm.warp(401053002);
			break;
				case 11:
			cm.dispose();
			cm.warp(992000000);
			break;
				case 12:
			cm.dispose();
			cm.warp(105300303);
			break;
				case 13:
			cm.dispose();
			cm.openNpc(9310060);
			break;
				case 14:
			cm.dispose();
			cm.warp(350132010);
			break
  


        }
    }
}
