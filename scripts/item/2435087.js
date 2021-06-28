/*  This is mada by Kent    
 *  This source is made by Funms Team
 *  鍔熻兘锛氳湣绗斾氦鎹㈠埜
 *  @Author Kent 
 */


var status = 0;
var psrw = Array(
        //杩欎釜涓鸿幏鍙栫墿鍝?  锛圛D, 鏁伴噺锛?
        Array(3994417, 1),
        Array(3994418, 1),
        Array(3994419, 1),
        Array(3994420, 1),
        Array(3994421, 1),
        Array(3994422, 1)
        );
//鍙栭殢鏈? 姣忎竴涓墿鍝佽幏鍙栧埌鐨勬鐜囬兘鏄竴鏍风殑銆?
var rand = Math.floor(Math.random() * psrw.length);

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
        var mapid = im.getMapId();
        //鍒ゆ柇鑳屽寘鐨勭┖闂? 1 鈥?5 瀵瑰簲鐨勬槸 瑁呭 鈥?鐗规畩
        if (im.getSpace(1) < 1 ) {
            im.sendOk("鑳屽寘瑁呭鏍忛渶瑕佹湁绌轰綅锛岃鍏堟暣鐞嗕竴涓嬪惂銆?);
            im.dispose();
            return;
        }
        var ii = im.getItemInfo();
        im.used(1);//杩欎釜涓烘秷鑰楁帀杩欎釜閬撳叿  鍙傛暟鏄秷鑰楃殑鏁伴噺   濡傛灉鏁伴噺澶т簬 1  杩樿鍏堝垽鏂?鏄惁鎷ユ湁杩欎箞澶氫釜鏁伴噺鐨勯亾鍏?
        im.gainItem(psrw[rand][0], +psrw[rand][1]); //闅忔満杩欎釜閬撳叿 杩樻湁鏁伴噺
          //杩欎釜涓烘湇鍔″櫒鍏憡
		//im.sendOk(0x20, "[绯荤粺鎻愮ず] : 鐜╁ "+im.getPlayer().getName()+" 鎴愬姛璐拱鏈湡绁炲搧鎴掓寚,绠€鐩村鏃犱汉鎬?鎰熻阿浜插鑿茶姌鐨勫ぇ鍔涚殑鏀寔锛?);
        im.dispose();
    }
}
