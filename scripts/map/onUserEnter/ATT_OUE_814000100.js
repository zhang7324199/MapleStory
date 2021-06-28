/*
 Made by Pungin
 */

var status = -1;

function action(mode, type, selection) {
    if (mode > 0) {
        status++;
    } else {
        status--;
    }

    if (status == 0) {
        ms.getDirectionStatus(true);
        ms.EnableUI(1, 0);
        ms.sendNextSNew("喔喔~ 這里就是 '异世界'吗? 看来是一个个非常和平的村庄? 话说怎么在屋顶上啊…需要先去找个安全下去路线吧…", 0x39, 1);
    } else if (status == 1) {
        ms.getDirectionInfo(1, 1000);
    } else if (status == 2) {
        ms.getDirectionInfoNew(0, 4000, 3402, 184);
    } else if (status == 3) {
        ms.getDirectionInfo(1, 1000);
    } else if (status == 4) {
        ms.sendNextSNew("啊! 那边有个梯子，另外用那个爬下去到地上吧！", 0x39, 1);
    } else if (status == 5) {
        ms.trembleEffect(0, 300);
        ms.getDirectionInfo(1, 1000);
    } else if (status == 6) {
        ms.getDirectionInfoNew(1, 3000);
    } else if (status == 7) {
        ms.getDirectionInfo(1, 1000);
    } else if (status == 8) {
        ms.sendNextSNew("哇啊！什么啊！？", 0x39, 1);
    } else if (status == 9) {
        ms.getDirectionInfoNew(0, 2000, -800, 184);
    } else if (status == 10) {
        ms.spawnMonster(9460029, -800, 395);
        ms.getDirectionInfo(1, 2000);
    } else if (status == 11) {
        ms.getDirectionInfoNew(1, 2000);
    } else if (status == 12) {
        ms.getDirectionInfo(1, 1000);
    } else if (status == 13) {
        ms.sendNextSNew("到底是什么什么事情了？那是巨人？竟然在吃人！？不管如何这里很危险！使用那梯子先逃吧！！", 0x39, 1);
    } else if (status == 14) {
        ms.killMob(9460029);
        ms.EnableUI(0);
        ms.warp(814000200, 0);
        ms.dispose();
    } else {
        ms.dispose();
    }
}