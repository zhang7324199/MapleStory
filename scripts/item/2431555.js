function start() {
    if (im.haveItem(4033755)) {
        if (im.canHold(1122224)) {
            im.gainItem(4033755, -1);
            im.used(1);
            im.gainItem(1122224, 1);
        } else {
            im.sendOk("璇风‘璁や綘鑳屽寘鏈夎冻澶熺殑绌洪棿銆?);
        }
    } else {
        im.sendOk("璇风‘璁や綘鑳屽寘閲屾湁#t4033755#銆?);
    }
    im.dispose();
}
