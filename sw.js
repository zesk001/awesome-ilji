// 일일업무일지 PWA 서비스워커
// 정책: 페이지 내용은 항상 최신을 받아오고(네트워크 우선),
//       인터넷이 끊겼을 때만 안내 화면을 보여준다. (오래된 화면 캐시 방지)
const OFFLINE = 'ilji-offline-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(OFFLINE).then((c) =>
      c.put(
        'offline.html',
        new Response(
          '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
            '<div style="font-family:sans-serif;text-align:center;color:#1e5631;margin-top:60px;padding:0 20px">' +
            '<div style="font-size:46px">🌿</div>' +
            '<h2 style="margin:14px 0 6px">인터넷에 연결되어 있지 않아요</h2>' +
            '<p style="color:#666">연결을 확인하고 다시 열어주세요.</p></div>',
          { headers: { 'Content-Type': 'text/html;charset=utf-8' } }
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // 페이지 이동 요청만 처리: 네트워크 우선, 실패하면 오프라인 안내
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('offline.html')));
  }
});
