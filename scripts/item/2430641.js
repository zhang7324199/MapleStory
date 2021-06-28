/*  This is mada by Kent    
 *  This source is made by Funms Team
 *  功能：金利奇的黄金袋子
 *  每日寻宝任务  需要添加奖励
 *  @Author Kent 
 */

var status = 0;
var psrw = Array(
        Array(2049130, 1), //正义混沌卷40%
        Array(2049137, 1), //惊人正义混沌卷40%
        Array(5062000, 5),
        Array(5062000, 2),
        Array(5062000, 1),
        Array(5062002, 1),
        Array(5062002, 2),
        Array(5062002, 3),
        Array(5062002, 5),
        Array(2340000, 1),
        Array(2340000, 2),
        Array(2340000, 3),
        Array(2340000, 5),
        Array(5064000, 1),
        Array(5064000, 2),
        Array(5064000, 3),
        Array(5064000, 5),
        Array(5062500, 1),
        Array(5062500, 2),
        Array(5062500, 3),
        Array(5062500, 5),
        Array(5390018, 1),
        Array(5390000, 10),
        Array(5390001, 10),
        Array(5390002, 10),
        Array(5390002, 5),
        Array(5390001, 5),
        Array(5390000, 5),
        Array(4001714, 1),
        Array(4001784, 1),
        Array(4001785, 1),
        Array(4310143, 5),
        Array(4310143, 10),
        Array(4310143, 15),
        Array(4310143, 20),
        Array(1112915, 1),
        Array(1352011, 1), //冒险岛寻宝魔法箭矢 等级要求：110
        Array(1352111, 1), //冒险岛寻宝卡片 等级要求：110
        Array(1352208, 1), //冒险岛寻宝吊坠 等级要求：110
        Array(1352218, 1), //冒险岛寻宝念珠 等级要求：110
        Array(1352228, 1), //冒险岛寻宝锁链 等级要求：110
        Array(1352238, 1), //赤铜之书 &lt;冒险岛寻宝> 等级要求：110
        Array(1352248, 1), //青银之书 &lt;冒险岛寻宝> 等级要求：110
        Array(1352258, 1), //白金之书 &lt;冒险岛寻宝> 等级要求：110
        Array(1352268, 1), //冒险岛寻宝羽毛 等级要求：110
        Array(1352278, 1), //冒险岛寻宝千发全中 等级要求：110
        Array(1352288, 1), //冒险岛寻宝暗影 等级要求：110
        Array(1352298, 1), //冒险岛寻宝破邪符 等级要求：110
        Array(1352408, 1), //冒险岛寻宝宝珠 等级要求：110
        Array(1352508, 1), //冒险岛寻宝精髓 等级要求：110
        Array(1352608, 1), //冒险岛寻宝灵魂戒指 等级要求：110
        Array(1352709, 1), //冒险岛寻宝麦林弹 等级要求：110
        Array(1352908, 1), //冒险岛寻宝手腕护甲 等级要求：110
        Array(1352918, 1), //冒险岛寻宝雕眼 等级要求：110
        Array(1352937, 1), //冒险岛寻宝天龙锤 等级要求：110
        Array(1352947, 1), //冒险岛寻宝的遗产 等级要求：110
        Array(1352959, 1), //冒险岛寻宝极限球 等级要求：110
        Array(1352969, 1), //冒险岛寻宝狂野之喙 等级要求：110
        Array(1352977, 1), //冒险岛寻宝圣地之光 等级要求：110
        Array(1352980, 1), //冒险岛寻宝中心发火火药桶 等级要求：110
        Array(1353008, 1), //冒险岛寻宝控制器 等级要求：110
        Array(1353107, 1), //冒险岛寻宝狐狸珠 等级要求：110
        Array(2046897, 1), // - RED饰品强化卷轴50%
        Array(2047828, 1), // - RED双手武器攻击力卷轴
        Array(2047829, 1), // - RED双手武器攻击力卷轴
        Array(2047840, 1), // - RED双手武器攻击力卷轴
        Array(2047971, 1), // - RED防具强化卷轴
        Array(2048720, 1), // - RED涅槃火焰
        Array(2048700, 1), // - 涅槃火焰110级
        Array(2048701, 1), // - 涅槃火焰120级
        Array(2048702, 1), // - 涅槃火焰130级
        Array(2048703, 1), // - 涅槃火焰140级
        Array(2048704, 1), // - 涅槃火焰150级
        Array(2048725, 1), // -涅槃火焰160级
        Array(2048724, 1), //- 强大的涅槃火焰
        Array(2048721, 1), //- 永远的涅槃火焰
        Array(1003422, 1), //石榴石渡鸦面具
        Array(2430030, 1), //黄金罗盘
        Array(1662027, 1), //银河战士
        Array(2430354, 1),
        Array(2430352, 1),
        Array(2430348, 1),
        Array(2430346, 1),
        Array(2430343, 1),
        Array(2430321, 1),
        Array(5062400, 1),
        Array(1662032, 1) //女妖机器人
        );

var psrw2 = Array(
        Array(2049130, 1), //正义混沌卷40%
        Array(2049137, 1), //惊人正义混沌卷40%
        Array(5062000, 5)
        );

var rand = Math.floor(Math.random() * psrw.length);
var randList = Math.floor(Math.random() * 3);
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
        if (im.getSpace(1) < 1 || im.getSpace(2) < 1 || im.getSpace(3) < 1 || im.getSpace(4) < 1 || im.getSpace(5) < 1) {
            im.sendOk("找到了宝藏！但是你要保证你背包的每一栏都有空位，请先整理一下吧。");
            im.dispose();
            return;
        }
        var ii = im.getItemInfo();
        im.gainItem(psrw[rand][0], +psrw[rand][1]); //随机这个道具
        im.worldSpouseMessage(0x0C, "『每日寻宝』" + "[" + im.getChar().getName() + "] 打开金利奇的黄金袋子获得了一定的奖励, 大家快去寻宝吧！");
        im.used(1);
        im.dispose();
    }
}
