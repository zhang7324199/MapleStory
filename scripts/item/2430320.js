/* 
 * 2430318 - 坐骑 小龟龟 90天
 */
var period = 90;
var mountSkillId = 10001122;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period, true);
    im.dispose();
}
