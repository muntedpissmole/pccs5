# Changelog

All notable changes to PCCS5 are documented in this file.

## [5.1.08082026] - 2026-08-08

### Added
- "Hardware offline" placeholder notice shown in the Lighting and Scenes grids when the ESP32 dimmer boards are disconnected
- Automatic hide/show of dashboard tiles based on connected-hardware status (`show-disconnected-tiles.js`, `home-module-visibility.js`)

### Changed
- Dashboard tile order reprioritized across all breakpoints so power and water lead, with settings/amenity tiles (appearance, Sonos) trailing
- GPS, Victron, PCCS Core, and System tiles updated to reflect degraded/offline hardware state

## [5.0.08082026] - 2026-08-08

### Added
- Initial release of the Pissmole Camper Control System (PCCS5)
