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

//
// Step 2: get songs data
//

  source_id = 731; // SELECT last_insert_rowid();

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
  ('New York Times', 'The Playlist', 'Jeff Tweedy’s Homesick Tune, and 11 More New Songs', '2020-10-09 08:26:45.000000', 'https://www.nytimes.com/2020/10/09/arts/music/playlist-jeff-tweedy-anderson-paak-davido.html');

INSERT INTO song
  (capture_date, source_id, title, artist_name, video_id)
VALUES
  ('2020-10-17 02:21:33.569569', 731, 'Gwendolyn', 'Jeff Tweedy', '0aqwuQuhP5U'),
  ('2020-10-17 02:21:33.571571', 731, 'Before I Got Here', 'Palberta', 'hELyfMbtB-k'),
  ('2020-10-17 02:21:33.571571', 731, 'Jewelz', 'Anderson .Paak', '6gXlC3rD8jI'),
  ('2020-10-17 02:21:33.571571', 731, 'Kissez', 'Sevyn Streeter featuring Davido', 'nNpASlGAgcI'),
  ('2020-10-17 02:21:33.571571', 731, 'Donuts Mind if I Do', 'Chai', 'UMoYR6gBpkc'),
  ('2020-10-17 02:21:33.571571', 731, 'The Worst in Me', 'Kaytranada featuring Tinashe', 'p6hrlF0W0ig'),
  ('2020-10-17 02:21:33.571571', 731, 'False Choice', 'Josh Johnson', '4jTeS4ZFw9E'),
  ('2020-10-17 02:21:33.571571', 731, 'Okinawa/Ubud', 'Emmy the Great', 't96njPp0jDA'),
  ('2020-10-17 02:21:33.571571', 731, 'Trick to Happy', 'Bahamas', 'reVZzYN0J4s'),
  ('2020-10-17 02:21:33.571571', 731, 'New Skill', 'Henriette Sennenvaldt', 'B7HBFNPCxNE')
;
