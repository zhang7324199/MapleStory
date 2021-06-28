/* 
 * 2431390 - 坐骑 拿破仑的白马 永久
 */
var period = 90;
var mountSkillId = 10001139;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId);
    im.dispose();
}
