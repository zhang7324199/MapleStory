/*
 * �޴�ı��� ��ʾȫ����һ��۵�����
 * �˲����� ���ð�յ�����������
 * ��ϵQQ��537050710
 * ��ӭ���Ƹ��ֽű�
 * 2015��7��30�� 17:06:33
 * ���£�memory
 * QQ��52619941
 */
//������
var l = "#fUI/mapleBingo.img/mapleBingo/Gage/leftGage#";
var m = "#fUI/mapleBingo.img/mapleBingo/Gage/middleGage#";
var r = "#fUI/mapleBingo.img/mapleBingo/Gage/rightGage#";
var head = "#fUI/UIWindow2.img/Quest/quest_info/summary_icon/summary#\r\n";
var icon = "#fUI/UIWindow2.img/QuestAlarm/BtQ/normal/0#";
var questIcon = "#fUI/UIWindow2.img/QuestGuide/Button/WorldMapQuestToggle/normal/0#\r\n";
var startIcon = "#fUI/UIWindow2.img/Quest/quest_info/summary_icon/startcondition#\r\n";
var status = 0;
var typed;
var em, eim, itemKey;
var showListLimit = 200;
/*********************************************
 *
 *	@ ����Ϊ�û��Զ����������
 *
 *********************************************/
var needItems = Array(
	//����ID��ÿ�ύ1���ɻ�õĹ��׵�
	Array(4310149, 1),
	Array(4000000, 2),
	Array(4000463, 10)
);
/*********************************************
 *
 *	@ �����¼�����������ٴ���Ʒֹͣ
 *
 *********************************************/
var maxDropTimes = 3; 
/*********************************************
 *
 *	@ ������Ҫ�����������ܼ����¼�
 *
 *********************************************/
var needMaxPoints = 100;
/*********************************************
 *
 *	@ ���ÿ��ܳ��ֵĵ���
 *
 *********************************************/
var itemList = Array(
	Array(4000000, 999),
	Array(4000000, 999)
	/*
	Array(4000463, 300), //��������
	Array(1112915, 300), //������ָ
	Array(2047818, 300), //���˵�˫����������������100%
	Array(2612059, 300), //���˵�˫������ħ������100%
	Array(2046996, 300), //���˵ĵ�����������������100%
	Array(2046997, 300), //���˵ĵ�������ħ������100%
	Array(2049750, 700), //S��Ǳ�ܾ��� 80%
	//Array(2431938, 20), //150������ѡ��
	//Array(2431926, 20), //150���������
	Array(2028175, 600), //�������
	Array(2431354, 600), //�ǻ����
	Array(2049137, 999), //�������������� 20%
	Array(2049136, 999), //�������������� 20%
	Array(2431944, 700), //140
	Array(2431945, 700), //140
	Array(2049323, 300) //����ǿ������*/
);

