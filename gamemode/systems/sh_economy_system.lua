--[[
    City Underground - Shared Economy System
    Defines economic rules, wage rates, and transaction categories.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Economy = CityUnderground.Economy or {}

CityUnderground.Economy.TransactionTypes = {
    DEPOSIT = "DEPOSIT",
    WITHDRAW = "WITHDRAW",
    TRANSFER = "TRANSFER",
    SALARY = "SALARY",
    PURCHASE = "PURCHASE",
    SALE = "SALE",
    CITATON = "CITATION",
    RENT = "RENT"
}

CityUnderground.Economy.WireTransferFeePercent = 0.02 -- 2% bank wire fee
CityUnderground.Economy.MaxProximityTransferDistance = 250 -- Distance units for cash handing
