'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {".git/COMMIT_EDITMSG": "f863015737d2a1045066ce77d517899b",
".git/config": "73387b3d4193ec4ec66811884092419a",
".git/description": "a0a7c3fff21f2aea3cfa1d0316dd816c",
".git/HEAD": "59b0e2dc6676eeb91af0dd131222a94a",
".git/hooks/applypatch-msg.sample": "ce562e08d8098926a3862fc6e7905199",
".git/hooks/commit-msg.sample": "579a3c1e12a1e74a98169175fb913012",
".git/hooks/fsmonitor-watchman.sample": "a0b2633a2c8e97501610bd3f73da66fc",
".git/hooks/post-update.sample": "2b7ea5cee3c49ff53d41e00785eb974c",
".git/hooks/pre-applypatch.sample": "054f9ffb8bfe04a599751cc757226dda",
".git/hooks/pre-commit.sample": "305eadbbcd6f6d2567e033ad12aabbc4",
".git/hooks/pre-merge-commit.sample": "39cb268e2a85d436b9eb6f47614c3cbc",
".git/hooks/pre-push.sample": "2c642152299a94e05ea26eae11993b13",
".git/hooks/pre-rebase.sample": "56e45f2bcbc8226d2b4200f7c46371bf",
".git/hooks/pre-receive.sample": "2ad18ec82c20af7b5926ed9cea6aeedd",
".git/hooks/prepare-commit-msg.sample": "2b5c047bdb474555e1787db32b2d2fc5",
".git/hooks/push-to-checkout.sample": "c7ab00c7784efeadad3ae9b228d4b4db",
".git/hooks/sendemail-validate.sample": "4d67df3a8d5c98cb8565c07e42be0b04",
".git/hooks/update.sample": "647ae13c682f7827c22f5fc08a03674e",
".git/index": "db2701535c37a2cef40091deab8da570",
".git/info/exclude": "036208b4a1ab4a235d75c181e685e5a3",
".git/logs/HEAD": "878c0580b576530b6ebbfe0738aa3ada",
".git/logs/refs/heads/demo": "4e9027e659deb0550407c7a9805742ae",
".git/logs/refs/heads/main": "b1cc3bb46e8feb7a58668d2c47dd00ee",
".git/logs/refs/remotes/origin/demo": "c9ed4eec5b34fc5dc41ef7ada4fddaa9",
".git/logs/refs/remotes/origin/HEAD": "2fd192c633b74cbca20dbc7b95284ce1",
".git/objects/04/e5efc15dc0c60ea2ffcc37c5bf25e96689f44d": "978222f47488835b92838c74cb5c684c",
".git/objects/05/5861ed0e5a772af497491b0c08acb9b599ddc3": "3ae2812c69224affc1dab8c39474e83d",
".git/objects/0a/2ad3a8946718e5da80b8b36f3a970f9203bb41": "493becadfb3c0f3d60727bde4e9f1614",
".git/objects/0d/427f002fcfb2a2fa26c54152094c42ee6fe3ed": "10af7d3655ab10c56575cb7d30c802f7",
".git/objects/1b/427b43a7c8332ce0485804199257b1cabe6029": "61b378758c4538032423874042689d9e",
".git/objects/20/1afe538261bd7f9a38bed0524669398070d046": "82a4d6c731c1d8cdc48bce3ab3c11172",
".git/objects/25/93c16b1dec7b83966b755b33fe167c2624bcf7": "8ae2e906f67eb0a0699bf0df0ae69c18",
".git/objects/2d/0800978d54e13ee71cc7b0b7df10cc6de4a3cf": "11f13e4f4bd323aad2323ad41a845118",
".git/objects/33/62ceb9f57b40bf40bc091e5865b350ee52a7d3": "102f8ba2bfe4dd4db93eeec00646ef2c",
".git/objects/36/8650a25d8b9014e7e7310f3404643f0ec7be8e": "37032ea84845485d81c436fdc563d174",
".git/objects/37/50bd1e6f4b537a029507e738b3e50d92e9a1d6": "1bc6bdb8cfd7e79fe12e87609ca3e657",
".git/objects/39/0d080c923df14d04f223ba026a1424f8205697": "2fecd98345f3842f83d3c6778f3ec7e6",
".git/objects/3a/6afddd0b59ccfa4a826ac275a0d2cef2b5f9fc": "ff214240adad0666c5c9402ab0293b98",
".git/objects/3d/245a78e40b6013ddbeb7c3cab3055b51ddd9ea": "f273b736ba4ca930c96d21cf696dd265",
".git/objects/3f/595fcc13a68600f2546c2e00d37088a0b6f80d": "c73538f1e4cdb792f8f14eb579fa6655",
".git/objects/3f/d34c5ca43a6ce63631346ad4c75d4157bef936": "444a4e3d5d51e712dad54680e07c3e92",
".git/objects/43/e946e398d96aee466fa0aabb625f0889c3a4bd": "ac34520dee747f675e6e0a15c0bbd2be",
".git/objects/48/33fcf9ba677d3df448c90e63368e50f8bfc8d6": "a5b926fccf641f8e2a09e52478c0d37a",
".git/objects/4f/d0e51f345ee398d4c56c9a2a36514cfdc54f3e": "d8e976b7b97437231f01681fc40815a3",
".git/objects/64/c75d08af38aabe62a56e763e8bf7c6c9b61706": "eed8bacf1ce4402cd1d66b557cc1a7b0",
".git/objects/6b/fc041a179ab0ca34f60886bc00bc233aac86fc": "582e71c8bcfb896dac89c3645a0a054b",
".git/objects/76/aebe950c3047aa4cff9305109c8cd90a85e329": "41c141f2b36a2d39a788ea551686e5c8",
".git/objects/7d/4a5cea427f30aafe1e48e6199dd0affc325c47": "b413eaa0f2eaf99e40516ea6cd69735c",
".git/objects/81/19e69a4081247f06236c9b0b8d615da1e92b4e": "617b20f33a566450ce08103e4af1f827",
".git/objects/86/85e1dc3dbdd368cb077008c9e407ba648cdf08": "43aa707776c78f32b52aa511a6e6dac9",
".git/objects/86/cc6acce84a6d092c37296e336e8c8021140acd": "f6517a9f9478d62e1fece666b03f7f49",
".git/objects/a2/e6307ab965a64b0654c1ddc2c7218945398f51": "25add961afe706123869e4957889c3d6",
".git/objects/a5/10647436b146156c5bf6dc92cbee4cbd2a1bc6": "bca449a2a1c95eda172586bfe5d106f7",
".git/objects/b6/b00976f9474e776017f37c0f9e10a844260e35": "6da5a5f78c004b840f5efe303c76943c",
".git/objects/ba/8cb00dd5231f1a55de0205c16445926a696526": "be8592f9341c9b01b70890c8614c6cf7",
".git/objects/bb/3085876799532613a08c7ebe43f24f0cc46864": "1b6aa21800d948d5513c15e54d131215",
".git/objects/c2/407bfdecedf08b222aa48f879b6b948cce977a": "82eca6827f69d98d7de65b2b45a66068",
".git/objects/d1/c561ec4b1680a1722cca1f9db00d0b0c15a8a6": "4b464235faf7e22ec95078a899902e42",
".git/objects/d8/86f1451c6369885388a5a709f6862aabc5be6b": "e75153514d9ebe92e0c3a8ddb14ebb5c",
".git/objects/d9/bfd615a67c6d110311f8150b779b50a2b23ca9": "55e6db8ab180715ac9abfe1e043d5923",
".git/objects/e6/0826034a9259cd8c5745ae6cd279e92537cea9": "ad4c759628d87dca4fdfa95ca8136bf0",
".git/objects/e6/63fc6d5103f76e0e7bef986e8d8658dae045f0": "8d14a6704333719790e304f662ffd657",
".git/objects/pack/pack-918557d74a375554303c545249a512471dade2cf.idx": "8474ab9da5701870d424e1f4f946305b",
".git/objects/pack/pack-918557d74a375554303c545249a512471dade2cf.pack": "c332db4d10e564573468d810d9e3989a",
".git/objects/pack/pack-918557d74a375554303c545249a512471dade2cf.rev": "cc9db875c8903a2e843b2ba4210501c2",
".git/packed-refs": "4061acd2cbafe065def865187b2a94bf",
".git/refs/heads/demo": "86c02bb227ad65eb79b0b37a17ec9cbf",
".git/refs/heads/main": "dbd81dec56a83a34860d81524b0d9355",
".git/refs/remotes/origin/demo": "86c02bb227ad65eb79b0b37a17ec9cbf",
".git/refs/remotes/origin/HEAD": "98b16e0b650190870f1b40bc8f4aec4e",
"assets/AssetManifest.bin": "05e7a4fd7844dc2bc31173e00068ed8f",
"assets/AssetManifest.bin.json": "aa559c628f35fd4a14e7c8e05866c80f",
"assets/AssetManifest.json": "2e68a83fd795c4878927f64fba4bab26",
"assets/assets/fonts/digital-7/digital-7%2520(italic).ttf": "7c6e146fe91c1b2633316a6aee97a9af",
"assets/assets/fonts/digital-7/digital-7%2520(mono%2520italic).ttf": "f6e67539e25adbf860808313c8e75ce5",
"assets/assets/fonts/digital-7/digital-7%2520(mono).ttf": "58045dabdc3a361cb9bb9faf2f1dd1f3",
"assets/assets/fonts/digital-7/digital-7.ttf": "1e670d88b23c7ab956f1829e3828a210",
"assets/assets/fonts/digital-7/readme.txt": "02630d8459ae0b3cd0aaa0ceb463bdfb",
"assets/assets/images/leave.png": "a9b5076246222d2f3fadab800f9da711",
"assets/assets/images/wedding-couple.png": "1a720cd52f8d8af6019f9d51e9755b88",
"assets/assets/sound/goodbye.mp3": "5b00477866cb9f867955eae9ba5e2f51",
"assets/assets/sound/zagrota.mp3": "e17cca1c562a5c54f15e6f05f9295f21",
"assets/FontManifest.json": "fcc9835935ed3791ab2c6f7ef5d165dc",
"assets/fonts/MaterialIcons-Regular.otf": "261e04816867b8c3ad8ff91b50bb3aba",
"assets/NOTICES": "4482ca8732cb672264f1c83ef1185d41",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"assets/sound/goodbye.mp3": "5b00477866cb9f867955eae9ba5e2f51",
"assets/sound/zagrota.mp3": "e17cca1c562a5c54f15e6f05f9295f21",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "64edb91684bdb3b879812ba2e48dd487",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "f87e541501c96012c252942b6b75d1ea",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "4124c42a73efa7eb886d3400a1ed7a06",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "476d9260b5a4a62dcb3ce3521e7e6d31",
"flutter.js": "59a12ab9d00ae8f8096fffc417b6e84f",
"icons/Icon-192.png": "476d9260b5a4a62dcb3ce3521e7e6d31",
"icons/Icon-512.png": "476d9260b5a4a62dcb3ce3521e7e6d31",
"icons/Icon-maskable-192.png": "476d9260b5a4a62dcb3ce3521e7e6d31",
"icons/Icon-maskable-512.png": "476d9260b5a4a62dcb3ce3521e7e6d31",
"index.html": "73e59b47996d363ecb7c2471d369da82",
"/": "73e59b47996d363ecb7c2471d369da82",
"main.dart.js": "ebbed5a30730bd48cc5ebca224d27c48",
"manifest.json": "6137776534fbeaae68d5dd6ab61594f9",
"version.json": "ee8feebd65643bbbc341bd5ed2fcc5bd"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
