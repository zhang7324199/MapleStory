/*  
 *  CHMS_拍卖中心
 */
var status = 0;
var eff = "#fUI/UIWindow.img/PvP/Scroll/enabled/next2#";
var z = "#fEffect/CharacterEff/1112905/0/1#";//"+z+"//美化
var zz = "#fEffect/CharacterEff/1082565/2/0#";//
var eff1 = "#fEffect/CharacterEff/1112905/0/1#";//小红心
var icon = "#fUI/Basic.img/BtMin2/normal/0#";
var iconEvent = "#fUI/UIToolTip.img/Item/Equip/Star/Star#";
var ttt = "#fUI/UIWindow/Quest/icon2/7#";//"+ttt+"//美化1
var ttt2 = "#fUI/UIWindow/Quest/icon6/7#";////美化2
var ttt3 = "#fUI/UIWindow/Quest/icon3/6#";//"+ttt3+"//美化圆
var ttt4 = "#fUI/UIWindow/Quest/icon5/1#";//"+ttt4+"//美化New
var ttt5 = "#fUI/UIWindow/Quest/icon0#";////美化!
var ttt6 = "#fUI/UIWindow.img/PvP/Scroll/enabled/next2#";//"+ttt6+"//美化会员
var z1 = "#fUI/UIWindow.img/PvP/Scroll/enabled/next2#";//"+z+"//美化
var tt = "#fUI/Gateway.img/WorldSelect/icon/1#";//音符fEffect/ItemEff/1112811/0/0
var ts = "#fUI/Basic.img/Cursor/18/0#";//shuye
var feng = "#v4032733#";
var kkk = tt;


var menuList = Array(
        Array(kkk, "#n返回市场", 0, true),
        Array(kkk, "万能传送", 3, true),
        Array(kkk, "我的账户", 2, true),
        Array(kkk, "爆死挑战", 4, true),
        Array(kkk, "组队副本", 18, true),
        Array(kkk, "日常任务", 19, true),
        Array(kkk, "职业转职", 22, true),
		Array(kkk, "#r怪怪系统#l", 1, false),
        Array(kkk, "金融中心", 20, true),
        Array(kkk, "游戏排行", 21, true),
        Array(kkk, "新手中心", 12, true),
        Array(kkk, "万能商店", 5, true),
        Array(kkk, "点券市场", 7, true),
        Array(kkk, "查看爆率", 11, true),
        Array(kkk, "删除物品", 8, true),
        Array(kkk, "#r更多功能", 999, true),
        Array(kkk, "福利中心", 6, false),
        Array(kkk, "休闲娱乐", 9, false),
        Array(kkk, "常用功能", 10, false),
        Array(kkk, "新手必点", 12, false),
        Array(kkk, "中介服务", 13, false),
        Array(kkk, "学习技能", 14, false),
        Array(kkk, "充值中心", 15, false),
        Array(kkk, "破功中心", 16, false),
        Array(kkk, "兑换中心", 17, false)
        );
//图片特效,名字，selection，是否显示

