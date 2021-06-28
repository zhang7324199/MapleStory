/*      
 
 NPC类型:	综合NPC
 
 */

var status = 0;
var typede = 0;
var slot = Array();
var dsa = "";
var ttt = "#fUI/UIWindow/Quest/icon2/7#";//"+ttt+"//美化1

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1)
            status++;
        if (status == 0) {
            var zyms = "";
            zyms = "一旦物品删除就无法找回~~~请慎重!!!\r\n";
            zyms += "            #L1##b>>>删除装备栏道具<<<#k#l\r\n";
            zyms += "            #L2##b>>>删除消耗栏道具<<<#k#l\r\n";
            zyms += "            #L3##b>>>删除设置栏道具<<<#k#l\r\n";
            zyms += "            #L4##b>>>删除其他栏道具<<<#k#l\r\n";
            zyms += "            #L5##b>>>删除特殊栏道具<<<#k#l\r\n";
            zyms += "            #L6##r#e>>>删除所有道具<<<#k#l\r\n\r\n";
			zyms += "            #L7##b" + ttt + " 返回上一页#k#l\r\n\r\n";
            cm.sendSimple(zyms);



        } else if (selection == 1) { //删除装备栏道具
            dsd = 100;
            var avail = "";
            for (var i = 0; i < 96; i++) {
                if (cm.getInventory(1).getItem(i) != null) {
                    avail += "#L" + cm.getInventory(1).getItem(i).getItemId() + "# #z" + cm.getInventory(1).getItem(i).getItemId() + "# #i" + cm.getInventory(1).getItem(i).getItemId() + ":##l\r\n";
                }
                slot.push(i);
            }
            cm.sendSimple(dsa + "#b请选择需要删除的道具:\r\n#b" + avail);

        } else if (selection == 2) { //删除消耗栏道具
            dsd = 400;
            var avail = "";
            for (var i = 0; i < 96; i++) {
                if (cm.getInventory(2).getItem(i) != null) {
                    avail += "#L" + cm.getInventory(2).getItem(i).getItemId() + "# #z" + cm.getInventory(2).getItem(i).getItemId() + "# #i" + cm.getInventory(2).getItem(i).getItemId() + ":##l\r\n";
                }
                slot.push(i);
            }
            cm.sendSimple(dsa + "#b请选择需要删除的道具:\r\n#b" + avail);

        } else if (selection == 3) { //删除其他栏道具
            dsd = 400;
            var avail = "";
            for (var i = 0; i < 96; i++) {
                if (cm.getInventory(3).getItem(i) != null) {
                    avail += "#L" + cm.getInventory(3).getItem(i).getItemId() + "# #z" + cm.getInventory(3).getItem(i).getItemId() + "# #i" + cm.getInventory(3).getItem(i).getItemId() + ":##l\r\n";
                }
                slot.push(i);
            }
            cm.sendSimple(dsa + "#b请选择需要删除的道具:\r\n#b" + avail);

        } else if (selection == 4) { //删除设置栏道具
            dsd = 400;
            var avail = "";
            for (var i = 0; i < 96; i++) {
                if (cm.getInventory(4).getItem(i) != null) {
                    avail += "#L" + cm.getInventory(4).getItem(i).getItemId() + "# #z" + cm.getInventory(4).getItem(i).getItemId() + "# #i" + cm.getInventory(4).getItem(i).getItemId() + ":##l\r\n";
                }
                slot.push(i);
            }
            cm.sendSimple(dsa + "#b请选择需要删除的道具:\r\n#b" + avail);

        } else if (selection == 5) { //删除特殊栏道具
            dsd = 400;
            var avail = "";
            for (var i = 0; i < 96; i++) {
                if (cm.getInventory(5).getItem(i) != null) {
                    avail += "#L" + cm.getInventory(5).getItem(i).getItemId() + "# #z" + cm.getInventory(5).getItem(i).getItemId() + "# #i" + cm.getInventory(5).getItem(i).getItemId() + ":##l\r\n";
                }
                slot.push(i);
            }
            cm.sendSimple(dsa + "#b请选择需要删除的道具:\r\n#b" + avail);

        } else if (selection == 6) {
            cm.dispose();
            cm.openNpc(1530635, 8);
		} else if (selection == 7) {
            cm.dispose();
            cm.openNpc(1530635, 0);
        } else if (status == 2) {//删除道具 
            itemss = selection;
            if (dsd == 100) {
                var shul = cm.getPlayer().getItemQuantity(itemss);
                if (cm.getMeso() < 0) {
                    cm.sendOk("你没有足够的金币,删除道具需要收取手续费50万金币。");
                } else {
                    //cm.gainMeso(-500000);
                    cm.gainItem(itemss, -shul);
                    cm.sendOk(dsa + "我已经将您背包里的 #i" + itemss + ":#从你的背包清理！");
                }
                status = -1;
            }



            if (dsd == 400) {
                var shul = cm.getPlayer().getItemQuantity(itemss);
                if (cm.getMeso() < 0) {
                    cm.sendOk("你没有足够的金币,删除道具需要收取手续费50万金币。");
                } else {
                    //cm.gainMeso(-500000);
                    cm.gainItem(itemss, -shul);
                    cm.sendOk(dsa + "我已经将您背包里的 #i" + itemss + ":#从你的背包清理！");
                }
            }
            status = -1;
        } else {
            cm.dispose();


        }
    }
}

