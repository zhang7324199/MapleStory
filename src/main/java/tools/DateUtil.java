package tools;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

/**
 * Provides a suite of tools for manipulating Korean Timestamps.
 *
 * @author Frz
 * @version 1.0
 * @since Revision 746
 */
public class DateUtil {

    private final static int ITEM_YEAR2000 = -1085019342;
    private final static long REAL_YEAR2000 = 946681229830L;
    private final static int QUEST_UNIXAGE = 27111908;
    private final static long FT_UT_OFFSET = 116444520000000000L; // 100 nsseconds from 1/1/1601 -> 1/1/1970

    /**
     * Converts a Unix Timestamp into File Time
     *
     * @param realTimestamp The actual timestamp in milliseconds.
     * @return A 64-bit long giving a filetime timestamp
     */
    public static long getTempBanTimestamp(long realTimestamp) {
        // long time = (realTimestamp / 1000); //seconds
        return ((realTimestamp * 10000) + FT_UT_OFFSET);
    }

    /**
     * Gets a timestamp for item expiration.
     *
     * @param realTimestamp The actual timestamp in milliseconds.
     * @return The Korean timestamp for the real timestamp.
     */
    public static int getItemTimestamp(long realTimestamp) {
        int time = (int) ((realTimestamp - REAL_YEAR2000) / 1000 / 60); // convert to minutes
        return (int) (time * 35.762787) + ITEM_YEAR2000;
    }

    /**
     * Gets a timestamp for quest repetition.
     *
     * @param realTimestamp The actual timestamp in milliseconds.
     * @return The Korean timestamp for the real timestamp.
     */
    public static int getQuestTimestamp(long realTimestamp) {
        int time = (int) (realTimestamp / 1000 / 60); // convert to minutes
        return (int) (time * 0.1396987) + QUEST_UNIXAGE;
    }

    public static boolean isDST() {
        return TimeZone.getDefault().inDaylightTime(new Date());
    }

    /**
     * Converts a Unix Timestamp into File Time
     *
     * @param timeStampinMillis The actual timestamp in milliseconds.
     * @return A 64-bit long giving a filetime timestamp
     */
    public static long getFileTimestamp(long timeStampinMillis) {
        return getFileTimestamp(timeStampinMillis, false);
    }

    public static long getFileTimestamp(long timeStampinMillis, boolean roundToMinutes) {
        if (isDST()) {
            timeStampinMillis -= 3600000L; //60 * 60 * 1000
        }
        timeStampinMillis += 14 * 60 * 60 * 1000;
        long time;
        if (roundToMinutes) {
            time = (timeStampinMillis / 1000 / 60) * 600000000;
        } else {
            time = timeStampinMillis * 10000;
        }
        return time + FT_UT_OFFSET;
    }

    public static int getTime() {
        String time = new SimpleDateFormat("yyyy-MM-dd-HH").format(new Date()).replace("-", "");
        return Integer.valueOf(time);
    }

