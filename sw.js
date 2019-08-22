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
	event.notification.close();
	var page = "task.html";
	switch (event.action) {
		case "search": page = "https://google.com/search?q="; break;
		case "dictionary": page = "https://dictionary.cambridge.org/search/english/direct/?q="; break;
		case "wikipedia": page = "https://en.wikipedia.org/wiki/Special:Search/"; break;
		case "test": break;
  	}
	if(event.action) { return clients.openWindow(page + event.notification.body); }	
	event.waitUntil(clients.matchAll({type: "window"}).then(function(clientList) {
		for (var client of clientList) {
			if (client.url.endsWith(page)) {
				client.postMessage(event.notification.body);
				return client.focus();
			}
		}
		return clients.openWindow(page + "?d=" + event.notification.body);
	}));
});
self.addEventListener("message", function(event){
	if(event.data == "clearCache") {
		event.waitUntil(caches.delete(CACHE_NAME).then(function() {
			event.source.postMessage("Cleared");
		}));
	}
});
