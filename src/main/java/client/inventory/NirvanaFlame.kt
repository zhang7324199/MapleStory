package client.inventory

import constants.ItemConstants
import tools.Randomizer
import java.util.*

data class NirvanaFlame(var nstr: Int = 0, var ndex: Int = 0, var nint: Int = 0, var nluk: Int = 0, var nhp: Int = 0, var nmp: Int = 0, var nwatk: Int = 0,
                        var nmatk: Int = 0, var nwdef: Int = 0, var nmdef: Int = 0, var nacc: Int = 0, var navoid: Int = 0, var nhands: Int = 0,
                        var nspeed: Int = 0, var njump: Int = 0, var nbossDamage: Int = 0, var nignorePDR: Int = 0, var ntotalDamage: Int = 0,
                        var nallStat: Int = 0) {

    constructor(n: NirvanaFlame) : this() {
        nstr = n.nstr
        ndex = n.ndex
        nint = n.nint
        nluk = n.nluk
        nhp = n.nhp
        nmp = n.nmp
        nwatk = n.nwatk
        nmatk = n.nmatk
        nwdef = n.nwdef
        nmdef = nmdef
        nacc = n.nacc
        navoid = n.navoid
        nhands = n.nhands
        nspeed = n.nspeed
        njump = n.njump
        nbossDamage = n.nbossDamage
        nignorePDR = n.nignorePDR
        ntotalDamage = n.ntotalDamage
        nallStat = n.nallStat
    }

    fun reset(): Unit {
        nstr = 0
        ndex = 0
        nint = 0
        nluk = 0
        nhp = 0
        nmp = 0
        nwatk = 0
        nmatk = 0
        nwdef = 0
        nmdef = 0
        nacc = 0
        navoid = 0
        nhands = 0
        nspeed = 0
        njump = 0
        nbossDamage = 0
        nignorePDR = 0
        ntotalDamage = 0
        nallStat = 0
    }

    companion object {
        fun getStats(equip: Equip, scrollid: Int): Map<EquipExFlag, Int> {
            val allstates = HashMap<EquipExFlag, Int>()
            val ret = HashMap<EquipExFlag, Int>()
//            val grade = ItemConstants.getNebuliteGrade(scrollid)
            val min: Int
            val max: Int
            when {
                equip.reqLevel < 30 -> {
                    min = 1
                    max = 1
                }
                equip.reqLevel < 90 -> {
                    min = 1
                    max = 2
                }
                equip.reqLevel < 140 -> {
                    min = 1
                    max = 3
                }
                equip.reqLevel < 150 -> {
                    min = 2
                    max = 4
                }
                else -> {
                    min = 3
                    max = 4
                }
            }
            var n1 = Math.max(1, equip.reqLevel / 10) + ItemConstants.UpgradeItemEx.getValue(scrollid)
            var n2 = Math.max(1, n1 / 2)
            if (n2 > n1) {
                val n3 = n1
                n1 = n2
                n2 = n3
            }
            val total = Randomizer.rand(min, max)
            allstates.put(EquipExFlag.??????, Math.min(65, Randomizer.rand(n2, n1) * 2))
            allstates.put(EquipExFlag.??????, Randomizer.rand(n2, n1) * total)
            allstates.put(EquipExFlag.??????, Math.min(65, Randomizer.rand(n2, n1) * 2))
            allstates.put(EquipExFlag.??????, Randomizer.rand(n2, n1) * 2)
            allstates.put(EquipExFlag.??????, Randomizer.rand(n2, n1) * 2)
            allstates.put(EquipExFlag.??????, Randomizer.rand(n2, n1) * 2)
            allstates.put(EquipExFlag.??????, Randomizer.rand(n2, n1) * 2)
            allstates.put(EquipExFlag.HP, Math.max(n2 * 10, Randomizer.nextInt(n1 + 10)) * total * max)
            allstates.put(EquipExFlag.MP, Math.max(n2, Randomizer.nextInt(n1)) * total * max)
            allstates.put(EquipExFlag.??????, Randomizer.rand(n2, n1) * total)
            allstates.put(EquipExFlag.??????, Randomizer.rand(n2, n1) * total)
            allstates.put(EquipExFlag.??????, Randomizer.rand(5, 10))
            allstates.put(EquipExFlag.??????, Randomizer.rand(5, 10))
            if (equip.reqLevel >= 100) {
                if (ItemConstants.isWeapon(equip.itemId)) {
                    allstates.put(EquipExFlag.????????????, Randomizer.rand(5, 20))
                    allstates.put(EquipExFlag.?????????, Randomizer.rand(n1 / 4, 15))
                    allstates.put(EquipExFlag.BOSS??????, Math.max(1, Randomizer.nextInt(4)))
                }
                allstates.put(EquipExFlag.?????????, Randomizer.rand(1, 4))
            }
            while (ret.size < total) {
                allstates.filter { it.value > 0 && Randomizer.nextInt(100) < 20 }.forEach {
                    if (ret.size < max && !ret.containsKey(it.key)) {
                        ret.put(it.key, it.value)
                    }
                }
            }
            return ret
        }

        fun randomState(equip: Equip, scrollid: Int): Unit {
            val newState = getStats(equip, scrollid)
            val fire = 0L
            equip.nirvanaFlame.reset()
            if (newState.containsKey(EquipExFlag.??????)) {
                equip.nirvanaFlame.nwatk = newState[EquipExFlag.??????]!!
            }
            if (newState.containsKey(EquipExFlag.??????)) {
                equip.nirvanaFlame.nmatk = newState[EquipExFlag.??????]!!
            }
            if (newState.containsKey(EquipExFlag.??????)) {
                equip.nirvanaFlame.nstr = newState[EquipExFlag.??????]!!
            }
            if (newState.containsKey(EquipExFlag.??????)) {
                equip.nirvanaFlame.ndex = newState[EquipExFlag.??????]!!
            }
            if (newState.containsKey(EquipExFlag.??????)) {
                equip.nirvanaFlame.nint = newState[EquipExFlag.??????]!!
            }
            if (newState.containsKey(EquipExFlag.??????)) {
                equip.nirvanaFlame.nluk = newState[EquipExFlag.??????]!!
            }
            if (newState.containsKey(EquipExFlag.??????)) {
                equip.nirvanaFlame.nwdef = newState[EquipExFlag.??????]!!
            }
            if (newState.containsKey(EquipExFlag.??????)) {
                equip.nirvanaFlame.nmdef = newState[EquipExFlag.??????]!!
            }
            if (newState.containsKey(EquipExFlag.HP)) {
                equip.nirvanaFlame.nhp = newState[EquipExFlag.HP]!!
            }
            if (newState.containsKey(EquipExFlag.MP)) {
                equip.nirvanaFlame.nmp = newState[EquipExFlag.MP]!!
            }
            if (newState.containsKey(EquipExFlag.??????)) {
                equip.nirvanaFlame.nacc = newState[EquipExFlag.??????]!!
            }
            if (newState.containsKey(EquipExFlag.??????)) {
                equip.nirvanaFlame.navoid = newState[EquipExFlag.??????]!!
            }
            if (newState.containsKey(EquipExFlag.??????)) {
                equip.nirvanaFlame.njump = newState[EquipExFlag.??????]!!
            }
            if (newState.containsKey(EquipExFlag.??????)) {
                equip.nirvanaFlame.nspeed = newState[EquipExFlag.??????]!!
            }
            if (newState.containsKey(EquipExFlag.????????????)) {
                equip.nirvanaFlame.nignorePDR = newState[EquipExFlag.????????????]!!
            }
            if (newState.containsKey(EquipExFlag.?????????)) {
                equip.nirvanaFlame.ntotalDamage = newState[EquipExFlag.?????????]!!
            }
            if (newState.containsKey(EquipExFlag.?????????)) {
                equip.nirvanaFlame.nallStat = newState[EquipExFlag.?????????]!!
            }
            if (newState.containsKey(EquipExFlag.BOSS??????)) {
                equip.nirvanaFlame.nbossDamage = newState[EquipExFlag.BOSS??????]!!
            }
            newState.keys.forEach { fire.or(it.value) }
            equip.fire = fire
        }
    }
}


enum class EquipExFlag(val value: Long) {
    ?????????(0x01),
    ?????????(0x02),
    ??????(0x04),
    ??????(0x08),
    ??????(0x10),
    ??????(0x20),
    HP(0x40),
    MP(0x80),
    ??????(0x100),
    ??????(0x200),
    ??????(0x400),
    ??????(0x800),
    ??????(0x1000),
    ??????(0x2000),
    ??????(0x4000),
    ??????(0x8000),
    ??????(0x10000),
    BOSS??????(0x20000),
    ????????????(0x40000)
}