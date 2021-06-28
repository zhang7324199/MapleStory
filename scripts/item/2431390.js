/* 
 * 2431390 - 坐骑 黑蛇 永久
 */
var period = 90;
var mountSkillId = 80001229;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId);
    im.dispose();
}
