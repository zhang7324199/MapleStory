var quantity = 3000;
var items = [4009440, 4009441, 4009439, 4009449, 4009450, 4009444, 4009453];

function start() {
    if (im.getSpace(3) < 7) {
        im.sendOk("背包空间不足7格");
    } else {
        var text = "已获得下列道具:\r\n\r\n";
        items.forEach(function (item) {
            im.gainItem(item, quantity);
            text += "#i" + item + "##z" + item + "# " + quantity + "个\r\n";
        })
        im.used();
        im.sendOk(text);
    }
    im.dispose();
}