/*  This is mada by Kent    
 *  This source is made by Funms Team
 *  鍔熻兘锛氬懆鏃ュ己鍖栨敮鎻寸
 *  @Author Kent 
 */


var status = 0;
var psrw = Array(
        //杩欎釜涓鸿幏鍙栫墿鍝?  锛圛D, 鏁伴噺锛?
        Array(4001832, 500),
        Array(2049027, 3),
        Array(2470002, 1),
        Array(2048724, 1)
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
        if (im.getSpace(1) < 1 || im.getSpace(2) < 1 || im.getSpace(3) < 1 || im.getSpace(4) < 1 || im.getSpace(5) < 1) {
            im.sendOk("璇蜂繚璇佷綘鑳屽寘鐨勬瘡涓€鏍忛兘鏈夌┖浣嶏紝璇峰厛鏁寸悊涓€涓嬪惂銆?);
            im.dispose();
            return;
        }
        var ii = im.getItemInfo();
        im.used(1);//杩欎釜涓烘秷鑰楁帀杩欎釜閬撳叿  鍙傛暟鏄秷鑰楃殑鏁伴噺   濡傛灉鏁伴噺澶т簬 1  杩樿鍏堝垽鏂?鏄惁鎷ユ湁杩欎箞澶氫釜鏁伴噺鐨勯亾鍏?
        for (i = 0; i < psrw.length; i++) {
            im.gainItem(psrw[i][0], +psrw[i][1]); //闅忔満杩欎釜閬撳叿 杩樻湁鏁伴噺
        }
        //杩欎釜涓烘湇鍔″櫒鍏憡
        //im.worldSpouseMessage(0x18, "銆庢瘡鏃ュ瀹濄€? + "[" + im.getChar().getName() + "] 鎵撳紑閲戝埄濂囩殑榛勯噾琚嬪瓙鑾峰緱浜? + psrw[rand][1] + "涓?" + ii.getName(psrw[rand][0]) + ">, 澶у蹇幓瀵诲疂鍚э紒");
        im.dispose();
    }
}
