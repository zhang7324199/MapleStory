/* 
 * 2431390 - 坐骑 猫头鹰 永久
 */
var period = 90;
var mountSkillId = 30001069;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId);
    im.dispose();
}
