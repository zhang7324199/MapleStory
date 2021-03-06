
function enter(pi) {
    var nextMap = 670010600;
    var eim = pi.getPlayer().getEventInstance();
    var target = eim.getMapInstance(nextMap);
    var targetPortal = target.getPortal("st00");
    // only let people through if the eim is ready
    var avail = eim.getProperty("4stageclear");
    if (avail == null) {
        // do nothing; send message to player
        pi.getClient().getSession().write(MaplePacketCreator.serverNotice(6, "This door is closed."));
        return false;
    } else {
        pi.getPlayer().changeMap(target, targetPortal);
        pi.getClient().getSession().write(MaplePacketCreator.serverNotice(6, "RUN TO THE RIGHT FOR YOUR LIFE!!!"));
        return true;
    }
}
