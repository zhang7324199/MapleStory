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
        ms.DisableUI(true);
        ms.sendNextSNew("到底是怎么回事？吃人的巨人!! 而且还赤裸裸…不，这不是重点…现在我要去哪里才好呢？", 0x39, 1);
    } else if (status == 1) {
        ms.getDirectionStatus(true);
        ms.getDirectionInfo(1, 1000);
    } else if (status == 2) {
        ms.getDirectionInfoNew(0, 4000, -320, 0);
    } else if (status == 3) {
        ms.getDirectionInfo(1, 3000);
    } else if (status == 4) {
        ms.getDirectionInfoNew(1, 2000);
    } else if (status == 5) {
        ms.sendNextSNew("啊! 在那里一群人在坐船! 好像是搭上那个船离开这村庄的样子. 很好，我也要搭上那艘船离开这里! 竟然说会是个有趣的冒险，根本就骗人的嘛!!!", 0x39, 1);
    } else if (status == 6) {
        ms.EnableUI(0);
        ms.DisableUI(false);
        ms.dispose();
    } else {
        ms.dispose();
    }
}