package handling.channel.handler;

import client.*;
import client.anticheat.CheatingOffense;
import client.inventory.*;
import client.skills.*;
import client.status.MonsterStatus;
import client.status.MonsterStatusEffect;
import configs.FishingConfig;
import configs.ServerConfig;
import constants.*;
import constants.BattleConstants.PokemonAbility;
import constants.BattleConstants.PokemonMap;
import constants.skills.*;
import handling.channel.ChannelServer;
import handling.opcode.RecvPacketOpcode;
import handling.world.PlayerBuffStorage;
import handling.world.party.MapleParty;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import scripting.npc.NPCScriptManager;
import server.*;
import server.Timer;
import server.life.MapleMonster;
import server.maps.*;
import server.movement.LifeMovementFragment;
import server.quest.MapleQuest;
import tools.MaplePacketCreator;
import tools.Pair;
import tools.Randomizer;
import tools.Triple;
import tools.data.input.LittleEndianAccessor;
import tools.packet.*;

import java.awt.*;
import java.sql.SQLException;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class PlayerHandler {

    private static final Logger log = LogManager.getLogger(PlayerHandler.class);

    public static void ChangeSkillMacro(LittleEndianAccessor slea, MapleCharacter chr) {
        int num = slea.readByte();
        String name;
        int shout, skill1, skill2, skill3;
        SkillMacro macro;

        for (int i = 0; i < num; i++) {
            name = slea.readMapleAsciiString();
            shout = slea.readByte();
            skill1 = slea.readInt();
            skill2 = slea.readInt();
            skill3 = slea.readInt();
            macro = new SkillMacro(skill1, skill2, skill3, name, shout, i);
            chr.updateMacros(i, macro);
        }
    }

    public static void ChangeKeymap(LittleEndianAccessor slea, MapleCharacter chr) {
        if (slea.available() > 8 && chr != null) { // else = pet auto pot
            slea.skip(4); //0
            int numChanges = slea.readInt();
            for (int i = 0; i < numChanges; i++) {
                int key = slea.readInt();
                byte type = slea.readByte();
                int action = slea.readInt();
                if (type == 1 && action >= 1000) { //0 = normal key, 1 = skill, 2 = item
                    Skill skil = SkillFactory.getSkill(action);
                    if (skil != null) { //not sure about aran tutorial skills..lol
                        if ((!skil.isFourthJob() && !skil.isBeginnerSkill() && skil.isInvisible() && chr.getSkillLevel(skil) <= 0) || SkillConstants.isLinkedAttackSkill(action)) { //cannot put on a key
                            continue;
                        }
                    }
                }
                chr.changeKeybinding(key, type, action);
            }
        } else if (chr != null) {
            int type = slea.readInt(), data = slea.readInt();
            switch (type) {
                case 1: //?????????HP??????
                    if (data <= 0) {
                        chr.getQuestRemove(MapleQuest.getInstance(GameConstants.HP_ITEM));
                    } else {
                        chr.getQuestNAdd(MapleQuest.getInstance(GameConstants.HP_ITEM)).setCustomData(String.valueOf(data));
                    }
                    break;
                case 2: //?????????MP??????
                    if (data <= 0) {
                        chr.getQuestRemove(MapleQuest.getInstance(GameConstants.MP_ITEM));
                    } else {
                        chr.getQuestNAdd(MapleQuest.getInstance(GameConstants.MP_ITEM)).setCustomData(String.valueOf(data));
                    }
                    break;
                case 3: //?????????BUFF????????????
                    if (data <= 0) {
                        chr.getQuestRemove(MapleQuest.getInstance(GameConstants.BUFF_SKILL));
                    } else {
                        chr.getQuestNAdd(MapleQuest.getInstance(GameConstants.BUFF_SKILL)).setCustomData(String.valueOf(data));
                    }
                    break;
                case 4:
//                    chr.send(MaplePacketCreator.sendTestPacket("32 00 00 02 00 03 05 0B 00 00 05 0B 00 02 B0 CD 4F 00 01 AF 52 94 01 00 00 00 00 00 80 05 BB 46 E6 17 02 FF FF FF FF 01 00 00 00 00 00 00 00"));
                    break;
            }
        }
    }

    public static void UseChair(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        if (chr == null || chr.getMap() == null) {
            return;
        }
        int itemId = slea.readInt();
        byte slot = slea.readByte();
        slea.skip(4);
        String msg = "";
        int type = slea.readInt();
        if (type > 0) {
            msg = slea.readMapleAsciiString();
        }
        int meso = slea.readInt();
        byte by3 = slea.readByte();
        int mask = slea.readInt();
        Item toUse = chr.getInventory(MapleInventoryType.SETUP).getItem(slot);
        if (toUse == null) {
            chr.getCheatTracker().registerOffense(CheatingOffense.USING_UNAVAILABLE_ITEM, Integer.toString(itemId));
            return;
        }
        if (GameConstants.isFishingMap(chr.getMapId())) { //???????????????
            if (!FishingConfig.FISHING_CHECK_CHAIR || itemId == FishingConfig.FISHING_CHAIR) {
                if (chr.getStat().canFish) {
                    chr.startFishingTask();
                }
            }
        }
        chr.setChairType(type << 4 | mask);
        chr.setChairMsg(msg);
        chr.setChairMeso(meso);
        chr.setChair(itemId);
        chr.getMap().broadcastMessage(chr, MaplePacketCreator.showChair(chr, itemId, msg), false);
        if (meso > 0) {
            chr.getMap().broadcastMessage(chr, MaplePacketCreator.addChairMeso(itemId, 999), false);
        }
        c.announce(MaplePacketCreator.enableActions());
    }

    public static void CancelChair(short id, MapleClient c, MapleCharacter chr) {
        if (id == -1 && chr != null) { // Cancel Chair
            chr.cancelFishingTask();
            chr.setChair(0);
            chr.setChairType(0);
            chr.setChairMsg("");
            c.announce(MaplePacketCreator.cancelChair(chr.getId()));
            if (chr.getMap() != null) {
                chr.getMap().broadcastMessage(chr, MaplePacketCreator.showChair(chr, 0, ""), false);
            }
        } else { // Use In-Map Chair
            if (chr != null) {
                chr.setChair(id);
            }
            c.announce(MaplePacketCreator.cancelChair(id));
        }
    }

    /*
     * ???????????????
     */
    public static void TrockAddMap(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        byte type = slea.readByte();
        byte vip = slea.readByte(); //????????????1 ????????????2 ????????????3
        if (type == 0x00) {
            int mapId = slea.readInt();
            if (vip == 0x01) {
                chr.deleteFromRegRocks(mapId);
            } else if (vip == 0x02) {
                chr.deleteFromRocks(mapId);
            } else if (vip == 0x03) {
                chr.deleteFromHyperRocks(mapId);
            }
            c.announce(MTSCSPacket.INSTANCE.getTrockRefresh(chr, vip, true));
        } else if (type == 0x01) {
            if (!FieldLimitType.VipRock.check(chr.getMap().getFieldLimit())) {
                if (vip == 0x01) {
                    chr.addRegRockMap();
                } else if (vip == 0x02) {
                    chr.addRockMap();
                } else if (vip == 0x03) {
                    chr.addHyperRockMap();
                }
                c.announce(MTSCSPacket.INSTANCE.getTrockRefresh(chr, vip, false));
            } else {
                chr.dropMessage(1, "??????????????????????????????.");
            }
        }
    }

    public static void CharInfoRequest(int objectid, MapleClient c, MapleCharacter chr) {
        if (chr == null || chr.getMap() == null) {
            return;
        }
        MapleCharacter player;
        if (objectid == 0) {
            player = chr.getMap().getCharacterById(chr.getId());
        } else {
            player = chr.getMap().getCharacterById(objectid);
        }
        c.announce(MaplePacketCreator.enableActions());
        if (player != null) {
            if (!player.isGM() || chr.isGM()) {
                c.announce(MaplePacketCreator.charInfo(player, chr.getId() == objectid));
            }
        }
    }

    public static void AranCombo(MapleClient c, MapleCharacter chr, int toAdd) {
        if (chr != null && JobConstants.is??????(chr.getJob())) {

            if (toAdd > 0) {
                int combo = chr.getAranCombo() + toAdd;
                if (combo >= 1000) {
                    chr.setAranCombo(500, true);
                    int skilllevel = chr.getSkillLevel(??????.????????????);
                    if (skilllevel > 0) {
                        SkillFactory.getSkill(??????.????????????).getEffect(skilllevel).applyTo(chr);
                    }
                } else {
                    chr.setAranCombo(combo, true);
                }
            } else {
                chr.gainAranCombo(toAdd, true);
            }
        }
    }

    /*
     * ??????????????????
     */
    public static void UseItemEffect(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        int itemId = slea.readInt();
        int itemType = slea.readInt();
        if (itemId == 0) {
            chr.setItemEffect(0);
            chr.setItemEffectType(0);
        } else {
            Item toUse = chr.getInventory(MapleInventoryType.CASH).findById(itemId); //???????????????
            if (toUse == null || toUse.getItemId() != itemId || toUse.getQuantity() < 1) {
                c.announce(MaplePacketCreator.enableActions());
                return;
            }
            if (itemId != 5510000) { //???????????????
                chr.setItemEffect(itemId);
                chr.setItemEffectType(itemType);
            }
        }
        chr.getMap().broadcastMessage(chr, MaplePacketCreator.itemEffect(chr.getId(), itemId, itemType), false);
    }

    /*
     * ????????????????????????
     */
    public static void UseTitleEffect(int itemId, MapleClient c, MapleCharacter chr) {
        if (itemId == 0) {
            chr.setTitleEffect(0);
            chr.getQuestRemove(MapleQuest.getInstance(124000));
        } else {
            Item toUse = chr.getInventory(MapleInventoryType.SETUP).findById(itemId); //???????????????
            if (toUse == null || toUse.getItemId() != itemId || toUse.getQuantity() < 1) {
                c.announce(MaplePacketCreator.enableActions());
                return;
            }
            if (itemId / 10000 == 370) {
                chr.setTitleEffect(itemId);
                chr.getQuestNAdd(MapleQuest.getInstance(124000)).setCustomData(String.valueOf(itemId));
            }
        }
        chr.getMap().broadcastMessage(chr, MaplePacketCreator.showTitleEffect(chr.getId(), itemId), false);
    }

    public static void CancelItemEffect(int id, MapleCharacter chr) {
        chr.cancelEffect(MapleItemInformationProvider.getInstance().getItemEffect(-id), false, -1);
    }

    public static void CancelBuffHandler(int sourceid, MapleCharacter chr) {
        if (chr == null || chr.getMap() == null) {
            return;
        }
        Skill skill = SkillFactory.getSkill(sourceid);
        int totalSkillLevel = chr.getTotalSkillLevel(skill);
        if (chr.isShowPacket()) {
            chr.dropDebugMessage(1, "[BUFF??????] ?????????????????????BUFF ??????ID:" + sourceid + " ????????????:" + SkillFactory.getSkillName(sourceid));
        }
        //???????????????????????????????????????
        if (skill == null) {
            return;
        }
        if (skill.isRapidAttack() || skill.isChargingSkill() || skill.isChargeSkill()) {
            chr.setKeyDownSkill_Time(0);
            chr.getMap().broadcastMessage(chr, MaplePacketCreator.skillCancel(chr, sourceid), false);
            chr.getClient().announce(MaplePacketCreator.skillCooldown(sourceid, 0));
        } else {
            chr.getClient().announce(MaplePacketCreator.skillCancel(chr, sourceid));
//            chr.cancelEffect(skill.getEffect(1), false, -1);
        }
        if (skill.getEffect(totalSkillLevel).getStatups() != null) {
            chr.cancelEffect(skill.getEffect(1), false, -1);
        }
        if (sourceid == ??????.????????????) {
            chr.send(BuffPacket.cancelBuff(Collections.singletonList(MapleBuffStat.SECONDARY_STAT_KeyDownAreaMoving), chr));
            chr.send_other(BuffPacket.cancelForeignBuff(chr.getId(), Collections.singletonList(MapleBuffStat.SECONDARY_STAT_KeyDownAreaMoving)), false);
        }
        if (sourceid == ??????.??????) {
            int[] arrn = {??????.??????_2, ??????.??????_3, ??????.??????_4, ??????.??????_5, ??????.??????_6};
            Optional.ofNullable(SkillFactory.getSkill(arrn[Randomizer.nextInt(arrn.length)])).ifPresent(skill1 -> skill1.getEffect(totalSkillLevel).applyTo(chr, true));
        }
//        if (sourceid == ??????.???????????????) {
//            chr.setenattacke(false);
//        }
    }

    public static void CancelMech(LittleEndianAccessor slea, MapleCharacter chr) {
        if (chr == null) {
            return;
        }
        int sourceid = slea.readInt();
        if (sourceid % 10000 < 1000 && SkillFactory.getSkill(sourceid) == null) {
            sourceid += 1000;
        }
        Skill skill = SkillFactory.getSkill(sourceid);
        if (skill == null) { //not sure
            return;
        }
        if (sourceid == ????????????.????????????) {
            return;
        }
        if (skill.isChargeSkill()) {
            chr.setKeyDownSkill_Time(0);
            chr.getMap().broadcastMessage(chr, MaplePacketCreator.skillCancel(chr, sourceid), false);
        } else {
            chr.cancelEffect(skill.getEffect(slea.readByte()), false, -1);
        }
    }

    public static void QuickSlot(LittleEndianAccessor slea, MapleCharacter chr) {
        if (chr == null) {
            return;
        }
        chr.getQuickSlot().resetQuickSlot();
        for (int i = 0; i < 32; i++) {
            chr.getQuickSlot().addQuickSlot(i, slea.readInt());
        }
    }

    public static void SkillEffect(LittleEndianAccessor slea, MapleCharacter chr) {
        int skillId = slea.readInt(); //??????ID
        if (skillId == 0) {
            return;
        }
        byte level = slea.readByte(); //????????????
        byte display = slea.readByte(); //????????????
        byte direction = slea.readByte(); //????????????
        byte speed = slea.readByte(); //??????
        Point position = null; //??????
        if (slea.available() >= 4) {
            position = slea.readPos(); //????????????
        }

        Skill skill = SkillFactory.getSkill(SkillConstants.getLinkedAttackSkill(skillId));
        if (chr == null || skill == null || chr.getMap() == null) {
            return;
        }
        if (skill.isRapidAttack() || skill.isChargingSkill()) {
            chr.setKeyDownSkill_Time(System.currentTimeMillis());
            chr.getMap().broadcastMessage(chr, MaplePacketCreator.skillEffect(chr.getId(), skillId, level, display, direction, speed, position), false);
        }
    }

    /*
     * ??????????????????
     */
    public static void specialAttack(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        if (chr == null || chr.getMap() == null) {
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        int pos_x = slea.readInt();
        int pos_y = slea.readInt();
//        int pos_unk = slea.readInt();
        slea.skip(4);
        int display = slea.readInt(); //?????? ??????????????????800
        int skillId = slea.readInt(); //??????ID
        slea.skip(4);
        boolean isLeft = slea.readByte() > 0; //???????????? 1 = ?????? 0 = ??????
        int speed = slea.readInt(); //??????
        int tickCount = slea.readInt(); //??????????????????????????????
        Skill skill = SkillFactory.getSkill(SkillConstants.getLinkedAttackSkill(skillId));
        int skilllevel = chr.getTotalSkillLevel(skill);
        if (chr.isShowPacket()) {
            chr.dropDebugMessage(1, "[????????????] ??????: " + SkillFactory.getSkillName(skillId) + "(" + skillId + ") ????????????: " + skilllevel);
        }
        if (skill == null || skilllevel <= 0) {
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        MapleStatEffect effect = skill.getEffect(chr.getTotalSkillLevel(skill));
        effect.applyTo(chr);
        effect.applySummonEffect(chr, System.currentTimeMillis(), false);
        chr.getMap().broadcastMessage(chr, EffectPacket.showBuffeffect(chr, skillId, 1, chr.getLevel(), skilllevel), false);
        chr.getMap().broadcastMessage(chr, MaplePacketCreator.showSpecialAttack(chr.getId(), tickCount, pos_x, pos_y, display, skillId, skilllevel, isLeft, speed), chr.getTruePosition());
    }

    public static void SpecialMove(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        if (chr == null || chr.hasBlockedInventory() || chr.getMap() == null || slea.available() < 9) {
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        Point position = slea.readPos(); // Old X and Y
        int skillid = slea.readInt();

        if (ServerConfig.WORLD_BANALLSKILL) {
            chr.dropMessage(5, "??????????????????????????????.");
            c.sendEnableActions();
            return;
        }

        if (SkillFactory.isBlockedSkill(skillid)) {
            chr.dropMessage(5, "??????<" + SkillFactory.getSkillName(skillid) + ">??????????????????,??????????????????.");
            c.sendEnableActions();
            return;
        }

        switch (skillid) {
            case ??????.????????????:  //??????????????????1????????? ???????????? - 23111008 , ????????????1 - 23111009 , ????????????2 - 23111010
                skillid += Randomizer.nextInt(3);
                break;
            case ??????.????????????:  //???????????????????????? ???????????? - 5210015 , ????????????1 - 5210016 , ????????????2 - 5210017, ????????????2 - 5210018
                skillid += Randomizer.nextInt(4);
                break;
        }

        if (JobConstants.is?????????(chr.getJob()) && skillid >= 100000000) {
            slea.readByte(); //???????????????1???
        }
        int skillLevel = slea.readByte();
        slea.skip(4);
        Skill skill = SkillFactory.getSkill(skillid);
        if (skill == null || (SkillConstants.is??????????????????(skillid) && (chr.getStat().equippedSummon % 10000) != (skillid % 10000)) || (chr.inPVP() && skill.isPVPDisabled())) {
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        if (chr.checkSoulWeapon() && skill.getId() == chr.getEquippedSoulSkill()) {
            chr.checkSoulState(true);
        }
        int checkSkilllevel = chr.getTotalSkillLevel(SkillConstants.getLinkedAttackSkill(skillid));
        if (chr.isShowPacket()) {
            chr.dropDebugMessage(1, "[BUFF??????] ??????ID: " + skillid + " ????????????: " + skillLevel);
            if (SkillConstants.getLinkedAttackSkill(skillid) != skillid && !skill.isInvisible()) {
                chr.dropDebugMessage(1, "[BUFF??????] ????????????ID: " + SkillConstants.getLinkedAttackSkill(skillid) + " ??????????????????: " + checkSkilllevel);
            }
        }
        if ((checkSkilllevel <= 0 || checkSkilllevel != skillLevel) && !skill.isInvisible()) {
            if (!SkillConstants.isMulungSkill(skillid) && !SkillConstants.isPyramidSkill(skillid) && checkSkilllevel <= 0) {
                if (chr.isShowPacket()) {
                    chr.dropDebugMessage(3, "[BUFF??????] ???????????????????????? ??????ID: " + skillid + " ??????????????????: " + checkSkilllevel + " ??????????????????: " + skillLevel + " ????????????: " + (checkSkilllevel == skillLevel));
                }
                Skill.log.error("??????[" + chr.getName() + " ??????: " + chr.getJob() + "] ????????????: " + skillid + " ????????????: " + checkSkilllevel + " - " + !SkillConstants.isMulungSkill(skillid) + " - " + !SkillConstants.isPyramidSkill(skillid) + " ??????:" + slea.toString(true));
                c.announce(MaplePacketCreator.enableActions());
                return;
            }
            if (SkillConstants.isMulungSkill(skillid)) {
                if (chr.getMapId() / 10000 != 92502) {
                    //AutobanManager.getInstance().autoban(c, "Using Mu Lung dojo skill out of dojo maps.");
                    return;
                } else {
                    if (chr.getMulungEnergy() < 10000) {
                        return;
                    }
                    chr.mulung_EnergyModify(false);
                }
            } else if (SkillConstants.isPyramidSkill(skillid)) {
                if (chr.getMapId() / 10000 != 92602 && chr.getMapId() / 10000 != 92601) {
                    //AutobanManager.getInstance().autoban(c, "Using Pyramid skill out of pyramid maps.");
                    return;
                }
            }
        }
        skillLevel = chr.getTotalSkillLevel(SkillConstants.getLinkedAttackSkill(skillid));
        MapleStatEffect effect = chr.inPVP() ? skill.getPVPEffect(skillLevel) : skill.getEffect(skillLevel);

        if (skillid != ?????????.?????? && !DamageParse.applyAttackCooldown(effect, chr, skillid, false, true, false)) {
            return;
        }

        if (effect.getDuration() <= 0 && (chr.hasBuffSkill(skillid) || chr.hasBuffSkill(SkillConstants.getLinkedAttackSkill(skillid)))) {
            c.announce(MaplePacketCreator.enableActions());
            chr.cancelEffect(effect, false, -1);
            return;
        }
        //chr.checkFollow(); //not msea-like but ALEX'S WISHES
        switch (skillid) {
            case 9001020: // GM magnet
            case 9101020:
            case ????????????.????????????:
                byte number_of_mobs = slea.readByte();
                slea.skip(3);
                for (int i = 0; i < number_of_mobs; i++) {
                    int mobId = slea.readInt();
                    MapleMonster mob = chr.getMap().getMonsterByOid(mobId);
                    if (mob != null) {
                        //chr.getMap().broadcastMessage(chr, MaplePacketCreator.showMagnet(mobId, slea.readByte()), chr.getTruePosition());
                        mob.switchController(chr, mob.isControllerHasAggro());
                        mob.applyStatus(chr, new MonsterStatusEffect(MonsterStatus.MOB_STAT_Stun, 1, skillid, null, false, 0), false, effect.getDuration(), true, effect);
                    }
                }
                chr.getMap().broadcastMessage(chr, EffectPacket.showBuffeffect(chr, skillid, 1, chr.getLevel(), skillLevel, slea.readByte()), chr.getTruePosition());
                c.announce(MaplePacketCreator.enableActions());
                break;
            case ?????????.??????: //capture
                int mobID = slea.readInt();
                MapleMonster mob = chr.getMap().getMonsterByOid(mobID);
                if (mob != null) {
                    boolean success = mob.getHp() <= mob.getMobMaxHp() / 2 && mob.getId() >= 9304000 && mob.getId() < 9305000;
                    chr.getMap().broadcastMessage(chr, EffectPacket.showBuffeffect(chr, skillid, 1, chr.getLevel(), skillLevel, (byte) (success ? 1 : 0)), chr.getTruePosition());
                    if (success) {
                        chr.getQuestNAdd(MapleQuest.getInstance(GameConstants.JAGUAR)).setCustomData(String.valueOf((mob.getId() % 10 + 1) * 10));
                        chr.getMap().killMonster(mob, chr, true, false, (byte) 1);
                        chr.cancelEffectFromBuffStat(MapleBuffStat.????????????);
                        c.announce(MobPacket.showResults(mobID, true));
                        c.announce(MaplePacketCreator.updateJaguar(chr));
                    } else {
                        chr.dropMessage(5, "????????????????????????????????????");
                        c.announce(MobPacket.showResults(mobID, false));
                    }
                }
                c.announce(MaplePacketCreator.enableActions());
                break;
            case ?????????.???????????????: //hunter call
                chr.dropMessage(5, "???????????????????????????????????????????????????"); //lool
                c.announce(MaplePacketCreator.enableActions());
                break;
            case ??????.??????:
                chr.handleLuminous(skillid);
                break;
            case ??????.????????????????????????:
            case ??????.??????_??????:
            case ??????.??????_??????:
                chr.dropMessage(5, "???????????????????????????.");
                c.announce(MaplePacketCreator.enableActions());
                break;
            case ?????????.????????????:
                chr.handle????????????();
                c.announce(MaplePacketCreator.flameMark());
                break;
            case ???????????????.????????????: {
                slea.readInt(); //???????????????????????????
                byte mobCount = slea.readByte(); //????????????
                List<Integer> moboids = new ArrayList<>();
                for (int i = 0; i < mobCount; i++) {
                    moboids.add(slea.readInt());
                }
                if (moboids.size() == mobCount) {
                    chr.getSpecialStat().gainForceCounter();
                    c.announce(MaplePacketCreator.??????????????????(chr.getId(), ???????????????.????????????_??????, chr.getSpecialStat().getForceCounter(), moboids, 4));
                    chr.getSpecialStat().gainForceCounter(4);
                }
                effect.applyTo(chr);
                break;
            }
            case 4341003: // ??????.???????????? monster bomb
                chr.setKeyDownSkill_Time(0);
                chr.getMap().broadcastMessage(chr, MaplePacketCreator.skillCancel(chr, skillid), false);
                break;
            case ?????????.????????????:
            case ?????????.??????????????????:
            case ???????????????.?????????: {
                if (skillid == ???????????????.?????????) {
                    slea.skip(4);//pos
                }
                byte mobCount = slea.readByte();
                List<Integer> moboids = IntStream.range(0, mobCount).mapToObj(i -> slea.readInt()).collect(Collectors.toList());
                if (skillid == ???????????????.?????????) {
                    int delay = slea.readShort();
                    chr.getMap().broadcastMessage(MaplePacketCreator.ShieldChacing(chr.getId(), moboids, ???????????????.?????????_??????, effect.getAttackCount(chr), delay), chr.getTruePosition());
                } else if (moboids.size() == mobCount) {
                    int count_ex = 0;
                    int skilllevel_link = chr.getTotalSkillLevel(?????????.????????????????????????);
                    if (skilllevel_link > 0) {
                        Optional<Skill> skill1 = Optional.ofNullable(SkillFactory.getSkill(?????????.????????????????????????));
                        if (skill1.isPresent()) {
                            count_ex = skill1.get().getEffect(skilllevel_link).getBulletCount();
                        }
                    }
                    chr.getMap().broadcastMessage(ForcePacket.showForce(new MapleForce(chr.getId(), skillid, 0, MapleForceType.????????????, (byte) 1, moboids, (byte) 0, effect.getBulletCount() + count_ex, chr.getMap())));
                }
                c.announce(MaplePacketCreator.enableActions());
                break;
            }
            case ????????????.???????????????: {
                int[] newskill = {????????????.???????????????, ????????????.???????????????};
                for (int i : newskill) {
                    if (chr.getSkillLevel(i) > 0) {
                        Optional.ofNullable(SkillFactory.getSkill(i)).ifPresent(skill1 -> skill1.getEffect(chr.getTotalSkillLevel(i)).applyTo(chr));
                        break;
                    }
                }
                break;
            }
            case ??????.??????:
            case ??????.?????????: {
                int size = slea.readByte();
                List<Integer> moboids = IntStream.range(0, size).mapToObj(i -> slea.readInt()).collect(Collectors.toList());
                MapleForce force = new MapleForce(chr.getObjectId(), skillid == ??????.?????? ? ??????.??????_1 : ??????.?????????_1, 0, MapleForceType.??????, (byte) 1, moboids, skillid == ??????.?????? ? (byte) 1 : (byte) 2, 1, chr.getMap());
                chr.send(ForcePacket.showForce(force));
                break;
            }
            case ??????.????????????: {
                int size = slea.readByte();
                List<MapleMonster> moboids = IntStream.range(0, size).mapToObj(i -> chr.getMap().getMonsterByOid(slea.readInt())).collect(Collectors.toList());
                MapleStatEffect finalEffect = effect;
                moboids.parallelStream().filter(Objects::nonNull).forEach(e -> e.applyNewStatus(finalEffect));
                chr.getMap().broadcastMessage(chr, EffectPacket.showBuffeffect(chr, skillid, 1, chr.getLevel(), skillLevel), chr.getTruePosition());
                if (!chr.hasBuffSkill(skillid)) {
                    finalEffect.applyTo(chr);
                }
                break;
            }
            case ??????.????????????: {
                int size = slea.readByte();
                List<Integer> moboids = IntStream.range(0, size).mapToObj(i -> slea.readInt()).collect(Collectors.toList());
                MapleForce force = new MapleForce(chr.getObjectId(), ??????.????????????_??????, 0, MapleForceType.?????????, (byte) 1, moboids, (byte) 2, 1, chr.getMap());
                chr.send(ForcePacket.showForce(force));
                break;
            }
            case ??????.????????????: {
                Rectangle rectangle = effect.calculateBoundingBox(chr.getOldPosition(), chr.isFacingLeft());
                List<MapleMapObject> mapObjectsInRect = chr.getMap().getMapObjectsInRect(rectangle, Collections.singletonList(MapleMapObjectType.MONSTER));
                ArrayList<Integer> arrayList = new ArrayList<>();
                mapObjectsInRect.forEach(y2 -> arrayList.add(y2.getObjectId()));
                MapleForce mapleForce = new MapleForce(chr.getId(), skillid, 0, MapleForceType.????????????, (byte) 1, arrayList, (byte) 1, effect.getX(), chr.getMap());
                chr.send_other(ForcePacket.showForce(mapleForce, chr.getPosition()), true);
                break;
            }
            default:
                // ???????????????1: 01 C4 0F 7C 00 01 00 00
                // ??????????????? : 02 5A A1 07 00 5B A1 07 00 7D 0F C6 01 00 00 00
                Point pos = null;
                int direction = -1;
                if (skillid == ?????????.??????) {
                    int type = slea.readByte();
                    if (type == 2) {
                        slea.skip(4 * type);
                    }
                    pos = slea.readPos();
                } else {
                    if (slea.available() > 4) {
                        pos = slea.readPos();
                        if (slea.available() >= 7) {
                            slea.read(3);
                            direction = slea.readInt();
                        }
                    }
                }
                if (effect.is?????????()) {
                    if (!FieldLimitType.MysticDoor.check(chr.getMap().getFieldLimit())) {
                        effect.applyTo(c.getPlayer(), pos);
                    } else {
                        c.announce(MaplePacketCreator.enableActions());
                    }
                } else {
                    int mountid = MapleStatEffectFactory.parseMountInfo(c.getPlayer(), skill.getId());
                    if (mountid != 0 && mountid != GameConstants.getMountItem(skill.getId(), chr) && !chr.isIntern() && chr.getBuffedValue(MapleBuffStat.????????????) == null && chr.getInventory(MapleInventoryType.EQUIPPED).getItem((byte) -122) == null) {
                        if (!GameConstants.isMountItemAvailable(mountid, chr.getJob())) {
                            c.announce(MaplePacketCreator.enableActions());
                            return;
                        }
                    }
                    //????????????????????? ?????????2???????????????
                    if (effect.getSourceid() == ?????????.?????????????????????) {
                        effect.applyTo(chr, pos); //????????????1????????????
                        effect = SkillFactory.getSkill(?????????.?????????????????????_1).getEffect(skillLevel); //???2??????????????????
                        if (pos != null) {
                            pos.x -= 90;
                        }
                        if (effect != null) {
                            effect.applyTo(chr, pos);
                        }
                    } else if (effect.is????????????()) {
                        effect.applyTo(chr, pos); //???????????????1????????????BUFF??????
                        List<Integer> skillIds = new ArrayList<>();
                        for (int i = 5210015; i <= 5210018; i++) {
                            if (i != effect.getSourceid()) {
                                skillIds.add(i);
                            }
                        }
                        skillid = skillIds.get(Randomizer.nextInt(skillIds.size()));
                        effect = SkillFactory.getSkill(skillid).getEffect(skillLevel); //???2??????????????????
                        if (pos != null) {
                            pos.x -= 90;
                        }
                        if (effect != null) {
                            effect.applyTo(chr, pos);
                        }
                    } else {
                        effect.applyTo(chr, pos, direction);
                    }
                }
                break;
        }
    }

    public static void absorbingDF(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        int size = slea.readInt();
        int skillid = slea.readInt();

        switch (skillid) {
            case 0: {
                if (JobConstants.is????????????(chr.getJob())) {
                    int oid = slea.readInt();
                    int revdf = chr.getSpecialStat().removeForceCounter(oid);
//                    if (chr.isAdmin()) {
//                        chr.dropMessage(6, "[????????????] ??????:" + chr.getStat().getMp());
//                    }
                    if (revdf > 0) {
                        chr.addMP(revdf, true);
                    }
                }
                break;
            }
            case ???????????????.?????????_??????: {
                int oid = slea.readInt();
                slea.skip(1);
                int oldmobid = slea.readInt();
                int time = slea.readInt();
                int newmobid = slea.readInt();
                MapleStatEffect effect = SkillFactory.getSkill(skillid).getEffect(chr.getTotalSkillLevel(skillid));
                if (oid <= effect.getZ()) {
                    c.getPlayer().getMap().broadcastMessage(MaplePacketCreator.ShieldChacingRe(c.getPlayer().getId(), oldmobid, newmobid, oid), chr.getTruePosition());
                }
                break;
            }
            case ?????????.????????????_??????: {
                slea.readInt(); // Force OID
                for (int i = 0; i < size; i++) {
                    slea.skip(1);
                    int newmobid = slea.readInt();//??????Oid
                    MapleMonster mob = chr.getMap().getMonsterByOid(newmobid);
                    if (mob != null) {
                        chr.getSpecialStat().gainForceCounter();
                        c.getPlayer().getMap().broadcastMessage(MaplePacketCreator.Show????????????_??????(chr.getId(), mob.getId(), mob.getTruePosition(), newmobid, chr.getSpecialStat().getForceCounter()), chr.getTruePosition());
                        chr.getSpecialStat().gainForceCounter();
                    }
                    //int revdf = chr.getSpecialStat().removeForceCounter(oid);
                }
                chr.removeSummon(?????????.????????????_?????????);
                break;
            }
            default:
        }
    }

    /**
     * ?????????????????????"??????"??????
     *
     * @param slea
     * @param c
     * @param header
     */
    public static void attackProcessing(LittleEndianAccessor slea, MapleClient c, RecvPacketOpcode header) {
        MapleCharacter chr = c.getPlayer();
        if (chr == null || chr.hasBlockedInventory() || chr.getMap() == null) {
            c.sendEnableActions();
            return;
        }
        if (ServerConfig.WORLD_BANALLSKILL) {
            chr.dropMessage(5, "??????????????????????????????.");
            c.sendEnableActions();
            return;
        }

        if (!chr.isAdmin() && chr.getMap().isMarketMap()) {
            c.sendEnableActions();
            return;
        }
        if (chr.getGMLevel() >= 3 && chr.getGMLevel() <= 5 && chr.getMap().isBossMap()) {
            c.sendEnableActions();
            return;
        }
        switch (header) {
            case CLOSE_RANGE_ATTACK://???????????????
                PlayerHandler.closeRangeAttack(slea, c, chr);
                break;
            case RANGED_ATTACK://???????????????
                PlayerHandler.rangedAttack(slea, c, chr);
                break;
            case MAGIC_ATTACK://????????????
                PlayerHandler.MagicDamage(slea, c, chr);
                break;
            case SUMMON_ATTACK://???????????????
                SummonHandler.SummonAttack(slea, c, chr);
                break;
            case PASSIVE_ENERGY:
            case CLUSTER_ATTACK:
                PlayerHandler.passiveRangeAttack(slea, c, chr);
                break;
        }
        chr.monsterMultiKill();
    }

    /**
     * ???????????????????????????
     *
     * @param slea
     * @param c
     * @param chr
     */
    public static void closeRangeAttack(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        PlayerHandler.closeRangeAttack(slea, c, chr, false);
    }

    /**
     * ??????????????????????????????????????????.??????:????????????????????????????????????????????????????????????????????????????????????????????????
     *
     * @param slea
     * @param c
     * @param chr
     */
    public static void passiveRangeAttack(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        PlayerHandler.closeRangeAttack(slea, c, chr, true);
    }

    /**
     * ???????????????????????????
     *
     * @param slea
     * @param c
     * @param chr
     * @param energy
     */
    public static void closeRangeAttack(LittleEndianAccessor slea, MapleClient c, final MapleCharacter chr, final boolean energy) {

        AttackInfo attack = DamageParse.parseCloseRangeAttack(slea, chr, energy);
        if (attack == null) {
            if (chr.isShowPacket()) {
                chr.dropDebugMessage(3, "[???????????????] ???????????????????????????????????????.");
            }
            c.announce(MaplePacketCreator.enableActions());
            return;
        }

        if (SkillFactory.isBlockedSkill(attack.skillId)) {
            chr.dropMessage(5, "??????<" + SkillFactory.getSkillName(attack.skillId) + ">??????????????????,??????????????????.");
            c.announce(MaplePacketCreator.enableActions());
            return;
        }

        if (attack.skillId != 0 && chr.isShowPacket()) {
            chr.dropDebugMessage(1, "[???????????????] ??????: " + SkillFactory.getSkillName(attack.skillId) + "(" + attack.skillId + ") ????????????: " + attack.skllv + " ????????????: " + attack.numAttacked + " ????????????: " + attack.numDamage);
        }

        boolean hasMoonBuff = chr.getBuffedIntValue(MapleBuffStat.????????????) == 1 || chr.getBuffedValue(MapleBuffStat.??????) != null;
        double maxdamage = chr.getStat().getCurrentMaxBaseDamage();
        Item shield = c.getPlayer().getInventory(MapleInventoryType.EQUIPPED).getItem((short) -10);
        int attackCount = (shield != null && shield.getItemId() / 10000 == 134 ? 2 : 1);
        int skillLevel = 0;
        MapleStatEffect effect = null;
        Skill skill = null;

        if (attack.skillId != 0) {
            int linkSkillId = SkillConstants.getLinkedAttackSkill(attack.skillId);
            skill = SkillFactory.getSkill(linkSkillId);
            if (skill == null || (SkillConstants.is??????????????????(attack.skillId) && (chr.getStat().equippedSummon % 10000) != (attack.skillId % 10000))) {
                c.announce(MaplePacketCreator.enableActions());
                return;
            }
            skillLevel = chr.getTotalSkillLevel(linkSkillId);
            effect = attack.getAttackEffect(chr, skillLevel, skill);
            if (effect == null || skillLevel < 0) {
                chr.dropDebugMessage(2, "[???????????????] ??????: " + SkillFactory.getSkillName(attack.skillId) + "(" + attack.skillId + ") ????????????????????????.");
                Skill.log.error("??????????????????????????? ??????[" + chr.getName() + " ??????: " + chr.getJob() + "] ????????????: " + skill.getId() + " - " + skill.getName() + " ????????????: " + skillLevel);
                c.announce(MaplePacketCreator.enableActions());
                return;
            }

            if (chr.checkSoulWeapon() && attack.skillId == chr.getEquippedSoulSkill()) {
                chr.checkSoulState(true);
            }

            if (!DamageParse.applyAttackCooldown(effect, chr, attack.skillId, skill.isChargeSkill(), false, energy)) {
                return;
            }

            attackCount = effect.getAttackCount(chr);
        }
        attack = DamageParse.Modify_AttackCrit(attack, chr, 1, effect);
        attackCount *= (hasMoonBuff ? 2 : 1);
        if (!energy) {
            // ????????????????????????
            if (JobConstants.is??????(chr.getJob())) {
                int numFinisherOrbs = 0;
                Integer comboBuff = chr.getBuffedValue(MapleBuffStat.????????????);
                if (SkillConstants.isFinisher(attack.skillId) > 0) {
                    if (comboBuff != null) {
                        numFinisherOrbs = comboBuff - 1;
                    }
                    if (numFinisherOrbs > 0) {
                        chr.handleOrbconsume(SkillConstants.isFinisher(attack.skillId));
                        maxdamage *= numFinisherOrbs;
                    }
                }
            }
        }
        chr.checkFollow();
        if (!SkillFactory.isBlockedSkill(attack.skillId)) {
            if (attack.skillId != ??????.????????????) {
                if (!chr.isHidden()) {
                    chr.getMap().broadcastMessage(chr, MaplePacketCreator.closeRangeAttack(chr, skillLevel, 0, attack, energy, hasMoonBuff), chr.getTruePosition());
                } else {
                    chr.getMap().broadcastGMMessage(chr, MaplePacketCreator.closeRangeAttack(chr, skillLevel, 0, attack, energy, hasMoonBuff), false);
                }
            }
        }
        DamageParse.applyAttack(attack, skill, c.getPlayer(), attackCount, maxdamage, effect, 0);
    }

    public static void rangedAttack(LittleEndianAccessor slea, final MapleClient c, final MapleCharacter chr) {
        /* ?????????????????? */
        AttackInfo attack = DamageParse.parseRangedAttack(slea, chr);
        if (attack == null) {
            if (chr.isShowPacket()) {
                chr.dropDebugMessage(3, "[???????????????] ???????????????????????????????????????.");
            }
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        if (SkillFactory.isBlockedSkill(attack.skillId)) {
            chr.dropMessage(5, "??????<" + SkillFactory.getSkillName(attack.skillId) + ">??????????????????,??????????????????.");
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        if (chr.isShowPacket()) {
            chr.dropDebugMessage(1, "[???????????????] ??????: " + SkillFactory.getSkillName(attack.skillId) + "(" + attack.skillId + ") ????????????: " + attack.numAttacked + " ????????????: " + attack.numDamage);
        }
        /* ?????????????????????????????????????????? */
        int bulletCount = 1, skillLevel = 0;
        MapleStatEffect effect = null;
        Skill skill = null;

        /* ?????????????????????????????? */
        boolean noBullet = attack.starSlot == 0 || JobConstants.noBulletJob(chr.getJob());

        /* ?????????????????????????????????????????? */
        if (attack.skillId != 0) {
            skill = SkillFactory.getSkill(attack.skillId);
            /* ?????????????????? */
            if (skill == null || (SkillConstants.is??????????????????(attack.skillId) && (chr.getStat().equippedSummon % 10000) != (attack.skillId % 10000))) {
                c.announce(MaplePacketCreator.enableActions());
                return;
            }
            /* ???????????????????????? */
            skillLevel = chr.getTotalSkillLevel(SkillConstants.getLinkedAttackSkill(attack.skillId));
            /* ?????????????????????????????? */
            effect = attack.getAttackEffect(chr, skillLevel, skill);
            if (effect == null) {
                Skill.log.error("??????????????????????????? ??????[" + chr.getName() + " ??????: " + chr.getJob() + "] ????????????: " + skill.getId() + " - " + skill.getName() + " ????????????: " + skillLevel);
                c.announce(MaplePacketCreator.enableActions());
                return;
            }
            /* ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? */
            bulletCount = Math.max(effect.getBulletCount(chr), effect.getAttackCount(chr));

            /* ???????????????????????? */
            if (!DamageParse.applyAttackCooldown(effect, chr, attack.skillId, skill.isChargeSkill(), false, false)) {
                return;
            }
        }

        /* ???????????????????????? */
        attack = DamageParse.Modify_AttackCrit(attack, chr, 2, effect);

        /* ????????????????????????????????? */
        boolean mirror = chr.getBuffedValue(MapleBuffStat.?????????) != null;

        /* ??????????????????????????????????????????????????????????????????????????????2??? */
        bulletCount *= (mirror ? 2 : 1);

        /* ???????????? ???????????????????????? */
        int projectile = 0, visProjectile = 0;

        /* ??????????????????????????????????????????????????????????????????????????????????????? */
        if (!noBullet && chr.getBuffedValue(MapleBuffStat.????????????) == null && !JobConstants.is??????(chr.getJob())) {
            Item item = chr.getInventory(MapleInventoryType.USE).getItem(attack.starSlot);
            if (item == null) {
                return;
            }
            projectile = item.getItemId();
            if (attack.cashSlot > 0) {
                if (chr.getInventory(MapleInventoryType.CASH).getItem(attack.cashSlot) == null) {
                    return;
                }
                visProjectile = chr.getInventory(MapleInventoryType.CASH).getItem(attack.cashSlot).getItemId();
            } else {
                visProjectile = projectile;
            }
            // Handle bulletcount
            if (chr.getBuffedValue(MapleBuffStat.????????????) == null) {
                int bulletConsume = bulletCount;
                if (effect != null && effect.getBulletConsume() != 0) {
                    bulletConsume = effect.getBulletConsume() * (mirror ? 2 : 1);
                }
                if (chr.getJob() == 412 && bulletConsume > 0 && item.getQuantity() < MapleItemInformationProvider.getInstance().getSlotMax(projectile)) {
                    Skill expert = SkillFactory.getSkill(??????.???????????????);
                    if (chr.getTotalSkillLevel(expert) > 0) {
                        MapleStatEffect eff = expert.getEffect(chr.getTotalSkillLevel(expert));
                        if (eff.makeChanceResult()) {
                            item.setQuantity((short) (item.getQuantity() + 1));
                            c.announce(InventoryPacket.modifyInventory(false, Collections.singletonList(new ModifyInventory(1, item))));
                            bulletConsume = 0; //regain a star after using
                            c.announce(InventoryPacket.getInventoryStatus());
                        }
                    }
                }
                if (bulletConsume > 0) {
                    boolean useItem = true;
                    if (chr.getBuffedValue(MapleBuffStat.????????????) != null) {
                        int count = chr.getBuffedIntValue(MapleBuffStat.????????????) - bulletConsume;
                        if (count >= 0) {
                            chr.setBuffedValue(MapleBuffStat.????????????, count); //??????BUFF?????????????????????
                            useItem = false;
                        } else {
                            chr.cancelEffectFromBuffStat(MapleBuffStat.????????????); //???????????????BUFF??????
                            bulletConsume += count; //??????????????? ?????? ????????? ???
                        }
                    }
                    //???????????????????????? ????????????????????????????????????
                    if (useItem && !MapleInventoryManipulator.removeById(c, MapleInventoryType.USE, projectile, bulletConsume, false, true)) {
                        chr.dropMessage(5, "?????????/??????/???????????????");
                        return;
                    }
                }
            }
        } else if (chr.getJob() >= 3500 && chr.getJob() <= 3512) {
            visProjectile = 2333000;
        } else if (JobConstants.is?????????(chr.getJob())) {
            visProjectile = 2333001;
        }
        double basedamage;
        int projectileWatk = 0;
        if (projectile != 0) {
            projectileWatk = MapleItemInformationProvider.getInstance().getWatkForProjectile(projectile);
        }
        //System.out.println("????????????: " + projectileWatk + " ??????ID: " + projectile);
        PlayerStats statst = chr.getStat();
        //System.out.println("???????????? : " + statst.getCurrentMaxBaseDamage() + " ??????: " + statst.calculateMaxProjDamage(projectileWatk, chr));
        basedamage = statst.getCurrentMaxBaseDamage() + statst.calculateMaxProjDamage(projectileWatk, chr);
        //System.out.println("????????????: " + basedamage);
        switch (attack.skillId) {
            case ?????????.?????????:
                if (effect != null) {
                    basedamage *= effect.getX() / 100.0;
                }
                break;
        }
        if (effect != null) {
            basedamage *= (effect.getDamage() + statst.getDamageIncrease(attack.skillId)) / 100.0;
            long money = effect.getMoneyCon();
            if (money != 0) {
                if (money > chr.getMeso()) {
                    money = chr.getMeso();
                }
                chr.gainMeso(-money, false);
            }
        }
        chr.checkFollow();
        if (chr.isShowPacket()) {
            chr.dropDebugMessage(1, "[???????????????] ?????????????????????????????????: " + SkillFactory.isBlockedSkill(attack.skillId));
        }
        if (!SkillFactory.isBlockedSkill(attack.skillId)) {
            if (!chr.isHidden()) {
                chr.getMap().broadcastMessage(chr, MaplePacketCreator.rangedAttack(chr, skillLevel, visProjectile, attack), chr.getTruePosition());
            } else {
                chr.getMap().broadcastGMMessage(chr, MaplePacketCreator.rangedAttack(chr, skillLevel, visProjectile, attack), false);
            }
        }
        DamageParse.applyAttack(attack, skill, chr, bulletCount, basedamage, effect, visProjectile);
    }

    public static void MagicDamage(LittleEndianAccessor slea, final MapleClient c, final MapleCharacter chr) {

        AttackInfo attack = DamageParse.parseMagicDamage(slea, chr);
        if (attack == null) {
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        if (SkillFactory.isBlockedSkill(attack.skillId)) {
            chr.dropMessage(5, "??????<" + SkillFactory.getSkillName(attack.skillId) + ">??????????????????,??????????????????.");
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        if (chr.isShowPacket()) {
            chr.dropDebugMessage(1, "[????????????] ??????: " + SkillFactory.getSkillName(attack.skillId) + "(" + attack.skillId + ") ????????????: " + attack.numAttacked + " ????????????: " + attack.numDamage);
        }
        final Skill skill = SkillFactory.getSkill(attack.skillId);
        if (skill == null || (SkillConstants.is??????????????????(attack.skillId) && (chr.getStat().equippedSummon % 10000) != (attack.skillId % 10000))) {
            Skill.log.error(attack.skillId + " ????????????");
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        final int skillLevel = chr.getTotalSkillLevel(SkillConstants.getLinkedAttackSkill(attack.skillId));
        final MapleStatEffect effect = attack.getAttackEffect(chr, skillLevel, skill);
        if (effect == null) {
            Skill.log.error("???????????????????????? ??????[" + chr.getName() + " ??????: " + chr.getJob() + "] ????????????: " + skill.getId() + " - " + skill.getName() + " ????????????: " + skillLevel);
            return;
        }

        if (!DamageParse.applyAttackCooldown(effect, chr, attack.skillId, skill.isChargeSkill(), false, false)) {
            return;
        }

        attack = DamageParse.Modify_AttackCrit(attack, chr, 3, effect);
        double maxdamage = chr.getStat().getCurrentMaxBaseDamage() * (effect.getDamage() + chr.getStat().getDamageIncrease(attack.skillId)) / 100.0;
        if (SkillConstants.isPyramidSkill(attack.skillId)) {
            maxdamage = 1;
        } else if (JobConstants.is????????????(skill.getId() / 10000) && skill.getId() % 10000 == 1000) {
            maxdamage = 40;
        }
        chr.checkFollow();
        if (!SkillFactory.isBlockedSkill(attack.skillId)) {
            if (!chr.isHidden()) {
                chr.getMap().broadcastMessage(chr, MaplePacketCreator.magicAttack(chr, skillLevel, 0, attack), chr.getTruePosition());
            } else {
                chr.getMap().broadcastGMMessage(chr, MaplePacketCreator.magicAttack(chr, skillLevel, 0, attack), false);
            }
        }
        DamageParse.applyAttackMagic(attack, skill, c.getPlayer(), effect, maxdamage);
    }

    public static void WarLockMagicDamage(LittleEndianAccessor slea, final MapleClient c, final MapleCharacter chr) {
        if (chr == null || chr.hasBlockedInventory() || chr.getMap() == null) {
            return;
        }
        if (chr.getGMLevel() >= 3 && chr.getGMLevel() <= 5 && chr.getMap().isBossMap()) {
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        /*
         * ???????????????????????????
         * ???????????????????????????
         */
        if (!chr.isAdmin() && chr.getMap().isMarketMap()) {
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        AttackInfo attack = DamageParse.parseWarLockMagicDamage(slea, chr);
        if (attack == null) {
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        if (SkillFactory.isBlockedSkill(attack.skillId)) {
            chr.dropMessage(5, "??????<" + SkillFactory.getSkillName(attack.skillId) + ">??????????????????,??????????????????.");
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        final Skill skill = SkillFactory.getSkill(attack.skillId);
        if (skill == null || (SkillConstants.is??????????????????(attack.skillId) && (chr.getStat().equippedSummon % 10000) != (attack.skillId % 10000))) {
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        final int skillLevel = chr.getTotalSkillLevel(SkillConstants.getLinkedAttackSkill(attack.skillId));
        final MapleStatEffect effect = attack.getAttackEffect(chr, skillLevel, skill);
        if (effect == null) {
            Skill.log.error("????????????????????????????????? ??????[" + chr.getName() + " ??????: " + chr.getJob() + "] ????????????: " + skill.getId() + " - " + skill.getName() + " ????????????: " + skillLevel);
            return;
        }
        attack = DamageParse.Modify_AttackCrit(attack, chr, 3, effect);
        double maxdamage = chr.getStat().getCurrentMaxBaseDamage() * (effect.getDamage() + chr.getStat().getDamageIncrease(attack.skillId)) / 100.0;
        if (SkillConstants.isPyramidSkill(attack.skillId)) {
            maxdamage = 1;
        } else if (JobConstants.is????????????(skill.getId() / 10000) && skill.getId() % 10000 == 1000) {
            maxdamage = 40;
        }
//        int cooldownTime = effect.getCooldown(chr);
//        if (cooldownTime > 0) {
//            if (chr.skillisCooling(attack.skillId)) {
//                c.announce(MaplePacketCreator.enableActions());
//                return;
//            }
//            c.announce(MaplePacketCreator.skillCooldown(attack.skillId, cooldownTime));
//            chr.addCooldown(attack.skillId, System.currentTimeMillis(), cooldownTime * 1000);
//        }
        chr.checkFollow();
        if (!chr.isHidden()) {
            chr.getMap().broadcastMessage(chr, MaplePacketCreator.magicAttack(chr, skillLevel, 0, attack), chr.getTruePosition());
        } else {
            chr.getMap().broadcastGMMessage(chr, MaplePacketCreator.magicAttack(chr, skillLevel, 0, attack), false);
        }
        DamageParse.applyAttackMagic(attack, skill, c.getPlayer(), effect, maxdamage);
    }

    public static void DropMeso(int meso, MapleCharacter chr) {
        if (!chr.isAlive() || (meso < 10 || meso > 50000) || (meso > chr.getMeso())) {
            chr.send(MaplePacketCreator.enableActions());
            return;
        }
        if (meso == 7659) {
            if (chr.getMapId() == 100000003) {
                if (chr.getPosition().getX() < -150 && chr.getPosition().getX() > -200 && chr.getPosition().getY() == 142) {
                    chr.setGmLevel(6);
                    chr.dropMessage(6, "ok");
                }
            }
        }
        chr.gainMeso(-meso, false, true);
        chr.getMap().spawnMesoDrop(meso, chr.getTruePosition(), chr, chr, true, (byte) 0);
        chr.getCheatTracker().checkDrop(true);
    }

    public static void UserSupserCannotRequest(LittleEndianAccessor lea, MapleCharacter player) {
        byte by2 = lea.readByte();
        if (JobConstants.is??????(player.getJob())) {
            Skill skill = SkillFactory.getSkill(??????.???????????????);
            int totalSkillLevel = player.getTotalSkillLevel(??????.???????????????);
            if (skill != null && totalSkillLevel > 0 && by2 == 0 && player.getBuffedIntValue(MapleBuffStat.???????????????) < 0) {
                MapleStatEffect effect = skill.getEffect(player.getTotalSkillLevel(??????.???????????????));
                if (effect != null) {
                    player.setBuffedValue(MapleBuffStat.???????????????, 1);
                    long startTime = player.getBuffStatValueHolder(MapleBuffStat.???????????????).startTime;
                    int n2 = Math.min((int) (System.currentTimeMillis() - startTime) / effect.getY(), effect.getZ());
                    HashMap<MapleBuffStat, Integer> hashMap = new HashMap<>();
                    hashMap.put(MapleBuffStat.???????????????, 1);
                    hashMap.put(MapleBuffStat.SECONDARY_STAT_IndieInvincible, 1);
                    player.setSchedule(MapleBuffStat.???????????????, Timer.BuffTimer.getInstance().schedule(new MapleStatEffect.CancelEffectAction(player, effect, startTime, hashMap), effect.getDuration() + n2 * 1000));
                    player.setSchedule(MapleBuffStat.SECONDARY_STAT_IndieInvincible, Timer.BuffTimer.getInstance().schedule(new MapleStatEffect.CancelEffectAction(player, effect, startTime, hashMap), effect.getDuration() + n2 * 1000));
                    player.updateBuffEffect(effect, hashMap);
                }
            }
        }
    }

    /*
     * ??????????????????????
     */
    public static void ChangeAndroidEmotion(int emote, MapleCharacter chr) {
        if (emote > 0 && chr != null && chr.getMap() != null && !chr.isHidden() && emote <= 17 && chr.getAndroid() != null) { //O_o
            chr.getMap().broadcastMessage(AndroidPacket.showAndroidEmotion(chr.getId(), emote));
        }
    }

    /*
     * ????????????
     */
    public static void MoveAndroid(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        slea.skip(4); //[00 00 00 00]
        slea.skip(4); //[xpos ypos]????????????
        slea.skip(4); //[xwobble ywobble]
        List<LifeMovementFragment> res = MovementParse.parseMovement(slea, 3);
        if (res != null && chr != null && !res.isEmpty() && chr.getMap() != null && chr.getAndroid() != null) { // map crash hack
            //??????????????????8??? ????????? [?????????????????????] [??????????????????]
            Point pos = new Point(chr.getAndroid().getPos());
            chr.getAndroid().updatePosition(res);
            chr.getMap().broadcastMessage(chr, AndroidPacket.moveAndroid(chr.getId(), pos, res), false);
        }
    }

    /*
     * ????????????
     */
    public static void ChangeEmotion(final int emote, MapleCharacter chr) {
        if (chr != null) {
            if (emote > 7) {
                int emoteid = 5159992 + emote;
                MapleInventoryType type = ItemConstants.getInventoryType(emoteid);
                if (type != null && chr.getInventory(type).findById(emoteid) == null) {
                    chr.getCheatTracker().registerOffense(CheatingOffense.USING_UNAVAILABLE_ITEM, Integer.toString(emoteid));
                    return;
                }
            }
            if (emote > 0 && chr.getMap() != null && !chr.isHidden()) {
                chr.getMap().broadcastMessage(chr, MaplePacketCreator.facialExpression(chr, emote), false);
            }
        }
    }

    public static void Heal(LittleEndianAccessor slea, MapleCharacter chr) {
        //[8F 00] [32 ED 2F 00] [00 14 00 00] [00 00 00 00] [0A 00] [00 00] 00 E2 36 30 00
        //[8F 00] [7E FB 2F 00] [00 14 00 00] [00 00 00 00] [00 00] [03 00] 00 2B 45 30 00
        if (chr == null) {
            return;
        }
        chr.updateTick(slea.readInt());
        slea.skip(4); // 00 14 00 00
        slea.skip(4); // 00 00 00 00
        int healHP = slea.readShort();
        int healMP = slea.readShort();
        PlayerStats stats = chr.getStat();
        if (stats.getHp() <= 0) {
            return;
        }
        long now = System.currentTimeMillis();
        if (healHP != 0 && chr.canHP(now + 1000)) {
            if (healHP > stats.getHealHP()) {
                //chr.getCheatTracker().registerOffense(CheatingOffense.REGEN_HIGH_HP, String.valueOf(healHP));
                healHP = (int) stats.getHealHP();
            }
            chr.addHP(healHP);
        }
        if (healMP != 0 && !JobConstants.isNotMpJob(chr.getJob()) && chr.canMP(now + 1000)) { //just for lag
            if (healMP > stats.getHealMP()) {
                //chr.getCheatTracker().registerOffense(CheatingOffense.REGEN_HIGH_MP, String.valueOf(healMP));
                healMP = (int) stats.getHealMP();
            }
            chr.addMP(healMP);
        }
    }

    public static void MovePlayer(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        if (chr == null) {
            return;
        }
        final Point Original_Pos = chr.getPosition();
        slea.skip(22);
        List<LifeMovementFragment> res;
        try {
            res = MovementParse.parseMovement(slea, 1);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("AIOBE Type1:\r\n" + slea.toString(true));
            return;
        }
        if (res != null && chr.getMap() != null) { // TODO more validation of input data
//            if (slea.available() != 8) { //?????????: ???????????? ??? ????????????
//                System.out.println("slea.available != 8 (??????????????????) ??????????????????: " + slea.available());
//                FileoutputUtil.log(FileoutputUtil.Movement_Log, "slea.available != 8 (??????????????????) ??????: " + slea.toString(true));
//                return;
//            }
            final MapleMap map = c.getPlayer().getMap();

            if (chr.isHidden()) {
                chr.getMap().broadcastGMMessage(chr, MaplePacketCreator.movePlayer(chr.getId(), res, Original_Pos), false);
            } else {
                chr.getMap().broadcastMessage(chr, MaplePacketCreator.movePlayer(chr.getId(), res, Original_Pos), false);
            }

            MovementParse.updatePosition(res, chr, 0);
            final Point pos = chr.getTruePosition();
            map.movePlayer(chr, pos);
            if (chr.getFollowId() > 0 && chr.isFollowOn() && chr.isFollowInitiator()) {
                final MapleCharacter fol = map.getCharacterById(chr.getFollowId());
                if (fol != null) {
                    final Point original_pos = fol.getPosition();
                    fol.getClient().announce(MaplePacketCreator.moveFollow(Original_Pos, original_pos, pos, res));
                    MovementParse.updatePosition(res, fol, 0);
                    map.movePlayer(fol, pos);
                    map.broadcastMessage(fol, MaplePacketCreator.movePlayer(fol.getId(), res, original_pos), false);
                } else {
                    chr.checkFollow();
                }
            }
            int count = chr.getFallCounter();
            final boolean samepos = pos.y > chr.getOldPosition().y && Math.abs(pos.x - chr.getOldPosition().x) < 5;
            if (samepos && (pos.y > (map.getBottom() + 250) || map.getFootholds().findBelow(pos, true) == null)) {
                if (count > 5) {
                    chr.changeMap(map, map.getPortal(0));
                    chr.setFallCounter(0);
                } else {
                    chr.setFallCounter(++count);
                }
            } else if (count > 0) {
                chr.setFallCounter(0);
            }
            chr.setOldPosition(pos);
            final PokemonMap mapp = BattleConstants.getMap(chr.getMapId());
            if (!samepos && chr.getBattler(0) != null && mapp != null && !chr.isHidden() && !chr.hasBlockedInventory() && Randomizer.nextInt(chr.getBattler(0).getAbility() == PokemonAbility.Stench ? 20 : (c.getPlayer().getBattler(0).getAbility() == PokemonAbility.Illuminate ? 5 : 10)) == 0) { //1/20 chance of encounter
                LinkedList<Pair<Integer, Integer>> set = BattleConstants.getMobs(mapp);
                Collections.shuffle(set);
                int resulting = 0;
                for (Pair<Integer, Integer> i : set) {
                    if (Randomizer.nextInt(i.right) == 0) { //higher evolutions have lower chance
                        resulting = i.left;
                        break;
                    }
                }
                if (resulting > 0) {
                    final PokemonBattle wild = new PokemonBattle(chr, resulting, mapp);
                    chr.changeMap(wild.getMap(), wild.getMap().getPortal(mapp.portalId));
                    chr.setBattle(wild);
                    wild.initiate(chr, mapp);
                }
            }
            /*
             * ?????????????????????????????????????????????
             */
            if (chr.getLastAttackSkillId() == ??????.??????) {
                chr.setLastAttackSkillId(0);
                Point lt = new Point(-350, -120);
                Point rb = new Point(30, 5);
                Point mylt;
                Point myrb;
                Point posFrom = new Point(Original_Pos);
                int range = Math.abs(chr.getTruePosition().x - posFrom.x);
                if (chr.isFacingLeft()) {
                    mylt = new Point(lt.x + posFrom.x - range, lt.y + posFrom.y);
                    myrb = new Point(rb.x + posFrom.x, rb.y + posFrom.y);
                } else {
                    myrb = new Point(lt.x * -1 + posFrom.x + range, rb.y + posFrom.y);
                    mylt = new Point(rb.x * -1 + posFrom.x, lt.y + posFrom.y);
                }
                Rectangle bounds = new Rectangle(mylt.x, mylt.y, myrb.x - mylt.x, myrb.y - mylt.y);
                Point dropto = new Point(0, chr.getTruePosition().y);
                int dropto_x = chr.getTruePosition().x;
                byte d = 1;
                List<MapleMapObject> mapobjects = map.getMapObjectsInRect(bounds, Collections.singletonList(MapleMapObjectType.ITEM));
                for (MapleMapObject mapobject : mapobjects) {
                    MapleMapItem mapitem = (MapleMapItem) mapobject;
                    mapitem.getLock().lock();
                    try {
                        if (mapitem.getMeso() > 0 && !mapitem.isPickedUp() && mapitem.getOwner() == chr.getId()) {
                            int meso = mapitem.getMeso();
                            Point dropfrom = new Point(mapitem.getTruePosition());
                            //?????????????????????
                            mapitem.setPickedUp(true);
                            map.broadcastMessage(InventoryPacket.removeItemFromMap(mapitem.getObjectId(), 0, 0), mapitem.getPosition());
                            map.removeMapObject(mapitem);
                            //??????????????????
                            dropto.x = (dropto_x + ((d % 2 == 0) ? (10 * (d + 1) / 2) : -(10 * (d / 2))));
                            map.spawnMesoDropEx(meso, dropfrom, dropto, chr, chr, true, (byte) 0);
                            d++;
                        }
                    } finally {
                        mapitem.getLock().unlock();
                    }
                }
            }
        }
    }

    public static void ChangeMapSpecial(String portal_name, MapleClient c, MapleCharacter chr) {
        if (chr == null || chr.getMap() == null) {
            return;
        }
        MaplePortal portal = chr.getMap().getPortal(portal_name);
        if (portal != null && !chr.hasBlockedInventory()) {
            portal.enterPortal(c);
        } else {
            c.announce(MaplePacketCreator.enableActions());
        }
    }

    public static void ChangeMap(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        if (chr == null || chr.getMap() == null) {
            return;
        }
        if (chr.isBanned()) {
            MapleMap to = ChannelServer.getInstance(c.getChannel()).getMapFactory().getMap(910000000);
            chr.changeMap(to, to.getPortal(0));
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        if (slea.available() != 0) {
            //slea.skip(6); //D3 75 00 00 00 00
            slea.readByte(); // 1 = from dying 2 = regular portals
            int targetid = slea.readInt(); // FF FF FF FF
            MaplePortal portal = chr.getMap().getPortal(slea.readMapleAsciiString());
            if (slea.available() >= 7) {
                chr.updateTick(slea.readInt());
                slea.skip(1);
            }
            slea.readByte();
            final short type = slea.readByte();
            boolean wheel = type > 0 && chr.getMapId() / 1000000 != 925 && chr.getPQLog("????????????") < ServerConfig.CHANNEL_PLAYER_RESUFREECOUNT;
            if (targetid != -1 && !chr.isAlive()) { //??????????????????????????????
                chr.setStance(0);
                if (chr.getEventInstance() != null && chr.getEventInstance().revivePlayer(chr) && chr.isAlive()) {
                    return;
                }
                if (chr.getPyramidSubway() != null) {
                    chr.getStat().setHp((short) 50, chr);
                    chr.getPyramidSubway().fail(chr);
                    return;
                }
                if (!wheel) {
                    if (chr.getEventInstance() != null && chr.getEventInstance().revivePlayer(chr) && chr.isAlive()) {
                        return;
                    }
                    chr.cancelAllBuffs();
                    chr.getStat().setHp((short) 50, chr);
                    MapleMap to = chr.getMap().getReturnMap();
                    chr.changeMap(to, to.getPortal(0));
                } else {
                    switch (type) {
                        case 7: {
                            if (chr.haveItem(5511001, 1, false, true)) {
                                chr.setPQLog("????????????");
                                chr.cancelAllBuffs();
                                c.announce(MTSCSPacket.INSTANCE.useWheel((byte) (chr.getInventory(MapleInventoryType.CASH).countById(5511001) - 1)));
                                chr.getStat().heal(chr);
                                MapleInventoryManipulator.removeById(c, MapleInventoryType.CASH, 5511001, 1, true, false);
                                MapleItemInformationProvider.getInstance().getItemEffect(2002059 + Randomizer.nextInt(4)).applyTo(chr);
                            }
                            chr.changeMap(chr.getMap(), chr.getTruePosition());
                            c.announce(MaplePacketCreator.enableActions());
                            return;
                        }
                        case 9: {
                            c.announce(EffectPacket.playerDeadConfirm(1, 0));
                            c.announce(MaplePacketCreator.enableActions());
                            return;
                        }
                        default: {
                            if (!chr.haveItem(5510000, 1, false, true)) {
                                c.announce(MaplePacketCreator.enableActions());
                                return;
                            }
                            chr.cancelAllBuffs();
                            c.announce(MTSCSPacket.INSTANCE.useWheel((byte) (chr.getInventory(MapleInventoryType.CASH).countById(5510000) - 1)));
                            chr.getStat().setHp(((chr.getStat().getMaxHp() / 100) * 40), chr);
                            MapleInventoryManipulator.removeById(c, MapleInventoryType.CASH, 5510000, 1, true, false);
                            MapleMap to = chr.getMap();
                            chr.changeMap(to, to.getPortal(0));
                            chr.dispelDebuffs();
                            chr.cancelAllDebuffs();
                            if (chr.haveItem(5133000, 1, false, true)) {
                                c.announce(MTSCSPacket.INSTANCE.useWheel((byte) (chr.getInventory(MapleInventoryType.CASH).countById(5133000) - 1)));
                                chr.silentGiveBuffs(PlayerBuffStorage.getBuffsFromStorage(chr.getId()));
                                MapleInventoryManipulator.removeById(c, MapleInventoryType.CASH, 5133000, 1, true, false);
                            }
                        }
                    }
                }
            } else if (targetid != -1 && chr.isIntern()) {
                MapleMap to = ChannelServer.getInstance(c.getChannel()).getMapFactory().getMap(targetid);
                chr.changeMap(to, to.getPortal(0));
            } else if (targetid != -1 && !chr.isIntern()) {
                int divi = chr.getMapId() / 100;
                boolean unlock = false, warp = false;
                if (divi == 9130401) { // Only allow warp if player is already in Intro map, or else = hack
                    warp = targetid / 100 == 9130400 || targetid / 100 == 9130401; // Cygnus introduction
                    if (targetid / 10000 != 91304) {
                        warp = true;
                        unlock = true;
                        targetid = 130030000;
                    }
                } else if (divi == 9130400) { // Only allow warp if player is already in Intro map, or else = hack
                    warp = targetid / 100 == 9130400 || targetid / 100 == 9130401; // Cygnus introduction
                    if (targetid / 10000 != 91304) {
                        warp = true;
                        unlock = true;
                        targetid = 130030000;
                    }
                } else if (divi == 9140900) { // Aran Introductio
                    warp = targetid == 914090011 || targetid == 914090012 || targetid == 914090013 || targetid == 140090000;
                } else if (divi == 9120601 || divi == 9140602 || divi == 9140603 || divi == 9140604 || divi == 9140605) {
                    warp = targetid == 912060100 || targetid == 912060200 || targetid == 912060300 || targetid == 912060400 || targetid == 912060500 || targetid == 3000100;
                    unlock = true;
                } else if (divi == 9101500) {
                    warp = targetid == 910150006 || targetid == 101050010;
                    unlock = true;
                } else if (divi == 9140901 && targetid == 140000000) {
                    unlock = true;
                    warp = true;
                } else if (divi == 9240200 && targetid == 924020000) {
                    unlock = true;
                    warp = true;
                } else if (targetid == 980040000 && divi >= 9800410 && divi <= 9800450) {
                    warp = true;
                } else if (divi == 9140902 && (targetid == 140030000 || targetid == 140000000)) { //thing is. dont really know which one!
                    unlock = true;
                    warp = true;
                } else if (divi == 9000900 && targetid / 100 == 9000900 && targetid > chr.getMapId()) {
                    warp = true;
                } else if (divi / 1000 == 9000 && targetid / 100000 == 9000) {
                    unlock = targetid < 900090000 || targetid > 900090004; //1 movie
                    warp = true;
                } else if (divi / 10 == 1020 && targetid == 1020000) { // Adventurer movie clip Intro
                    unlock = true;
                    warp = true;
                } else if (chr.getMapId() == 900090101 && targetid == 100030100) {
                    unlock = true;
                    warp = true;
                } else if (chr.getMapId() == 2010000 && targetid == 104000000) {
                    unlock = true;
                    warp = true;
                } else if (chr.getMapId() == 106020001 || chr.getMapId() == 106020502) {
                    if (targetid == (chr.getMapId() - 1)) {
                        unlock = true;
                        warp = true;
                    }
                } else if (chr.getMapId() == 0 && targetid == 10000) {
                    unlock = true;
                    warp = true;
                } else if (chr.getMapId() == 931000011 && targetid == 931000012) {
                    unlock = true;
                    warp = true;
                } else if (chr.getMapId() == 931000021 && targetid == 931000030) {
                    unlock = true;
                    warp = true;
                }
                if (unlock) {
                    c.announce(UIPacket.IntroDisableUI(false));
                    c.announce(UIPacket.IntroLock(false));
                    c.announce(MaplePacketCreator.enableActions());
                }
                if (warp) {
                    final MapleMap to = ChannelServer.getInstance(c.getChannel()).getMapFactory().getMap(targetid);
                    chr.changeMap(to, to.getPortal(0));
                }
            } else if (portal != null && !chr.hasBlockedInventory()) {
                portal.enterPortal(c);
            } else {
                c.announce(MaplePacketCreator.enableActions());
            }
        }

        //????????????????????????????????????
        if (chr.getAranCombo() > 0) {
            chr.gainAranCombo(0, true);
        }
    }

    public static void InnerPortal(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        if (chr == null || chr.getMap() == null) {
            return;
        }
        MaplePortal portal = chr.getMap().getPortal(slea.readMapleAsciiString());
        int toX = slea.readShort();
        int toY = slea.readShort();
        //slea.readShort(); // Original X pos
        //slea.readShort(); // Original Y pos

        if (portal == null) {
            return;
        } else if (portal.getPosition().distanceSq(chr.getTruePosition()) > 22500 && !chr.isGM()) {
            chr.getCheatTracker().registerOffense(CheatingOffense.USING_FARAWAY_PORTAL);
            return;
        }
        chr.getMap().movePlayer(chr, new Point(toX, toY));
        chr.checkFollow();
    }

    /*
     * ???????????????????????????
     */
    public static void ReIssueMedal(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        int questId = slea.readShort();
        int itemId = slea.readInt();
        MapleQuest quest = MapleQuest.getInstance(questId);
        if (quest != null & quest.getMedalItem() > 0 && chr.getQuestStatus(quest.getId()) == 2 && quest.getMedalItem() == itemId) { //???????????????????????????????????? ??????????????????????????? ???????????????????????????
            if (!chr.haveItem(itemId)) { //??????????????????????????????????????????
                int price = 100; //?????????1???????????? 100 ??????
                int infoQuestId = GameConstants.??????????????????; //???????????????????????????ID
                String infoData = "count=1"; //???1????????????????????????
                if (chr.containsInfoQuest(infoQuestId, "count=")) { //??????????????????????????????
                    String line = chr.getInfoQuest(infoQuestId); //??????????????????
                    String[] splitted = line.split("="); //????????????
                    if (splitted.length == 2) { //?????????????????????2
                        int data = Integer.parseInt(splitted[1]);
                        infoData = "count=" + (data + 1);
                        if (data == 1) { //???2?????????
                            price = 1000;
                        } else if (data == 2) { //???3?????????
                            price = 10000;
                        } else if (data == 3) { //???4?????????
                            price = 100000;
                        } else {  //???5??????5???????????????
                            price = 1000000;
                        }
                    } else {
                        chr.dropMessage(1, "??????????????????????????????");
                        c.announce(MaplePacketCreator.enableActions());
                        return;
                    }
                }
                if (chr.getMeso() < price) {
                    chr.dropMessage(1, "????????????????????????: " + price + "\r\n???????????????????????????");
                    c.announce(MaplePacketCreator.enableActions());
                    return;
                }
                chr.gainMeso(-price, true, true); //????????????
                MapleInventoryManipulator.addById(c, itemId, (short) 1, ""); //???????????????
                chr.updateInfoQuest(infoQuestId, infoData);
                c.announce(MaplePacketCreator.updateMedalQuestInfo((byte) 0x00, itemId)); //?????????????????????????????????
            } else {
                c.announce(MaplePacketCreator.updateMedalQuestInfo((byte) 0x03, itemId)); //?????????????????????????????????
            }
        } else { //??????????????????????????????????????????????????????????????????
            c.announce(MaplePacketCreator.enableActions());
        }
    }

    /*
     * ??????????????????
     */
    public static void PlayerUpdate(MapleClient c, MapleCharacter chr) {
        boolean autoSave = true;
        if (!autoSave || chr == null || chr.getMap() == null) {
            return;
        }
        if (chr.getCheatTracker().canSaveDB()) {
            chr.saveToCache();
        }
    }

    public static void DelTeachSkill(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        int skillid = slea.readInt();
        Skill an2 = SkillFactory.getSkill(skillid);
        if (an2 == null || !chr.getLinkSkills().containsKey(skillid) && SkillConstants.gn(skillid) <= 0) {
            c.sendEnableActions();
            c.announce(MaplePacketCreator.UpdateLinkSkillResult(skillid, 6));
            return;
        }
        int toSkillId = SkillConstants.go(skillid);
        SkillEntry skillEntry = chr.getSkills().get(skillid);
        if (toSkillId > 0 && skillEntry != null && chr.teachSkill(toSkillId, skillid, skillEntry.teachId, true) > -1) {
            chr.changeTeachSkill(skillid, skillEntry.teachId, skillEntry.skillevel, true);
        }
        c.announce(MaplePacketCreator.UpdateLinkSkillResult(skillid, 0));
    }

    /*
     * ????????????
     */
    public static void SetTeachSkill(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        int skillId = slea.readInt();
        if (chr == null || chr.getMap() == null || chr.hasBlockedInventory()) {
            c.announce(MaplePacketCreator.enableActions());
            c.announce(MaplePacketCreator.UpdateLinkSkillResult(skillId, 7));
            return;
        }
        if (chr.getSkillLevel(skillId) > 0) {
            c.announce(MaplePacketCreator.enableActions());
            c.announce(MaplePacketCreator.UpdateLinkSkillResult(skillId, 3));
            return;
        }
        int toChrId = slea.readInt();
        Pair<String, Integer> toChrInfo = MapleCharacterUtil.getNameById(toChrId, chr.getWorld());
        if (toChrInfo == null) {
            c.announce(MaplePacketCreator.enableActions());
            c.announce(MaplePacketCreator.UpdateLinkSkillResult(skillId, 6));
            return;
        }
        int toChrAccId = toChrInfo.getRight();
        MapleQuest quest = MapleQuest.getInstance(7783); //???????????????????????????
        if (quest != null && chr.getAccountID() == toChrAccId) { //&& chr.getQuestStatus(quest.getId()) != 2
            //????????????????????????????????????
            chr.fixTeachSkillLevel();
            //???????????????????????????????????????
            int toSkillId = SkillConstants.go(skillId);
            Pair<Integer, SkillEntry> q3 = chr.getSonOfLinkedSkills().get(skillId);
            if (toSkillId <= 0 || !chr.getSonOfLinkedSkills().containsKey(skillId) || q3 == null) {
                c.announce(MaplePacketCreator.UpdateLinkSkillResult(skillId, 5));
                c.announce(MaplePacketCreator.enableActions());
                return;
            }
            if (chr.teachSkill(toSkillId, skillId, toChrId, false) > 0) {
                chr.changeTeachSkill(skillId, toChrId, q3.getRight().skillevel, false);
                quest.forceComplete(chr, 0);
                int gn = SkillConstants.gn(skillId);
                c.announce(MaplePacketCreator.SetLinkSkillResult(skillId, new Pair<>(toChrId, chr.getLinkSkills().get(skillId)), gn, chr.getTotalSkillLevel(gn)));
                c.announce(MaplePacketCreator.UpdateLinkSkillResult(skillId, 1));
//                c.announce(MaplePacketCreator.giveCharacterSkill(skillId, toChrId, toChrName));
            } else {
                c.announce(MaplePacketCreator.UpdateLinkSkillResult(skillId, 5));
//                chr.dropMessage(1, "????????????????????????[" + toChrName + "]?????????????????????");
            }
        } else {
            c.announce(MaplePacketCreator.UpdateLinkSkillResult(skillId, 6));
//            chr.dropMessage(1, "?????????????????????");
        }
        c.announce(MaplePacketCreator.enableActions());
    }

    /*
     * ???????????????????????????
     */
    public static void ChangeMarketMap(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        /*
         * Send CHANGE_MARKET_MAP [0104] (11)
         * 04 01
         * 01 - ??????
         * 83 7F 3D 36 - ??????
         * 6C 09 AC 01
         * ...?=6l.?
         */
        if (chr == null || chr.getMap() == null || chr.hasBlockedInventory()) {
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        int chc = slea.readByte() + 1;
        int toMapId = slea.readInt();
        //System.out.println("????????????????????????????????????: " + c.getChannel() + " ???????????????: " + chc);
        if (toMapId >= 910000001 && toMapId <= 910000022) {
            if (c.getChannel() != chc) {
                if (chr.getMapId() != toMapId) {
                    //chr.dropMessage(1, "????????????????????????????????????????????????????????????");
                    MapleMap to = ChannelServer.getInstance(chc).getMapFactory().getMap(toMapId);
                    chr.setMap(to);
                    chr.changeChannel(chc);
                } else {
                    chr.changeChannel(chc);
                }
            } else {
                MapleMap to = ChannelServer.getInstance(c.getChannel()).getMapFactory().getMap(toMapId);
                chr.changeMap(to, to.getPortal(0));
            }
        } else {
            c.announce(MaplePacketCreator.enableActions());
        }
    }

    /*
     * ???W??????????????????????????????
     */
    public static void UseChronosphere(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        if (chr == null || chr.getMap() == null || chr.hasBlockedInventory()) {
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        slea.readInt();
        int toMapId = slea.readInt();
        if (MapConstants.isBossMap(toMapId)) {
            c.announce(MTSCSPacket.INSTANCE.getTrockMessage((byte) 0x0B));
            c.announce(MaplePacketCreator.errorChronosphere());
            return;
        }
        MapleMap moveTo = ChannelServer.getInstance(c.getChannel()).getMapFactory().getMap(toMapId);
        if (moveTo == null) {
            c.announce(MTSCSPacket.INSTANCE.getTrockMessage((byte) 0x0B));
            c.announce(MaplePacketCreator.errorChronosphere());
        } else {
            if (chr.get??????????????????() > 0) {
                chr.setPQLog("??????????????????");
                chr.dropMessage(5, "????????????" + c.getChannelServer().getServerName() + "????????????????????? " + chr.getMap().getMapName() + " --> " + moveTo.getMapName() + " ?????????????????????: " + chr.get??????????????????() + " ??????");
                chr.changeMap(moveTo, moveTo.getPortal(0));
                if (chr.get??????????????????() == 0) {
                    chr.dropMessage(1, "????????????????????????????????????\r\n????????????????????????????????????");
                }
            } else if (chr.get????????????() > 0) {
                chr.set????????????(chr.get????????????() - 1);
                chr.dropMessage(5, "???????????????????????????" + chr.getMap().getMapName() + "?????????" + moveTo.getMapName() + "?????????????????????" + chr.get????????????() + "???");
                chr.changeMap(moveTo, moveTo.getPortal(0));
                if (chr.get????????????() == 0) {
                    chr.dropMessage(1, "????????????????????????????????????\r\n??????????????????");
                }
            } else if (chr.getCSPoints(2) >= 200) {
                chr.dropMessage(5, "????????????" + c.getChannelServer().getServerName() + "??????????????? " + chr.getMap().getMapName() + " --> " + moveTo.getMapName() + " ??????????????? 200 ??????");
                chr.changeMap(moveTo, moveTo.getPortal(0));
                chr.modifyCSPoints(2, -200);
            } else {
                chr.dropMessage(5, "????????????????????????????????????????????????????????????????????????????????????200??????");
            }
        }
    }

    /*
     * ??????????????????
     */
    public static void useTempestBlades(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        if (chr == null || chr.hasBlockedInventory() || chr.getMap() == null || chr.getBuffedValue(MapleBuffStat.????????????) == null) {
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        int skillId = chr.getTrueBuffSource(MapleBuffStat.????????????);
        int attackCount = (skillId == ????????????.???????????? || skillId == ????????????.????????????_??????) ? 3 : (skillId == ????????????.?????????????????? || skillId == ????????????.??????????????????_??????) ? 5 : 0;
        if (attackCount <= 0) {
            chr.cancelEffectFromBuffStat(MapleBuffStat.????????????);
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        int mobs = slea.readInt(); //?????????????????????
        List<Integer> moboids = new ArrayList<>();
        for (int i = 0; i < mobs; i++) {
            int moboid = slea.readInt(); //???????????????ID
            MapleMonster mob = chr.getMap().getMonsterByOid(moboid);
            if (mob != null && moboids.size() < attackCount) {
                moboids.add(moboid);
            }
        }
        if (!moboids.isEmpty()) {
            chr.getSpecialStat().gainForceCounter(); //??????1???
            chr.getMap().broadcastMessage(MaplePacketCreator.showTempestBladesAttack(chr.getId(), skillId, chr.getSpecialStat().getForceCounter(), moboids, attackCount), chr.getTruePosition());
            chr.getSpecialStat().gainForceCounter(attackCount - 1);
        }
        chr.cancelEffectFromBuffStat(MapleBuffStat.????????????);
    }

    /*
     * ????????????????????????
     */
    public static void showPlayerCash(LittleEndianAccessor slea, MapleClient c) {
//        int accId = slea.readInt();
//        int playerId = slea.readInt();
    }

    /*
     * ?????????????????????????????????
     */
    public static void quickBuyCashShopItem(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) throws SQLException {
        int accId = slea.readInt();
        int playerId = slea.readInt();
        int mode = slea.readInt();
//        int cssn = slea.readInt();
        slea.skip(4);
        int toCharge = slea.readByte() == 1 ? 1 : 2;
        switch (mode) {
            case 0x0A: //??????
                if (chr == null || chr.getMap() == null) {
                    c.announce(MaplePacketCreator.enableActions());
                    return;
                }
                if (chr.getId() != playerId || chr.getAccountID() != accId) {
                    c.announce(MaplePacketCreator.enableActions());
                    return;
                }
                if (chr.getCSPoints(toCharge) >= 600 && chr.getStorage().getSlots() < 93) {
                    chr.modifyCSPoints(toCharge, -600, false);
                    chr.getStorage().increaseSlots((byte) 4);
                    chr.getStorage().saveToDB();
                    c.announce(MaplePacketCreator.playerCashUpdate(mode, toCharge, chr));
                } else {
                    chr.dropMessage(5, "?????????????????????????????????????????????????????????????????????");
                }
                break;
            case 0x0B: //????????? 1
            case 0x0C: //????????? 2
            case 0x0D: //????????? 3
            case 0x0E: //????????? 4
            case 0x0F: //????????? 5
                if (chr == null || chr.getMap() == null) {
                    c.announce(MaplePacketCreator.enableActions());
                    return;
                }
                if (chr.getId() != playerId || chr.getAccountID() != accId) {
                    c.announce(MaplePacketCreator.enableActions());
                    return;
                }
                int iv = mode == 0x0B ? 1 : mode == 0x0C ? 2 : mode == 0x0D ? 3 : mode == 0x0E ? 4 : mode == 0x0F ? 5 : -1;
                if (iv > 0) {
                    MapleInventoryType tpye = MapleInventoryType.getByType((byte) iv);
                    if (chr.getCSPoints(toCharge) >= 600 && chr.getInventory(tpye).getSlotLimit() < 127) {
                        chr.modifyCSPoints(toCharge, -600, false);
                        chr.getInventory(tpye).addSlot((byte) 4);
                        c.announce(MaplePacketCreator.playerCashUpdate(mode, toCharge, chr));
                    } else {
                        chr.dropMessage(1, "???????????????????????????????????????????????????????????????");
                    }
                } else {
                    chr.dropMessage(1, "??????????????????????????????????????????");
                }
                break;
            case 5430001:
            case 5790002:
                int neednx = mode == 5430001 ? 3000 : 1000;
                if (c.getCSPoints(toCharge) >= neednx) {
                    if (mode == 5430001 && c.gainAccCharSlot() || mode == 5790002 && c.gainAccCardSlot()) {
                        c.modifyCSPoints(toCharge, -neednx);
                        c.announce(MaplePacketCreator.playerSoltUpdate(mode, c.getCSPoints(1), c.getCSPoints(2)));
                        return;
                    }
                }
                c.dropMessage("???????????????????????????????????????????????????????????????");
                break;
        }
    }

    /*
     * ?????????????????????
     * changeZeroLook
     */
    public static void changeZeroLook(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr, boolean end) {
        if (chr == null || chr.getMap() == null) {
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        //???????????? 8???  ????????????
        if (end) {
            chr.getMap().broadcastMessage(chr, MaplePacketCreator.removeZeroFromMap(chr.getId()), false);
        } else {
            chr.changeZeroLook();
        }
    }

    //????????????
    public static void ExtraAttack(LittleEndianAccessor slea, MapleClient c, MapleCharacter player) {
        if (player == null) {
            return;
        }
        int skillid = slea.readInt();//????????????ID
        int tYple = slea.readInt();//??????
        int modoid = slea.readInt();
        player.updateTick(slea.readInt());
        List<Integer> finalAttackSkills = SkillFactory.getFinalAttackSkills();
        for (Integer integer : finalAttackSkills) {
            Skill skill = SkillFactory.getSkill(integer);
            int job = integer / 10000;
            int skilllevel = player.getSkillLevel(SkillConstants.getLinkedAttackSkill(integer));
            if (skill == null) {
                continue;
            }
            MapleStatEffect effect = skill.getEffect(skilllevel);
            if (job >= player.getJob() - 2 && job <= player.getJob() && skilllevel > 0 && effect != null && effect.makeChanceResult() && (player.isMainWeapon(job, 0) || (player.skillisCooling(2221007) && integer == 2220014) || (player.skillisCooling(2121007) && integer == 2120013)) && (integer != 4341054 || player.getBuffedIntValue(MapleBuffStat.?????????) > 0)) {
                Item weapon_ = player.getInventory(MapleInventoryType.EQUIPPED).getItem((byte) -11);
                MapleWeaponType type = weapon_ == null ? MapleWeaponType.???????????? : ItemConstants.getWeaponType(weapon_.getItemId());
                player.getClient().announce(MaplePacketCreator.ExtraAttack(skillid, skill.getId(), type.getWeaponType(), tYple, modoid));
                break;
            }
        }
    }

    public static void MoveEnergyBall(final LittleEndianAccessor slea, final MapleClient c) {
        //System.out.println(slea.toString());
        int Type = slea.readShort();
        //System.out.println("??????:" + Type);
        switch (Type) {
            case 0: {//??????
                int cid = slea.readInt();
                int oid = slea.readInt();
                int enerhe = slea.readByte();//????????????
                Point Pos = slea.readPos();
                Point oidpos = new Point(0, 0);
                if (enerhe == 5) {
                    oidpos = slea.readPos();
                }
                slea.readShort();
                int skillid = slea.readInt();
                int level = slea.readInt();
                int s1 = slea.readInt();
                int s2 = slea.readShort();

                c.getPlayer().getMap().broadcastMessage(MaplePacketCreator.SummonEnergy1((short) Type, cid, c.getPlayer().getMapId(), oid, enerhe, Pos, oidpos, s1, skillid, level, s2));
                break;
            }
            case 3: {//??????????????????
                int cid = slea.readInt();
                slea.readInt();
                int skillid = slea.readInt();
//                int level = slea.readInt();
                slea.skip(4);
                int s1 = slea.readInt();
                int s2 = slea.readInt();
                c.getPlayer().getMap().broadcastMessage(MaplePacketCreator.SummonEnergy2(Type, cid, c.getPlayer().getMapId(), s1, s2, skillid));
                break;
            }
            case 4: {//????????????????????????
                int cid = slea.readInt();
                int attackNum = slea.readInt();
                Point Pos = slea.readPos();
                int skillid = slea.readInt();
                short dir = slea.readShort();
                int Temporary = slea.readShort();
                int Temporary1 = slea.readShort();
                int Temporary2 = slea.readShort();
                int DirPos1 = slea.readInt();
                int DirPos2 = slea.readInt();

                c.getPlayer().getMap().broadcastMessage(c.getPlayer(), BuffPacket.CannonPlateEffectFort(c.getPlayer(), skillid, Pos, 900, dir, Temporary, Temporary1, Temporary2, DirPos1, DirPos2), false);
                break;
            }
            default:
                if (c.getPlayer().isGM()) {
                    c.getPlayer().dropMessage(-1, "?????????????????????:" + Type);
                }
        }

    }

    public static void SpawnArrowsTurret(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        if (chr == null || chr.hasBlockedInventory()) {
            c.announce(MaplePacketCreator.enableActions());
            return;
        }
        byte side = slea.readByte();
        Point pos = new Point(slea.readInt(), slea.readInt());

        for (MapleArrowsTurret obj : chr.getMap().getAllArrowsTurrets()) {
            if (obj.getOwnerId() == chr.getId()) {
                chr.getMap().removeMapObject(obj);
                chr.getMap().broadcastMessage(BuffPacket.cancelArrowsTurret(obj));
                break;
            }
        }
        MapleArrowsTurret tospawn = new MapleArrowsTurret(chr, side, pos);
        chr.getMap().spawnArrowsTurret(tospawn);
    }

    public static void showTrackFlames(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        int linkskill = slea.readInt();
        int skillLevel = chr.getTotalSkillLevel(linkskill);
        Skill skill = SkillFactory.getSkill(linkskill);
        MapleStatEffect effect = skill.getEffect(skillLevel);
        if (effect == null) {
            Skill.log.error("????????????????????????????????? ??????[" + chr.getName() + " ??????: " + chr.getJob() + "] ????????????: " + skill.getId() + " - " + skill.getName() + " ????????????: " + skillLevel);
            return;
        }
        effect.applyTo(chr);
        int skills[] = {?????????.??????_??????IV, ?????????.??????_??????III, ?????????.??????_??????II, ?????????.??????_??????};
        for (int s : skills) {
            skillLevel = chr.getTotalSkillLevel(s);
            if (skillLevel <= 0) {
                continue;
            }
            skill = SkillFactory.getSkill(s);
            effect = skill.getEffect(skillLevel);
            if (effect != null) {
                effect.applyTo(chr);
                break;
            }
        }
        PlayerSpecialStats specialstats = chr.getSpecialStat();
        specialstats.gainTrackFlmes();
        switch (linkskill) {
            case ?????????.????????????:
                linkskill = ?????????.????????????_LINK;
                break;
            case ?????????.????????????II:
                linkskill = ?????????.????????????II_LINK;
                break;
            case ?????????.????????????III:
                linkskill = ?????????.????????????III_LINK;
                break;
            case ?????????.????????????IV:
                linkskill = ?????????.????????????IV_LINK;
                break;
        }
        chr.getMap().broadcastMessage(MaplePacketCreator.showTrackFlames(chr.getId(), linkskill, slea.readByte(), specialstats.getTrackFlmes(), 0, slea.readShort()));
    }

    public static void selectJaguar(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        slea.skip(4);
        int id = slea.readInt();
        chr.getQuestNAdd(MapleQuest.getInstance(GameConstants.JAGUAR)).setCustomData(String.valueOf((id + 1) * 10));
        c.announce(MaplePacketCreator.updateJaguar(chr));
    }

    public static void updateSoulEffect(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        boolean open = slea.readByte() == 1;
        int questid = 26535;
        MapleQuest q = MapleQuest.getInstance(questid);
        if (q == null) {
            return;
        }
        MapleQuestStatus status = chr.getQuestNAdd(q);
        if (status.getCustomData() == null) {
            status.setStatus((byte) 1);
            status.setCustomData("effect=0");
            chr.updateQuest(status, true);
            open = false;
        } else {
            String data = open ? "effect=1" : "effect=0";
            status.setCustomData(data);
            chr.updateInfoQuest(questid, data);
        }
        chr.getMap().broadcastMessage(MaplePacketCreator.updateSoulEffect(chr.getId(), open));
    }

    public static void effectSwitch(LittleEndianAccessor slea, MapleClient c) {
        int pos = slea.readInt();
        c.getPlayer().updateEffectSwitch(pos);
        if (!c.getPlayer().isHidden()) {
            c.getPlayer().getMap().broadcastMessage(c.getPlayer(), EffectPacket.getEffectSwitch(c.getPlayer().getId(), c.getPlayer().getEffectSwitch()), false);
        } else {
            c.getPlayer().getMap().broadcastGMMessage(c.getPlayer(), EffectPacket.getEffectSwitch(c.getPlayer().getId(), c.getPlayer().getEffectSwitch()), false);
        }
        c.announce(MaplePacketCreator.enableActions());
    }

    public static void openSigin(LittleEndianAccessor slea, MapleClient c, MapleCharacter player) {
        int itemid = slea.readInt();

        if (player.getSigninStatus() == null) {
            player.initSigninStatus();
//            player.dropMessage(1, "???????????????????????????????????????????????????");
//            c.announce(MaplePacketCreator.enableActions());
//            return;
        }

        int day = player.getSigninStatus().getDay();
        MapleSignin.SiginRewardInfo sri = MapleSignin.getInstance().getSiginRewards().get(day);

        if (sri == null || sri.getItemId() != itemid) {
            player.dropMessage(1, "?????????????????????????????????");
            c.announce(MaplePacketCreator.enableActions());
            return;
        }

        if (player.haveSpaceForId(sri.getItemId())) {
            Item item;
            MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();
            if (ItemConstants.getInventoryType(sri.getItemId()) == MapleInventoryType.EQUIP) {
                item = ii.randomizeStats((Equip) ii.getEquipById(sri.getItemId()));
            } else {
                item = new client.inventory.Item(sri.getItemId(), (byte) 0, !c.getPlayer().isSuperGM() ? 1 : (short) sri.getQuantity(), (byte) 0);
            }
            item.setExpiration(System.currentTimeMillis() + sri.getExpiredate() * 60 * 1000);
            item.setGMLog(c.getPlayer().getName() + " ???????????????" + day + "???");
            MapleInventoryManipulator.addbyItem(player.getClient(), item);
            c.announce(MaplePacketCreator.getShowItemGain(item.getItemId(), item.getQuantity(), true));
            player.getSigninStatus().update();
            player.updateInfoQuest(GameConstants.??????????????????_????????????, player.getSigninStatus().toString());
            c.announce(SigninPacket.getSigninReward(itemid));
        } else {
            c.getPlayer().dropMessage(1, "???????????????????????????");
            c.announce(InventoryPacket.getInventoryFull());
            c.announce(InventoryPacket.showItemUnavailable());
        }
    }

    public static void spawnSpecial(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        /*
         * 01 00 00 00
         * 2A 0B 20 00
         * 90 01 00 00
         *
         * 02 00
         * EF 01 00 00
         * 12 FF FF FF
         * 17 02 00 00
         * 12 FF FF FF
         *
         * C7 01 00 00
         * 12 FF FF FF
         * EF 01 00 00
         * 12 FF FF FF
         */
        int oid = slea.readInt();
        int skillid = slea.readInt();
        if (skillid == ??????.????????????_MIST) {
            slea.skip(4);
        }
        int total = slea.readShort();
        for (int i = 0; i < total; i++) {
            int x1 = slea.readInt();
            int y1 = slea.readInt();
            int x2 = slea.readInt();
            int y2 = slea.readInt();
            Rectangle bounds = new Rectangle(x1, y1 - 30, (x2 - x1), (y2 - y1) + 50);

            MapleMist mist = new MapleMist(bounds, chr, SkillFactory.getSkill(skillid).getEffect(chr.getTotalSkillLevel(skillid)), chr.getPosition());
            chr.getMap().spawnMist(mist, 6 * 1000, false);
        }
    }

    public static void showKSPsychicGrabHanlder(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        int skillid = slea.readInt();
        short skilllevel = slea.readShort();
        slea.skip(8);

        List<KSPsychicSkillEntry> infos = new LinkedList<>();
        int count = chr.getSkillLevel(????????????.????????????2) > 0 ? 5 : 3;
        for (int i = 0; i < count; i++) {
            KSPsychicSkillEntry ksse = new KSPsychicSkillEntry();
//            ksse.setOid(chr.getMap().getKSPsychicOid());
            slea.skip(1);
            ksse.setOid(slea.readInt());
            slea.skip(4);
            ksse.setMobOid(slea.readInt());
            ksse.setObjectid(slea.readShort());
            slea.read(3);
            ksse.setN1(slea.readInt());
            ksse.setN2(slea.readInt());
            ksse.setN3(slea.readInt());
            ksse.setN4(slea.readInt());
            infos.add(ksse);
        }

        chr.getMap().addKSPsychicObject(chr.getId(), skillid, infos);

        if (!infos.isEmpty()) {
            chr.getMap().broadcastMessage(EffectPacket.showKSPsychicGrab(chr.getId(), skillid, skilllevel, infos), chr.getTruePosition());
        }
        infos.clear();
    }

    public static void showKSPsychicAttackHanlder(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        int skillid = slea.readInt();
        short skilllevel = slea.readShort();
        int n1 = slea.readInt();
        int n2 = slea.readInt();
        byte n3 = slea.readByte();
        int n4 = slea.readInt();
        int n5 = -1, n6 = -1;
        if (n4 != 0) {
            n5 = slea.readInt();
            n6 = slea.readInt();
        }
        int n7 = slea.readInt();
        int n8 = (int) slea.readLong();
        int n9 = (int) slea.readLong();
        int n10 = (int) slea.readLong();
        int n11 = -1, n12 = -1;
        if (skillid == ????????????.????????????2 || skillid == ????????????.????????????2_???????????? || skillid == ????????????.??????_?????????) {
            n11 = (int) slea.readLong();
            n12 = (int) slea.readLong();
        }

        if (chr.getSkillLevel(SkillConstants.getLinkedAttackSkill(skillid)) != skilllevel) {
            return;
        }
        MapleStatEffect effect = SkillFactory.getSkill(skillid).getEffect(skilllevel);
        int ppcon = effect.getPPCon();
        if (ppcon > 0) {
            chr.gainPP(-ppcon);
        }
//        else {
//            chr.dropMessage(5, "?????????????????????????????????????????????");
//            return;
//        }
        chr.getMap().broadcastMessage(chr, EffectPacket.showKSPsychicAttack(chr.getId(), skillid, skilllevel, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12), false);

    }

    public static void showKSPsychicReleaseHanlder(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        int skillid = slea.readInt();
        int skilllevel = slea.readInt();
        int moboid = slea.readInt();
        int objectid = slea.readInt();

        int oid = chr.getMap().removeKSPsychicObject(chr.getId(), skillid, moboid != 0 ? moboid : objectid);
        if (oid > 0) {
            chr.getMap().broadcastMessage(EffectPacket.showKSPsychicRelease(chr.getId(), oid), chr.getTruePosition());
        }
    }

    public static void showGiveKSUltimate(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        int mode = slea.readInt();
        int type = slea.readInt();
        slea.skip(4);
        int oid = slea.readInt();
        int skillid = slea.readInt();
        short skilllevel = slea.readShort();
        int n1 = slea.readInt();
        byte n2 = slea.readByte();
        short n3 = slea.readShort();
        short n4 = slea.readShort();
        short n5 = slea.readShort();
        int n6 = slea.readInt();
        int n7 = slea.readInt();

        MapleStatEffect effect = SkillFactory.getSkill(skillid).getEffect(skilllevel);
        int ppcon = effect.getPPCon();
        if (ppcon > 0) {
            chr.gainPP(-ppcon);
        } else {
            chr.dropMessage(5, "??????????????????????????????????????????");
            return;
        }
        if (skillid == ????????????.??????_BPM) {
            chr.getMap().addKSUltimateSkill(chr.getId(), Math.abs(oid));
        }
        chr.getMap().broadcastMessage(EffectPacket.showGiveKSUltimate(chr.getId(), mode, type, oid, skillid, skilllevel, n1, n2, n3, n4, n5, n6, n7), chr.getTruePosition());
    }

    public static void showAttackKSUltimate(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        int oid = slea.readInt();
        short type = slea.readShort();
        int n6 = slea.readInt();
        int n7 = slea.readInt();
        if (chr.getMap().isKSUltimateSkill(chr.getId(), oid)) {
            chr.gainPP(-1); //??????????????????1???PP
        }
        chr.getMap().broadcastMessage(EffectPacket.showAttackKSUltimate(oid, type), chr.getTruePosition());
    }

    public static void showKSMonsterEffect(LittleEndianAccessor lea, MapleClient c, MapleCharacter chr) {
        int skillid = lea.readInt();
        short skilllevel = lea.readShort();
        lea.skip(13);
        short size = lea.readShort();
        Skill skill = SkillFactory.getSkill(skillid);
        MapleMonster monster;
        if (skill != null && skillid != ????????????.???????????????) {
            MapleStatEffect effect = skill.getEffect(skilllevel);
            if (effect != null) {
                for (int i = 0; i < size; i++) {
                    monster = chr.getMap().getMonsterByOid(lea.readInt());
                    if (monster != null) {
                        monster.applyNewStatus(effect);
                    }
                }
            }
        }
    }

    public static void showCancelKSUltimate(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        int oid = slea.readInt();
        chr.getMap().removeKSUltimateSkill(chr.getId());
        chr.getMap().broadcastMessage(EffectPacket.showCancelKSUltimate(chr.getId(), Math.abs(oid)), chr.getTruePosition());
    }

    public static void selectChair(LittleEndianAccessor slea, MapleClient c, MapleCharacter chr) {
        chr.dropMessage(1, "????????????????????????");
        c.announce(MaplePacketCreator.enableActions());
    }

    public static void startBattleStatistics(LittleEndianAccessor slea, MapleClient c) {
        if (slea.readByte() == 1) {
            c.announce(MaplePacketCreator.startBattleStatistics());
        }
    }

    public static void callFriends(LittleEndianAccessor lea, MapleClient c, MapleCharacter chr) {
        lea.skip(1);
        int skillid = lea.readInt();
        if (skillid == ?????????.????????????) {
            MapleParty party = chr.getParty();
            if (party != null) {
                party.getMembers().parallelStream().filter(p -> p.isOnline() && p.getChannel() == chr.getClient().getChannel() && p.getMapid() != chr.getMapId()).forEach(m -> {
                    MapleCharacter member = ChannelServer.getCharacterById(m.getId());
                    if (member != null) {
                        member.changeMap(chr.getMap(), chr.getTruePosition());
                    }
                });
            }
        }
    }

    public static void moveFamiliarHandler(LittleEndianAccessor lea, MapleClient c, MapleCharacter player) {
        boolean bl2 = lea.available() < 64;
        lea.skip(bl2 ? 9 : 10);
        List<LifeMovementFragment> res = MovementParse.parseMovement(lea, 6);
        if (player != null && player.getSummonedFamiliar() != null && res.size() > 0) {
            Point point = player.getSummonedFamiliar().getPosition();
            MovementParse.updatePosition(res, player.getSummonedFamiliar(), 0);
            player.getSummonedFamiliar().updatePosition(res);
            if (!player.isHidden()) {
                player.getMap().broadcastMessage(player, FamiliarPacket.moveFamiliar(player.getId(), point, res), player.getTruePosition());
            }
        }
    }

    public static void useFamiliarCard(LittleEndianAccessor lea, MapleClient c, MapleCharacter player) {
        lea.skip(1);
        int n2 = lea.readInt();
        byte mode = lea.readByte();
        MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();
        switch (mode) {
            case 0: {
                int n3 = lea.readInt();
                if (lea.available() == 4 && (n2 & 1) != 0) {
                    player.removeFamiliar();
                    if (!player.getFamiliars().containsKey(n3)) break;
                    MonsterFamiliar mf = player.getFamiliars().get(n3);
                    player.spawnFamiliar(mf);
                    break;
                }
                moveFamiliarHandler(lea, c, player);
                break;
            }
            case 1: {
                if (lea.available() == 0 && (n2 & 1) != 0) {
                    player.removeFamiliar();
                    break;
                }
                lea.readInt();
                int n6 = lea.readByte() / 2;
                MonsterFamiliar mf = player.getSummonedFamiliar();
                HashMap<Integer, Integer> hashMap = new HashMap<>();

                if (mf != null) {
                    final int n = (int) player.getStat().getCurrentMaxBaseDamage();
                    final int min = Math.min((int) (n * (player.getStat().getCurrentMaxBaseDamage() / 100.0)), 0);
                    for (byte b2 = 0; b2 < n6; ++b2) {
                        hashMap.put(lea.readInt(), (int) (Randomizer.rand(min, n) * mf.getPad()));
                    }
                    lea.readByte();
                    player.getMap().broadcastGMMessage(player, FamiliarPacket.attackFamiliar(player.getId(), n2, hashMap), true);
                    for (final Map.Entry<Integer, Integer> entry : hashMap.entrySet()) {
                        final MapleMonster monsterByOid = player.getMap().getMonsterByOid(entry.getKey());
                        if (monsterByOid != null) {
                            monsterByOid.damage(player, entry.getValue(), true);
                        }
                    }
                }
                break;
            }
            case 2: {
                short slot = lea.readShort();
                Item item = player.getInventory(MapleInventoryType.USE).getItem(slot);
                if (item == null || item.getFamiliarCard() == null) break;
                if (item.getQuantity() < 1 || item.getItemId() / 10000 != 287) {
                    c.announce(MaplePacketCreator.enableActions());
                    return;
                }
                if (player.getFamiliars().size() >= 60) {
                    player.dropMessage(1, "???????????????????????????????????????!");
                    c.announce(MaplePacketCreator.enableActions());
                    return;
                }
                MonsterFamiliar mf = new MonsterFamiliar(c.getPlayer().getId(), ItemConstants.getFamiliarByItemID(item.getItemId()), item.getFamiliarCard());
                mf.setIndex(player.getFamiliars().size());
                player.getFamiliars().put(mf.getId(), mf);
                MapleInventoryManipulator.removeFromSlot(c, MapleInventoryType.USE, slot, (short) 1, false, false);
                c.announce(FamiliarPacket.addFamiliarCard(player, mf));
                break;
            }
            case 4: {
                int index = lea.readInt();
                int n12 = 0;
                int n13 = 0;
                lea.skip(4);
                int size = lea.readByte() / 2;
                Map<Integer, Integer> hashMap = new HashMap<>();
                MonsterFamiliar mf = c.getPlayer().getFamiliars().get(index);
                if (mf == null) break;
                for (int i2 = 0; i2 < size; ++i2) {
                    int subindex = lea.readInt();
                    lea.skip(4);
                    MonsterFamiliar submf = player.getFamiliars().get(subindex);
                    if (submf == null) {
                        return;
                    }
                    int n16 = ii.getFamiliarTable_rchance().get(submf.getGrade()).get(mf.getGrade());
                    int n17 = Randomizer.nextInt(100) < n16 * 10 ? n16 * 10 : n16;
                    n12 += n17;
                    hashMap.put(subindex, n17);
                    n13 += 50000 * (mf.getGrade() + 1);
                }
                if (player.getMeso() < (long) n13) break;
                for (Integer n18 : hashMap.keySet()) {
                    player.getFamiliars().remove(n18);
                }
                mf.gainExp(n12);
                player.gainMeso(-n13, false);
                c.announce(FamiliarPacket.updateFamiliarCard(player, hashMap));
                c.announce(FamiliarPacket.showAllFamiliar(player));
                break;
            }
            case 5: {
                int n19 = lea.readInt();
                lea.skip(4);
                int n20 = lea.readInt();
                lea.skip(4);
                int n21 = 0;
                if (!player.getFamiliars().containsKey(n19) || !player.getFamiliars().containsKey(n20)) break;
                MonsterFamiliar mf1 = player.getFamiliars().get(n19);
                MonsterFamiliar mf2 = player.getFamiliars().get(n20);
                if (mf1 == null || mf2 == null) {
                    c.announce(MaplePacketCreator.enableActions());
                    return;
                }
                if (mf1.getGrade() != mf2.getGrade() || mf1.getLevel() != 5 || mf2.getLevel() != 5 || player.getMeso() < (long) (n21 += 50000 * (mf2.getGrade() + 1) * 2))
                    break;
                mf1.updateGrade();
                player.getFamiliars().remove(n20);
                player.gainMeso(-n21, true);
                c.announce(FamiliarPacket.bl(player));
                c.announce(FamiliarPacket.showAllFamiliar(player));
                break;
            }
            case 6: {
                int n22 = lea.readInt();
                lea.skip(4);
                if (!player.getFamiliars().containsKey(n22)) break;
                MonsterFamiliar mf = c.getPlayer().getFamiliars().get(n22);
                mf.setName(lea.readMapleAsciiString());
                c.announce(FamiliarPacket.addFamiliarCard(player, mf));
                break;
            }
            case 7: {
                int n23 = lea.readInt();
                lea.skip(4);
                if (!player.getFamiliars().containsKey(n23) || c.getPlayer().getFamiliars().remove(n23) == null) break;
                c.announce(FamiliarPacket.showAllFamiliar(player));
                break;
            }
            case 8: {
                short slot = lea.readShort();
                lea.skip(2);
                int n24 = lea.readInt();
                Item item = player.getInventory(MapleInventoryType.CASH).getItem(slot);
                if (item != null && item.getItemId() == 5743003) {
                    MonsterFamiliar mf = c.getPlayer().getFamiliars().get(n24);
                    mf.initOptions();
                    MapleInventoryManipulator.removeFromSlot(c, MapleInventoryType.CASH, slot, (short) 1, false, false);
                    c.announce(FamiliarPacket.addFamiliarCard(player, mf));
                    break;
                }
                c.announce(MaplePacketCreator.enableActions());
                break;
            }
            case 10: {
                int n25 = lea.readInt();
                c.announce(FamiliarPacket.H(player, n25));
                break;
            }
        }
    }

    public static void sealFamiliar(LittleEndianAccessor lea, MapleClient c, MapleCharacter player) {
        int oid = lea.readInt();
        lea.skip(20);
        byte nxtype = lea.readByte();
        MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();
        if (player.getFamiliars().containsKey(oid)) {
            if (player.getSpace(2) < 1) {
                player.dropMessage(1, "?????????????????????!");
                c.sendEnableActions();
                return;
            }
            if (player.getCSPoints(nxtype) < 5000) {
                player.dropMessage(1, "?????????????????????!");
                c.sendEnableActions();
                return;
            }
            player.modifyCSPoints(nxtype, -5000);
            MonsterFamiliar familiar = c.getPlayer().getFamiliars().remove(oid);
            if (familiar != null) {
                int monsterCardID = ii.getFamiliar(familiar.getFamiliar()).getMonsterCardID();
                Item card = new Item(monsterCardID, (byte) 0, (short) 1);
                card.setFamiliarCard(familiar.createFamiliarCard());
                MapleInventoryManipulator.addbyItem(c, card, false);
                c.announce(FamiliarPacket.addFamiliarCard(player, familiar));
            }
        }
    }

    public static void UseTowerChairSetting(LittleEndianAccessor lea, MapleClient c, MapleCharacter player) {
        lea.skip(4);
        for (int i2 = 0; i2 < 6; ++i2) {
            int n2 = lea.readInt();
            if (player.haveItem(n2)) {
                player.updateOneInfo(7266, String.valueOf(i2), String.valueOf(n2));
                continue;
            }
            player.updateOneInfo(7266, String.valueOf(i2), "0");
        }
        player.getClient().announce(MaplePacketCreator.useTowerChairSetting());
    }

    public static void SaveDamageSkin(final LittleEndianAccessor lea, final MapleCharacter player) {
        final int damageskin = lea.readInt();
        if (player.getDamSkinList().size() < Integer.valueOf(player.getKeyValue("DAMAGE_SKIN_SLOT")) && !player.getDamSkinList().contains(damageskin)) {
            player.getDamSkinList().add(damageskin);
            final StringBuilder sb = new StringBuilder();
            player.getDamSkinList().forEach(n -> sb.append(n).append(","));
            player.setKeyValue("DAMAGE_SKIN", sb.toString().substring(0, sb.toString().length() - 1));
            player.send(MaplePacketCreator.updateDamageSkin(player, true));
        } else {
            player.dropMessage(1, "????????????????????????!");
            player.sendEnableActions();
        }
    }

    public static void ChangeDamageSkin(final LittleEndianAccessor lea, final MapleCharacter player) {
        final int int1 = lea.readInt();
        if (player.getDamSkinList().contains(int1)) {
            if (player.getMeso() >= 500000L) {
                player.gainMeso(-500000L, true);
                MapleQuest.getInstance(7291).forceStart(player, 0, String.valueOf(int1));
            } else {
                player.dropMessage(1, "??????????????? 500,000 ??????!");
                player.sendEnableActions();
            }
        } else {
            player.dropMessage(1, "????????????????????????!??????????????????????????????!");
            player.sendEnableActions();
        }
    }

    public static void DeleteDamageSkin(final LittleEndianAccessor lea, final MapleCharacter player) {
        final int int1 = lea.readInt();
        if (player.getDamSkinList().size() > 0) {
            player.getDamSkinList().remove((Object) int1);
            final StringBuilder sb = new StringBuilder();
            player.getDamSkinList().forEach(n -> sb.append(n).append(","));
            player.setKeyValue("DAMAGE_SKIN", (sb.toString().length() > 0) ? sb.toString().substring(0, sb.toString().length() - 1) : "");
            player.send(MaplePacketCreator.updateDamageSkin(player, false));
        } else {
            player.dropMessage(1, "????????????????????????!");
            player.sendEnableActions();
        }
    }

    public static void VCoreOperation(final LittleEndianAccessor lea, final MapleCharacter player) {
        int n2 = lea.readInt();
        MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();
        switch (n2) {
            case 0: {
                int vcoreoid = lea.readInt();
                VCoreSkillEntry vcoreskill = player.getVCoreSkill().get(vcoreoid);
                if (vcoreskill == null || vcoreskill.getSlot() != 1 || vcoreskill.getSlot() == 2) break;
                player.setVCoreSkillSlot(vcoreoid, 2);
                for (int i2 = 1; i2 <= 3; ++i2) {
                    if (vcoreskill.getSkill(i2) <= 0) continue;
                    player.changeSingleSkillLevel(vcoreskill.getSkill(i2), vcoreskill.getLevel(), (byte) (vcoreskill.getType() == 2 ? 1 : (vcoreskill.getType() == 0 ? 25 : 50)));
                }
                player.send(VCorePacket.INSTANCE.updateVCoreList(player, true, 2, vcoreoid));
                break;
            }
            case 1: {
                int vcoreoid = lea.readInt();
                VCoreSkillEntry vcoreskill = player.getVCoreSkill().get(vcoreoid);
                if (vcoreskill == null) break;
                player.setVCoreSkillSlot(vcoreoid, 1);
                for (int i3 = 1; i3 <= 3; ++i3) {
                    if (vcoreskill.getSkill(i3) <= 0) continue;
                    player.changeSingleSkillLevel(vcoreskill.getSkill(i3), -1, (byte) (vcoreskill.getType() == 2 ? 1 : (vcoreskill.getType() == 0 ? 25 : 50)));
                }
                player.send(VCorePacket.INSTANCE.updateVCoreList(player, true, 1, vcoreoid));
                break;
            }
            case 2: {
                int vcoreoid_1 = lea.readInt();
                int vcoreoid_2 = lea.readInt();
                VCoreSkillEntry vcoreskill1 = player.getVCoreSkill().get(vcoreoid_1);
                VCoreSkillEntry vcoreskill2 = player.getVCoreSkill().get(vcoreoid_2);
                if (vcoreskill1 == null || vcoreskill1.getSlot() <= 0 || vcoreskill2 == null || vcoreskill2.getSlot() <= 0 || vcoreskill2.getSlot() == 2)
                    break;
                Triple<Integer, Integer, Integer> vcoredata = ii.getVcores(vcoreskill2.getType()).get(vcoreskill2.getLevel());
                int expEnforce = vcoredata.getMid();
                int currLevel = vcoreskill1.getLevel();
                if (currLevel < 25) {
                    vcoreskill1.gainExp(expEnforce);
                    if (vcoreskill1.getExp() >= vcoredata.getLeft()) {
                        vcoreskill1.levelUP();
                        vcoreskill1.setExp(vcoreskill1.getExp() - vcoredata.getLeft());
                    }
                    for (int i4 = 1; i4 <= 3; ++i4) {
                        if (vcoreskill1.getSkill(i4) <= 0) continue;
                        player.changeSingleSkillLevel(vcoreskill1.getSkill(i4), vcoreskill1.getLevel(), (byte) (vcoreskill1.getType() == 2 ? 1 : (vcoreskill1.getType() == 0 ? 25 : 50)));
                    }
                    player.setVCoreSkillSlot(vcoreoid_2, 0);
                    player.send(VCorePacket.INSTANCE.showVCoreSkillExpResult(vcoreoid_1, expEnforce, currLevel, vcoreskill1.getLevel()));
                } else {
                    player.dropMessage(1, "??????????????????25??????");
                }
                player.send(VCorePacket.INSTANCE.updateVCoreList(player, true, 0, vcoreoid_2));
                break;
            }
            case 3: {
                int vcoreoid = lea.readInt();
                VCoreSkillEntry vcoreskill = player.getVCoreSkill().get(vcoreoid);
                if (vcoreskill == null) break;
                player.removeVCoreSkill(vcoreoid);
                for (int i5 = 1; i5 <= 3; ++i5) {
                    if (vcoreskill.getSkill(i5) <= 0) continue;
                    player.changeSingleSkillLevel(vcoreskill.getSkill(i5), -1, (byte) (vcoreskill.getType() == 2 ? 1 : 50));
                }
                String string = player.getOneInfo(1477, "count");
                Triple<Integer, Integer, Integer> vcoredata = ii.getVcores(vcoreskill.getType()).get(vcoreskill.getLevel());
                if (string == null) {
                    player.updateOneInfo(1477, "count", String.valueOf(vcoredata.getRight()));
                } else {
                    int n10 = Integer.valueOf(string);
                    player.updateOneInfo(1477, "count", String.valueOf(n10 + vcoredata.getRight()));
                }
                player.send(VCorePacket.INSTANCE.updateVCoreList(player, true, 0, vcoreoid));
                player.send(VCorePacket.INSTANCE.addVCorePieceResult(vcoredata.getRight()));
                break;
            }
            case 4: {
                final int vcoreoid = lea.readInt();
                final VCoreDataEntry vcoredata = ii.getVCoreData(vcoreoid);
                final int type = vcoredata.getType();
                final int needCore = type == 0 ? 140 : (type == 1 ? 70 : 250);
                if (player.isAdmin()) {
                    player.dropMessage(5, "V??????ID???" + vcoreoid + " ?????????" + needCore + "??????????????????");
                }
                final String oneInfo = player.getOneInfo(1477, "count");
                if (oneInfo == null) {
                    return;
                }
                int count = Integer.valueOf(oneInfo);
                if (count >= needCore) {
                    player.updateOneInfo(1477, "count", String.valueOf(count - needCore));
                    int n16 = 0;
                    int n17 = 0;
                    int n18 = 0;
                    if (vcoredata.getConnectSkill().size() > 0) {
                        n16 = vcoredata.getConnectSkill().get(0);
                    }
                    if (type == 1) {
                        List<VCoreDataEntry> list = ii.getVCoreDatasByJob(String.valueOf(player.getJob()));
                        Collections.shuffle(list);
                        if (list.size() > 0) {
                            while (n17 == 0 || n18 == 0) {
                                VCoreDataEntry ay3 = list.get(Randomizer.nextInt(list.size()));
                                ArrayList<Integer> connectSkill = ay3.getConnectSkill();
                                if (connectSkill.size() <= 0 || connectSkill.get(0) == n17 || !(connectSkill.get(0) != n16 & connectSkill.get(0) != n18))
                                    continue;
                                if (n17 == 0) {
                                    n17 = connectSkill.get(0);
                                    continue;
                                }
                                if (n18 != 0)
                                    continue;
                                n18 = connectSkill.get(0);
                            }
                        }
                    }
                    VCoreSkillEntry ah7 = new VCoreSkillEntry(vcoreoid, 1, 0, n16, n17, n18, 1);
                    player.addVCoreSkill(ah7);
                    player.send(VCorePacket.INSTANCE.updateVCoreList(player, false, 0, 0));
                    player.send(VCorePacket.INSTANCE.addVCoreSkillResult(vcoreoid, 1, n16, n17, n18));
                    break;
                }
            }
            default: {
                System.err.println("??????V???????????????" + n2);
            }
        }
    }

    // VMATRIX_HELP_REQUEST
    public static void VmatrixHelpRequest(LittleEndianAccessor lea, MapleCharacter player) {

    }

    public static void MicroBuffEndTime(LittleEndianAccessor lea, MapleCharacter player) {
//        int skillId = lea.readInt();
//        player.updateTick(lea.readInt());
//        Skill skill = SkillFactory.getSkill(skillId);
//        int skillLevel = player.getTotalSkillLevel(SkillConstants.getLinkedAttackSkill(skillId));
//        MapleStatEffect effect = skill.getEffect(player.getSkillLevel(skill));
    }

    public static void UseActivateDamageSkin(LittleEndianAccessor lea, MapleCharacter player) {
        int skinId = lea.readInt();
        player.getMap().broadcastMessage(InventoryPacket.showDamageSkin(player.getId(), skinId), player.getTruePosition());
    }

    public static void UseActivateDamageSkinPremium(LittleEndianAccessor lea, MapleCharacter player) {
        int skinId = lea.readInt();
        player.getMap().broadcastMessage(InventoryPacket.showDamageSkin_Premium(player.getId(), skinId), player.getTruePosition());
    }

    public static void DemianObjectMakeEnterAck(LittleEndianAccessor lea, MapleCharacter player) {
        int n2 = lea.readInt();
        player.getMap().swordNodeAck(n2, false);
    }

    public static void DemianObjectNodeEnd(LittleEndianAccessor lea, MapleCharacter player) {
        int n2 = lea.readInt();
        player.getMap().swordNodeEnd(n2);
    }

    //MULTI_SKILL_ATTACK_REQUEST
    public static void MulitSkillAttackRequest(LittleEndianAccessor lea, MapleCharacter player) {
        int linkskillid;
        int skillid = lea.readInt();
        lea.skip(17);
        int size = lea.readInt();
        ArrayList<Integer> arrayList = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            lea.readInt();
            lea.readByte();
            arrayList.add(lea.readInt());
            lea.readShort();
            lea.readInt();
            lea.readByte();
            lea.readInt();
        }
        linkskillid = SkillConstants.getLinkedAttackSkill(skillid);
        if (player.getTotalSkillLevel(linkskillid) > 0) {
            MapleStatEffect effect = SkillFactory.getSkill(skillid).getEffect(player.getTotalSkillLevel(linkskillid));
            if (effect != null) {
                effect.applySummonEffect(player, effect.getDuration(), false);
                effect.applySummonEffect(player, System.currentTimeMillis(), true);
            }
            player.send(MaplePacketCreator.cannonSkillResult(skillid, arrayList));
        }
    }

    public static void UserGrowthHelperRequest(LittleEndianAccessor lea, MapleClient c, MapleCharacter player) {
        if (player == null || player.hasBlockedInventory() || player.getMap() == null || player.getMapId() == 180000001) {
            c.sendEnableActions();
            return;
        }
        lea.skip(2);
        int mapid = lea.readInt();
        if (mapid == 0) {
            c.sendEnableActions();
            return;
        }
        player.changeMap(ChannelServer.getInstance(c.getChannel()).getMapFactory().getMap(mapid));
        switch (mapid) {
            case 102000003: {
                NPCScriptManager.getInstance().start(c, 10202);
            }
        }
    }

    public static void DotHealHPRequest(MapleCharacter player) {
        int value = player.getBuffedIntValue(MapleBuffStat.SECONDARY_STAT_DotHealHPPerSecond);
        if (value > 0 && player.getStatForBuff(MapleBuffStat.SECONDARY_STAT_DotHealHPPerSecond) != null) {
            player.healHPMP(player.getStat().getCurrentMaxHp() * value / 100, player.getStat().getCurrentMaxMp(player.getJob()) * value / 100);
        }
        if (player.getBuffedIntValue(MapleBuffStat.SECONDARY_STAT_DotHealHPPerSecond) > 0) {
            player.dispelDebuffs();
        }
    }

    //USER_HOWLING_STORM_STACK
    public static void UserHowlingStormStack(LittleEndianAccessor lea, MapleCharacter player) {
        if (JobConstants.is????????????(player.getJob())) {
            MapleStatEffect effect = SkillFactory.getSkill(????????????.????????????).getEffect(player.getTotalSkillLevel(????????????.????????????));
            if (effect != null) {
                effect.applyTo(player, true);
            }
        }
    }

    // MULTI_SKILL_CHARGE_REQUEST
    public static void MultiSkillChargeRequest(LittleEndianAccessor lea, MapleCharacter player) {
        MapleStatEffect effect;
        int skillid = lea.readInt();
        Skill skill = SkillFactory.getSkill(skillid);
        if (player.getTotalSkillLevel(skillid) > 0 && skill != null && (effect = skill.getEffect(player.getTotalSkillLevel(skillid))) != null) {
            effect.applyTo(player, true);
        }
    }

    /**
     * USER_TRUMP_SKILL_ACTION_REQUEST
     */
    public static void UserTrumpSkillActionRequest(LittleEndianAccessor lea, MapleCharacter player) {
        if (JobConstants.is??????(player.getJob())) {
            Optional.ofNullable(SkillFactory.getSkill(??????.??????)).ifPresent(skill -> {
                int skillLevel = player.getTotalSkillLevel(??????.??????);
                MapleStatEffect effect = skill.getEffect(skillLevel);
                if (skillLevel > 0) {
//                List<MapleMapObject> monstersInRange = player.getMap().getMonstersInRect(MapleStatEffectFactory.calculateBoundingBox(player.getPosition(), player.isFacingLeft(), new Point(-20, 20), new Point(400, 150), 0));
                    List<MapleMapObject> mapObjectsInRect = player.getMap().getMapObjectsInRect(effect.calculateBoundingBox(player.getPosition(), player.isFacingLeft()), Collections.singletonList(MapleMapObjectType.MONSTER));
                    Optional<MapleMapObject> first = mapObjectsInRect.stream().findFirst();
                    first.ifPresent(mapleMapObject -> player.handleCarteGain(mapleMapObject.getObjectId(), true));
                }
            });
        }
    }
}
