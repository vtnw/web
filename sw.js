var CACHE_NAME = "web";
self.addEventListener("activate", function(event) {
	event.waitUntil(caches.delete(CACHE_NAME));
});
self.addEventListener("fetch", function(event) {
	event.respondWith(
		caches.match(event.request, {ignoreSearch: true}).then(function(response) {
			if (response) { return response; }
			return fetch(event.request).then(function(response) {
				if(!response || response.status !== 200 || response.type !== "basic") { return response; }
				var responseClone = response.clone();
				caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, responseClone); });
				return response;
			});
		})
	);
});
self.addEventListener("notificationclick", function(event) {
	var url = "https://vtnw.github.io/web/task.html"
	event.notification.close();
	event.waitUntil(clients.matchAll({type: "window"}).then(function(clientList) {
		for (var client of clientList) {console.log(client.url);
			if (client.url == url) {
				client.postMessage(event.notification.body);
				//return client.focus();
			}
		}
		return clients.openWindow(url + "?d=" + event.notification.body);
	}));
});
self.addEventListener("message", function(event){
	if(event.data == "clearCache") {
		event.waitUntil(caches.delete(CACHE_NAME).then(function(boolean) {
			event.source.postMessage("Cleared");
		}));
	}
});
