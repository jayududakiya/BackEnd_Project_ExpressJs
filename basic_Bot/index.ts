const puppeteer = require("puppeteer");
import type { MovieDataType } from "./types/moviesData";

const getAllMoviesNames = async (city: string) => {
  try {
    if (!city || city === "") {
      throw new Error("Cannot find city");
      return;
    }
    const browser = await puppeteer.launch({
      headless: false, // Set to false for visual debugging
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Flags for smoother execution
    });
    const url = `https://in.bookmyshow.com/explore/movies-${city}`;
    // const urlParams =
    //   "languages=hindi|english|gujarati|korean|malayalam|multi-language&genres=drama|action|thriller|adventure|animation|comedy|crime|family|musical|documentary|fantasy|historical|period|romantic|sci-fi&format=2D|3D|4DX|IMAX-3D|4DX-3D|IMAX-2D";

    console.log("➡ ~ getAllMoviesNames ~ url:", url);
    const page = await browser.newPage();
    console.log("Setting headers and user-agent...");
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });
    await page.goto(url, { waitUntil: "networkidle2" });

    const moviesData = await page.evaluate(() => {
      const movieElements = document.querySelectorAll("a.sc-133848s-11"); // Selector for movie cards
      const movies: MovieDataType[] = [];

      const regex = /\/(ET\d+)/;
      movieElements.forEach((movie) => {
        const nameElement = movie.querySelector(
          ".sc-7o7nez-0.hGuczM"
        ) as HTMLElement; // Movie name
        const ratingElement = movie.querySelectorAll(
          ".sc-7o7nez-0.ifFqly"
        )[0] as HTMLElement;
        const languagesElement = movie.querySelectorAll(
          ".sc-7o7nez-0.ifFqly"
        )[1] as HTMLElement;
        const hrefElement = movie.getAttribute("href"); // Movie URL
        const match = hrefElement?.match(regex);

        movies.push({
          name: nameElement ? nameElement?.innerText?.trim() : "",
          href: hrefElement ? hrefElement : url,
          rating: ratingElement ? ratingElement?.innerText?.trim() : "",
          languages: languagesElement
            ? languagesElement?.innerText.trim().split(",")
            : [],
          id: match && match[1] ? match[1] : null,
        });
      });

      return movies.filter((movie) => movie.name !== "" || movie.id !== null);
    });

    await browser.close();
    console.log("Browser closed.");
    return moviesData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error creating internal server Error", error.message);
      return;
    }
  }
};

const autoRedirectFuc = async (searchMovie: MovieDataType) => {
  try {
    console.log("Starting the browser...");
    const { href, name, id } = searchMovie;
    const browser = await puppeteer.launch({
      headless: false, // Set to false for visual debugging
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Flags for smoother execution
    });
    const page = await browser.newPage();

    console.log("Setting headers and user-agent...");
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });

    // URL to navigate
    console.log(`Navigating to ${href}...`);

    // Debugging reDirections
    // page.on("response", (response) => {
    //   console.log(
    //     `Response - Status: ${response.status()}, URL: ${response.url()}`
    //   );
    // });

    await page.goto(href, { waitUntil: "networkidle2" });

    // Accept cookies if prompted
    console.log("Checking for cookie banners...");
    try {
      const cookieButtonSelector = "button[class*='accept']"; // Update the selector if needed
      await page.waitForSelector(cookieButtonSelector, { timeout: 5000 });
      await page.click(cookieButtonSelector);
      console.log("Cookie banner accepted.");
    } catch {
      console.log("No cookie banner found.");
    }

    // Take a screenshot
    const screenshotPath = `screenshot_${name}_${id}.png`;
    console.log("Taking a screenshot...");
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved at ${screenshotPath}`);

    // Close the browser
    await browser.close();
    console.log("Browser closed.");
  } catch (error: any) {
    if (error instanceof Error) {
      console.log("Error creating internal server Error", error.message);
      return;
    }
  }
};

const createUrl = async ({
  movieName,
  cityName,
}: {
  movieName: string;
  cityName: string;
}) => {
  try {
    if (movieName === "" || cityName === "") {
      throw new Error("Invalid url string passed to movie query");
      return;
    }
    const allMovies = await getAllMoviesNames(cityName?.toLowerCase());
    if (allMovies.length === 0 && !allMovies) return;
    const findMovie = await allMovies.find((movie: MovieDataType) => {
      return (
        movie.name.toLowerCase().includes(movieName.toLowerCase().trim()) &&
        movie.href.includes(cityName?.toLowerCase().trim())
      );
    });
    console.log("➡ ~ createUrl ~ allMovies:", allMovies);
    return findMovie;
  } catch (error: unknown) {
    // Type Guard to check if the error is an instance of Error
    if (error instanceof Error) {
      // Now TypeScript knows that 'error' is of type 'Error'
      console.log(`Error occurred creating url: ${error.message}`);
      return;
    } else {
      // Fallback if the error is not an instance of Error
      console.log("An unknown error occurred.");
      return;
    }
  }
};

(async () => {
  try {
    const queryObject = { movieName: "khadaan", cityName: "kolkata" };
    const searchMovie = await createUrl(queryObject);
    console.log("➡ ~ searchMovie:", searchMovie);
    await autoRedirectFuc(searchMovie);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error creating internal server Error", error.message);
      return;
    }
  }
})();
