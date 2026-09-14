MUNCHIES DELIVERY - STANDALONE

No ESX, QBCore, ox_lib, ox_target, or external inventory required.

INSTALL:
1. Put munchies_standalone in your resources folder.
2. Add: ensure munchies_standalone
3. Optional admin permission: add_ace group.admin munchies.admin allow

COMMANDS:
/munchies - open shop
/munchiesbag - open food bag
/munchiesbalance - see Munchies balance
/munchiesgivecash [id] [amount] - admin/console cash grant

The script spawns the GTA taco model, a vendor ped, and lets players press E to order.
It has its own saved cash balance and food inventory in data/players.json.
Edit config.lua to change location, models, prices, items, and health restoration.

If your server streams a custom taco.ytd/taco+hi.ytd, this spawned Taco Van will use that streamed livery.
