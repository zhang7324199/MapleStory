/* 
 * 2431390 - 坐骑 玛瑙猎豹 永久
 */
var period = 90;
var mountSkillId = 80001228;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId);
    im.dispose();
}
