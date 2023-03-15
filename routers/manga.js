const router = require("express").Router();
const cheerio = require("cheerio");
const util = require("util");
const replaceMangaPage = ["https://komiku.id/", "https://komiku.id/manga/"];
const replaceMangaPage2 = [
  "https://mangakita.net/",
  "https://mangakita.net/manga/",
];
const AxiosService = require("../helpers/axiosService");

//mangalist  -------Done------
router.get("/mangaku", async (req, res) => {
  let url = "https://mangaku.vip";

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $(".perapih");
      let manga_list = [];
      let title, type, updated_on, endpoint, thumb, chapter;

      element.find(".daftar > .bge").each((idx, el) => {
        title = $(el).find(".kan > a").find("h3").text().trim();
        endpoint = $(el)
          .find("a")
          .attr("href")
          .replace(replaceMangaPage[0], "");
        type = $(el).find(".bgei > a").find(".tpe1_inf > b").text();
        updated_on = $(el).find(".kan > span").text().split("• ")[1].trim();
        thumb = $(el).find(".bgei > a").find("img").attr("data-src");
        chapter = $(el)
          .find("div.kan > div:nth-child(5) > a > span:nth-child(2)")
          .text();
        manga_list.push({
          title,
          thumb,
          type,
          updated_on,
          endpoint,
          chapter,
        });
      });
      return res.status(200).json({
        status: true,
        message: "success",
        manga_list,
      });
    }
    return res.send({
      message: response.status,
      manga_list: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      manga_list: [],
    });
  }
});

router.get("/", async (req, res) => {
  let url = "https://mangakita.net/";

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $(".mainholder");
      let manga_list = [];
      let title,
        type,
        updated_on,
        endpoint,
        thumb,
        chapter,
        chapter_endpoint,
        chapter_number;

      element
        .find(".postbody > .bixbox > .listupd > .styletwo")
        .each((idx, el) => {
          title = $(el).find(".luf > a").find("h4").text().trim();
          endpoint = $(el)
            .find("a")
            .attr("href")
            .replace(replaceMangaPage2[1], "");
          type = $(el)
            .find(".imgu > a")
            .find("span")
            .attr("class")
            .replace("type ", "");
          thumb = $(el)
            .find(".imgu > a")
            .find("img")
            .attr("src")
            .replace("resize=100,145", "resize=300,385");
          updated_on = $(el).find(".luf > ul > li:first").find("span").text();
          chapter = $(el).find(".luf > ul > li:first").find("a").text();
          chapter_number = $(el)
            .find(".luf > ul > li:first")
            .find("a")
            .text()
            .replace("Chapter ", "");
          chapter_endpoint = $(el)
            .find(".luf > ul > li:first")
            .find("a")
            .attr("href")
            .replace(replaceMangaPage2[0], "");
          manga_list.push({
            title,
            thumb,
            type,
            updated_on,
            endpoint,
            chapter,
            chapter_endpoint,
            chapter_number,
          });
        });

      const next = element
        .find(".postbody > .bixbox > .listupd > .hpage a")
        .attr("href")
        .replace("https://mangakita.net/page/", "");
      return res.status(200).json({
        status: true,
        message: "success",
        next: next,
        prev: "",
        manga_list,
      });
    }
    return res.send({
      message: response.status,
      manga_list: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      manga_list: [],
    });
  }
});

router.get("/popular-title", async (req, res) => {
  let url = "https://mangakita.net/";

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $("#content");
      let manga_list = [];
      let title, type, rating, endpoint, thumb, chapter, chapter_endpoint;

      element
        .find("#wpop-items > .wpop-weekly > ul")
        .children()
        .each((idx, el) => {
          const manga = {
            title: $(el).find(".leftseries > h2").text().trim(),
            endpoint: $(el)
              .find(".leftseries > h2 > a")
              .attr("href")
              .replace(replaceMangaPage2[1], ""),
            // type : $(el).find(".imgu > a").find("span").attr("class").replace("type ", ""),
            thumb: $(el).find(".imgseries > a").find("img").attr("src"),
            rating: $(el).find(".leftseries .numscore").text(),
            // chapter : $(el).find(".luf > ul > li:first").find("a").text(),
            // chapter_endpoint : $(el).find(".luf > ul > li:first").find("a").attr("href"),
          };

          manga.genres = [];
          console.log($(el).find(".leftseries span a").length);
          $(el)
            .find(".leftseries span a")
            .each((i, data) => {
              const genres = {
                title: $(data).text(),
                url: $(data).attr("href"),
              };
              manga.genres.push(genres);
            });

          manga_list.push(manga);
        });

      manga_list.sort((a, b) => b.rating - a.rating);

      return res.status(200).json({
        status: true,
        message: "success",
        manga_list,
      });
    }
    return res.send({
      message: response.status,
      manga_list: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      manga_list: [],
    });
  }
});

