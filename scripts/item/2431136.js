/* 
 * 2431390 - 坐骑 与你相伴阿莉亚 永久
 */
var period = 90;
var mountSkillId = 80001224;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId);
    im.dispose();
}
