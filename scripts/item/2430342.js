﻿/* 
 * 坐骑 拿破仑的白马 90天
 */
var period = 90;
var mountSkillId = 10001139;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period, true);
    im.dispose();
}
