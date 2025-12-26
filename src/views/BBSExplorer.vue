<template>
  <div
    class="min-h-screen bg-[var(--color-oled-black)] relative overflow-y-auto no-scrollbar"
  >
    <!-- mesh gradient background -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div
        class="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-pink-900/30 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"
      ></div>
      <div
        class="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[100px] mix-blend-screen"
      ></div>
    </div>

    <!-- content -->
    <div class="relative z-10 p-6 pt-16 pb-32 max-w-7xl mx-auto w-full">
      <!-- header -->
      <div class="flex flex-col gap-6 mb-8 px-2">
        <!-- title & back -->
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <button
              @click="router.back()"
              class="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md active:bg-white/20 transition-all hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-white/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div class="flex flex-col">
              <h1
                class="text-3xl font-bold tracking-tight text-white/90 drop-shadow-sm"
              >
                BBS Explorer
              </h1>
              <span
                class="text-xs font-medium text-white/40 tracking-wider uppercase mt-1"
              >
                Lexaloffle PICO-8
              </span>
            </div>
          </div>
        </div>

        <!-- search & filter -->
        <div class="flex flex-col md:flex-row gap-3">
          <!-- main search -->
          <div class="relative flex-1 group">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-4 w-4 text-white/40 group-focus-within:text-pink-400 transition-colors"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              @keydown.enter="performSearch"
              type="text"
              class="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 sm:text-sm transition-all"
              placeholder="Search BBS..."
            />
          </div>

          <!-- segmented control -->
          <div class="bg-white/5 p-1 rounded-xl flex border border-white/10">
            <button
              v-for="tab in ['Featured', 'New']"
              :key="tab"
              @click="switchTab(tab)"
              class="flex-1 px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              :class="
                activeTab === tab
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/60'
              "
            >
              {{ tab }}
            </button>
          </div>
        </div>
      </div>

      <!-- loading state -->
      <transition name="fade">
        <div
          v-if="loading"
          class="flex flex-col items-center justify-center py-20"
        >
          <div
            class="w-8 h-8 rounded-full border-2 border-white/20 border-t-pink-500 animate-spin mb-4"
          ></div>
          <span class="text-white/30 text-sm tracking-widest uppercase">
            Fetching Cartridges
          </span>
        </div>
      </transition>

      <!-- empty state -->
      <transition name="fade">
        <div
          v-if="!loading && games.length === 0"
          class="flex flex-col items-center justify-center py-20 text-center"
        >
          <p class="text-white/60 font-medium">No results found</p>
          <p class="text-white/30 text-sm mt-1">Try a different search term</p>
        </div>
      </transition>

      <!-- grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div
          v-for="(game, index) in games"
          :key="game.id"
          @click.stop.prevent="downloadGame(game)"
          class="group relative aspect-[4/5] rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-pink-500/20"
          :style="{ '--index': index }"
        >
          <!-- card container -->
          <div
            class="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg z-0"
          >
            <!-- cover art -->
            <img
              :src="game.thumb_url"
              alt="Cover"
              class="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />

            <!-- title band -->
            <div
              class="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 backdrop-blur-[2px]"
            >
              <h3
                class="text-white font-medium text-sm truncate drop-shadow-md transform transition-transform translate-y-1 group-hover:translate-y-0"
              >
                {{ game.title }}
              </h3>
              <p
                class="text-white/50 text-xs truncate transform transition-transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300"
              >
                {{ game.author }}
              </p>
            </div>

            <!-- download overlay -->
            <div
              v-if="downloadingId === game.id"
              class="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10"
            >
              <div
                class="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- infinite scroll trigger -->
      <div
        ref="infiniteScrollTrigger"
        class="h-20 w-full flex items-center justify-center mt-8"
      >
        <div
          v-if="loadingMore"
          class="w-6 h-6 border-2 border-white/20 border-t-pink-500 rounded-full animate-spin"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { BBS } from "../services/BBS";
import { PicoWebScraperWeb } from "../services/PicoWebScraperWeb";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { useLibraryStore } from "../stores/library";
import { useToast } from "../composables/useToast";

const router = useRouter();
const libraryStore = useLibraryStore();
const toast = useToast();

const games = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const activeTab = ref("Featured");
const downloadingId = ref(null);

// Infinite Scroll
const infiniteScrollTrigger = ref(null);
const currentPage = ref(1);
const loadingMore = ref(false);
let observer = null;

onMounted(() => {
  loadGames();
  setupIntersectionObserver();
});

