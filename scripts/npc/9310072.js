/*
 * 菜菜制作 奇幻冒险岛工作室所有
 * 联系QQ：537050710
 * 欢迎定制各种脚本
 * OX问答副本  个人版进入NPC
 * 
 */

var status = 0;
var maxPlay = 50;
var em;
var emgate;
var Eventstatus;
var itemid, leftday, quantity, needpoints;
var ItemArray = Array(
        Array(1050286, 1, 1, 100),
        Array(3010145, 1, 2, 50),
        Array(1322005, 1, -1, 1)
        );//道具id，个数，剩余天数，所需积分

function start() {
    status = -1;
    em = cm.getEventManager("OXEvent");
    emgate = cm.getEventManager("OXEventOpen");
    Eventstatus = "#r关闭状态。#k";
    if (em.getProperty("start") == "3") {//已经关闭入口了
        Eventstatus = "#e#r正在进行中。#n"
    }
    if (em.getProperty("start") == "1") {//
        Eventstatus = "#e#r开放入口中。#n"
    }
    if (em.getProperty("start") == "2") {//
        Eventstatus = "#e#r等待入场中。#n"
    }
    if (em.getProperty("start") == "0") {//已经关闭入口了
        Eventstatus = "#e#r等待入场。#n"
    }
    if (emgate.getProperty("open") == "false") {//
        Eventstatus = "#e#r管理员已关闭入口，禁止进入。#n"
    }
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status >= 0) {
            cm.dispose();
            return;
        }
        if (mode == 1)
            status++;
        else
            status--;
        if (status == 0) {
            if (cm.getMap().getId() == 910048100) {
                if (cm.getPlayer().isGM()) {
                    cm.sendSimple("你想做什么呢？\r\n目前的活动状态：" + Eventstatus + "\r\n#L99# #r#e[Hot~]利用答题积分兑换物品！！#n#b\r\n#b#L1# 我想查看活动介绍。\r\n#L2# 我想放弃挑战离开这里。#r#e\r\n#L3# 关闭入口！（管理员可见）\r\n#L4# 开启入口！（管理员可见）");
                } else {
                    cm.sendSimple("你想做什么呢？\r\n目前的活动状态：" + Eventstatus + "\r\n#L99# #r#e[Hot~]利用答题积分兑换物品！！#n#b\r\n#b#L1# 我想查看活动介绍。\r\n#L2# 我想放弃挑战离开这里。");
                }
            } else if (cm.getMap().getId() == 910048200) {
                cm.sendOk("你好~");
                cm.dispose();
            } else {
                em = cm.getEventManager("OXEvent");
                emgate = cm.getEventManager("OXEventOpen");
                if (emgate.getProperty("open") == "false") {//已经关闭入口了
                    if (cm.getPlayer().isGM()) {
                        status = 2;
                        cm.sendYesNo("尊敬的管理员，您想开放OX宾果活动的入口吗？");
                    } else {
                        cm.sendSimple("现在不是活动时间，请稍后再试！\r\n#L99# #r#e[Hot~]利用答题积分兑换物品！！#n#b\r\n")
                    }
                    return;
                }
                if (cm.getBossLog("OX宾果活动") >= maxPlay) {
                    cm.sendOk("今天你已经参与了" + maxPlay + "次，不能再参与该副本了！请明天赶早~");
                    cm.dispose();
                    return;
                }
                if (cm.getPlayerCount(910048100) == 0 && (em.getProperty("start") == "3" || em.getProperty("start") == "4")) {//已经关闭入口了 但是里面已经没人了，重置
                    em.setProperty("OXEventState", "0");
                    em.setProperty("start", "0");
                    em.setProperty("question", "0");
                    em.setProperty("RightAnwser", "0");//得到问题的正确答案
                    cm.sendOk("请重新打开我哦~~");
                    cm.dispose();
                    return;
                }
                if (em.getProperty("start") == "3") {//已经关闭入口了
                    cm.sendOk("已经开始了OX宾果活动，请稍后再来。");
                    cm.dispose();
                    return;
                }

                if (em == null) {
                    cm.sendOk("出现错误，请重新进入副本。");
                } else {
                    if (cm.getPlayer().isGM()) {
                        cm.sendSimple("#n#b\r\n\t\t\t\t#e<OX问答活动>#n\r\n\r\n#dOX宾果活动就要开始啦！现在还有几分钟的等待时间……\r\n目前的活动状态：" + Eventstatus + "\r\n\r\n\r\n#b#L0#我想参加<OX宾果活动>。#l\r\n#L1#我想了解一下该活动的说明。#l \r\n#L99# #r#e[Hot~]利用答题积分兑换物品！！#n#b\r\n#L3# 关闭活动入口！(GM可见)")
                    }
                    else if (em.getProperty("start") == "2" || em.getProperty("start") == "1") {//等待状态
                        cm.sendSimple("#n#b\r\n\t\t\t\t#e<OX问答活动>#n\r\n\r\n#dOX宾果活动就要开始啦！现在还有几分钟的等待时间……\r\n目前的活动状态：" + Eventstatus + "\r\n\r\n\r\n#b#L0#我想参加<OX宾果活动>。#l\r\n\r\n#L99# #r#e[Hot~]利用答题积分兑换物品！！#n#b\r\n#L1#我想了解一下该活动的说明。#l")
                    } else {//第一个人进入的
                        cm.sendSimple("#n#b\r\n\t\t\t\t#e<OX问答活动>#n\r\n\r\n#dOX宾果活动就要开始啦！……\r\n目前的活动状态：" + Eventstatus + "\r\n\r\n\r\n#b#L0#我想执行<OX宾果活动>。#l\r\n#L99# #r#e[Hot~]利用答题积分兑换物品！！#n#b\r\n#L1#我想了解一下该活动的说明。#l")
                    }
                }
            }
        } else if (status == 1) {
            if (selection == 0) {
                if (em.getProperty("start") == "0") {
                    em.setProperty("OXEventState", "0");//问题清空
                    em.setProperty("start", "1");//设置开关，已经可以进入了。 之后一个倒计时60秒，等候后面的玩家进来
                    cm.warp(910048100, "sp");
                    cm.setBossLog("OX宾果活动");
                    cm.getMap().startMapEffect("现在有3分钟的时间等候其它玩家，请稍后！", 5121052);
                    cm.sendOk("[欢迎来到OX问答活动！]\r\n大家好，欢迎来到这里！\r\n在这我们将回答二十道问答题，它们涉及到很多方面，但问题只有两种答案，#b#eO正确，X错误#n#k。\r\n题目出现的时，选择正确答案，站在正确的位置吧！\r\n#e（站在中间的位置不算，将会被视为错误答案）\r\n#n#r 在前5道题目答错不受到影响，但是在后面错的话，会被请出该地图不再作答。\r\n\r\n如果你通过了我的考验的话，，将赠送#i2432352# #t2432352# 一个。");
                } else if (em.getProperty("start") == "1") {//入口已经开放
                    cm.warp(910048100, "sp");
                    cm.setBossLog("OX宾果活动");
                    cm.getMap().startMapEffect("现在有3分钟的时间等候其它玩家，请稍后！", 5121052);
                    cm.sendOk("[欢迎来到OX问答活动！]\r\n大家好，欢迎来到这里！\r\n在这我们将回答二十道问答题，它们涉及到很多方面，但问题只有两种答案，#b#eO正确，X错误#n#k。\r\n题目出现的时，选择正确答案，站在正确的位置吧！\r\n#e（站在中间的位置不算，将会被视为错误答案）\r\n#n#r 在前5道题目答错不受到影响，但是在后面错的话，会被请出该地图不再作答。\r\n\r\n如果你通过了我的考验的话，，将赠送#i2432352# #t2432352# 一个。");
                } else {//等待状态
                    cm.warp(910048100, "sp");
                    cm.setBossLog("OX宾果活动");
                    cm.sendOk("[欢迎来到OX问答活动！]\r\n大家好，欢迎来到这里！\r\n在这我们将回答二十道问答题，它们涉及到很多方面，但问题只有两种答案，#b#eO正确，X错误#n#k。\r\n题目出现的时，选择正确答案，站在正确的位置吧！\r\n#e（站在中间的位置不算，将会被视为错误答案）\r\n#n#r 在前5道题目答错不受到影响，但是在后面错的话，会被请出该地图不再作答。\r\n\r\n如果你通过了我的考验的话，将赠送#i2432352# #t2432352# 一个。");
                    cm.getPlayer().dropMessage(1, "活动马上开始，请等候后面的玩家！");
                }
                // cm.getNpcNotice(1540104, "[欢迎来到OX问答活动！]\r\n大家好，欢迎来到这里！\r\n#b让我们先等候3分钟来欢迎后面到来的冒险家吧！#k\r\n在这我们将回答二十道问答题，它们涉及到很多方面，但问题只有两种答案，#b#eO正确，X错误#n#k。\r\n题目出现的时，选择正确答案，站在正确的位置吧！\r\n#e（站在中间的位置不算，将会被视为错误答案）\r\n#n#r 在前5道题目答错不受到影响，但是在后面错的话，会被请出该地图不再作答。", 9);//显示180秒的活动介绍
                cm.safeDispose();
            } else if (selection == 1) {
                cm.sendOk("[欢迎来到OX问答活动！]\r\n大家好，欢迎来到这里！\r\n在这我们将回答二十道问答题，它们涉及到很多方面，但问题只有两种答案，#b#eO正确，X错误#n#k。\r\n题目出现的时，选择正确答案，站在正确的位置吧！\r\n#e（站在中间的位置不算，将会被视为错误答案）\r\n#n#r 在前5道题目答错不受到影响，但是在后面错的话，会被请出该地图不再作答。");
                cm.safeDispose();
            } else if (selection == 2) {
                cm.sendYesNo("真的要离开这里吗？这样就不能和大家一起玩了呢！");
            } else if (selection == 3) {
                emgate.setProperty("open", "false");
                cm.sendOk("已经关闭了入口！");
                cm.spouseMessage(0x24, "[OX宾果活动] 现在管理员已经关闭了活动入口。");
                cm.worldBrodcastEffect(5121052, "[OX宾果活动] 现在管理员已经关闭了活动入口。");
                cm.dispose();
            } else if (selection == 4) {
                emgate.setProperty("open", "true");
                cm.sendOk("已经开启入口！");
                cm.spouseMessage(0x24, "[OX宾果活动] 现在管理员已经开启了活动入口。");
                cm.worldBrodcastEffect(5121052, "[OX宾果活动] 现在管理员已经开启了活动入口。");
                cm.dispose();
            } else if (selection == 99) {
                var text = "你现在一共可用答题积分为：" + getEventPoints(20, cm.getPlayer().getId()) + "\r\n#b";
                for (var i = 0; i < ItemArray.length; i++) {
                    if (ItemArray[i][2] <= 0) {
                        text += "#L" + i + "# #i" + ItemArray[i][0] + "# #t" + ItemArray[i][0] + "# 时限： 永久  ★ 积分：(" + ItemArray[i][3] + ")\r\n"
                    } else {
                        text += "#L" + i + "# #i" + ItemArray[i][0] + "# #t" + ItemArray[i][0] + "# 时限：" + ItemArray[i][2] + "天  ★ 积分：(" + ItemArray[i][3] + ")\r\n"
                    }
                }
                status = 3;
                cm.sendSimple(text);
            }
        } else if (status == 2) {
            cm.warp(910000000, 0);
            cm.dispose();
        } else if (status == 3) {
            emgate.setProperty("open", "true");
            cm.sendOk("已经开启了入口！");
            cm.spouseMessage(0x24, "[OX宾果活动] 管理员已经开放了活动入口，请大家速度从拍卖处的副本入口进来哦！");
            cm.worldBrodcastEffect(5121052, "管理员已经开放了活动入口，请大家速度从拍卖处的副本入口进来哦！");
            cm.dispose();
        } else if (status == 4) {
            itemid = ItemArray[selection][0];
            leftday = ItemArray[selection][2];
            quantity = ItemArray[selection][1];
            needpoints = ItemArray[selection][3];
            if (leftday <= 0) {
                cm.sendYesNo("你想使用" + needpoints + "抽奖积分来兑换#i" + itemid + "# #b#t" + itemid + "##k 吗？\r\n 使用期限：#b永久#k。");
            } else {
                cm.sendYesNo("你想使用" + needpoints + "抽奖积分来兑换#i" + itemid + "# #b#t" + itemid + "##k 吗？ \r\n使用期限：#b" + leftday + "天#k。");
            }
        } else if (status == 5) {
            if (cm.getSpace(1) < 2 && cm.getSpace(2) < 2 && cm.getSpace(3) < 2 && cm.getSpace(4) < 2 && cm.getSpace(5) < 2) {
                cm.sendOk("请确保您所有的背包栏都有2个以上的空格。");
                cm.dispose();
                return;
            }
            if (getEventPoints(20, cm.getPlayer().getId()) >= needpoints) {
                setEventPoints(20, cm.getPlayer().getId(), -needpoints);
                if (leftday <= 0) {
                    cm.gainItem(itemid, quantity);
                } else {
                    cm.gainItemPeriod(itemid, quantity, leftday);
                }
                status = -1;
                cm.sendOk("兑换成功了！");
            } else {
                status = -1;
                cm.sendOk("对不起，你没有足够的积分兑换。");
            }
        }
    }
}


