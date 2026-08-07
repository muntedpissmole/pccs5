/**
 * PCCS5 Socket.IO client — central hub for server → tile handlers.
 */
(function () {
    'use strict';

    window.PCCS5 = window.PCCS5 || {};

    function initSocket() {
        if (typeof io === 'undefined') {
            window.PCCS5.offline?.show();
            return;
        }

        const socket = io({ transports: ['websocket', 'polling'] });
        window.PCCS5.socket = socket;

        window.PCCS5.offline?.hide();
        window.PCCS5.offline?.register(socket);

        socket.on('connect', () => {
            console.info('[PCCS5] socket connected');
            window.PCCS5.offline?.hide();
            socket.emit('get_reeds');
            socket.emit('get_reeds_diag');
            socket.emit('get_victron_state');
            socket.emit('get_network_status');
            socket.emit('sonos_request_state');
            window.PCCS5.water?.refresh?.();
            window.PCCS5.climate?.refreshSensors?.();
            window.powerTile?.refresh?.();
            window.systemTile?.refresh?.();
            window.sonosTile?.refresh?.();
            window.PCCS5.location?.refresh?.();
            window.PCCS5.gpsStatus?.refresh?.();
            window.PCCS5.screensSystem?.refresh?.();
            window.PCCS5.reedsSystem?.refresh?.();
            window.PCCS5.reedsHome?.refresh?.();
            window.PCCS5.lightingHome?.refresh?.();
            window.PCCS5.lighting?.syncFromServer?.();
            window.PCCS5.phases?.refresh?.();
            window.PCCS5.explain?.refresh?.();
            window.PCCS5.wifi?.refresh?.({ quiet: true });
            window.pccsCoreTile?.refresh?.();
            window.colorMode?.refresh?.();
            document.dispatchEvent(new CustomEvent('pccs5:socket-ready', { detail: { socket } }));
            window.colorMode?.registerSocket?.(socket);
            window.themeManager?.registerSocket?.(socket);
        });

        socket.on('disconnect', () => {
            console.warn('[PCCS5] socket disconnected');
        });

        // Lighting
        socket.on('lights_config', (config) => {
            window.PCCS5.lighting?.onLightsConfig(config);
            window.PCCS5.lightingHome?.onLightsConfig?.(config);
        });

        socket.on('state_update', (state) => {
            window.PCCS5.scenes?.onStateUpdate?.(state);
            window.PCCS5.lightingHome?.onStateUpdate?.(state);
            const rampMs = state._ramp_ms ?? window.PCCS5.lighting?.getSceneRampMs?.();
            const animate = !!state._animate;
            window.PCCS5.lighting?.onStateUpdate(state, { rampMs, animate });
            window.PCCS5.explain?.refresh?.();
        });

        socket.on('reed_update', (payload) => {
            window.PCCS5.lighting?.onReedUpdate(payload);
            window.PCCS5.lightingHome?.onReedUpdate?.(payload);
            window.PCCS5.reedsHome?.onReedUpdate(payload);
            window.PCCS5.lighting?.setReedActivating?.(true);
        });

        // Scenes (state_update handles slider ramp after set_scene)

        // Phases
        socket.on('phase_update', (data) => {
            window.PCCS5.phases?.onPhaseUpdate(data);
        });

        socket.on('phase_diag_update', (data) => {
            window.PCCS5.phases?.onPhaseDiagUpdate(data);
        });

        // Reeds (diag)
        socket.on('reeds_config', (config) => {
            const reeds = Array.isArray(config) ? config : config?.reeds;
            window.PCCS5.reedsSystem?.onReedsConfig(reeds);
            window.PCCS5.reedsHome?.onReedsConfig?.(reeds);
        });

        socket.on('reed_diag_update', (payload) => {
            window.PCCS5.reedsSystem?.onReedDiagUpdate(payload);
        });

        // GPS
        socket.on('gps_update', (data) => {
            window.PCCS5.gpsStatus?.onGpsUpdate(data);
            window.PCCS5.location?.onGpsUpdate(data);
        });

        // Sensors (water + temps)
        socket.on('sensor_update', (data) => {
            window.PCCS5.water?.onSensorUpdate(data);
            window.PCCS5.climate?.onSensorUpdate(data);
        });

        // Toasts
        socket.on('toast', (data) => {
            window.pccs5Toasts?.handleServer?.(data);
        });

        // Touchscreens
        socket.on('screens_init', (data) => {
            window.PCCS5.screensSystem?.onScreensInit?.(data);
        });

        socket.on('screens_update', (data) => {
            window.PCCS5.screensSystem?.onScreensUpdate?.(data);
        });

        // Dark mode (phase-driven + manual override)
        socket.on('global_dark_mode_update', (data) => {
            window.colorMode?.applyFromServer?.(data);
        });

        // Victron / power tile
        socket.on('victron_update', (data) => {
            window.powerTile?.onVictronUpdate?.(data);
            window.victronSystemTile?.onVictronUpdate?.(data);
        });

        // Network
        socket.on('network_update', (data) => {
            window.PCCS5.network?.update?.(data);
        });

        // Theme
        socket.on('global_theme_update', (data) => {
            window.themeManager?.applyFromServer?.(data);
        });

        // Sonos
        socket.on('sonos_update', (data) => {
            window.sonosTile?.onSocketUpdate?.(data);
            window.sonosSystemTile?.onSocketUpdate?.(data);
        });

        socket.on('sonos_speakers', (data) => {
            window.sonosSystemTile?.onSpeakersUpdate?.(data);
        });

    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSocket);
    } else {
        initSocket();
    }
})();