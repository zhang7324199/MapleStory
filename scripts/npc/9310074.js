/*
 * 玩家贩卖点装 装备 系统
 * 奇幻冒险岛工作室制作
 * 更新时间：2015年7月24日 15:20:09
 * 新增内容：管理员可自定义上传道具
 * 新增内容：管理员可查看几天内销售情况
 * 新增内容：管理员可查看最新100条购买日志
 */
var status = 0;
var backupmode = 0;
var EquipStat = [];
var EquipStatFromData = [];
var itemid;
var TradeId;
var TradePrice;
var TradeItem;
var TradeMod;
var TradeCid;
var tradetype;
var itemposition;
var canbuy = false;
var s;//防止目录错乱
var ItemPrice;
var TradeData;
var blockItem = Array(4000001);
var giveback = [];
var newItemList;
var indexSearch = false;
var chooseType;

var aaa = "#fUI/UIWindow4/PQRank/rank/gold#";
var xxx = "#fUI/UIWindow.img/Shop/meso#";
var eff4 = "#fUI/Basic/BtHide3/mouseOver/0#";

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (status >= 0 && mode == 0) {
        //cm.sendOk("祝您游戏愉快!!!");
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    } else {
        status--;
    }
    if (status == 0) {
        CheckData();//检查数据完整
        var text = "#e#d├───────── 寄售系统 ────────┤#n#k\r\n你目前拥有 【#r" + cm.getPlayer().getCSPoints(1) + "#k】 点卷\r\r你目前拥有 【#r " + cm.getHyPay(1) + "#k】余额\r\n";
        text += "#L0# " + eff4 + " #e#r查看所有寄售装备#n#k#l  #L4# " + eff4 + " #e#r一键搜索道具编号#n\r\n\r\n";
        text += "#L1# " + xxx + " #e#d我要上架我的装备#n#k#l\r\n\r\n"; //OK
        text += "#L2# " + aaa + " #e个人寄售管理#n#k#l\r\n\r\n";
        text += "    #e#dPS:月底下架所有寄售装备转存到您的仓库#n#k\r\n";
        text += "           #e#dPS:个人寄售管理-我的仓库#n#k\r\n";
        if (cm.getPlayer().isGM()) {
            text += "#r#e#L3# " + eff4 + " #e管理员操作后台#n#k#l\r\n";
        }
        cm.sendSimple(text);
    } else if (status == 1) {
        switch (selection) {
            case 0://查看目前所有交易
                s = 0;//防止目录错乱
                status = 7;
                var text = "以下是目前的交易信息：\r\n#b ";
                var i = 0;
                var AllRecord = cm.getConnection().prepareStatement("SELECT id,cid,itemid,itemPrice,tradeType FROM cashtradesystem").executeQuery();

                while (AllRecord.next()) {//得到记录数据
                    if (AllRecord.getString("tradeType") == 1) {//点卷
                        text += "\r\n#L" + AllRecord.getString("id") + "#[编号#r" + AllRecord.getString("id") + "#b]  #v" + AllRecord.getString("itemid") + "#  #t" + AllRecord.getString("itemid") + "##l  #r(" + AllRecord.getString("itemPrice") + ")#b点卷"
                    } else if (AllRecord.getString("tradeType") == 2) {//余额
                        text += "\r\n#L" + AllRecord.getString("id") + "#[编号#r" + AllRecord.getString("id") + "#b]  #v" + AllRecord.getString("itemid") + "#  #t" + AllRecord.getString("itemid") + "##l  #d(" + AllRecord.getString("itemPrice") + ")#b余额"
                    } else {
                        text += "\r\n#L" + AllRecord.getString("id") + "#[编号#r" + AllRecord.getString("id") + "#b]  #v" + AllRecord.getString("itemid") + "#  #t" + AllRecord.getString("itemid") + "##l  (" + AllRecord.getString("itemPrice") + ")金币"
                    }
                    if (AllRecord.getString("cid") == -1) {//如果是管理员添加的
                        text += "#r特供~#b"
                    }
                    i++;
                }
                if (text == "以下是目前的交易信息：\r\n#b ") {
                    cm.sendOk("目前暂时没有任何交易发起。");
                    cm.dispose();
                } else {
                    cm.sendSimple(text);
                }
                break;
            case 1://发起我的交易1
                if (cm.getBossLogAcc("寄售系统") >= 10) {
                    cm.sendOk("对不起，一个帐号一天只能寄售10次。");
                    cm.dispose();
                } else {
                    var text = "请选择您要发起交易的类型：\r\n";
                    text += "#L0# 装备#l";
                    text += "#L2# 消耗栏道具#l";
                    text += "#L3# 设置栏道具#l";
                    cm.sendSimple(text);
                }
                break;
            case 2:
                s = 0;
                status = 10;
                var text = "你好，欢迎来到个人管理中心。#b\r\n#L0# " + eff4 + " #e#r查看我的寄售。#n#k#l\r\n\r\n#L1# " + xxx + " #e#d下架我寄售的商品#n#k#l\r\n\r\n#L2# " + xxx + " #e查贩卖点卷或余额#n#k#l\r\n\r\n#L3# " + xxx + " #e#d我的仓库【#r月底未出售道具将转存在此仓库里#k】#n#k#l";
                cm.sendSimple(text);
                break;
            case 3://管理员后台
                cm.dispose();
                cm.openNpc(9900004, 27);
                break;
            case 4://检索功能
                status = 7;
                indexSearch = true;
                cm.sendGetNumber("请输入你要检索的寄售编号。", 0, 1, 9999999);
                break;
            default:
                cm.dispose();
                break;
        }
    } else if (status == 2) {//发起我的交易2
        chooseType = selection;
        switch (selection) {
            case 0://装备
                var i = 0;
                var list = cm.getInventory(1).list();
                var itemList = list.iterator();
                var text = "请选择你想要交易的道具：\r\n#b";
                position = -1;
                newItemList = Array();
                while (itemList.hasNext()) {
                    var item = itemList.next();
                    newItemList[item.getPosition()] = item.getItemId();
                    i++;
                }
                if (i == 0) {
                    cm.sendOk("对不起，您的装备现在没有装备，无法操作。");
                    cm.dispose();
                } else {
                    for (var key in newItemList) {
                        text += "#L" + key + "# #v" + newItemList[key] + "# #t" + newItemList[key] + "#\r\n";
                    }
                    s = 1;
                    cm.sendSimple(text);
                    /*
                     if (cm.getEquipBySlot(1) == null) {
                     cm.sendOk("请把需要交易的装备放在第一个格子里面。\r\n并且确保是否是现金道具。");
                     cm.dispose();
                     } else {
                     itemid = parseInt(selection);
                     s = 1;
                     status = 4;
                     cm.sendNext("您要寄售的道具为：#v" + cm.getEquipBySlot(1).getItemId() + "#  #t" + cm.getEquipBySlot(1).getItemId() + "#吗？");
                     }
                     */
                }
                break;
            case 3://道具
            case 2:
                s = 2;
                var i = 0;
                var list = cm.getInventory(chooseType).list();
                var itemList = list.iterator();
                var text = "请选择你想要交易道具：\r\n#b";
                position = -1;
                newItemList = Array();
                while (itemList.hasNext()) {
                    var item = itemList.next();
                    newItemList[item.getPosition()] = item.getItemId();
                    i++;
                }
                if (i == 0) {
                    cm.sendOk("对不起，您所选背包栏目现在没有物品，无法操作。");
                    cm.dispose();
                } else {
                    for (var key in newItemList) {
                        text += "#L" + key + "# #v" + newItemList[key] + "# #t" + newItemList[key] + "#\r\n";
                    }
                    s = 2;
                    cm.sendSimple(text);
                }
                break;
        }
    } else if (status == 3) {
        if (s == 1) {//贩卖装备
            if (position == -1)
                position = selection;
            if (position != -1) {
                if (cm.getEquipBySlot(position).getFlag() == 1) {
                    cm.sendOk("对不起，上锁的道具不能被贩卖。");
                    cm.dispose();
                    return;
                }
                if (cm.getNX(1) < 1000) {
                    cm.sendOk("对不起，你的点券少于1000点不能上架。");
                    cm.dispose();
                    return;
                }
                if (cm.getEquipBySlot(position).getExpiration() > 0) {
                    cm.sendOk("对不起，有时间限制的道具不能上架。");
                    cm.dispose();
                    return;
                }
                s = 1;
                status = 4;
                cm.sendNext("您要寄售的道具为：#v" + cm.getEquipBySlot(position).getItemId() + "#  #t" + cm.getEquipBySlot(position).getItemId() + "#吗？\r\n上架需要1000点券的手续费，您确定吗？");
            }
        } else if (s == 2) {//其它道具
           var item = cm.getInventory(chooseType).getItem(selection);
           itemid = item.getItemId();
            if (cm.getNX(1) < 1000) {
                cm.sendOk("对不起，你的点券少于1000点不能上架。");
                cm.dispose();
                return;
            }
            if (item.getExpiration() > 0) {
                cm.sendOk("对不起，有时间限制的道具不能上架。");
                cm.dispose();
                return;
            }
            s = 1;
            status = 4;
            cm.sendNext("您要寄售的道具为：#v" + itemid + "#  #t" + itemid + "#吗？\r\n上架需要1000点券的手续费，您确定吗？");
        }
    } else if (status == 4) {
        if (cm.haveItem(itemid)) {
            ItemPrice = selection;
            var insertItemData = cm.getConnection().prepareStatement("INSERT INTO cashtradesystem(id,cid,itemid,itemtype,tradeType,itemprice) values (?,?,?,?,?,?)");
            insertItemData.setString(1, null); //载入记录ID
            insertItemData.setString(2, cm.getPlayer().getId()); //cid
            insertItemData.setString(3, itemid); //itemid
            insertItemData.setString(4, 1); //itemtype  1是普通道具
            insertItemData.setString(5, tradetype); //tradeType    0金币 1点券 2抵用
            insertItemData.setString(6, ItemPrice); //price
            insertItemData.executeUpdate(); //更新
            cm.gainItem(itemid, -1);
            cm.sendOk("你已经载入了您的交易信息。\r\n现在交易道具已经转存到交易库中。");
            cm.dispose();
        } else {
            cm.sendOk("对不起，你没有此道具！不能贩卖。");
            cm.dispose();
        }
    } else if (status == 5) {
        if (s == 1) {
            s = 1;
            cm.sendSimple("请选择交易的类型：\r\n#L0# " + xxx + " #e#d金币#n#k 【收取卖家%5税】#l \r\n\r\n#L1# " + xxx + " #e#d点券#n#k 【收取卖家%5税】#l \r\n\r\n#L2# " + xxx + " #e#r余额#n#k 【收取卖家%2税】#l");
        } else {
            cm.dispose();
        }
    } else if (status == 6) {
        tradetype = selection;
        if (chooseType == 2 || chooseType == 3) {
            status = 3;
        }
        if (s == 1) {
            if (selection == 1) {
                cm.sendGetNumber("请输入您想要贩卖的价格：", 0, 1000, 2100000000);
            } else {
                cm.sendGetNumber("请输入您想要贩卖的价格：", 0, 10, 2100000000);
            }
        } else {
            cm.dispose();
        }
    } else if (status == 7) {
        ItemPrice = selection;
        var insertEquipData = cm.getConnection().prepareStatement("INSERT INTO cashtradesystem(id,cid,itemid,itemtype,str,dex,ints,luk,hp,mp,watk,matk,wdef,mdef,acc,avoid,speed,jump,upgradeSlots,limitBreak,potential1,potential2,potential3,potential4,potential5,potential6,enhance,reqLevel,yggdrasilWisdom,bossDamage,ignorePDR,totalDamage,allStat,karmaCount,tradeType,itemPrice,hands,ViciousHammer,ItemEXP,sealedlevel,sealedExp,Owner,level,expiredate) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"); // 载入数据
        getEquipStatToArray(); //得到装备的数据
        insertEquipData.setString(1, null); //载入记录ID
        insertEquipData.setString(2, cm.getPlayer().getId()); //cid
        insertEquipData.setString(3, cm.getEquipBySlot(position).getItemId()); //itemid
        insertEquipData.setString(4, 0); //itemtype
        for (var i = 5; i < 35; i++) {
            insertEquipData.setString(i, EquipStat[i - 5]); //status
        }
        insertEquipData.setString(35, tradetype); //tradetype
        insertEquipData.setString(36, ItemPrice);

        //后期增加的属性
        insertEquipData.setString(37, EquipStat[30]);
        insertEquipData.setString(38, EquipStat[31]);
        insertEquipData.setString(39, EquipStat[32]);

        insertEquipData.setString(40, EquipStat[33]);
        insertEquipData.setString(41, EquipStat[34]);
        insertEquipData.setString(42, EquipStat[35]);
        insertEquipData.setString(43, EquipStat[36]);
        insertEquipData.setString(44, EquipStat[37]);
        insertEquipData.executeUpdate(); //更新
        cm.removeSlot(1, position, 1); //删除掉原始道具
        cm.sendNext("你已经载入了您的交易信息。\r\n现在交易道具已经转存到交易库中。\r\n收取了您1000点券的手续费。");
        cm.gainNX(-1000);//手续费1000点券
        status = -1;
    } else if (status == 8) {
        var text = "";
        var i = 0;
        TradeId = selection;//得到交易号
        TradeData = cm.getConnection().prepareStatement("SELECT * FROM cashtradesystem").executeQuery();
        if (indexSearch) {
            text += " - 以下是您检索到的讯息：\r\n"
        }
        while (TradeData.next()) {//得到记录数据
            if (TradeData.getString("id") == TradeId) {
                i++;
                TradeItem = TradeData.getString("itemid");
                TradeMode = TradeData.getString("itemtype");
                TradePrice = TradeData.getString("itemprice");
                TradeCid = TradeData.getString("cid");
                getEquipStatFormData();//从数据库中得到数据
            }
        }
        if (i == 0) {
            cm.sendNext("对不起，没有检索到编号对应的数据。");
            return;
        }//未检索到
        if (TradeMode == 0) {//装备
            var ii = cm.getItemInfo();
            toDrop = ii.randomizeStats(ii.getEquipById(TradeItem)).copy(); // 生成一个Equip类(生成这个装备)
            if (EquipStatFromData[31] == 0) {
                text += "#e#d它的价格是：#r" + EquipStatFromData[30] + "#d 金币,点击下一步进行购买.#n\r\n";
            } else if (EquipStatFromData[31] == 1) {
                text += "#e#d它的价格是：#r" + EquipStatFromData[30] + "#d 点券,点击下一步进行购买.#n\r\n";
            } else if (EquipStatFromData[31] == 2) {
                text += "#e#d它的价格是：#r" + EquipStatFromData[30] + "#d 余额,点击下一步进行购买.#n\r\n";
            }
            text += "#d#e装备名称#n： #r#e#t" + TradeItem + "##d 装备图片 [#v" + TradeItem + "#]\r\n装备属性如下：【购买时注意装备包袱留空格】\r\n#n#b";
            text += "已升级次数：" + EquipStatFromData[38] + "\r\n";
            text += "可升级次数：" + EquipStatFromData[14] + " 已强化：" + EquipStatFromData[22] + "\r\n";
            text += "力量：" + EquipStatFromData[0] + "    敏捷：" + EquipStatFromData[1] + "    智力：" + EquipStatFromData[2] + "    运气：" + EquipStatFromData[3] + "\r\n";
            text += "物攻：" + EquipStatFromData[6] + "    魔攻：" + EquipStatFromData[7] + "";
            text += "    物防：" + EquipStatFromData[8] + "    魔防：" + EquipStatFromData[9] + "\r\n";
            text += "HP：" + EquipStatFromData[4] + "      MP：" + EquipStatFromData[5] + "\r\n";
            text += "命中率：" + EquipStatFromData[10] + "      回避率：" + EquipStatFromData[11] + "\r\n";
            text += "移动速度：" + EquipStatFromData[12] + "    跳跃力：" + EquipStatFromData[13] + "\r\n";
            text += "破攻上限突破：" + EquipStatFromData[15] + "\r\n";
            text += "潜能1：" + ii.resolvePotentialId(TradeItem, EquipStatFromData[16]) + "\r\n";
            text += "潜能2：" + ii.resolvePotentialId(TradeItem, EquipStatFromData[17]) + "\r\n";
            text += "潜能3：" + ii.resolvePotentialId(TradeItem, EquipStatFromData[18]) + "\r\n";
            text += "附加潜能1：" + ii.resolvePotentialId(TradeItem, EquipStatFromData[19]) + "\r\n";
            text += "附加潜能2：" + ii.resolvePotentialId(TradeItem, EquipStatFromData[20]) + "\r\n";
            text += "附加潜能3：" + ii.resolvePotentialId(TradeItem, EquipStatFromData[21]) + "\r\n";
            text += "BOSS额外攻击力加成：" + EquipStatFromData[25] + "\r\n";
            text += "回避百分比加成：" + EquipStatFromData[26] + "\r\n";
            text += "总伤害加成：" + EquipStatFromData[27] + "\r\n";
            text += "全属性加成：" + EquipStatFromData[28] + "\r\n";
            text += "封印解除阶段：" + EquipStatFromData[35] + "\r\n";
            text += "封印解除经验值：" + EquipStatFromData[36] + "/113723136\r\n";

        } else {
            text += "\r\n[#v" + TradeItem + "#] #t" + TradeItem + "#\r\n\r\n#b";
        }

        s = 1;
        cm.sendNext(text);
        status = 14;
    } else if (status == 9) {//交易讯息
        if (s == 1) {
            if (BuyCheckDataAgain()) {
                // if (cm.getEquipBySlot(1) == null) {
                if (cm.getSpace(1) < 1) {
                    cm.sendOk("对不起，请让你的装备栏至少腾出一格！");
                    cm.dispose();
                    return;
                }
                if (parseInt(EquipStatFromData[31]) == 0) {
                    if (cm.getMeso() >= TradePrice) {
                        cm.gainMeso(-TradePrice);
                        if (TradeMode == 0) {
                            if (cm.getSpace(1) >= 1) {
                                UpdateData(TradeCid, TradePrice, 0, 0);
                                MakeEquip();
                                setLog(TradeId);//载入Log
                                cm.sendOk("恭喜你购买成功！");

                                DeleteDataById(TradeId);
                                cm.dispose();
                            }
                        } else {
                            UpdateData(TradeCid, TradePrice, 0, 0);
                            cm.gainItem(TradeItem, 1);
                            cm.sendOk("恭喜你购买成功！");
                            setLog(TradeId);//载入Log

                            DeleteDataById(TradeId);
                            cm.dispose();
                        }
                    } else {
                        cm.sendOk("对不起，你没有足够的金币。");
                        cm.dispose();
                    }
                } else if (parseInt(EquipStatFromData[31]) == 1) {
                    if (cm.getNX(1) >= TradePrice) {
                        cm.gainNX(1, -TradePrice);
                        if (TradeMode == 0) {
                            if (cm.getSpace(1) >= 1) {
                                UpdateData(TradeCid, 0, TradePrice, 0);
                                MakeEquip();
                                cm.sendOk("恭喜你购买成功！");
                                setLog(TradeId);//载入Log
                                DeleteDataById(TradeId);
                                cm.dispose();
                            }
                        } else {
                            UpdateData(TradeCid, 0, TradePrice, 0);
                            cm.gainItem(TradeItem, 1);
                            cm.sendOk("恭喜你购买成功！");
                            setLog(TradeId);//载入Log
                            DeleteDataById(TradeId);
                            cm.dispose();
                        }
                    } else {
                        cm.sendOk("对不起，你没有足够的点券。\r\n你目前拥有 【#r" + cm.getPlayer().getCSPoints(1) + "#k】 点卷");
                        cm.dispose();
                    }
                } else if (parseInt(EquipStatFromData[31]) == 2) {
                    if (cm.getHyPay(1) >= TradePrice) {
                        cm.addHyPay(TradePrice);
                        if (TradeMode == 0) {
                            if (cm.getSpace(1) >= 1) {
                                UpdateData(TradeCid, 0, 0, TradePrice);
                                MakeEquip();
                                cm.sendOk("恭喜你购买成功！");
                                setLog(TradeId);//载入Log
                                DeleteDataById(TradeId);
                                cm.dispose();
                            }
                        } else {
                            UpdateData(TradeCid, 0, 0, TradePrice);
                            cm.gainItem(TradeItem, 1);

                            cm.sendOk("恭喜你购买成功！");
                            setLog(TradeId);//载入Log
                            DeleteDataById(TradeId);
                            cm.dispose();
                        }
                    } else {
                        cm.sendOk("对不起，你没有足够的余额。\r\n你目前拥有 【#r " + cm.getHyPay(1) + "#k】 余额");
                        cm.dispose();
                    }
                } else {
                    // cm.sendOk(EquipStatFromData[31]);
                    cm.dispose();
                }
            } else {
                cm.sendOk("选择的道具已经被其他玩家先手一步买走了哦！");
                cm.dispose();
            }
        } else {
            cm.dispose();
        }
    } else if (status == 10) {
        if (s == 1) {
            status = 3;
            tradetype = selection;
            cm.sendGetNumber("请输入您想要贩卖的价格：", 0, 0, 2100000000);
        } else {
            cm.dispose();
        }
    } else if (status == 11) {
        s = 0;
        if (selection == 0) {
            var text = "以下是你的交易信息。\r\n";
            var AllRecord = cm.getConnection().prepareStatement("SELECT id,itemid FROM cashtradesystem where cid = " + cm.getPlayer().getId() + "").executeQuery();
            while (AllRecord.next()) {//得到记录数据
                text += "\r\n #b[编号#r" + AllRecord.getString("id") + "#b]  #v" + AllRecord.getString("itemid") + "#\t#t" + AllRecord.getString("itemid") + "##l\r\n";
                i++;
            }
            if (text == "以下是你的交易信息。\r\n") {
                cm.sendOk("目前暂时没有任何交易发起。");
            } else {
                cm.sendNext(text);
            }

            status = -1;
        } else if (selection == 1) {
            var text = "以下是你的交易信息。\r\n";
            var AllRecord = cm.getConnection().prepareStatement("SELECT id,itemid FROM cashtradesystem where cid = " + cm.getPlayer().getId() + "").executeQuery();
            while (AllRecord.next()) {//得到记录数据
                text += "\r\n#L" + AllRecord.getString("id") + "##b[编号#r" + AllRecord.getString("id") + "#b]  #v" + AllRecord.getString("itemid") + "#\t#t" + AllRecord.getString("itemid") + "##l\r\n";
                i++;
            }
            if (text == "以下是你的交易信息。\r\n") {
                cm.sendOk("目前您没有任何寄售道具。");
                cm.dispose();//结束
            } else {
                s = 1;
                cm.sendSimple(text);
            }

        } else if (selection == 2) {
            var i = 0;
            var text = "以下是你的数据：\r\n";
            var CharRecord = cm.getConnection().prepareStatement("SELECT * FROM TradeSystemGiveBack where cid = " + cm.getPlayer().getId() + "").executeQuery();
            while (CharRecord.next()) {//得到记录数据
                giveback[0] = CharRecord.getString("meso");
                giveback[1] = CharRecord.getString("dianquan");
                giveback[2] = CharRecord.getString("diyong");
                i++;
            }
            if (i == 0) {
                cm.sendOk("暂时还没有你的数据。");
                cm.dispose();
            } else {
                status = 13;
                if (giveback[0] == 0 && giveback[1] == 0 && giveback[2] == 0) {
                    cm.sendOk("目前没有金额可以领取。");
                    cm.dispose();
                } else {
                    cm.sendSimple("现在你可以领回物品：#b\r\n#L0#领回金币(" + giveback[0] + ")  领回点券(" + giveback[1] + ")  领回余额(" + giveback[2] + ")\r\n#e#r全部领取。#k#n#l")
                }
            }
        } else if (selection == 3) {//领取在仓库的道具
            var i = 0;//记录在仓库里面的数据个数
            var text = "目前你在仓库里面的道具：\r\n#d";
            var TradeDataForOwner = cm.getConnection().prepareStatement("SELECT id,itemid FROM cashtradesystemStore where cid = " + cm.getPlayer().getId() + "").executeQuery();
            while (TradeDataForOwner.next()) {//得到记录数据
                i++;
                text += "#L" + TradeDataForOwner.getString("id") + "##b[编号#r" + TradeDataForOwner.getString("id") + "#b]  #v" + TradeDataForOwner.getString("itemid") + "#\t#t" + TradeDataForOwner.getString("itemid") + "# #l\r\n"
            }
            text += "\r\n一共找到了" + i + "条数据。";
            if (i != 0) {
                cm.sendSimple(text);//TODO
                s = 1;
                backupmode = 1;
            } else {
                cm.sendOk("仓库中没有你的数据。");
                cm.dispose();
            }
        }
    } else if (status == 12) {
        if (s == 1) {
            TradeId = selection;//得到交易号
            cm.sendNext("你确定要回收道具并且删除交易信息吗？");
        } else {
            cm.dispose();
        }
    } else if (status == 13) {
        if (backupmode == 1) {
            TradeData = cm.getConnection().prepareStatement("SELECT * FROM cashtradesystemStore").executeQuery();

        } else {
            TradeData = cm.getConnection().prepareStatement("SELECT * FROM cashtradesystem").executeQuery();
        }
        while (TradeData.next()) {//得到记录数据
            if (TradeData.getString("id") == TradeId) {
                TradeItem = TradeData.getString("itemid");
                TradeMode = TradeData.getString("itemtype");
                getEquipStatFormData();//从数据库中得到数据
            }
        }
        if (cm.canHold(TradeItem) /*&& cm.getEquipBySlot(1) == null*/) {
            if (TradeMode == 0) {
                MakeEquip();
                cm.sendOk("撤回成功！");
                cm.dispose();
            } else {
                cm.gainItem(TradeItem, 1);
                cm.sendOk("撤回成功！");
                cm.dispose();
            }
            if (backupmode == 1) {
                DeleteDataByIdForOwn(TradeId);
            } else {
                DeleteDataById(TradeId);
            }
        } else {
            cm.sendOk("请确保你的背包有空间，并且装备栏的第一个空格为空后再试。");
            cm.dispose();
        }
    } else if (status == 14) {
        if (cm.getMeso() + (giveback[0] - giveback[0] * 0.05) > 9999999999 || cm.getNX(1) + (giveback[1] - giveback[1] * 0.05) > 9999999999 || cm.getHyPay(1) + (giveback[2] - giveback[2] * 0.05) > 9999999999) {
            cm.sendOk("领取的金额将会超过最大值，不能领取。");
            cm.dispose();
        } else {
            cm.gainMeso(parseInt(giveback[0] - giveback[0] * 0.05));
            cm.gainNX(1, parseInt(giveback[1] - giveback[1] * 0.05));
            cm.addHyPay(-parseInt(giveback[2] - giveback[2] * 0.02));
            var delectData = cm.getConnection().prepareStatement("delete from TradeSystemGiveBack where cid = " + cm.getPlayer().getId() + "");
            delectData.executeUpdate(); //删除数据
            cm.sendOk("领回成功。");
            cm.dispose();
        }
    } else if (status == 15) {
        status = 8;
        cm.sendYesNo("你确定要购买#v" + TradeItem + "# #t" + TradeItem + "# 吗？");
    } else if (status == 16) {
        TradeId = selection;//得到交易ID
        cm.dispose();
    } else if (status == 17) {

    }

}
function getGiveBackData() {
    var i = 0;
    var data = cm.getConnection().prepareStatement("SELECT * FROM TradeSystemGiveBack where cid = " + TradeCid + "").executeQuery();
    while (data.next()) {//得到记录数据
        giveback[0] = data.getString("meso");
        giveback[1] = data.getString("dianquan");
        giveback[2] = data.getString("diyong");
        i++;
    }
    if (i == 0) {
        var insert = cm.getConnection().prepareStatement("INSERT INTO TradeSystemGiveBack values (?,?,?,?,?)");
        insert.setString(1, null);
        insert.setString(2, cm.getPlayer().getId());
        insert.setString(3, 0);
        insert.setString(4, 0);
        insert.setString(5, 0);
        insert.executeUpdate();
    }
}