function setupIntersectionObserver() {
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (
        entry.isIntersecting &&
        !loading.value &&
        !loadingMore.value &&
        searchQuery.value === "" &&
        games.value.length > 0
      ) {
        loadMoreGames();
      }
    },
    { rootMargin: "200px" }
  );

  if (infiniteScrollTrigger.value) {
    observer.observe(infiniteScrollTrigger.value);
  }
}

async function loadMoreGames() {
  loadingMore.value = true;
  currentPage.value++;
  try {
    let newGames = [];
    if (activeTab.value === "Featured") {
      newGames = await BBS.getFeatured(currentPage.value);
    } else {
      newGames = await BBS.getNew(currentPage.value);
    }
    // Filter duplicates just in case
    const existingIds = new Set(games.value.map((g) => g.id));
    const uniqueNewGames = newGames.filter((g) => !existingIds.has(g.id));
    games.value = [...games.value, ...uniqueNewGames];
  } catch (e) {
    console.error("Failed to load more games", e);
  } finally {
    loadingMore.value = false;
  }
}

async function loadGames() {
  loading.value = true;
  currentPage.value = 1; // Reset page
  games.value = [];

  try {
    if (searchQuery.value.trim() !== "") {
      games.value = await BBS.search(searchQuery.value);
    } else if (activeTab.value === "Featured") {
      games.value = await BBS.getFeatured();
    } else {
      games.value = await BBS.getNew();
    }
  } catch (e) {
    console.error("Failed to load games", e);
  } finally {
    loading.value = false;
  }
}

async function performSearch() {
  // force search mode basically overrides tabs
  if (!searchQuery.value) return;
  Haptics.impact({ style: ImpactStyle.Light });
  activeTab.value = "Search"; // Just visual
  loadGames();
}

async function switchTab(tab) {
  if (activeTab.value === tab && !searchQuery.value) return;
  Haptics.impact({ style: ImpactStyle.Light });

  activeTab.value = tab;
  searchQuery.value = ""; // Clear search when switching tabs
  loadGames();
}

