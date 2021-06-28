﻿/*
 * 菜菜制作 奇幻冒险岛工作室所有
 * 联系QQ：537050710
 * 欢迎定制各种脚本
 * OX问答副本
 */
var questions = ["太平洋的中间是什么？\r\nO:是平字\tX:大西洋",
        "每个成功男人背后有一个女人，那一个失败的男人背后会有什么？\r\nO:有太多女人\tX:有一个女人",
        " 一只蚂蚁从几百万米高的山峰落下来会怎么死？\r\nO:摔死的\tX:饿死了",
        "为什么青蛙可以跳得比树高？\r\nO:青蛙很会跳\tX:树不会跳",
        "增长智力最有效的办法是什么？\r\nO:吃一堑长一智\tX:吃什么补什么",
        "全民冒险岛射手村村长叫什么？\r\nO:斯卡斯\tX:长老斯坦",
        "全民冒险岛多少级魅力可以开口袋装备栏？\r\nO:40级\tX:30级",
        "全民冒险岛混沌品客宾本体有多少管血？\r\nO:14管\tX:10管",
        "全民冒险岛钓鱼第一名奖励有多少个枫叶币？\r\nO:120个\tX:150个",
        "一个离过五十次婚的女人，应该怎么形容她？\r\nO: 贪新忘旧\tX:前功尽弃",
        "黑人和白人生下的婴儿，牙齿是什么颜色？\r\nO:婴儿还没有长齿\tX:白色",
        "哪一个月有28天？\r\nO:闰年的2月28天\tX:每个月都有28天",
        "为什么关羽比张飞死的早？\r\nO:关羽比张飞年长\tX:关羽比张飞脸红",
        "张三酿得好酒，酒香飘四方。但他的酒往往因卖不出去而变酸。他的酒为什么卖不出去？\r\nO:他家有恶狗\tX:他的酒太贵",
        "人到中年才相识”指的是？\r\nO:以前不认识\tX:夹生饭",
        "边做假药公告边说假药效果好边痛斥假药危害的是什么？\r\nO:江湖骗子\tX:电视广告",
        "比上大学还贵的是什么？\r\nO:出国留学\tX:幼儿园",
        "为什么有人从几千米高直接跌落到千米左右却面不改色心不跳？\r\nO:是在飞机里或者是跳伞\tX:他们是中国股民",
        "一条蜈蚣过了一个臭水沟后有几只脚没湿？\r\nO:都没湿\tX:都湿了",
        "某人第一个月拿1000元工资，第二个月拿800，第三个月拿600，请问他的工资是降低了还是增长了？\r\nO:降低了\tX:是负增长",
        "兔子和乌龟比什么绝对不会输？\r\nO:赛跑\tX:仰卧起坐",
        "王大爷家养了10只牛，为什么才19只角?\r\nO:有一只是犀牛\tX:有一只牛断了一只角",
        "一只兔子和一直跑得很快的乌龟赛跑，谁赢了？\r\nO:跑得很快的乌龟\tX:兔子",
        "汽车在右转弯时，哪一条轮胎不转？\r\nO:右轮胎\tX:备用胎",
        "有两个人掉进了井里，死的人叫死人，活的人叫什么？\r\nO:活人\tX:救命",
        "动物园里谁是百兽之王？\r\nO:园长\tX:老虎",
        "一根针掉进了海里后，该怎么办？\r\nO:再买一根\tX:不管它",
        "什么人的心肠最好？\r\nO:好人\tX:身体健康的人",
        "小猫掉进了河里，大猫将其救起。问：小猫被救上岸时，会说什么？\r\nO:喵\tX:谢谢",
        "当你向别人炫耀自己琴棋书画样样精通时，别人还会知道些什么？\r\nO:你花了很多钱去学这些东西\tX:你不是哑巴",
        "猴子每分钟能掰一个玉米。同样，你叫猴子在果园里掰玉米，时间为5分钟。问：猴子能掰几个玉米？\r\nO:0个\tX:5个",
        "南瓜和菠萝砸头，哪个疼些？\r\nO:菠萝\tX:头",
        "两只狗赛跑，甲狗跑得快，乙狗跑得慢，跑到终点时，哪只狗出汗多?\r\nO:狗不会出汗\tX:二只出汗都多",
        "“只要有恒心”的下一句是什么？\r\nO:铁柱磨成针\tX:点石可成金",
        "《聊斋志异》的作者是谁？\r\nO:蒲松龄\tX:施耐庵",
        "歌德写《浮士德》用了多长时间？\r\nO:40年\tX:60年",
        "《指环王》中的指环可以让人？\r\nO:隐身\tX:施展魔法",
        "下面哪些不属于四大火炉的？\r\nO:山东\tX:武汉",
        "有“小提琴之王”之称的作曲家是\r\nO:贝多芬\tX:帕格尼尼",
        "景泰蓝”是何地的特种工艺？\r\nO:北京\tX:杭州",
        "青蛙除了用肺外还用什么器官呼吸？\r\nO:脾脏\tX:皮肤",
        "世界上最深的海沟位于？\r\nO:太平洋\tX:大西洋",
        "避雷针的发明者是？\r\nO:富兰克林\tX:爱迪生",
        "世界上四个主要火山带是？\r\nO:环太平洋火山带\tX:大洋中脊火山带",
        "我国第一颗人造卫星“东方红”是哪一年发射的？\r\nO:1870\tX:1970",
        "氢气球在空气中会上升，在上升的过程中，氢气球的体积逐渐？\r\nO:扩大\tX:缩小",
        "成人身体里有多少块骨头？\r\nO:206\tX:218",
        "选用无磷洗衣粉的目的是？\r\nO:保护双手\tX:防止污染",
        "世界上最小的花是？\r\nO:无花果\tX:海棠",
        "被称为我国“瓷都”的是哪一城市？\r\nO:宜兴\tX:景德镇",
        "人体最大的细胞是？\r\nO:脑细胞\tX:卵细胞",
        "起初婚礼上放鞭炮是为了？\r\nO:震妖除魔\tX:增加喜庆",
        "女方在怀孕期间、分娩后多长时间，男方不得提出离婚？\r\nO:一年\tX:二年",
        "8雪莲花的颜色是？\r\nO:白色\tX:深红色",
        "经常食用以下哪种食物容易引起铅中毒？\r\nO:油条\tX:松花蛋",
        "苍蝇飞落在某处就匆忙搓脚，它是在？\r\nO:清洁污物准备开饭\tX:品尝味道",
        "血液占人体比重的？\r\nO:7-8%\tX:30-38%",
        "如果把一个成人的所有血管连接起来，其长度接近？\r\nO:十公里\tX:十万公里",
        "工笔是哪种绘画形式的技法？\r\nO:国画\tX:油画",
        "“席梦思”三个字源于什么？\r\nO:人名\tX:地名",
        "《在那遥远的地方》是哪里的民歌？\r\nO:江苏民歌\tX:青海民歌",
        "人体含水量百分比最高的器官是？\r\nO:肝\tX:眼球",
        "下半旗是把旗子下降到？\r\nO:距离杆顶的1/3处\tX:旗杆的一半处",
        "土豆不宜存放在什么地方？\r\nO:日光照射处\tX:卧室内",
        "什么时间吃水果比较好？\r\nO:饭后食用\tX:饭前食用",
        "光脚散步对小儿发育有好处吗？\r\nO:有\tX:没有",
        "全世界最大的石佛像在哪里？\r\nO:四川乐山\tX:四川屏山",
        "铁观音是哪里出产的名茶？\r\nO:安徽\tX:福建", //false,
        "蜂蜜用那种水冲泡更好？\r\nO:温水\tX:冰水", //true,
        "以下哪种菜系不属于中国八大菜系之列？\r\nO:鄂菜\tX:皖", //true,
        "黄瓜不宜与下列哪种食物搭配？\r\nO:番茄\tX:鸡蛋", // true,
        "黄鹤楼在什么地方？\r\nO:武汉\tX:广州", //true,
        "东方明珠是世界第几高塔？\r\nO:第四\tX:第六", //false,
        "火影忍者疾风传主角名字\r\nO:漩涡鸣人\tX:大蛇丸", //true
        "兔兔可爱吗？\r\nO:可爱\tX:非常可爱", //false
        "GTO麻辣教师是哪种类型的？\r\nO:动漫\tX动漫和电视剧", //false
        "夜间行车远光会造成什么影响？\r\nO:短暂性致盲\tX:毫无影响", //true
        "世界上最小的鸟是什么鸟？\r\nO:蜂鸟\tX:小燕子", //true
        "世界上跑得最快的是什么？\r\nO:金钱豹\tX:鸵鸟", //false
        "和谐号高铁最高时速能达到多少？\r\nO:300\tX:500", //false
        "阿苏顿马丁是什么？\r\nO:人名\tX:跑车", //false
        "LOL里的大龙叫全名叫什么？\r\nO:纳什男爵\tX:无敌大龙", //true
        "冒险岛里只有冒险家一种法师吗？\r\nO:是\tX:不是", //false
        "时速100码的汽车紧急制动需要多久能停？\r\nO:40-45秒\tX:50-60秒", //true
        "LOL里的堕落天使叫什么？\r\nO:堕天使\tX:莫甘娜", //false
        "老虎属于什么类动物？\r\nO:猫科动物\tX:爬行动物", //true
        "花儿为什么是香的？\r\nO:那是因为我\tX:那是因为你", //true
        "一直被模范从未被超越是为啥？\r\nO:太给力\tX:哥是你模仿不了的", //false
        "蒙奇?D?路飞的爷爷叫什么？\r\nO:蒙奇?D?卡普\tX:蒙奇?D?多拉格", //true
        "蒙奇?D?路飞跟谁学会的霸气？\r\nO:博雅汉库克\tX:冥王雷利", //false
        "泷泽萝拉是？\r\nO:模特\tX:日本女优", //false
        "中国死海位于哪里？\r\nO:四川\tX:重庆", //true
        "毛泽东故乡在哪里？\r\nO:长沙\tX:湘潭", //false
        "长隆水上乐园在哪里？\r\nO:广州\tX:深圳"];
