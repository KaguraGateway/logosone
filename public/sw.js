self.addEventListener("install", function (e) {
  console.log("[SW] Installed");
});
self.addEventListener("activate", function (e) {
  console.log("[SW] Activate");
});
self.addEventListener("fetch", function (e) {
  console.log("[SW] Fetch");
});