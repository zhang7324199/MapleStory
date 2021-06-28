/*
	制作：彩虹工作室
	功能：挑战BOSS
	时间：2017年1月15日
*/
var format = function FormatString(c, length, content) {
    var str = "";
    var cs = "";
    if (content.length > length) {
        str = content;
    } else {
        for (var j = 0; j < length - content.getBytes("GB2312").length; j++) {
            cs = cs + c;
        }
    }
    str = content + cs;
    return str;
}
var status = -1;
var text;
var icon1 = "#fUI/Gateway/WorldSelect/icon/0#";
var icon2 = "#fUI/UIWindow/Quest/icon2/7#";
var supericon = "#fUI/Basic.img/BtClaim/normal/0#";
var warning = "#fUI/CashShop.img/CSBeauty/hairColor/Enable/1#";
var icon3 = "#fUI/GuildMark.img/Mark/Etc/00009003/3#"; //剑
var icon4 = "#fUI/GuildMark.img/Mark/Etc/00009003/10#"; //剑
var icon5 = "#fUI/GuildMark.img/Mark/Etc/00009003/14#"; //剑
var icon6 = "#fEtc/pachinkoCygnus.img/controller/base/2#"
var selection1;
var secondsel = false;

var bosslist = [
    ["闹  钟", 220080000, [8500002]],
    ["希  拉", 262030000, [9300600]],
    ["浓  姬", 811000099, [9450022]],
    ["扎  昆", 211042300, [8800002, 8800102]],
    ["钻  机", 703020000, [9600086, 9600087]],
    ["黑  龙", 240050400, [8810018, 8810122]],
    ["妖女王", 300030300, [5250007]],
    ["品克缤", 270050000, [8820014, 8820304]],
    ["狮子王", 211070000, [8840010]],
    ["希纳斯", 271040000, [8850012]],
    ["森兰丸", 807300100, [9421581, 9421583]],
    ["大蝙蝠", 105100100, [8830007, 8830000]],
    ["阿卡伊", 272030300, [9300303]],
]

var bosslist2 = [
    ["【武陵道场】", 925020000],
    ["【BOSS竞技】", 932200000],
    ["【四大天王】", 105200000],
    ["【贝勒·德】", 863000100],
    ["【麦格纳斯】", 401060000],
    ["【黑暗斯乌】", 350060300],
]

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode <= 0) {
        cm.dispose();
        return;
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            text = "\t\t\t\t\t#b#v3994060##v3994073##v3991072##v3991072#\r\n"
            bosslist.forEach(function (value, index, array) {
                text += "#L" + index + "#" + icon4 + "【" + value[0] + "】" + "#l" + ((index + 1) % 3 == 0 ? "\r\n" : "  ");
            });
            text += "\r\n\r\n#r";
            bosslist2.forEach(function (value, index, array) {
                text += ((index + 1) % 2 == 1 ? "" : "") + "#L" + (index + 100) + "#" + icon5 + value[0] + "#l" + ((index + 1) % 3 == 0 ? "\r\n" : "#l");
            })
            text += "#n\r\n#L1003#" + icon6 + "#e#d【BOSS次数查询】 #L1004#" + icon6 + "#e#d【BOSS次数重置】#l#l";
            cm.sendSimple(text);
        } else if (status == 1) {
            selection1 = selection;
            if (selection < 100) { // bosslist
                var idd = bosslist[selection1][1];
                if (idd < 100000000) {
                    cm.dispose();
                    cm.openNpc(idd);
                } else {
                    var bosss = bosslist[selection1][2];
                    if (bosss != null && bosss.length > 1) {
                        secondsel = true;
                        cm.sendSimple("你这个无知的傻瓜，那么请选择吧！\r\n#L0# #v3994116# #l#L1# #v3994117# #l");
                    } else if (bosss != null) {
                        showEnterBoss(bosslist[selection1][0], bosss[0], -1);
                    } else {
                        cm.sendOk("发生未知错误.");
                        cm.dispose();
                    }
                }
            } else if (selection < 1000) { // bosslist2
                cm.warp(bosslist2[selection1 - 100][1]);
                cm.dispose();
            } else if (selection == 1000) { // 休闲副本
                cm.sendOk("休闲副本");
                cm.dispose();
            } else if (selection == 1001) { // 组队副本
                cm.sendOk("组队副本");
                cm.dispose();
            } else if (selection == 1002) { // 超级副本
                cm.sendOk("超级副本");
                cm.dispose();
            } else if (selection == 1003) { // BOSS次数查询
                cm.dispose();
                cm.openNpc(2159359, 1)
            } else if (selection == 1004) { // BOSS次数重置
                cm.dispose();
                cm.openNpc(2159359, 2)
            } else {
                cm.sendOk("未知选项");
                cm.dispose();
            }
        } else if (status == 2) {
            if (secondsel) {
                showEnterBoss(bosslist[selection1][0], bosslist[selection1][2][selection], selection);
            } else {
                if (selection == 2) {
                    status = -1;
                    action(1, 0, 0);
                } else {
                    cm.warp(bosslist[selection1][1]);
                    cm.dispose();
                }
            }
        } else if (status == 3) {
            if (selection == 2) {
                status = -1;
                action(1, 0, 0);
            } else {
                cm.warp(bosslist[selection1][1]);
                cm.dispose();
            }
        }
    }
}

function getIcon(index) {
    if (index > 0 && index < 10) {
        return "#fUI/Basic/LevelNo/" + index + "#";
    } else {
        return "";
    }
}

function showEnterBoss(basename, bossid, type) {
    var text = "\r\n#L0# #r#e开始挑战#n#b#l\t#L1# #e放弃挑战#n#l #L2##d#e<<<返回到上一步#n#l\r\n\r\n\r\n#b"
    text += "BOSS名称：" + (type == -1 ? "" : type == 0 ? "简单" : "困难") + basename + "\r\n";
    text += "BOSS掉宝：" + cm.checkDrop(bossid) + "\r\n"
    cm.sendSimple(text)
}