function start() {
	status = -1;
	action(1, 0, 0);
	//��ʼ������
	if (em.getObjectProperty("_itemList") == null)
		em.setObjectProperty("_itemList", itemList);
	if (em.getProperty("_maxDropTimes") == null)
		em.setProperty("_maxDropTimes", maxDropTimes);
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
			em = cm.getEventManager("ZiyouPaoItem");
			eim = em.getInstance("ZiyouPaoItem");
			if (em == null || eim == null) {
				cm.sendOk("���ڻ��û�п�ʼ����������û�б�������룡\r\n���������Ա�Ĺ��棡��л֧�֣�");
				 cm.dispose();
			} else {
				if (em.getProperty("state") == needMaxPoints) {
					cm.sendOk("�����Ѿ��ۼ���������ֵ����ȴ��������Զ��������棡");
					cm.dispose();
					return;
				}
				if (em.getProperty("dropstart") == "true") {
					cm.sendOk("���������г��Ѿ���ʼ�˶����߻�ˣ����Ժ��ٹ��������㡣");
					cm.dispose();
					return;
				}

				var text = head+ "\t�װ���#r#h0##k����ã��������ﹱ������Ҫ�ļ�Ʒ���Լ���������������ʱ�����������г����������������ϡ�е���Ŷ��\r\n";
				text += startIcon;
				text += "#e#d              Ŀǰ������������                \r\n#n";
				text += "\t\t\t\t#B" + parseInt(parseInt(em.getProperty("state")) / needMaxPoints * 100) + "#\r\n#b";
				text += questIcon;
				text += "#b#L1#"+icon+" ��Ҫ���׼�Ʒ#l\r\n";
				text += "#b#L0#"+icon+" �鿴�ҹ����˶��������㡣#l\r\n";
				//text += "#b#e#L3# �鿴�������а񣡣�#l\r\n";
				//text += "#r#e#L4# >> ���ݹ��׵�һ���Ʒ << #l\r\n"

				if (cm.getPlayer().isGM()) {
					text += "#r#e#L999#"+icon+" #e�������������㣨����Ա�ɼ���#n#k#l\r\n";
					text += "#r#e#L998#"+icon+" #eˢ�����ݡ��޸Ĺ����ʺʹ���ʱʹ�á�#n#k#l\r\n";
				}

				cm.sendSimple(text);

			}
		} else if (status == 1) {
			if (selection == -1)
				selection = typed;
			if (selection == 4) {
				cm.dispose();
				cm.openNpc(cm.getNpc(), 1);
			} else if (selection == 3) {
				//Ranking();
				cm.sendSimple("xxoo");
				status = -1;
			} else if (selection == 1) {
				typed = 1;
				var text = "��ѡ����Ҫ���׵ĵ��ߣ�\r\n";
				for(var i in needItems) {
					var itemid = needItems[i][0];
					var points = needItems[i][1];
					text += "#L"+i+"##v"+itemid+"##b#t"+itemid+"# #dÿ�ύ1���ɻ��#r"+points+"#d���׵�#l\r\n";
				}
				cm.sendSimple(text);
			} else if (selection == 999) {
				em.setProperty("state", "0");
				cm.sendOk("���óɹ���");
				status = -1;
			} else if (selection == 998) {
				var text = "";
				text += "��Ʒ�������ݣ�#bˢ�³ɹ���#k\r\n";
				em.setObjectProperty("_itemList", itemList);
				text += "���������ݣ�#bˢ�³ɹ���#k";
				em.setProperty("_maxDropTimes", maxDropTimes);
				cm.sendOk(text);
				cm.dispose();
				return;
				status = -1;
			} else {
				cm.sendNext("�װ���#e#h0##nð�ռң�\r\n#d����Ŀǰ��һ��������#r#e" + cm.getBossLog("���ع��׵�", 1) + "#d#n�����㣡");
				status = -1;
			}
		} else if (status == 2) {
			itemKey = selection;
			var item = needItems[selection];
			var maxQuantity = Math.ceil((needMaxPoints-parseInt(em.getProperty("state"))) / item[1]);
			var text = "��ǰ�����㣺#r"+parseInt(em.getProperty("state"))+"#k ��\r\n";
			text += "����ǰ�� #r"+cm.getItemQuantity(item[0])+ " #k��#b#t"+item[0]+"#\r\n";
			text += "#k��������Ҫ���׵ĵ���������\r\n";
			cm.sendGetNumber(text, 0, 1, maxQuantity)
		} else if (status == 3) {
			if (selection == 0) {
				cm.sendNext("������һ������0������");
				status = -1;
			} else if (cm.getItemQuantity(needItems[itemKey][0]) >= selection) {
				var currentPoints = selection * needItems[itemKey][1];
				var points = parseInt(em.getProperty("state")) + currentPoints;
				em.setProperty("state", points);
				cm.sendOk("���׳ɹ���Ŀǰ����ȫ��������������Ϊ��" + em.getProperty("state") + "��\r\n��������Ŭ���ɣ���");
				status = -1;
				gainCP(currentPoints);
				cm.gainItem(needItems[itemKey][0], -selection);
				
				//���������㹻ʱ��������Ʒ�����¼�
				if (points >= needMaxPoints) {
					em.getIv().invokeFunction("startEvent", em);
				}
				
			} else {
				cm.sendOk("�����û���㹻��#b#t" + needItems[itemKey][0] + "##k��\r\n����һ��������");
				status = -1;
			}
		}
	}
}

function gainCP(num) {
	var points = cm.getBossLog("���ع��׵�", 1);
	var conn = Packages.database.DatabaseConnection.getConnection();
	var sql = "UPDATE bosslog SET count = ?, `time` = CURRENT_TIMESTAMP  WHERE bossid = ? AND characterid = ? AND type = 1";
	var pstmt = conn.prepareStatement(sql);
	pstmt.setInt(1, (points + num));
	pstmt.setString(2, "���ع��׵�");
	pstmt.setInt(3, cm.getPlayer().getId());
	pstmt.executeUpdate();
	if (pstmt!=null) pstmt.close();
}