function BuyCheckDataAgain() {//购买的时候再次测试是否选择的道具已经是购买成功状态了。
    var i = 0;
    var data = cm.getConnection().prepareStatement("SELECT * FROM cashtradesystem where id = " + TradeId + "").executeQuery();
    while (data.next()) {//得到记录数据
        i++;
    }
    if (i == 0) {
        return false;
    } else {
        return true;
    }
}

function CheckData() {
    var i = 0;
    var data = cm.getConnection().prepareStatement("SELECT * FROM TradeSystemGiveBack where cid = " + cm.getPlayer().getId() + "").executeQuery();
    while (data.next()) {//得到记录数据
        i++;
    }
    if (i == 0) {
        var insert = cm.getConnection().prepareStatement("INSERT INTO TradeSystemGiveBack values (?,?,?,?,?)");
        insert.setString(1, null);
        insert.setString(2, cm.getPlayer().getId());
        insert.setString(3, 0);
        insert.setString(4, 0);
        insert.setString(5, 0);
        insert.executeUpdate();
    }
}

function UpdateData(cid, meso, dianquan, diyong) {
    getGiveBackData();
    var UpDateStatus = cm.getConnection().prepareStatement("update TradeSystemGiveBack set meso=?,dianquan=?,diyong=? where cid =  " + cid + "");
    UpDateStatus.setString(1, parseInt(meso) + parseInt(giveback[0]));
    UpDateStatus.setString(2, parseInt(dianquan) + parseInt(giveback[1]));
    UpDateStatus.setString(3, parseInt(diyong) + parseInt(giveback[2]));
    UpDateStatus.executeUpdate();
}

