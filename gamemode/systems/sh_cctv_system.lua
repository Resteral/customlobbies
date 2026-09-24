--[[
    City Underground - Shared CCTV Security Surveillance System
    Defines camera models, camera installation specifications, pan/tilt limits, and motion detector ranges.
--]]

CityUnderground = CityUnderground or {}
CityUnderground.CCTV = CityUnderground.CCTV or {}
CityUnderground.CCTV.Cameras = CityUnderground.CCTV.Cameras or {}

-- CCTV Camera Archetypes
CityUnderground.CCTV.CameraTypes = {
    ["dome_ptz_1080p"] = {
        name = "Motorized 1080p Dome PTZ Camera",
        price = 450,
        model = "models/props/surveillance_dome.mdl",
        hasPanTilt = true,
        hasZoom = true,
        maxZoom = 3.5,
        hasNightVision = true,
        hasMotionSensor = true,
        motionDetectionRadius = 350,
        health = 250,
        desc = "Full 360-degree motorized pan-tilt-zoom dome camera with infrared night vision."
    },
    ["bullet_outdoor_ir"] = {
        name = "Bullet Weatherproof IR Security Camera",
        price = 320,
        model = "models/props/security_bullet_cam.mdl",
        hasPanTilt = false,
        hasZoom = false,
        hasNightVision = true,
        hasMotionSensor = true,
        motionDetectionRadius = 450,
        health = 350,
        desc = "Vandal-resistant outdoor security camera with 50-meter infrared illumination."
    },
    ["covert_pinhole_cam"] = {
        name = "Covert Pinhole Stash Camera",
        price = 550,
        model = "models/props/pinhole_sensor.mdl",
        hasPanTilt = false,
        hasZoom = false,
        hasNightVision = true,
        hasMotionSensor = true,
        motionDetectionRadius = 200,
        health = 100,
        desc = "Ultra-compact concealed pinhole lens mounted inside smoke detectors or clocks."
    }
}
