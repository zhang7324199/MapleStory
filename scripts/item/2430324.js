/* 
 * 2431390 - 坐骑 机动巡逻车 永久
 */
var period = 90;
var mountSkillId = 80001078;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId);
    im.dispose();
}