function DeleteDataById(id) {//删除数据
    var delectData = cm.getConnection().prepareStatement("delete from cashtradesystem where id = " + id + "");
    delectData.executeUpdate(); //删除数据
}

function DeleteDataByIdForOwn(id) {//删除数据
    var delectData = cm.getConnection().prepareStatement("delete from cashtradesystemStore where id = " + id + "");
    delectData.executeUpdate(); //删除数据
}

function MakeEquip() {//制作装备
    var ii = cm.getItemInfo();
    toDrop = ii.randomizeStats(ii.getEquipById(TradeItem)).copy(); // 生成一个Equip类(生成这个装备)
    for (var i = 0; i < 30; i++) {
        setEquipStatRandom(i, EquipStatFromData[i]);
    }
    //新增属性部分
    setEquipStatRandom(30, EquipStatFromData[32]);
    setEquipStatRandom(31, EquipStatFromData[33]);
    setEquipStatRandom(32, EquipStatFromData[34]);
    setEquipStatRandom(33, EquipStatFromData[35]);//封印等级
    setEquipStatRandom(34, EquipStatFromData[36]);
    if (EquipStatFromData[37] != null) {
        setEquipStatRandom(35, EquipStatFromData[37]);//owner
    }
    setEquipStatRandom(36, EquipStatFromData[38]);//已升级次数
    setEquipStatRandom(37, EquipStatFromData[39]);//剩余时间
    // cm.removeSlot(1, 1, 1); //删除掉原始道具
    //inventoryType, deleteSlot, deleteQuantity
    //toDrop.setEquipOnlyId(cm.getItemInfo().getNextEquipOnlyId());
    cm.addFromDrop(cm.getC(), toDrop, false);
}

