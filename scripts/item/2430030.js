/*  This is mada by Kent    
 *  This source is made by Funms Team
 *  閲戝埄濂囩殑瀵诲疂浠诲姟
 *  閲戝埄濂囩殑榛勯噾缃楃洏
 *  @Author Kent 
 */


var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 0) {
        im.dispose();
        return;
    } else {
        status++;
    }
    if (status == 0) {
        im.sendYesNo("鏄惁瑕佷娇鐢ㄩ粍閲戠綏鐩樼洿鎺ユ壘鍒板疂钘忕殑浣嶇疆锛?);
    } else if (status == 1) {
        if (im.isQuestActive(200100) && im.haveItem(2430251)) {
            var mapid = im.getCustomData(200100);
            im.used(1);
            im.dispose();
            im.warp(mapid);
        } else {
            im.sendOk("浣犲苟娌℃湁寮€濮嬪瀹濅换鍔″憖锛?);
            im.dispose();
        }
    }
}
