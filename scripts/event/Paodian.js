﻿/*    
 *  @名称：    泡点
 *  @制作：    彩虹工作室
 *  @时间：    2016年12月30日
 */
        ﻿var setupTask;

function init() {
    scheduleNew();
}

function scheduleNew() {
    var cal = java.util.Calendar.getInstance();
    cal.set(java.util.Calendar.HOUR, 0);
    cal.set(java.util.Calendar.MINUTE, 50);
    cal.set(java.util.Calendar.SECOND, 0);

    var nextTime = cal.getTimeInMillis();

    while (nextTime <= java.lang.System.currentTimeMillis()) {
        nextTime += 1000 * 60;
    }
    setupTask = em.scheduleAtTimestamp("start", nextTime);
}

function cancelSchedule() {
    if (setupTask != null)
        setupTask.cancel(true);
}

function start() {
  scheduleNew();
    var allPlayers = em.getMapFactoryMap(910000000).getCharacters();//取得当前地图上面的所有玩家
       allPlayers = allPlayers.iterator();
    while (allPlayers.hasNext()) {//循环每一个玩家
        var player = allPlayers.next();
			player.modifyCSPoints(1, 2);
            player.modifyCSPoints(2, 10);
            player.dropMessage(5, "[泡点奖励]：获得 [ 2 ] 点卷 [ 10 ] 抵用卷  ");
}
}
