// Scroll to the bottom of the page first, so all the React stuff loads.
// FIXME: sometimes two songs are grouped as one entry. this messes up vIDs.

//
// Step 0: Check most recent scraped
//

SELECT instance_name, publication_date FROM source WHERE parent_entity = 'New York Times' ORDER BY publication_date DESC LIMIT 8;

//
// Step 1: get source data
//

  // add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // get and format source data
  title = document.getElementsByTagName("h1")[0].innerText;
  instanceName = title.match(/[^:]+$/)[0].trim();
  publicationDate = document.getElementsByTagName("time")[0].dateTime;
  publicationDateFormatted = moment(publicationDate).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format
  chartLocation = window.location.href;

  // build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'New York Times\', "
    + "\'The Playlist\', "
    + "\'" + instanceName + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + chartLocation + "\');"
  );

  // Paste the statement in Step 3 below and insert the source into the db

//
// Step 2: get songs data
//

  source_id = 739; // SELECT last_insert_rowid();

  songs = [];

  elements = document.getElementsByClassName("css-ow6j0y eoo0vm40"); // this class changes periodically
  for (var i=0; i<elements.length; i++){

    merged = elements[i].innerText;
    title = merged.match(/, ‘(.*?)’$/)[1] // $ gives you the last apostrophe, so it doesn't cut off words like "ain't, etc."
    // if this throws an error, enter `merged` to see the problem song.
    artist_name = merged.match(/.+?(?=, ‘)/)[0];
    capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    // vidUrl = document.getElementsByClassName("css-1u3pw94")[i].innerHTML;
    // videoId = vidUrl.match(/embed\/([^"]{0,})/)[1];

    song = String(
      "\n(\'" + capture_date + "\', "
      + source_id + ", "
      + "\'" + title + "\', "
      + "\'" + artist_name + "\', "
      + "\'\')"
    );

    songs.push(song);

  };

  console.log(String(songs));

  // Add videoIds manually & prune songs

//
// Step 3: paste final statements below:
//

INSERT INTO source
  (parent_entity, parent_stream, instance_name, publication_date, location)
VALUES
  ('New York Times', 'The Playlist', 'Ariana Grande Is in Love, and 11 More New Songs', '2020-10-26 09:02:06.000000', 'https://www.nytimes.com/2020/10/23/arts/music/playlist-ariana-grande-arlo-parks.html');


INSERT INTO song
  (capture_date, source_id, title, artist_name, video_id)
VALUES
  ('2020-10-27 08:49:39.478478', 739, 'Positions', 'Ariana Grande', '-Pr029fVsIY'),
  ('2020-10-27 08:49:39.479479', 739, 'Green Eyes', 'Arlo Parks', 'ddjr5KDqYGA'),
  ('2020-10-27 08:49:39.479479', 739, 'Faith Healer', 'Julien Baker', 'bWAOkg2i6_g'),
  ('2020-10-27 08:49:39.480480', 739, 'Cat’s Cradle', 'Tigers Jaw', 'KV4tJJsIh5M'),
  ('2020-10-27 08:49:39.480480', 739, 'Dominique', 'Ela Minus', '3EyDeCvQ8vA'),
  ('2020-10-27 08:49:39.480480', 739, 'Music for Egun Movement 2', 'Ìfé', 'g8ZV9Ic-M1E'),
  ('2020-10-27 08:49:39.480480', 739, 'Comfort, Edge', 'Helena Deland', 'lz3ol1AfK0I'),
  ('2020-10-27 08:49:39.480480', 739, 'Crash', 'Nilüfer Yanya', 'Y17xKjMmM-U'),
  ('2020-10-27 08:49:39.480480', 739, 'Tyler Herro', 'Jack Harlow', 'np9Ub1LilKU'),
  ('2020-10-27 08:49:39.480480', 739, 'I Don’t Talk About That Much’ and ‘Hva Hvis', 'Smerz', 'YC0fA-OTeqA')
;
