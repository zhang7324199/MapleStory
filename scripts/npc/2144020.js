var chat = -1;
var yesno = false;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1 /*End Chat*/ || mode == 0 && chat == 0 /*Due to no chat -1*/ || mode == 0 && yesno == true /*No*/) {
        cm.dispose();
        return;
    }
    if (mode == 1) //Next/Ok/Yes/Accept
        chat++;
    else if (mode == 0) //Previous/No/Delience
        chat--;
    if (cm.getMapId() == 300000012) {
        if (cm.getPlayer().getLevel() == 1)
            Tutorial1();
        else if (cm.getPlayer().getLevel() >= 4 && cm.getPlayer().getLevel() != 8) {
            if (cm.itemQuantity(4020009) == 0)
                Tutorial2();
            else if (cm.itemQuantity(4020009) > 0 && cm.getMonsterCount(cm.getMapId()) < 1)
                Tutorial3();
            else {
                cm.sendOk(" 你没有杀死强大的蜗牛.");
                cm.dispose();
            }
        } else if (cm.getPlayer().getLevel() == 8) {
            cm.sendOk(" 你必须跟希拉!");
            cm.dispose();
        }
    } else
        cm.dispose();
}

function Tutorial1() {
    if (chat == 0) {
        cm.sendNext("You are awake!");
    }else if (chat == 1)
        cm.sendNextPrevS("Where am I?\r\nAm I dead?", 3);
    else if (chat == 2)
        cm.sendNextPrev("Not exactly... \r\nWhen you have defeated the Black Mage You've been cursed.\r\nYour soul is between two worlds.");
    else if (chat == 3)
        cm.sendNextPrevS("Doesn't it mean I'm stuck here forever?", 3);
    else if (chat == 4) {
        cm.sendYesNo("Not at all... I've found a way to get you out of here.\r\nBut first, you have to prove me that I need to resurrect you.\r\nDo you accept the challange?");
        yesno = true;
    } else if (chat == 5) {
        yesno = false;
        while (cm.getPlayer().getLevel() < 4)
            cm.getPlayer().levelUp();
        cm.getPlayer().getClient().getSession().write(CPacket.startMapEffect("Talk to me again when you are ready.", 5122005, true));
        cm.dispose();
    }
}

function Tutorial2() {
    if (chat == 0)
        cm.sendNext("先，你必须击败力量蜗牛来证明你的力量。\ r \ npower蜗牛更强大10蜗牛，不会太难  ");
    else {
        if (cm.canHold(1302000, 1) && cm.itemQuantity(1302000) == 0)
            cm.gainItem(1302000, 1);
        if (cm.canHold(4020009, 1) && cm.itemQuantity(4020009) == 0)
            cm.gainItem(4020009, 1);
        for (var p = 0; p < 5; p++)
            cm.getPlayer().dropMessage(5, "它是什么？呵呵！这是一段时间！它是从哪里来的");
        cm.getPlayer().getClient().getSession().write(CPacket.startMapEffect("I've gave you a Sword that will help you to fight. \r\nTalk to me again when you have defeated the Powerful Snail.", 5122005, true));
        cm.spawnCustomMonster(100100, 100, 50, 1, 0, true, 1, 5, 0, "Powerful Snail", 47, 98);
        cm.dispose();
    }
}

function Tutorial3() {
    if (chat == 0)
        cm.sendNext("你杀了他!");
    else if (chat == 1)
        cm.sendNextPrevS("我已经证明了你，你必须让我吗", 3);
    else if (chat == 2)
        cm.sendNextPrev(" 还有一件事，为了离开这里，你必须触摸黑暗  ");
    else if (chat == 3)
        cm.sendNextPrevS(" 嗯？触摸黑暗？我要怎么做呢?");
    else if (chat == 4) {
        cm.sendYesNo("我要召唤希拉?");
        yesno = true;
    } else if (chat == 5) {
        yesno = false;
        while (cm.getPlayer().getLevel() < 8)
            cm.getPlayer().levelUp();
        cm.spawnNpc(1402400, -173, 98);
        cm.spawnNpc(1402401, -258, 98);
        cm.removeNpc(300000012, 2144020);
        cm.dispose();
    }
}

function nextMap(currentMap) { //Useless but might be used later
    switch (currentMap) {
        case 300000012:
            return 100000000;
            break;
        default:
            return 300000012;
            break;
    }
}
