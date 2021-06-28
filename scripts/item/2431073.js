/* 
 * 2431390 - 坐骑 二连跳青蛙 永久
 */
var period = 90;
var mountSkillId = 80001199;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId);
    im.dispose();
}
