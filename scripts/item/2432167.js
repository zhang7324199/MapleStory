/* 
 * 2432167 - 坐骑 蝙蝠骑宠 永久
 */
var period = -1;
var mountSkillId = 80001403;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period);//, true);
    im.dispose();
}
