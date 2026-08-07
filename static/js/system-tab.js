/**
 * PCCS5 System tab — lazy load and refresh when the section becomes active.
 */
(function () {
    'use strict';

    const SECTION_ID = 'system';

    window.PCCS5 = window.PCCS5 || {};
    window.PCCS5.isSystemTabActive = false;

    function isSystemSectionActive() {
        const section = document.getElementById(SECTION_ID);
        return Boolean(
            section &&
            !section.hidden &&
            section.classList.contains('active')
        );
    }

    function refreshSystemTiles() {
        window.pccsCoreTile?.refresh?.();
        window.PCCS5.phases?.refresh?.();
        window.PCCS5.gpsStatus?.refresh?.();
        window.PCCS5.explain?.refresh?.();
        window.PCCS5.reedsSystem?.refresh?.();
        window.PCCS5.screensSystem?.loadScreens?.();
        window.PCCS5.shutdownSystem?.loadTargets?.();
        window.PCCS5.wifi?.refresh?.({ quiet: true });
        window.sonosSystemTile?.fetchStatus?.();
    }

    function onSectionChange(sectionId) {
        const active = sectionId === SECTION_ID;
        window.PCCS5.isSystemTabActive = active;
        if (active) {
            refreshSystemTiles();
        }
    }

    document.addEventListener('pccs5:section-change', (event) => {
        onSectionChange(event.detail?.sectionId);
    });

    if (isSystemSectionActive()) {
        onSectionChange(SECTION_ID);
    }
})();