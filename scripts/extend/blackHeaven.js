/*      
 *  
 *  功能：斯乌 BlackHeaven
 *  
 */


//副本开关 开启、true 关闭、false
var open = true;
//配置文件名称
var PQname = ["BossSiwu_NORMAL", "BossSiwu_HARD"];
//记录次数名称
var PQLog = ["斯乌", "斯乌[远征队]"];
//开始的地图
var startmap = 350060300;
//等级限制
var minLevel = [150, 200];
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
        if (cm.getParty() == null) {
            cm.sendOkN("你想和队员们一起努力，完成任务吗？这里面有很多如果不同心协力就无法解决的障碍……。那么要执行这个任务必须先创建一个队伍！.");
            cm.dispose();
            return;
        }
        var text = "";
        for (var i = 0; i < PQname.length; i++) {
            text += "\r\n#b#L" + i + "#挑战 " + PQLog[i] + "#l#k";
        }
        cm.sendSimpleN("#e<Boss - " + PQLog[0] + ">#n\r\n#b#h0# \n\#k你想和队员们一起努力，完成任务吗？这里面有很多如果不同心协力就无法解决的障碍……。?" + text);
    } else {
        cm.sendYesNoN("#e<Boss - " + PQLog[0] + ">#n\r\n你现在确定放弃任务,从这里出去?\r\n");
    }
}
function action(mode, type, selection) {

    if (status >= 0 && mode == 0) {
        cm.dispose();
        return;
    }
    mode == 1 ? status++ : status--;
    if (cm.getMapId() == startmap) {

        if (status == 0 && selection == 1) {
            cm.dispose();
            cm.openNpc(1540496, "BlackHeavenSquad");
        } else if (status == 0) {
            var em = cm.getEventManager(PQname[selection]);
            if (em == null || open == false) {
                cm.sendOkN(open ? "配置文件不存在,请联系管理员。" : "目前该副本不开放，有疑问请联系管理员");
                cm.dispose();
                return;
            }
            chs = selection;
            var prop = em.getProperty("state");
            var rwpz = "#e<Boss - " + PQLog[selection] + ">#n\r\n#k\r\n#e#r";
            rwpz += "#n#k#e副本状态：#n" + (prop == null || prop.equals("0") ? "#e#r空闲#n#k" : "#e#r开启#n#k") + "";
            rwpz += "\r\n#e推荐人数：" + minPlayers + " - " + maxPlayers + "#n#e    推荐等级：" + minLevel[selection] + " - " + maxLevel[selection] + "#n";
            rwpz += "\r\n当前已进行：#r#e" + cm.getPQLog(PQLog[selection]) + "#n#k 次";
            rwpz += "    剩余挑战次数：#r#e" + (maxenter[selection] - cm.getPQLog(PQLog[selection])) + "#n#k 次#n#k\r\n\r\n";
            cm.sendYesNoN(rwpz + "           #b#h0# \n\#k#e是否现在就进入？#n");
        } else if (status == 1) {
            if (!cm.isLeader()) {
                cm.sendOkN("嗯，你已经有自己的队伍。要执行这个任务，请让你们的队长与我对话，才可以申请入场.");
            } else if (!cm.isAllPartyMembersAllowedLevel(minLevel[chs], maxLevel[chs])) {
                cm.sendNextN("组队成员等级 " + minLevel[chs] + " 以上 " + maxLevel[chs] + " 以下才可以入场。");
            } else if (!cm.isAllPartyMembersAllowedPQ(PQLog[chs], maxenter[chs])) {
                cm.sendNextN("你的队员#r#e \"" + cm.getNotAllowedPQMemberName(PQLog[chs], maxenter[chs]) + "\" #k#n次数已经达到上限了。");
            } else if (!cm.allMembersHere()) {
                cm.sendOkN("你的组队部分成员不在当前地图,请召集他们过来后在尝试。"); //判断组队成员是否在一张地图..
            } else {
                var em = cm.getEventManager(PQname[chs]);
                if (em == null || open == false) {
                    cm.sendSimpleN("配置文件不存在,请联系管理员。");
                } else {
                    var prop = em.getProperty("state");
                    if (prop == null || prop.equals("0")) {
                        em.startInstance(cm.getParty(), cm.getMap(), moblevel);
                        cm.gainMembersPQ(PQLog[chs], 1);
                    } else {
                        cm.sendOkN("已经有队伍在进行了,请换其他频道尝试。");
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
