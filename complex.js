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

  source_id = 741; // SELECT last_insert_rowid();

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
  ('Complex', 'Best New Music This Week', 'Ariana Grande, Lil Durk, Busta Rhymes, and More', '2020-10-30 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-ariana-grande-busta-rhymes/tierra-whack-dora');


INSERT INTO song
  (capture_date, source_id, title, artist_name, video_id)
VALUES
  ('2020-11-03 09:20:05.027027', 741, 'Six Thirty', 'Ariana Grande', 'u7GAXfrajHc'),
  ('2020-11-03 09:20:05.029029', 741, 'Look Over Your Shoulder', 'Busta Rhymes f/ Kendrick Lamar', 'Yl_-3oSlWaU'),
  ('2020-11-03 09:20:05.029029', 741, 'Vice City', 'Young Nudy & Metro Boomin', 'LYbsTkPnVDw'),
  ('2020-11-03 09:20:05.029029', 741, '4 Thangs', 'Freddie Gibbs f/ Big Sean and Hit-Boy', 'NXgeVXkPINo'),
  ('2020-11-03 09:20:05.029029', 741, 'Stay Down', 'Lil Durk f/ Young Thug and 6LACK', '3ZSYPQYho3Q'),
  ('2020-11-03 09:20:05.030030', 741, 'Sangria', '$not f/ Denzel Curry', 'mQijQBxmabE'),
  ('2020-11-03 09:20:05.030030', 741, 'Losses', 'Lil Tjay', 'fd1HuGsR51I'),
  ('2020-11-03 09:20:05.030030', 741, 'Like This!', 'Brevin Kim', 'ug6XZhvzqGU'),
  ('2020-11-03 09:20:05.030030', 741, 'Double G', 'French Montana f/ Pop Smoke', '2EwAq5a9it8'),
  ('2020-11-03 09:20:05.030030', 741, 'Dora', 'Tierra Whack', 'QCCxLpT9ymc')
;
