/* 
 * 2431390 - 坐骑 梦魇 永久
 */
var period = 90;
var mountSkillId = 10001152;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId);
    im.dispose();
}
