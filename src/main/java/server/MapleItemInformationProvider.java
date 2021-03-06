package server;

import client.MapleCharacter;
import client.MapleTraitType;
import client.inventory.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import configs.ServerConfig;
import constants.ItemConstants;
import constants.JobConstants;
import handling.channel.handler.EnchantHandler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import provider.*;
import redis.clients.jedis.Jedis;
import tools.*;
import tools.RedisUtil.KEYNAMES;

import java.awt.*;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.List;
import java.util.Map.Entry;

public class MapleItemInformationProvider {

    private static final Logger log = LogManager.getLogger(MapleItemInformationProvider.class.getName());
    private static final MapleItemInformationProvider instance = new MapleItemInformationProvider();
    protected final MapleDataProvider chrData = MapleDataProviderFactory.getDataProvider(new File(System.getProperty("wzpath") + "/Character.wz"));
    protected final MapleDataProvider etcData = MapleDataProviderFactory.getDataProvider(new File(System.getProperty("wzpath") + "/Etc.wz"));
    protected final MapleDataProvider itemData = MapleDataProviderFactory.getDataProvider(new File(System.getProperty("wzpath") + "/Item.wz"));
    protected final MapleDataProvider stringData = MapleDataProviderFactory.getDataProvider(new File(System.getProperty("wzpath") + "/String.wz"));
    protected final MapleDataProvider effectData = MapleDataProviderFactory.getDataProvider(new File(System.getProperty("wzpath") + "/Effect.wz"));
    protected final Map<Integer, StructFamiliar> familiars = new HashMap<>();
    protected final Map<Integer, LinkedList<StructItemOption>> familiar_option = new HashMap<>();
    protected final Map<Integer, Map<Integer, Float>> familiarTable_pad = new HashMap<>();
    protected final Map<Integer, Map<Integer, Short>> familiarTable_rchance = new HashMap<>();
    protected final Map<String, List<Triple<String, Point, Point>>> afterImage = new HashMap<>();
    protected final Map<Integer, MapleStatEffect> itemEffects = new HashMap<>();
    protected final Map<Integer, MapleStatEffect> itemEffectsEx = new HashMap<>();
    protected final Map<Integer, Integer> mobIds = new HashMap<>();
    protected final Map<Integer, Pair<Integer, Integer>> potLife = new HashMap<>(); //itemid to lifeid, levels
    protected final Map<Integer, StructAndroid> androidInfo = new HashMap<>(); //??????????????????????????????
    protected final Map<Integer, StructCrossHunterShop> crossHunterShop = new HashMap<>(); //????????????????????????
    protected final Map<Integer, Integer> exclusiveEquip = new HashMap<>(); //????????????????????????????????? by ??????ID
    protected final Map<Integer, StructExclusiveEquip> exclusiveEquipInfo = new HashMap<>(); //????????????????????????????????? by ??????ID
    protected final Map<Integer, Integer> soulSkill = new TreeMap<>();
    protected final Map<Integer, ArrayList<Integer>> tempOption = new TreeMap<>();
    protected final Map<Integer, Pair<Integer, Integer>> socketReqLevel = new TreeMap<>();
    protected final Map<Integer, Integer> damageSkinBox = new TreeMap<>();
    protected final List<Integer> setItemInfoEffs = new ArrayList<>();
    protected final Map<Integer, Map<Integer, Triple<Integer, Integer, Integer>>> vcores = new HashMap<>();
    protected final Map<Integer, VCoreDataEntry> vcoreDatas = new HashMap<>();
    protected final Map<String, List<VCoreDataEntry>> vcoreDatas_s = new HashMap<>();
    private final ObjectMapper mapper = JsonUtil.getMapperInstance();
//    private final Jedis jedis = RedisUtil.getJedis();

    public static MapleItemInformationProvider getInstance() {
        return instance;
    }

    public List<Integer> getSetItemInfoEffs() {
        return setItemInfoEffs;
    }

    public void runEtc() {
        /*
         * ??????????????????
         */
        MapleDataDirectoryEntry e = (MapleDataDirectoryEntry) etcData.getRoot().getEntry("Android");
        for (MapleDataEntry d : e.getFiles()) {
            MapleData iz = etcData.getData("Android/" + d.getName());
            StructAndroid android = new StructAndroid();
            int type = Integer.parseInt(d.getName().substring(0, 4));
            android.type = type;
            android.gender = MapleDataTool.getIntConvert("info/gender", iz, 0);
            for (MapleData ds : iz.getChildByPath("costume/skin")) { //??????
                android.skin.add(MapleDataTool.getInt(ds, 2000));
            }
            for (MapleData ds : iz.getChildByPath("costume/hair")) { //??????
                android.hair.add(MapleDataTool.getInt(ds, android.gender == 0 ? 20101 : 21101));
            }
            for (MapleData ds : iz.getChildByPath("costume/face")) { //??????
                android.face.add(MapleDataTool.getInt(ds, android.gender == 0 ? 30110 : 31510));
            }
            androidInfo.put(type, android);
        }
        /*
         * ??????????????????????????????
         */
        MapleData shopData = etcData.getData("CrossHunterChapter.img").getChildByPath("Shop");
        for (MapleData dat : shopData) {
            int key = Integer.parseInt(dat.getName());
            StructCrossHunterShop shop = new StructCrossHunterShop(MapleDataTool.getIntConvert("itemId", dat, 0), MapleDataTool.getIntConvert("tokenPrice", dat, -1), MapleDataTool.getIntConvert("potentialGrade", dat, 0));
            crossHunterShop.put(key, shop);
        }
        /*
         * ????????????
         */
        MapleData lifesData = etcData.getData("ItemPotLifeInfo.img");
        for (MapleData d : lifesData) {
            if (d.getChildByPath("info") != null && MapleDataTool.getInt("type", d.getChildByPath("info"), 0) == 1) {
                potLife.put(MapleDataTool.getInt("counsumeItem", d.getChildByPath("info"), 0), new Pair<>(Integer.parseInt(d.getName()), d.getChildByPath("level").getChildren().size()));
            }
        }
        List<Triple<String, Point, Point>> thePointK = new ArrayList<>();
        List<Triple<String, Point, Point>> thePointA = new ArrayList<>();

        MapleDataDirectoryEntry a = (MapleDataDirectoryEntry) chrData.getRoot().getEntry("Afterimage");
        for (MapleDataEntry b : a.getFiles()) {
            MapleData iz = chrData.getData("Afterimage/" + b.getName());
            List<Triple<String, Point, Point>> thePoint = new ArrayList<>();
            Map<String, Pair<Point, Point>> dummy = new HashMap<>();
            for (MapleData i : iz) {
                for (MapleData xD : i) {
                    if (xD.getName().contains("prone") || xD.getName().contains("double") || xD.getName().contains("triple")) {
                        continue;
                    }
                    if ((b.getName().contains("bow") || b.getName().contains("Bow")) && !xD.getName().contains("shoot")) {
                        continue;
                    }
                    if ((b.getName().contains("gun") || b.getName().contains("cannon")) && !xD.getName().contains("shot")) {
                        continue;
                    }
                    if (dummy.containsKey(xD.getName())) {
                        if (xD.getChildByPath("lt") != null) {
                            Point lt = (Point) xD.getChildByPath("lt").getData();
                            Point ourLt = dummy.get(xD.getName()).left;
                            if (lt.x < ourLt.x) {
                                ourLt.x = lt.x;
                            }
                            if (lt.y < ourLt.y) {
                                ourLt.y = lt.y;
                            }
                        }
                        if (xD.getChildByPath("rb") != null) {
                            Point rb = (Point) xD.getChildByPath("rb").getData();
                            Point ourRb = dummy.get(xD.getName()).right;
                            if (rb.x > ourRb.x) {
                                ourRb.x = rb.x;
                            }
                            if (rb.y > ourRb.y) {
                                ourRb.y = rb.y;
                            }
                        }
                    } else {
                        Point lt = null, rb = null;
                        if (xD.getChildByPath("lt") != null) {
                            lt = (Point) xD.getChildByPath("lt").getData();
                        }
                        if (xD.getChildByPath("rb") != null) {
                            rb = (Point) xD.getChildByPath("rb").getData();
                        }
                        dummy.put(xD.getName(), new Pair<>(lt, rb));
                    }
                }
            }
            for (Entry<String, Pair<Point, Point>> ez : dummy.entrySet()) {
                if (ez.getKey().length() > 2 && ez.getKey().substring(ez.getKey().length() - 2, ez.getKey().length() - 1).equals("D")) { //D = double weapon
                    thePointK.add(new Triple<>(ez.getKey(), ez.getValue().left, ez.getValue().right));
                } else if (ez.getKey().contains("PoleArm")) { //D = double weapon
                    thePointA.add(new Triple<>(ez.getKey(), ez.getValue().left, ez.getValue().right));
                } else {
                    thePoint.add(new Triple<>(ez.getKey(), ez.getValue().left, ez.getValue().right));
                }
            }
            afterImage.put(b.getName().substring(0, b.getName().length() - 4), thePoint);
        }
        afterImage.put("katara", thePointK); //hackish
        afterImage.put("aran", thePointA); //hackish
        //???????????????????????????????????????
        MapleData exclusiveEquipData = etcData.getData("ExclusiveEquip.img");
        StructExclusiveEquip exclusive;
        int exId;
        for (MapleData dat : exclusiveEquipData) {
            exclusive = new StructExclusiveEquip();
            exId = Integer.parseInt(dat.getName()); //??????ID
            String msg = MapleDataTool.getString("msg", dat, "");
            msg = msg.replace("\\r\\n", "\r\n");
            msg = msg.replace("-------<", "---<");
            msg = msg.replace(">------", ">---");
            exclusive.id = exId;
            exclusive.msg = msg;
            for (MapleData level : dat.getChildByPath("item")) {
                int itemId = MapleDataTool.getInt(level);
                exclusive.itemIDs.add(itemId);
                exclusiveEquip.put(itemId, exId);
            }
            exclusiveEquipInfo.put(exId, exclusive);
        }
        //????????? ????????????????????? ?????? 100
        exclusive = new StructExclusiveEquip();
        exId = 100; //??????ID
        exclusive.msg = "??????????????????\r\n????????????????????????";
        for (int i = 1112446; i <= 1112495; i++) {
            exclusive.itemIDs.add(i);
            exclusiveEquip.put(i, exId);
        }
        exclusiveEquipInfo.put(exId, exclusive);
        //????????? ????????????????????? ?????? 101
        exclusive = new StructExclusiveEquip();
        exId = 101; //??????ID
        exclusive.msg = "??????????????????\r\n????????????????????????";
        for (int i = 1112435; i <= 1112439; i++) {
            exclusive.itemIDs.add(i);
            exclusiveEquip.put(i, exId);
        }
        exclusiveEquipInfo.put(exId, exclusive);
        //????????? ????????????????????? ?????? 102
        exclusive = new StructExclusiveEquip();
        exId = 102; //??????ID
        exclusive.msg = "??????????????????\r\n????????????????????????";
        for (int i = 1112599; i <= 1112613; i++) {
            exclusive.itemIDs.add(i);
            exclusiveEquip.put(i, exId);
        }
        exclusiveEquipInfo.put(exId, exclusive);

        /*
          ????????????
        */
//        MapleDataDirectoryEntry weapon = (MapleDataDirectoryEntry) chrData.getRoot().getEntry("Weapon");
//        for (MapleDataEntry d : weapon.getFiles()) {
//            WeaponIDs.add(Integer.valueOf(d.getName().substring(0, 8)));
//        }
//        System.out.println("???????????? " + WeaponIDs.size() + " ?????????");


        /*
         * ??????????????????
         */
        final MapleDataDirectoryEntry f = (MapleDataDirectoryEntry) chrData.getRoot().getEntry("Familiar");
        final MapleData familiarItemData = itemData.getData("Consume/0287.img");
        for (MapleDataEntry d : f.getFiles()) {
            final int id = Integer.parseInt(d.getName().substring(0, d.getName().length() - 4));
            for (MapleData info : chrData.getData("Familiar/" + d.getName())) {
                if (info.getName().equals("info")) {
                    int skillid = MapleDataTool.getIntConvert("skill/id", info, 0);
                    int effectAfter = MapleDataTool.getIntConvert("skill/effectAfter", info, 0);
                    int mobid = MapleDataTool.getIntConvert("MobID", info, 0);
                    int monsterCardID = MapleDataTool.getIntConvert("monsterCardID", info, 0);
                    byte grade = (byte) MapleDataTool.getIntConvert("0" + monsterCardID + "/info/grade", familiarItemData, 0);
                    familiars.put(id, new StructFamiliar(id, skillid, effectAfter, mobid, monsterCardID, grade));
                }
            }
        }

        final MapleData familiarTableData = etcData.getData("FamiliarTable.img");
        for (MapleData d : familiarTableData) {
            if (d.getName().equals("stat")) {
                for (MapleData subd : d) {
                    Map<Integer, Float> stats = new HashMap<>();
                    for (MapleData stat : subd) {
                        stats.put(Integer.valueOf(stat.getName()), MapleDataTool.getFloat(stat.getChildByPath("pad"), 0.0f));
                    }
                    familiarTable_pad.put(Integer.valueOf(subd.getName()), stats);
                }
            } else if (d.getName().equals("reinforce_chance")) {
                for (MapleData subd : d) {
                    Map<Integer, Short> chances = new HashMap<>();
                    for (MapleData chance : subd) {
                        chances.put(Integer.valueOf(chance.getName()), (Short) chance.getData());
                    }
                    familiarTable_rchance.put(Integer.valueOf(subd.getName()), chances);
                }
            }
        }


        for (final MapleData d : effectData.getData("BasicEff.img").getChildByPath("damageSkin")) {
            final int itemID = MapleDataTool.getInt("ItemID", d, 0);
            if (itemID > 0) {
                damageSkinBox.put(itemID, Integer.parseInt(d.getName()));
            }
        }
        damageSkinBox.put(2431965, 0);
        damageSkinBox.put(5680395, 40);

        effectData.getData("SetItemInfoEff.img").forEach(mapleData -> setItemInfoEffs.add(Integer.valueOf(mapleData.getName())));
        Collections.reverse(setItemInfoEffs);

        MapleData vcoreData = etcData.getData("VCore.img");
        int vcoresindex = 0;
        for (MapleData enforcement : vcoreData.getChildByPath("Enforcement")) {
            HashMap<Integer, Triple<Integer, Integer, Integer>> map = new HashMap<>();
            for (MapleData subdata : enforcement) {
                map.put(Integer.valueOf(subdata.getName()), new Triple<>(MapleDataTool.getInt("nextExp", subdata, 0), MapleDataTool.getInt("expEnforce", subdata, 0), MapleDataTool.getInt("extract", subdata, 0)));
            }
            vcores.put(vcoresindex++, map);
        }
        for (MapleData coreData : vcoreData.getChildByPath("CoreData")) {
            VCoreDataEntry vCoreDataEntry = new VCoreDataEntry();
            vCoreDataEntry.setId(Integer.valueOf(coreData.getName()));
            vCoreDataEntry.setName(MapleDataTool.getString("name", coreData, ""));
            vCoreDataEntry.setDesc(MapleDataTool.getString("desc", coreData, ""));
            vCoreDataEntry.setType(MapleDataTool.getInt("type", coreData, 0));
            vCoreDataEntry.setMaxLevel(MapleDataTool.getInt("maxLevel", coreData, 0));
            vCoreDataEntry.setJob(MapleDataTool.getString("0", coreData.getChildByPath("job"), ""));
            MapleData connectSkill1 = coreData.getChildByPath("connectSkill");
            if (connectSkill1 != null) {
                for (MapleData connectSkill : connectSkill1) {
                    int anInt = MapleDataTool.getInt(connectSkill, 0);
                    if (anInt > 0) {
                        vCoreDataEntry.getConnectSkill().add(anInt);
                    }
                }
            }
            vcoreDatas.put(vCoreDataEntry.getId(), vCoreDataEntry);
            if (vCoreDataEntry.getType() == 1) {
                List<VCoreDataEntry> list = vcoreDatas_s.computeIfAbsent(vCoreDataEntry.getJob(), k -> new ArrayList<>());
                list.add(vCoreDataEntry);
            }
        }

    }

