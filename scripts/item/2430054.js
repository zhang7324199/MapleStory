/* 
 * 坐骑 男男机车 30天
 */
var period = 30;
var mountSkillId = 80001005;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period, true);
    im.dispose();
}