var answers = [true, true, false, false, true, false, false, true, false, false, true, false, false, true, false, false,
        false, false, true, false, false, true, true, false, false, true, true, false, true, false, false, false,
        true, true, true, false, true, false, false, true, false, true, true, false, false, true, true, false, true,
        false, false, true, true, false, false, false, true, false, true, true, false, false, true, true, false, true,
        true, false, true, true, true, true, false, true, false, false, true, true, false, false, false, true, false, true, false, true, true, false, true, false, false, true, false, true];


var asked = [];//判断已经回答的个数
var currentQuestion;
var eim;
var mapidPre = 910048000;//准备地图
var mapid = 910048100;//进行地图
var map;
var setupTask;
var setupTaskEvent;

function init() {
    scheduleNew();
    eim = em.newInstance("OXEvent");
    map = eim.getMapInstance(mapid);
    ResetProperty();
}

function ResetProperty() {
    em.setProperty("start", "0");
    em.setProperty("question", "0");
    em.setProperty("RightAnwser", "0");//得到问题的正确答案
    asked = Array();
    //map.resetFully();
    //setupTaskEvent.cancel(true);
}

function scheduleNew() {
    var cal = java.util.Calendar.getInstance();
    cal.set(java.util.Calendar.HOUR, 0);
    cal.set(java.util.Calendar.MINUTE, 0);
    cal.set(java.util.Calendar.SECOND, 0);
    var nextTime = cal.getTimeInMillis();
    while (nextTime <= java.lang.System.currentTimeMillis()) {
        nextTime += 1000 * 60 * 1;//1分钟检查一次时间
    }
    setupTask = em.scheduleAtTimestamp("startEvent", nextTime);
}

