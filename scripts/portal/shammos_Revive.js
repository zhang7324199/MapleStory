function enter(pi) {
    if (pi.getPlayer().getEventInstance() != null) {
        pi.gainExp_PQ(60, 1.5);
        pi.setEventCount("Rex");
        if (pi.getEventCount("Rex") <= 10) {
            pi.gainNX(1000);
        } else {
            pi.playerMessage(-5, "当天帐号在此副本已经额外获得10次点卷奖励,次数已经用完。");
        }
        pi.addTrait("will", 15);
        pi.addTrait("insight", 3);
        if (pi.canHold(4001530, 1)) { //TODO JUMP
            pi.gainItem(4001530, 1);
        }
    }
    pi.warp(211000002, 0);
}
