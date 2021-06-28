/* 
 * 坐骑 玩具木马 90天
 */
var period = 90;
var mountSkillId = 30001025;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period, true);
    im.dispose();
}
