function act() {
    //var em1 = rm.getEventManager("BloodyJBoss");
    //em1.setProperty("stage1", parseInt(em1.getProperty("stage1")) + 1);
    //if(em1 != null && em1.getProperty("stage1").equals("1")){
    //rm.spawnMonster(8920000, 1);
    //em1.setProperty("stage1", parseInt(em1.getProperty("stage1")) + 1);
    //}else if(em1 != null && em1.getProperty("stage1").equals("2")){
    //rm.spawnMonster(8920001, 1);
    //em1.setProperty("stage1", parseInt(em1.getProperty("stage1")) + 1);
    //}else if(em1 != null && em1.getProperty("stage1").equals("3")){
    //rm.spawnMonster(8920002, 1);
    //em1.setProperty("stage1", parseInt(em1.getProperty("stage1")) + 1);
    //}else if(em1 != null && em1.getProperty("stage1").equals("4")){
    //rm.spawnMonster(8920001, 1);
    //rm.spawnMonster(8920002, 1);
    //}
    var eim = rm.getEventInstance();
    if (eim != null) {
        var em = eim.getEventManager();
        var mob = em.getMonster(8920000);
        mob.getStats().setChange(true);
        mob.changeLevel(200);
        mob.getChangedStats().setOHp(140000000000);
        mob.setHp(140000000000);
        eim.registerMonster(mob);
        var map = eim.getMapInstance(0);
        map.spawnMonsterOnGroundBelow(mob, new java.awt.Point(41, 135));
        //rm.scheduleWarp(43200, 240000000);
        if (!rm.getPlayer().isGM()) {
            rm.getMap().startSpeedRun();
        }
    }
}
