package server.shop;

import client.MapleClient;
import client.inventory.*;
import client.skills.SkillFactory;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import configs.ServerConfig;
import constants.GameConstants;
import constants.ItemConstants;
import constants.SkillConstants;
import server.AutobanManager;
import server.MapleInventoryManipulator;
import server.MapleItemInformationProvider;
import tools.DateUtil;
import tools.MaplePacketCreator;
import tools.Pair;
import tools.packet.InventoryPacket;
import tools.packet.NPCPacket;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MapleShop {

    private final int id;
    private final int npcId;
    private final List<MapleShopItem> items;
    private final List<Pair<Integer, String>> ranks = new ArrayList<>();
    private int shopItemId;

    /**
     * Creates a new instance of MapleShop
     */
    @JsonCreator
    public MapleShop(@JsonProperty("id") int id, @JsonProperty("npcId") int npcId) {
        this.id = id;
        this.npcId = npcId;
        this.shopItemId = 0;
        this.items = new ArrayList<>();
    }

    public void addItem(MapleShopItem item) {
        items.add(item);
    }

    public void removeItem(MapleShopItem item) {
        items.remove(item);
    }

    public List<MapleShopItem> getItems() {
        return items;
    }

    public List<MapleShopItem> getItems(MapleClient c) {
        List<MapleShopItem> itemsPlusRebuy = new ArrayList<>(items);
        itemsPlusRebuy.addAll(c.getPlayer().getRebuy());
        return itemsPlusRebuy;
    }

    public void sendShop(MapleClient c) {
        c.getPlayer().setShop(this);
        c.announce(NPCPacket.getNPCShop(getNpcId(), this, c));
    }

    public void sendShop(MapleClient c, int customNpc) {
        c.getPlayer().setShop(this);
        c.announce(NPCPacket.getNPCShop(customNpc, this, c));
    }

    public void sendItemShop(MapleClient c, int itemId) {
        this.shopItemId = itemId;
        c.getPlayer().setShop(this);
        c.announce(NPCPacket.getNPCShop(getNpcId(), this, c));
    }

    /*
     * ????????????
     */
    public void buy(MapleClient c, int itemId, short quantity, short position) {
        if (c.getPlayer() == null || c.getPlayer().getMap() == null) {
            return;
        }
        if (quantity <= 0) {
            AutobanManager.getInstance().addPoints(c, 1000, 0, "??????????????????: " + quantity + " ??????: " + itemId);
            return;
        }
        if (itemId / 10000 == 190 && !GameConstants.isMountItemAvailable(itemId, c.getPlayer().getJob())) {
            c.getPlayer().dropMessage(1, "??????????????????????????????");
            c.announce(NPCPacket.confirmShopTransaction(MapleShopResponse.??????????????????, this, c, -1));
            return;
        }
        MapleShopItem item = findBySlotAndId(itemId, position);
        if (c.getPlayer().getLevel() < item.getMinLevel()) {
            c.getPlayer().dropMessage(1, "Lv:" + item.getMinLevel() + "?????????????????????");
            c.announce(NPCPacket.confirmShopTransaction(MapleShopResponse.??????????????????, this, c, -1));
            return;
        }
        MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();
        MapleShopItem shopItem = findBySlotAndId(c, itemId, position);
        //System.err.println("??????????????????: " + position + " ????????????????????????: " + items.size());
        if (shopItem != null && position >= items.size()) {
            if (c.getPlayer().getRebuy().isEmpty()) {
                c.announce(MaplePacketCreator.enableActions());
                return;
            }
            int index = position - items.size();
            //System.err.println("??????????????????: " + index + " ????????????: " + quantity);
            if (shopItem.getRebuy() != null) {
                //System.err.println("??????????????????: " + shopItem.getBuyable());
                long price = shopItem.getPrice() * (ItemConstants.isRechargable(itemId) ? 1 : shopItem.getBuyable());
                if (price >= 0 && c.getPlayer().getMeso() >= price) {
                    if (MapleInventoryManipulator.checkSpace(c, itemId, quantity, "")) {
                        c.getPlayer().gainMeso(-price, false);
                        MapleInventoryManipulator.addbyItem(c, shopItem.getRebuy());
                        c.getPlayer().getRebuy().remove(index);
                        c.announce(NPCPacket.confirmShopTransaction(MapleShopResponse.??????????????????, this, c, index));
                    } else {
                        c.announce(NPCPacket.confirmShopTransaction(MapleShopResponse.??????????????????, this, c, -1)); //????????????????????????????????????????????????
                    }
                } else {
                    c.announce(NPCPacket.confirmShopTransaction(MapleShopResponse.??????????????????, this, c, -1));
                }
            } else {
                c.getPlayer().dropMessage(1, "?????????????????????????????????.");
                c.announce(NPCPacket.confirmShopTransaction(MapleShopResponse.??????????????????, this, c, -1));
            }
        } else if (shopItem != null && shopItem.getPrice() > 0 && shopItem.getReqItem() == 0) {
            if (shopItem.getCategory() >= 0) {
                boolean passed = true;
                int y = 0;
                for (Pair<Integer, String> i : getRanks()) {
                    if (c.getPlayer().haveItem(i.left, 1, true, true) && shopItem.getCategory() >= y) {
                        passed = true;
                        break;
                    }
                    y++;
                }
                if (!passed) {
                    c.getPlayer().dropMessage(1, "You need a higher rank.");
                    c.announce(MaplePacketCreator.enableActions());
                    return;
                }
            }
            long price = ItemConstants.isRechargable(itemId) ? shopItem.getPrice() : (shopItem.getPrice() * quantity);
            long meso = shopItem.getPointtype() == 0 ? c.getPlayer().getMeso() : c.getPlayer().getPQPoint();
            if (price >= 0 && meso >= price) {
                if (MapleInventoryManipulator.checkSpace(c, itemId, quantity, "")) {
                    if (shopItem.getPointtype() == 0) {
                        c.getPlayer().gainMeso(-price, false);
                    } else {
                        c.getPlayer().gainPQPoint(-price);
                    }
                    if (ItemConstants.isPet(itemId)) {
                        MapleInventoryManipulator.addById(c, itemId, quantity, "", MaplePet.createPet(itemId, MapleInventoryIdentifier.getInstance()), -1, "Bought from shop " + id + ", " + npcId + " on " + DateUtil.getCurrentDate());
                    } else {
                        if (!ItemConstants.isRechargable(itemId)) {
                            int state = shopItem.getState();
                            long period = shopItem.getPeriod();
                            MapleInventoryManipulator.addById(c, itemId, quantity, period, state, "???????????? " + id + ", " + npcId + " ?????? " + DateUtil.getCurrentDate());
                        } else {
                            quantity = ii.getSlotMax(shopItem.getItemId());
                            MapleInventoryManipulator.addById(c, itemId, quantity, "???????????? " + id + ", " + npcId + " ?????? " + DateUtil.getCurrentDate());
                        }
                    }
                    c.announce(NPCPacket.confirmShopTransaction(MapleShopResponse.??????????????????, this, c, -1));
                } else {
                    c.announce(NPCPacket.confirmShopTransaction(MapleShopResponse.??????????????????, this, c, -1));
                }
            }
        } else if (shopItem != null && shopItem.getReqItem() > 0 && shopItem.getReqItemQ() > 0 && c.getPlayer().haveItem(shopItem.getReqItem(), shopItem.getReqItemQ() * quantity, false, true)) {
            if (MapleInventoryManipulator.checkSpace(c, itemId, quantity, "")) {
                MapleInventoryManipulator.removeById(c, ItemConstants.getInventoryType(shopItem.getReqItem()), shopItem.getReqItem(), shopItem.getReqItemQ() * quantity, false, false);
                if (ItemConstants.isPet(itemId)) {
                    MapleInventoryManipulator.addById(c, itemId, quantity, "", MaplePet.createPet(itemId, MapleInventoryIdentifier.getInstance()), -1, "???????????? " + id + ", " + npcId + " ?????? " + DateUtil.getCurrentDate());
                } else {
                    if (!ItemConstants.isRechargable(itemId)) {
                        int state = shopItem.getState();
                        long period = shopItem.getPeriod();
                        MapleInventoryManipulator.addById(c, itemId, quantity, period, state, "???????????? " + id + ", " + npcId + " ?????? " + DateUtil.getCurrentDate());
                    } else {
                        quantity = ii.getSlotMax(shopItem.getItemId());
                        MapleInventoryManipulator.addById(c, itemId, quantity, "???????????? " + id + ", " + npcId + " ?????? " + DateUtil.getCurrentDate());
                    }
                }
                c.announce(NPCPacket.confirmShopTransaction(MapleShopResponse.??????????????????, this, c, -1));
            } else {
                c.announce(NPCPacket.confirmShopTransaction(MapleShopResponse.??????????????????, this, c, -1));
            }
        }
    }

    /*
     * ????????????
     */
    public void sell(MapleClient c, MapleInventoryType type, byte slot, short quantity) {
        if (quantity == 0xFFFF || quantity == 0) {
            quantity = 1;
        }
        Item item = c.getPlayer().getInventory(type).getItem(slot);
        if (item == null) {
            return;
        }
        if (ItemConstants.is????????????(item.getItemId()) || ItemConstants.is????????????(item.getItemId())) {
            quantity = item.getQuantity();
        }
        if (item.getItemId() == 4000463) {
            c.getPlayer().dropMessage(1, "?????????????????????.");
            c.announce(NPCPacket.confirmShopTransaction(MapleShopResponse.??????????????????, this, c, -1));
            return;
        }
        if (quantity < 0) {
            AutobanManager.getInstance().addPoints(c, 1000, 0, "???????????? " + quantity + " " + item.getItemId() + " (" + type.name() + "/" + slot + ")");
            return;
        }
        short iQuant = item.getQuantity(); //?????????????????????
        if (iQuant == 0xFFFF) {
            iQuant = 1;
        }
        MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();
        if (ii.cantSell(item.getItemId()) || ItemConstants.isPet(item.getItemId())) {
            return;
        }
        if (quantity <= iQuant && iQuant > 0) {
            double price;
            if (ItemConstants.is????????????(item.getItemId()) || ItemConstants.is????????????(item.getItemId())) {
                price = ii.getUnitPrice(item.getItemId()) / (double) ii.getSlotMax(item.getItemId());
            } else {
                price = ii.getPrice(item.getItemId());
            }
            long recvMesos = (long) Math.ceil(price * quantity);
            if (c.getPlayer().getMeso() + recvMesos > ServerConfig.CHANNEL_PLAYER_MAXMESO) {
                c.getPlayer().dropMessage(1, "????????????????????????" + ServerConfig.CHANNEL_PLAYER_MAXMESO + ".");
                c.announce(NPCPacket.confirmShopTransaction(MapleShopResponse.??????????????????, this, c, -1));
                return;
            }
//            if (item.getQuantity() == quantity) { //??????????????????????????????????????????
//                c.getPlayer().getRebuy().add(new MapleShopItem(item.copy(), (int) ii.getUnitPrice(item.getItem()), item.getQuantity())); //???????????????????????????
//            } else {
//                c.getPlayer().getRebuy().add(new MapleShopItem(item.copyWithQuantity(quantity), (int) ii.getUnitPrice(item.getItem()), quantity)); //?????????????????????????????????
//            }
            MapleInventoryManipulator.removeFromSlot(c, type, slot, quantity, false);
            if (price != -1.0 && recvMesos > 0) {
                c.getPlayer().gainMeso(recvMesos, false);
            }
            c.announce(NPCPacket.confirmShopTransaction(MapleShopResponse.??????????????????, this, c, -1)); //????????????
        }
    }

    /*
     * ?????????.??????????????????
     */
    public void recharge(MapleClient c, byte slot) {
        Item item = c.getPlayer().getInventory(MapleInventoryType.USE).getItem(slot);
        if (item == null || (!ItemConstants.is????????????(item.getItemId()) && !ItemConstants.is????????????(item.getItemId()))) {
            return;
        }
        MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();
        short slotMax = ii.getSlotMax(item.getItemId());
        int skill = SkillConstants.getMasterySkill(c.getPlayer().getJob());
        if (skill != 0) {
            slotMax += c.getPlayer().getTotalSkillLevel(SkillFactory.getSkill(skill)) * 10;
        }
        if (item.getQuantity() < slotMax) {
            int price = (int) Math.round(ii.getUnitPrice(item.getItemId()) * (slotMax - item.getQuantity()));
            if (c.getPlayer().getMeso() >= price) {
                item.setQuantity(slotMax);
                c.announce(InventoryPacket.modifyInventory(false, Collections.singletonList(new ModifyInventory(1, item)))); //?????????????????????????????????
                c.getPlayer().gainMeso(-price, false, false);
                c.announce(NPCPacket.confirmShopTransaction(MapleShopResponse.??????????????????, this, c, -1)); //????????????/??????
            } else {
                c.announce(NPCPacket.confirmShopTransaction(MapleShopResponse.??????????????????, this, c, -1)); //????????????
            }
        }
    }

    protected MapleShopItem findBySlotAndId(int itemId, int slot) {
        MapleShopItem shopItem = items.get(slot);
        if (shopItem != null && shopItem.getItemId() == itemId) {
            return shopItem;
        }
        return null;
    }

    protected MapleShopItem findBySlotAndId(MapleClient c, int itemId, int pos) {
        MapleShopItem shopItem = getItems(c).get(pos);
        //System.err.println("?????????????????? - ??????ID: " + shopItem.getItem() + " ????????????: " + (shopItem.getItem() == itemId));
        if (shopItem != null && shopItem.getItemId() == itemId) {
            return shopItem;
        }
        return null;
    }

    /*
     * ??????1???????????????
     */
//    public static MapleShop createFromDB(int id, boolean isShopId) {
//        MapleShop ret = null;
//        int shopId;
//        MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();
//        try {
//            Connection con = DatabaseConnection.getConnection();
//            PreparedStatement ps = con.prepareStatement(isShopId ? "SELECT * FROM shops WHERE shopid = ?" : "SELECT * FROM shops WHERE npcid = ?");
//            ps.setInt(1, id);
//            ResultSet rs = ps.executeQuery();
//            if (rs.next()) {
//                shopId = rs.getInt("shopid");
//                ret = new MapleShop(shopId, rs.getInt("npcid"));
//                rs.close();
//                ps.close();
//            } else {
//                rs.close();
//                ps.close();
//                return null;
//            }
//            ps = con.prepareStatement("SELECT * FROM shopitems WHERE shopid = ? ORDER BY position ASC");
//            ps.setInt(1, shopId);
//            rs = ps.executeQuery();
//            List<Integer> recharges = new ArrayList<>(rechargeableItems);
//            while (rs.next()) {
//                if (!ii.itemExists(rs.getInt("itemid")) || blockedItems.contains(rs.getInt("itemid"))) {
//                    continue;
//                }
//                if (ItemConstants.is????????????(rs.getInt("itemid")) || ItemConstants.is????????????(rs.getInt("itemid"))) {
//                    MapleShopItem starItem = new MapleShopItem((short) 1, rs.getInt("itemid"), rs.getInt("price"), rs.getInt("reqitem"), rs.getInt("reqitemq"), rs.getInt("period"), rs.getInt("state"), rs.getInt("category"), rs.getInt("minLevel"));
//                    ret.addItem(starItem);
//                    if (rechargeableItems.contains(starItem.getItem())) {
//                        recharges.remove(Integer.valueOf(starItem.getItem()));
//                    }
//                } else {
//                    ret.addItem(new MapleShopItem((short) 1000, rs.getInt("itemid"), rs.getInt("price"), rs.getInt("reqitem"), rs.getInt("reqitemq"), rs.getInt("period"), rs.getInt("state"), rs.getInt("category"), rs.getInt("minLevel")));
//                }
//            }
//            for (Integer recharge : recharges) {
//                ret.addItem(new MapleShopItem((short) 1, recharge, 0, 0, 0, 0, 0, 0, 0));
//            }
//            rs.close();
//            ps.close();
//
//            ps = con.prepareStatement("SELECT * FROM shopranks WHERE shopid = ? ORDER BY rank ASC");
//            ps.setInt(1, shopId);
//            rs = ps.executeQuery();
//            while (rs.next()) {
//                if (!ii.itemExists(rs.getInt("itemid"))) {
//                    continue;
//                }
//                ret.ranks.add(new Pair(rs.getInt("itemid"), rs.getString("name")));
//            }
//            rs.close();
//            ps.close();
//        } catch (SQLException e) {
//            System.err.println("Could not load shop");
//        }
//        return ret;
//    }

    public int getNpcId() {
        return npcId;
    }

    public int getId() {
        return id;
    }

    public int getShopItemId() {
        return shopItemId;
    }

    public List<Pair<Integer, String>> getRanks() {
        return ranks;
    }
}
