package provider;

/**
 * @author Matze
 */
public class MapleDataEntry implements MapleDataEntity {

    private final String name;
    private final int size;
    private final int checksum;
    private final MapleDataEntity parent;

    public MapleDataEntry(String name, int size, int checksum, MapleDataEntity parent) {
        super();
        this.name = name;
        this.size = size;
        this.checksum = checksum;
        this.parent = parent;
    }

    @Override
    public String getName() {
        return name;
    }

    public int getSize() {
        return size;
    }

    public int getChecksum() {
        return checksum;
    }


    @Override
    public MapleDataEntity getParent() {
        return parent;
    }
}
