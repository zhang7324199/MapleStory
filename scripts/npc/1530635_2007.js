/*importPackage(java.sql);
 importPackage(java.lang);
 importPackage(Packages.database);*/
var ttt6 = "#fUI/UIWindow.img/PvP/Scroll/enabled/next2#";
var time = new Date();
var hour = time.getHours(); //获得小时
var minute = time.getMinutes(); //获得分钟
var second = time.getSeconds(); //获得秒
var Year = time.getFullYear();
var month = time.getMonth() + 1; //获取当前月份(0-11,0代表1月)
var dates = time.getDate(); //获取当前日(1-31)
var status = -1;
var rand = 0;
var InsertData = false;
var nx = false;
var nxx = false;
var RMB = 0;

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        if (status == 0) {
            cm.dispose();
        }
        status--;
    }
    if (status == 0) {
		var conn = cm.getConnection();
		var ps = conn.prepareStatement("SELECT * FROM Activity0512 ORDER BY id desc LIMIT 5");
        var RankDataBase = ps.executeQuery();
        var text = ""
        var i = 1;
        text += "#d#e最新抽中大奖信息：#k#n#r(1000元宝抽1次,每抽一次返500点卷)#k\r\n\r\n-----------------------------------------------\r\n"
        while (RankDataBase.next()) {
            text += "#fUI/UIToolTip.img/Item/Equip/Star/Star# #r" + RankDataBase.getString("charName") + "#k 在 #b" + RankDataBase.getString("time") + "#k 抽中 #r" + RankDataBase.getString("itemid") + "#k"
            text += "\r\n"
            i++;
        }
        text += "-----------------------------------------------\r\n#L0##b【抽奖 #r" + cm.getRMB() + " #b/ 1000/次】#l #L1##d【奖品展览】#l\r\n#L2##r【次数领奖】#l#k \r\n\r\n \r\n"
        RankDataBase.close();
		ps.close();
		conn.close();
        cm.sendSimple(text);

    } else if (status == 1) {
        if (selection == 0) {
            var ii = cm.getItemInfo();
            if (cm.getRMB() >= 1000) {
                var item;
                var itemListAdcanced = Array(
                        3015694, //冰块中的PB
                        3015695, //
                        3015696, //
                        3015697, //
                        3015698, //
                        3015699, //
                        3015700, //破蛋而出
                        3015701, //成为雪人
                        3015702, //圣诞明信片椅子
                        3015675, //圣诞爷爷椅子
                        3015670, //扔鸡腿椅子
                        3015673, //小型死寂之地椅子
                        3015674, //小型童心之地椅子
                        3015672, //小型财物之地椅子
                        3015671, //小型勇士之地椅子
                        3015450, //黑暗追随者
                        3015449, //守护战士
                        3015632, //和雪孩子一起
                        3015631, //尴尬的晚餐
                        3015741, //对立着理想
                        3015304, //哗啦啦大水车
                        3015274, //国庆节喷泉椅子
                        3015303, //幸福的花鞋椅子
                        3016101, //怪物水晶球秋千椅
                        3015328, //冒险岛电动缆车椅子
                        3015329, //妖怪坛椅子
                        3015338, //秘密花园椅子
                        3015312, //农夫的乐园椅子
                        3015029, //宇宙冲撞椅
                        3014010, //捕获僵尸拍立得
                        3010853, //心花怒放椅子
                        3015130, //土豪婴儿推车
                        3015131, //巨大鼻涕泡椅子
                        3015132, //大粽子沙发椅
                        3015075, //大自然椅子
                        3016000, //大象跷跷板椅子
                        3015089, //训练师庭院椅子
                        3015135, //夏日沁饮椅子
                        3015015, //白羊座椅子
                        3015016, //金牛座椅子
                        3015017, //双鱼座椅子
                        3015018, //双子座椅子
                        3015019, //巨蟹座椅子
                        3015020, //狮子座椅子
                        3015021, //天秤座椅子
                        3015022, //天蝎座椅子
                        3015023, //处女座椅子
                        3015024, //射手座椅子
                        3015025, //山羊座椅子
                        3015026, //水瓶座椅子
                        3015027, //安德洛墨达椅子
                        3015096, //羊羊幻想牧场椅子
                        3012027, //羊羊热气球椅子
                        3015051, //巨无霸国际巨星
                        3015225, //和大象一起自拍
                        3015182, //蝶恋花椅子
                        3012028, //萌宠下午茶
                        3015129, //白色天堂椅子
                        3015224, //梦幻水晶椅子
                        3015002, //七彩摩天轮
                        3010832, //太阳椅子
                        1212090,
                        1222085,
                        1232085,
                        1242091,
                        1302299,
                        1312174,
                        1322224,
                        1332249,
                        1342091,
                        1362110,
                        1372196,
                        1382232,
                        1402222,
                        1412153,
                        1422159,
                        1432189,
                        1442243,
                        1452227,
                        1462214,
                        1472236,
                        1482190,
                        1492200,
                        1522114,
                        1532119,
                        1252032,
                        1542073,
                        1552073,
                        1262038,
                        1582024,
                        1012439,
                        1022212,
                        1032225,
                        1122272,
                        1132248,
                        1142662,
                        1152161,
                        1003984,
                        1102626,
                        1082559,
                        1052673,
                        1072874, //航海150套
                        1102459, //  月夜见尊的披风	
                        1132159, //	月夜见尊的腰带	
                        1152097, //	月夜见尊的肩章	
                        1082475, //	月夜见尊的手套	
                        1052512, //	月夜见尊的铠甲
                        1003604, //	月夜见尊的帽子	
                        1072714, //	月夜见尊的鞋子
                        1102460, //	素盏呜尊的披风	
                        1152098, //	素盏呜尊的肩章	
                        1132160, //	素盏呜尊的腰带	
                        1082476, //	素盏呜尊的手套	
                        1052513, //	素盏呜尊的铠甲
                        1003605, //	素盏呜尊的头盔	
                        1072715, //	素盏呜尊的鞋子
                        1102458, //	天钿女命的披风	
                        1132158, //	天钿女命的腰带	
                        1152096, //	天钿女命的肩章	
                        1082474, //	天钿女命的手套	
                        1052511, //	天钿女命的铠甲
                        1003603, //	天钿女命的帽子	
                        1072713, //	天钿女命的鞋子
                        1102456, //	天照的披风	
                        1132156, //	天照的腰带	
                        1152094, //	天照的肩章	
                        1082472, //	天照的手套	
                        1052509, //	天照的铠甲
                        1003601, //	天照的头盔	
                        1072711, //	天照的鞋子
                        1102457, //	大山?神的披风	
                        1132157, //	大山?神的腰带	
                        1152095, //	大山?神的肩章	
                        1082473, //	大山?神的手套	
                        1052510, //	大山?神的铠甲	
                        1003602, //	大山?神的帽子	
                        1072712, //	大山?神的鞋子
                        1102459, //	月夜见尊的披风	
                        1132159, //	月夜见尊的腰带	
                        1152097, //	月夜见尊的肩章	
                        1082475, //	月夜见尊的手套	
                        1052512, //	月夜见尊的铠甲
                        1003604, //	月夜见尊的帽子	
                        1072714, //	月夜见尊的鞋子
                        1242077, //	月夜见尊的天雷剑	
                        1362069, //	月夜见尊的惨鬼杖	
                        1342071, //	月夜见尊的斩死刀	
                        1472181, //	月夜见尊的惨魔拳	
                        1332195, //	月夜见尊的斩杀刀		
                        1532076, //	素盏呜尊的红炎炮	
                        1242078, //	素盏呜尊的豪雷剑	
                        1492154, //	素盏呜尊的雷激枪	
                        1222052, //	素盏呜尊的虹击炮	
                        1482142, //  素盏呜尊的惨血熊千		
                        1212057, //	天钿女命的眩光杖	
                        1372141, //	天钿女命的却鬼棒	
                        1262028, //	天钿女命的ESP限制器	
                        1552045, //	天钿女命的赤花蝶扇	
                        1382170, //	天钿女命的魔灵杖	
                        1252056, //  天钿女命的灵魂棒		
                        1302229, //	天照的丛云剑	
                        1442184, //	天照的天羽羽斩	
                        1542045, //	天照的村正	
                        1432140, //	天照的风灭戟	
                        1322164, //	天照的金刚杵	
                        1232072, //	天照的猛岚剑	
                        1422109, //	天照的破雳刚杵	
                        1402153, //	天照的御魂剑	
                        1312118, //	天照的天月斧	
                        1412106, //	天照的鬼炎斧	
                        1452172, //	大山?神的火魂弓	
                        1522073, //	大山?神的双龙闪弩	
                        1462161, //	大山?神的大通莲弓		
                        1242077, //	月夜见尊的天雷剑	
                        1362069, //	月夜见尊的惨鬼杖	
                        1342071, //	月夜见尊的斩死刀	
                        1472181, //	月夜见尊的惨魔拳	
                        1332195, //	月夜见尊的斩杀刀
                        1102481, //暴君西亚戴斯披风 - (无描述)
                        1202083, //真?伊昆图腾 - (无描述)
                        1102482, //暴君赫尔梅斯披风 - (无描述)
                        1202084, //金?伊昆图腾 - (无描述)
                        1102483, //暴君凯伦披风 - (无描述)
                        1202085, //银?伊昆图腾 - (无描述)
                        1102484, //暴君利卡昂披风 - (无描述)
                        1202086, //铜?伊昆图腾 - (无描述)
                        1102485, //暴君阿尔泰披风 - (无描述)
                        1190300, //白银枫叶徽章
                        1082543, //暴君西亚戴斯手套 - (无描述)
                        1190301, //金色枫叶徽章 - (无描述)
                        1082544, //暴君赫尔梅斯手套 - (无描述)
                        1190302, //水晶枫叶徽章 - (无描述)
                        1082545, //暴君凯伦手套 - (无描述)
                        1182021, //冒险岛学校铜徽章 - (无描述)
                        1082546, //暴君利卡昂手套 - (无描述)
                        1182022, //冒险岛学校银徽章 - (无描述)
                        1082547, //暴君阿尔泰手套 - (无描述)
                        1182023, //冒险岛学校金徽章 - (无描述)
                        1072743, //暴君西亚戴斯靴 - (无描述)
                        1182019, //新彩虹徽章 - 蕴含着彩虹的神秘力量的徽章。
                        1072744, //暴君赫尔梅斯靴 - (无描述)
                        1072745, //暴君凯伦靴 - (无描述)
                        1072746, //暴君利卡昂靴 - (无描述)
                        1072747, //暴君阿尔泰靴 - (无描述)
                        1132174, //暴君西亚戴斯腰带 - (无描述)
                        1132175, //暴君赫尔梅斯腰带 - (无描述)
                        1132176, //暴君凯伦腰带 - (无描述)
                        1132177, //暴君利卡昂腰带 - (无描述)
                        1132178, //暴君阿尔泰腰带 - (无描述)
                        1142742, //冒险岛奖杯
                        1112793, //快乐指环
                        2431938, //法弗纳武器箱
                        1122122, //真?觉醒冒险之心
                        1122123, //真?觉醒冒险之心
                        1122124, //真?觉醒冒险之心
                        1122125, //真?觉醒冒险之心
                        1122126, //真?觉醒冒险之心
                        1122266, //高级贝勒德刻印吊坠
                        1122267, //最高级贝勒德刻印吊坠
                        1113074, //高级贝勒德戒指
                        1113075, //最高级贝勒德戒指 
                        1132245, //高级贝勒德刻印腰带 
                        1132246, //最高级贝勒德刻印腰带
                        1032222, //高级贝勒德耳环           
                        1032223, //最高级贝勒德耳环
                        1032219//遗忘之神话耳环
                        );
                var itemListNormal = new Array(
                        5062000,
                        5062002,
                        5062009,
                        5064000,
                        2049704,
                        5062009,
                        2049119,
                        2431762,
                        2040057,
                        5062009,
                        2049116,
                        2047978,
                        5062009,
                        2040058,
                        2040059,
                        5062009,
                        4034151,
                        5062009,
                        4001006,
                        5062009,
                        5062009,
                        5062009,
                        2340000,
                        4001839,
                        5062009,
                        2046856,
                        2046863,
                        5062009,
                        2049131,
                        5062009,
                        5062009,
                        2431762,
                        2046870,
                        5062009,
                        2049100,
                        2049116,
                        5062009,
                        2040060,
                        5062009,
                        2049168,
                        5062009,
                        2040061,
                        5062009,
                        2040062,
                        4310088,
                        4310036,
                        5062009,
                        5072000,
                        5062009,
                        5073000,
                        5062009,
                        5074000,
                        5062009,
                        5076000,
                        5062009,
                        5390000,
                        5062009,
                        5390001,
                        5062009,
                        5390002,
                        5062009,
                        5390002,
                        5390003,
                        5062009,
                        5390005,
                        5390006,
                        5150040
                        );
                var xxx = Math.floor(Math.random() * 2);
                if (xxx == 1) {//100分之1的几率
                    rand = Math.floor(Math.random() * itemListAdcanced.length);
                    item = cm.gainGachaponItem(itemListAdcanced[rand], 1, " 明星转盘 ");
                    InsertData = true;
                } else if (xxx == 10) {//点券
                    cm.gainNX(1, 100000);
                    InsertData = true;
                    nx = true;
                } else if (xxx == 19 || xxx == 199) {//抵用券
                    cm.gainNX(2, 100000);
                    InsertData = true;
                    nxx = true;
                } else {
                    rand = Math.floor(Math.random() * itemListNormal.length);
                    item = itemListNormal[rand];
                    cm.gainItem(item, 1); //直接给予物品 不公告。
                }
                if (item == -1) {
                    cm.sendOk("对不起，你的背包已经满了。");
                    cm.dispose();
                } else {
                    //cm.addHyPay(1000);
                    cm.setRMB(cm.getRMB() - 1000);
                    cm.gainNX(1, 500);
                    cm.setBossLog("当天明星抽奖");
                    cm.setEventCount("累计明星抽奖", 1);
                    if (nx) {
						var conn = cm.getConnection();
                        var insert = conn.prepareStatement("INSERT INTO Activity0512 (id,itemid,charid,charName,time) VALUES(?,?,?,?,?)"); // 载入数据
                        insert.setString(1, null); //载入记录ID
                        insert.setString(2, "100,000 点券"); //载入记录ID
                        insert.setString(3, cm.getPlayer().getId());
                        insert.setString(4, cm.getPlayer().getName());
                        insert.setString(5, Year + "-" + month + "-" + dates + "");
                        insert.executeUpdate(); //更新
                        insert.close();
						conn.close();
                        //cm.getMap().startMapEffect("恭喜玩家 " + cm.getChar().getName() + " 运气爆表抽中 100,000 点券。", 5120012);
                        cm.worldSpouseMessage(0x20, "『终极大奖』 :  恭喜" + cm.getChar().getName() + ",运气爆表抽中 100,000 点券。");
                        cm.sendOk("恭喜您从幸运抽奖中获得了 #b100,000 点卷#k.");
                        cm.safeDispose();
                    } else if (nxx) {
						var conn = cm.getConnection();
                        var insert = conn.prepareStatement("INSERT INTO Activity0512 (id,itemid,charid,charName,time) VALUES(?,?,?,?,?)"); // 载入数据
                        insert.setString(1, null); //载入记录ID
                        insert.setString(2, "100,000 抵用卷"); //载入记录ID
                        insert.setString(3, cm.getPlayer().getId());
                        insert.setString(4, cm.getPlayer().getName());
                        insert.setString(5, Year + "-" + month + "-" + dates + "");
                        insert.executeUpdate(); //更新
                        insert.close();
						conn.close();
                        //cm.getMap().startMapEffect("恭喜玩家 " + cm.getChar().getName() + " 运气爆表抽中 100,000 抵用卷。", 5120012);
                        cm.worldSpouseMessage(0x20, "『终极大奖』 :  恭喜" + cm.getChar().getName() + ",运气爆表抽中100,000 抵用券。");
                        cm.sendOk("恭喜您从幸运抽奖中获得了 #b100,000 抵用券#k.");
                        cm.safeDispose();
                    } else {
                        if (InsertData) {
							var conn = cm.getConnection();
                            var insert = conn.prepareStatement("INSERT INTO Activity0512 (id,itemid,charid,charName,time) VALUES(?,?,?,?,?)"); // 载入数据
                            insert.setString(1, null); //载入记录ID
                            insert.setString(2, "#t" + item + "#"); //载入记录ID
                            insert.setString(3, cm.getPlayer().getId());
                            insert.setString(4, cm.getPlayer().getName());
                            insert.setString(5, Year + "-" + month + "-" + dates + "");
                            insert.executeUpdate(); //更新
                            insert.close();
							conn.close();
                            //cm.getMap().startMapEffect("恭喜玩家 " + cm.getChar().getName() + " 运气爆表抽中终极大奖 " + ii.getName(item) + "。", 5120012);
                        }
                        status = -1;
                        cm.sendOk("恭喜您抽中获得了 #b#t" + item + "##k.并返还 #r500#k 点卷");
                    }

                }
            } else {
                cm.sendOk("您没有 1000 元元宝，请获得后再使用。");//暂时关闭。增加物品中。
                cm.safeDispose();
            }
        } else if (selection == 1) {
            cm.sendOk("#b终极大奖图片欣赏，并且抽中后可以在首页榜上公布。\r\n可以抽中 #r点卷100,000   抵用卷500,000#k #b以及下列：#k\r\n#i3010853##i3015130##i3015131##i3015132##i3015089##i3015135##i3015015##i3015016##i3015017##i3015018##i3015019##i3015020##i3015021##i3015022##i3015023##i3015024##i3015025##i3015026##i3015027##i3015096##i3012027##i3015051##i3015002##i3010832##i1102481##i1102482##i1102483##i1102484##i1102485##i1082543##i1082544##i1082545##i1082546##i1082547##i1072743##i1072744##i1072745##i1072746##i1072747##i1132174##i1132175##i1132176##i1132177##i1132178##i1142742##i1112793##i2431938##i1032219#");
            cm.dispose();
        } else if (selection == 2) {
            cm.sendOk("暂时有问题待修复开放。具体等通知。")
            cm.dispose();
            //cm.openNpc(9310498, "cslj");
        }
    }
}