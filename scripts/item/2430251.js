/*  This is mada by Kent    
 *  This source is made by Funms Team
 *  瀵诲疂渚跨
 *  姣忔棩瀵诲疂浠诲姟
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
        if (im.isQuestActive(200100)) {
            var mapid = im.getMapId();
            var qinfo = im.getCustomData(200102);
            im.sendPlayerToNpc("\t\t\t\t#e閲戝埄濂囩粰鎴戠殑绾跨储#n\r\n\r\n瀹濊棌鍙兘钘忓湪杩欎簺鍦版柟锛歕n\r " + qinfo);
        } else {
            im.sendPlayerToNpc("#濂藉儚骞舵病鏈夊紑濮嬪瀹濅换鍔″摝#n");
            im.used(1);
        }
        im.dispose();
    }
}
