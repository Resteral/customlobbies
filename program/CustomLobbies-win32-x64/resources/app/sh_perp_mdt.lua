-- PERP & FiveM Police MDT / CAD Dispatch Shared Definitions
local PLUGIN = PLUGIN

PLUGIN.MDT = PLUGIN.MDT or {}
PLUGIN.MDT.Calls = PLUGIN.MDT.Calls or {}
PLUGIN.MDT.Warrants = PLUGIN.MDT.Warrants or {}
PLUGIN.MDT.Arrests = PLUGIN.MDT.Arrests or {}

if SERVER then
    util.AddNetworkString("ixPerpOpenMDT")
    util.AddNetworkString("ixPerpSyncMDT")
    util.AddNetworkString("ixPerpCall911")
    util.AddNetworkString("ixPerpAddWarrant")
    util.AddNetworkString("ixPerpRemoveWarrant")
    util.AddNetworkString("ixPerpSearchPlayer")
    util.AddNetworkString("ixPerpToggleCuff")
    util.AddNetworkString("ixPerp911Broadcast")
end
