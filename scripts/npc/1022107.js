function action(mode, type, selection) {
    if (cm.isQuestActive(22530)) {
        if (!cm.canHold(1952000, 1)) {
            cm.sendOk("你需要有足够的空间");
        } else {
            cm.forceCompleteQuest(22530);
            cm.gainExp(710);
            cm.gainItem(1952000, 1);
            cm.getPlayer().gainSP(1, 1);
            cm.sendOk("You examine the sign. Finished the guard's request.");
        }
    } else {
        cm.sendOk("这是一个标志");
    }
    cm.dispose();
}