var npcid = Array(1530635, 1530636, 1530637, 1530638);

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
        cm.sendOk("很遗憾，您因为违反用户守则被禁止游戏活动，如有异议请联系管理员.")
        cm.dispose();
    } else if (status == 0) { //
        var selStr = z+z+z+z+z+z+z+ "#fn华文行楷##fs20##e#d " + cm.getServerName() + " " +z+z+z+z+z+z+z+ " \r\n#fs12##fn宋体#"
        var x = 0;
        for (var i = 0; i < menuList.length; i++) {
            if (menuList[i][3]) { // 如果允许显示
                x++;
                selStr += "#b#L" + menuList[i][2] + "#" + menuList[i][0] + " " + (menuList[i][2] == 22 && cm.isQuestFinished(1465) ? "五转中心" : menuList[i][1]) + "#l";

                if (x % 3 == 0) {
                    selStr += "\r\n";
                } else {
                    selStr += " ";
                }
				if (menuList[i][2] == 22) {
					selStr
				}
            }

        }

        if (x % 3 != 0) {
            selStr += "\r\n";
        }
        selStr += "\r\n"+z+z+z+z+z+z+z+z+z+z+z+z+z+z+z+z+z+z+z+z+z+z+z+z+z+z+z+z+z+"\r\n";
        selStr += "#L1000#  " + ts + "#fs13##e#r进入商城#l\t#L1001# " + ts + "元宝充值#l";
        cm.sendSimple(selStr, npcid[Math.floor(Math.random() * npcid.length)]);
    } else if (status == 1) {
        switch (selection) {
            case 0: // 返回市场
                if (cm.getPlayer().getMapId() >= 910000000 && cm.getPlayer().getMapId() <= 910000022) {
                    cm.sendOk("#fs28##fn方正舒体##b你难道不在自由市场吗？", npcid[Math.floor(Math.random() * npcid.length)]);
                } else {
                    cm.saveReturnLocation("FREE_MARKET");
                    cm.warp(910000000, "st00");
                }
                cm.dispose();
                break;
            case 1: // 怪怪系统
                cm.dispose();
				cm.openUI(0x254);
                break;
            case 2: // 我的账户
                cm.dispose();
                cm.openNpc(1530635, 2);
                break;
            case 3: // 万能传送
                cm.dispose();
                cm.openNpc(1530635,1);
                break;
            case 4://  BOSS挑战
                cm.dispose();
                cm.openNpc(2159359);
                break;
            case 5: //  杂货店
                cm.dispose();
                cm.openNpc(1530635,4);
                break;
            case 6: //  福利中心
                cm.dispose();
                cm.openNpc(9900005);
                break;
            case 7: //  商城购物
                cm.dispose();
                cm.openNpc(1530635, 5);
                break;
            case 8: //  物品回收
                cm.dispose();
                cm.openNpc(1530635, 7);
                break;
            case 9:  //  休闲中心
                cm.dispose();
                cm.openNpc(9900005, 7);
                break;
            case 10: //  管理中心
                cm.dispose();
                cm.openNpc(9900003, "guanlizhongxin");
                break;
            case 11: //  爆率查询
                cm.dispose();
                cm.openNpc(1530635, 6);
                break;
            case 12: //  新手必点
				cm.dispose();
                cm.openNpc(1530635 , 13);
                break;
            case 13: //  中介服务
                cm.dispose();
                cm.openNpc(9310362, "41");
                break;
            case 14: //  学习技能
                cm.dispose();
                cm.openNpc(9900003, "xuegoujineng");
                break;
            case 15: //  充值中心
                cm.sendOk(payStr);
                cm.dispose();
                break;
            case 16: //  破功中心
                cm.dispose();
                cm.openNpc(9900005, 11);
                break;
            case 17: //  兑换中心
                cm.dispose();
                cm.openNpc(9000041);
                break;
            case 18:
                cm.dispose();
                cm.warp(910002000);
                break;
            case 19:
                cm.dispose();
                cm.openNpc(1530635, 3);
                break;
            case 20:
                cm.dispose();
                cm.openNpc(9300011, 1);
                break;
            case 21:
                cm.dispose();
                cm.openNpc(1540008);
                break;
			case 22:
                cm.dispose();
				cm.openNpc(1530635, "changeJob");
                break;	
            case 1000:
                cm.dispose();
                cm.enterCS();
                break;
            case 1001:
                cm.openWeb("http://www.caihongms.com");
                cm.dispose();
                break;
            case 999:
				cm.dispose();
                cm.openNpc(1530635, 999);
                break;
        }
    }
}


function ListFor(type) {
    var x = 0;
    var space = "";
    if (type >= 3)
        space = "  ";
    for (var i = 0; i < List.length; i++) {
        if (List[i][2] == type) {
            if (x == 3) {
                text += "#L" + i + "#" + List[i][0] + "#l\r\n";
                x = 0;
            } else {
                text += "#L" + i + "#" + List[i][0] + "#l" + space;
                x++;
            }
        }
    }
}