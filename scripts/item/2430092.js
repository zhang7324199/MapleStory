/* 
 * 坐骑 白雪人 7天
 */
var period = 7;
var mountSkillId = 80001024 ;

function start() {
    im.giveMountSkill(im.getItem(), mountSkillId, period, true);
    im.dispose();
}
