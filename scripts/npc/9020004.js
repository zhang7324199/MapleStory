/*  
 *  
 *  功能：组队任务：陷入危机的坎特
 *  
 */
var status = -1;
function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        if (status <= 1) {
            cm.sendNext("好的,那请加油。");
            cm.safeDispose();
            return;
        }
        status--;
    }
    if (status == 0) {
        var em = cm.getEventManager("Kenta");
        var eim = cm.getEventInstance();
        if (em != null && eim != null) {
            var state = em.getProperty("state");
            if (cm.getMapId() / 100 == 9230401) {
                if (state.equals("1") && eim.getProperty("KentaSave").equals("1")) {
                    cm.startMapEffect("我呼吸困难……请你消灭周边的怪物，拿到10个空气铃。快……", 5120052);
                    eim.setProperty("KentaSave", "2");
                } else if (eim.getProperty("KentaSave").equals("2")) {
                    if (cm.haveItem(2430364, 10)) {
                        cm.gainItem(2430364, -10);
                        cm.startMapEffect("咻，真是差点就要出大事了。现在氧气充足，我们快到安全的地方去吧。", 5120052);
                        cm.removeNpc(9020004);
                        var mob = em.getMonster(9300460);
                        cm.getPlayer().getEventInstance().registerMonster(mob);
                        eim.setProperty("HP", String(mob.getHp()));
                        cm.getMap().spawnMonsterOnGroundBelow(mob, new java.awt.Point(201, 1800));
                        cm.displayNode(mob);
                        eim.setProperty("KentaSave", "3");
                    } else {
                        cm.startMapEffect("呼吸越来越困难了。请快点过来。", 5120052);
                    }
                } else {
                    cm.startMapEffect("请帮帮我……请破坏受难船的残骸，把我救出去吧。", 5120052);
                }
                cm.dispose();
            } else if (cm.getMapId() / 100 == 9230403) {
                if (eim.getProperty("caveBreak").equals("0") && cm.isLeader() && cm.checkPartyMemberNearby(new java.awt.Point(-39, 168))) {
                    eim.setProperty("caveBreak", "1");
                    cm.dispose();
                    cm.onUserEnter("kenta_caveEff");
                } else {
                    cm.sendOk("我们必须团结起来。所有队员请到洞窟入口集合。");
                    cm.safeDispose();
                }
            } else if (cm.getMapId() / 100 == 9230404) {
                if (cm.getMap().getAllMonster().size() == 0) {
//                    var maple = Math.floor(Math.random() * 10) + 20;
                    if (!cm.canHold(4001535, 1)) {//|| !cm.canHold(4001126, maple)
                        cm.sendOk("请确认其他栏空间！");
                        cm.dispose();
                        return;
                    }
//                    cm.gainItem(4001713, 1);
                    cm.gainExp_PQ(200, 5);
                    cm.gainPQPoint();
//                    cm.gainItem(4001126, maple);
                    cm.gainItem(4001535, 1);
                    if (cm.getEventCount("Kenta") < 10) {
                        cm.setEventCount("Kenta");
                        cm.gainNX(2, 1000);
                    }
                    cm.addTrait("will", 26);
                    cm.addTrait("charm", 26);
                    cm.warp(923040000, 0);
                    cm.dispose();
                } else {
                    cm.sendSimple("海洋生物的状态好像更加异常了。竟然变得这么残暴……你想回去了吗？\r\n#b#L0#我想离开这里……#l");
                }
            }
        }
    } else if (status == 1) {
        if (selection == 0) {
            cm.sendYesNo("你就这样走了的话，我该怎么办呢？请再考虑一下。你真的要走吗？");
        }
    } else if (status == 2) {
        cm.warp(923040000, 0);
        cm.dispose();
    }
}
