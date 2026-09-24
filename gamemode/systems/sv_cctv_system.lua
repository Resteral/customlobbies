--[[
    City Underground - Server CCTV Surveillance Network & Motion Detector Engine
    Manages camera installations, live camera streaming to terminals, motion tripwire alerts, and damage.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.CCTV = CityUnderground.CCTV or {}
CityUnderground.CCTV.InstalledCameras = CityUnderground.CCTV.InstalledCameras or {}

-- Network String Registration
if SERVER then
    util.AddNetworkString("CU_CCTV_InstallCamera")
    util.AddNetworkString("CU_CCTV_RemoveCamera")
    util.AddNetworkString("CU_CCTV_ViewFeed")
    util.AddNetworkString("CU_CCTV_MotionAlert")
    util.AddNetworkString("CU_CCTV_IntercomBroadcast")
end

-- Server Camera Placement Handler
net.Receive("CU_CCTV_InstallCamera", function(len, ply)
    local propId = net.ReadString()
    local camType = net.ReadString()
    local pos = net.ReadVector()
    local ang = net.ReadAngle()
    local label = net.ReadString()

    -- Check property deed ownership
    if not CityUnderground.Property.IsOwner(ply, propId) then
        CityUnderground.Notify(ply, "You do not own this property to install surveillance cameras!", "error")
        return
    end

    local camDef = CityUnderground.CCTV.CameraTypes[camType] or CityUnderground.CCTV.CameraTypes["dome_ptz_1080p"]
    
    local camObj = {
        id = "cam_" .. propId .. "_" .. os.time(),
        propId = propId,
        ownerSteamID = ply:SteamID(),
        type = camType,
        pos = pos,
        ang = ang,
        label = label or camDef.name,
        health = camDef.health,
        status = "ONLINE"
    }

    CityUnderground.CCTV.InstalledCameras[propId] = CityUnderground.CCTV.InstalledCameras[propId] or {}
    table.insert(CityUnderground.CCTV.InstalledCameras[propId], camObj)

    CityUnderground.Notify(ply, "Surveillance Camera '" .. camObj.label .. "' mounted and online!", "success")
end)

-- Motion Detection Tick Loop
hook.Add("Think", "CU_CCTV_MotionDetectionLoop", function()
    -- Scan for un-authorized intruders near cameras
    for propId, cams in pairs(CityUnderground.CCTV.InstalledCameras) do
        for _, cam in ipairs(cams) do
            if cam.status == "ONLINE" then
                -- Check nearby players
                local nearby = player.GetAll()
                for _, target in ipairs(nearby) do
                    if target:Alive() and target:SteamID() ~= cam.ownerSteamID then
                        local dist = target:GetPos():Distance(cam.pos or Vector(0,0,0))
                        if dist < 300 then
                            -- Trigger motion alert to property owner
                            local owner = player.GetBySteamID(cam.ownerSteamID)
                            if IsValid(owner) then
                                net.Start("CU_CCTV_MotionAlert")
                                net.WriteString(propId)
                                net.WriteString(cam.label)
                                net.WriteString(target:Nick())
                                net.Send(owner)
                            end
                        end
                    end
                end
            end
        end
    end
end)
