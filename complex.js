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

  // Paste the statement in Step 3 below and insert the source into the db

//
// Step 2: get songs data
//

  source_id = 738; // SELECT last_insert_rowid();

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
  ('Complex', 'Best New Music This Week', 'Ty Dolla Sign, Ariana Grande, Saweetie, More', '2020-10-23 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-ariana-grande-ty-dolla-sign/rico-nasty-gucci-mane-don-toliver-for-me');


INSERT INTO song
  (capture_date, source_id, title, artist_name, video_id)
VALUES
  ('2020-10-27 08:46:07.176176', 738, 'Positions', 'Ariana Grande', 'tcYodQoapMg'),
  ('2020-10-27 08:46:07.177177', 738, 'Track 6', 'Ty Dolla Sign f/ Kanye West, Anderson .Paak, & Thundercat', 'MODX7DWeN_c'),
  ('2020-10-27 08:46:07.177177', 738, 'Back to the Streets', 'Saweetie f/ Jhene Aiko', 'dXg12-v10Xk'),
  ('2020-10-27 08:46:07.178178', 738, 'Nissan Altima', 'Michael Christmas', 'PEiQDRA_WCs'),
  ('2020-10-27 08:46:07.178178', 738, 'Tyler Herro', 'Jack Harlow', 'np9Ub1LilKU'),
  ('2020-10-27 08:46:07.178178', 738, 'Tap In', 'DeJ Loaf f/ 42 Dugg & Sada Baby', 'Y4C_ujzbZdc'),
  ('2020-10-27 08:46:07.178178', 738, 'For Me', 'Chase B f/ OMB Bloodbath & KenTheMan', 'b1QpBXmbX1A'),
  ('2020-10-27 08:46:07.178178', 738, 'Don’t Like Me', 'Rico Nasty f/ Gucci Mane & Don Toliver', 'zxxnLeS7hfY')
;
