/*  
 *  
 *  功能：海盗
 *  
 */
var minPlayers = 2;

function init() {
    em.setProperty("state", "0");
    em.setProperty("leader", "true");
}

function setup(level, leaderid) {
    em.setProperty("state", "1");
    em.setProperty("leader", "true");
    var eim = em.newInstance("Pirate");
    eim.setProperty("stage1", "0");
    eim.setProperty("stage2", "0");
    eim.setProperty("prove4001120", "0");
    eim.setProperty("prove4001121", "0");
    eim.setProperty("prove4001122", "0");
    eim.setProperty("stage2", "0");
    eim.setProperty("stage2", "0");
    eim.setProperty("stage2a", "0");
    eim.setProperty("stage3a", "0");
    eim.setProperty("stage4", "0");
    eim.setProperty("stage5", "0");
    eim.setInstanceMap(925100000).resetPQ(level);
    eim.setInstanceMap(925100100).resetPQ(level);
    var map = eim.setInstanceMap(925100200);
    map.resetPQ(level);
    for (var i = 0; i < 5; i++) {
        var mob = em.getMonster(9300124);
        var mob2 = em.getMonster(9300125);
        var mob3 = em.getMonster(9300124);
        var mob4 = em.getMonster(9300125);
        eim.registerMonster(mob);
        eim.registerMonster(mob2);
        eim.registerMonster(mob3);
        eim.registerMonster(mob4);
        mob.getStats().setChange(true);
        mob2.getStats().setChange(true);
        mob3.getStats().setChange(true);
        mob4.getStats().setChange(true);
        mob.changeLevel(level);
        mob2.changeLevel(level);
        mob3.changeLevel(level);
        mob4.changeLevel(level);
        map.spawnMonsterOnGroundBelow(mob, new java.awt.Point(430, 75));
        map.spawnMonsterOnGroundBelow(mob2, new java.awt.Point(1600, 75));
        map.spawnMonsterOnGroundBelow(mob3, new java.awt.Point(430, 238));
        map.spawnMonsterOnGroundBelow(mob4, new java.awt.Point(1600, 238));
    }
    map = eim.setInstanceMap(925100201);
    map.resetPQ(level);
    for (var i = 0; i < 10; i++) {
        var mob = em.getMonster(9300112);
        var mob2 = em.getMonster(9300113);
        eim.registerMonster(mob);
        eim.registerMonster(mob2);
        mob.getStats().setChange(true);
        mob2.getStats().setChange(true);
        mob.changeLevel(level);
        mob2.changeLevel(level);
        map.spawnMonsterOnGroundBelow(mob, new java.awt.Point(0, 238));
        map.spawnMonsterOnGroundBelow(mob2, new java.awt.Point(1700, 238));
    }
    eim.setInstanceMap(925100202).resetPQ(level);
    map = eim.setInstanceMap(925100300);
    map.resetPQ(level);
    for (var i = 0; i < 5; i++) {
        var mob = em.getMonster(9300124);
        var mob2 = em.getMonster(9300125);
        var mob3 = em.getMonster(9300124);
        var mob4 = em.getMonster(9300125);
        eim.registerMonster(mob);
        eim.registerMonster(mob2);
        eim.registerMonster(mob3);
        eim.registerMonster(mob4);
        mob.getStats().setChange(true);
        mob2.getStats().setChange(true);
        mob3.getStats().setChange(true);
        mob4.getStats().setChange(true);
        mob.changeLevel(level);
        mob2.changeLevel(level);
        mob3.changeLevel(level);
        mob4.changeLevel(level);
        map.spawnMonsterOnGroundBelow(mob, new java.awt.Point(430, 75));
        map.spawnMonsterOnGroundBelow(mob2, new java.awt.Point(1600, 75));
        map.spawnMonsterOnGroundBelow(mob3, new java.awt.Point(430, 238));
        map.spawnMonsterOnGroundBelow(mob4, new java.awt.Point(1600, 238));
    }
    map = eim.setInstanceMap(925100301);
    map.resetPQ(level);
    for (var i = 0; i < 10; i++) {
        var mob = em.getMonster(9300112);
        var mob2 = em.getMonster(9300113);
        eim.registerMonster(mob);
        eim.registerMonster(mob2);
        mob.getStats().setChange(true);
        mob2.getStats().setChange(true);
        mob.changeLevel(level);
        mob2.changeLevel(level);
        map.spawnMonsterOnGroundBelow(mob, new java.awt.Point(0, 238));
        map.spawnMonsterOnGroundBelow(mob2, new java.awt.Point(1700, 238));
    }
    eim.setInstanceMap(925100302).resetPQ(level);
    eim.setInstanceMap(925100400).resetPQ(level);
    eim.setInstanceMap(925100500).resetPQ(level);
    eim.schedule("checkPQDone", 100);
    eim.startEventTimer(1200000); //20 mins
    return eim;
}

