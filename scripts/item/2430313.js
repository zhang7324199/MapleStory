/* 
 * 2431390 - 坐骑 直升机 永久
 */
var period = 90;
var mountSkillId = 10001157;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId);
    im.dispose();
}
