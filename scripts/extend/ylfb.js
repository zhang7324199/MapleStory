
var status = 0;
var ttt = "#fUI/UIWindow/Quest/icon2/7#";//"+ttt+"//美化1
var ttt2 = "#fUI/UIWindow/Quest/icon6/7#";////美化2
var ttt3 = "#fUI/UIWindow/Quest/icon3/6#";//"+ttt3+"//美化圆
var ttt4 = "#fUI/UIWindow/Quest/icon5/1#";//"+ttt4+"//美化New
var ttt5 = "#fUI/UIWindow/Quest/icon0#";////美化!
var ttt7 = "#fUI/Basic/BtHide3/mouseOver/0#";//"+ttt6+"//美化会员
var ttt6 ="#fEffect/CharacterEff/1032054/0/0#";
var tz10 = "#fEffect/CharacterEff/1112903/0/0#";  //红心
var tz11 = "#fEffect/CharacterEff/1112904/0/0#";  //彩心
var tz12 = "#fEffect/CharacterEff/1112924/0/0#";  //黄星
var tz13 = "#fEffect/CharacterEff/1112925/0/0#";  //蓝星
var tz14 = "#fEffect/CharacterEff/1112926/0/0#";  //红星
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
    if (cm.getMapId() == 180000001) {
        cm.sendOk("很遗憾，您因为违反用户守则被禁止游戏活动，如有异议请联系管理员.");
        cm.dispose();
    }
    else if (status == 0) {
        var selStr = "\r\n#e#d您好，本服新增特色副本系列,更多请期待添加..#n#l#k\r\n\r\n";
            selStr += "" + tz12 + "" + tz13 + "" + tz14 + "" + tz12 + "" + tz13 + "" + tz14 + "" + tz12 + "" + tz13 + "" + tz14 + "" + tz12 + "" + tz13 + "" + tz14 + "" + tz12 + "" + tz13 + "" + tz14 + "" + tz12 + "" + tz13 + "" + tz14 + "" + tz12 + "\r\n";
        selStr += "#L2#" + ttt6 + " #r1.#b 森林保卫战#l#L16#" + ttt6 + " #r2.#b 挑战宋达#l#L3#" + ttt6 + " #r3.#b 次元入侵#l\r\n";
        selStr += "#L4#" + ttt6 + " #r4.#b 保卫金猪#l#L5#" + ttt6 + " #r5.#b 多足蜈蚣#l#L6#" + ttt6 + " #r6.#b 黄金寺院#l\r\n";
        selStr += "#L17#" + ttt6 + " #r7.#b 僵尸迷城#l#L8#" + ttt6 + " #r8.#b 怪物公园#l#L9#" + ttt6 + " #r9.#b 无限火力#l\r\n";
        selStr += "#L10#" + ttt6 + " #r10.#b 挑战魔人#l#L11#" + ttt6 + " #r11.#b 神话副本#l#L12#" + ttt6 + " #r12.#b 枫之高校#l\r\n";
		selStr += "#L13#" + ttt6 + " #r13.#b 天空庭院#l#L14#" + ttt6 + " #r14.#b月妙年糕#l\r\n";
		        selStr += "\r\n";
            selStr += "\r\n" + tz12 + "" + tz13 + "" + tz14 + "" + tz12 + "" + tz13 + "" + tz14 + "" + tz12 + "" + tz13 + "" + tz14 + "" + tz12 + "" + tz13 + "" + tz14 + "" + tz12 + "" + tz13 + "" + tz14 + "" + tz12 + "" + tz13 + "" + tz14 + "" + tz12 + "";


        //selStr +="\r\n#d======================================================#k\r\n";
        cm.sendSimple(selStr);
    } else if (status == 1) {
        switch (selection) {
            case 1:
               cm.dispose();
				cm.openNpc(9000233);
                break;
            case 2:
                cm.dispose();
                cm.openNpc(9900003, "slbwz");
                break;
            case 3:
                cm.dispose();
                cm.openNpc(9220032,"cytz");
                break;
            case 4:
                cm.dispose();
                cm.openNpc(9310057,"bwjz");
                break;
            case 5:
                cm.dispose();
                cm.openNpc(9900003, "wugong");
                break;
            case 6:
                cm.dispose();
                cm.openNpc(9900003, "hjsy");
                break;
            case 7:
                cm.dispose();
                cm.openNpc(9900003, "szsl");
                break;
            case 8:
                cm.dispose();
			        cm.warp(951000000, 1);	
					break;
            case 9:
                cm.dispose();
                cm.openNpc(9120050,"wxhl");
                break;
            case 10:
                cm.dispose();
                cm.openNpc(2101017,"tzmr");
                break;
			case 11:
				cm.warp(262030000,0);
				cm.dispose();
                
				break;
                        case 12:
							cm.warp(744000000);
				cm.dispose();
				break;
			case 13:
				cm.dispose();
				cm.openNpc(9220032);
				break;
				case 14:
				cm.dispose();
			        cm.warp(933000000, 1);
				break;
				case 15:
				cm.dispose();
				cm.openNpc(9220032,"jianbingfuben");
				break;
				case 16:
				cm.dispose();
				cm.openNpc(9220032,"tzsd");
				break;
				case 17:
				cm.dispose();
				cm.openNpc(9220032,"tmjs");
				break;
                      

        }
    }
}
