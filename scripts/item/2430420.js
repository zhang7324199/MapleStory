/* 
 * 坐骑 玩具坦克 7天
 */
var period = 7;
var mountSkillId = 10001124;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period, true);
    im.dispose();
}