    /**
     * ??????????????????
     */
    public void loadSetItemData() {
        Jedis jedis = RedisUtil.getJedis();
        try {
            if (!jedis.exists(KEYNAMES.SETITEM_DATA.getKeyName())) {
                MapleData setsData = etcData.getData("SetItemInfo.img");
                StructSetItem SetItem;
                StructSetItemStat SetItemStat;
                for (MapleData dat : setsData) {
                    SetItem = new StructSetItem();
                    SetItem.setItemID = Integer.parseInt(dat.getName()); //??????ID
                    SetItem.setItemName = MapleDataTool.getString("setItemName", dat, ""); //????????????
                    SetItem.completeCount = (byte) MapleDataTool.getIntConvert("completeCount", dat, 0); //????????????
                    for (MapleData level : dat.getChildByPath("ItemID")) {
                        if (level.getType() != MapleDataType.INT) {
                            for (MapleData leve : level) {
                                if (!leve.getName().equals("representName") && !leve.getName().equals("typeName")) {
                                    try {
                                        SetItem.itemIDs.add(MapleDataTool.getIntConvert(leve));
                                    } catch (Exception e) {
                                        System.err.println("??????????????? leve = " + leve.getData());
                                    }
                                }
                            }
                        } else {
                            SetItem.itemIDs.add(MapleDataTool.getInt(level));
                        }
                    }
                    for (MapleData level : dat.getChildByPath("Effect")) {
                        SetItemStat = new StructSetItemStat();
                        SetItemStat.incSTR = MapleDataTool.getIntConvert("incSTR", level, 0);
                        SetItemStat.incDEX = MapleDataTool.getIntConvert("incDEX", level, 0);
                        SetItemStat.incINT = MapleDataTool.getIntConvert("incINT", level, 0);
                        SetItemStat.incLUK = MapleDataTool.getIntConvert("incLUK", level, 0);
                        SetItemStat.incMHP = MapleDataTool.getIntConvert("incMHP", level, 0);
                        SetItemStat.incMMP = MapleDataTool.getIntConvert("incMMP", level, 0);
                        SetItemStat.incMHPr = MapleDataTool.getIntConvert("incMHPr", level, 0);
                        SetItemStat.incMMPr = MapleDataTool.getIntConvert("incMMPr", level, 0);
                        SetItemStat.incACC = MapleDataTool.getIntConvert("incACC", level, 0);
                        SetItemStat.incEVA = MapleDataTool.getIntConvert("incEVA", level, 0);
                        SetItemStat.incPDD = MapleDataTool.getIntConvert("incPDD", level, 0);
                        SetItemStat.incMDD = MapleDataTool.getIntConvert("incMDD", level, 0);
                        SetItemStat.incPAD = MapleDataTool.getIntConvert("incPAD", level, 0);
                        SetItemStat.incMAD = MapleDataTool.getIntConvert("incMAD", level, 0);
                        SetItemStat.incJump = MapleDataTool.getIntConvert("incJump", level, 0);
                        SetItemStat.incSpeed = MapleDataTool.getIntConvert("incSpeed", level, 0);
                        SetItemStat.incAllStat = MapleDataTool.getIntConvert("incAllStat", level, 0);
                        SetItemStat.incPQEXPr = MapleDataTool.getIntConvert("incPQEXPr", level, 0);
                        SetItemStat.incPVPDamage = MapleDataTool.getIntConvert("incPVPDamage", level, 0);
                        SetItemStat.option1 = MapleDataTool.getIntConvert("Option/1/option", level, 0);
                        SetItemStat.option2 = MapleDataTool.getIntConvert("Option/2/option", level, 0);
                        SetItemStat.option3 = MapleDataTool.getIntConvert("Option/3/option", level, 0);
                        SetItemStat.option1Level = MapleDataTool.getIntConvert("Option/1/level", level, 0);
                        SetItemStat.option2Level = MapleDataTool.getIntConvert("Option/2/level", level, 0);
                        SetItemStat.option3Level = MapleDataTool.getIntConvert("Option/3/level", level, 0);
                        SetItemStat.skillId = MapleDataTool.getIntConvert("activeSkill/0/id", level, 0);
                        SetItemStat.skillLevel = MapleDataTool.getIntConvert("activeSkill/0/level", level, 0);
                        SetItem.setItemStat.put(Integer.parseInt(level.getName()), SetItemStat); //[?????????????????????] [??????????????????????????????]
                    }
                    try {
                        jedis.hset(KEYNAMES.SETITEM_DATA.getKeyName(), dat.getName(), mapper.writeValueAsString(SetItem));
                    } catch (JsonProcessingException e) {
                        e.printStackTrace();
                    }
                }
            }
        }finally {
            RedisUtil.returnResource(jedis);
        }


    }

    /**
     * ??????????????????
     */
    public void loadPotentialData() {
        Jedis jedis = RedisUtil.getJedis();
        try {
            if (!jedis.exists(KEYNAMES.POTENTIAL_DATA.getKeyName())) {
                StructItemOption item;
                MapleData potsData = itemData.getData("ItemOption.img");
                List<StructItemOption> items;
                for (MapleData dat : potsData) {
                    items = new LinkedList<>();
                    for (MapleData potLevel : dat.getChildByPath("level")) {
                        item = new StructItemOption();
                        item.opID = Integer.parseInt(dat.getName());
                        item.optionType = MapleDataTool.getIntConvert("info/optionType", dat, 0);
                        item.reqLevel = MapleDataTool.getIntConvert("info/reqLevel", dat, 0);
                        item.opString = MapleDataTool.getString("info/string", dat, "");
                        for (String i : StructItemOption.types) {
                            if (i.equals("face")) {
                                item.face = MapleDataTool.getString("face", potLevel, "");
                            } else {
                                int level = MapleDataTool.getIntConvert(i, potLevel, 0);
                                if (level > 0) { // Save memory
                                    item.data.put(i, level);
                                }
                            }
                        }
                        switch (item.opID) {
                            case 31001: //?????????????????????????????????
                            case 31002: //????????????????????????????????????
                            case 31003: //???????????????????????????????????????
                            case 31004: //???????????????????????????????????????
                                item.data.put("skillID", (item.opID - 23001));
                                break;
                            case 41005: //????????????????????????????????????
                            case 41006: //????????????????????????????????????
                            case 41007: //????????????????????????????????????
                                item.data.put("skillID", (item.opID - 33001));
                                break;
                        }
                        items.add(item);
                    }
                    try {
                        jedis.hset(KEYNAMES.POTENTIAL_DATA.getKeyName(), String.valueOf(Integer.valueOf(dat.getName())), mapper.writeValueAsString(items));
                    } catch (JsonProcessingException e) {
                        e.printStackTrace();
                    }
                }
            }
        }finally {
            RedisUtil.returnResource(jedis);
        }
    }

    /**
     * ??????????????????
     */
    public void loadSocketData() {
        Jedis jedis = RedisUtil.getJedis();
        try {
            if (!jedis.exists(KEYNAMES.SOCKET_DATA.getKeyName())) {
                MapleData nebuliteData = itemData.getData("Install/0306.img");
                StructItemOption item;
                for (MapleData dat : nebuliteData) {
                    item = new StructItemOption();
                    item.opID = Integer.parseInt(dat.getName()); // Item Id
                    item.optionType = MapleDataTool.getInt("optionType", dat.getChildByPath("socket"), 0);
                    for (MapleData info : dat.getChildByPath("socket/option")) {
                        String optionString = MapleDataTool.getString("optionString", info, "");
                        int level = MapleDataTool.getInt("level", info, 0);
                        if (level > 0) { // Save memory
                            item.data.put(optionString, level);
                        }
                    }
                    switch (item.opID) {
                        case 3063370: // Haste
                            item.data.put("skillID", 8000);
                            break;
                        case 3063380: // Mystic Door
                            item.data.put("skillID", 8001);
                            break;
                        case 3063390: // Sharp Eyes
                            item.data.put("skillID", 8002);
                            break;
                        case 3063400: // Hyper Body
                            item.data.put("skillID", 8003);
                            break;
                        case 3064470: // Combat Orders
                            item.data.put("skillID", 8004);
                            break;
                        case 3064480: // Advanced Blessing
                            item.data.put("skillID", 8005);
                            break;
                        case 3064490: // Speed Infusion
                            item.data.put("skillID", 8006);
                            break;
                    }
                    try {
                        jedis.hset(KEYNAMES.SOCKET_DATA.getKeyName() + ":" + ItemConstants.getNebuliteGrade(item.opID), String.valueOf(item.opID), mapper.writeValueAsString(item));
                    } catch (JsonProcessingException e) {
                        e.printStackTrace();
                    }
                }
                jedis.set(KEYNAMES.SOCKET_DATA.getKeyName(), "true");
            }
        }finally {
            RedisUtil.returnResource(jedis);
        }

    }

    public void loadFamiliarItems() {

    }

    public void runItems() {
        Jedis jedis = RedisUtil.getJedis();
        try {
            /*
             * ?????????????????????????????????
             */
            if (!jedis.exists(KEYNAMES.ITEM_DATA.getKeyName())) {
                List<Pair<String, String>> types = Arrays.asList(
                        new Pair<>(KEYNAMES.ITEM_NAME.getKeyName(), "name"),
                        new Pair<>(KEYNAMES.ITEM_DESC.getKeyName(), "desc"),
                        new Pair<>(KEYNAMES.ITEM_MSG.getKeyName(), "msg"));
                List<MapleData> mapleDatas = new ArrayList<>();
                for (MapleDataFileEntry filedata : stringData.getRoot().getFiles()) {
                    switch (filedata.getName()) {
                        case "Eqp.img": {
                            MapleData data = stringData.getData(filedata.getName()).getChildByPath("Eqp");
                            for (MapleData typedata : data.getChildren()) {
                                mapleDatas.addAll(typedata.getChildren());
                            }
                            break;
                        }
                        case "Consume.img":
                        case "Ins.img":
                        case "Etc.img":
                        case "Cash.img":
                        case "Pet.img": {
                            MapleData data = filedata.getName().startsWith("Etc") ? stringData.getData(filedata.getName()).getChildByPath("Etc") : stringData.getData(filedata.getName());
                            mapleDatas.addAll(data.getChildren());
                            break;
                        }

                        default:
                            break;
                    }
                }

                for (MapleData namedata : mapleDatas) {
                    String itemid = namedata.getName();
                    if (itemid.substring(0, 1).equals("0")) {
                        itemid = itemid.substring(1, itemid.length());
                    }
                    for (Pair<String, String> type : types) {
                        jedis.hset(type.getLeft(), itemid, MapleDataTool.getString(namedata.getChildByPath(type.getRight()), ""));
                    }
                }

            /*
              Load Item Data
             */
                List<MapleDataProvider> dataProviders = new LinkedList<>();
                dataProviders.add(chrData);
                dataProviders.add(itemData);
                Map<String, String> itemDataMap = new HashMap<>();
                Map<String, String> specialItemNameMap = new HashMap<>();
                Map<String, String> specialItemDescMap = new HashMap<>();
                for (MapleDataProvider dataProvider : dataProviders) {
                    for (MapleDataDirectoryEntry topDir : dataProvider.getRoot().getSubdirectories()) {
                        boolean isSpecial = topDir.getName().equals("Special");
                        if (!topDir.getName().equalsIgnoreCase("Hair") && !topDir.getName().equalsIgnoreCase("Face") && !topDir.getName().equalsIgnoreCase("Afterimage")) {
                            for (MapleDataFileEntry ifile : topDir.getFiles()) {
                                MapleData iz = dataProvider.getData(topDir.getName() + "/" + ifile.getName());
                                if (dataProvider.equals(chrData) || topDir.getName().equals("Pet")) {
                                    addItemDataToRedis(iz, itemDataMap, false, specialItemNameMap, specialItemDescMap);
                                } else {
                                    for (MapleData data : iz) {
                                        addItemDataToRedis(data, itemDataMap, isSpecial, specialItemNameMap, specialItemDescMap);
                                    }
                                }
                            }
                        }
                    }
                }

                jedis.hmset(KEYNAMES.ITEM_DATA.getKeyName(), itemDataMap);
                if (!specialItemNameMap.isEmpty()) {
                    jedis.hmset(KEYNAMES.ITEM_NAME.getKeyName(), specialItemNameMap);
                }
                if (!specialItemDescMap.isEmpty()) {
                    jedis.hmset(KEYNAMES.ITEM_DESC.getKeyName(), specialItemDescMap);
                }
                log.info("????????? " + jedis.hlen(KEYNAMES.ITEM_DATA.getKeyName()) + " ???????????????.");

            /*
              ??????????????????
             */
                MapleDataDirectoryEntry root = chrData.getRoot();
                for (MapleDataDirectoryEntry topDir : root.getSubdirectories()) {
                    if (!topDir.getName().equals("Face") && !topDir.getName().equals("Hair")) {
                        continue;
                    }
                    for (MapleDataFileEntry iFile : topDir.getFiles()) {
                        String idstr = iFile.getName().substring(3, 8);
                        if (idstr.equals("CommonFa")) {
                            continue;
                        }
                        jedis.lpush(KEYNAMES.HAIR_FACE_ID.getKeyName(), idstr);
                    }
                }
            }
        }finally {
            RedisUtil.returnResource(jedis);
        }


        /*
         * ????????????????????????
         */
        for (final MapleData d : this.itemData.getData("FamiliarOption.img")) {
            final LinkedList<StructItemOption> list2 = new LinkedList<>();
            for (final MapleData subd : d.getChildByPath("level")) {
                final StructItemOption au = new StructItemOption();
                au.opID = Integer.parseInt(d.getName());
                au.optionType = MapleDataTool.getInt("info/optionType", d, 0);
                au.reqLevel = MapleDataTool.getInt("info/reqLevel", d, 0);
                au.opString = MapleDataTool.getString("info/string", d, "");
                for (String i : StructItemOption.types) {
                    if (i.equals("face")) {
                        au.face = MapleDataTool.getString("face", subd, "");
                    } else {
                        int level = MapleDataTool.getIntConvert(i, subd, 0);
                        if (level > 0) { // Save memory
                            au.data.put(i, level);
                        }
                    }
                }
                list2.add(au);
            }
            familiar_option.put(Integer.parseInt(d.getName()), list2);
        }
    }

