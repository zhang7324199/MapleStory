/*
 *  @功能：    BOSS次数查询
 *  @作者：    彩虹工作室
 *  @时间：    2017年1月18日
 */
var ico = "#fUI/SoulUI.img/DungeonMap/icon/dungeonItem/0#";//"+ttt3+"//美化圆
var boss = Array(
    Array("扎昆    ", "普通扎昆", "进阶扎昆", 3, 3),
    Array("希拉    ", "希拉", "希拉[困难]", 2, 1),
    Array("钻机    ", "钻机", "强化钻机", 2, 2),
    Array("黑龙    ", "暗黑龙王", "进阶暗黑龙王", 2, 3),
    Array("斯乌    ", "斯乌", "斯乌", 2, 2),
    Array("半半    ", "半半", "进阶半半", 3, 1),
    Array("贝伦    ", "贝伦", "进阶贝伦", 3, 1),
    Array("浓姬    ", "浓姬", "浓姬", 1, 1),
    Array("皮埃尔  ", "皮埃尔", "进阶皮埃尔", 3, 1),
    Array("森兰丸  ", "森兰丸", "森兰丸[困难]", 2, 1),
    Array("贝勒德  ", "贝勒·德", "贝勒·德", 2, 2),
    Array("品克缤  ", "品克缤", "混沌品克缤", 3, 1),
    Array("狮子王  ", "狮子王:班·雷昂[简单]", "狮子王:班·雷昂[普通]", 2, 1),
    Array("希纳斯  ", "女皇：希纳斯", "女皇：希纳斯", 2, 2),
    Array("妖精女王", "妖精女王：艾菲尼娅", "妖精女王：艾菲尼娅", 3, 3),
    Array("巨大蝙蝠", "巨大蝙蝠", "巨大蝙蝠[困难]", 3, 1),
    Array("阿卡伊勒", "阿卡伊勒[普通]", "阿卡伊勒[普通]", 2, 2),
    Array("麦格拉斯", "麦格纳斯", "麦格纳斯[困难]", 1, 1),
    Array("腥血女王", "腥血女王", "进阶腥血女王", 3, 1)
)
var boss1 = [
    ["扎昆", "普通扎昆", "进阶扎昆", 3, 3]
]

function start() {
    var text = "\t#fs18##d#e以下是您今日副本剩余挑战次数\r\n#fs12##b#n\r\n";
    for (var i = 0; i < boss.length; i++) {
        var element = boss[i];
        text += "#fs15#" + "  " + ico + element[0] + "   普通" + "(" + (element[3] - cm.getPQLog(element[1])) + "/#r" + element[3] + "#b次) 困难" + "(" + (element[4] - cm.getPQLog(element[2])) + "/#r" + element[4] + "#b次)\r\n"
    }
    cm.sendOk(text);
    cm.dispose();
}

