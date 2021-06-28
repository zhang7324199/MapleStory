/* 
 * 坐骑 无辜水牛 永久
 */
var period = 90;
var mountSkillId = 10001123;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId);//, period, true);
    im.dispose();
}
