/*  
 *  
 *  功能：游戏帮助
 *  
 */
﻿var Message = new Array(
        "市场 ”财神“ 或者拍卖 ”金融中心“ 可以进行元宝、点券、金色枫叶的相互兑换！（金色枫叶可以交易给其他玩家哦）",
        "如出现异常导致游戏无法继续，或者无法和NPC进行对话，请使用玩家命令：@ea 解除异常状态",
		"彩虹工作室 官方网站：http://www.caihongms.com 唯一客服QQ：503355338",
        "Chms_Server 目前仍处于测试阶段，如遇到BUG请多多包涵，及时提交给我们，我们会尽快处理");

var setupTask;

function init() {
    scheduleNew();
}

function scheduleNew() {
    setupTask = em.schedule("start", 4 * 60000);
}

function cancelSchedule() {
    setupTask.cancel(false);
}

function start() {
    scheduleNew();
    em.broadcastYellowMsg("[Chms_Server] " + Message[Math.floor(Math.random() * Message.length)]);
}