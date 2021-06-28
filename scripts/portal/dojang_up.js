function enter(pi) {
    if (!pi.getMonsterByID(9300216)) {
        pi.playerMessage("还有剩下的怪物。");
    } else {
        pi.dojo_getUp();
        pi.getMap().setReactorState();
    }
}
