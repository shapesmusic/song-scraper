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

  source_id = 730; // SELECT last_insert_rowid();

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
  ('Complex', 'Best New Music This Week', 'Benny the Butcher, Reason, SAINt JHN, and More', '2020-10-09 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-benny-the-butcher/lil-loaded-polo-g-while-im-here');

INSERT INTO song
  (capture_date, source_id, title, artist_name, video_id)
VALUES
  ('2020-10-17 02:17:28.573573', 730, 'Timeless', 'Benny the Butcher f/ Lil Wayne, Big Sean, and Hit-Boy', 'cwEGQAvsens'),
  ('2020-10-17 02:17:28.575575', 730, 'Extinct', 'Reason f/ JID & Isaiah Rashad', 'mZtyIraf7jI'),
  ('2020-10-17 02:17:28.575575', 730, 'Jewelz', 'Anderson .Paak & Timbaland', '677jKtsyDhg'),
  ('2020-10-17 02:17:28.575575', 730, 'Princess Cuts', 'Headie One f/ Young T & Bugsey', '_Px5l4mQ0H4'),
  ('2020-10-17 02:17:28.575575', 730, 'Gorgeous', 'SAINt JHN', 'k2gPDgC4Iz4'),
  ('2020-10-17 02:17:28.575575', 730, 'While I’m Here', 'Lil Loaded f/ Polo G', '-SYUCByoYOk')
;