function cancelSchedule() {
    setupTask.cancel(true);
}


function startEvent() {
    if (em.getProperty("start") == "1") {//已经可以让后面的玩家进来了。
        if (eim.getMapFactory().getMap(mapid).getCharactersSize() == 0) {
            ResetProperty();//如果活动地图没人，自动释放开启入口等待下一个人的进入。
            scheduleNew();
        } else {
            for (var i = 0; i < eim.getMapFactory().getMap(mapid).getCharactersSize(); i++) {
                if (eim.getMapFactory().getMap(mapid).getCharactersSize() != 0) {
                    map.startMapEffect("现在有3分钟的时间等候其它玩家，请稍后！", 5121052);
                    eim.getMapFactory().getMap(mapid).getCharactersThreadsafe().get(i).getClient().getSession().write(Packages.tools.MaplePacketCreator.getClock(180));//10秒
                    eim.getMapFactory().getMap(mapid).getCharactersThreadsafe().get(i).openNpc(9000277, 4);//问题显示NPC
                }
            }
            em.broadcastServerMsg("[OX宾果活动] OX宾果活动已经开始了，现在大约有3分钟的报名时间，请速度到拍卖报到！");
            em.setProperty("start", "2");//等待状态
            setupTaskEvent = em.schedule("WatingStatus", 1000 * 60 * 3, eim);//3分钟后检查问题
        }
    } else if (em.getProperty("start") == "3") {//关闭入口状态
        if (eim.getMapFactory().getMap(mapid).getCharactersSize() == 0) {
            ResetProperty();//如果活动地图没人，自动释放开启入口等待下一个人的进入。
            scheduleNew();
            cancelSchedule();
        }
    } else if (em.getProperty("start") == "4") {//任务完成状态
        ResetProperty();//如果活动地图没人，自动释放开启入口等待下一个人的进入。
        scheduleNew();
    } else {
        ResetProperty();
        scheduleNew();
    }
}

