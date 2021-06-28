/*
	制作：彩虹工作室
	功能：BOSS次数重置
	时间：2017年1月18日
*/

//重置副本需要的点券数量
var cash = 10000
//每天允许的重置次数
var reset = 2
var bosslist = Array(
    "普通扎昆",
    "进阶扎昆",
    "暗黑龙王",
    "进阶暗黑龙王",
    "钻机",
    "强化钻机",
    "品克缤",
    "混沌品克缤",
    "希拉",
    "希拉[困难]",
    "斯乌",
    "半半",
    "进阶半半",
    "贝伦",
    "进阶贝伦",
    "浓姬",
    "皮埃尔",
    "进阶皮埃尔",
    "森兰丸",
    "森兰丸[困难]",
    "贝勒·德",
    "狮子王:班·雷昂[简单]",
    "狮子王:班·雷昂[普通]",
    "女皇：希纳斯",
    "妖精女王：艾菲尼娅",
    "巨大蝙蝠",
    "巨大蝙蝠[困难]",
    "阿卡伊勒[普通]",
    "麦格纳斯",
    "麦格纳斯[困难]",
    "腥血女王",
    "进阶腥血女王"
)

var status = -1;

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        if (status == 0) {
            cm.dispose();
            cm.sendOk("等你想好了再来吧!");
        }
        status--;
    }
    if (status == 0) {
        cm.sendYesNo("重置所有BOSS副本需要" + cash + "点,你确定要重置吗?\r\n(每日可以重置)" + reset + "次");
    } else if (status == 1) {
        if (cm.getNX(1) >= cash && cm.getBossLog("重置副本") < reset) {
            cm.gainNX(1, -cash)
            for (var i = 0; i < bosslist.length; i++) {
                cm.resetPQLog(bosslist[i])
            }
            cm.setBossLog("重置副本");
            cm.sendOk("恭喜你!成功用" + cash + "点,重置了所有BOSS副本");
        } else {
            cm.sendOk("很抱歉,您因为一下原因无法重置副本!!!\r\n1.点券余额不足" + cash + "点.\r\n2.已经超过每日重置副本次数.");
        }
        cm.dispose();
    }
}

//resetEventCount