//mangalist pagination  -------Done------
router.get("/page/:pagenumber", async (req, res) => {
  let pagenumber = req.params.pagenumber;
  let url =
    pagenumber === "1"
      ? "https://mangakita.net/"
      : `https://mangakita.net/page/${pagenumber}/`;

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $(".mainholder");
      let manga_list = [];
      let title, type, updated_on, endpoint, thumb, chapter, chapter_endpoint;

      element
        .find(".postbody > .bixbox > .listupd > .styletwo")
        .each((idx, el) => {
          if (pagenumber == 3) {
            let oldEndpoint = $(el)
              .find("a")
              .attr("href")
              .replace(replaceMangaPage2[1], "");
            let oldChapter = $(el)
              .find(".luf > ul > li:first")
              .find("a")
              .text()
              .replace(" ", "-");
            var new_chapter_endpoint =
              oldEndpoint.replace("/", "-") +
              oldChapter.replace(" [HD]", "").toLowerCase();
          } else {
            var new_chapter_endpoint = $(el)
              .find(".luf > ul > li:first")
              .find("a")
              .attr("href")
              .replace(replaceMangaPage2[0], "");
          }
          title = $(el).find(".luf > a").find("h4").text().trim();
          endpoint = $(el)
            .find("a")
            .attr("href")
            .replace(replaceMangaPage2[1], "");
          type = $(el)
            .find(".imgu > a")
            .find("span")
            .attr("class")
            .replace("type ", "");
          thumb = $(el).find(".imgu > a").find("img").attr("src");
          updated_on = $(el).find(".luf > ul > li:first").find("span").text();
          chapter = $(el).find(".luf > ul > li:first").find("a").text();
          chapter_endpoint = new_chapter_endpoint;
          manga_list.push({
            title,
            thumb,
            type,
            updated_on,
            endpoint,
            chapter,
            chapter_endpoint,
          });
        });
      const prev = element
        .find(".postbody > .bixbox > .listupd > .hpage a:first")
        .attr("href")
        .replace("https://mangakita.net/page/", "");
      const next = element
        .find(".postbody > .bixbox > .listupd > .hpage a:last")
        .attr("href")
        .replace("https://mangakita.net/page/", "");
      return res.status(200).json({
        status: true,
        message: "success",
        next: next,
        prev: prev,
        manga_list,
      });
    }
    return res.send({
      message: response.status,
      manga_list: [],
    });
  } catch (err) {
    res.send({
      status: false,
      message: err,
      manga_list: [],
    });
  }
});