function WatingStatus(eim) {
    if (em.getProperty("start") == "2") {//等待状态
        em.setProperty("start", "3");//关闭入口，不允许进入
        if (eim.getMapFactory().getMap(mapid).getCharactersSize() == 0) {
            ResetProperty();
            scheduleNew();//再次循环
        }
        if (eim.getMapFactory().getMap(mapid).getCharactersThreadsafe() != 0) {//如果开始了的话
            setupTaskEvent = em.schedule("QuetionStart", 1000 * 10, eim);//10秒后检查问题
            for (var i = 0; i < eim.getMapFactory().getMap(mapid).getCharactersSize(); i++) {
                if (eim.getMapFactory().getMap(mapid).getCharactersSize() != 0) {
                    eim.getMapFactory().getMap(mapid).getCharactersThreadsafe().get(i).getClient().getSession().write(Packages.tools.MaplePacketCreator.getClock(10));//10秒
                    //  eim.getMapFactory().getMap(mapid).getCharactersThreadsafe().get(i).dropMessage(1, "将在10秒后出题，请做好准备！");
                    eim.getMapFactory().getMap(mapid).getCharactersThreadsafe().get(i).dropMessage(6, "将在10秒后出题，请做好准备！");
                }
            }
            // map.startMapEffect("将在10秒后出题，请做好准备！", 5121052);
        } else {
            ResetProperty();
            scheduleNew();//再次循环
        }
    } else {
        if (eim.getMapFactory().getMap(mapid).getCharactersSize() == 0) {
            ResetProperty();
            scheduleNew();//再次循环
        }
    }
}

