/* 
 * 2431390 - 坐骑 暴风摩托 永久
 */
var period = 90;
var mountSkillId = 30011063;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId);
    im.dispose();
}
