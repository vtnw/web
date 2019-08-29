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
self.addEventListener("message", function(event){
	if(event.data == "clearCache") {
		event.waitUntil(caches.delete(CACHE_NAME).then(function() {
			event.source.postMessage("Cleared");
		}));
	}
});
