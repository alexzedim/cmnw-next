---
title: (EN) Items & Auctions
description: Manual of DMA.
updatedAt: 2020-12-01
---

# DIRECT MARKET ACCESS

Welcome! It seems like you are first time using this website, and don't understand how it works.
Don't worry, you are not the first one here, just follow this simple steps bellow and receive what you want.

Any command in DMA modules requires two arguments, **ITEM** and **REALM(S)**. No matter what are you using, Discord bot or the website.

First things first: **ITEM**. You could point it by item ID, name or short-name called ***ticker***.

 - **Item ID** this is the numbers that you probably saw at wowhead or TSM item tooltip. For example: `171276` for most common used flask in Shadowlands expansion.
 - **Item Name** is case-insensitive name of an item in any language that support WoW EU client, like *English* Spectral Flask of Power or *Deutsch* Spektralfläschchen der Macht. What language you want to use, it's for you to decide.
 - **Item Ticker** most of popular items have short-named versions, which are easier to remember and operate. Most them are obvious, like: `FLASK` or `FLASK.POWER`. But, since some people start to asking question about ticker, you could always find them via `GROUP ITEMS` command.
 
 > Item tickets and names are case-insensitive and doesn't require exact equality. But in some cases, the search results can give close, but not 100% relevant result.
 In that case, try to query search by ID (it's 100% precise) or ticker search.

As you may already understand **REALM** argument always represent realms. Their names are locale based, so if you are playing on French realm, look for a familiar francais realm name in dropdown menu.
Some commands, also support multiple realms as arguments.

# ITEM

 *Full intraday market data for the item, on the selected realm.* 

 Example query: [`>ITEM FLASK@GORDUNNI`](https://conglomerat.group/item/FLASK@gordunni)
 
 ___
 **Level 2 Listing** shows exactly the same picture of auction house listing at the very moment of last update. Standard view.
 
 ![Level2](https://i.imgur.com/MDgOBT3.png)
 ___
 **Cluster Chart** is an intraday aggregation for quantity on every price level. It's available only for commodity items. 
 Dates on X axis is based on your browser locale settings.
 
  ![COMMDTY Cluster Chart](https://i.imgur.com/x5V2mes.png)
 ___
  
 **Item Listing**, — if an item is not a commodity one, then instead of a cluster chart, you will saw listing for every order. 
 If you point mouse cursor on the item name, you will saw a wowhead tooltip which allows you to saw all the stats of an item, like bonus lists effects (lfr / normal / heroic / mythic), sockets and item level.
  
  ![ITEM Level 2 Listing](https://i.imgur.com/RuV1eVm.png)
 ___
 
 **Valuations** — evaluation table shows every available pricing method and it's valuation for selected item.
 By clicking on **>** will be opened an extra details frame, which shows additional data which depends on pricing method's type.
 
 - For MARKET type they are: minimum price, market quantity available, and open interest (market x quantity for each order)
 - PREMIUM: weight coefficient (wi) which shows, how much quantity of this item is currently represented as a reagent by this pricing method on the market.
 - DERIVATIVE: queue cost, and resulting quantity for crafting queue. Reagent items, it's quantity and value.
  
  > *We use smart evaluation method, which always shows us the cheapest way to the item from all available sources* 
  
  > For example: if it will be cheaper, to replace ingots by ore and melt it, the original reagent ingot will be replaced by this ore in 
  requested amount. So don't be scare, if you are checking inscription methods, and saw herbs or pigments, instead of an ink.
  It seems that it's cheaper to buy it and craft inks by yourself.

**If you saw an item without proper valuation of have an idea to propose, please contact Conglomerat via [this page](https://conglomerat.group/help/eu-contact-us).**

 ![Valuations](https://i.imgur.com/AXNmJzN.png)


# CROSS REALM (XRS)

*An ultimate tool to compare prices and quantity between different realms*

Example query: [`>XRS: NGHTSHD@GORDUNNI;HOWLING-FJORD;KAZZAK:DRAENOR;OUTLAND;RAVENCREST;SILVERMOON;TARREN-MILL;TWISTING-NETHER`](https://conglomerat.group/item/FLASK@gordunni;howling-fjord;outland;kazzak;draenor;silvermoon;tarren-mill;twisting-nether)
 ___
 **Cross Realm (XRS) constants** provides rates and decision-making information, necessary for evaluating realm's transfer future P/L and inventory capacity. 
  
  > Numbers are always scaled from current item stack size. If you are looking for item with stack size x200, it wil count all parameters for x200 stacking.
  If item is not stackable, then it will be x1 for every slot.
  
  ![XRS Rates](https://i.imgur.com/mkOSIFg.png)
 ___

 **Cluster Chart**
 
 In XRS mode, cluster chart X axis is replaced by realms instead of timestamps, and shows difference in quantity between them for the latest available timestamps.
 Everything else is still the same.
 
 ![Cluster Chart XRS](https://i.imgur.com/MrP7Y4w.png)

 ___
  **Valuations Scatter Plot**
  
  Allows you to compare various pricing methods, and it's value between realms. Showing is it profitable to craft items, does derivative price is backwards to current market or not.
  
  ![Valuations Scatter Plot](https://i.imgur.com/iq6vqBn.png)
 ___
