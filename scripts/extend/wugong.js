var status = 0;
function start() {
var em = cm.getEventManager("wugong");
    if (em == null) {
        cm.sendOk("请联系管理员开通此副本。");
        cm.dispose;
    } else {
        cm.sendNext("你好:请带来给我#v4000463##r#z4000463##k #bX3#k\r\n\r\n#b搏一搏，单车变摩托 ! 付出3个中介币入场.打败这变异蜈蚣妖怪吧.每日可以进一次.\r\n消灭蜈蚣随机100%掉落掉落#r[ 1 ]个到[ 6 ]个#k#v4000463##r#z4000463#\r\n如果你没有3个#v4000463##r#z4000463##k我不能让你进去");
    }
}

function action(mode, type, selection) {
    if (mode == 1) {
		if (cm.getParty()==null||cm.getParty()>=2 ) {
			cm.sendOk("请先自己开个组,而且只能自己一个人.完成后再来跟我说话");
			cm.dispose();
			return;
		}else if(!cm.haveItem(4000463,3)){
			cm.sendOk("请带来给我#v4000463##r#z4000463##k #bX3#k");
			cm.dispose();
			return;
			} else if (cm.getMap(105200122).getCharactersSize() > 0) {
                        cm.sendOk("副本已经在进行中。请等待或者换线后尝试..");
                        cm.dispose();
			return;
			}else if(cm.getPQLog("蜈蚣") == 1){
			cm.sendOk("每天只能进入一次哦!!");
			cm.dispose();
			return;
		}else{
		var em = cm.getEventManager("wugong");
		var prop = em.getProperty("state");
        if  (prop.equals("0") || prop == null) {
            em.startInstance(cm.getPlayer().getParty(), cm.getMap(), 210);
			cm.gainItem(4000463,-3);
			cm.setPQLog("蜈蚣");
            cm.dispose();
            return;
        } else {
            cm.sendOk("里面已经有人开始战斗了。");

        }
	  }
    }
    cm.dispose();
}
