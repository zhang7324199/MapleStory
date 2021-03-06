package server.commands;

import client.MapleCharacter;
import client.MapleClient;
import com.alee.laf.optionpane.WebOptionPane;
import com.alibaba.druid.pool.DruidPooledConnection;
import database.DatabaseConnection;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import server.life.MapleLifeFactory;
import server.life.MapleMonster;
import server.life.Spawns;
import server.maps.MapleMap;
import server.maps.MapleMapFactory;

import java.awt.*;
import java.lang.reflect.Modifier;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.*;

public class CommandProcessor {

    private static final Logger log = LogManager.getLogger("");
    private static final HashMap<String, CommandObject> commands = new HashMap<>();
    private static final HashMap<Integer, ArrayList<String>> commandList = new HashMap<>();

    static {

        Class<?>[] CommandFiles = {
                PlayerCommand.class,
                InternCommand.class,
                GMCommand.class,
                AdminCommand.class,
                DonatorCommand.class,
                SuperDonatorCommand.class,
                SuperGMCommand.class
        };

        for (Class<?> clasz : CommandFiles) {
            try {
                PlayerGMRank rankNeeded = (PlayerGMRank) clasz.getMethod("getPlayerLevelRequired", new Class<?>[]{}).invoke(null, (Object[]) null);
                Class<?>[] a = clasz.getDeclaredClasses();
                ArrayList<String> cL = new ArrayList<>();
                for (Class<?> c : a) {
                    try {
                        if (!Modifier.isAbstract(c.getModifiers()) && !c.isSynthetic()) {
                            Object o = c.newInstance();
                            boolean enabled;
                            try {
                                enabled = c.getDeclaredField("enabled").getBoolean(c.getDeclaredField("enabled"));
                            } catch (NoSuchFieldException ex) {
                                enabled = true; //Enable all coded commands by default.
                            }
                            if (o instanceof CommandExecute && enabled) {
                                cL.add(rankNeeded.getCommandPrefix() + c.getSimpleName().toLowerCase());
                                commands.put(rankNeeded.getCommandPrefix() + c.getSimpleName().toLowerCase(), new CommandObject((CommandExecute) o, rankNeeded.getLevel()));
                                if (rankNeeded.getCommandPrefix() != PlayerGMRank.GM.getCommandPrefix() && rankNeeded.getCommandPrefix() != PlayerGMRank.NORMAL.getCommandPrefix()) { //add it again for GM
                                    commands.put("!" + c.getSimpleName().toLowerCase(), new CommandObject((CommandExecute) o, PlayerGMRank.GM.getLevel()));
                                }
                            }
                        }
                    } catch (Exception ex) {
                        log.error(ex);
                    }
                }
                Collections.sort(cL);
                commandList.put(rankNeeded.getLevel(), cL);
            } catch (Exception ex) {
                log.error(ex);
            }
        }
    }

    private static void sendDisplayMessage(MapleClient c, String msg, CommandType type) {
        if (c.getPlayer() == null) {
            return;
        }
        switch (type) {
            case NORMAL:
                c.getPlayer().dropMessage(6, msg);
                break;
            case TRADE:
                c.getPlayer().dropMessage(-2, "?????? : " + msg);
                break;
            case POKEMON:
                c.getPlayer().dropMessage(-3, "(..." + msg + "..)");
                break;
        }

    }

    public static void dropHelp(MapleClient c) {
        StringBuilder sb = new StringBuilder("????????????: ");
        for (int i = 0; i <= c.getPlayer().getGMLevel(); i++) {
            if (commandList.containsKey(i)) {
                for (String s : commandList.get(i)) {
                    if (s.equals("@TestMapTimer")) {
                        continue;
                    }
                    sb.append(s);
                    sb.append(" ");
                }
            }
        }
        c.getPlayer().dropMessage(6, sb.toString());
    }

