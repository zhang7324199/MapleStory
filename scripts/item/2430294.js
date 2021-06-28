/* 
 * 坐骑 飞船 90天
 */
var period = 90;
var mountSkillId = 10001146;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period, true);
    im.dispose();
}
