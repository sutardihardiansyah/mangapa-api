const router = require("express").Router();
const cheerio = require("cheerio");
const util = require("util");
const replaceMangaPage = ["https://komiku.id/", "https://komiku.id/manga/"];
const replaceMangaPage2 = ["https://mangakita.net/", "https://mangakita.net/manga/"];
const AxiosService = require("../helpers/axiosService");

//mangalist  -------Done------
router.get("/", async (req, res) => {
  let url = "https://data.komiku.id/pustaka/";

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $(".perapih");
      let manga_list = [];
      let title, type, updated_on, endpoint, thumb, chapter;

      element.find(".daftar > .bge").each((idx, el) => {
        title = $(el).find(".kan > a").find("h3").text().trim();
        endpoint = $(el).find("a").attr("href").replace(replaceMangaPage[0], "");
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

router.get("/list-manga", async (req, res) => {
  let url = "https://mangakita.net/";

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $(".mainholder");
      let manga_list = [];
      let title, type, updated_on, endpoint, thumb, chapter;

      element.find(".postbody > .bixbox > .listupd > .styletwo").each((idx, el) => {
        console.log(el)
        title = $(el).find(".luf > a").find("h4").text().trim();
        endpoint = $(el).find("a").attr("href").replace(replaceMangaPage2[1], "");
        // type = $(el).find(".bgei > a").find(".tpe1_inf > b").text();
        // updated_on = $(el).find(".kan > span").text().split("• ")[1].trim();
        thumb = $(el).find(".imgu > a").find("img").attr("src");
        // chapter = $(el)
        //   .find("div.kan > div:nth-child(5) > a > span:nth-child(2)")
        //   .text();
        manga_list.push({
          title,
          thumb,
          // type,
          // updated_on,
          endpoint,
          // chapter,
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

//mangalist pagination  -------Done------
router.get("/page/:pagenumber", async (req, res) => {
  let pagenumber = req.params.pagenumber;
  let url =
    pagenumber === "1"
      ? "https://data.komiku.id/pustaka/"
      : `https://data.komiku.id/pustaka/page/${pagenumber}/`;

  try {
    const response = await AxiosService(url);
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const element = $(".perapih");
      let manga_list = [];
      let title, type, updated_on, endpoint, thumb, chapter;

      element.find(".daftar > .bge").each((idx, el) => {
        title = $(el).find(".kan > a").find("h3").text().trim();
        endpoint = $(el).find("a").attr("href").replace(replaceMangaPage[1], "");
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

// detail manga  ---- Done -----
router.get("/detail/:id", async (req, res) => {
  const id = req.params.id;
  let endpoint;

  if (id === "tokyo%e5%8d%8drevengers") {
    endpoint = "tokyo卍revengers/";
  } else {
    endpoint = id;
  }
  try {
    const response = await AxiosService(replaceMangaPage[0] + `manga/${endpoint}/`);
    const $ = cheerio.load(response.data);
    const element = $(".perapih");
    let genre_list = [];
    let chapter = [];
    const obj = {};

    /* Get Title, Type, Author, Status */
    const getMeta = element.find(".inftable > tbody").first();
    obj.title = $("#Judul > h1").text().trim();
    obj.type = $("tr:nth-child(2) > td:nth-child(2)").find("b").text();
    obj.author = $(
      "#Informasi > table > tbody > tr:nth-child(4) > td:nth-child(2)"
    )
      .text()
      .trim();
    obj.status = $(getMeta).children().eq(4).find("td:nth-child(2)").text();

    /* Set Manga Endpoint */
    obj.manga_endpoint = id;

    /* Get Manga Thumbnail */
    obj.thumb = element.find(".ims > img").attr("src");

    element.find(".genre > li").each((idx, el) => {
      let genre_name = $(el).find("a").text();
      genre_list.push({
        genre_name,
      });
    });

    obj.genre_list = genre_list || [];

    /* Get Synopsis */
    const getSinopsis = element.find("#Sinopsis").first();
    obj.synopsis = $(getSinopsis).find("p").text().trim();

    /* Get Chapter List */
    $("#Daftar_Chapter > tbody")
      .find("tr")
      .each((index, el) => {
        let chapter_title = $(el).find("a").text().trim();
        let chapter_endpoint = $(el).find("a").attr("href");
        if (chapter_endpoint !== undefined) {
          const rep = chapter_endpoint.replace("/ch/", "");
          chapter.push({
            chapter_title,
            chapter_endpoint: rep,
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
  const url = "https://komiku.id/";
  const endpoint = req.params.endpoint;
  try {
    const response = await AxiosService(`${url}/ch/${endpoint}/`);
    // const response = await axios.get(`https://komikcast.id/${endpoint}`)
    const $ = cheerio.load(response.data);
    const content = $("#article");
    let chapter_image = [];
    const obj = {};
    obj.chapter_endpoint = endpoint + "/";
    obj.chapter_name = endpoint.split('-').join(' ').trim()

    obj.title = $('#Judul > h1').text().trim()

    const getTitlePages = content.find(".dsk2")
    getTitlePages.filter(() => {
      obj.title = $(getTitlePages).find("h1").text().replace("Komik ", "");
    });


    const getPages = $('#Baca_Komik > img')

    // const getPages = $('#chimg > img')
    obj.chapter_pages = getPages.length;
    getPages.each((i, el) => {
      chapter_image.push({
        chapter_image_link: $(el).attr("src").replace('i0.wp.com/',''),
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
      chapter_image :[]
    });
  }
});

//chapter detail ----done ----
router.get("/new-chapter/:endpoint", async (req, res) => {
  const url = "https://komikindo.id/";
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
    obj.chapter_name = endpoint.split('-').join(' ').trim()

    obj.title = $('#content > .wrapper > .chapterbody > .postarea > .hentry > .headpost > h1').text().trim()
    obj.image = $('.seriestucontent > .seriestucontl > .thumb').find("img").attr("src")

    // const getTitlePages = content.find(".dsk2")
    // getTitlePages.filter(() => {
    //   obj.title = $(getTitlePages).find("h1").text().replace("Komik ", "");
    // });


    // const getPages = $('#Baca_Komik > img')

    const getPages = $('#chimg-auh img')
    console.log(getPages)
    obj.chapter_pages = getPages.length;
    getPages.each((i, el) => {
      chapter_image.push({
        chapter_image_link: $(el).attr("src").replace('i0.wp.com/',''),
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
      chapter_image :[]
    });
  }
});

// search manga ------Done-----------
router.get("/search/:query", async (req, res) => {
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
    const response = await AxiosService(replaceMangaPage[0]);

    const $ = cheerio.load(response.data);
    let list_genre = [];
    let obj = {};
    $("#Filter > form > select:nth-child(2)")
      .find("option")
      .each((idx, el) => {
        if ($(el).text() !== "Genre 1") {
          const endpoint = $(el)
            .text()
            .trim()
            .split(" ")
            .join("-")
            .toLowerCase();
          list_genre.push({
            genre_name: $(el).text(),
            endpoint,
          });
        }
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
router.get("/genre/:id/:pagenumber", async (req, res) => {
  const id = req.params.id;
  const pagenumber = req.params.pagenumber;
  const url =
    pagenumber === "1"
      ? `https://data.komiku.id/pustaka/?orderby=modified&genre=${id}&genre2=&status=&category_name=`
      : `https://data.komiku.id/pustaka/page/${pagenumber}/?orderby=modified&genre=${id}&genre2&status&category_name`;
  try {
    const response = await AxiosService(url);
    const $ = cheerio.load(response.data);
    const element = $(".daftar");
    var thumb, title, endpoint, type;
    var manga_list = [];
    element.find(".bge").each((idx, el) => {
      title = $(el).find(".kan").find("h3").text().trim();
      endpoint = $(el).find("a").attr("href").replace(replaceMangaPage[1], "");
      type = $(el).find("div.bgei > a > div").find("b").text();
      thumb = $(el).find("div.bgei > a > img").attr("data-src");
      manga_list.push({
        title,
        type,
        thumb,
        endpoint,
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

// manga popular pagination ----- Done ------
router.get("/popular/:pagenumber", async (req, res) => {
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

//recommended ---done---
router.get("/recommended", async (req, res) => {
  try {
    const response = await AxiosService(replaceMangaPage[0] + "other/hot/");

    const $ = cheerio.load(response.data);
    const element = $("div.daftar > .bge");
    let manga_list = [];
    let type, title, chapter, update, endpoint, thumb;
    element.each((idx, el) => {
      title = $(el).find("div.kan > a > h3").text().trim();
      thumb = $(el).find("div.bgei > a > img").attr("data-src");
      endpoint = $(el)
        .find("div.kan > a")
        .attr("href")
        .replace("/manga/", "")
        .replace(replaceMangaPage[1], "");
      manga_list.push({
        title,
        chapter,
        type,
        thumb,
        endpoint,
        update,
      });
    });
    return res.json({
      status: true,
      message: "success",
      manga_list,
    });
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
});

//manhua  ------Done------
router.get("/manhua/:pagenumber", async (req, res) => {
  await getManhuaManhwa(req, res, `manhua`);
});

//manhwa
router.get("/manhwa/:pagenumber", async (req, res) => {
  await getManhuaManhwa(req, res, `manhwa`);
});

const getManhuaManhwa = async (req, res, type) => {
  let pagenumber = req.params.pagenumber;
  let url =
    pagenumber === "1"
      ? `https://data.komiku.id/pustaka/?orderby=&category_name=${type}&genre=&genre2=&status=`
      : `https://data.komiku.id/pustaka/page/${pagenumber}/?orderby&category_name=${type}&genre&genre2&status`;

  try {
    const response = await AxiosService(url);
    const $ = cheerio.load(response.data);
    const element = $(".perapih");
    var manga_list = [];
    var title, type, updated_on, endpoint, thumb, chapter;

    element.find(".daftar > .bge").each((idx, el) => {
      title = $(el).find(".kan > a").find("h3").text().trim();
      endpoint = $(el).find("a").attr("href").replace(replaceMangaPage[1], "");
      type = $(el).find(".bgei > a").find(".tpe1_inf > b").text().trim();
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

    res.status(200).json({
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
};

module.exports = router;