    private void addItemDataToRedis(MapleData data, Map<String, String> itemDataMap, boolean isSpecial, Map<String, String> specialItemNameMap, Map<String, String> specialItemDescMap) {
        Map<Object, Object> info = new HashMap<>();
        String itemid;
        if (data.getName().endsWith(".img")) {
            itemid = data.getName().substring(0, data.getName().length() - 4);
        } else {
            itemid = data.getName();
        }
        if (itemid.substring(0, 1).equals("0")) {
            itemid = itemid.substring(1, itemid.length());
        }
        try {
            for (MapleData mapleData : data) {
                if (isSpecial) {
                    putSpecialItemInfo(info, mapleData, specialItemNameMap, specialItemDescMap, itemid);
                } else {
                    switch (mapleData.getName()) {
                        case "info":
                        case "req":
                        case "consumeItem":
                        case "mob":
                        case "replace":
                        case "skill":
                        case "reward":
                        case "spec": { // ????????????
                            info.put(mapleData.getName(), MapleDataTool.getAllMapleData(mapleData));
                            break;
                        }
                    }
                }
            }

        } catch (NullPointerException e) {
            e.printStackTrace();
        }

        if (info.isEmpty()) {
            return;
        }

        // ?????????????????????Redis
        try {
            itemDataMap.put(itemid, mapper.writeValueAsString(info));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    /**
     * ??????ID???9?????????????????????????????????icon??????ID
     *
     * @param info
     * @param mapleData
     * @param specialItemNameMap
     * @param itemid
     */
    private void putSpecialItemInfo(Map<Object, Object> info, MapleData mapleData, Map<String, String> specialItemNameMap, Map<String, String> specialItemDescMap, String itemid) {
        if (mapleData.getName().equalsIgnoreCase("name")) {
            specialItemNameMap.put(itemid, MapleDataTool.getString(mapleData));
        } else if (mapleData.getName().equalsIgnoreCase("desc")) {
            specialItemDescMap.put(itemid, MapleDataTool.getString(mapleData));
        } else if (mapleData.getName().equalsIgnoreCase("icon")) {
            Map<Object, Object> subinfos = new HashMap<>();
            int inlink = 0;
            if (mapleData.getChildren().isEmpty()) {
                String link = mapleData.getData().toString();
                if (!link.isEmpty()) {
                    String[] split = link.split("/");
                    for (int i = 0, splitLength = split.length; i < splitLength; i++) {
                        String s = split[i];
                        if (i == 1 && StringUtil.isNumber(s)) {
                            inlink = Integer.valueOf(s);
                            break;
                        }
                    }
                }
            } else {
                for (MapleData mapleData1 : mapleData.getChildren()) {
                    boolean isInLink = mapleData1.getName().equals("_inlink");
                    boolean isOutLink = mapleData1.getName().equals("_outlink");
                    if (isInLink || isOutLink) {
                        String link = mapleData1.getData().toString();
                        if (!link.isEmpty()) {
                            String[] split = link.split("/");
                            for (int i = 0; i < split.length; i++) {
                                if ((isInLink && i == 0 || isOutLink && i == 3) && StringUtil.isNumber(split[i])) {
                                    inlink = Integer.valueOf(split[i]);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            if (inlink != 0) {
                subinfos.put("_inlink", inlink);
                info.put("info", subinfos);
            }
        }
    }

    /*
     * ??????ID??????????????????
     */
    public List<StructItemOption> getPotentialInfo(int potId) {
        Jedis jedis = RedisUtil.getJedis();
        try {
            String json = jedis.hget(KEYNAMES.POTENTIAL_DATA.getKeyName(), String.valueOf(potId));
            List<StructItemOption> ret = new ArrayList<>();
            if (json != null) {
                try {
                    ret = mapper.readValue(json, new TypeReference<List<StructItemOption>>() {
                    });
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            return ret;
        }finally {
            RedisUtil.returnResource(jedis);
        }
    }

    /**
     * ????????????????????????
     *
     * @return
     */
    public Map<Integer, List<StructItemOption>> getAllPotentialInfo() {
        return getPotentialInfos(-1);
    }

    /**
     * ????????????????????????
     *
     * @param potId
     * @return
     */
    public Map<Integer, List<StructItemOption>> getPotentialInfos(int potId) {
        Jedis jedis = RedisUtil.getJedis();
        try {
            Map<Integer, List<StructItemOption>> ret = new HashMap<>();
            Map<String, String> data = jedis.hgetAll(KEYNAMES.POTENTIAL_DATA.getKeyName());
            for (Entry<String, String> entry : data.entrySet()) {
                if (potId == -1 || Integer.valueOf(entry.getKey()) >= potId) {
                    try {
                        List<StructItemOption> info = mapper.readValue(entry.getValue(), new TypeReference<List<StructItemOption>>() {
                        });
                        ret.put(Integer.valueOf(entry.getKey()), info);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
            return ret;
        }finally {
            RedisUtil.returnResource(jedis);
        }
    }

    /*
     * ???????????? ????????????ID ???????????????
     */
    public String resolvePotentialId(int itemId, int potId) {
        int eqLevel = getReqLevel(itemId);
        int potLevel;
        List<StructItemOption> potInfo = getPotentialInfo(potId);
        if (eqLevel == 0) {
            potLevel = 1;
        } else {
            potLevel = (eqLevel + 1) / 10;
            potLevel++;
        }
        if (potId <= 0) {
            return "??????????????????";
        }
        StructItemOption itemOption = potInfo.get(potLevel - 1);
        String ret = itemOption.opString;
        for (int i = 0; i < itemOption.opString.length(); i++) {
            //# denotes the beginning of the parameter name that needs to be replaced, e.g. "Weapon DEF: +#incPDD"
            if (itemOption.opString.charAt(i) == '#') {
                int j = i + 2;
                while ((j < itemOption.opString.length()) && itemOption.opString.substring(i + 1, j).matches("^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$")) {
                    j++;
                }
                String curParam = itemOption.opString.substring(i, j);
                String curParamStripped;
                //get rid of any trailing percent signs on the parameter name
                if (j != itemOption.opString.length() || itemOption.opString.charAt(itemOption.opString.length() - 1) == '%') { //hacky
                    curParamStripped = curParam.substring(1, curParam.length() - 1);
                } else {
                    curParamStripped = curParam.substring(1);
                }
                String paramValue = Integer.toString(itemOption.get(curParamStripped));
                if (curParam.charAt(curParam.length() - 1) == '%') {
                    paramValue = paramValue.concat("%");
                }
                ret = ret.replace(curParam, paramValue);
            }
        }
        return ret;
    }

    /*
     * ??????ID??????????????????
     */
    public StructItemOption getSocketInfo(int socketId) {
        Jedis jedis = RedisUtil.getJedis();
        try {
            int grade = ItemConstants.getNebuliteGrade(socketId);
            String json = jedis.hget(KEYNAMES.SOCKET_DATA.getKeyName() + ":" + grade, String.valueOf(socketId));
            if (grade == -1 || json == null) {
                return null;
            }
            StructItemOption ret = null;
            try {
                ret = mapper.readValue(json, StructItemOption.class);
            } catch (IOException e) {
                e.printStackTrace();
            }
            return ret;
        }finally {
            RedisUtil.returnResource(jedis);
        }
    }

    public Map<Integer, StructItemOption> getAllSocketInfo(int grade) {
        Jedis jedis = RedisUtil.getJedis();
        try {
            Map<Integer, StructItemOption> ret = new HashMap<>();
            for (Entry<String, String> entry : jedis.hgetAll(KEYNAMES.SOCKET_DATA.getKeyName() + ":" + grade).entrySet()) {
                try {
                    ret.put(Integer.valueOf(entry.getKey()), mapper.readValue(entry.getValue(), StructItemOption.class));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            return ret;
        }finally {
            RedisUtil.returnResource(jedis);
        }
    }

    public Collection<Integer> getMonsterBookList() {
        return mobIds.values();
    }

    public Map<Integer, Integer> getMonsterBook() {
        return mobIds;
    }

    public Pair<Integer, Integer> getPot(int f) {
        return potLife.get(f);
    }

    public StructFamiliar getFamiliar(int f) {
        return familiars.get(f);
    }

    public Map<Integer, StructFamiliar> getFamiliars() {
        return familiars;
    }

    public Map<String, String> getAllItemNames() {
        Jedis jedis = RedisUtil.getJedis();
        try {
            return jedis.hgetAll(KEYNAMES.ITEM_NAME.getKeyName());
        }finally {
            RedisUtil.returnResource(jedis);
        }
    }

    public long getAllItemSize() {
        Jedis jedis = RedisUtil.getJedis();
        try {
            return jedis.hlen(KEYNAMES.ITEM_DATA.getKeyName());
        }finally {
            RedisUtil.returnResource(jedis);
        }
    }

    public StructAndroid getAndroidInfo(int i) {
        return androidInfo.get(i);
    }

//    public Triple<Integer, List<Integer>, List<Integer>> getMonsterBookInfo(int i) {
//        return monsterBookSets.get(i);
//    }
//
//    public Map<Integer, Triple<Integer, List<Integer>, List<Integer>>> getAllMonsterBookInfo() {
//        return monsterBookSets;
//    }

    protected MapleData getItemData(int itemId) {
        MapleData ret = null;
        String idStr = "0" + String.valueOf(itemId);
        MapleDataDirectoryEntry root = itemData.getRoot();
        for (MapleDataDirectoryEntry topDir : root.getSubdirectories()) {
            for (MapleDataFileEntry iFile : topDir.getFiles()) {
                if (iFile.getName().equals(idStr.substring(0, 4) + ".img")) {
                    ret = itemData.getData(topDir.getName() + "/" + iFile.getName());
                    if (ret == null) {
                        return null;
                    }
                    ret = ret.getChildByPath(idStr);
                    return ret;
                } else if (iFile.getName().equals(idStr.substring(1) + ".img")) {
                    ret = itemData.getData(topDir.getName() + "/" + iFile.getName());
                    return ret;
                }
            }
        }
        root = chrData.getRoot();
        for (MapleDataDirectoryEntry topDir : root.getSubdirectories()) {
            for (MapleDataFileEntry iFile : topDir.getFiles()) {
                if (iFile.getName().equals(idStr + ".img")) {
                    ret = chrData.getData(topDir.getName() + "/" + iFile.getName());
                    return ret;
                }
            }
        }
        return ret;
    }

    //TODO ????????????Redis??????
//    public Point getItemLt(int itemId) { // ???????????????lt???????????? 0528.img
//        MapleData item = getItemData(itemId);
//        Point pData = (Point) item.getChildByPath("info/lt").getData();
//        return pData;
//    }
//
//    public Point getItemRb(int itemId) { // ???????????????rb???????????? 0528.img
//        MapleData item = getItemData(itemId);
//        Point pData = (Point) item.getChildByPath("info/rb").getData();
//        return pData;
//    }

    public Integer getItemIdByMob(int mobId) {
        return mobIds.get(mobId);
    }

    @SuppressWarnings("unchecked")
    private <T> T getItemProperty(int itemId, String path, T defaultValue) {
        Jedis jedis = RedisUtil.getJedis();
        try {
            String json = jedis.hget(KEYNAMES.ITEM_DATA.getKeyName(), String.valueOf(itemId));
            if (json == null) {
                return defaultValue;
            }
            Map<?, ?> data = null;
            try {
                data = mapper.readValue(json, Map.class);
            } catch (IOException e) {
                e.printStackTrace();
            }
            if (data == null) {
                return defaultValue;
            }
            String[] loop = path.split("/");
            Object ret = null;
            for (String key : loop) {
                if (data.containsKey(key)) {
                    if (data.get(key) instanceof Map<?, ?>) {
                        data = (Map<?, ?>) data.get(key);
                    } else {
                        ret = data.get(key);
                        break;
                    }
                } else {
                    return defaultValue;
                }
            }

            if (ret == null) {
                ret = data;
            }
            if (ret != null && defaultValue != null && ret.getClass() != defaultValue.getClass()) {
                if (defaultValue instanceof Integer) {
                    ret = Integer.valueOf(ret.toString());
                } else if (defaultValue instanceof Double) {
                    ret = Double.valueOf(ret.toString());
                }
//            try {
//                ret = defaultValue.getClass().getMethod("valueOf", ret.getClass())
//                        .invoke(ret, ret.toString());
//            } catch (IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
//                e.printStackTrace();
//            }
            }
            return (T) ret;
        }finally {
            RedisUtil.returnResource(jedis);
        }
    }

    // TODO ????????????
    public Integer getSetId(int itemId) {
//        ItemInformation i = getItemInformation(itemId);
//        if (i == null) {
//            return null;
//        }
//        return i.cardSet;
        return 0;
    }

    /**
     * returns the maximum of items in one slot
     */
    public short getSlotMax(int itemId) {
        int ret = getItemProperty(itemId, "info/slotMax", ItemConstants.isEquip(itemId) ? 1 : 100);
        return (short) (ret == 1 && ItemConstants.isUse(itemId) ? 100 : ret);
    }

    public int getFamiliarID(int itemId) {
        for (Entry<Integer, StructFamiliar> entry : familiars.entrySet()) {
            if (entry.getValue().getMonsterCardID() == itemId)
                return entry.getKey();
        }
        return 0;
    }

    public int getPrice(int itemId) {
        return getItemProperty(itemId, "info/price", 0);
    }

    public double getUnitPrice(int itemId) {
        return getItemProperty(itemId, "info/unitPrice", -1.0);
    }

    protected int rand(int min, int max) {
        return Math.abs(Randomizer.rand(min, max));
    }

    public Equip levelUpEquip(Equip equip, Map<String, Integer> sta) {
//        Equip nEquip = (Equip) equip.copy();
        //is this all the stats?
        try {
            for (Entry<String, Integer> stat : sta.entrySet()) {
                switch (stat.getKey()) {
                    case "incSTRMin":
                        equip.setStr((short) (equip.getStr() + rand(stat.getValue(), sta.get("incSTRMax"))));
                        break;
                    case "incDEXMin":
                        equip.setDex((short) (equip.getDex() + rand(stat.getValue(), sta.get("incDEXMax"))));
                        break;
                    case "incINTMin":
                        equip.setInt((short) (equip.getInt() + rand(stat.getValue(), sta.get("incINTMax"))));
                        break;
                    case "incLUKMin":
                        equip.setLuk((short) (equip.getLuk() + rand(stat.getValue(), sta.get("incLUKMax"))));
                        break;
                    case "incPADMin":
                        equip.setWatk((short) (equip.getWatk() + rand(stat.getValue(), sta.get("incPADMax"))));
                        break;
                    case "incPDDMin":
                        equip.setWdef((short) (equip.getWdef() + rand(stat.getValue(), sta.get("incPDDMax"))));
                        break;
                    case "incMADMin":
                        equip.setMatk((short) (equip.getMatk() + rand(stat.getValue(), sta.get("incMADMax"))));
                        break;
                    case "incMDDMin":
                        equip.setMdef((short) (equip.getMdef() + rand(stat.getValue(), sta.get("incMDDMax"))));
                        break;
                    case "incACCMin":
                        equip.setAcc((short) (equip.getAcc() + rand(stat.getValue(), sta.get("incACCMax"))));
                        break;
                    case "incEVAMin":
                        equip.setAvoid((short) (equip.getAvoid() + rand(stat.getValue(), sta.get("incEVAMax"))));
                        break;
                    case "incSpeedMin":
                        equip.setSpeed((short) (equip.getSpeed() + rand(stat.getValue(), sta.get("incSpeedMax"))));
                        break;
                    case "incJumpMin":
                        equip.setJump((short) (equip.getJump() + rand(stat.getValue(), sta.get("incJumpMax"))));
                        break;
                    case "incMHPMin":
                        equip.setHp((short) (equip.getHp() + rand(stat.getValue(), sta.get("incMHPMax"))));
                        break;
                    case "incMMPMin":
                        equip.setMp((short) (equip.getMp() + rand(stat.getValue(), sta.get("incMMPMax"))));
                        break;
                    case "incMaxHPMin":
                        equip.setHp((short) (equip.getHp() + rand(stat.getValue(), sta.get("incMaxHPMax"))));
                        break;
                    case "incMaxMPMin":
                        equip.setMp((short) (equip.getMp() + rand(stat.getValue(), sta.get("incMaxMPMax"))));
                        break;
                }
            }
        } catch (NullPointerException e) {
            //catch npe because obviously the wz have some error XD
            e.printStackTrace();
        }
        return equip;
    }

//    public ItemInformation getItemInformation(int itemId) {
//        return new ItemInformation();
//    }

    public <T> T getEquipAdditions(int itemId) {
        return getEquipAdditions(itemId, "");
    }

    public <T> T getEquipAdditions(int itemId, String path) {
        return getItemProperty(itemId, "info/addition/" + path, null);
    }

    public Map<String, Map<String, Integer>> getEquipIncrements(int itemId) {
        return getItemProperty(itemId, "info/level/info", null);
    }

    public List<Integer> getEquipSkills(int itemId) {
        Map<?, ?> data = getItemProperty(itemId, "info/level/case", null);
        if (data == null) {
            return null;
        }
        List<Integer> ret = new ArrayList<>();
        for (Entry<?, ?> entry : data.entrySet()) {
            if (entry.getKey().equals("Skill") && entry.getValue() instanceof Map<?, ?>) {
                for (Entry<?, ?> subentry : ((Map<?, ?>) entry.getValue()).entrySet()) {
                    if (subentry.getValue() instanceof Map<?, ?> && ((Map<?, ?>) subentry.getValue()).containsKey("id")) {
                        ret.add((Integer) ((Map<?, ?>) subentry.getValue()).get("id"));
                    }
                }
            }
        }
        return ret;
    }

    /*
     * ???????????????????????????????????????
     */
    public boolean canEquip(int itemid, int level, int job, int fame, int str, int dex, int luk, int int_, int supremacy) {
        if ((level + supremacy) >= getReqLevel(itemid) && str >= getReqStr(itemid) && dex >= getReqDex(itemid) && luk >= getReqLuk(itemid) && int_ >= getReqInt(itemid)) {
            Integer fameReq = getReqPOP(itemid);
            if (ServerConfig.WORLD_EQUIPCHECKFAME) {
                return fameReq != null ? fame >= fameReq : fame >= 0;
            } else {
                return fameReq == null || fame >= fameReq;
            }
//            return !ServerConfig.WORLD_EQUIPCHECKFAME && (fameReq == null || fame >= fameReq);
        } else if ((level + supremacy) >= getReqLevel(itemid) && JobConstants.is???????????????(job)) {
            return true;
        } else if ((level + supremacy) >= getReqLevel(itemid) && JobConstants.is??????(job)) {
            int jobtype = getReqJob(itemid);
            if (jobtype == 0x00 || jobtype == 0x08 || jobtype == 0x10 || jobtype == 0x18) {
                return true;
            }
        }
        return false;
    }

    /**
     * ?????????????????????????????????
     */
    public int getReqLevel(int itemId) {
        return getItemProperty(itemId, "info/reqLevel", 0);
    }

    /**
     * 0x00 ???????????????
     * 0x01 ??????
     * 0x02 ??????
     * 0x04 ??????
     * 0x08 ??????
     * 0x10 ??????
     * 0x18 ?????? ?????????0x08+0x10
     */
    public int getReqJob(int itemId) {
        return getItemProperty(itemId, "info/reqJob", 0);
    }

    public int getReqStr(int itemId) {
        return getItemProperty(itemId, "info/reqSTR", 0);
    }

    public int getReqDex(int itemId) {
        return getItemProperty(itemId, "info/reqDEX", 0);
    }

    public int getReqInt(int itemId) {
        return getItemProperty(itemId, "info/reqINT", 0);
    }

    public int getReqLuk(int itemId) {
        return getItemProperty(itemId, "info/reqLUK", 0);
    }

    public Integer getReqPOP(int itemId) {
        return getItemProperty(itemId, "info/reqPOP", null);
    }

    public int getSlots(int itemId) {
        return getItemProperty(itemId, "info/tuc", 0);
    }

    public Integer getSetItemID(int itemId) {
        return getItemProperty(itemId, "info/setItemID", 0);
    }

    public StructSetItem getSetItem(int setItemId) {
        Jedis jedis = RedisUtil.getJedis();
        try {
            StructSetItem ret = null;
            try {
                ret = mapper.readValue(jedis.hget("SetItemInfo", String.valueOf(setItemId)), StructSetItem.class);
            } catch (IOException e) {
                e.printStackTrace();
            }
            return ret;
        }finally {
            RedisUtil.returnResource(jedis);
        }
    }

    public Map<Integer, Integer> getScrollReqs(int itemId) {
        return getItemProperty(itemId, "req", null);
    }

    public int getScrollSuccess(int itemId) {
        return getScrollSuccess(itemId, 0);
    }

    public int getScrollSuccess(int itemId, int def) {
        return getItemProperty(itemId, "info/success", def);
    }

    public int getScrollCursed(int itemId) {
        return getItemProperty(itemId, "info/cursed", 0);
    }

    public Map<String, Integer> getItemBaseInfo(int itemId) {
        Map<?, ?> data = getItemProperty(itemId, "info", null);
        if (data == null) {
            return null;
        }

        Map<String, Integer> ret = new HashMap<>();
        for (Entry<?, ?> entry : data.entrySet()) {
            if (entry.getValue() instanceof Integer) {
                ret.put(String.valueOf(entry.getKey()), (Integer) entry.getValue());
            }
        }
        return ret;
    }

    public Item scrollEquipWithId(Item equip, Item scroll, boolean whiteScroll, MapleCharacter chr, int vegas) {
        if (equip.getType() == 1) { //??????????????????????????????????????????
            int scrollId = scroll.getItemId();
            if (ItemConstants.isEquipScroll(scrollId)) { //??????????????????
                return scrollEnhance(equip, scroll, chr);
            } else if (ItemConstants.isPotentialScroll(scrollId)) { //????????????
                return scrollPotential(equip, scroll, chr);
            } else if (ItemConstants.isPotentialAddScroll(scrollId)) { //????????????
                return scrollPotentialAdd(equip, scroll, chr);
            } else if (ItemConstants.isLimitBreakScroll(scrollId)) { //????????????????????????
                return scrollLimitBreak(equip, scroll, chr);
            } else if (ItemConstants.isResetScroll(scrollId)) { //????????????
                return scrollResetEquip(equip, scroll, chr);
            } else if (ItemConstants.isSealedScroll(scrollId)) {
                return scrollSealedEquip(equip, scroll, chr);
            } else if (ItemConstants.isUpgradeItemEx(scrollId)) {
                return scrollUpgradeItemEx(equip, scroll, chr);
            }
            Equip nEquip = (Equip) equip;
            Map<String, Integer> data = getItemProperty(scrollId, "info", null);
            //????????????
            int succ = (ItemConstants.isTablet(scrollId) && !ItemConstants.is?????????????????????(scrollId) ? ItemConstants.getSuccessTablet(scrollId, nEquip.getLevel()) : getScrollSuccess(scrollId));
            //????????????
            int curse = (ItemConstants.isTablet(scrollId) && !ItemConstants.is?????????????????????(scrollId) ? ItemConstants.getCurseTablet(scrollId, nEquip.getLevel()) : getScrollCursed(scrollId));
            //????????????????????????
            int craft = ItemConstants.isCleanSlate(scrollId) ? 0 : chr.getTrait(MapleTraitType.craft).getLevel() / 10; //???????????????????????????
            //????????????????????????
            int lucksKey = ItemFlag.????????????.check(equip.getFlag()) ? 10 : 0; //???????????????????????????????????????
            int success = succ + lucksKey + craft + getSuccessRates(scroll.getItemId());
            if (chr.isAdmin()) {
                chr.dropSpouseMessage(0x0B, "???????????? - ????????????: " + succ + "% ????????????: " + craft + "% ??????????????????: " + lucksKey + "% ????????????: " + success + "% ??????????????????: " + curse + "%");
            }
            if (ItemFlag.????????????.check(equip.getFlag()) && !ItemConstants.isSpecialScroll(scrollId)) {
                equip.setFlag((short) (equip.getFlag() - ItemFlag.????????????.getValue()));
            }
            if (ItemConstants.isSpecialScroll(scrollId) || Randomizer.nextInt(100) <= success) {
                if (data != null) {
                    switch (scrollId) {
                        case 2612061:
                        case 2613050: {
                            data.put("PAD", Randomizer.rand(9, 12));
                            break;
                        }
                        case 2612062:
                        case 2613051: {
                            data.put("MAD", Randomizer.rand(9, 12));
                            break;
                        }
                        case 2048817:
                        case 2615031:
                        case 2616061: {
                            data.put("PAD", Randomizer.rand(5, 7));
                            break;
                        }
                        case 2046856:
                        case 2048804: {
                            data.put("PAD", Randomizer.rand(4, 5));
                            break;
                        }
                        case 2048818:
                        case 2615032:
                        case 2616062: {
                            data.put("MAD", Randomizer.rand(5, 7));
                            break;
                        }
                        case 2046857:
                        case 2048805: {
                            data.put("MAD", Randomizer.rand(4, 5));
                            break;
                        }
                        case 2046170:
                        case 2046171:
                        case 2046907:
                        case 2046909: {
                            data.put("PAD", Randomizer.rand(7, 10));
                            break;
                        }
                        case 2046908:
                        case 2046910: {
                            data.put("MAD", Randomizer.rand(7, 10));
                            break;
                        }
                        case 2612010:
                        case 2613000: {
                            data.put("PAD", Randomizer.rand(8, 11));
                            break;
                        }
                        case 2613001: {
                            data.put("MAD", Randomizer.rand(8, 11));
                            break;
                        }
                    }
                }

                NirvanaFlame oldNirvanaFlame = new NirvanaFlame(nEquip.getNirvanaFlame());

                switch (scrollId) {
                    case 2049000: //????????????
                    case 2049001: //????????????
                    case 2049002: //????????????
                    case 2049003:
                    case 2049004: //??????????????????
                    case 2049005: //??????????????????
                    case 2049024: //20%
                    case 2049025: { //100%
                        if (nEquip.getLevel() + nEquip.getUpgradeSlots() < getSlots(nEquip.getItemId()) + nEquip.getViciousHammer()) {
                            nEquip.setUpgradeSlots((byte) (nEquip.getUpgradeSlots() + 1));
                        }
                        break;
                    }
                    case 2049006: //??????????????????
                    case 2049007: //??????????????????
                    case 2049008: { //??????????????????
                        if (nEquip.getLevel() + nEquip.getUpgradeSlots() < getSlots(nEquip.getItemId()) + nEquip.getViciousHammer()) {
                            nEquip.setUpgradeSlots((byte) (nEquip.getUpgradeSlots() + 2));
                        }
                        break;
                    }
                    case 2040727: { //?????????????????? - ???????????????????????????.?????????:10%, ???????????????????????????
                        short flag = nEquip.getFlag();
                        flag |= ItemFlag.????????????.getValue();
                        nEquip.setFlag(flag);
                        break;
                    }
                    case 2041058: { //?????????????????? - ???????????????????????????.?????????:10%, ???????????????????????????
                        short flag = nEquip.getFlag();
                        flag |= ItemFlag.????????????.getValue();
                        nEquip.setFlag(flag);
                        break;
                    }
                    case 5063100: //?????????????????? - ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????10%??????????????????????????????????????????#c??????1???#????????????????????????????????????????????????????????????????????????#c??????12??????????????????????????????#???
                    case 2530000: //??????????????? - ?????????????????????????????????????????????10%??????????????????????????????????????????
                    case 2530001: { //?????????????????????
                        short flag = nEquip.getFlag();
                        flag |= ItemFlag.????????????.getValue();
                        nEquip.setFlag(flag);
                        break;
                    }
                    case 5064000: //???????????? - ???????????????????????????????????????????????????????????????????????????????????????????????????????????????#c??????1???#????????????????????????????????????????????????????????????#c??????12?????????????????????????????????# \n?????????#c???????????????????????????#???????????????
                    case 5064003: //?????????????????? - #??????????????????#????????????????????????????????????????????????????????????????????????????????????????????????#c??????1???#????????????????????????????????????????????????????????????#c??????7?????????????????????????????????# \n?????????#c?????????????????????????????????#???????????????
                    case 2531000: { //???????????? - ????????????????????????????????????????????????????????????????????????????????????#c??????1???#????????????????????????????????????????????????????????????#c??????12?????????????????????????????????#
                        short flag = nEquip.getFlag();
                        flag |= ItemFlag.????????????.getValue();
                        nEquip.setFlag(flag);
                        break;
                    }
                    case 5068100: //???????????????????????? - ????????????????????????????????? #c????????????#????????????????????????????????????????????????????????????#c????????????#,#c??????1???#??? ?????????????????????????????????????????????????????????\n?????????#c???????????????????????????#???????????????
                    case 5064100: { //???????????? - ??????????????????????????????????????????????????????????????????????????????????????????????????????#c???????????????#?????????#c??????1???#????????????????????????????????????????????????????????????\n?????????#c???????????????????????????#???????????????
                        short flag = nEquip.getFlag();
                        flag |= ItemFlag.??????????????????.getValue();
                        nEquip.setFlag(flag);
                        break;
                    }
                    case 5068200: //?????????????????????????????? - ????????????????????????????????????????????????????????????????????????. \n?????????#c??????????????????#?????? #c????????????????????????#??????????????????????????????#c???????????????????????????#?????????,????????????????????????????????????????????????\n?????????#c????????????,????????????#???????????????
                    case 5064300: { //?????????????????? - ????????????????????????????????????????????????????????????????????????. \n??????????????????????????? #c????????????????????????#??????????????????????????????#c???????????????????????????#?????????,????????????????????????????????????????????????\n?????????#c????????????,????????????#???????????????
                        short flag = nEquip.getFlag();
                        flag |= ItemFlag.????????????.getValue();
                        nEquip.setFlag(flag);
                        break;
                    }
                    default: {
                        nEquip.getNirvanaFlame().reset();
                        if (ItemConstants.isChaosScroll(scrollId)) {
                            int stat = ItemConstants.getChaosNumber(scrollId);
                            int increase = ItemConstants.isChaosForGoodness(scrollId) || isNegativeScroll(scrollId) ? 1 : Randomizer.nextBoolean() ? 1 : -1;
                            if (nEquip.getStr() > 0) {
                                nEquip.setStr((short) (nEquip.getStr() + (Randomizer.nextInt(stat) + 1) * increase));
                            }
                            if (nEquip.getDex() > 0) {
                                nEquip.setDex((short) (nEquip.getDex() + (Randomizer.nextInt(stat) + 1) * increase));
                            }
                            if (nEquip.getInt() > 0) {
                                nEquip.setInt((short) (nEquip.getInt() + (Randomizer.nextInt(stat) + 1) * increase));
                            }
                            if (nEquip.getLuk() > 0) {
                                nEquip.setLuk((short) (nEquip.getLuk() + (Randomizer.nextInt(stat) + 1) * increase));
                            }
                            if (nEquip.getWatk() > 0) {
                                nEquip.setWatk((short) (nEquip.getWatk() + (Randomizer.nextInt(stat) + 1) * increase));
                            }
                            if (nEquip.getWdef() > 0) {
                                nEquip.setWdef((short) (nEquip.getWdef() + (Randomizer.nextInt(stat) + 1) * increase));
                            }
                            if (nEquip.getMatk() > 0) {
                                nEquip.setMatk((short) (nEquip.getMatk() + (Randomizer.nextInt(stat) + 1) * increase));
                            }
                            if (nEquip.getMdef() > 0) {
                                nEquip.setMdef((short) (nEquip.getMdef() + (Randomizer.nextInt(stat) + 1) * increase));
                            }
                            if (nEquip.getAcc() > 0) {
                                nEquip.setAcc((short) (nEquip.getAcc() + (Randomizer.nextInt(stat) + 1) * increase));
                            }
                            if (nEquip.getAvoid() > 0) {
                                nEquip.setAvoid((short) (nEquip.getAvoid() + (Randomizer.nextInt(stat) + 1) * increase));
                            }
                            if (nEquip.getSpeed() > 0) {
                                nEquip.setSpeed((short) (nEquip.getSpeed() + (Randomizer.nextInt(stat) + 1) * increase));
                            }
                            if (nEquip.getJump() > 0) {
                                nEquip.setJump((short) (nEquip.getJump() + (Randomizer.nextInt(stat) + 1) * increase));
                            }
                            if (nEquip.getHp() > 0) {
                                nEquip.setHp((short) (nEquip.getHp() + (Randomizer.nextInt(stat) + 1) * increase));
                            }
                            if (nEquip.getMp() > 0) {
                                nEquip.setMp((short) (nEquip.getMp() + (Randomizer.nextInt(stat) + 1) * increase));
                            }
                            break;
                        } else if (ItemConstants.isCleanSlate(scrollId)) {
                            int recover = getRecover(scrollId);
                            int slots = getSlots(nEquip.getItemId());
                            if (nEquip.getLevel() + nEquip.getUpgradeSlots() < slots + nEquip.getViciousHammer()) {
                                nEquip.setUpgradeSlots((byte) (nEquip.getUpgradeSlots() + recover));
                                break;
                            }
                            if (chr.isAdmin()) {
                                chr.dropMessage(-9, "?????????????????????????????????????????? " + (recover == 0) + " ??????????????????????????? " + (nEquip.getLevel() + nEquip.getUpgradeSlots() >= slots + nEquip.getViciousHammer()));
                                break;
                            }
                            break;
                        } else {
                            for (Entry<?, ?> entry : data.entrySet()) {
                                if (!(entry.getValue() instanceof Integer)) {
                                    continue;
                                }

                                String key = ((String) entry.getKey()).toUpperCase();
                                key = key.startsWith("INC") ? key.substring(3) : key;
                                Integer value = (Integer) entry.getValue();
                                switch (key) {
                                    case "STR":
                                        nEquip.setStr((short) (nEquip.getStr() + value));
                                        break;
                                    case "DEX":
                                        nEquip.setDex((short) (nEquip.getDex() + value));
                                        break;
                                    case "INT":
                                        nEquip.setInt((short) (nEquip.getInt() + value));
                                        break;
                                    case "LUK":
                                        nEquip.setLuk((short) (nEquip.getLuk() + value));
                                        break;
                                    case "PAD":
                                        nEquip.setWatk((short) (nEquip.getWatk() + value));
                                        break;
                                    case "PDD":
                                        nEquip.setWdef((short) (nEquip.getWdef() + value));
                                        break;
                                    case "MAD":
                                        nEquip.setMatk((short) (nEquip.getMatk() + value));
                                        break;
                                    case "MDD":
                                        nEquip.setMdef((short) (nEquip.getMdef() + value));
                                        break;
                                    case "ACC":
                                        nEquip.setAcc((short) (nEquip.getAcc() + value));
                                        break;
                                    case "EVA":
                                        nEquip.setAvoid((short) (nEquip.getAvoid() + value));
                                        break;
                                    case "SPEED":
                                        nEquip.setSpeed((short) (nEquip.getSpeed() + value));
                                        break;
                                    case "JUMP":
                                        nEquip.setJump((short) (nEquip.getJump() + value));
                                        break;
                                    case "MHP":
                                        nEquip.setHp((short) (nEquip.getHp() + value));
                                        break;
                                    case "MMP":
                                        nEquip.setMp((short) (nEquip.getMp() + value));
                                        break;
                                }
                            }
                            break;
                        }
                    }
                }
                nEquip.setNirvanaFlame(oldNirvanaFlame);
                //????????????????????????
                if (!ItemConstants.isCleanSlate(scrollId) && !ItemConstants.isSpecialScroll(scrollId)) {
                    short oldFlag = nEquip.getFlag();
                    if (ItemFlag.??????????????????.check(oldFlag)) {
                        nEquip.setFlag((short) (oldFlag - ItemFlag.??????????????????.getValue()));
                    }
                    int scrollUseSlots = ItemConstants.isAzwanScroll(scrollId) ? getSlots(scrollId) : 1;
                    nEquip.setUpgradeSlots((byte) (nEquip.getUpgradeSlots() - scrollUseSlots));
                    nEquip.setLevel((byte) (nEquip.getLevel() + scrollUseSlots));
                }
            } else {
                //????????????????????????
                if (!whiteScroll && !ItemConstants.isCleanSlate(scrollId) && !ItemConstants.isSpecialScroll(scrollId)) {
                    short oldFlag = nEquip.getFlag();
                    if (ItemFlag.??????????????????.check(oldFlag)) {
                        nEquip.setFlag((short) (oldFlag - ItemFlag.??????????????????.getValue()));
                        chr.dropSpouseMessage(0x0B, "???????????????????????????????????????????????????");
                    } else if (!MapleItemInformationProvider.getInstance().hasSafetyShield(scrollId)) {
                        int scrollUseSlots = ItemConstants.isAzwanScroll(scrollId) ? getSlots(scrollId) : 1;
                        nEquip.setUpgradeSlots((byte) (nEquip.getUpgradeSlots() - scrollUseSlots));
                    }
                }
                if (Randomizer.nextInt(99) + 1 < curse) {
                    return null;
                }
            }
        }
        return equip;
    }

    /*
     * ??????????????????
     */
    public Item scrollEnhance(Item equip, Item scroll, MapleCharacter chr) {
        if (equip.getType() != 1) {
            return equip;
        }
        Equip nEquip = (Equip) equip;
        if (nEquip.getEnhance() >= ItemConstants.getMaxEnhance(nEquip.getItemId())) {
            return equip;
        }
        int scrollId = scroll.getItemId();
        boolean noCursed = isNoCursedScroll(scrollId);
        int scrollForceUpgrade = getForceUpgrade(scrollId);
        int succ = getScrollSuccess(scrollId); //????????????
        int curse = noCursed ? 0 : getScrollCursed(scrollId); //???????????? ???????????????100%??????
        int craft = chr.getTrait(MapleTraitType.craft).getLevel() / 10; //???????????????????????????
        if (scrollForceUpgrade == 1 && succ == 0) {
            succ = Math.max((scroll.getItemId() == 2049301 || scroll.getItemId() == 2049307 ? 80 : 100) - nEquip.getEnhance() * 10, 5);
        }
        int success = succ + succ * craft / 100;
        if (chr.isAdmin()) {
            chr.dropSpouseMessage(11, "?????????????????? - ????????????: " + succ + "% ????????????: " + craft + "% ????????????: " + success + "% ??????????????????: " + curse + "% ?????????????????????????????????: " + noCursed);
        }
        if (Randomizer.nextInt(100) > success) {
            return Randomizer.nextInt(99) < curse ? null : nEquip;
        }
        NirvanaFlame nirvanaFlame = new NirvanaFlame(nEquip.getNirvanaFlame());
        nEquip.getNirvanaFlame().reset();
        for (int i2 = 0; i2 < scrollForceUpgrade; ++i2) {
            EnchantHandler.Companion.toEnchantScrollHandler(nEquip, false);
        }
        nEquip.setNirvanaFlame(nirvanaFlame);
        return nEquip;
    }

    /*
     * ??????????????????
     */
    public Item scrollPotential(Item equip, Item scroll, MapleCharacter chr) {
        if (equip.getType() != 1) {
            return equip;
        }
        final Equip nEquip = (Equip) equip;
        int scrollId = scroll.getItemId();
        int success = getScrollSuccess(scrollId, 0);
        boolean noCursed = isNoCursedScroll(scrollId);
        int succ = 0;
        int n2 = 100;
        String s;
        if (scrollId / 100 == 20494) {
            s = "??????";
            n2 = (noCursed ? 0 : 100);
            switch (scrollId) {
                case 2049402:
                case 2049404:
                case 2049405:
                case 2049406:
                case 2049414:
                case 2049415:
                case 2049417:
                case 2049418:
                case 2049419:
                case 2049420: {
                    succ = 100;
                    break;
                }
                case 2049400:
                case 2049407:
                case 2049412: {
                    succ = 90;
                    break;
                }
                case 2049421:
                case 2049424: {
                    succ = 80;
                    break;
                }
                case 2049401:
                case 2049408:
                case 2049416: {
                    succ = 70;
                    break;
                }
            }
            switch (scrollId) {
                case 2049405:
                case 2049414:
                case 2049415:
                case 2049420:
                case 2049421:
                case 2049424: {
                    s = "??????";
                    n2 = 0;
                    break;
                }
            }
        } else if (scrollId / 100 == 20497) {
            succ = success;
            n2 = noCursed ? 0 : getScrollCursed(scrollId);
            if (scrollId >= 2049700 && scrollId < 2049750) {
                s = "A???";
            } else if (scrollId >= 2049750 && scrollId < 2049759) {
                s = "S???";
            } else if (scrollId == 2049762) {
                s = "S???";
            } else {
                succ = 0;
                s = "??????";
            }
        } else {
            s = "??????";
        }
        if (chr.isAdmin()) {
            chr.dropSpouseMessage(11, s + "?????????????????? - ????????????: " + succ + "% ??????????????????: " + n2 + "% ?????????????????????????????????: " + noCursed);
        }
        if (succ <= 0) {
            chr.dropMessage(1, "????????????: " + scroll.getItemId() + " - " + this.getName(scroll.getItemId()) + " ???????????????: " + succ + " ??????????????????????????????");
            chr.sendEnableActions();
            return nEquip;
        }
        if (nEquip.getState(false) != 0) {
            return nEquip;
        }
        if (Randomizer.nextInt(100) > succ) {
            return (Randomizer.nextInt(99) < n2) ? null : nEquip;
        }
        if (scrollId >= 2049700 && scrollId < 2049750) {
            nEquip.renewPotential_A();
        } else if ((scrollId >= 2049750 && scrollId < 2049759) || scrollId == 2049762) {
            nEquip.renewPotential_S();
        } else if (scrollId == 2049419) {
            final int n3 = (Randomizer.nextInt(100) < 10) ? ((Randomizer.nextInt(100) < 5) ? -19 : -18) : -17;
            nEquip.setPotential(n3, 1, false);
            nEquip.setPotential(n3, 2, false);
            nEquip.setPotential(n3, 3, false);
            nEquip.initAllState();
        } else {
            nEquip.renewPotential(false);
        }
        return nEquip;
    }

    /*
     * ??????????????????
     */
    public Item scrollPotentialAdd(Item equip, Item scroll, MapleCharacter chr) {
        if (equip.getType() != 1) { //??????????????????????????????????????????
            return equip;
        }
        Equip nEquip = (Equip) equip;
        int scrollId = scroll.getItemId();
        int succ = 0;
        switch (scrollId) {
            case 2048306:
            case 2048307:
            case 2048315: {
                succ = 100;
                break;
            }
            case 2048313: {
                succ = 80;
                break;
            }
            case 2048305: {
                succ = 70;
                break;
            }
            case 2048309:
            case 2048310:
            case 2048314:
            case 2048332: {
                succ = 60;
                break;
            }
            case 2048308:
            case 2048311: {
                succ = 50;
                break;
            }
            case 2048312: {
                succ = 1;
                break;
            }
        }
        int curse = 0;
        switch (scrollId) {
            case 2048305:
            case 2048310: {
                curse = 100;
                break;
            }
            case 2048308:
            case 2048311: {
                curse = 50;
                break;
            }
        }
        if (succ <= 0) {
            chr.dropMessage(1, "????????????: " + scrollId + " - " + this.getName(scrollId) + " ???????????????: " + succ + " ??????????????????????????????");
            chr.sendEnableActions();
            return nEquip;
        }
        if (chr.isAdmin()) {
            chr.dropSpouseMessage(11, "???????????????????????? - ????????????: " + succ + "% ??????????????????: " + curse + "% ?????????????????????????????????: " + (curse <= 0));
        }
        if (Randomizer.nextInt(100) <= succ) {
            if (scrollId == 2048306) {
                nEquip.renewPotential(true, true);
            } else {
                nEquip.renewPotential(true);
            }
        } else if (Randomizer.nextInt(99) < curse) {
            return null;
        }
        return nEquip;
    }

    /*
     * ??????????????????????????????????????????
     */
    public Item scrollLimitBreak(Item equip, Item scroll, MapleCharacter chr) {
        if (equip.getType() != 1) { //??????????????????????????????????????????
            return equip;
        }
        Equip nEquip = (Equip) equip;
        int scrollId = scroll.getItemId();
        int succe = getScrollSuccess(scrollId); //????????????
        int craft = chr.getTrait(MapleTraitType.craft).getLevel() / 10; //???????????????????????????
        int lucksKey = ItemFlag.????????????.check(equip.getFlag()) ? 10 : 0; //???????????????????????????????????????
        if (ItemFlag.????????????.check(equip.getFlag())) {
            equip.setFlag((short) (equip.getFlag() - ItemFlag.????????????.getValue()));
        }
        int success = succe + craft + lucksKey;
        if (chr.isAdmin()) {
            chr.dropSpouseMessage(0x0B, "???????????????????????? - ????????????: " + succe + "% ????????????: " + craft + "% ????????????????????????: " + lucksKey + "% ????????????: " + success + "%");
        }
        if (Randomizer.nextInt(100) <= success) {
            int limitBreak = getScrollLimitBreak(scrollId) + nEquip.getLimitBreak();
            if (ItemConstants.isWeapon(nEquip.getItemId()) && (limitBreak <= ServerConfig.CHANNEL_PLAYER_LIMITBREAK)) {
                nEquip.setLimitBreak(limitBreak);
            }
        }
        return nEquip;
    }
    
    /* 
     * ??????????????????
    */

    /*
     * ????????????
     */
    public Item scrollResetEquip(Item equip, Item scroll, MapleCharacter chr) {
        if (equip.getType() != 1) { //??????????????????????????????????????????
            return equip;
        }
        Equip nEquip = (Equip) equip;
        int scrollId = scroll.getItemId();
        int succe = getScrollSuccess(scrollId); //????????????
        int curse = getScrollCursed(scrollId); //????????????
        int craft = chr.getTrait(MapleTraitType.craft).getLevel() / 10; //????????????????????????
        int lucksKey = ItemFlag.????????????.check(equip.getFlag()) ? 10 : 0; //???????????????????????????????????????
        if (ItemFlag.????????????.check(equip.getFlag())) {
            equip.setFlag((short) (equip.getFlag() - ItemFlag.????????????.getValue()));
        }
        int success = succe + craft + lucksKey;
        if (chr.isAdmin()) {
            chr.dropSpouseMessage(0x0B, "???????????? - ????????????: " + succe + "% ????????????: " + craft + "% ????????????????????????: " + lucksKey + "% ????????????: " + success + "% ??????????????????: " + curse + "%");
        }
        if (Randomizer.nextInt(100) <= success) {
            return resetEquipStats(nEquip);
        } else if (Randomizer.nextInt(99) < curse) {
            return null;
        }
        return nEquip;
    }

    public Item scrollUpgradeItemEx(Item equip, Item scroll, MapleCharacter chr) {
        if (equip.getType() != 1) {
            return equip;
        }
        Equip nEquip = (Equip) equip;
        int scrollId = scroll.getItemId();
        int succe = getScrollSuccess(scrollId); //????????????
        int curse = getScrollCursed(scrollId); //????????????
        int craft = chr.getTrait(MapleTraitType.craft).getLevel() / 10; //????????????????????????
        int lucksKey = ItemFlag.????????????.check(equip.getFlag()) ? 10 : 0; //???????????????????????????????????????
        if (ItemFlag.????????????.check(equip.getFlag())) {
            equip.setFlag((short) (equip.getFlag() - ItemFlag.????????????.getValue()));
        }
        int success = succe + craft + lucksKey;
        if (chr.isAdmin()) {
            chr.dropSpouseMessage(0x0B, "???????????? - ????????????: " + succe + "% ????????????: " + craft + "% ????????????????????????: " + lucksKey + "% ????????????: " + success + "% ??????????????????: " + curse + "%");
        }
        if (Randomizer.nextInt(100) <= success) {
            NirvanaFlame.Companion.randomState(nEquip, scrollId);
            short flag = equip.getFlag();
            if (!ItemFlag.????????????.check(flag) && !isAccountShared(equip.getItemId())) {
                nEquip.setKarmaCount((short) 10);
                flag |= (short) ItemFlag.????????????.getValue();
            }
            equip.setFlag(flag);
        }
        return nEquip;
    }

    public Item scrollSealedEquip(Item equip, Item scroll, MapleCharacter chr) {
        if (equip.getType() != 1) { //??????????????????????????????????????????
            return equip;
        }
        Equip nEquip = (Equip) equip;
        if (!nEquip.isSealedEquip()) {
            chr.dropSpouseMessage(0x0B, "???????????????????????????????????????????????????");
            return equip;
        }
        boolean success = false;
        byte sealedlevel = nEquip.getSealedLevel();
        boolean isAccessory = ItemConstants.isAccessory(equip.getItemId());
        switch (sealedlevel) {
            case 1:
                success = true;
                break;
            case 2:
                success = Randomizer.nextInt(100) < (isAccessory ? 10 : 90);
                break;
            case 3:
                success = Randomizer.nextInt(100) < 80;
                break;
            case 4:
                success = Randomizer.nextInt(100) < 70;
                break;
            case 5:
                success = Randomizer.nextInt(100) < 50;
                break;
        }
        List<Pair<String, Integer>> sealedinfo = getSealedEquipInfo(equip.getItemId(), sealedlevel);
        if (sealedinfo == null) {
            return equip;
        }
        if (success) {
            for (Pair<String, Integer> info : sealedinfo) {
                if (info.left.endsWith("STR")) {
                    nEquip.setStr((short) (nEquip.getStr() + info.right));
                }
                if (info.left.endsWith("DEX")) {
                    nEquip.setDex((short) (nEquip.getDex() + info.right));
                }
                if (info.left.endsWith("INT")) {
                    nEquip.setInt((short) (nEquip.getInt() + info.right));
                }
                if (info.left.endsWith("LUK")) {
                    nEquip.setLuk((short) (nEquip.getLuk() + info.right));
                }
                if (info.left.endsWith("PDD")) {
                    nEquip.setWdef((short) (nEquip.getWdef() + info.right));
                }
                if (info.left.endsWith("MDD")) {
                    nEquip.setMdef((short) (nEquip.getMdef() + info.right));
                }
                if (info.left.endsWith("MHP")) {
                    nEquip.setHp((short) (nEquip.getHp() + info.right));
                }
                if (info.left.endsWith("MMP")) {
                    nEquip.setMp((short) (nEquip.getMp() + info.right));
                }
                if (info.left.endsWith("PAD")) {
                    nEquip.setWatk((short) (nEquip.getWatk() + info.right));
                }
                if (info.left.endsWith("MAD")) {
                    nEquip.setMatk((short) (nEquip.getMatk() + info.right));
                }
                if (info.left.endsWith("ACC")) {
                    nEquip.setAcc((short) (nEquip.getAcc() + info.right));
                }
                if (info.left.endsWith("EVA")) {
                    nEquip.setAvoid((short) (nEquip.getAvoid() + info.right));
                }
                if (info.left.endsWith("IMDR")) {
                    nEquip.setIgnorePDR((short) (nEquip.getIgnorePDR() + info.right));
                }
                if (info.left.endsWith("BDR") || info.left.endsWith("bdR")) {
                    nEquip.setBossDamage((short) (nEquip.getBossDamage() + info.right));
                }
            }
            nEquip.setSealedLevel((byte) (sealedlevel + 1));
        } else {
            for (Pair<String, Integer> info : sealedinfo) {
                if (info.left.endsWith("STR")) {
                    nEquip.setStr((short) (nEquip.getStr() - info.right));
                }
                if (info.left.endsWith("DEX")) {
                    nEquip.setDex((short) (nEquip.getDex() - info.right));
                }
                if (info.left.endsWith("INT")) {
                    nEquip.setInt((short) (nEquip.getInt() - info.right));
                }
                if (info.left.endsWith("LUK")) {
                    nEquip.setLuk((short) (nEquip.getLuk() - info.right));
                }
                if (info.left.endsWith("PDD")) {
                    nEquip.setWdef((short) (nEquip.getWdef() - info.right));
                }
                if (info.left.endsWith("MDD")) {
                    nEquip.setMdef((short) (nEquip.getMdef() - info.right));
                }
                if (info.left.endsWith("MHP")) {
                    nEquip.setHp((short) (nEquip.getHp() - info.right));
                }
                if (info.left.endsWith("MMP")) {
                    nEquip.setMp((short) (nEquip.getMp() - info.right));
                }
                if (info.left.endsWith("PAD")) {
                    nEquip.setWatk((short) (nEquip.getWatk() - info.right));
                }
                if (info.left.endsWith("MAD")) {
                    nEquip.setMatk((short) (nEquip.getMatk() - info.right));
                }
                if (info.left.endsWith("ACC")) {
                    nEquip.setAcc((short) (nEquip.getAcc() - info.right));
                }
                if (info.left.endsWith("EVA")) {
                    nEquip.setAvoid((short) (nEquip.getAvoid() - info.right));
                }
                if (info.left.endsWith("IMDR")) {
                    nEquip.setIgnorePDR((short) (nEquip.getIgnorePDR() - info.right));
                }
                if (info.left.endsWith("BDR") || info.left.endsWith("bdR")) {
                    nEquip.setBossDamage((short) (nEquip.getBossDamage() - info.right));
                }
            }
            nEquip.setSealedLevel((byte) (sealedlevel - 1));
        }
        nEquip.setSealedExp(0);
        return nEquip;
    }

    /*
     * ??????????????????????????? ?????? ???????????? ????????????????????????
     */
    public Equip resetEquipStats(Equip oldEquip) {
        Equip newEquip = (Equip) getEquipById(oldEquip.getItemId());
        //????????????????????? ?????? ?????????????????????
        newEquip.setState(oldEquip.getState(false), false); //??????????????????????????????
        newEquip.setState(oldEquip.getState(true), true); //??????????????????????????????
        newEquip.setStateMsg(oldEquip.getStateMsg()); //????????????????????????????????????
        newEquip.setPotential1(oldEquip.getPotential1()); //?????????????????????????????? 1
        newEquip.setPotential2(oldEquip.getPotential2()); //?????????????????????????????? 2
        newEquip.setPotential3(oldEquip.getPotential3()); //?????????????????????????????? 3
        newEquip.setPotential4(oldEquip.getPotential4()); //?????????????????????????????? 4
        newEquip.setPotential5(oldEquip.getPotential5()); //?????????????????????????????? 5
        newEquip.setPotential6(oldEquip.getPotential6()); //?????????????????????????????? 6
        newEquip.setSocket1(oldEquip.getSocket1()); //?????????????????????????????? 1
        newEquip.setSocket2(oldEquip.getSocket2()); //?????????????????????????????? 2
        newEquip.setSocket3(oldEquip.getSocket3()); //?????????????????????????????? 3
        newEquip.setItemSkin(oldEquip.getItemSkin()); //??????????????????????????????
        //?????????????????????????????????????????????
        newEquip.setPosition(oldEquip.getPosition());
        newEquip.setQuantity(oldEquip.getQuantity());
        newEquip.setFlag(oldEquip.getFlag());
        newEquip.setOwner(oldEquip.getOwner());
        newEquip.setGMLog(oldEquip.getGMLog());
        newEquip.setExpiration(oldEquip.getExpiration());
        newEquip.setUniqueId(oldEquip.getUniqueId());
        newEquip.setEquipOnlyId(oldEquip.getEquipOnlyId());
        newEquip.setSealedLevel(oldEquip.getSealedLevel());
        newEquip.setSealedExp(oldEquip.getSealedExp());
        newEquip.setBossDamage(oldEquip.getBossDamage());
        newEquip.setIgnorePDR(oldEquip.getIgnorePDR());
        newEquip.setAllStat(oldEquip.getAllStat());
        return newEquip;
    }

    public Item getEquipById(int equipId) {
        return getEquipById(equipId, -1);
    }

    public Item getEquipById(int equipId, int ringId) {
        if (!ItemConstants.isEquip(equipId)) {
            throw new RuntimeException("?????????ID: " + equipId);
        }
        Map<?, ?> data = getItemProperty(equipId, "info", null);
        Equip ret = new Equip(equipId, (short) 0, ringId, (byte) 0, (short) 0);
        if (data == null) {
            return ret;
        }

        short stats = ItemConstants.getStat(equipId, 0);
        if (stats > 0) {
            ret.setStr(stats);
            ret.setDex(stats);
            ret.setInt(stats);
            ret.setLuk(stats);
        }
        stats = ItemConstants.getATK(equipId, 0);
        if (stats > 0) {
            ret.setWatk(stats);
            ret.setMatk(stats);
        }
        stats = ItemConstants.getHpMp(equipId, 0);
        if (stats > 0) {
            ret.setHp(stats);
            ret.setMp(stats);
        }
        stats = ItemConstants.getDEF(equipId, 0);
        if (stats > 0) {
            ret.setWdef(stats);
            ret.setMdef(stats);
        }

        for (Entry<?, ?> entry : data.entrySet()) {
            if (!StringUtil.isNumber(entry.getValue().toString())) {
                continue;
            }

            String key = ((String) entry.getKey()).toUpperCase();
            key = key.startsWith("INC") ? key.substring(3) : key;
            Integer value = Integer.parseInt(entry.getValue().toString());
            switch (key) {
                case "STR":
                    ret.setStr(value.shortValue());
                    break;
                case "DEX":
                    ret.setDex(value.shortValue());
                    break;
                case "INT":
                    ret.setInt(value.shortValue());
                    break;
                case "LUK":
                    ret.setLuk(value.shortValue());
                    break;
                case "PAD":
                    ret.setWatk(value.shortValue());
                    break;
                case "PDD":
                    ret.setWdef(value.shortValue());
                    break;
                case "MAD":
                    ret.setMatk(value.shortValue());
                    break;
                case "MDD":
                    ret.setMdef(value.shortValue());
                    break;
                case "ACC":
                    ret.setAcc(value.shortValue());
                    break;
                case "EVA":
                    ret.setAvoid(value.shortValue());
                    break;
                case "SPEED":
                    ret.setSpeed(value.shortValue());
                    break;
                case "JUMP":
                    ret.setJump(value.shortValue());
                    break;
                case "MHP":
                    ret.setHp(value.shortValue());
                    break;
                case "MMP":
                    ret.setMp(value.shortValue());
                    break;
                case "TUC":
                    ret.setUpgradeSlots(value.byteValue());
                    break;
                case "CRAFT":
                    ret.setHands(value.shortValue());
                    break;
                case "DURABILITY":
                    ret.setDurability(value);
                    break;
                case "CHARMEXP":
                    ret.setCharmEXP(value.shortValue());
                    break;
                case "PVPDAMAGE":
                    ret.setPVPDamage(value.shortValue());
                    break;
                case "BDR":
                    ret.setBossDamage(value.shortValue());
                    break;
                case "IMDR":
                    ret.setIgnorePDR(value.shortValue());
                    break;
                case "DAMR":
                    ret.setTotalDamage(value.shortValue());
                    break;
                case "ARC":
                    ret.setARC(value.shortValue());
                    break;
            }
        }

        Object cash = data.get("cash");
        if (cash != null && Boolean.valueOf(cash.toString()) && ret.getCharmEXP() <= 0) {
            short exp = 0;
            int identifier = equipId / 10000;
            if (ItemConstants.isWeapon(equipId) || identifier == 106) { //weapon overall
                exp = 60;
            } else if (identifier == 100) { //hats
                exp = 50;
            } else if (ItemConstants.isAccessory(equipId) || identifier == 102 || identifier == 108 || identifier == 107) { //gloves shoes accessory
                exp = 40;
            } else if (identifier == 104 || identifier == 105 || identifier == 110) { //top bottom cape
                exp = 30;
            }
            ret.setCharmEXP(exp);
        }

        ret.setUniqueId(ringId);
        return ret;
    }

    protected short getRandStatFusion(short defaultValue, int value1, int value2) {
        if (defaultValue == 0) {
            return 0;
        }
        int range = ((value1 + value2) / 2) - defaultValue;
        int rand = Randomizer.nextInt(Math.abs(range) + 1);
        return (short) (defaultValue + (range < 0 ? -rand : rand));
    }

    protected short getRandStat(short defaultValue, int maxRange) {
        if (defaultValue == 0) {
            return 0;
        }
        // vary no more than ceil of 10% of stat
        int lMaxRange = (int) Math.min(Math.ceil(defaultValue * 0.1), maxRange);
        return (short) ((defaultValue - lMaxRange) + Randomizer.nextInt(lMaxRange * 2 + 1));
    }

    protected short getRandStatAbove(short defaultValue, int maxRange) {
        if (defaultValue <= 0) {
            return 0;
        }
        int lMaxRange = (int) Math.min(Math.ceil(defaultValue * 0.1), maxRange);
        return (short) ((defaultValue) + Randomizer.nextInt(lMaxRange + 1));
    }

    public Equip randomizeStats(Equip equip) {
        equip.setStr(getRandStat(equip.getStr(), 5));
        equip.setDex(getRandStat(equip.getDex(), 5));
        equip.setInt(getRandStat(equip.getInt(), 5));
        equip.setLuk(getRandStat(equip.getLuk(), 5));
        equip.setMatk(getRandStat(equip.getMatk(), 5));
        equip.setWatk(getRandStat(equip.getWatk(), 5));
        equip.setAcc(getRandStat(equip.getAcc(), 5));
        equip.setAvoid(getRandStat(equip.getAvoid(), 5));
        equip.setJump(getRandStat(equip.getJump(), 5));
        equip.setHands(getRandStat(equip.getHands(), 5));
        equip.setSpeed(getRandStat(equip.getSpeed(), 5));
        equip.setWdef(getRandStat(equip.getWdef(), 10));
        equip.setMdef(getRandStat(equip.getMdef(), 10));
        equip.setHp(getRandStat(equip.getHp(), 10));
        equip.setMp(getRandStat(equip.getMp(), 10));
        equip.setSealedLevel((byte) (equip.isSealedEquip() ? 1 : 0));
        equip.setBossDamage((short) getBossDamageRate(equip.getItemId()));
        equip.setIgnorePDR((short) getIgnoreMobDmageRate(equip.getItemId()));
        equip.setTotalDamage((short) getTotalDamage(equip.getItemId()));
        equip.setPotential1(getOption(equip.getItemId(), 1));
        equip.setPotential2(getOption(equip.getItemId(), 2));
        equip.setPotential3(getOption(equip.getItemId(), 3));
        return equip;
    }

    public Equip randomizeStats_Above(Equip equip) {
        equip.setStr(getRandStatAbove(equip.getStr(), 5));
        equip.setDex(getRandStatAbove(equip.getDex(), 5));
        equip.setInt(getRandStatAbove(equip.getInt(), 5));
        equip.setLuk(getRandStatAbove(equip.getLuk(), 5));
        equip.setMatk(getRandStatAbove(equip.getMatk(), 5));
        equip.setWatk(getRandStatAbove(equip.getWatk(), 5));
        equip.setAcc(getRandStatAbove(equip.getAcc(), 5));
        equip.setAvoid(getRandStatAbove(equip.getAvoid(), 5));
        equip.setJump(getRandStatAbove(equip.getJump(), 5));
        equip.setHands(getRandStatAbove(equip.getHands(), 5));
        equip.setSpeed(getRandStatAbove(equip.getSpeed(), 5));
        equip.setWdef(getRandStatAbove(equip.getWdef(), 10));
        equip.setMdef(getRandStatAbove(equip.getMdef(), 10));
        equip.setHp(getRandStatAbove(equip.getHp(), 10));
        equip.setMp(getRandStatAbove(equip.getMp(), 10));
        equip.setSealedLevel((byte) (equip.isSealedEquip() ? 1 : 0));
        equip.setBossDamage((short) getBossDamageRate(equip.getItemId()));
        equip.setIgnorePDR((short) getIgnoreMobDmageRate(equip.getItemId()));
        equip.setTotalDamage((short) getTotalDamage(equip.getItemId()));
        equip.setPotential1(getOption(equip.getItemId(), 1));
        equip.setPotential2(getOption(equip.getItemId(), 2));
        equip.setPotential3(getOption(equip.getItemId(), 3));
        return equip;
    }

    public Equip fuse(Equip equip1, Equip equip2) {
        if (equip1.getItemId() != equip2.getItemId()) {
            return equip1;
        }
        Equip equip = (Equip) getEquipById(equip1.getItemId());
        equip.setStr(getRandStatFusion(equip.getStr(), equip1.getStr(), equip2.getStr()));
        equip.setDex(getRandStatFusion(equip.getDex(), equip1.getDex(), equip2.getDex()));
        equip.setInt(getRandStatFusion(equip.getInt(), equip1.getInt(), equip2.getInt()));
        equip.setLuk(getRandStatFusion(equip.getLuk(), equip1.getLuk(), equip2.getLuk()));
        equip.setMatk(getRandStatFusion(equip.getMatk(), equip1.getMatk(), equip2.getMatk()));
        equip.setWatk(getRandStatFusion(equip.getWatk(), equip1.getWatk(), equip2.getWatk()));
        equip.setAcc(getRandStatFusion(equip.getAcc(), equip1.getAcc(), equip2.getAcc()));
        equip.setAvoid(getRandStatFusion(equip.getAvoid(), equip1.getAvoid(), equip2.getAvoid()));
        equip.setJump(getRandStatFusion(equip.getJump(), equip1.getJump(), equip2.getJump()));
        equip.setHands(getRandStatFusion(equip.getHands(), equip1.getHands(), equip2.getHands()));
        equip.setSpeed(getRandStatFusion(equip.getSpeed(), equip1.getSpeed(), equip2.getSpeed()));
        equip.setWdef(getRandStatFusion(equip.getWdef(), equip1.getWdef(), equip2.getWdef()));
        equip.setMdef(getRandStatFusion(equip.getMdef(), equip1.getMdef(), equip2.getMdef()));
        equip.setHp(getRandStatFusion(equip.getHp(), equip1.getHp(), equip2.getHp()));
        equip.setMp(getRandStatFusion(equip.getMp(), equip1.getMp(), equip2.getMp()));
        return equip;
    }

    public int get????????????????????????(int itemId) {
        switch (itemId) {
            case 1182000: //???????????????????????????
                return 3;
            case 1182001: //???????????????????????????
                return 5;
            case 1182002: //???????????????????????????
                return 7;
            case 1182003: //???????????????????????????
                return 9;
            case 1182004: //???????????????????????????
                return 13;
            case 1182005: //???????????????????????????
                return 16;
        }
        return 0;
    }

    public Equip randomize??????????????????(Equip equip) {
        int stats = get????????????????????????(equip.getItemId());
        if (stats > 0) {
            int prob = equip.getItemId() - 1182000;
            if (Randomizer.nextInt(15) <= prob) { //??????
                equip.setStr((short) Randomizer.nextInt(stats + prob));
            }
            if (Randomizer.nextInt(15) <= prob) { //??????
                equip.setDex((short) Randomizer.nextInt(stats + prob));
            }
            if (Randomizer.nextInt(15) <= prob) { //??????
                equip.setInt((short) Randomizer.nextInt(stats + prob));
            }
            if (Randomizer.nextInt(15) <= prob) { //??????
                equip.setLuk((short) Randomizer.nextInt(stats + prob));
            }
            if (Randomizer.nextInt(30) <= prob) { //????????????
                equip.setWatk((short) Randomizer.nextInt(stats));
            }
            if (Randomizer.nextInt(10) <= prob) { //????????????
                equip.setWdef((short) Randomizer.nextInt(stats * 8));
            }
            if (Randomizer.nextInt(30) <= prob) { //????????????
                equip.setMatk((short) Randomizer.nextInt(stats));
            }
            if (Randomizer.nextInt(10) <= prob) { //????????????
                equip.setMdef((short) Randomizer.nextInt(stats * 8));
            }
            if (Randomizer.nextInt(8) <= prob) { //?????????
                equip.setAcc((short) Randomizer.nextInt(stats * 5));
            }
            if (Randomizer.nextInt(8) <= prob) { //?????????
                equip.setAvoid((short) Randomizer.nextInt(stats * 5));
            }
            if (Randomizer.nextInt(10) <= prob) { //????????????
                equip.setSpeed((short) Randomizer.nextInt(stats));
            }
            if (Randomizer.nextInt(10) <= prob) { //?????????
                equip.setJump((short) Randomizer.nextInt(stats));
            }
            if (Randomizer.nextInt(8) <= prob) { //HP
                equip.setHp((short) Randomizer.nextInt(stats * 10));
            }
            if (Randomizer.nextInt(8) <= prob) { //MP
                equip.setMp((short) Randomizer.nextInt(stats * 10));
            }
        }
        return equip;
    }

    public int getTotalStat(Equip equip) { //i get COOL when my defense is higher on gms...
        return equip.getStr() + equip.getDex() + equip.getInt() + equip.getLuk() + equip.getMatk() + equip.getWatk() + equip.getAcc() + equip.getAvoid() + equip.getJump()
                + equip.getHands() + equip.getSpeed() + equip.getHp() + equip.getMp() + equip.getWdef() + equip.getMdef();
    }

    /*
     * ??????????????????
     * ????????????????????????????????????
     * -17 ?????????B?????????
     * -18 ?????????A?????????
     * -19 ?????????S?????????
     * -20 ?????????SS?????????
     */
    public Equip setPotentialState(Equip equip, int state) {
        if (equip.getState(false) == 0) {
            if (state == 1) {
                equip.setPotential1(-17);
            } else if (state == 2) {
                equip.setPotential1(-18);
            } else if (state == 3) {
                equip.setPotential1(-19);
            } else if (state == 4) {
                equip.setPotential1(-20);
            } else {
                equip.setPotential1(-17);
            }
        }
        return equip;
    }

    public MapleStatEffect getItemEffect(int itemId) {
        MapleStatEffect ret = itemEffects.get(itemId);
        if (ret == null) {
            MapleData item = getItemData(itemId);
            if (item == null || item.getChildByPath("spec") == null) {
                return null;
            }
            ret = MapleStatEffectFactory.loadItemEffectFromData(item.getChildByPath("spec"), itemId);
            itemEffects.put(itemId, ret);
        }
        return ret;
    }

    public MapleStatEffect getItemEffectEX(int itemId) {
        MapleStatEffect ret = itemEffectsEx.get(itemId);
        if (ret == null) {
            MapleData item = getItemData(itemId);
            if (item == null || item.getChildByPath("specEx") == null) {
                return null;
            }
            ret = MapleStatEffectFactory.loadItemEffectFromData(item.getChildByPath("specEx"), itemId);
            itemEffectsEx.put(itemId, ret);
        }
        return ret;
    }

    public int getCreateId(int id) {
        return getItemProperty(id, "info/create", 0);
    }

    public int getCardMobId(int id) {
        return getItemProperty(id, "info/mob", 0);
    }

    public int getBagType(int id) {
        return getItemProperty(id, "info/bagType", 0);
    }

    public int getWatkForProjectile(int itemId) {
        return getItemProperty(itemId, "info/incPAD", 0);
    }

    /*
     * ??????????????????
     * ???????????????????????????
     */
    public boolean canScroll(int scrollid, int itemid) {
        return (scrollid / 100) % 100 == (itemid / 10000) % 100 || (itemid >= 1672000 && itemid <= 1672010);
    }

    /*
     * ???????????????????????????
     */
    public String getName(int itemId) {
        Jedis jedis = RedisUtil.getJedis();
        try {
            return jedis.hget(KEYNAMES.ITEM_NAME.getKeyName(), String.valueOf(itemId));
        }finally {
            RedisUtil.returnResource(jedis);
        }
    }

    /*
     * ???????????????????????????
     */
    public String getDesc(int itemId) {
        Jedis jedis = RedisUtil.getJedis();
        try {
            return jedis.hget(KEYNAMES.ITEM_DESC.getKeyName(), String.valueOf(itemId));
        }finally {
            RedisUtil.returnResource(jedis);
        }
    }

    public String getMsg(int itemId) {
        Jedis jedis = RedisUtil.getJedis();
        try {
            return jedis.hget(KEYNAMES.ITEM_MSG.getKeyName(), String.valueOf(itemId));
        }finally {
            RedisUtil.returnResource(jedis);
        }
    }

    public short getItemMakeLevel(int itemId) {
        return getItemProperty(itemId, "info/lv", 0).shortValue();
    }

    /*
     * 0x10 notSale
     * 0x20 expireOnLogout
     * 0x40 pickUpBlock
     * 0x80 only ????????????
     * 0x100 accountSharable ????????????????????????
     * 0x200 quest ????????????
     * 0x400 tradeBlock ????????????
     * 0x800 accountShareTag
     * 0x1000 mobHP
     * 0x2000 nActivatedSocket ????????????
     * 0x4000 superiorEqp ????????????
     * 0x8000 onlyEquip ????????????1???
     */

    /**
     * ??????????????????
     */
    public boolean cantSell(int itemId) { //true = cant sell, false = can sell
        return getItemProperty(itemId, "info/notSale", 0) == 1;
    }

    /**
     * ????????????????????????
     */
    public boolean isLogoutExpire(int itemId) {
        return getItemProperty(itemId, "info/expireOnLogout", 0) == 1;
    }

    /**
     * ??????????????????
     */
    public boolean isPickupBlocked(int itemId) {
        return getItemProperty(itemId, "info/pickUpBlock", 0) == 1;
    }

    public boolean isPickupRestricted(int itemId) {
        return (getItemProperty(itemId, "info/only", 0) == 1 || ItemConstants.isPickupRestricted(itemId)) && itemId != 4001168; //?????????
    }

    public boolean isAccountShared(int itemId) {
        return getItemProperty(itemId, "info/accountSharable", 0) == 1;
    }

    public boolean isQuestItem(int itemId) {
        return getItemProperty(itemId, "info/quest", 0) == 1 && itemId / 10000 != 301;
    }

    public boolean isDropRestricted(int itemId) {
        return (getItemProperty(itemId, "info/quest", 0) == 1 || getItemProperty(itemId, "info/tradeBlock", 0) == 1 || ItemConstants.isDropRestricted(itemId));
    }

    public boolean isShareTagEnabled(int itemId) {
        return getItemProperty(itemId, "info/accountShareTag", 0) == 1;
    }

    public boolean isMobHP(int itemId) {
        return getItemProperty(itemId, "info/mobHP", 0) == 1;
    }

    public boolean isEquipTradeBlock(int itemId) {
        return getItemProperty(itemId, "info/equipTradeBlock", 0) == 1;
    }

    /**
     * ???????????????????????????
     */
    public boolean isActivatedSocketItem(int itemId) {
        return getItemProperty(itemId, "info/nActivatedSocket", 0) == 1;
    }

    /**
     * ??????????????????????????????????????????
     */
    public boolean isSuperiorEquip(int itemId) {
        return getItemProperty(itemId, "info/superiorEqp", 0) == 1;
    }

    /**
     * ?????????????????????1????????????
     */
    public boolean isOnlyEquip(int itemId) {
        return getItemProperty(itemId, "info/onlyEquip", 0) == 1;
    }

    public int getStateChangeItem(int itemId) {
        return getItemProperty(itemId, "info/stateChangeItem", 0);
    }

    public int getMeso(int itemId) {
        return getItemProperty(itemId, "info/meso", 0);
    }

    public boolean isTradeAvailable(int itemId) {
        return getItemProperty(itemId, "info/tradeAvailable", 0) == 1;
    }

    public boolean isPKarmaEnabled(int itemId) {
        return getItemProperty(itemId, "info/tradeAvailable", 0) == 2;
    }

    public Pair<Integer, List<Map<String, String>>> getRewardItem(int itemId) {
        Map<?, ?> data = getItemProperty(itemId, "reward", null);
        if (data == null) {
            return null;
        }
        List<Map<String, String>> ret = new ArrayList<>();
        int totalprob = 0;
        for (Entry<?, ?> entry : data.entrySet()) {
            Map<String, String> rewards = new HashMap<>();
            ((Map<?, ?>) entry.getValue()).forEach((o, o2) -> rewards.put((String) o, o2 instanceof Integer ? String.valueOf(o2) : (String) o2));
            ret.add(rewards);
            totalprob += rewards.containsKey("prob") ? Integer.valueOf(rewards.get("prob")) : 0;
        }
        return new Pair<>(totalprob, ret);
    }

    public Pair<Integer, Map<Integer, Integer>> questItemInfo(int itemId) {
        Integer questId = getItemProperty(itemId, "info/questId", 0);
        Map<?, ?> data = getItemProperty(itemId, "info/consumeItem", null);
        if (data == null) {
            return null;
        }
        Map<Integer, Integer> ret = new HashMap<>();
        for (Entry<?, ?> entry : data.entrySet()) {
            if (entry.getValue() instanceof Map<?, ?>) {
                Map<Integer, Integer> subentry = (Map<Integer, Integer>) entry.getValue();
                ret.put(subentry.get(0), subentry.get(1));
            } else {
                ret.put((Integer) entry.getValue(), 1);
            }
        }
        return new Pair<>(questId, ret);
    }

    public Map<String, String> replaceItemInfo(int itemId) {
        Map<String, String> data = getItemProperty(itemId, "info/replace", new HashMap<String, String>());
        if (data == null) {
            return null;
        }
        return data;
    }

    public List<Triple<String, Point, Point>> getAfterImage(String after) {
        return afterImage.get(after);
    }

    public String getAfterImage(int itemId) {
        return getItemProperty(itemId, "info/afterImage", null);
    }

    public boolean itemExists(int itemId) {
        Jedis jedis = RedisUtil.getJedis();
        try {
            if (ItemConstants.getInventoryType(itemId) == MapleInventoryType.UNDEFINED) {
                return false;
            }
            return jedis.hexists(KEYNAMES.ITEM_DATA.getKeyName(), String.valueOf(itemId));
        }finally {
            RedisUtil.returnResource(jedis);
        }
    }

    public boolean isCash(int itemId) {
        return ItemConstants.getInventoryType(itemId) == MapleInventoryType.CASH || String.valueOf(getItemProperty(itemId, "info/cash", "0")).equals("1");
    }

    public double getExpCardRate(int itemId) {
        return getItemProperty(itemId, "info/rate", 100) / 100;
    }

    public int getExpCardMaxLevel(int itemId) {
        return getItemProperty(itemId, "info/maxLevel", 249);
    }

    public boolean isExpOrDropCardTime(int itemId) {
        Map<Integer, String> data = getItemProperty(itemId, "info/time", null);
        if (data == null) {
            return false;
        }
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Asia/ShangHai"));
        String day = DateUtil.getDayInt(cal.get(Calendar.DAY_OF_WEEK));
        //System.out.println("????????????: " + cal.get(Calendar.HOUR_OF_DAY));
        Map<String, String> times = new HashMap<>();
        for (String childdata : data.values()) { //MON:03-07
            String[] time = childdata.split(":");
            times.put(time[0], time[1]);
        }
        cal.get(Calendar.DAY_OF_WEEK);
        if (times.containsKey(day)) {
            String[] hourspan = times.get(day).split("-");
            int starthour = Integer.parseInt(hourspan[0]);
            int endhour = Integer.parseInt(hourspan[1]);
            //System.out.println("starthour: " + starthour + " endhour: " + endhour + " nowhour: " + cal.get(Calendar.HOUR_OF_DAY));
            if (cal.get(Calendar.HOUR_OF_DAY) >= starthour && cal.get(Calendar.HOUR_OF_DAY) <= endhour) {
                return true;
            }
        }
        return false;
    }

    /**
     * ??????????????????
     */
    public ScriptedItem getScriptedItemInfo(int itemId) {
        if ((itemId / 10000) != 243) {
            return null;
        }
        return new ScriptedItem(
                getItemProperty(itemId, "spec/npc", 0),
                getItemProperty(itemId, "spec/script", ""),
                getItemProperty(itemId, "spec/runOnPickup", 0) == 1);
    }

    /**
     * ????????????????????????
     */
    public StructCrossHunterShop getCrossHunterShop(int key) {
        if (crossHunterShop.containsKey(key)) {
            return crossHunterShop.get(key);
        }
        return null;
    }

    /**
     * ???????????????????????????
     */
    public boolean isFloatCashItem(int itemId) {
        return (itemId / 10000) == 512 && getItemProperty(itemId, "info/floatType", 0) == 1;
    }

    /**
     * ??????????????????
     */
    public short getPetFlagInfo(int itemId) {
        short flag = 0;
        if ((itemId / 10000) != 500) {
            return flag;
        }
        if (!itemExists(itemId)) {
            return flag;
        }
        if (getItemProperty(itemId, "info/pickupItem", 0) == 1) { //????????????
            flag |= 0x01;
        }
        if (getItemProperty(itemId, "info/longRange", 0) == 1) { //??????????????????
            flag |= 0x02;
        }
        if (getItemProperty(itemId, "info/pickupAll", 0) == 1) { //??????????????????
            flag |= 0x04;
        }
        if (getItemProperty(itemId, "info/sweepForDrop", 0) == 1) { //????????????????????????????????????
            flag |= 0x10;
        }
        if (getItemProperty(itemId, "info/consumeHP", 0) == 1) { //?????????HP??????
            flag |= 0x20;
        }
        if (getItemProperty(itemId, "info/consumeMP", 0) == 1) { //?????????MP??????
            flag |= 0x40;
        }
        if (getItemProperty(itemId, "info/autoBuff", 0) == 1) { //????????????????????????
            flag |= 0x200;
        }
        return flag;
    }

    /**
     * ?????????????????????ID
     */
    public int getPetSetItemID(int itemId) {
        if (itemId / 10000 != 500) {
            return -1;
        }
        return getItemProperty(itemId, "info/setItemID", 0);
    }

    /**
     * ??????????????????HP
     */
    public int getItemIncMHPr(int itemId) {
        return getItemProperty(itemId, "info/MHPr", 0);
    }

    /**
     * ??????????????????MP
     */
    public int getItemIncMMPr(int itemId) {
        return getItemProperty(itemId, "info/MMPr", 0);
    }

    /**
     * ??????????????????
     * ??????????????????
     * 2046006 - ???????????????????????????????????? - ???????????????????????????????????????????????????
     */
    public int getSuccessRates(int itemId) {
        if ((itemId / 10000) != 204) {
            return 0;
        }
        return getItemProperty(itemId, "info/successRates/0", 0);
    }

    /**
     * ?????????????????????????????????
     */
    public int getForceUpgrade(int itemId) {
        if (itemId / 100 != 20493) {
            return 0;
        }
        return getItemProperty(itemId, "info/forceUpgrade", 1);
    }

    /**
     * ????????????????????????
     */
    public boolean hasSafetyShield(int itemId) {
        return getItemProperty(itemId, "info/safetyShield", 0) == 1;
    }

    /**
     * ???????????????HP???MP
     */
    public Pair<Integer, Integer> getChairRecovery(int itemId) {
        if (itemId / 10000 != 301) {
            return null;
        }
        return new Pair<>(getItemProperty(itemId, "info/recoveryHP", 0), getItemProperty(itemId, "info/recoveryMP", 0));
    }

    /**
     * ?????????????????????????????????
     */
    public int getLimitBreak(int itemId) {
        return getItemProperty(itemId, "info/limitBreak", 999999);
    }

    /**
     * ???????????????BOSS??????
     */
    public int getBossDamageRate(int itemId) {
        return getItemProperty(itemId, "info/bdR", 0);
    }

    /**
     * ?????????????????????????????????
     */
    public int getIgnoreMobDmageRate(int itemId) {
        return getItemProperty(itemId, "info/imdR", 0);
    }

    public int getTotalDamage(int itemId) {
        return getItemProperty(itemId, "info/damR", 0);
    }

    /**
     * ???????????????????????????
     */
    public int getOption(int itemId, int level) {
        return getItemProperty(itemId, "info/option/" + (level - 1) + "option", 0);
    }

    /**
     * ??????????????????????????????
     */
    public int getAndroidType(int itemId) {
        if (itemId / 10000 != 166) { //????????????????????? 1662000 - 1662034 ??? 1666000
            return 0;
        }
        return getItemProperty(itemId, "info/android", 1);
    }

    /**
     * ?????????????????????????????????
     */
    public int getScrollLimitBreak(int itemId) {
        if (itemId / 100 != 26140) {
            return 0;
        }
        return getItemProperty(itemId, "info/incALB", 0);
    }

    /**
     * ???????????????????????????????????????
     */
    public boolean isNoCursedScroll(int itemId) {
        return itemId / 10000 == 204 && getItemProperty(itemId, "info/noCursed", 0) == 1;
    }

    /**
     * ???????????? ?????????????????????
     */
    public boolean isNegativeScroll(int itemId) {
        return itemId / 10000 == 204 && getItemProperty(itemId, "info/noNegative", 0) == 1;
    }

    public int getRecover(int itemId) {
        return getItemProperty(itemId, "info/recover", 0);
    }

    /**
     * ???????????????????????????????????????
     */
    public boolean isExclusiveEquip(int itemId) {
        return exclusiveEquip.containsKey(itemId);
    }

    public StructExclusiveEquip getExclusiveEquipInfo(int itemId) {
        if (exclusiveEquip.containsKey(itemId)) {
            int exclusiveId = exclusiveEquip.get(itemId);
            if (exclusiveEquipInfo.containsKey(exclusiveId)) {
                return exclusiveEquipInfo.get(exclusiveId);
            }
        }
        return null;
    }

    public List<Pair<String, Integer>> getSealedEquipInfo(int itemId, int level) {
        //TODO: ????????????????????????
//        if (sealedEquipInfo.containsKey(itemId) && sealedEquipInfo.get(itemId).containsKey(level)) {
//            return sealedEquipInfo.get(itemId).get(level);
//        }
        return null;
    }

    /**
     * ?????????????????????????????????ID
     */
    public int getSkillSkinFormSkillId(int itemId) {
        if (itemId / 1000 != 1603) {
            return 0;
        }
        return getItemProperty(itemId, "info/skillID", 0);
    }

    /**
     * ?????????????????????iconID
     *
     * @param itemId
     * @return
     */
    public int getInLinkID(int itemId) {
        Integer linkid = getItemProperty(itemId, "info/_inlink", 0);
        if (linkid == 0) {
            linkid = getItemProperty(itemId, "info/_outlink", 0);
        }
        return linkid != 0 && itemId != linkid ? getInLinkID(linkid) : itemId;
    }

    public Map<String, Integer> getBookSkillID(int itemId) {
        return getItemProperty(itemId, "info/skill", new HashMap<>());
    }

    public int getReqEquipLevelMax(int itemId) {
        return getItemProperty(itemId, "info/reqEquipLevelMax", 0);
    }

    public boolean loadHairFace(int id) {
        Jedis jedis = RedisUtil.getJedis();
        try {
            return jedis.lrange(KEYNAMES.HAIR_FACE_ID.getKeyName(), 0, -1).contains(String.valueOf(id));
        }finally {
            RedisUtil.returnResource(jedis);
        }
    }

    public Pair<Integer, Integer> getSocketReqLevel(int itemId) {
        int socketId = itemId % 1000 + 1;
        if (!socketReqLevel.containsKey(socketId)) {
            MapleData skillOptionData = itemData.getData("SkillOption.img");
            MapleData socketData = skillOptionData.getChildByPath("socket");
            int reqLevelMax = MapleDataTool.getIntConvert(socketId + "/reqLevelMax", socketData, 250);
            int reqLevelMin = MapleDataTool.getIntConvert(socketId + "/reqLevelMin", socketData, 70);
            socketReqLevel.put(socketId, new Pair<>(reqLevelMax, reqLevelMin));
        }
        return socketReqLevel.get(socketId);
    }

    public int getSoulSkill(int itemId) {
        int soulName = itemId % 1000 + 1;
        if (!soulSkill.containsKey(soulName)) {
            MapleData skillOptionData = itemData.getData("SkillOption.img");
            MapleData skillData = skillOptionData.getChildByPath("skill");
            int skillId = MapleDataTool.getIntConvert(soulName + "/skillId", skillData, 0);
            soulSkill.put(soulName, skillId);
        }
        return soulSkill.get(soulName);
    }

    public ArrayList<Integer> getTempOption(int itemId) {
        int soulName = itemId % 1000 + 1;
        if (!tempOption.containsKey(soulName)) {
            MapleData skillOptionData = itemData.getData("SkillOption.img");
            MapleData tempOptionData = skillOptionData.getChildByPath("skill/" + soulName + "/tempOption");
            ArrayList<Integer> pots = new ArrayList<>();
            for (MapleData pot : tempOptionData) {
                pots.add(MapleDataTool.getIntConvert("id", pot, 1));
            }
            tempOption.put(soulName, pots);
        }
        return tempOption.get(soulName);
    }

    public List<Integer> getRandomFamiliarCard(int count) {
        List<Integer> ret = new ArrayList<>();
        List<Integer> ids = new ArrayList<>(familiars.keySet());

        while (ret.size() < count) {
            Collections.shuffle(ids);
            ret.add(familiars.get(ids.get(Randomizer.nextInt(ids.size()))).getMonsterCardID());
        }

        return ret;
    }

    public Map<Integer, Map<Integer, Float>> getFamiliarTable_pad() {
        return familiarTable_pad;
    }

    public Map<Integer, Map<Integer, Short>> getFamiliarTable_rchance() {
        return familiarTable_rchance;
    }

    public Map<Integer, LinkedList<StructItemOption>> getFamiliar_option() {
        return familiar_option;
    }

    public Map<Integer, Integer> getDamageSkinBox() {
        return damageSkinBox;
    }

    public Map<Integer, Map<Integer, Triple<Integer, Integer, Integer>>> getVcores() {
        return vcores;
    }

    public Map<Integer, Triple<Integer, Integer, Integer>> getVcores(int type) {
        return vcores.get(type);
    }

    public Map<Integer, VCoreDataEntry> getVcoreDatas() {
        return vcoreDatas;
    }

    public VCoreDataEntry getVCoreData(int id) {
        return vcoreDatas.get(id);
    }

    public Map<String, List<VCoreDataEntry>> getVcoreDatas_s() {
        return vcoreDatas_s;
    }

    public List<VCoreDataEntry> getVCoreDatasByJob(String job) {
        return vcoreDatas_s.get(job);
    }
}