function getEquipStatFormDataOfOwner() {//从数据库得到装备数据 自己的
    EquipStatFromData[0] = TradeDataForOwner.getString("str"); //力量
    EquipStatFromData[1] = TradeDataForOwner.getString("dex"); //敏捷
    EquipStatFromData[2] = TradeDataForOwner.getString("ints"); //智力
    EquipStatFromData[3] = TradeDataForOwner.getString("luk"); //运气
    EquipStatFromData[4] = TradeDataForOwner.getString("hp");
    EquipStatFromData[5] = TradeDataForOwner.getString("mp");
    EquipStatFromData[6] = TradeDataForOwner.getString("watk");
    EquipStatFromData[7] = TradeDataForOwner.getString("matk");
    EquipStatFromData[8] = TradeDataForOwner.getString("wdef");
    EquipStatFromData[9] = TradeDataForOwner.getString("mdef");
    EquipStatFromData[10] = TradeDataForOwner.getString("acc");
    EquipStatFromData[11] = TradeDataForOwner.getString("avoid");
    EquipStatFromData[12] = TradeDataForOwner.getString("speed");
    EquipStatFromData[13] = TradeDataForOwner.getString("jump");
    EquipStatFromData[14] = TradeDataForOwner.getString("upgradeSlots");
    EquipStatFromData[15] = TradeDataForOwner.getString("limitBreak");
    EquipStatFromData[16] = TradeDataForOwner.getString("potential1");
    EquipStatFromData[17] = TradeDataForOwner.getString("potential2");
    EquipStatFromData[18] = TradeDataForOwner.getString("potential3");
    EquipStatFromData[19] = TradeDataForOwner.getString("potential4");
    EquipStatFromData[20] = TradeDataForOwner.getString("potential5");
    EquipStatFromData[21] = TradeDataForOwner.getString("potential6");
    EquipStatFromData[22] = TradeDataForOwner.getString("enhance");
    EquipStatFromData[23] = TradeDataForOwner.getString("reqLevel");
    EquipStatFromData[24] = TradeDataForOwner.getString("yggdrasilWisdom");
    EquipStatFromData[25] = TradeDataForOwner.getString("bossDamage");
    EquipStatFromData[26] = TradeDataForOwner.getString("ignorepDR");
    EquipStatFromData[27] = TradeDataForOwner.getString("totalDamage");
    EquipStatFromData[28] = TradeDataForOwner.getString("allStat");
    EquipStatFromData[29] = TradeDataForOwner.getString("karmaCount");
    EquipStatFromData[30] = TradeDataForOwner.getString("itemprice");
    EquipStatFromData[31] = TradeDataForOwner.getString("tradeType");
    //新增属性部分
    EquipStatFromData[32] = TradeDataForOwner.getString("hands");
    EquipStatFromData[33] = TradeDataForOwner.getString("ViciousHammer");
    EquipStatFromData[34] = TradeDataForOwner.getString("itemEXP");

    EquipStatFromData[35] = TradeDataForOwner.getString("sealedlevel");
    EquipStatFromData[36] = TradeDataForOwner.getString("sealedExp");
    EquipStatFromData[37] = TradeDataForOwner.getString("Owner");
    EquipStatFromData[38] = TradeDataForOwner.getString("level");
    EquipStatFromData[39] = TradeDataForOwner.getString("expiredate");
}


