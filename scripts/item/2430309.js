/* 
 * 2431390 - 坐骑 透明蝙蝠怪 永久
 */
var period = 90;
var mountSkillId = 10001154;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId);
    im.dispose();
}
