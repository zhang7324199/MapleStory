/* 
 * 坐骑 幻龙骑宠 30天
 */
var period = 30;
var mountSkillId = 80001198;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period, true);
    im.dispose();
}
