/*      
 *  
 *  功能：怪物公园：虎纹
 *  
 */
var maps = Array(954020000, 954030000, 954040000, 954050000, 954060000);
var minLevel = Array(130, 140, 150, 165, 200);
var maxLevel = Array(140, 150, 165, 200, 250);
var id = -1;
function start() {
    var selStr = "你想进入哪个地方？\r\n#b(130级以上250级以下的玩家可以使用)\r\n#b";
    for (var i = 0; i < maps.length; i++) {
        selStr += "#L" + i + "##m" + maps[i] + "# (" + minLevel[i] + " - " + maxLevel[i] + ")#l\r\n";
    }
    cm.sendSimple(selStr);
}

function action(mode, type, selection) {
    if (mode == 1 && selection >= 0 && selection < maps.length) {
        if (cm.getParty() == null || !cm.isLeader()) {
            cm.sendOk("你想要进入的地区是组队游戏区域。可以通过#b队长#k入场。");
        } else if (!cm.isAllPartyMembersAllowedLevel(minLevel[selection], maxLevel[selection])) {
            cm.sendNext("组队成员等级 " + minLevel[selection] + " 以上 " + maxLevel[selection] + " 以下才可以入场。");
        } else if (!cm.isAllPartyMembersHaveItem(4001522, 1)) {
            cm.sendNext("你的队员#r#e \"" + cm.getNotHaveItemMemberName(4001522, 1) + "\" #k#n没有#i4001522##t4001522#,请确认!");
        } else if (!cm.allMembersHere()) {
            cm.sendOk("你的组队部分成员不在当前地图,请召集他们过来后在尝试。"); //判断组队成员是否在一张地图..
        } else {
            var em = cm.getEventManager("MonsterPark");
            for (var i = 0; i < 16; i++) {
                id = maps[selection] + i;
                if (em.getInstance("MonsterPark" + id) == null) {
                    break;
                } else if (i == 15) {
                    id = -1;
                }
            }
            if (em == null || id == -1) {
                cm.sendOk("怪物公园里面已经有人了。");
            } else {
                cm.givePartyItems(4001522, -1);
                em.startInstance_Party("" + id, cm.getPlayer(), maxLevel[selection]);
            }
        }
    }
    cm.dispose();
}
