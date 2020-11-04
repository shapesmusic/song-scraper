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

  source_id = 742; // SELECT last_insert_rowid();

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
  ('New York Times', 'The Playlist', 'Kendrick Lamar’s Welcome Return, and 11 More New Songs', '2020-10-30 08:36:43.000000', 'https://www.nytimes.com/2020/10/30/arts/music/playlist-kendrick-lamar-busta-rhymes-tierra-whack.html');


INSERT INTO song
  (capture_date, source_id, title, artist_name, video_id)
VALUES
  ('2020-11-03 09:37:33.703703', 742, 'Look Over Your Shoulder', 'Busta Rhymes featuring Kendrick Lamar', NULL),
  ('2020-11-03 09:37:33.704704', 742, 'You’ve Got to Feel', 'Empress Of featuring Amber Mark', 'zNSf5t3toec'),
  ('2020-11-03 09:37:33.704704', 742, 'Dora', 'Tierra Whack', NULL),
  ('2020-11-03 09:37:33.704704', 742, 'Actually Vote', 'Keke Palmer', 'yGOAXdva_LE'),
  ('2020-11-03 09:37:33.704704', 742, 'Juyendo', 'Sebastián Otero', 'qRFqNh3k4Ok'),
  ('2020-11-03 09:37:33.704704', 742, 'Cady Road', 'Routine', 'kfRrhC0Xr7U'),
  ('2020-11-03 09:37:33.704704', 742, 'There’s a First Time for Everything', 'Gillian Welch', 'A-qVpT6rKKE'),
  ('2020-11-03 09:37:33.704704', 742, 'Closed Chapter', 'Gianna Lauren', 'MhTIebkJwLY'),
  ('2020-11-03 09:37:33.705705', 742, 'Who Shot Ya?', 'Xenia Rubinos', 'J_X7yrfWU_U'),
  ('2020-11-03 09:37:33.705705', 742, 'Lemon Trees', 'Mary Halvorson’s Code Girl', 'a689HlvUESM')
;