function getEquipStatFormData() {//从数据库得到装备数据
    EquipStatFromData[0] = TradeData.getString("str"); //力量
    EquipStatFromData[1] = TradeData.getString("dex"); //敏捷
    EquipStatFromData[2] = TradeData.getString("ints"); //智力
    EquipStatFromData[3] = TradeData.getString("luk"); //运气
    EquipStatFromData[4] = TradeData.getString("hp");
    EquipStatFromData[5] = TradeData.getString("mp");
    EquipStatFromData[6] = TradeData.getString("watk");
    EquipStatFromData[7] = TradeData.getString("matk");
    EquipStatFromData[8] = TradeData.getString("wdef");
    EquipStatFromData[9] = TradeData.getString("mdef");
    EquipStatFromData[10] = TradeData.getString("acc");
    EquipStatFromData[11] = TradeData.getString("avoid");
    EquipStatFromData[12] = TradeData.getString("speed");
    EquipStatFromData[13] = TradeData.getString("jump");
    EquipStatFromData[14] = TradeData.getString("upgradeSlots");
    EquipStatFromData[15] = TradeData.getString("limitBreak");
    EquipStatFromData[16] = TradeData.getString("potential1");
    EquipStatFromData[17] = TradeData.getString("potential2");
    EquipStatFromData[18] = TradeData.getString("potential3");
    EquipStatFromData[19] = TradeData.getString("potential4");
    EquipStatFromData[20] = TradeData.getString("potential5");
    EquipStatFromData[21] = TradeData.getString("potential6");
    EquipStatFromData[22] = TradeData.getString("enhance");
    EquipStatFromData[23] = TradeData.getString("reqLevel");
    EquipStatFromData[24] = TradeData.getString("yggdrasilWisdom");
    EquipStatFromData[25] = TradeData.getString("bossDamage");
    EquipStatFromData[26] = TradeData.getString("ignorepDR");
    EquipStatFromData[27] = TradeData.getString("totalDamage");
    EquipStatFromData[28] = TradeData.getString("allStat");
    EquipStatFromData[29] = TradeData.getString("karmaCount");
    EquipStatFromData[30] = TradeData.getString("itemprice");
    EquipStatFromData[31] = TradeData.getString("tradeType");
    //新增属性部分
    EquipStatFromData[32] = TradeData.getString("hands");
    EquipStatFromData[33] = TradeData.getString("ViciousHammer");
    EquipStatFromData[34] = TradeData.getString("itemEXP");

    EquipStatFromData[35] = TradeData.getString("sealedlevel");
    EquipStatFromData[36] = TradeData.getString("sealedExp");
    EquipStatFromData[37] = TradeData.getString("Owner");
    EquipStatFromData[38] = TradeData.getString("level");
    EquipStatFromData[39] = TradeData.getString("expiredate");

}