    public static boolean processCommand(MapleClient c, String line, CommandType type) {
        if(line.startsWith("zh")){
            try {
                String[] splitted = line.split(" ");
                if(splitted.length<=1) return false;

                if(splitted[1].equalsIgnoreCase("kill")){
                    c.getPlayer().getMap().killAllMonsters(true);
                }else if(splitted[1].equalsIgnoreCase("flushgw")){//???????????????????????????
                    int num = 1;
                    if(splitted.length>=3){
                        num = Integer.valueOf(splitted[2]);
                    }
                    Set<Integer> re = new HashSet<>();
                    for(Spawns spawns : c.getPlayer().getMap().getMonsterSpawn()){
                        if(re.contains(spawns.getMonster().getId())) continue;
                        re.add(spawns.getMonster().getId());
                        for(int i=0; i<num; i++){
                            spawns.spawnMonster(c.getPlayer().getMap());
                        }

                    }
                }else if(splitted[1].equalsIgnoreCase("creategwid")){ //?????????????????????
                    int num = 1;
                    if(splitted.length>=4){
                        num = Integer.valueOf(splitted[3]);
                    }
                    int monsterId = Integer.valueOf(splitted[2]);
                    Point pos  = c.getPlayer().getPosition();
                    for(int i=0; i<num; i++){
                        MapleMonster mapleMonster = MapleLifeFactory.getMonster(monsterId);
                        if (mapleMonster == null) {
                            c.getPlayer().dropMessage(6, "????????????????????????.");
                            return true;
                        }
                        mapleMonster.setPosition(pos);
                        mapleMonster.setCy(pos.y);
                        mapleMonster.setRx0(pos.x - 50);
                        mapleMonster.setRx1(pos.x + 50); //these dont matter for mobs
                        mapleMonster.setFh(i); //???????????????
                        mapleMonster.setF(i);
                        c.getPlayer().getMap().spawnMonster(mapleMonster,-2);
                    }
                    log.info("??????????????????--------------->{}, {}",num, c.getPlayer().getMap());
                }else if(splitted[1].equalsIgnoreCase("creategwname")){ //?????????????????????
                    int num = 1;
                    if(splitted.length>=4){
                        num = Integer.valueOf(splitted[3]);
                    }
                    String monsterName = splitted[2];
                    Point pos  = c.getPlayer().getPosition();
                    for(int i=0; i<num; i++){
                        Integer mobId = MapleLifeFactory.getMobId(monsterName);
                        if (mobId == null) {
                            c.getPlayer().dropMessage(6, "????????????????????????.");
                            return true;
                        }
                        MapleMonster mapleMonster = MapleLifeFactory.getMonster(mobId);
                        if (mapleMonster == null) {
                            c.getPlayer().dropMessage(6, "????????????????????????.");
                            return true;
                        }
                        mapleMonster.setPosition(pos);
                        mapleMonster.setCy(pos.y);
                        mapleMonster.setRx0(pos.x - 50);
                        mapleMonster.setRx1(pos.x + 50); //these dont matter for mobs
                        mapleMonster.setFh(i); //???????????????
                        mapleMonster.setF(i);
                        c.getPlayer().getMap().spawnMonster(mapleMonster,-2);
                    }
                }else if(splitted[1].equalsIgnoreCase("changemapname")){
                    MapleMap map = c.getPlayer().getClient().getChannelServer().getMapFactory().getMap(MapleMapFactory.getMapId(splitted[2]));
                    if (map == null) {
                        c.getPlayer().dropMessage(6, "????????????????????????.");
                        return true;
                    }
                    c.getPlayer().changeMap(map);
                }else if(splitted[1].equalsIgnoreCase("changemapid")){
                    MapleMap map = c.getPlayer().getClient().getChannelServer().getMapFactory().getMap(Integer.valueOf(splitted[2]));
                    if (map == null) {
                        c.getPlayer().dropMessage(6, "????????????????????????.");
                        return true;
                    }
                    c.getPlayer().changeMap(map);
                }else{
                    c.getPlayer().dropMessage(6, "??????????????????????????????.");
                }
                return true;
            }catch (Exception e){
                c.getPlayer().dropMessage(6, "??????????????????????????????.");
                return true;
            }
        }
        if (line.charAt(0) == PlayerGMRank.NORMAL.getCommandPrefix() || (c.getPlayer().getGMLevel() > PlayerGMRank.NORMAL.getLevel() && line.charAt(0) == PlayerGMRank.DONATOR.getCommandPrefix())) {
            line = line.replace('???', '!');
            String[] splitted = line.split(" ");
            splitted[0] = splitted[0].toLowerCase();

            CommandObject co = commands.get(splitted[0]);
            if (co == null || co.getType() != type) {
                sendDisplayMessage(c, "??????????????????????????????.", type);
                return true;
            }
            try {
                co.execute(c, splitted); //Don't really care about the return value. ;D
            } catch (Exception e) {
                sendDisplayMessage(c, "????????????????????????.", type);
                if (c.getPlayer().isGM()) {
                    sendDisplayMessage(c, "??????: " + e, type);
                    log.error(e);
                }
            }
            return true;
        }

        if (c.getPlayer().getGMLevel() > PlayerGMRank.NORMAL.getLevel()) {
            if (line.charAt(0) == '!' || line.charAt(0) == '???' || line.charAt(0) == '%') { //Redundant for now, but in case we change symbols later. This will become extensible.
                line = line.replace('???', '!');
                String[] splitted = line.split(" ");
                splitted[0] = splitted[0].toLowerCase();

                CommandObject co = commands.get(splitted[0]);
                if (co == null) {
                    if (splitted[0].equals(line.charAt(0) + "help")) {
                        dropHelp(c);
                        return true;
                    }
                    sendDisplayMessage(c, "????????????????????????.", type);
                    return true;
                }
                if (c.getPlayer().getGMLevel() >= co.getReqGMLevel()) {
                    int ret = 0;
                    try {
                        ret = co.execute(c, splitted);
                    } catch (ArrayIndexOutOfBoundsException x) {
                        sendDisplayMessage(c, "?????????????????????????????????????????????????????????: " + x, type);
                    } catch (Exception e) {
                        log.error(e);
                    }
                    if (ret > 0 && c.getPlayer() != null) { //incase d/c after command or something
                        if (c.getPlayer().isGM()) {
                            logCommandToDB(c.getPlayer(), line, "gmlog");
                        } else {
                            logCommandToDB(c.getPlayer(), line, "internlog");
                        }
                    }
                } else {
                    sendDisplayMessage(c, "??????????????????????????????????????????.", type);
                }
                return true;
            }
        }
        return false;
    }

    private static void logCommandToDB(MapleCharacter player, String command, String table) {
        try (DruidPooledConnection con = DatabaseConnection.getInstance().getConnection()) {
            try (PreparedStatement ps = con.prepareStatement("INSERT INTO " + table + " (cid, name, command, mapid) VALUES (?, ?, ?, ?)")) {
                ps.setInt(1, player.getId());
                ps.setString(2, player.getName());
                ps.setString(3, command);
                ps.setInt(4, player.getMap().getId());
                ps.executeUpdate();
            }
        } catch (SQLException ex) {
            log.error(ex);
        }
    }
}
