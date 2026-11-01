/* Orașul din Telefon — pornire */
(function () {
  'use strict';
  const OT = window.OT;
  function start() {
    // oprește meniul de la apăsare lungă și zoom-ul cu două degete pe ecranele de joc
    document.addEventListener('contextmenu', (e) => {
      if (!e.target.closest || !e.target.closest('.diplomas-screen')) e.preventDefault();
    });
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    let lastTouch = 0;
    document.addEventListener(
      'touchend',
      (e) => {
        const now = Date.now();
        if (now - lastTouch < 350 && !(e.target.closest && e.target.closest('input,textarea'))) e.preventDefault();
        lastTouch = now;
      },
      { passive: false }
    );
    const q = new URLSearchParams(location.search);
    if (q.has('test')) window.__OT_TEST = true;
    if (!OT.state.introSeen && OT.buildings[0]) OT.go('lesson', { id: 0 });
    else OT.go('map');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
