/* 
 * 2432293 - 坐骑 南瓜马车 永久
 */
var period = -1;
var mountSkillId = 80001329;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period);//, true);
    im.dispose();
}
