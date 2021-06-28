
var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1)
            status++;
        else
            status--;
        if (status == 0) {
            var text = "您好，在这里可以制作140、150的装备，请选择您需要制作的装备类型：\r\n";
            text += "#b#L2100#制作140级防具#l\r\n";
            text += "#b#L2200#制作140级武器#l\r\n";
            text += "#b#L2300#制作150级防具#l\r\n";
            text += "#b#L2400#制作150级武器#l\r\n";
            cm.sendSimple(text);
        } else if (status == 1) {
            cm.dispose();
            cm.openNpc(1530637, selection);
        }
    }
}