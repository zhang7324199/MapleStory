/* 
 * 坐骑 妮娜的魔法阵 90天
 */
var period = 90;
var mountSkillId = 20001118;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period, true);
    im.dispose();
}
