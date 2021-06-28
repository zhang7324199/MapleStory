
//副本开关 开启、true 关闭、false
var open = true;
//配置文件名称
var PQname = ["ZChaosPQ4"];
//记录次数名称
var PQLog = ["森林保卫战"];
//开始的地图
var startmap = 910000000;
//等级限制
var minLevel = [115, 150];
var maxLevel = [255, 255];
//次数限制
var maxenter = [2, 1];

var status = -1;
//限制人数
var minPlayers = 1;
var maxPlayers = 6;
//怪物最大等级设置
var moblevel = 255;
var chs;


function start() {
    if (cm.getMapId() == startmap) {
        var text = "#e#d米纳尔森林保卫战#k#n:\r\n\r\n#b要从自由市场才能进入哦！副本一共提供七个关卡,每个关卡怪物血量在3000万-5000万之间，每消灭一个关卡的怪物即可进入下一个关卡，最后的关卡等待的中的BOSS，消灭后会解救出被绑架的NPC，同时疯狂点击或者采集该NPC会获得奖励点券，抵用券，超级神奇魔方";
        for (var i = 0; i < PQname.length; i++) {
            text += "\r\n#b#L" + i + "#挑战" + PQLog[i] + "#l#k         ";
        }
        cm.sendSimple("#e<Boss - " + PQLog[0] + ">#n\r\n\r\n#b#h0# \n\#k你现在想和队友一起挑战这个BOSS副本吗?\r\n" + text);
    } 

}
function action(mode, type, selection) {
    if (status >= 1 && mode == 0) {
        cm.sendOk("快捷寻找组队按热键“O”赶快加入组队来挑战组队任务吧。");
        cm.dispose();
        return;
    }
    mode == 1 ? status++ : status--;

    if (cm.getMapId() == startmap) {
        if (status == 0) {
            var em = cm.getEventManager(PQname[selection]);
            if (em == null || open == false) {
                cm.sendOk("配置文件[" + PQname[selection] + "]不存在,请联系管理员。");
                cm.dispose();
                return;
            }
            chs = selection;
            var prop = em.getProperty("state");
            var rwpz = "#e<Boss - " + PQLog[selection] + ">#n\r\n#k\r\n#e#r";
            rwpz += "#n#k#e副本状态：#n" + (prop == null || prop.equals("0") ? "#e#g空闲#n#k" : "#e#r开启#n#k") + "";
            rwpz += "\r\n#e推荐人数：" + minPlayers + " - " + maxPlayers + "#n#e    推荐等级：" + minLevel[selection] + " - " + maxLevel[selection] + "#n";
            rwpz += "\r\n当前已进行：#r#e" + cm.getPQLog(PQLog[selection]) + "#n#k 次";
            rwpz += "    剩余挑战次数：#r#e" + (maxenter[selection] - cm.getPQLog(PQLog[selection])) + "#n#k 次#n#k\r\n\r\n";
            cm.sendYesNo(rwpz + "           #b#h0# \n\#k#e是否现在就进入？#n");
        } else if (status == 1) {
            if (cm.getParty() == null) { //判断组队cm.getPlayerCount(401060100) == 0
                cm.sendYesNo("你并没有组队，请创建组建一个队伍在来吧。");
            } else if (!cm.isLeader()) { // 判断组队队长
                cm.sendOk("请让你们的组队长和我对话。");
				} else if (cm.getPlayerCount(321110000) != 0 || cm.getPlayerCount(321111000) != 0 || cm.getPlayerCount(321112000) != 0 || cm.getPlayerCount(321113000) != 0 || cm.getPlayerCount(321114000) != 0|| cm.getPlayerCount(321115000) != 0 || cm.getPlayerCount(321116000) != 0) {
                cm.sendOk("地图里面有人,请稍候!");
            } else if (!cm.isAllPartyMembersAllowedLevel(minLevel[chs], maxLevel[chs])) {
                cm.sendNext("组队成员等级 " + minLevel[chs] + " 以上 " + maxLevel[chs] + " 以下才可以入场。");
            } else if (!cm.isAllPartyMembersAllowedPQ(PQLog[chs], maxenter[chs])) {
                cm.sendNext("你的队员#r#e \"" + cm.getNotAllowedPQMemberName(PQLog[chs], maxenter[chs]) + "\" #k#n次数已经达到上限了。");
            } else if (!cm.allMembersHere()) {
                cm.sendOk("你的组队部分成员不在当前地图,请召集他们过来后在尝试。"); //判断组队成员是否在一张地图..
            } else {
                var em = cm.getEventManager(PQname[chs]);
                if (em == null || open == false) {
                    cm.sendSimple("配置文件不存在,请联系管理员。");
                } else {
                    var prop = em.getProperty("state");
                    if (prop == null || prop.equals("0")) {
                        em.startInstance(cm.getParty(), cm.getMap(), 255);
                        cm.gainMembersPQ(PQLog[chs], 1);
                    } else {
                        cm.sendOk("已经有队伍在进行了,请换其他频道尝试。");
                    }
                }
            }
            cm.dispose();
        } else {
            cm.dispose();
        }
    } else {
        if (status == 0) {
            cm.warp(startmap, 0);
        }
        cm.dispose();
    }
}
