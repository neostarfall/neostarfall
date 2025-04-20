<div align="center">
    <a href="https://github.com/neostarfall/neostarfall">
        <img src="./branding/neostarfall-round_512x512.png" width="256" height="256" />
    </a>
    <h1>neostarfall</h1>
    <p>Starfall, by and for Starfall users</p>
    <div align="center">
        <a href="https://discord.gg/aSXXa4urpm">
            <img src="https://img.shields.io/discord/1350996201713045594?label=Discord&logo=discord&logoColor=ffffff&labelColor=7289DA&color=494e54" alt="Discord">
        </a>
        <a href="https://neostarfall.pages.dev">
            <img alt="Website" src="https://img.shields.io/website?url=https%3A%2F%2Fneostarfall.pages.dev&up_message=Up&label=Docs">
        </a>
        <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=3454707364">
            <img alt="Steam Subscriptions" src="https://img.shields.io/steam/subscriptions/3454707364?logo=steam&label=Subscriptions">
        </a>
    </div>
</div>

## Installation

- Run `git clone --recursive https://github.com/neostarfall/neostarfall` inside of `steamapps/common/Garrysmod/garrysmod/addons`

- [Subscribe to the workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=3454707364)

## Resources

The DLLs previously here were removed because:
1. It's not a good idea to have binaries in source repos
2. Usually the repos have their own output binaries in releases.
3. Don't apply to linux and mac users.

Here's releases for those modules:
- [`socket`](https://neostarfall.pages.dev/#libraries.socket) -> https://github.com/danielga/gmod_luasocket/releases/latest
- [`xinput`](https://neostarfall.pages.dev/#libraries.xinput) -> https://github.com/mitterdoo/garrysmod-xinput/releases/latest
- [`joystick`](https://neostarfall.pages.dev/#libraries.joystick) -> [you have to compile it on your own, but it's a simple batchfile.](https://github.com/MattJeanes/Joystick-Module)

The rest of the modules:
- [`vr`](https://neostarfall.pages.dev/#libraries.vr) -> [installer here](https://github.com/catsethecat/vrmod-module/releases/tag/v21)
- `...` -> (PR these!)