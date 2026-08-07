/**
 * PCCS5 System tab — Wi-Fi scanner and connector.
 */
(function () {
    'use strict';

    const POLL_INTERVAL_MS = 15000;

    const listEl = document.getElementById('wifi-network-list');
    const headlineEl = document.getElementById('wifi-summary-headline');
    const detailEl = document.getElementById('wifi-summary-detail');
    const scanBtn = document.getElementById('wifi-scan-btn');
    const disconnectBtn = document.getElementById('wifi-disconnect-btn');
    const uplinkEl = document.getElementById('wifi-uplink-prefer');
    const uplinkDetailEl = document.getElementById('wifi-uplink-detail');
    const preferWifiBtn = document.getElementById('wifi-prefer-wifi');
    const preferUsbBtn = document.getElementById('wifi-prefer-usb');
    const connectForm = document.getElementById('wifi-connect-form');
    const connectTargetEl = document.getElementById('wifi-connect-target');
    const passwordField = document.getElementById('wifi-password-field');
    const passwordInput = document.getElementById('wifi-connect-password');
    const connectCancelBtn = document.getElementById('wifi-connect-cancel');
    const connectSubmitBtn = document.getElementById('wifi-connect-submit');

    if (!listEl || !headlineEl || !detailEl || !scanBtn) return;

    const state = {
        status: null,
        networks: [],
        selected: null,
        scanning: false,
        connecting: false,
        disconnecting: false,
        preferring: false,
    };

    function notifyToast(type, title, message, duration = 5500) {
        window.pccs5Toasts?.create?.({ type, title, message, duration });
    }

    function signalClass(signal) {
        if (signal >= 75) return 'is-strong';
        if (signal >= 55) return 'is-good';
        if (signal >= 35) return 'is-fair';
        return 'is-weak';
    }

    function signalBars(signal) {
        const bars = signal >= 75 ? 4 : signal >= 55 ? 3 : signal >= 35 ? 2 : signal > 0 ? 1 : 0;
        return [1, 2, 3, 4].map((bar) => (
            `<span class="${bar <= bars ? 'is-on' : ''}"></span>`
        )).join('');
    }

    function networkMeta(network) {
        const parts = [];
        if (network.security) parts.push(network.security);
        if (network.band) parts.push(network.band);
        if (network.saved) parts.push('Saved');
        return parts.join(' · ') || 'Unknown security';
    }

    function updateDisconnectButton() {
        if (!disconnectBtn) return;
        // Always show next to Scan while connected — form is hidden until a network is tapped.
        const show = Boolean(state.status?.connected && state.status?.ssid);
        disconnectBtn.hidden = !show;
        disconnectBtn.disabled = state.disconnecting || state.connecting || state.preferring || !show;
    }

    function updateUplinkPrefer() {
        if (!uplinkEl) return;

        const uplink = state.status?.uplink;
        const show = Boolean(uplink?.choice_available);
        uplinkEl.hidden = !show;

        if (!show) {
            if (uplinkDetailEl) uplinkDetailEl.textContent = '';
            return;
        }

        const active = uplink.active;
        const busy = state.preferring || state.connecting || state.disconnecting;

        if (preferWifiBtn) {
            preferWifiBtn.classList.toggle('is-active', active === 'wifi');
            preferWifiBtn.setAttribute('aria-pressed', active === 'wifi' ? 'true' : 'false');
            preferWifiBtn.disabled = busy;
        }
        if (preferUsbBtn) {
            preferUsbBtn.classList.toggle('is-active', active === 'usb');
            preferUsbBtn.setAttribute('aria-pressed', active === 'usb' ? 'true' : 'false');
            preferUsbBtn.disabled = busy;
        }

        if (uplinkDetailEl) {
            const wifi = uplink.wifi;
            const usb = uplink.usb;
            const wifiLabel = wifi?.ssid || wifi?.iface || 'Wi‑Fi';
            const usbLabel = usb?.iface ? `USB (${usb.iface})` : 'USB';
            if (active === 'usb') {
                uplinkDetailEl.textContent = `Internet via ${usbLabel}${usb?.ip ? ` · ${usb.ip}` : ''}`;
            } else if (active === 'wifi') {
                uplinkDetailEl.textContent = `Internet via ${wifiLabel}${wifi?.ip ? ` · ${wifi.ip}` : ''}`;
            } else {
                uplinkDetailEl.textContent = 'Both paths online — choose preferred uplink';
            }
        }
    }

    function renderSummary() {
        const status = state.status;
        if (!status) {
            headlineEl.textContent = 'Checking Wi‑Fi…';
            detailEl.textContent = '';
            detailEl.classList.remove('is-warning');
            updateDisconnectButton();
            updateUplinkPrefer();
            return;
        }

        if (!status.available) {
            headlineEl.textContent = 'Wi‑Fi unavailable';
            detailEl.textContent = status.error || 'No wireless interface detected';
            detailEl.classList.add('is-warning');
            updateDisconnectButton();
            updateUplinkPrefer();
            return;
        }

        if (status.connected && status.ssid) {
            const signal = status.signal != null ? `${status.signal}%` : '—';
            const ip = status.ip || 'No IP';
            const uplink = status.uplink;
            headlineEl.textContent = `Connected to ${status.ssid}`;
            if (uplink?.choice_available && uplink.active === 'usb') {
                const usbIface = uplink.usb?.iface || 'usb';
                detailEl.textContent = `${signal} · ${ip} · internet via USB (${usbIface})`;
            } else if (uplink?.choice_available && uplink.active === 'wifi') {
                detailEl.textContent = `${signal} · ${ip} · internet via Wi‑Fi`;
            } else {
                detailEl.textContent = `${signal} · ${ip} · ${status.iface || 'wlan0'}`;
            }
            detailEl.classList.toggle('is-warning', false);
            updateDisconnectButton();
            updateUplinkPrefer();
            return;
        }

        headlineEl.textContent = 'Not connected';
        detailEl.textContent = `${state.networks.length} network${state.networks.length === 1 ? '' : 's'} nearby · ${status.iface || 'wlan0'}`;
        detailEl.classList.toggle('is-warning', state.networks.length === 0);
        updateDisconnectButton();
        updateUplinkPrefer();
    }

    function renderNetworks() {
        if (!state.networks.length) {
            listEl.innerHTML = '<p class="wifi-system-tile__empty">No networks found. Tap Scan to refresh.</p>';
            return;
        }

        listEl.innerHTML = state.networks.map((network) => {
            const modifiers = [
                signalClass(network.signal),
                network.in_use ? 'is-connected' : '',
                state.selected?.ssid === network.ssid ? 'is-active' : '',
            ].filter(Boolean).join(' ');

            const icon = network.in_use ? 'fa-circle-check' : network.secured ? 'fa-lock' : 'fa-wifi';

            const isSelected = state.selected?.ssid === network.ssid;

            return `
                <button type="button"
                        class="wifi-system-tile__network ${modifiers}"
                        data-wifi-ssid="${encodeURIComponent(network.ssid)}"
                        ${state.connecting || state.disconnecting ? 'disabled' : ''}
                        role="listitem"
                        aria-pressed="${isSelected ? 'true' : 'false'}"
                        aria-label="${network.ssid}, ${network.signal} percent">
                    <div class="wifi-system-tile__network-main">
                        <i class="fa-solid ${icon} wifi-system-tile__network-icon" aria-hidden="true"></i>
                        <div>
                            <p class="wifi-system-tile__network-name">${network.ssid}</p>
                            <p class="wifi-system-tile__network-meta">${networkMeta(network)}</p>
                        </div>
                    </div>
                    <div class="wifi-system-tile__signal">
                        <span class="wifi-system-tile__signal-bars" aria-hidden="true">${signalBars(network.signal)}</span>
                        <span>${network.signal}%</span>
                    </div>
                </button>
            `;
        }).join('');
    }

    function hideConnectForm() {
        state.selected = null;
        if (!connectForm) return;
        connectForm.hidden = true;
        if (passwordInput) passwordInput.value = '';
        renderNetworks();
    }

    function showConnectForm(network) {
        if (!connectForm || !connectTargetEl) return false;

        state.selected = network;
        connectForm.hidden = false;
        connectTargetEl.textContent = network.in_use
            ? `Reconnect to ${network.ssid}`
            : `Connect to ${network.ssid}`;

        const needsPassword = network.secured && !network.saved && !network.in_use;
        if (passwordField) {
            passwordField.hidden = !needsPassword;
        }
        if (passwordInput) {
            passwordInput.required = needsPassword;
            passwordInput.value = '';
            passwordInput.placeholder = needsPassword ? 'Network password' : 'Optional for saved/open networks';
        }

        renderNetworks();
        return needsPassword;
    }

    function applyStatus(payload) {
        state.status = payload;
        state.networks = Array.isArray(payload.networks) ? payload.networks : [];
        renderSummary();
        renderNetworks();
    }

    async function fetchStatus() {
        const response = await fetch('/api/wifi');
        if (!response.ok) throw new Error('Wi-Fi status unavailable');
        return response.json();
    }

    async function refresh({ quiet = false } = {}) {
        if (!window.PCCS5?.isSystemTabActive) return;
        try {
            const payload = await fetchStatus();
            applyStatus(payload);
            if (!quiet && payload.scan_warning) {
                notifyToast('warning', 'Wi-Fi scan', payload.scan_warning, 5000);
            }
        } catch (error) {
            headlineEl.textContent = 'Wi‑Fi unavailable';
            detailEl.textContent = error.message || 'Could not load Wi-Fi status';
            detailEl.classList.add('is-warning');
        }
    }

    async function scanNetworks() {
        if (state.scanning) return;

        state.scanning = true;
        scanBtn.disabled = true;
        scanBtn.classList.add('is-spinning');

        try {
            const response = await fetch('/api/wifi/scan', { method: 'POST' });
            const payload = await response.json();
            if (Array.isArray(payload.networks)) {
                state.networks = payload.networks;
                if (state.status) {
                    state.status = { ...state.status, networks: payload.networks };
                }
            }

            renderSummary();
            renderNetworks();

            if (!payload.ok) {
                notifyToast('warning', 'Wi-Fi scan', payload.error || 'Scan did not find any networks', 5000);
            } else if (payload.warning) {
                notifyToast('info', 'Wi-Fi scan', payload.warning, 4500);
            }
        } catch (error) {
            notifyToast('error', 'Wi-Fi scan', error.message || 'Scan failed');
        } finally {
            state.scanning = false;
            scanBtn.disabled = false;
            scanBtn.classList.remove('is-spinning');
        }
    }

    async function connectToSelected(password) {
        if (!state.selected || state.connecting || state.disconnecting || state.preferring) return;

        state.connecting = true;
        if (connectSubmitBtn) connectSubmitBtn.disabled = true;
        if (connectCancelBtn) connectCancelBtn.disabled = true;
        updateDisconnectButton();
        updateUplinkPrefer();
        renderNetworks();

        try {
            const response = await fetch('/api/wifi/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ssid: state.selected.ssid,
                    password: password || null,
                }),
            });
            const payload = await response.json();

            if (payload.status) {
                applyStatus(payload.status);
            } else {
                await refresh({ quiet: true });
            }

            if (payload.ok) {
                const ssid = state.selected?.ssid || payload.status?.ssid || 'network';
                hideConnectForm();
                notifyToast('success', 'Wi-Fi', payload.message || `Connected to ${ssid}`);
            } else {
                notifyToast('error', 'Wi-Fi', payload.error || 'Connection failed');
            }
        } catch (error) {
            notifyToast('error', 'Wi-Fi', error.message || 'Connection failed');
        } finally {
            state.connecting = false;
            if (connectSubmitBtn) connectSubmitBtn.disabled = false;
            if (connectCancelBtn) connectCancelBtn.disabled = false;
            updateDisconnectButton();
            renderNetworks();
        }
    }

    async function disconnectCurrent() {
        if (state.disconnecting || state.connecting || state.preferring) return;
        if (!state.status?.connected) return;

        state.disconnecting = true;
        scanBtn.disabled = true;
        updateDisconnectButton();
        updateUplinkPrefer();
        renderNetworks();

        try {
            const response = await fetch('/api/wifi/disconnect', { method: 'POST' });
            const payload = await response.json();

            if (payload.status) {
                applyStatus(payload.status);
            } else {
                await refresh({ quiet: true });
            }

            if (payload.ok) {
                hideConnectForm();
                notifyToast('success', 'Wi-Fi', payload.message || 'Disconnected');
            } else {
                notifyToast('error', 'Wi-Fi', payload.error || 'Disconnect failed');
            }
        } catch (error) {
            notifyToast('error', 'Wi-Fi', error.message || 'Disconnect failed');
        } finally {
            state.disconnecting = false;
            scanBtn.disabled = state.scanning;
            updateDisconnectButton();
            updateUplinkPrefer();
            renderNetworks();
        }
    }

    async function preferUplink(prefer) {
        if (state.preferring || state.connecting || state.disconnecting) return;
        if (!state.status?.uplink?.choice_available) return;
        if (state.status.uplink.active === prefer) return;

        state.preferring = true;
        updateUplinkPrefer();
        updateDisconnectButton();

        try {
            const response = await fetch('/api/wifi/prefer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prefer }),
            });
            const payload = await response.json();

            if (payload.status) {
                applyStatus(payload.status);
            } else {
                await refresh({ quiet: true });
            }

            if (payload.ok) {
                notifyToast('success', 'Internet', payload.message || `Preferred ${prefer}`);
            } else {
                notifyToast('error', 'Internet', payload.error || 'Could not switch uplink');
            }
        } catch (error) {
            notifyToast('error', 'Internet', error.message || 'Could not switch uplink');
        } finally {
            state.preferring = false;
            updateUplinkPrefer();
            updateDisconnectButton();
        }
    }

    function getNetworkFromButton(button) {
        const encoded = button.dataset.wifiSsid;
        if (!encoded) return null;
        const ssid = decodeURIComponent(encoded);
        return state.networks.find((network) => network.ssid === ssid) || null;
    }

    listEl.addEventListener('click', (event) => {
        const button = event.target.closest('[data-wifi-ssid]');
        if (!button) return;

        const network = getNetworkFromButton(button);
        if (!network) return;

        const needsPassword = showConnectForm(network);
        if (needsPassword && passwordInput) {
            passwordInput.focus();
        } else {
            connectSubmitBtn?.focus();
        }
    });

    scanBtn.addEventListener('click', () => {
        scanNetworks();
    });

    disconnectBtn?.addEventListener('click', () => {
        disconnectCurrent();
    });

    preferWifiBtn?.addEventListener('click', () => {
        preferUplink('wifi');
    });

    preferUsbBtn?.addEventListener('click', () => {
        preferUplink('usb');
    });

    connectCancelBtn?.addEventListener('click', () => {
        hideConnectForm();
    });

    connectForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        connectToSelected(passwordInput?.value || '');
    });

    window.setInterval(() => {
        if (!window.PCCS5?.isSystemTabActive) return;
        refresh({ quiet: true });
    }, POLL_INTERVAL_MS);

    window.PCCS5 = window.PCCS5 || {};
    window.PCCS5.wifi = { refresh };
})();