function DelEventPoints(Eventid, charid) {
    var delectData = cm.getConnection().prepareStatement("delete from EventTimes where eventid = " + Eventid + " and cid = " + charid + "");
    delectData.executeUpdate(); //删除数据
}

function getEventTimes(Eventid, charid) {//通过eventid来得到参与这个活动的次数
    var i = 0;
    var Times = cm.getConnection().prepareStatement("SELECT * FROM EventTimes where eventid = " + Eventid + " and cid = " + charid + "").executeQuery(); // 查询数据
    while (Times.next()) {
        i = Times.getString("times");//得到次数
    }
    return parseInt(i);
}

function getEventPoints(Eventid, charid) {//通过eventid来得到参与这个活动的点数
    var i = 0;
    var Times = cm.getConnection().prepareStatement("SELECT * FROM EventTimes where eventid = " + Eventid + " and cid = " + charid + "").executeQuery(); // 查询数据
    while (Times.next()) {
        i = Times.getString("points");//得到点数
    }
    return parseInt(i);
}

function setEventPoints(Eventid, charid, points) {//通过eventid来给予参与这个活动的点数
    var i = 0;
    var Times = cm.getConnection().prepareStatement("SELECT * FROM EventTimes where eventid = " + Eventid + " and cid = " + charid + "").executeQuery(); // 查询数据
    while (Times.next()) {
        i++;
    }
    if (i == 0) {//insert
        var insert = cm.getConnection().prepareStatement("INSERT INTO EventTimes VALUES(?,?,?,?,?,?,?)"); // 载入数据
        insert.setString(1, null); //载入记录ID
        insert.setString(2, Eventid); //载入活动ID
        insert.setString(3, cm.getPlayer().getId());//cid
        insert.setString(4, cm.getPlayer().getName());//cname
        insert.setString(5, points);//points 点数
        insert.setString(6, getEventTimes(1, charid));//times 次数
        insert.setString(7, null);//
        insert.executeUpdate(); //更新
    } else {//update
        var update = cm.getConnection().prepareStatement("update EventTimes set points = ? where eventid = " + Eventid + " and cid = " + charid + "");//更新为已使用
        update.setString(1, getEventPoints(Eventid, charid) + points);
        update.executeUpdate();
    }
}

function setEventTimes(Eventid, charid, times) {//通过eventid来设置参与这个活动的次数
    var i = 0;
    var Times = cm.getConnection().prepareStatement("SELECT * FROM EventTimes where eventid = " + Eventid + " and cid = " + charid + "").executeQuery(); // 查询数据
    while (Times.next()) {
        i++;
    }
    if (i == 0) {//insert
        var insert = cm.getConnection().prepareStatement("INSERT INTO EventTimes VALUES(?,?,?,?,?,?,?)"); // 载入数据
        insert.setString(1, null); //载入记录ID
        insert.setString(2, Eventid); //载入活动ID
        insert.setString(3, cm.getPlayer().getId());//cid
        insert.setString(4, cm.getPlayer().getName());//cname
        insert.setString(5, getEventPoints(2, charid));//points 点数
        insert.setString(6, times);//times 次数
        insert.setString(7, null);//
        insert.executeUpdate(); //更新
    } else {//update
        var update = cm.getConnection().prepareStatement("update EventTimes set times = ? where eventid = " + Eventid + " and cid = " + charid + "");//更新为已使用
        update.setString(1, getEventTimes(Eventid, charid) + times);
        update.executeUpdate();
    }
}