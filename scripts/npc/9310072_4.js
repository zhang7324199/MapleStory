﻿/*
 * 菜菜制作 奇幻冒险岛工作室所有
 * 联系QQ：537050710
 * 欢迎定制各种脚本
 * OX问答副本  奖励NPC
 */

var status = 0;


function start() {
    cm.getNpcNotice(1540104, "[欢迎来到OX问答活动！]\r\n大家好，欢迎来到这里！\r\n#b让我们先等候3分钟来欢迎后面到来的冒险家吧！#k\r\n在这我们将回答二十道问答题，它们涉及到很多方面，但问题只有两种答案，#b#eO正确，X错误#n#k。\r\n题目出现的时，选择正确答案，站在正确的位置吧！\r\n#e（站在中间的位置不算，将会被视为错误答案）\r\n#n#r 在前5道题目答错不受到影响，但是在后面错的话，会被请出该地图不再作答。", 180);//显示180秒的活动介绍
    cm.dispose();
}