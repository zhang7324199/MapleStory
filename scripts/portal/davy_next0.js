function enter(pi) {
    var eim = pi.getEventInstance();
    if (eim != null && eim.getProperty("stage1").equals("7") && pi.getPlayer().getParty() != null && pi.getMap().getAllMonstersThreadsafe().size() == 0) {
        pi.warpParty(925100100, 0);
        pi.removeAll(4001260);
    } else {
        pi.playerMessage(5, "请打开所有老海盗箱子并消灭所有怪物,否则无法通过!");
    }
}
