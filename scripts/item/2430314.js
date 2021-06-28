/* 
 * 坐骑 直升机 90天
 */
var period = 90;
var mountSkillId = 10001157;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period, true);
    im.dispose();
}
