# The Pissmole Camper Control System

PCCS is a software and hardware solution for control of electrics and home automation in a caravan or camper trailer. It replaces a typical switch panel and gauges like water and battery levels with a modern touchscreen UI that provides control of dimmable lighting, one-touch activation of lighting scenes and automatic triggering of lights based on sunset/sunrise times and door or panel open and closes. The software runs on a Raspberry Pi 4 or 5. A PCB design for ordering the PCCS Core circuit board and 3D printable mount is provided in the `/kicad` folder.

Important information is displayed at a glance (full list and screenshots below). Internet can be distributed from a USB/Wi-Fi hotspot or Starlink through a downstream WAP. Networking services - NAT, DNS, DHCP and ad-filtering are provided by nftables and Pi-Hole. Instructions are provided for installing the UniFi OS server for management of WAP points if desired.

The UI is accessible from any device connected to the WiFi and can also be accessed remotely via something like a Cloudflare tunnel.

## Getting started

Start with [Wiring and Hardware](https://github.com/muntedpissmole/pccs5/wiki/Wiring-and-Hardware) to fabricate, mount and wire the PCCS Core PCB, then see [Software Installation](https://github.com/muntedpissmole/pccs5/wiki/Software-Installation) to install the PCCS via the guided installer.

Full instructions are in the [project wiki](https://github.com/muntedpissmole/pccs5/wiki/).

## System overview

A touchscreen in the kitchen or similar area shows the main user interface and is also reachable from phones or tablets on the LAN:

- Dimmable lighting sliders with red/white anti-bug mode and on/off buttons for non-dimmable loads (water, lighting, fridge circuits)
- Ambient lights that fade on as it gets dark
- One-touch lighting scenes
- Control of Sonos speakers
- Light/dark UI themes and an extensive settings page

## Display of Environmental information

- Water tank level
- Current temperature and fridge/freezer temperatures
- Current battery charge, voltage, current consumption, estimated power remaining and current/daily solar generation
- GPS coordinates, closest suburb, altitude, satellite quality, sunrise/sunset, and the day/evening/night timing that drives automation
- 4 Day weather forecast, humidity and expected overnight temperature if Internet is present
- Internet connection quality details
- What lights are on and what doors or panels are open
- Health status of connected hardware modules like solar or GPS

## Hardware architecture

- Raspberry Pi 4/5
- Dual ESP32-S3s for 16 channels of PWM dimming via MOSFETs
- u-blox NEO-M9N GPS for location data
- Victron SmartShunt and SmartSolar support for battery and solar monitoring
- WS281X addressable LED strip outputs
- 10A relays for non-dimmable loads like lighting circuits, floodlights and water pumps
- Reed switch inputs for door/panel sensing and triggering of lights
- 1-Wire bus for temperature sensors
- Water tank level sensor input
- Spare channels for everything for expansion

### PCCS Core

<table>
  <tr>
    <td align="center" width="50%"><img src="images/pccs_core_top.png" alt="PCCS Core — top, bare board"></td>
    <td align="center" width="50%"><img src="images/pccs_core_top_with_pi.png" alt="PCCS Core — top, with Raspberry Pi fitted"></td>
  </tr>
  <tr>
    <td align="center"><strong>Top (bare board)</strong></td>
    <td align="center"><strong>Top (with Raspberry Pi fitted)</strong></td>
  </tr>
  <tr>
    <td align="center"><img src="images/pccs_core_bottom.png" alt="PCCS Core — bottom"></td>
    <td align="center"><img src="images/pccs_core_isometric.png" alt="PCCS Core — isometric view with Raspberry Pi fitted"></td>
  </tr>
  <tr>
    <td align="center"><strong>Bottom</strong></td>
    <td align="center"><strong>Isometric (with Raspberry Pi fitted)</strong></td>
  </tr>
</table>

## User interface

The UI runs on touchscreens, tablets, and phones.

<table>
  <tr>
    <td align="center"><img src="images/ipad_neumorphism_dark_home_landscape.png" alt="Neumorphism dark — iPad landscape"></td>
  </tr>
  <tr>
    <td align="center"><strong>Neumorphism (Dark)</strong></td>
  </tr>
  <tr>
    <td align="center"><img src="images/ipad_neumorphism_light_home_landscape.png" alt="Neumorphism light — iPad landscape"></td>
  </tr>
  <tr>
    <td align="center"><strong>Neumorphism (Light)</strong></td>
  </tr>
  <tr>
    <td align="center"><img src="images/ipad_glassmorphism_dark_home_landscape.png" alt="Glassmorphism dark — iPad landscape"></td>
  </tr>
  <tr>
    <td align="center"><strong>Glassmorphism (Dark)</strong></td>
  </tr>
  <tr>
    <td align="center"><img src="images/ipad_glassmorphism_dark_lighting_landscape.png" alt="Glassmorphism dark — iPad lighting"></td>
  </tr>
  <tr>
    <td align="center"><strong>Glassmorphism (Dark) — Lighting</strong></td>
  </tr>
</table>

<table>
  <tr>
    <td align="center" width="50%"><img src="images/iphone_neumorphism_dark_home_portrait.png" alt="Neumorphism dark — iPhone portrait" height="407"></td>
    <td align="center" width="50%"><img src="images/iphone_neumorphism_dark_home_landscape.png" alt="Neumorphism dark — iPhone landscape"></td>
  </tr>
  <tr>
    <td align="center"><strong>Neumorphism (Dark) — iPhone Portrait</strong></td>
    <td align="center"><strong>Neumorphism (Dark) — iPhone Landscape</strong></td>
  </tr>
</table>

<details>
<summary><h3>Additional themes (click to expand)</h3></summary>

<table>
  <tr>
    <td align="center" width="50%"><img src="images/themes/claymorphism.png" alt="Claymorphism" title="Claymorphism"></td>
    <td align="center" width="50%"><img src="images/themes/cyberpunk.png" alt="Cyberpunk" title="Cyberpunk"></td>
  </tr>
  <tr>
    <td align="center"><strong>Claymorphism</strong><br></td>
    <td align="center"><strong>Cyberpunk</strong><br></td>
  </tr>
  <tr>
    <td align="center"><img src="images/themes/ember.png" alt="Ember" title="Ember"></td>
    <td align="center"><img src="images/themes/industrial.png" alt="Industrial" title="Industrial"></td>
  </tr>
  <tr>
    <td align="center"><strong>Ember</strong><br></td>
    <td align="center"><strong>Industrial</strong><br></td>
  </tr>
  <tr>
    <td align="center"><img src="images/themes/nebula.png" alt="Nebula" title="Nebula"></td>
    <td align="center"><img src="images/themes/oled_minimal.png" alt="OLED Minimal" title="OLED Minimal"></td>
  </tr>
  <tr>
    <td align="center"><strong>Nebula</strong><br></td>
    <td align="center"><strong>OLED Minimal</strong><br></td>
  </tr>
  <tr>
    <td align="center"><img src="images/themes/obsidian.png" alt="Obsidian" title="Obsidian"></td>
    <td align="center"><img src="images/themes/terminal.png" alt="Terminal" title="Terminal"></td>
  </tr>
  <tr>
    <td align="center"><strong>Obsidian</strong><br></td>
    <td align="center"><strong>Terminal</strong><br></td>
  </tr>
  <tr>
    <td align="center" colspan="2"><img src="images/themes/void.png" alt="Void" title="Void"></td>
  </tr>
  <tr>
    <td align="center" colspan="2"><strong>Void</strong><br></td>
  </tr>
</table>

More examples in the [`/images`](images/) folder.

</details>

---

## Documentation

Wiring, installation, configuration, and optional packages are on the **[project wiki](https://github.com/muntedpissmole/pccs5/wiki)**.

| Topic | Wiki page |
|-------|-----------|
| PCCS4 vs PCCS5 | [Differences between PCCS4 and PCCS5](https://github.com/muntedpissmole/pccs5/wiki/Differences-between-PCCS4-and-PCCS5) |
| Wiring and hardware | [Wiring and Hardware](https://github.com/muntedpissmole/pccs5/wiki/Wiring-and-Hardware) |
| Software Installation | [Software Installation](https://github.com/muntedpissmole/pccs5/wiki/Software-Installation) |
| Software Configuration | [Software Configuration](https://github.com/muntedpissmole/pccs5/wiki/Software-Configuration) |
| Victron setup | [Victron Setup](https://github.com/muntedpissmole/pccs5/wiki/Victron-Setup) |
| Toast system | [Toast System](https://github.com/muntedpissmole/pccs5/wiki/Toast-System) |
| UniFi OS Server | [UniFi OS Server](https://github.com/muntedpissmole/pccs5/wiki/UniFi-OS-Server) |
| Pi-hole | [Pi-hole](https://github.com/muntedpissmole/pccs5/wiki/Pi-hole) |

---

## License

Licensed under the [MIT License](LICENSE).
