/* 
 * 坐骑 暴风摩托 90天
 */
var period = 90;
var mountSkillId = 30011063;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period, true);
    im.dispose();
}
