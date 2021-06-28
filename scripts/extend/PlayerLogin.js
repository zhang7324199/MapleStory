function start() {
    showMessage();
    showExtendMessage();
    loginTip();

    // 显示完成后关闭脚本
    cm.dispose();
}

/**
 * 显示玩家登陆后的消息提示框
 */
function showMessage() {
    cm.playerMessage(1, "【"+cm.getName() +"】\r\n\r\n欢迎来到 " + cm.getServerName() + " \r\n\r\n抵制不良游戏，拒绝盗版游戏\r\n注意自我保护，谨防受骗上当\r\n适度游戏益脑，沉迷游戏伤身\r\n合理安排时间，享受健康生活");
}

/**
 * vip神秘礼盒玩家上线提示
 */
function showExtendMessage(){
    if (!cm.getPlayer().isGM() && cm.haveItem(2430865)) {
        for (var i = 0; i < 3; i++) {
            cm.worldSpouseMessage(0x19, "[装逼公告] " + cm.getName() + " 带着一股骚劲闪亮登场！");
        }
    }
}

/**
 * 显示玩家登陆后的头顶消息
 */
function loginTip() {
    var activity = cm.getDiffActivity();
    var message;
    if (activity == 0) {
        message = "#e【今日登陆提示】#n\r\n\r\n已完成所有活跃度任务，可以去试试挑战新BOSS~";
    } else {
        message = "#e【今日登陆提示】#n\r\n\r\n您今天还需 " + cm.getAQNextStageNeed() + " 活跃度即可领取第 " + cm.getNextStage() + " 阶段奖励。\r\n点击拍卖查看如何获得活跃度。";
    }
    if (message != "") {
    	cm.showInstruction(message, 150, 60);
    }
}