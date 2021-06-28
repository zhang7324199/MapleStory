/* 
 * 坐骑 鳄鱼王 90天
 */
var period = 90;
var mountSkillId = 30001027;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period, true);
    im.dispose();
}
