/*
    Made by XiaoBin and Kent
*/
var status = -1;

function start() {
    var getCustomData = im.getCustomData(7291);
    var getDamageHpCustomData = im.getDamageHpCustomData();
    if (getCustomData == getDamageHpCustomData) {
        im.topMsg("鏃犳硶閲嶅浣跨敤鐩稿悓浼ゅ鐨偆閬撳叿");
        im.enableActions();
        im.dispose();
    } else {
        im.topMsg("浣跨敤浼ゅ鐨偆閬撳叿鎴愬姛銆?);
        im.ShowDamageHp();
        im.enableActions();
        im.DeleteItem();
        im.enableActions();
        im.dispose();
    }
}