function getEquipStatToArray() {//得到装备数据
    EquipStat[0] = cm.getEquipBySlot(position).getStr(); //力量
    EquipStat[1] = cm.getEquipBySlot(position).getDex(); //敏捷
    EquipStat[2] = cm.getEquipBySlot(position).getInt(); //智力
    EquipStat[3] = cm.getEquipBySlot(position).getLuk(); //运气
    EquipStat[4] = cm.getEquipBySlot(position).getHp();
    EquipStat[5] = cm.getEquipBySlot(position).getMp();
    EquipStat[6] = cm.getEquipBySlot(position).getWatk();
    EquipStat[7] = cm.getEquipBySlot(position).getMatk();
    EquipStat[8] = cm.getEquipBySlot(position).getWdef();
    EquipStat[9] = cm.getEquipBySlot(position).getMdef();
    EquipStat[10] = cm.getEquipBySlot(position).getAcc();
    EquipStat[11] = cm.getEquipBySlot(position).getAvoid();
    EquipStat[12] = cm.getEquipBySlot(position).getSpeed();
    EquipStat[13] = cm.getEquipBySlot(position).getJump();
    EquipStat[14] = cm.getEquipBySlot(position).getUpgradeSlots();
    EquipStat[15] = cm.getEquipBySlot(position).getLimitBreak();
    EquipStat[16] = cm.getEquipBySlot(position).getPotential1();
    EquipStat[17] = cm.getEquipBySlot(position).getPotential2();
    EquipStat[18] = cm.getEquipBySlot(position).getPotential3();
    EquipStat[19] = cm.getEquipBySlot(position).getPotential4();
    EquipStat[20] = cm.getEquipBySlot(position).getPotential5();
    EquipStat[21] = cm.getEquipBySlot(position).getPotential6();
    EquipStat[22] = cm.getEquipBySlot(position).getEnhance();
    EquipStat[23] = cm.getEquipBySlot(position).getReqLevel();
    EquipStat[24] = cm.getEquipBySlot(position).getYggdrasilWisdom();
    EquipStat[25] = cm.getEquipBySlot(position).getBossDamage();
    EquipStat[26] = cm.getEquipBySlot(position).getIgnorePDR();
    EquipStat[27] = cm.getEquipBySlot(position).getTotalDamage();
    EquipStat[28] = cm.getEquipBySlot(position).getAllStat();
    // EquipStat[29] = cm.getEquipBySlot(1).getFinalStrike();
    EquipStat[29] = cm.getEquipBySlot(position).getKarmaCount();
    //新增属性部分
    EquipStat[30] = cm.getEquipBySlot(position).getHands();
    EquipStat[31] = cm.getEquipBySlot(position).getViciousHammer();
    EquipStat[32] = cm.getEquipBySlot(position).getItemEXP();

    EquipStat[33] = cm.getEquipBySlot(position).getSealedLevel();
    EquipStat[34] = cm.getEquipBySlot(position).getSealedExp();

    EquipStat[35] = cm.getEquipBySlot(position).getOwner();
    EquipStat[36] = cm.getEquipBySlot(position).getLevel();
    EquipStat[37] = cm.getEquipBySlot(position).getExpiration();
}


