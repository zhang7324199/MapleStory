var status = -1;
var status2 = -1;
var select = -1;
var select2 = -1;
var nowLv = -1;
var questDat = -1;
var questDat = -1;
var rewardLevel = [10, 15, 30, 45, 60, 85, 100];
var rewarditems = [2450042, 2450042, 2450042, 2450042, 2450042, 2450042, 2450042];
var supportLevel = [10, 30, 60, 100];
var supports = [5000137, 5010110, 1182071, 1113020];



function start() {
	im.sendSimple("浣犲ソ, 鎴戞涓烘潵鍒板啋闄╁矝涓栫晫鐨勬柊鍕囧＋鐨勬垚闀垮強瀹氬眳鎻愪緵甯姪銆俓r\n#b#L0#棰嗗彇鎴愰暱鏀彺閬撳叿#l\r\n#L1#杞亴绛夌骇杈炬垚鐗规畩绀肩墿#l\r\n#L2#鍐掗櫓宀涗笘鐣屽悜瀵?l#k");
}

function action(mode, type, selection) {
	if (mode == 1) {
		if (status2 == -1)
			status++;
	} else {
		if (status2 == -1)
			status--;
	}
	if (status == 0) {
		if (select == -1)
			select = selection;
		if (select == 0) {
			im.sendNext("涓轰簡甯姪鍕囧＋浣犳垚闀? 鎴戝噯澶囦簡鍚勭閬撳叿銆?);
			questDat = im.getQuestRecord(99998).getCustomData();
			if (questDat == null)
				questDat = -1;
			else
				questDat = Number(questDat);
		} else if (select == 1) {
			im.sendNext("涓轰簡甯姪杈惧埌杞亴绛夌骇锛?0绾? 30绾? 60绾? 100绾э級鐨勫媷澹垚闀? 鎴戝噯澶囦簡鍚勭閬撳叿銆?);
			questDat = im.getQuestRecord(99999).getCustomData();
			if (questDat == null)
				questDat = -1;
			else
				questDat = Number(questDat);
		} else if (select == 2) {
			im.sendSimple("鎴戜滑瀵逛笉浠呬粎婊¤冻浜庢暀绋嬪唴瀹圭殑鍕囧＋浠噯澶囦簡鐗瑰埆鏉垮潡锛乗r\n鎴戜滑灏嗛€氳繃鐗瑰埆鏉垮潡涓哄ぇ瀹朵粙缁嶇帺鍐掗櫓宀涙椂搴旇鐭ラ亾鐨勫唴瀹广€俓r\n鑾峰緱涓庡嚭鍞亾鍏穃r\n#b#L0#瀹犵墿#l\r\n#L1#鑳屽寘#l\r\n#L2#鑷敱甯傚満#l\r\n#L3#鐚ご楣?l#k\r\n\r\n瑁呭寮哄寲\r\n#b#L4#鏁板瓧寮哄寲#l\r\n#L5#鏄熺骇寮哄寲#l\r\n#L6#娼滆兘锛堥瓟鏂癸級#l#k\r\n\r\n瑁呮壆瑙掕壊\r\n#b#L7#瑙掕壊鏈嶈#l\r\n#L8#鏁村涓庡彂鍨?l#k");
		}
	} else if (status == 1) {
		if (nowLv == -1)
			nowLv = im.getPlayer().getLevel();
		if (select == 0 || select == 1) {
			im.sendNextPrev("褰撳墠鍕囧＋浣犵殑绛夌骇涓?b" + nowLv + "绾?k鍟娿€?);
		} else if (select == 2) {
			xiangDao(mode, type, selection);
		}
	} else if (status == 2) {
		if (select == 0) {
			var can = -1;
			for (var i = questDat; i < rewardLevel.length; i++) {
				if (questDat == -1 && nowLv >= rewardLevel[0]) {
					can = -2;
					break;
				} else if (nowLv >= rewardLevel[i+1] && questDat != i+1) {
					can = i+1;
					break;
				}
			}
			var str = "";
			if (can == -1 || (can == questDat && questDat == 0)) {
				if (nowLv < rewardLevel[0]) {
					im.sendOk("鐜板湪杩樻棤娉曢鍙栦换浣曚笢瑗垮摝銆?);
				} else {
					if (questDat < rewardLevel.length-1) {
						str = "濡傛灉浣犺揪鍒? + rewardLevel[questDat+1] + ";绾? 鎴戝氨缁欎綘;#i;" + rewarditems[questDat+1] + ";##b; #t;" + rewarditems[questDat+1] + ";##k, 璇疯;寰楁潵棰嗗彇鍝?";
					}
					im.sendOk("浣犲凡缁忛鍙栬繃#t" + rewarditems[questDat] + "#浜嗗晩銆? + str);
				}
			} else {
				if (can == -2)
					can = 0;
				if (im.canHold(rewarditems[can])) {
					im.gainItem(rewarditems[can], 1);
					if (questDat < rewardLevel.length-2) {
						str = "濡傛灉浣犺揪鍒? + rewardLevel[can+1] + ";绾? 鎴戜細缁欎綘;#i;" + rewarditems[can+1] + ";##b; #t;" + rewarditems[can+1] + ";##k, 璇疯;寰楁潵棰嗗彇鍝?";
					}
					im.sendOk("浣犳垚鍔熼鍙栦簡#t" + rewarditems[can] + "#銆? + str);
					im.getQuestRecord(99998).setCustomData(can);
				} else {
					im.sendOk("璇风‘璁や綘鐨勮儗鍖呯┖闂存槸鍚﹁冻澶熴€?);
				}
			}
		} else if (select == 1) {
			var can = -1;
			for (var i = questDat - 1; i < supportLevel.length; i++) {
				if (questDat == -1 && nowLv >= supportLevel[0]) {
					can = -2;
					break;
				} else if (nowLv >= supportLevel[i+1] && questDat != i+1) {
					can = i+1;
					break;
				}
			}
			var str = "";
			if (can == -1 || (can == questDat && questDat == 0)) {
				if (nowLv < supportLevel[0]) {
					im.sendOk("鐜板湪杩樻棤娉曢鍙栦换浣曚笢瑗垮摝銆?);
				} else {
					if (questDat < supportLevel.length-1) {
						str = "濡傛灉浣犺揪鍒? + supportLevel[questDat+1] + ";绾? 鎴戝氨缁欎綘;#i;" + supports[questDat+1] + ";##b; #t;" + supports[questDat+1] + ";##k, 璇疯;寰楁潵棰嗗彇鍝?";
					}
					im.sendOk("浣犲凡缁忛鍙栬繃#t" + supports[questDat] + "#浜嗗晩銆? + str);
				}
			} else {
				if (can == -2)
					can = 0;
				if (im.canHold(supports[can])) {
					if (can == 0) {
						im.gainPet(supports[can], "姘告亽鐨凢unMS", 15, 1642, 100, 0, -1);
					} else {
						im.gainItem(supports[can], 1);
					}
					if (questDat < supportLevel.length-2) {
						str = "濡傛灉浣犺揪鍒? + supportLevel[can+1] + ";绾? 鎴戜細缁欎綘;#i;" + supports[can+1] + ";##b; #t;" + supports[can+1] + ";##k, 璇疯;寰楁潵棰嗗彇鍝?";
					}
					im.sendOk("浣犳垚鍔熼鍙栦簡#t" + supports[can] + "#銆? + str);
					im.getQuestRecord(99999).setCustomData(can);
				} else {
					im.sendOk("璇风‘璁や綘鐨勮儗鍖呯┖闂存槸鍚﹁冻澶熴€?);
				}
			}
		}
		im.dispose();
	} else {
		im.dispose();
	}
}

function xiangDao(mode, type, selection) {
	if (mode == 1) {
		status2++;
	} else {
		status2--;
	}

	if (status2 == 0) {
		if (select2 == -1)
			select2 = selection;
		if (select2 == 0) {
			im.sendNext("瀹犵墿鏄疇鐗╃鐞嗗憳绉戞礇浼婂埗浣滃嚭鐨勫彲鐖变紮浼淬€傚疇鐗╃殑浣滅敤鏈夊緢澶氾紝鍙互鑾峰緱閬撳叿锛岃繕鑳戒娇鐢ㄥ鐩婃妧鑳借繘琛岀嫨鐚庛€?);
		} else if (select2 == 1) {
			im.sendNext("閫氳繃鐙╃寧鎬墿鍙婂弬涓庡悇绉嶆椿鍔ㄨ幏寰楃殑閬撳叿锛屽皢浼氳淇濈鍦ㄨ儗鍖呬腑銆?);
		} else if (select2 == 2) {
			im.sendNext("绮惧績鎼滈泦骞舵暣鐞嗙殑閬撳叿銆傚湪鍐掗櫓宀涗笘鐣屽悇涓湴鍖烘椿鍔ㄧ殑鍕囧＋浠綈鑱氬湪涓€璧凤紝杩涜閬撳叿浜ゆ槗鐨勫湴鏂规鏄嚜鐢卞競鍦恒€俓r\n#i3800707#");
		} else if (select2 == 3) {
			im.sendNext("鑷敱甯傚満鐨勮嚜鍗栨満澶浜嗭紝寰堥毦鎵惧埌鎯宠鐨勭墿鍝侊紵閭ｄ箞锛岃鍒╃敤#i5230000# #t5230000#鏉ュ揩閫熸壘鍒拌嚜宸辨兂瑕佺殑閬撳叿鍚с€?);
		} else if (select2 == 4) {
			im.sendNext("寮哄寲鏄粠浣跨敤鍗疯酱鐨勬暟瀛楀己鍖栬€屽紑濮嬬殑銆?);
		} else if (select2 == 5) {
			im.sendNext("鎯宠鍒朵綔鍑鸿緝寮虹殑姝﹀櫒锛岄渶瑕佺粡杩囧悇绉嶈瘯鐐笺€傛垜灏嗕负浣犺鏄庡己鍖栫殑鏈€鍚庨樁娈?-鏄熺骇寮哄寲锛岃浠旂粏鍚ソ銆?);
		} else if (select2 == 6) {
			im.sendNextPrev("鎴戝皢涓轰綘璇存槑涓嬪己鍖栦箣鑺?-娼滆兘锛?);
		} else if (select2 == 7) {
			im.sendNextPrev("浣犳兂鍙樺緱涓庡叾浠栧媷澹笉鍚岋紝鐪嬭捣鏉ユ洿鏈変釜鎬э紵");
		} else if (select2 == 8) {
			im.sendNextPrev("鏃跺皻鐨勯噸鐐瑰綋鐒舵槸鑴歌泲鍟︼紒");
		}
	} else if (status2 == 1) {
		if (select2 == 0) {
			im.sendNextPrev("瀹犵墿鑳藉府蹇欐嬀鍙栨€墿鎺夎惤鐨勯亾鍏凤紝骞舵惉杩愬埌浣犵殑鑳屽寘涓€俓r\n瀛︿細鐗规畩鎶€鑳界殑瀹犵墿鍙互甯綘浣跨敤鑽按锛屽苟涓嶆柇鏂藉睍澧炵泭鎶€鑳姐€俓r\n#i3800701#");
		} else if (select2 == 1) {
			im.sendNextPrev("浣犲凡缁忛€氳繃鏁欑▼浜嗚В鍒拌儗鍖呯殑鍩烘湰鎯呭喌浜嗗惂锛焅r\n鎴戞潵涓轰綘璇存槑涓嬭儗鍖呯殑鍚勭鍔熻兘鍚с€?);
		} else if (select2 == 2) {
			im.sendNextPrev("鑷敱甯傚満閭ｉ噷鏈夊緢澶氭埧闂达紝浣犲彲浠ュ湪鍚勬埧闂村唴寮€鍚嚜鍗栨満鍑哄敭鐗╁搧锛屾垨鑰呭埌鍏朵粬鍕囧＋鐨勮嚜鍗栨満閭ｉ噷璐拱鎯宠鐨勭墿鍝併€俓r\n#i38007078");
		} else if (select2 == 3) {
			im.sendNextPrev("浣犲彲浠ュ湪鍟嗗煄涓殑#b#e鍟嗗簵#k#n閫夐」涓嬭繘琛岃喘涔般€俓r\n#i3800710#");
		} else if (select2 == 4) {
			im.sendNextPrev("鐐瑰嚮鑳屽寘涓殑瑁呭寮哄寲鎸夐挳锛岀劧鍚庡皢鍗疯酱鍜岃澶囨斁涓婂幓鍚с€俓r\n#i3800712#");
		} else if (select2 == 5) {
			im.sendNextPrev("浣犲彲浠ヤ娇鐢?i2049301# #t2049301#锛屽鍙崌绾ф鏁颁负0鐨勮澶囪繘琛屾槦绾у己鍖栥€?);
		} else if (select2 == 6) {
			im.sendNextPrev("浠ユ瀬灏忕殑姒傜巼鍦ㄩ噹澶栬幏寰楄璧嬩簣娼滆兘鐨勮澶囨椂锛屾垨鑰呬娇鐢?i2049401# #t2049401#涓篶绾ц澶囪祴浜堟綔鑳芥椂锛屽皢浼氬紩鍑鸿澶囦腑闅愯棌鐨勫姏閲忋€?);
		} else if (select2 == 7) {
			im.sendNextPrev("鎵嬫嬁楂樼瓑绾ц澶囩湅璧锋潵寰堜笉閿欙紝浣嗚韩鐫€缇庝附鏈嶈鐨勫媷澹湅璧锋潵鏇村姞寮曚汉娉ㄧ洰銆?.濡傛灉鎯虫妸瑙掕壊瑁呮壆寰楁洿濂界湅锛岄偅灏卞湪鍟嗗煄鏈嶈閫夐」鎴栫ぜ鍖呮湇瑁呴€夐」涓嬭繘琛岃喘涔板惂銆俓r\n#i3800718#");
		} else if (select2 == 8) {
			im.sendNextPrev("璇烽€氳繃鍙戝瀷/鏁村鏉ヨ瑙掕壊鍙樺緱鏇存椂灏氬惂銆俓r\n璇峰湪鎸佹湁#i5152053# #t5152053#, #i5150040# #t5150040#涔嬬被閬撳叿鐨勬儏鍐典笅锛屽幓鏉戝簞涓殑鏁村舰澶栫鎴栫編瀹归櫌鐪嬬湅鍚с€?);
		}
	} else if (status2 == 2) {
		if (select2 == 0) {
			im.sendNextPrev("濡傛灉鎯充簡瑙ｅ疇鐗╃殑璇︾粏鎯呮姤锛屽彲浠ュ湪瑙掕壊淇℃伅鏍忔垨鑰呰澶囨爮鐨勫疇鐗╂爣绛句腑杩涜鏌ョ湅銆俓r\n#i3800702#");
		} else if (select2 == 1) {
			im.sendNextPrev("棣栧厛鏄墿灞曡儗鍖呫€傛墦寮€鑳屽寘浣犱細鍙戠幇鑳屽寘涓彧鏈?4涓┖鏍笺€傜偣鍑?b#e鎵╁睍鑳屽寘#k#n鎸夐挳锛屼綘灏辫兘涓€涓嬪瓙鐪嬪埌96涓┖鏍笺€俓r\n#i3800703#");
		} else if (select2 == 2) {
			im.sendNextPrev("涓轰簡寮€鍚嚜鍗栨満锛屽彲浠ュ埌鍟嗗煄鐨勬父鎴? 鍟嗗簵閫夐」涓嬶紝璐拱鑷崠鏈哄紑鍚鍙瘉鎴栬€呰喘涔伴泧浣ｅ晢浜恒€俓r\n 鍦ㄤ粩缁嗛槄璇婚亾鍏疯鏄庡悗锛岃喘涔扮鍚堜綘鎰忓浘鐨勮嚜鍗栨満灏辫鍟︼紒\r\n#i3800709#");
		} else if (select2 == 3) {
			im.sendNextPrev("濡傛灉浣跨敤璐拱鐨勭尗澶撮拱閬撳叿锛屾悳绱㈡兂瑕佽喘涔版垨鑰呭嚭鍞殑閬撳叿锛岃繕鑳芥壘鍒拌閬撳叿鐨勪环鏍间笌浣嶇疆銆俓r\n#i3800711#");
		} else if (select2 == 4) {
			im.sendNextPrev("纭涓嬫鍣ㄥ拰鍗疯酱鏄惁宸茬粡娣诲姞鍒拌澶囧己鍖栨爮锛岀劧鍚庣偣鍑诲崌绾ф寜閽紝灏辫兘杩涜寮哄寲浜嗭紒\r\n#i3800713#");
		} else if (select2 == 5) {
			im.sendNextPrev("瑁呭寮哄寲鍗疯酱鐨勪娇鐢ㄦ柟寮忎笌鏁板瓧寮哄寲鏃剁浉鍚屻€?);
		} else if (select2 == 6) {
			im.sendNextPrev("琚祴浜堟綔鑳界殑瑁呭绛夌骇鍙垎涓築~SS4绾э紝瑁呭鎻愮ず缁勪欢涓嬫柟灏嗕細鏍囨敞琚祴浜堢殑娼滆兘銆?);
		} else if (select2 == 7) {
			im.sendNextPrev("浣犲彧瑕佸湪鑳屽寘鐨勭壒娈婃爮涓┛涓婃墍璐拱鐨勮澶囧氨琛屼簡銆傜┛涓婄壒娈婅澶囧悗锛岃澶囨爮涓殑閬撳叿浼氳鑷姩鎹笅銆俓r\n#i3800719#");
		} else if (select2 == 8) {
			im.sendNextPrev("鍚#p1012117#鏄啋闄╁矝涓栫晫鏈€妫掔殑缇庡甯堝憿~\r\n#i3800720#");
		}
	} else if (status2 == 3) {
		if (select2 == 0) {
			im.sendNextPrev("瀹犵墿銆佸疇鐗╄澶囧拰瀹犵墿鎶€鑳藉彲浠ュ湪鍟嗗煄鐨勫疇鐗╅€夐」涓嬭繘琛岃喘涔般€?);
		} else if (select2 == 1) {
			im.sendNextPrev("灏卞儚杩欐牱銆俓r\n #i3800704#\r\n鏄剧ずX鐨勯儴鍒嗕负鏃犳硶浣跨敤鐨勭┖闂淬€?);
		} else if (select2 == 2) {
			im.dispose();
		} else if (select2 == 3) {
			im.sendNextPrev("杩樻湁鏇磋仾鏄庣殑#i5230003# #t5230003#锛屼綘鍙互鍙傝€冧竴涓嬨€?);
		} else if (select2 == 4) {
			im.sendNextPrev("鍙湁褰撹澶囩殑鍙崌绾ф鏁板ぇ浜?鏃讹紝鎵嶈兘杩涜鏁板瓧寮哄寲銆傛瘡娆″崌绾ф椂锛屽彲鍗囩骇娆℃暟鍑忓皯1娆°€?);
		} else if (select2 == 5) {
			im.sendNextPrev("濡傛灉鏄熺骇寮哄寲鎴愬姛锛岄亾鍏峰悕绉颁笂鏂圭殑鏄熸槦灏变細澧炲銆俓r\n璇疯浣忥紝鍦ㄨ繘琛屾槦绾у己鍖栨椂锛岄亾鍏峰悕绉颁笂鏂圭殑鏄熸槦涓暟瓒婂锛岃兘鍔涘€煎氨瓒婂己锛屼絾鍚屾椂寮哄寲鐨勬垚鍔熺巼灏嗕細闄嶄綆銆俓r\n#i3800715#");
		} else if (select2 == 6) {
			im.sendNextPrev("濡傛灉鎯虫洿鏀硅澶囩瓑绾э紝鎴栬€呮洿鏀硅澶囪璧嬩簣鐨勬綔鑳斤紝鍙互浣跨敤#i5062000# #t5062000#绫诲瀷鐨勯亾鍏枫€傞瓟鏂瑰彲浠ュ湪鍟嗗煄寮哄寲閫夐」涓繘琛岀‘璁ゃ€?);
		} else if (select2 == 7) {
			im.dispose();
		} else if (select2 == 8) {
			im.dispose();
		}
	} else if (status2 == 4) {
		if (select2 == 0) {
			im.sendNextPrev("濡傛灉浣犲瀹犵墿楗插吇鏈変换浣曠枒闂紝鍙互鍘绘壘#m100000200#鐨?p1012005銆備粬鏄疇鐗╃鐞嗗憳锛屽簲璇ヨ兘甯綘瑙ｅ喅寰堝鐤戦棶銆?);
		} else if (select2 == 1) {
			im.sendNextPrev("閫氳繃娲诲姩鑾峰緱鑳屽寘鎵╁睍閬撳叿(#i2430951# #i2430952# #i2430953# #i2430954#)骞朵娇鐢ㄧ殑璇濓紝鍙紑鍚兘澶熸斁鍏ラ亾鍏风殑绌洪棿銆俓r\n浣犱篃鍙互閫氳繃鍟嗗煄寮€鍚儗鍖呯┖闂淬€?);
		} else if (select2 == 3) {
			im.sendNextPrev("褰撹揪鍒?0绾ф椂锛屼负浜嗚浣犺兘閫氳繃#t2342824#鏉ヤ綋楠岀尗澶撮拱閬撳叿锛屾垜灏嗕负浣犲彂鏀?i5230000# #t5230000#鍜?i5230003# #t5230003#锛岃涓嶈蹇樿鏉ラ鍙栧晩锛?);
		} else if (select2 == 4) {
			im.sendNextPrev("寮哄寲鎴愬姛鏃讹紝閬撳叿鍚嶆梺杈圭殑鏁板瓧浼氬澶с€傛墍浠ヨ繖绉嶅己鍖栨墠琚О涓烘槸鏁板瓧寮哄寲銆俓r\n#i3800714#");
		} else if (select2 == 5) {
			im.sendNextPrev("鍟婏紒濡傛灉瀵归亾鍏疯鏄庝腑鏍囨敞鈥滄瀬鐪熲€濈殑瑁呭杩涜鏄熺骇寮哄寲锛岃瑁呭鐨勮兘鍔涘€煎皢浼氬ぇ骞呬笂鍗囥€傚鏋滆幏寰楁瀬鐪熻澶囷紝涓€瀹氳杩涜鏄熺骇寮哄寲鍝︼紒\r\n#i3800716#");
		} else if (select2 == 6) {
			im.sendNextPrev("鍟婏紝濡傛灉浣犺寰楁綔鑳藉彧鏈?涓垨2涓お鍙儨浜嗭紝鍙互鍒╃敤#i2049500# #t2049500#涔嬬被鐨勯亾鍏凤紝灏嗘綔鑳芥渶澶ф彁鍗囪嚦3涓紝璇疯浣忓摝锛乗r\n#i3800717#");
		}
	} else if (status2 == 5) {
		if (select2 == 0) {
			im.sendNextPrev("褰撹揪鍒?0绾ф椂锛屼负浜嗚浣犺兘閫氳繃#t2342824#鍦?澶╁唴浣撻獙瀹犵墿锛屾垜浼氫负浣犲彂鏀?i5000393# #t5000393#锛岃涓嶈蹇樿鏉ラ鍙栧晩锛?);
		} else if (select2 == 1) {
			im.sendNextPrev("鎺ヤ笅鏉ユ槸鏀舵嫝鍜屾暣鐞嗐€傝儗鍖呬腑鎵€鍖哄垎鐨?绫绘爣绛撅紝姣忎釜鏍囩鐨勬渶澶у彲鍒╃敤绌洪棿涓?6涓┖鏍笺€傛敹鎷㈠拰鏁寸悊鐨勪綔鐢ㄥ氨鏄彲浠ヨ閬撳叿鐨勬暣鐞嗗彉寰楁洿鍔犱究鍒┿€?);
		} else if (select2 == 3) {
			im.dispose();
		} else if (select2 == 4) {
			im.sendNextPrev("浣跨敤瀛樺湪鐮村潖姒傜巼鐨勫嵎杞磋繘琛屽己鍖栵紝涓斿己鍖栧け璐ユ椂锛屽ソ涓嶅鏄撴悳闆嗗埌鐨勮澶囧皢浼氭秷澶便€備负浜嗛槻姝㈣繖绉嶄簨鎯呭彂鐢燂紝鍙互浠庡晢鍩庤喘涔?i5064000# #t5064000#锛屽湪杩涜寮哄寲鍓嶄娇鐢紒");
		} else if (select2 == 5) {
			im.dispose();
		} else if (select2 == 6) {
			im.sendNextPrev("鍦?014骞?鏈?鏃ヨ嚦2014骞?鏈?5鏃ヨ繖娈垫椂闂达紝濡傛灉璁块棶#m706040000#锛屽氨鑳介€氳繃宸ㄥぇ榄旀柟閲嶆柊璁剧疆娼滆兘锛岃绉瀬鍙備笌鍚?);
		}
	} else if (status2 == 6) {
		if (select2 == 0) {
			im.dispose();
		} else if (select2 == 1) {
			im.sendNextPrev("鐐瑰嚮鍚戜笂鏀舵嫝鎸夐挳锛岃鏍囩涓嬬殑閬撳叿灏变細浠庡乏涓婃柟寮€濮嬮噸鏂版帓鍒楋紝骞朵笖涓棿涓嶄細鐣欏嚭绌烘牸銆俓r\n#i3800705#");
		} else if (select2 == 4) {
			im.dispose();
		} else if (select2 == 6) {
			im.dispose();
		}
	} else if (status2 == 7) {
		if (select2 == 1) {
			im.sendNextPrev("鍘熸湰鏄剧ず鍚戜笂鎼滈泦鎸夐挳鐨勫湴鏂癸紝鍑虹幇浜嗘寜绉嶇被鎺掑垪鎸夐挳锛屾垜浠幇鍦ㄧ偣鍑讳笅鎸夌绫绘帓鍒楁寜閽惂锛焅r\n璇ユ寜閽兘灏嗙浉鍏虫爣绛句笅鐨勯亾鍏锋寜鐓х浉浼肩殑绉嶇被杩涜鎺掑垪銆傛槸涓嶆槸寰堟柟渚垮晩锛焅r\n#i3800706#");
		}
	} else if (status2 == 8) {
		if (select2 == 1) {
			im.sendNextPrev("璇峰埄鐢ㄨ繖绉嶉殣钘忕殑鍔熻兘锛屾湁鏁堝湴绠＄悊鑳屽寘鍚э紒");
		}
	} else if (status2 == 9) {
		if (select2 == 1) {
			im.sendNextPrev("褰撹揪鍒?0绾ф椂锛屼负浜嗚浣犺兘閫氳繃#t2342824#浜彈鏇村鑳屽寘绌洪棿锛屾垜灏嗕负浣犲彂鏀?i2430952# #t2430952#锛岃涓嶈蹇樿鏉ラ鍙栧晩锛?);
		}
	} else if (status2 == 10) {
		if (select2 == 1) {
			im.dispose();
		}
	} else {
		status2 = -1;
	}
}
