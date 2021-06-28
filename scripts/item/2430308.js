/* 
 * 坐骑 蝙蝠怪 90天
 */
var period = 90;
var mountSkillId = 20001153;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period, true);
    im.dispose();
}
