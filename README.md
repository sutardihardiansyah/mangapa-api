  
# Manganim API
Manganim (Manga + Anime) Restful API (bahasa Indonesia) built with ❤️ by Tustoz

# Usage
1. Clone this repository
    ```bash
    git clone https://github.com/tustoz/manganim.git
    ```
2. Install dependecies (`yarn` or `npm install`)
3. Start the development environment (*if you haven't installed nodemon globally, you can do `npm i nodemon --save`)
    ```bash
    npm run dev or npm run start
    ```
4. visit http://localhost:3000/

# Anime Documentation
__API__ __PATH__ = https://manganim.herokuapp.com/anime
</br>__ApI__ Version = `Beta v1.0`

## Latest Anime
Get Latest Anime Update
```
/
```
example : https://manganim.herokuapp.com/anime

## Completed Anime
Get All Completed Anime
```
/completed
```
example : https://manganim.herokuapp.com/anime/completed

## Detail Anime
Get Anime Info
```
/detail/[endpoint]
```
example : https://manganim.herokuapp.com/anime/detail/jujutsu-kaisen-subtitle-indonesia/

## Search Anime by Name
Get specific Anime list by name
```
/search/[query]
```
example : https://manganim.herokuapp.com/anime/search/komi%20san

## Genre List
Get all available genres
```
/genre
```
example : https://manganim.herokuapp.com/anime/genre

## Genre Detail
Get all Anime list by specific genres
```
/genre/[endpoint]
/genre/[endpoint]/page/[pagenumber]
```
example : https://manganim.herokuapp.com/anime/genre/slice-of-life or https://manganim.herokuapp.com/anime/genre/slice-of-life/page/2

## Season List
Get all available seasons
```
/season
```
example : https://manganim.herokuapp.com/anime/season

## Season Detail
Get all Anime list by specific season
```
/season/[endpoint]
/season/[endpoint]/page/[id]
```
example : https://manganim.herokuapp.com/anime/season/fall-2019 or https://manganim.herokuapp.com/anime/season/fall-2019/page/2

## Studio List
Get all available studios
```
/studio
```
example : https://manganim.herokuapp.com/anime/studio

## Studio Detail
Get all Anime list by specific season
```
/studio/[endpoint]
/studio/[endpoint]/page/[id]
```
example : https://manganim.herokuapp.com/anime/studio/cloverworks or https://manganim.herokuapp.com/anime/studio/cloverworks/page/2

## Anime Release Schedule
Day based Anime release schedule
```
/schedule
```
example : https://manganim.herokuapp.com/anime/schedule


# Manga Documentation
__API__ __PATH__ = https://manganim.herokuapp.com/manga
</br>__ApI__ Version = `Release v1.0`

## All Manga
Get Latest Manga Update
```
/page/[pagenumber]
```
example : https://manganim.herokuapp.com/manga or https://manganim.herokuapp.com/manga/page/2

## Popular Manga
Get Popular Manga
```
/popular/[pageNumber]
```
example : https://manganim.herokuapp.com/manga/popular/1

## Detail Manga
```
/detail/[endpoint]
```
example : https://manganim.herokuapp.com/manga/detail/martial-peak/

## Search Manga by Name
```
/search/[query]
```
example : https://manganim.herokuapp.com/manga/search/komi%20san

## Genre List
```
/genres
```
example : https://manganim.herokuapp.com/manga/genres

## Genre Detail
```
/genres/[endpoint]/[pagenumber]
```
example : https://manganim.herokuapp.com/manga/genre/action/1

## Recommended Manga
```
/recommended
```
example : https://manganim.herokuapp.com/manga/recommended

## Manhua List (Chinese Comic)
```
/manhua/[pageNumber]
```
example : https://manganim.herokuapp.com/manga/manhua/1

## Manhwa List (Korean Comic)
```
/manhwa/[pageNumber]
```
example : https://manganim.herokuapp.com/manga/manhwa/1

## Chapter
```
/chapter/[chapterEndpoint]
```
example :https://manganim.herokuapp.com/manga/chapter/martial-peak-chapter-1
