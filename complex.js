// Scroll to the bottom of the page first, so all the React stuff loads
// Always check the last song name to make sure everything got scraped

//
// Step 0: Check most recent source scraped
//

SELECT instance_name, publication_date FROM source WHERE parent_entity = 'Complex' ORDER BY publication_date DESC LIMIT 8;

//
// Step 1: get source data
//

  chartTitle = document.getElementsByClassName("story-title story-title__article")[0].innerText;
  parentStream = chartTitle.match(/.+?(?=:)/)[0];
  instanceName = chartTitle.match(/[^:]+$/)[0].trim();

  // add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // get and format publicationDate
  publicationDate = document.getElementsByClassName("info-row__datetime")[0].innerHTML.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // get and format location
  chartLocation = window.location.href; // "location" is a reserved word

  // build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Complex\', "
    + "\'" + parentStream + "\', "
    + "\'" + instanceName + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + chartLocation + "\');"
  );

//
// Step 2: get songs data
//

  source_id = 733; // SELECT last_insert_rowid();

  elements = document.getElementsByClassName("article-list");
  element = elements[0].getElementsByTagName("h2"); // sometimes h2 or h3
  videoUrl = document.getElementsByClassName("video-lazyload");

  songs = [];

  for (var i=0; i<element.length; i++){
    title = element[i].innerText.match(/, “(.*?)”/)[1]; // may need " or “” type quotation marks, or a comma after the artist name, or may have an &nbsp; instead of a space
    artist_name = element[i].innerText.match(/.+?(?=, “)/)[0]; // may need " or “ type quotation marks
    video_id = videoUrl[i].style.backgroundImage.match(/(?<=vi\/)(.*)(?=\/)/)[0]; // example: url("https://i.ytimg.com/vi/gejbbL1AaJk/hqdefault.jpg")

    capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    song = String(
      "\n(\'" + capture_date + "\', "
      + source_id + ", "
      + "\'" + title + "\', "
      + "\'" + artist_name + "\', "
      + "\'" + video_id + "\')"
    );

    songs.push(song);

  };

  console.log(String(songs));

//
// Step 3: paste final statements below:
//

INSERT INTO source
  (parent_entity, parent_stream, instance_name, publication_date, location)
VALUES
  ('Complex', 'Best New Music This Week', 'Benny the Butcher, Black Thought, Ty Dolla Sign, More', '2020-10-16 12:00:00.000000', 'https://www.complex.com/music/2020/10/best-new-music-this-week-october-16/snot-flo-milli-mean');


INSERT INTO song
  (capture_date, source_id, title, artist_name, video_id)
VALUES
  ('2020-10-20 07:56:24.172172', 733, 'Legend', 'Benny the Butcher', 'boskATjX9Wc'),
  ('2020-10-20 07:56:24.173173', 733, 'Iced Out Audemars Remix', 'Pop Smoke f/ Lil Wayne', 'kIz4mKRPdlw'),
  ('2020-10-20 07:56:24.173173', 733, 'You’re Mines Still Remix', 'Yung Bleu & Drake', 'eiXULl40N3I'),
  ('2020-10-20 07:56:24.173173', 733, 'Diamond Choker', 'Lil Gnar & Lil Uzi Vert', 'peP0BJ9EWZ8'),
  ('2020-10-20 07:56:24.174174', 733, 'Never', 'Young Nudy', 'QNP23jp_2wk'),
  ('2020-10-20 07:56:24.174174', 733, 'Whole Lotta Choppas Remix', 'Sada Baby f/ Nicki Minaj', 'KV3fVY0nHw4'),
  ('2020-10-20 07:56:24.174174', 733, 'Steak Um', 'Black Thought f/ Schoolboy Q', 'JagKPNTvCnY'),
  ('2020-10-20 07:56:24.174174', 733, 'Before', 'James Blake', 'xbUvNFUrkpc'),
  ('2020-10-20 07:56:24.174174', 733, 'By Yourself', 'Ty Dolla $ign f/ Jhene Aiko & Mustard', 'vEnW8rLMJlc'),
  ('2020-10-20 07:56:24.174174', 733, 'I’m Amazing', 'Omar Apollo', '3ISHE5Mp628'),
  ('2020-10-20 07:56:24.174174', 733, 'Pardon', 'T.I. f/ Lil Baby', '4QE6iIt2oIs'),
  ('2020-10-20 07:56:24.174174', 733, 'Mean', '$not & Flo Milli', 'c-Z4me0FIVw')
;