function playerEntry(eim, player) {
    var map = eim.getMapInstance(0);
    player.changeMap(map, map.getPortal(0));
    player.tryPartyQuest(1204);
}

function playerRevive(eim, player) {
    return false;
}

function scheduledTimeout(eim) {
    end(eim);
}

function changedMap(eim, player, mapid) {
    if (mapid < 925100000 || mapid > 925100500) {
        eim.unregisterPlayer(player);

        if (eim.disposeIfPlayerBelow(0, 0)) {
            em.setProperty("state", "0");
            em.setProperty("leader", "true");
        }
    }
}

function playerDisconnected(eim, player) {
    return 0;
}

function monsterValue(eim, mobId) {
    return 1;
}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);

    if (eim.disposeIfPlayerBelow(0, 0)) {
        em.setProperty("state", "0");
        em.setProperty("leader", "true");
    }
}

function end(eim) {
    eim.disposeIfPlayerBelow(100, 925100700);
    em.setProperty("state", "0");
    em.setProperty("leader", "true");
}

function clearPQ(eim) {
    end(eim);
}

function allMonstersDead(eim) {
}

function leftParty(eim, player) {
    if (eim.disposeIfPlayerBelow(1, 925100700)) {
        end(eim);
    }
}
function disbandParty(eim) {
    end(eim);
}
function playerDead(eim, player) {
}
function cancelSchedule() {
}


function checkPQDone(eim) {
    var map = eim.getMapInstance(1);
    var mobid1, mobid2, mobid3;
    var state = parseInt(eim.getProperty("stage2"));
    map.killAllMonsters(true);
    switch (state) {
        case 0:
            mobid1 = 9300115;
            mobid2 = 9300116;
            mobid3 = 9300114;
            break;
        case 1:
            mobid1 = 9300114;
            mobid2 = 9300116;
            mobid3 = 9300115;
            break;
        case 2:
            mobid1 = 9300114;
            mobid2 = 9300115;
            mobid3 = 9300116;
            break;
    }
    map.setPQMobCanSpawn(mobid1, false);
    map.setPQMobCanSpawn(mobid2, false);
    map.setPQMobCanSpawn(mobid3, true);
}
function setDone(eim) {
    var map = eim.getMapInstance(1);
    map.setPQMobCanSpawn(9300114, false);
    map.setPQMobCanSpawn(9300115, false);
    map.setPQMobCanSpawn(9300116, false);
}

function pickUpItem(eim, player, itemID) {
    switch (itemID) {
        case 4001120:
        case 4001121:
        case 4001122:
            var count = parseInt(eim.getProperty("prove" + itemID)) + 1;
            var stats = parseInt(eim.getProperty("stage2"));
            var tt = parseInt(itemID % 10);
            if (tt == stats) {
                player.dropTopMsg("收集到了" + count + "个" + (tt == 0 ? "初级" : tt == 1 ? "中级" : "高级") + "海盗。");
                if (count >= 20) {
                     eim.setProperty("stage2", stats + 1);
                    for (i = 0; i < eim.getPlayers().size(); i++) {
                        eim.getPlayers().get(i).removeAll(itemID);
                    }
                    eim.schedule("checkPQDone", 100);
                    eim.getMapInstance(1).startMapEffect(stats == 2 ? "现在快进入下一个阶段吧!!" : "好的现在进行收集下一种证物。", 5120020);
                }
            }
            eim.setProperty("prove" + itemID, count);
            break;
    }
}
