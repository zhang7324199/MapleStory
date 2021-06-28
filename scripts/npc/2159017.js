function action(mode, type, selection) {
    if (cm.getMap().getAllMonster().size() != 0) {
        cm.sendNext("请消灭冰骑士!!");
    } else {
        cm.warpParty(932000400, 0);
    }
    cm.dispose();
}