// detail manga  ---- Done -----
router.get("/detail/:slug", async (req, res) => {
  const slug = req.params.slug;
  let endpoint;
  if (slug === "tokyo%e5%8d%8drevengers") {
    endpoint = "tokyo卍revengers/";
  } else {
    endpoint = slug;
  }

  try {
    const response = await AxiosService(
      replaceMangaPage2[0] + `manga/${endpoint}/`
    );
    const $ = cheerio.load(response.data);
    const element = $(".mainholder");
    let genre_list = [];
    let chapter = [];
    const obj = {};

    /* Get Title, Type, Author, Status */
    const elementData =
      "#content > .wrapper > .terebody > .postbody > .hentry >";
    obj.title = $(elementData + " .seriestucon > .seriestuheader > h1")
      .text()
      .trim();
    obj.second_title = $(
      elementData + " .seriestucon > .seriestuheader > .seriestualt"
    )
      .text()
      .trim();
    let textSynopsis = "";
    $(
      elementData +
        " .seriestucon > .seriestucontent > .seriestucontentr > .seriestuhead > .entry-content > p"
    ).each((i, el) => {
      textSynopsis += `<span class=mt-1>` + $(el).text() + `</span> <br>`;
    });
    obj.synopsis = textSynopsis;
    // obj.synopsis = $(elementData +" .seriestucon > .seriestucontent > .seriestucontentr > .seriestuhead > .entry-content > p:first").find("span").text();
    obj.rating = $(
      elementData +
        " .seriestucon > .seriestucontent > .seriestucontl .rating-prc .num"
    ).text();
    obj.followed = $(
      elementData + " .seriestucon > .seriestucontent > .seriestucontl .bmc"
    )
      .text()
      .replace("Followed by ", "")
      .replace(" people", "");
    obj.thumb = $(
      elementData +
        " .seriestucon > .seriestucontent > .seriestucontl > .thumb > img"
    ).attr("src");

    // Get Type
    obj.type = $(
      elementData +
        " .seriestucon > .seriestucontent > .seriestucontentr > .seriestucont > .seriestucontr > table > tbody td"
    )
      .filter(function () {
        return $.text([this]) == "Type";
      })
      .next()
      .text();

    // Get Author
    obj.author = $(
      elementData +
        " .seriestucon > .seriestucontent > .seriestucontentr > .seriestucont > .seriestucontr > table > tbody td"
    )
      .filter(function () {
        return $.text([this]) == "Author";
      })
      .next()
      .text();

    // Get Status
    obj.status = $(
      elementData +
        " .seriestucon > .seriestucontent > .seriestucontentr > .seriestucont > .seriestucontr > table > tbody td"
    )
      .filter(function () {
        return $.text([this]) == "Status";
      })
      .next()
      .text();

    // Get Released
    obj.released = $(
      elementData +
        " .seriestucon > .seriestucontent > .seriestucontentr > .seriestucont > .seriestucontr > table > tbody td"
    )
      .filter(function () {
        return $.text([this]) == "Released";
      })
      .next()
      .text();

    // Get Posted On
    obj.posted_on = $(
      elementData +
        " .seriestucon > .seriestucontent > .seriestucontentr > .seriestucont > .seriestucontr > table > tbody td"
    )
      .filter(function () {
        return $.text([this]) == "Posted On";
      })
      .next()
      .text()
      .trim();

    // Get Updated On
    obj.updated_on = $(
      elementData +
        " .seriestucon > .seriestucontent > .seriestucontentr > .seriestucont > .seriestucontr > table > tbody td"
    )
      .filter(function () {
        return $.text([this]) == "Updated On";
      })
      .next()
      .text()
      .trim();

    obj.manga_endpoint = slug;
    obj.first_chapter = "boku-no-hero-academia-chapter-1/";
    obj.last_chapter = $(
      elementData +
        " .seriestucon > .seriestucontent > .seriestucontentr > .seriestuhead > .lastend > div:nth-child(2)"
    )
      .find("a")
      .attr("href")
      .replace(replaceMangaPage2[0], "");
    // Get Genre List
    element.find(".seriestugenre > a").each((idx, el) => {
      let genre_name = $(el).text();
      genre_list.push({
        genre_name,
      });
    });

    obj.genre_list = genre_list || [];

    /* Get Chapter List */
    $("#chapterlist > ul")
      .find("li")
      .each((index, el) => {
        let chapter_title = $(el).find("span:first").text().trim();
        let chapter_date = $(el).find("span:last").text().trim();
        let chapter_endpoint = $(el).find("a").attr("href");
        if (chapter_endpoint !== undefined) {
          const rep = chapter_endpoint.replace(replaceMangaPage2[0], "");
          chapter.push({
            chapter_title,
            chapter_endpoint: rep,
            chapter_date,
          });
        }
        obj.chapter = chapter;
      });

    res.status(200).send(obj);
  } catch (error) {
    res.send({
      status: false,
      message: error,
    });
  }
});

//chapter detail ----done ----
router.get("/chapter/:endpoint", async (req, res) => {
  const url = "https://komikindo.pro/";
  const endpoint = req.params.endpoint;
  // res.send(endpoint)
  try {
    const response = await AxiosService(`${url}${endpoint}/`);
    // const response = await axios.get(`https://komikcast.id/${endpoint}`)
    const $ = cheerio.load(response.data);
    const content = $("#content");
    let chapter_image = [];
    const obj = {};
    obj.chapter_endpoint = endpoint + "/";
    obj.chapter_name = endpoint.split("-").join(" ").trim();

    obj.title = $("#content h1").text().trim();

    obj.next = false;
    obj.prev = "";
    if ($("#content .navig a:nth-child(4)").text()) {
      obj.next = $("#content .navig a:nth-child(4)")
        .attr("href")
        .replace("https://komikindo.pro/", "");
    }
    if ($("#content .navig a:nth-child(2)").text()) {
      obj.prev = $("#content .navig a:nth-child(1)")
        .attr("href")
        .replace("https://komikindo.pro/", "");
    }
    obj.chapter_list = $("#content .navig a:nth-child(2)")
      .attr("href")
      .replace("https://komikindo.pro/komik/", "");
    obj.download = $("#content .navig a:nth-child(3)")
      .attr("href")
      .replace("https://komikindo.pro/komik/", "");
    obj.image = $(".seriestucontent > .seriestucontl > .thumb")
      .find("img")
      .attr("src");

    const getPages = $("#chimg-auh img");

    obj.chapter_pages = getPages.length;
    getPages.each((i, el) => {
      chapter_image.push({
        chapter_image_link: $(el).attr("src").replace("i0.wp.com/", ""),
        image_number: i + 1,
      });
    });
    obj.chapter_image = chapter_image;
    res.json(obj);
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error,
      chapter_image: [],
    });
  }
});

