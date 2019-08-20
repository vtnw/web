var CACHE_NAME = "web";
self.addEventListener("activate", function(event) {
	event.waitUntil(caches.delete(CACHE_NAME); );
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
	event.waitUntil(clients.openWindow("task.html?d=" + event.notification.body));
});
self.addEventListener("message", function(event){
    console.log("SW Received Message: " + event.data);
	event.waitUntil(
		if(event.data == "clearCache") {
			caches.delete(CACHE_NAME);
		}
	);
});
