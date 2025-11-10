import axios from "axios";

/**
 * Fetch full player info from Wikipedia API
 * Example: /api/cricket/players/ms-dhoni
 */
// import axios from "axios";

export const getPlayerInfo = async (req, res) => {
  try {
    const { slug } = req.params;
    const title = slug.replace(/-/g, " "); // ms-dhoni -> ms dhoni

    const response = await axios.get("https://en.wikipedia.org/w/api.php", {
      params: {
        action: "query",
        format: "json",
        prop: "extracts|pageimages|info",
        inprop: "url",
        titles: title,
        exintro: true,
        explaintext: true,
        redirects: 1,
        pithumbsize: 600,
      },
      headers: {
        // 👇 Required for Wikipedia
        "User-Agent": "CricketApp/1.0 (https://yourapp.example.com; contact@yourapp.example.com)",
        "Accept": "application/json",
      },
    });

    const pages = response.data.query.pages;
    const page = Object.values(pages)[0];

    if (!page || page.missing) {
      return res.status(404).json({ success: false, message: "Player not found" });
    }

    return res.json({
      success: true,
      player: {
        title: page.title,
        description: page.extract,
        image: page.thumbnail?.source || null,
        pageUrl: page.fullurl,
      },
    });
  } catch (error) {
    console.error("Wikipedia Player API Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch player info" });
  }
};


/**
 * Search players or teams by name using Wikipedia search API
 * Example: /api/cricket/players/search/sachin
 */
export const searchPlayers = async (req, res) => {
  try {
    const { query } = req.params;
    const response = await axios.get(
      `https://en.wikipedia.org/w/api.php`, {
        params: {
          action: "query",
          list: "search",
          srsearch: query,
          format: "json",
          srlimit: 5
        }
      }
    );

    return res.json({
      success: true,
      results: response.data.query.search.map(item => ({
        title: item.title,
        snippet: item.snippet,
        pageid: item.pageid
      }))
    });
  } catch (error) {
    console.error("Wikipedia Search Error:", error);
    res.status(500).json({ success: false, message: "Failed to search players" });
  }
};

/**
 * Fetch tournament or match info (Wikipedia page)
 * Example: /api/cricket/tournaments/icc-cricket-world-cup
 */
export const getTournamentInfo = async (req, res) => {
  try {
    const { name } = req.params;
    const title = name.replace(/-/g, " ");

    const response = await axios.get(
      `https://en.wikipedia.org/w/api.php`, {
        params: {
          action: "query",
          format: "json",
          prop: "extracts|pageimages|info",
          inprop: "url",
          titles: title,
          exintro: false,
          explaintext: true,
          redirects: 1,
          pithumbsize: 800
        }
      }
    );

    const pages = response.data.query.pages;
    const page = Object.values(pages)[0];

    if (!page || page.missing) {
      return res.status(404).json({ success: false, message: "Tournament not found" });
    }

    return res.json({
      success: true,
      tournament: {
        title: page.title,
        description: page.extract,
        image: page.thumbnail?.source || null,
        pageUrl: page.fullurl
      }
    });
  } catch (error) {
    console.error("Wikipedia Tournament API Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch tournament info" });
  }
};
