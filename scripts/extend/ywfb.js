/*
 笔芯制作★风云工作室所有
 完成时间：2013年10月28日 16:34:19
 脚本功能：挑战首领
 */
var x = "#fEffect/CharacterEff/1114000/1/0#";  //红星花
var a = 0;
var selects;
var BossList = Array(
 Array("" + x + "红蜗牛王", 104010200),
 Array("" + x + "树妖王",102020500 ),
 Array("" + x + "蘑菇王",100020101 ),
 Array("" + x + "蓝蘑菇王",100020301 ),
 Array("" + x + "僵尸蘑菇王",100020401 ),
 Array("" + x + "巨居蟹",120030500 ),
 Array("" + x + "肯德熊",250010304 ),
 Array("" + x + "艾利杰",200010300 ),
 Array("" + x + "妖怪禅师",250010503 ),
 Array("" + x + "多尔",103030400 ),
 Array("" + x + "浮士德",101040300 ),
 Array("" + x + "提莫",220050100 ),
 Array("" + x + "朱诺",221040301 ),
 Array("" + x + "大海兽",240040401 ),
 Array("" + x + "大宇",260010201 ),
 Array("" + x + "大王蜈蚣",251010102 ),
 Array("" + x + "吉米拉",261030000 ),
 Array("" + x + "歇尔夫",230020100 ),
 Array("" + x + "谢尔德",103020320 ),
 Array("" + x + "谢尔德",103020420 ),
 Array("" + x + "自动警备系统",261020300 ),
 Array("" + x + "迪特和罗伊",261020401 ),
 Array("" + x + "仙人玩偶",250020300 ),
 Array("" + x + "雪山魔女",211050000 ),
 Array("" + x + "陆陆猫",261010003 ),
 Array("" + x + "书生鬼",222010300 ),
 Array("" + x + "青竹武士",251010101 ),
 Array("" + x + "黑山老妖",211041400 ),
 Array("" + x + "蝙蝠怪",105030500 ),
 Array("" + x + "未知的小吃店",105020400 ),
 Array("" + x + "驮狼雪人",211040101 ),
 Array("" + x + "小雪人",209000000 ),
 Array("" + x + "牛魔王", 677000001),
 Array("" + x + "黑暗独角兽",677000003 ),
 Array("" + x + "沃勒福",677000009 ),
 Array("" + x + "剑齿豹",931000500 )
        );

function start() {
    a = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 1)
            a++;
        else
            a--;
        if (a == -1) {
            cm.dispose();
        } else if (a == 0) {
            var text = "#e#r野图BOSS有一定概率爆出金猪哦！如果没有出口请输入@卡图\r\n\r\n#b";
            for (var i = 0; i < BossList.length; i++) {
                text += "#L" + i + "# " + BossList[i][0] + "\r\n"
            }
            cm.sendSimple(text);
        } else if (a == 1) {
            selects = selection;
            cm.sendYesNo("你现在想出发到" + BossList[selects][0] + "吗？")
        } else if (a == 2) {
            cm.saveLocation("MULUNG_TC");
            cm.warp(BossList[selects][1], 0);
            cm.dispose();
        }//a
    }//mode
}//f
