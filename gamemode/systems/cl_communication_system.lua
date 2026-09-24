--[[
    City Underground - Client Communication System
    Client-side chatbox receiver, formatting, and command parser.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.Chat = CityUnderground.Chat or {}

if net and net.Receive then
    net.Receive("CU_Chat_ReceiveMessage", function()
        local channel = net.ReadString()
        local sender = net.ReadString()
        local text = net.ReadString()

        if CityUnderground.UI and CityUnderground.UI.AddChatMessage then
            CityUnderground.UI.AddChatMessage(channel, sender, text)
        end
    end)
end

function CityUnderground.Chat.Send(text)
    if not text or text == "" then return end

    local channel = "LOCAL"
    local cleanText = text

    if text:sub(1, 4) == "/me " then
        channel = "ME"
        cleanText = text:sub(5)
    elseif text:sub(1, 4) == "/do " then
        channel = "DO"
        cleanText = text:sub(5)
    elseif text:sub(1, 5) == "/ooc " or text:sub(1, 3) == "// " then
        channel = "OOC"
        cleanText = text:sub(1, 3) == "// " and text:sub(4) or text:sub(6)
    elseif text:sub(1, 3) == "/w " then
        channel = "WHISPER"
        cleanText = text:sub(4)
    elseif text:sub(1, 3) == "/s " then
        channel = "SHOUT"
        cleanText = text:sub(4)
    elseif text == "/introduce" then
        if net and net.Start then
            net.Start("CU_Chat_Introduce")
            net.SendToServer()
        end
        return
    end

    if net and net.Start then
        net.Start("CU_Chat_SendMessage")
        net.WriteString(channel)
        net.WriteString(cleanText)
        net.SendToServer()
    end
end
