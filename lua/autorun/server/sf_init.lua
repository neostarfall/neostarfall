AddCSLuaFile("starfall/sflib.lua")
AddCSLuaFile("starfall/instance.lua")
AddCSLuaFile("starfall/preprocessor.lua")
AddCSLuaFile("starfall/toolscreen.lua")
AddCSLuaFile("starfall/permissions/core.lua")
AddCSLuaFile("starfall/transfer.lua")
AddCSLuaFile("starfall/editor/editor.lua")

-- resource.AddWorkshop("3412004213")
-- temporary workaround for us having no workshop addon currently
local resourceFiles = {
	["materials/radon/"] = {
		"arrow_left.png",
		"arrow_right.png",
		"starfall_tool_overlay.png",
		"starfall_tool_star.png",
		"starfall2.png",
		"starfall2.vmt",
	},
	["materials/bull/"] = {
		"dynamic_button_sf.vmt",
	},
	["materials/models/"] = {
		"spacecode/glass.vmt",
		"spacecode/sfchip.vmt",
		"spacecode/sfpcb.vmt",

		"starfall/holograms/holomaterial.vmt",
	},

	["models/bull/"] = {
		"dynamicbuttonsf.mdl",
	},
	["models/spacecode/"] = {
		"sfchip.mdl",
		"sfchip_medium.mdl",
		"sfchip_small.mdl",
	},
	["models/starfall/holograms/"] = {
		"box.mdl",
		"cylinder.mdl",
		"dome.mdl",
		"hollowcylinder.mdl",
		"hollowdome.mdl",
		"sphere.mdl",
		"torus.mdl",
		"wedge.mdl",
	},

	["resource/fonts/"] = {
		"DejaVuSansMono.ttf",
		"FontAwesome.ttf",
		"RobotoMono.ttf",
	},
}

for root, files in pairs(resourceFiles) do
	for _, file in ipairs(files) do
		resource.AddFile(root .. file)
	end
end

SF = {}
SF.Version = "Neostarfall"
local files, directories = file.Find("addons/*", "GAME")
local sf_dir = nil
for k, v in pairs(directories) do
	if file.Exists("addons/" .. v .. "/lua/starfall/sflib.lua", "GAME") then
		sf_dir = "addons/" .. v .. "/"
		break
	end
end
if sf_dir then
	local head = file.Read(sf_dir .. ".git/HEAD", "GAME") -- Where head points to
	if head then
		head = head:sub(6, -2) -- skipping ref: and new line
		local lastCommit = file.Read(sf_dir .. ".git/" .. head, "GAME")

		if lastCommit then
			SF.Version = SF.Version .. "_" .. lastCommit:sub(1, 7) -- We need only first 7 to be safely unique
		end
	end
end
SetGlobalString("SF.Version", SF.Version)

include("starfall/sflib.lua")
