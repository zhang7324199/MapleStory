/* 
 * 2430318 - 坐骑 小龟龟 永久
 */
var period = 90;
var mountSkillId = 10001122;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId);
    im.dispose();
}