// search manga ------- Done --------
router.get("/search/:query?", async (req, res) => {
  const query = req.params.query;
  const url = `https://mangakita.net/?s=${query}`;

  try {
    const response = await AxiosService(url);
    const $ = cheerio.load(response.data);
    const element = $("#content");

    let thumb, title, endpoint, type, upload_on;
    let data_list = [];
    let prev = "";
    let next = "";
    console.log(element.find(".listupd").children().length);
    if (
      element.find(".listupd").children().length > 0 &&
      element.find(".listupd h3").text() != "Not Found"
    ) {
      element
        .find(".listupd")
        .children()
        .each((idx, el) => {
          title = $(el).find("div.bsx > a").attr("title").trim();
          endpoint = $(el)
            .find("a")
            .attr("href")
            .replace(replaceMangaPage2[1], "");
          type = $(el)
            .find("div.bsx > a > .limit > span")
            .attr("class")
            .replace("type ", "");
          thumb = $(el).find("div.bsx > a > .limit > img").attr("src");
          rating = $(el).find("div.bsx > a > .bigor .numscore").text();
          chapter = $(el).find("div.bsx > a > .bigor .epxs").text();
          data_list.push({
            title,
            chapter,
            rating,
            type,
            thumb,
            endpoint,
          });
        });

      if (element.find(".hpage .l").text() != "") {
        let replacePrevUrl = element
          .find(".hpage .l")
          .attr("href")
          .replace("&status=completed&type=&order=", "");
        prev = replacePrevUrl.replace("?page=", "");
      }
      if (element.find(".hpage .l").text() != "") {
        let replaceNextUrl = element
          .find(".hpage .r")
          .attr("href")
          .replace("&status=completed&type=&order=", "");
        next = replaceNextUrl.replace("?page=", "");
      }
    }

    res.json({
      status: true,
      message: "success",
      data_list,
      prev,
      next,
    });
  } catch (error) {
    res.send({
      status: false,
      message: error.message,
    });
  }
});

// search manga ------Not Yet-----------
router.get("/old-search/:query", async (req, res) => {
  const query = req.params.query;
  const url = `https://data.komiku.id/cari/?post_type=manga&s=${query}`;

  try {
    const response = await AxiosService(url);
    const $ = cheerio.load(response.data);
    const element = $(".daftar");
    let manga_list = [];
    let title, thumb, type, endpoint, updated_on;
    element.find(".bge").each((idx, el) => {
      endpoint = $(el)
        .find("a")
        .attr("href")
        .replace(replaceMangaPage[1], "")
        .replace("/manga/", "");
      thumb = $(el).find("div.bgei > a > img").attr("data-src");
      type = $(el).find("div.bgei > a > div.tpe1_inf > b").text();
      title = $(el).find(".kan").find("h3").text().trim();
      updated_on = $(el).find("div.kan > p").text().split(".")[0].trim();
      manga_list.push({
        title,
        thumb,
        type,
        endpoint,
        updated_on,
      });
    });
    res.json({
      status: true,
      message: "success",
      manga_list,
    });
  } catch (error) {
    res.send({
      status: false,
      message: error.message,
    });
  }
});

//genreList  -----Done-----
router.get("/genres", async (req, res) => {
  try {
    const response = await AxiosService(replaceMangaPage2[0]);

    const $ = cheerio.load(response.data);
    console.log($("ul.genre").children().length);
    let list_genre = [];
    let obj = {};
    $("ul.genre")
      .children()
      .each((idx, el) => {
        const endpoint = $(el)
          .find("a")
          .attr("href")
          .replace(replaceMangaPage2[0] + "genres/", "");
        list_genre.push({
          genre_name: $(el).text(),
          endpoint,
        });
      });
    obj.status = true;
    obj.message = "success";
    obj.list_genre = list_genre;
    res.json(obj);
  } catch (error) {
    res.send({
      status: false,
      message: error,
    });
  }
});

//genreDetail ----Done-----
router.get("/genre/:slug/:pagenumber?", async (req, res) => {
  const slug = req.params.slug;

  const pagenumber = req.params.pagenumber;
  const url = pagenumber
    ? `https://mangakita.net/genres/${slug}/page/${pagenumber}`
    : `https://mangakita.net/genres/${slug}`;

  try {
    const response = await AxiosService(url);
    const $ = cheerio.load(response.data);
    const element = $("#content");
    let thumb, title, chapter, rating, endpoint, type;
    let manga_list = [];
    let replacePage = element
      .find(".pagination .next")
      .prev()
      .attr("href")
      .replace("https://mangakita.net/genres/comedy/page/", "")
      .replace("/", "");
    let count_data = element.find(".listupd").children().length * replacePage;

    element
      .find(".listupd")
      .children()
      .each((idx, el) => {
        title = $(el).find("div.bsx > a").attr("title").trim();
        endpoint = $(el)
          .find("a")
          .attr("href")
          .replace(replaceMangaPage2[1], "");
        type = $(el)
          .find("div.bsx > a > .limit > span")
          .attr("class")
          .replace("type ", "");
        thumb = $(el).find("div.bsx > a > .limit > img").attr("src");
        rating = $(el).find("div.bsx > a > .bigor .numscore").text();
        chapter = $(el).find("div.bsx > a > .bigor .epxs").text();
        manga_list.push({
          title,
          chapter,
          rating,
          type,
          thumb,
          endpoint,
        });
      });

    res.json({
      status: true,
      message: "success",
      genre_title: $(".releases h1").text(),
      count_data,
      manga_list,
    });
  } catch (error) {
    res.send({
      status: false,
      message: error,
      manga_list: [],
    });
  }
});

