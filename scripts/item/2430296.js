/* 
 * 坐骑 天马 90天
 */
var period = 90;
var mountSkillId = 10001147;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period, true);
    im.dispose();
}
