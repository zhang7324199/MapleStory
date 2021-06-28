/* 
 * 2431390 - 坐骑 鸵鸟 永久
 */
var period = 90;
var mountSkillId = 30011051;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId);
    im.dispose();
}