// manga popular pagination ----- Done ------
router.get("/popular/:pagenumber?", async (req, res) => {
  const pagenumber = req.params.pagenumber;
  const url = pagenumber
    ? `https://mangakita.net/manga/?page=${pagenumber}&status=&type=&order=popular`
    : `https://mangakita.net/manga/?status=&type=&order=popular`;

  try {
    const response = await AxiosService(url);
    const $ = cheerio.load(response.data);
    const element = $("#content");

    let thumb, title, endpoint, type, upload_on;
    let manga_list = [];

    element
      .find(".listupd")
      .children()
      .each((idx, el) => {
        title = $(el).find("div.bsx > a").attr("title").trim();
        endpoint = $(el)
          .find("a")
          .attr("href")
          .replace(replaceMangaPage2[1], "");
        type = $(el)
          .find("div.bsx > a > .limit > span")
          .attr("class")
          .replace("type ", "");
        thumb = $(el).find("div.bsx > a > .limit > img").attr("src");
        rating = $(el).find("div.bsx > a > .bigor .numscore").text();
        chapter = $(el).find("div.bsx > a > .bigor .epxs").text();
        manga_list.push({
          title,
          chapter,
          rating,
          type,
          thumb,
          endpoint,
        });
      });

    let prev = "";
    if (element.find(".hpage .l").text() != "") {
      let replacePrevUrl = element
        .find(".hpage .l")
        .attr("href")
        .replace("&status=&type=&order=popular", "");
      prev = replacePrevUrl.replace("?page=", "");
    }
    let replaceNextUrl = element
      .find(".hpage .r")
      .attr("href")
      .replace("&status=&type=&order=popular", "");
    let next = replaceNextUrl.replace("?page=", "");

    res.json({
      status: true,
      message: "success",
      manga_list,
      prev,
      next,
    });
  } catch (error) {
    res.send({
      status: false,
      message: error,
      manga_list: [],
    });
  }
});

// manga popular pagination ----- Done ------
router.get("/old-popular/:pagenumber", async (req, res) => {
  const pagenumber = req.params.pagenumber;
  const url =
    pagenumber === "1"
      ? `other/rekomendasi/`
      : `other/rekomendasi/page/${pagenumber}/`;

  try {
    const response = await AxiosService(replaceMangaPage[0] + url);
    const $ = cheerio.load(response.data);
    const element = $(".daftar");
    let thumb, title, endpoint, type, upload_on;
    let manga_list = [];
    element.find(".bge").each((idx, el) => {
      title = $(el).find(".kan").find("h3").text().trim();
      endpoint = $(el)
        .find("a")
        .attr("href")
        .replace(replaceMangaPage[1], "")
        .replace("/manga/", "");
      type = $(el).find("div.bgei > a > div.tpe1_inf > b").text();
      thumb = $(el).find("div.bgei > a > img").attr("data-src");
      upload_on = $(el).find("div.kan > p").text().split(".")[0].trim();
      manga_list.push({
        title,
        type,
        thumb,
        endpoint,
        upload_on,
      });
    });
    res.json({
      status: true,
      message: "success",
      manga_list,
    });
  } catch (error) {
    res.send({
      status: false,
      message: error,
      manga_list: [],
    });
  }
});