async function downloadGame(game, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  if (!game || !game.id) {
    console.error("Invalid game data");
    return;
  }
  if (downloadingId.value) return;

  // consent (bypassed for testing/alpha)
  // if (!confirm(`Download ${game.title}?`)) return;

  downloadingId.value = game.id;
  Haptics.impact({ style: ImpactStyle.Medium });
  console.log(`Downloading ${game.title}... URL: ${game.download_url}`);

  try {
    // 0. deep peek for source of truth url
    console.log(`🔍 Source of Truth Peek: ${game.source_page_url}`);

    let finalBinaryPath = null;

    // 1. fetch the actual game page first
    const pageRes = await fetch(game.source_page_url);
    const pageHtml = await pageRes.text();

    // 2. extract the exact path (e.g., /bbs/cposts/bi/birdswithguns-5.p8.png)
    // smart harvest protocol

    // 1. find the named id (e.g., 'birdswithguns-5')
    // ground truth: p8_run_cart('/play/pico8_0207.js', 'birdswithguns-5', '/bbs/cposts/bi/birdswithguns-5.p8.png');
    const namedIdMatch = pageHtml.match(
      /p8_run_cart\s*\(\s*['"][^'"]+['"]\s*,\s*['"]([^'"]+)['"]/i
    );
    const finalNamedId = namedIdMatch ? namedIdMatch[1] : String(game.id);
    console.log(`🌾 Named ID Harvest: ${finalNamedId} (Original: ${game.id})`);

    // step b: hunt for the direct path using known patterns
    // ground truth: Module.arguments = ["/bbs/cposts/bi/birdswithguns-5.p8.png"];
    const patterns = [
      /Module\.arguments\s*=\s*\[\s*["']([^"']+)["']/i, // pattern 1: module.arguments (the gold standard)
      /p8_run_cart\s*\(\s*[^,]+,\s*[^,]+,\s*["']([^"']+)["']/i, // pattern 2: p8_run_cart (3rd arg is url)
      /href=["'](\/bbs\/cposts\/[^"']+\.p8\.png)["']/i, // pattern 3: href metadata
    ];

    let argMatch = null;
    for (const p of patterns) {
      argMatch = pageHtml.match(p);
      if (argMatch) break;
    }

    if (argMatch && argMatch[1]) {
      const realPath = argMatch[1];
      // handle absolute vs relative paths
      const fullUrl = realPath.startsWith("http")
        ? realPath
        : `https://www.lexaloffle.com${realPath}`;

      finalBinaryPath = fullUrl.replace("https://www.lexaloffle.com", "");
      console.log(`🎯 SOURCE LOCKED: ${finalBinaryPath}`);
    } else {
      // 3rd helper: check if named id has an extension (unlikely for id but good for safety)
      // note: prefix brute force is safe
      console.warn("⚠️ All patterns failed. Engaging Prefix Brute Force.");

      // the "prefix" brute force
      // if the regex fails to find a full path, we use the first two characters of the named id we just found.
      const prefix = finalNamedId.substring(0, 2).toLowerCase();
      finalBinaryPath = `/bbs/cposts/${prefix}/${finalNamedId}.p8.png`;
      console.log(
        `🛡️ Fallback: Generating path from Named ID: ${finalNamedId} -> ${finalBinaryPath}`
      );
    }

    // .p8 compatibility check
    // if the path ends in .p8 (text cart), we must handle it differently
    const isTextCart =
      finalBinaryPath.endsWith(".p8") ||
      finalBinaryPath.includes(".p8?") || // Handle query params if any
      (argMatch && argMatch[0].includes(".p8'")); // Rough check if detection was weird

    const finalProxiedURL = `https://corsproxy.io/?${encodeURIComponent(
      "https://www.lexaloffle.com" + finalBinaryPath
    )}`;

    // 1. fetch data
    // add headers to mimic browser request and avoid 404/blocking on direct binary access
    const response = await fetch(finalProxiedURL, {
      headers: {
        Accept: "image/png,image/*;q=0.8",
      },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();

    // 2. professional integrity check
    if (isTextCart) {
      // handle text cart (.p8)
      const textData = await blob.text();
      // basic pico-8 header check
      if (
        !textData.includes("pico-8 cartridge") &&
        !textData.includes("header")
      ) {
        throw new Error("Invalid .p8 File (No Header)");
      }
      console.log("📄 Downloaded Text Cart:", textData.length, "chars");

      // save to library persistently
      try {
        const safeTitle = game.title
          .replace(/[^a-zA-Z0-9]/g, "_")
          .toLowerCase();
        const filename = `${safeTitle}.p8`;
        const file = new File([textData], filename, { type: "text/plain" });

        console.log(`💾 Persisting BBS Cart: ${filename}`);
        const saved = await libraryStore.addCartridge(file);

        if (saved) {
          toast.showToast(`Saved ${game.title} to Library!`, "success");
        }
      } catch (saveErr) {
        console.error("Save to library failed", saveErr);
      }

      window._bbs_cartdat = textData; // store as string
      console.log("📦 Stashed Text in window._bbs_cartdat");
      router.push({ name: "player", query: { cart: "bbs_cart" } });
      return;
    }

    // binary (.p8.png) handling
    // strict 8kb limit as requested for deep hunter protocol
    if (blob.size < 8000) {
      throw new Error(`404/Incomplete Data`);
    }

    // check png signature (first 4 bytes: 0x89 0x50 0x4e 0x47)
    const arrayBuffer = await blob.arrayBuffer();
    const header = new Uint8Array(arrayBuffer.slice(0, 4));
    const isPng =
      header[0] === 0x89 &&
      header[1] === 0x50 &&
      header[2] === 0x4e &&
      header[3] === 0x47;

    if (!isPng) {
      throw new Error("Invalid File Signature (Not a PNG Cartridge)");
    }

    console.log("📥 Downloaded Size:", blob.size);

    // save to library persistently
    try {
      const safeTitle = game.title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      const filename = `${safeTitle}.p8.png`;
      const file = new File([blob], filename, { type: "image/png" });

      console.log(`💾 Persisting BBS Cart: ${filename}`);
      const saved = await libraryStore.addCartridge(file);

      if (saved) {
        toast.showToast(`Saved ${game.title} to Library!`, "success");
      }
    } catch (saveErr) {
      console.error("Save to library failed", saveErr);
    }

    // 3. store in global stash (using _bbs_cartdat to strictly isolate)
    // we strictly want to play, not save to library yet (as per request "boots instantly")
    window._bbs_cartdat = new Uint8Array(arrayBuffer); // use existing buffer
    console.log("📦 Stashed in window._bbs_cartdat");
    router.push({ name: "player", query: { cart: "bbs_cart" } });
  } catch (e) {
    console.error("Download failed:", e);
    Haptics.notification({ type: "error" });

    if (e.message.includes("404") || e.message.includes("Could not find")) {
      toast.showToast("Cartridge link not found on BBS page.", "error");
    } else {
      toast.showToast(`Download failed: ${e.message}`, "error");
    }
  } finally {
    downloadingId.value = null;
    loading.value = false;
  }
}
</script>

<style scoped>
/* transitions from Library.vue */
.staggered-fade-enter-active,
.staggered-fade-leave-active {
  transition: all 0.5s ease;
}
.staggered-fade-enter-from,
.staggered-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.staggered-fade-enter-active {
  transition-delay: calc(50ms * var(--index));
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
