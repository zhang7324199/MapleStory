/*  This is mada by Kent    
 *  This source is made by Funms Team
 *  鍔熻兘锛氬法鍖犳鍣ㄧ
 *  @Author Kent 
 */


var status = 0;
var psrw = Array(
        //杩欎釜涓鸿幏鍙栫墿鍝?  锛圛D, 鏁伴噺锛?
        Array(1212077, 1),
        Array(1222072, 1),
        Array(1232071, 1),
        Array(1242076, 1),
        Array(1252058, 1),
        Array(1302285, 1),
        Array(1312162, 1),
        Array(1322213, 1),
        Array(1332235, 1),
        Array(1362099, 1),
        Array(1372186, 1),
        Array(1382220, 1),
        Array(1402204, 1),
        Array(1412144, 1),
        Array(1422149, 1),
        Array(1432176, 1),
        Array(1442232, 1),
        Array(1452214, 1),
        Array(1462202, 1),
        Array(1472223, 1),
        Array(1482177, 1),
        Array(1492188, 1),
        Array(1522103, 1),
        Array(1532106, 1),
        Array(1542075, 1),
        Array(1552075, 1)
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
        if (im.getSpace(1) < 1) {
            im.sendOk("璇风‘鑳屽寘瑁呭鏍忔湁绌轰綅锛岃鍏堟暣鐞嗕竴涓嬪惂銆?);
            im.dispose();
            return;
        }
        var ii = im.getItemInfo();
        im.used(1);//杩欎釜涓烘秷鑰楁帀杩欎釜閬撳叿  鍙傛暟鏄秷鑰楃殑鏁伴噺   濡傛灉鏁伴噺澶т簬 1  杩樿鍏堝垽鏂?鏄惁鎷ユ湁杩欎箞澶氫釜鏁伴噺鐨勯亾鍏?
        im.gainItem(psrw[rand][0], +psrw[rand][1]); //闅忔満杩欎釜閬撳叿 杩樻湁鏁伴噺
        //杩欎釜涓烘湇鍔″櫒鍏憡
        //im.worldSpouseMessage(0x18, "銆庢瘡鏃ュ瀹濄€? + "[" + im.getChar().getName() + "] 鎵撳紑閲戝埄濂囩殑榛勯噾琚嬪瓙鑾峰緱浜? + psrw[rand][1] + "涓?" + ii.getName(psrw[rand][0]) + ">, 澶у蹇幓瀵诲疂鍚э紒");
        im.dispose();
    }
}
