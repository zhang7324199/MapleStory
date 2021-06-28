/* 
 * 2431390 - 坐骑 妮娜的魔法阵 永久
 */
var period = 90;
var mountSkillId = 20001118;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId);
    im.dispose();
}
