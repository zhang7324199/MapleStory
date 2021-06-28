/* 
 * 2431390 - 坐骑 蝙蝠怪 永久
 */
var period = 90;
var mountSkillId = 20001153;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId);
    im.dispose();
}