// Latest --- Done ---
router.get("/latest/:pagenumber?", async (req, res) => {
  let pagenumber = req.params.pagenumber;

  const url = pagenumber
    ? `https://mangakita.net/manga/?page=${2}&status=&type=&order=latest`
    : `https://mangakita.net/manga/?status=&type=&order=latest`;

  try {
    const response = await AxiosService(url);
    const $ = cheerio.load(response.data);
    const element = $("#content");

    let thumb, title, endpoint, type, upload_on;
    let manga_list = [];

    element
      .find(".listupd")
      .children()
      .each((idx, el) => {
        title = $(el).find("div.bsx > a").attr("title").trim();
        endpoint = $(el)
          .find("a")
          .attr("href")
          .replace(replaceMangaPage2[1], "");
        type = $(el)
          .find("div.bsx > a > .limit > span")
          .attr("class")
          .replace("type ", "");
        thumb = $(el).find("div.bsx > a > .limit > img").attr("src");
        rating = $(el).find("div.bsx > a > .bigor .numscore").text();
        chapter = $(el).find("div.bsx > a > .bigor .epxs").text();
        manga_list.push({
          title,
          chapter,
          rating,
          type,
          thumb,
          endpoint,
        });
      });

    let prev = "";
    if (element.find(".hpage .l").text() != "") {
      let replacePrevUrl = element
        .find(".hpage .l")
        .attr("href")
        .replace("&status=&type=&order=latest", "");
      prev = replacePrevUrl.replace("?page=", "");
    }
    let replaceNextUrl = element
      .find(".hpage .r")
      .attr("href")
      .replace("&status=&type=&order=latest", "");
    let next = replaceNextUrl.replace("?page=", "");

    res.json({
      status: true,
      message: "success",
      manga_list,
      prev,
      next,
    });
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
});

// updated --- Done ---
router.get("/updated/:pagenumber?", async (req, res) => {
  let pagenumber = req.params.pagenumber;

  const url = pagenumber
    ? `https://mangakita.net/manga/?page=${2}&status=&type=&order=update`
    : `https://mangakita.net/manga/?status=&type=&order=update`;

  try {
    const response = await AxiosService(url);
    const $ = cheerio.load(response.data);
    const element = $("#content");

    let thumb, title, endpoint, type, upload_on;
    let manga_list = [];

    element
      .find(".listupd")
      .children()
      .each((idx, el) => {
        title = $(el).find("div.bsx > a").attr("title").trim();
        endpoint = $(el)
          .find("a")
          .attr("href")
          .replace(replaceMangaPage2[1], "");
        type = $(el)
          .find("div.bsx > a > .limit > span")
          .attr("class")
          .replace("type ", "");
        thumb = $(el).find("div.bsx > a > .limit > img").attr("src");
        rating = $(el).find("div.bsx > a > .bigor .numscore").text();
        chapter = $(el).find("div.bsx > a > .bigor .epxs").text();
        manga_list.push({
          title,
          chapter,
          rating,
          type,
          thumb,
          endpoint,
        });
      });

    let prev = "";
    if (element.find(".hpage .l").text() != "") {
      let replacePrevUrl = element
        .find(".hpage .l")
        .attr("href")
        .replace("&status=&type=&order=update", "");
      prev = replacePrevUrl.replace("?page=", "");
    }
    let replaceNextUrl = element
      .find(".hpage .r")
      .attr("href")
      .replace("&status=&type=&order=update", "");
    let next = replaceNextUrl.replace("?page=", "");

    res.json({
      status: true,
      message: "success",
      manga_list,
      prev,
      next,
    });
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
});

//Ongoing --- Done ---
router.get("/ongoing/:pagenumber?", async (req, res) => {
  let pagenumber = req.params.pagenumber;

  const url = pagenumber
    ? `https://mangakita.net/manga/?page=${2}&status=ongoing&type=&order=`
    : `https://mangakita.net/manga/?status=ongoing&type=&order=`;

  try {
    const response = await AxiosService(url);
    const $ = cheerio.load(response.data);
    const element = $("#content");

    let thumb, title, endpoint, type, upload_on;
    let manga_list = [];

    element
      .find(".listupd")
      .children()
      .each((idx, el) => {
        title = $(el).find("div.bsx > a").attr("title").trim();
        endpoint = $(el)
          .find("a")
          .attr("href")
          .replace(replaceMangaPage2[1], "");
        type = $(el)
          .find("div.bsx > a > .limit > span")
          .attr("class")
          .replace("type ", "");
        thumb = $(el).find("div.bsx > a > .limit > img").attr("src");
        rating = $(el).find("div.bsx > a > .bigor .numscore").text();
        chapter = $(el).find("div.bsx > a > .bigor .epxs").text();
        manga_list.push({
          title,
          chapter,
          rating,
          type,
          thumb,
          endpoint,
        });
      });

    let prev = "";
    if (element.find(".hpage .l").text() != "") {
      let replacePrevUrl = element
        .find(".hpage .l")
        .attr("href")
        .replace("&status=ongoing&type=&order=", "");
      prev = replacePrevUrl.replace("?page=", "");
    }
    let replaceNextUrl = element
      .find(".hpage .r")
      .attr("href")
      .replace("&status=ongoing&type=&order=", "");
    let next = replaceNextUrl.replace("?page=", "");

    res.json({
      status: true,
      message: "success",
      manga_list,
      prev,
      next,
    });
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
});

//Completed --- Done ---
router.get("/completed/:pagenumber?", async (req, res) => {
  let pagenumber = req.params.pagenumber;

  const url = pagenumber
    ? `https://mangakita.net/manga/?page=${pagenumber}&status=completed&type=&order=`
    : `https://mangakita.net/manga/?status=completed&type=&order=`;

  try {
    const response = await AxiosService(url);
    const $ = cheerio.load(response.data);
    const element = $("#content");

    let thumb, title, endpoint, type, upload_on;
    let manga_list = [];

    element
      .find(".listupd")
      .children()
      .each((idx, el) => {
        title = $(el).find("div.bsx > a").attr("title").trim();
        endpoint = $(el)
          .find("a")
          .attr("href")
          .replace(replaceMangaPage2[1], "");
        type = $(el)
          .find("div.bsx > a > .limit > span")
          .attr("class")
          .replace("type ", "");
        thumb = $(el).find("div.bsx > a > .limit > img").attr("src");
        rating = $(el).find("div.bsx > a > .bigor .numscore").text();
        chapter = $(el).find("div.bsx > a > .bigor .epxs").text();
        manga_list.push({
          title,
          chapter,
          rating,
          type,
          thumb,
          endpoint,
        });
      });

    let prev = "";
    if (element.find(".hpage .l").text() != "") {
      let replacePrevUrl = element
        .find(".hpage .l")
        .attr("href")
        .replace("&status=completed&type=&order=", "");
      prev = replacePrevUrl.replace("?page=", "");
    }
    let replaceNextUrl = element
      .find(".hpage .r")
      .attr("href")
      .replace("&status=completed&type=&order=", "");
    let next = replaceNextUrl.replace("?page=", "");

    res.json({
      status: true,
      message: "success",
      manga_list,
      prev,
      next,
    });
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
});

//hiatus --- Done ---
router.get("/hiatus/:pagenumber?", async (req, res) => {
  let pagenumber = req.params.pagenumber;

  const url = pagenumber
    ? `https://mangakita.net/manga/?page=${pagenumber}&status=completed&type=&order=`
    : `https://mangakita.net/manga/?status=hiatus&type=&order=`;

  try {
    const response = await AxiosService(url);
    const $ = cheerio.load(response.data);
    const element = $("#content");

    let thumb, title, endpoint, type, upload_on;
    let manga_list = [];
    let prev = "";
    let next = "";

    if (element.find(".listupd").children().length > 0) {
      element
        .find(".listupd")
        .children()
        .each((idx, el) => {
          title = $(el).find("div.bsx > a").attr("title").trim();
          endpoint = $(el)
            .find("a")
            .attr("href")
            .replace(replaceMangaPage2[1], "");
          type = $(el)
            .find("div.bsx > a > .limit > span")
            .attr("class")
            .replace("type ", "");
          thumb = $(el).find("div.bsx > a > .limit > img").attr("src");
          rating = $(el).find("div.bsx > a > .bigor .numscore").text();
          chapter = $(el).find("div.bsx > a > .bigor .epxs").text();
          manga_list.push({
            title,
            chapter,
            rating,
            type,
            thumb,
            endpoint,
          });
        });

      if (element.find(".hpage .l").text() != "") {
        let replacePrevUrl = element
          .find(".hpage .l")
          .attr("href")
          .replace("&status=completed&type=&order=", "");
        prev = replacePrevUrl.replace("?page=", "");
      }
      let replaceNextUrl = element
        .find(".hpage .r")
        .attr("href")
        .replace("&status=completed&type=&order=", "");
      next = replaceNextUrl.replace("?page=", "");
    }

    res.json({
      status: true,
      message: "success",
      manga_list,
      prev,
      next,
    });
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
});

//manhua  ------ Done ------
router.get("/manhua/:pagenumber?", async (req, res) => {
  let pagenumber = req.params.pagenumber;

  const url = pagenumber
    ? `https://mangakita.net/manga/?page=${2}&status=&type=manhua&order=`
    : `https://mangakita.net/manga/?status=&type=manhua&order=`;

  try {
    const response = await AxiosService(url);
    const $ = cheerio.load(response.data);
    const element = $("#content");

    let thumb, title, endpoint, type, upload_on;
    let manga_list = [];
    let prev = "";
    let next = "";

    if (element.find(".listupd").children().length > 0) {
      element
        .find(".listupd")
        .children()
        .each((idx, el) => {
          title = $(el).find("div.bsx > a").attr("title").trim();
          endpoint = $(el)
            .find("a")
            .attr("href")
            .replace(replaceMangaPage2[1], "");
          type = $(el)
            .find("div.bsx > a > .limit > span")
            .attr("class")
            .replace("type ", "");
          thumb = $(el).find("div.bsx > a > .limit > img").attr("src");
          rating = $(el).find("div.bsx > a > .bigor .numscore").text();
          chapter = $(el).find("div.bsx > a > .bigor .epxs").text();
          manga_list.push({
            title,
            chapter,
            rating,
            type,
            thumb,
            endpoint,
          });
        });

      if (element.find(".hpage .l").text() != "") {
        let replacePrevUrl = element
          .find(".hpage .l")
          .attr("href")
          .replace("&status=&type=manhua&order=", "");
        prev = replacePrevUrl.replace("?page=", "");
      }
      let replaceNextUrl = element
        .find(".hpage .r")
        .attr("href")
        .replace("&status=&type=manhua&order=", "");
      next = replaceNextUrl.replace("?page=", "");
    }

    res.json({
      status: true,
      message: "success",
      manga_list,
      prev,
      next,
    });
  } catch (error) {
    res.send({
      status: false,
      message: error,
      manga_list: [],
    });
  }
});

//manhwa ------ Done ------
router.get("/manhwa/:pagenumber?", async (req, res) => {
  let pagenumber = req.params.pagenumber;

  const url = pagenumber
    ? `https://mangakita.net/manga/?page=${pagenumber}&type=manhwa`
    : `https://mangakita.net/manga/?type=manhwa`;

  try {
    const response = await AxiosService(url);
    const $ = cheerio.load(response.data);
    const element = $("#content");

    let thumb, title, endpoint, type, upload_on;
    let manga_list = [];
    let prev = "";
    let next = "";

    if (element.find(".listupd").children().length > 0) {
      element
        .find(".listupd")
        .children()
        .each((idx, el) => {
          title = $(el).find("div.bsx > a").attr("title").trim();
          endpoint = $(el)
            .find("a")
            .attr("href")
            .replace(replaceMangaPage2[1], "");
          type = $(el)
            .find("div.bsx > a > .limit > span")
            .attr("class")
            .replace("type ", "");
          thumb = $(el).find("div.bsx > a > .limit > img").attr("src");
          rating = $(el).find("div.bsx > a > .bigor .numscore").text();
          chapter = $(el).find("div.bsx > a > .bigor .epxs").text();
          manga_list.push({
            title,
            chapter,
            rating,
            type,
            thumb,
            endpoint,
          });
        });

      if (element.find(".hpage .l").text() != "") {
        let replacePrevUrl = element
          .find(".hpage .l")
          .attr("href")
          .replace("&type=manhwa", "");
        prev = replacePrevUrl.replace("?page=", "");
      }
      let replaceNextUrl = element
        .find(".hpage .r")
        .attr("href")
        .replace("&type=manhwa", "");
      next = replaceNextUrl.replace("?page=", "");
    }

    res.json({
      status: true,
      message: "success",
      manga_list,
      prev,
      next,
    });
  } catch (error) {
    res.send({
      status: false,
      message: error,
      manga_list: [],
    });
  }
});

//Manga ------ Done ------
router.get("/manga/:pagenumber?", async (req, res) => {
  let pagenumber = req.params.pagenumber;

  const url = pagenumber
    ? `https://mangakita.net/manga/?page=${2}&status=&type=manga&order=`
    : `https://mangakita.net/manga/?status=&type=manga&order=`;

  try {
    const response = await AxiosService(url);
    const $ = cheerio.load(response.data);
    const element = $("#content");

    let thumb, title, endpoint, type, upload_on;
    let manga_list = [];

    element
      .find(".listupd")
      .children()
      .each((idx, el) => {
        title = $(el).find("div.bsx > a").attr("title").trim();
        endpoint = $(el)
          .find("a")
          .attr("href")
          .replace(replaceMangaPage2[1], "");
        type = $(el)
          .find("div.bsx > a > .limit > span")
          .attr("class")
          .replace("type ", "");
        thumb = $(el).find("div.bsx > a > .limit > img").attr("src");
        rating = $(el).find("div.bsx > a > .bigor .numscore").text();
        chapter = $(el).find("div.bsx > a > .bigor .epxs").text();
        manga_list.push({
          title,
          chapter,
          rating,
          type,
          thumb,
          endpoint,
        });
      });

    let prev = "";
    if (element.find(".hpage .l").text() != "") {
      let replacePrevUrl = element
        .find(".hpage .l")
        .attr("href")
        .replace("&status=&type=manga&order=", "");
      prev = replacePrevUrl.replace("?page=", "");
    }
    let replaceNextUrl = element
      .find(".hpage .r")
      .attr("href")
      .replace("&status=&type=manga&order=", "");
    let next = replaceNextUrl.replace("?page=", "");

    res.json({
      status: true,
      message: "success",
      manga_list,
      prev,
      next,
    });
  } catch (error) {
    res.send({
      status: false,
      message: error,
      manga_list: [],
    });
  }
});

module.exports = router;