    public static int getTime(long realTimestamp) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyMMddHHmm");
        return Integer.valueOf(sdf.format(realTimestamp));
    }

    public static long getKoreanTimestamp(long realTimestamp) {
        return realTimestamp * 10000 + 116444592000000000L;
    }

    public static String getNowTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy???MM???dd???HH???mm???ss???");
        return sdf.format(new Date());
    }

    /**
     * ?????????????????? HH:mm:ss.fff
     *
     * @return
     */
    public static int getSpecialNowiTime() {
        return (int) (System.currentTimeMillis() % 100000000);
    }
    /*
     * --------------------------------------------------------------------------------------------
     * ??????????????? 
     * --------------------------------------------------------------------------------------------
     */

    /**
     * ????????????????????????????????????yyyy-MM-dd
     *
     * @return
     */
    public static String getCurrentDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(new Date());
    }

    /**
     * ?????????????????????,?????????????????????
     * y ??? M ??? d ??? H ??? m ??? s ???
     *
     * @param dateFormat ???????????????????????????
     * @return
     */
    public static String getCurrentDate(String dateFormat) {
        SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
        return sdf.format(new Date());
    }

    /**
     * ????????????????????????????????????yyyy-MM-dd
     *
     * @param date
     * @return
     */
    public static String getFormatDate(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(date);
    }

    /**
     * ?????????????????????????????????????????????
     *
     * @param date
     * @param dateFormat
     * @return
     */
    public static String getFormatDate(Date date, String dateFormat) {
        SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
        return sdf.format(date);
    }

    /**
     * ?????????????????????????????????????????????amount????????? ???????????????????????? ????????? ????????????????????????
     * ??????????????????yyyy-MM-dd
     *
     * @param field  ????????????
     *               y ??? M ??? d ??? H ??? m ??? s ???
     * @param amount ??????
     * @return ????????????
     */
    public static String getPreDate(String field, int amount) {
        return getPreDate(new Date(), field, amount);
    }

    /**
     * ?????????????????????????????????
     *
     * @param d,???????????????
     * @param field   ????????????
     *                y ??? M ??? d ??? H ??? m ??? s ???
     * @param amount  ??????
     * @return ????????????
     */
    public static String getPreDate(Date d, String field, int amount) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(d);
        if (field != null && !field.equals("")) {
            switch (field) {
                case "y":
                    calendar.add(Calendar.YEAR, amount);
                    break;
                case "M":
                    calendar.add(Calendar.MONTH, amount);
                    break;
                case "d":
                    calendar.add(Calendar.DAY_OF_MONTH, amount);
                    break;
                case "H":
                    calendar.add(Calendar.HOUR, amount);
                    break;
            }
        } else {
            return null;
        }
        return getFormatDate(calendar.getTime());
    }

    /**
     * ?????????????????????????????????
     *
     * @param date
     * @return
     * @throws ParseException
     */
    public static String getPreDate(String date) throws ParseException {
        Date d = new SimpleDateFormat().parse(date);
        String preD = getPreDate(d, "d", 1);
        Date preDate = new SimpleDateFormat().parse(preD);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(preDate);
    }

    /**
     * ??????????????????????????? long
     * ?????? ????????????????????????????????? 12??? yyyyMMddhhmm
     *
     * @param dateString
     * @return
     */
    public static long getStringToTime(String dateString) {
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddhhmm");
        try {
            Date date = df.parse(dateString);
            return date.getTime();
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
        return -1;
    }

    public static long getStringToTime(String dateString, String format) {
        SimpleDateFormat df = new SimpleDateFormat(format);
        try {
            Date date = df.parse(dateString);
            return date.getTime();
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
        return -1;
    }

    /**
     * ??????????????????????????????0???0???0?????????
     *
     * @param day
     * @return
     */
    public static long getNextDayTime(int day) {
        Calendar date = Calendar.getInstance();
        date.set(date.get(Calendar.YEAR), date.get(Calendar.MONTH), date.get(Calendar.DATE) + day, 0, 0, 0);
        return date.getTime().getTime();
    }

    /**
     * ??????????????????????????????0???0???0?????????????????????
     *
     * @param day
     * @return
     */
    public static long getNextDayDiff(int day) {
        Calendar date = Calendar.getInstance();
        date.set(date.get(Calendar.YEAR), date.get(Calendar.MONTH), date.get(Calendar.DATE) + day, 0, 0);
        return date.getTime().getTime() - System.currentTimeMillis();
    }

    public static String getDayInt(int day) {
        if (day == 1) {
            return "SUN";
        } else if (day == 2) {
            return "MON";
        } else if (day == 3) {
            return "TUE";
        } else if (day == 4) {
            return "WED";
        } else if (day == 5) {
            return "THU";
        } else if (day == 6) {
            return "FRI";
        } else if (day == 7) {
            return "SAT";
        }
        return null;
    }
}
