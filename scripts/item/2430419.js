/* 
 * 坐骑 无辜水牛 7天
 */
var period = 7;
var mountSkillId = 10001123;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period, true);
    im.dispose();
}
