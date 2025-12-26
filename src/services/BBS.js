import { Capacitor } from "@capacitor/core";
import { PicoWebScraperWeb } from "./PicoWebScraperWeb";

// # use web implementation
const webScraper = new PicoWebScraperWeb();

const isWeb = Capacitor.getPlatform() === "web";

export class BBS {
  /**
   * fetch featured games from the BBS
   * @returns {Promise<Array<{id: string, title: string, author: string, thumb_url: string, download_url: string}>>}
   */
  static async getFeatured(page = 1) {
    try {
      // force web scraper on all platforms
      const { games } = await webScraper.fetchFeaturedGames(page);
      return games;
    } catch (e) {
      console.error("[BBS] fetchFeatured failed:", e);
      return [];
    }
  }

  /**
   * fetch new games from the BBS
   * @returns {Promise<Array<any>>}
   */
  static async getNew(page = 1) {
    try {
      // force web scraper on all platforms
      const { games } = await webScraper.fetchNewGames(page);
      return games;
    } catch (e) {
      console.error("[BBS] fetchNew failed:", e);
      return [];
    }
  }

  static async getRandom() {
    try {
      const { games } = await webScraper.fetchRandomGame();
      return games; // returns an array, usually we just want one? loop logic in UI.
    } catch (e) {
      console.error("[BBS] getRandom failed:", e);
      return [];
    }
  }

  /**
   * Search for games
   * @param {string} query
   * @returns {Promise<Array<any>>}
   */
  static async search(query) {
    try {
      // force web scraper on all platforms
      const { games } = await webScraper.searchGames({ query });
      return games;
    } catch (e) {
      console.error("[BBS] search failed:", e);
      return [];
    }
  }
}
