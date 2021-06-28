/* 
 * 2431390 - 坐骑 黑飞龙 永久
 */
var period = 90;
var mountSkillId = 80001237;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId);
    im.dispose();
}
