/*   
 *  
 *  功能：极品点装
 *  
 */

var status = 0;
var eff = "#fUI/UIWindow.img/PvP/Scroll/enabled/next2#";
var status = 0;
var z = "#fUI/UIWindow/Quest/icon5/1#";//"+z+"//美化
var kkk = "#fEffect/CharacterEff/1051296/1/0#";
var z = "#fUI/UIWindow/Quest/icon5/1#";//"+z+"
var eff1 = "#fEffect/CharacterEff/1112905/0/1#";//小红心
var icon = "#fUI/Basic.img/BtMin2/normal/0#";
var iconEvent = "#fUI/UIToolTip.img/Item/Equip/Star/Star#";
var ttt = "#fUI/UIWindow/Quest/icon2/7#";//"+ttt+"//美化1
var ttt2 = "#fUI/UIWindow/Quest/icon6/7#";////美化2
var ttt3 = "#fUI/UIWindow/Quest/icon3/6#";//"+ttt3+"//美化圆
var ttt4 = "#fUI/UIWindow/Quest/icon5/1#";//"+ttt4+"//美化New
var ttt5 = "#fUI/UIWindow/Quest/icon0#";////美化!
var ttt6 = "#fUI/UIWindow.img/PvP/Scroll/enabled/next2#";//"+ttt6+"//美化会员
var z = "#fUI/UIWindow.img/PvP/Scroll/enabled/next2#";//"+z+"//美化
var tt = "#fEffect/ItemEff/1112811/0/0#";//音符

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
        var selStr = "";
        //selStr += "" + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + "";
        selStr += "		     #r#r#e亲爱的#d#h ##k您好~!  \r\n           你想要进行什么操作呢#b#n#k\r\n";
        selStr += "" + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + " " + eff1 + "\r\n";
        selStr += "#L2#" + eff + "绝版椅子#l";       
        selStr += "#L1#" + eff + "绝版戒指#l";
        selStr += "#L3#" + eff + "绝版套装#l";
        selStr += "#L4#" + eff + "绝版上衣#l";
        selStr += "#L5#" + eff + "绝版裤裙#l";
        //selStr += "#L6#" + eff + "绝版手套#l";
        selStr += "#L7#" + eff + "绝版鞋子#l";
        selStr += "#L8#" + eff + "绝版披风#l";
        selStr += "#L9#" + eff + "绝版帽子#l"
        cm.sendSimpleS(selStr, 2);
    } else if (status == 1) {
        switch (selection) {
            case 1:
                cm.dispose();
                cm.openNpc(1540310, "Ring");
                break;
            case 2:
                cm.dispose();
                cm.openNpc(1540310, "Chair");
                break;
            case 3:
                cm.dispose();
                cm.openNpc(1540310, "Suit");
                break;
            case 4:
                cm.dispose();
                cm.openNpc(1540310, "Jacket");
                break;
            case 5:
                cm.dispose();
                cm.openNpc(1540310, "Culottes");
                break;
            case 6:
                cm.dispose();
                cm.openNpc(1540310, "Glove");
                break;
            case 7:
                cm.dispose();
                cm.openNpc(1540310, "Shoes");
                break;
            case 8:
                cm.dispose();
                cm.openNpc(1540310, "Cloak");
                break;
            case 9:
                cm.dispose();
                cm.openNpc(1540310, "Hat");
                break;
            default:
                cm.sendOk("该功能正在紧张进行制作中，请耐心等待。");
                cm.dispose();
                break;
        }
    }
}
