import provider.*;
import server.StructAndroid;

import java.io.File;

public class Test {
    public static void main(String[] args) {
//        MapleDataProvider etcData = MapleDataProviderFactory.getDataProvider( new File("D:\\workspace\\maplestory\\wz\\Character.wz"));
//        MapleDataDirectoryEntry e = (MapleDataDirectoryEntry) etcData.getRoot().getEntry("Android");
//        for (MapleDataEntry d : e.getFiles()) {
//            MapleData iz = etcData.getData("Android/" + d.getName());
//            StructAndroid android = new StructAndroid();
//            int type = Integer.parseInt(d.getName().substring(0, 4));
//            android.type = type;
//            android.gender = MapleDataTool.getIntConvert("info/gender", iz, 0);
//        }
        File a = new File("aasda");
        File b = new File(a,"b");
        File c = new File(b,"是的");
        System.out.println(b.getParentFile());
        System.out.println(c.getParentFile());
        System.out.println(c.getPath());
    }
}
