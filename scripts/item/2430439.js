/* 
 * 坐骑 钢铁变形侠 7天
 */
var period = 7;
var mountSkillId = 10001053;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period, true);
    im.dispose();
}