function setEquipStatRandom(i, v) {//设置装备属性
    switch (i) {
        case 0:
            toDrop.setStr(v);
            break;
        case 1:
            toDrop.setDex(v);
            break;
        case 2:
            toDrop.setInt(v);
            break;
        case 3:
            toDrop.setLuk(v);
            break;
        case 4:
            toDrop.setHp(v);
            break;
        case 5:
            toDrop.setMp(v);
            break;
        case 6:
            toDrop.setWatk(v);
            break;
        case 7:
            toDrop.setMatk(v);
            break;
        case 8:
            toDrop.setWdef(v);
            break;
        case 9:
            toDrop.setMdef(v);
            break;
        case 10:
            toDrop.setAcc(v);
            break;
        case 11:
            toDrop.setAvoid(v);
            break;
        case 12:
            toDrop.setSpeed(v);
            break;
        case 13:
            toDrop.setJump(v);
            break;
        case 14:
            toDrop.setUpgradeSlots(v);
            break;
        case 15:
            toDrop.setLimitBreak(v);
            break;
        case 16:
            toDrop.setPotential1(v);
            break;
        case 17:
            toDrop.setPotential2(v);
            break;
        case 18:
            toDrop.setPotential3(v);
            break;
        case 19:
            toDrop.setPotential4(v);
            break;
        case 20:
            toDrop.setPotential5(v);
            break;
        case 21:
            toDrop.setPotential6(v);
            break;
        case 22:
            toDrop.setEnhance(v);
            break;
        case 23:
            toDrop.setReqLevel(v);
            break;
        case 24:
            toDrop.setYggdrasilWisdom(v);
            break;
        case 25:
            toDrop.setBossDamage(v);
            break;
        case 26:
            toDrop.setIgnorePDR(v);
            break;
        case 27:
            toDrop.setTotalDamage(v);
            break;
        case 28:
            toDrop.setAllStat(v);
            break;
        case 29:
            toDrop.setKarmaCount(v);
            break;
        case 30:
            toDrop.setHands(v);
            break;
        case 31:
            toDrop.setViciousHammer(v);
            break;
        case 32:
            toDrop.setItemEXP(v);
            break;
        case 33:
            toDrop.setSealedLevel(v);
            break;
        case 34:
            toDrop.setSealedExp(v);
            break;
        case 35:
            toDrop.setOwner(v);
            break;
        case 36:
            toDrop.setLevel(v);
            break;
        case 37:
            toDrop.setExpiration(v);
            break;
    }
}

function setLog(tid) {
    var insertLog = cm.getConnection().prepareStatement("INSERT INTO cashtradesystemLog values (?,?,?,?,?,?,?,?)");
    insertLog.setString(1, tid);//交易id
    insertLog.setString(2, TradeCid);//卖出者角色id
    insertLog.setString(3, cm.getPlayer().getId());//购买者角色id
    insertLog.setString(4, cm.getPlayer().getName());//购买者角色名字
    insertLog.setString(5, EquipStatFromData[31]);//买卖tid的贩卖类型 0金币 1点券 2余额
    insertLog.setString(6, TradePrice);//贩卖的价格
    insertLog.setString(7, TradeItem);//贩卖的道具
    insertLog.setString(8, null);//贩卖的日期，由数据库自动生成
    insertLog.executeUpdate();
    insertLog.close();
}