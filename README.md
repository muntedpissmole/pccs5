# The Pissmole Camper Control System

The PCCS is an automation and electrical control system for a caravan or camper trailer.

It runs on a Raspberry Pi fitted to a purpose-built PCB, the PCCS Core, which carries the dual ESP32s, GPS module, Victron Bluetooth link, and relays. See [Wiring and Hardware](https://github.com/muntedpissmole/pccs5/wiki/Wiring-and-Hardware) before you start.

## Quick start

```bash
sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/muntedpissmole/pccs5/main/install.sh)"
```

Runs on a Raspberry Pi 4/5 with Debian Trixie, fitted to the PCCS Core PCB. Full walkthrough, including flashing the SD card and finishing hardware setup: [Software Installation](https://github.com/muntedpissmole/pccs5/wiki/Software-Installation).

## System overview

A touchscreen in the kitchen or common area shows the main user interface, also reachable from phones or tablets on the LAN:

- Dimmable lighting sliders (with red/white anti-bug mode) and on/off buttons for non-dimmable loads (water, lighting, fridge circuits)
- One-tap lighting scenes, Sonos control, and toast notifications
- Light/dark UI themes, a diagnostics tab with manual overrides, and detailed logging

## Environmental information

- Water tank level; outside, fridge, and freezer temperatures
- Battery and solar: charge, voltage, current, estimated time remaining, daily solar yield (via Victron)
- Location: GPS coordinates, closest suburb, altitude, satellite quality, sunrise/sunset, and the day/evening/night timing that drives automation
- Weather forecast and humidity when online; internet connection details
- Sonos now-playing info; which lights are on; which doors or panels are open
- Health status of connected hardware modules (e.g. solar or GPS)

## Hardware architecture

- Raspberry Pi 4/5
- Dual ESP32-S3s for PWM dimming via MOSFETs
- u-blox NEO-M9N GPS for location data
- Victron SmartShunt and SmartSolar for battery and solar monitoring
- WS281X addressable LED strip outputs
- 10 A relays for non-dimmable loads
- Reed switch inputs for door/panel sensing
- 1-Wire bus for DS18B20 temperature sensors
- Resistive water tank level sensor input

---

## User interface

The UI runs on touchscreens, tablets, and phones. Red indicators mark bug-mode-capable lights.

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
