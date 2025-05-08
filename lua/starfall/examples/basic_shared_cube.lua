--@name Basic Shared Cube
--@author Vurv
--@shared

if SERVER then
	local mainBox = prop.create(
		chip():localToWorld(Vector(0, 0, 20)),
		chip():getAngles(),
		"models/hunter/blocks/cube075x075x075.mdl",
		false
	)

	-- This runs whenever a client joins the same, or is being loaded when the chip is created.
	hook.add("ClientInitialized", "", function(ply)
		net.start("sendBox")
		net.writeEntity(mainBox)
		net.send(ply)
	end)
elseif CLIENT then
	-- A render target is a canvas to render to that is saved.
	local boxRenderTarget = "boxRT"
	render.createRenderTarget(boxRenderTarget)

	-- We can create a material, which allows us to use render targets as textures for props.
	local boxMaterial = material.create("VertexLitGeneric")
	boxMaterial:setTextureRenderTarget("$basetexture", boxRenderTarget)

	local function main(mainBox)
		-- This is how to set a prop's material to a Material class.
		-- It's done this way so it can be done serverside as well.
		mainBox:setMaterial("!" .. boxMaterial:getName())

		-- RTs are 1024x1024
		local maxX, maxY = 1024, 1024
		local maxDistance = 1000 ^ 2
		local msBetweenUpdate = 50

		-- We do the work to get the color outside of the render hook, to avoid using too much CPU.
		local distanceColor = Color(255, 0, 0)

		timer.create("calculations", msBetweenUpdate / 1000, 0, function()
			local distanceToPlayer = player():getPos():getDistanceSqr(mainBox:getPos())
			local distanceRatio = math.min(distanceToPlayer, maxDistance) / maxDistance

			distanceColor = Color(distanceRatio * 360, 1, 1):hsvToRGB()
		end)

		-- We render off screen because we aren't actually using a NSF screen.
		hook.add("renderOffscreen", "", function()
			-- Since we only ever use one RT, we could do this a single time to avoid this call, too.
			render.selectRenderTarget(boxRenderTarget)

			render.setColor(distanceColor)
			render.drawRectFast(0, 0, maxX, maxY)
		end)
	end

    -- Receive the box from the server
	net.receive("sendBox", function(_len)
		local mainBox = net.readEntity()
		main(mainBox)
	end)
end