function QuetionStart(eim) {//问题提出部分
    if (asked.length != 20) {
        currentQuestion = Math.floor(Math.random() * questions.length);
        asked.push(currentQuestion);
        em.setProperty("question", currentQuestion);//得到问题的index
        for (var i = 0; i < eim.getMapFactory().getMap(mapid).getCharactersSize(); i++) {
            if (eim.getMapFactory().getMap(mapid).getCharactersSize() != 0) {
                eim.getMapFactory().getMap(mapid).getCharactersThreadsafe().get(i).openNpc(9000277, 1);//问题显示NPC
            }
        }
        setupTaskEvent = em.schedule("AfterQuestion", 1000 * 15, eim);//15秒后检查问题
        for (var i = 0; i < eim.getMapFactory().getMap(mapid).getCharactersSize(); i++) {
            if (eim.getMapFactory().getMap(mapid).getCharactersSize() != 0) {
                eim.getMapFactory().getMap(mapid).getCharactersThreadsafe().get(i).getClient().getSession().write(Packages.tools.MaplePacketCreator.getClock(15));//15秒
                eim.getMapFactory().getMap(mapid).getCharactersThreadsafe().get(i).dropMessage(6, "将在15秒后检查问题！请站好正确的位置！");
                //    eim.getMapFactory().getMap(mapid).getCharactersThreadsafe().get(i).dropMessage(1, "将在15秒后检查问题！请站好正确的位置！");
            }
        }
        //map.startMapEffect("将在30秒后检查问题！请站好正确的位置！", 5121052);
    } else {//已经回答了20道题目
        for (var i = 0; i < eim.getMapFactory().getMap(mapid).getCharactersSize(); i++) {
            if (eim.getMapFactory().getMap(mapid).getCharactersSize() != 0) {
                eim.getMapFactory().getMap(mapid).getCharactersThreadsafe().get(i).dropMessage(1, "恭喜你获得全部的20问答积分!\r\n请跟甘迪对话离开地图！\r\n可跟甘迪对话用积分兑换奖励！");
            }
        }
        //9000308
        //eim.getMapInstance(mapid).spawnNpc(9000308, new java.awt.Point(-682, 394));
        em.setProperty("start", "4");//任务完成状态
        scheduleNew();//再次循环
    }
    em.setProperty("OXEventState", asked.length);
}

function AfterQuestion(eim) {//问题检查部分
    em.setProperty("question", currentQuestion);//得到问题的index
    for (var i = 0; i < eim.getMapFactory().getMap(mapid).getCharactersSize(); i++) {
        eim.getMapFactory().getMap(mapid).getCharactersThreadsafe().get(i).openNpc(9000277, 2);//问题检查NPC
    }
    for (var i = 0; i < eim.getMapFactory().getMap(mapid).getCharactersSize(); i++) {
        if (eim.getMapFactory().getMap(mapid).getCharactersSize() != 0) {
            //eim.getMapFactory().getMap(mapid).getCharactersThreadsafe().get(i).openNpc(9000277, 2);//问题检查NPC
            eim.getMapFactory().getMap(mapid).getCharactersThreadsafe().get(i).dropMessage(6, "将在5秒后再次出题！");
            // eim.getMapFactory().getMap(mapid).getCharactersThreadsafe().get(i).dropMessage(1, "将在5秒后再次出题！");
            eim.getMapFactory().getMap(mapid).getCharactersThreadsafe().get(i).getClient().getSession().write(Packages.tools.MaplePacketCreator.getClock(5));//5
        }//避免报错
    }
    //map.startMapEffect("将在10秒后再次出题！", 5121052);
    if (eim.getMapFactory().getMap(mapid).getCharactersSize() != 0) {//避免报错
        setupTaskEvent = em.schedule("QuetionStart", 1000 * 5, eim);//5秒后再次出题
    } else {
        scheduleNew();//再次循环
        ResetProperty();
    }
}