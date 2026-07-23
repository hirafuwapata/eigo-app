// このサービスワーカーは、以前のバージョンが古い内容をキャッシュしたまま
// 離してくれない問題を解消するための「自己解除」版です。
// インストールされたら、キャッシュを全部消して自分自身を登録解除し、
// 開いているページを再読み込みします。

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((clients) => {
        clients.forEach((client) => client.navigate(client.url));
      })
  );
});
