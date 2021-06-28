/* 
 * 坐骑 跑车 90天
 */
var period = 90;
var mountSkillId = 80001032;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period, true);
    im.dispose();
}
