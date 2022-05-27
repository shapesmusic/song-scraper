// Scroll to the bottom of the page first, so all the lazyload stuff loads.

// NOTE: sometimes two songs are grouped as one entry. This would potentially mess up `video_id` scraping.


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'New York Times' ORDER BY publication_date DESC LIMIT 3;


//
// Step 1: Scrape source data
//

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format source data
  title = document.getElementsByTagName("h1")[0].innerText;
  instanceName = title.match(/[^:]+$/)[0].trim();
  publicationDate = document.getElementsByTagName("time")[0].dateTime;
  publicationDateFormatted = moment(publicationDate).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format
  chartLocation = window.location.href;

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'New York Times\', "
    + "\'The Playlist\', "
    + "\'" + instanceName + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + chartLocation + "\');"
  );

  // Stage the SQL statement
  // Replace any ' in strings with ’
  // Make sure the publication_date matches the URL's date

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('New York Times', 'The Playlist', 'Harry Styles Tries On Synth-Pop, and 13 More New Songs', '2022-04-01 07:59:24.000000', 'https://www.nytimes.com/2022/04/01/arts/music/playlist-harry-styles-angel-olsen.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1180; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("css-1bxm55 eoo0vm40"); // this class changes periodically

  songsData = [];

  for (var i=0; i<elements.length; i++){

    merged = elements[i].innerText;
    title = merged.match(/, ‘(.*?)’$/)[1] // $ gives you the last apostrophe, so it doesn't cut off words like "ain't, etc."
    // if this throws an error, enter `merged` to see the problem song.
    artist_name = merged.match(/.+?(?=, ‘)/)[0];
    video_id = null;
    capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    // vidUrl = document.getElementsByClassName("css-1u3pw94")[i].innerHTML;
    // videoId = vidUrl.match(/embed\/([^"]{0,})/)[1];

    songData = {
      'title' : title,
      'artist_name' : artist_name,
      'video_id' : video_id,
      'capture_date' : capture_date,
      'source_id' : source_id,
      'song_id' : song_id,
      'duplicate' : false
    };

    songsData.push(songData);

  };

  console.log(JSON.stringify(songsData, null, 4));


//
// Step 3:  Stage songsData,
//          preview chart and prune songs (add video_id later),
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//          find and replace "featur~ing" with "ft."
//

  songsData =
  [
    {
        "title": "As It Was",
        "artist_name": "Harry Styles",
        "video_id": null,
        "capture_date": "2022-05-26 01:34:59.601601",
        "source_id": 1180,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Jersey",
        "artist_name": "Barrie",
        "video_id": null,
        "capture_date": "2022-05-26 01:34:59.607607",
        "source_id": 1180,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "All the Good Times",
        "artist_name": "Angel Olsen",
        "video_id": null,
        "capture_date": "2022-05-26 01:34:59.613613",
        "source_id": 1180,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Take It Easy",
        "artist_name": "Jensen McRae",
        "video_id": null,
        "capture_date": "2022-05-26 01:34:59.616616",
        "source_id": 1180,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Where We Started",
        "artist_name": "Thomas Rhett featuring Katy Perry",
        "video_id": null,
        "capture_date": "2022-05-26 01:34:59.617617",
        "source_id": 1180,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lavender and Red Roses",
        "artist_name": "Ibeyi featuring Jorja Smith",
        "video_id": null,
        "capture_date": "2022-05-26 01:34:59.617617",
        "source_id": 1180,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Shut Him Down",
        "artist_name": "Michael Leonhart Orchestra featuring Elvis Costello, Joshua Redman and JSWISS",
        "video_id": null,
        "capture_date": "2022-05-26 01:34:59.617617",
        "source_id": 1180,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Motema",
        "artist_name": "Juanita Euka",
        "video_id": null,
        "capture_date": "2022-05-26 01:34:59.617617",
        "source_id": 1180,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Where I’m From",
        "artist_name": "Koffee",
        "video_id": null,
        "capture_date": "2022-05-26 01:34:59.617617",
        "source_id": 1180,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rose Street",
        "artist_name": "Vince Staples",
        "video_id": null,
        "capture_date": "2022-05-26 01:34:59.617617",
        "source_id": 1180,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Totally Fine",
        "artist_name": "Pup",
        "video_id": null,
        "capture_date": "2022-05-26 01:34:59.619619",
        "source_id": 1180,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Nowhere",
        "artist_name": "sadie",
        "video_id": null,
        "capture_date": "2022-05-26 01:34:59.619619",
        "source_id": 1180,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sirens",
        "artist_name": "Flume featuring Caroline Polachek",
        "video_id": null,
        "capture_date": "2022-05-26 01:34:59.619619",
        "source_id": 1180,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Peace Invocation",
        "artist_name": "Gerald Clayton featuring Charles Lloyd",
        "video_id": null,
        "capture_date": "2022-05-26 01:34:59.627627",
        "source_id": 1180,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%AP%'
    AND artist_name LIKE '%Pop Smoke%'
  ;

  // If any changes:
  // Update var songsData = the deduplicated list above


//
// Step 4: Update nonduplicates to the song table
//

  // Build the SQL statement
  songs = [];

  for (var i=0; i<songsData.length; i++){
    song = String(
      "\n(\'" + songsData[i].title + "\', "
      + "\'" + songsData[i].artist_name + "\', "
      + "NULL)"
    );

    if (songsData[i].duplicate == false){
      songs.push(song);
    }
  }
  console.log(String(songs));


  // Stage SQL statement
  // Replace any ' in strings with ’

  INSERT INTO song
    (title, artist_name, video_id)
  VALUES
  ('As It Was', 'Harry Styles', NULL),
  ('Jersey', 'Barrie', NULL),
  ('All the Good Times', 'Angel Olsen', NULL),
  ('Take It Easy', 'Jensen McRae', NULL),
  ('Where We Started', 'Thomas Rhett featuring Katy Perry', NULL),
  ('Lavender and Red Roses', 'Ibeyi featuring Jorja Smith', NULL),
  ('Shut Him Down', 'Michael Leonhart Orchestra featuring Elvis Costello, Joshua Redman and JSWISS', NULL),
  ('Motema', 'Juanita Euka', NULL),
  ('Where I’m From', 'Koffee', NULL),
  ('Rose Street', 'Vince Staples', NULL),
  ('Totally Fine', 'Pup', NULL),
  ('Nowhere', 'sadie', NULL),
  ('Sirens', 'Flume featuring Caroline Polachek', NULL),
  ('Peace Invocation', 'Gerald Clayton featuring Charles Lloyd', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11953; // SELECT last_insert_rowid();

  // Calculate the number of nonduplicate songs added
  nonduplicates = 0;

  for (var i=0; i<songsData.length; i++){
    if (songsData[i].duplicate == false){
      nonduplicates++
    }
  };

  // Update nonduplicate song_ids
  for (var i=0; i<songsData.length; i++){

    if (songsData[i].duplicate == false){
      songsData[i].song_id = (song_id - nonduplicates +1);
      nonduplicates--;
    }
  }

  // Build the SQL statement
  source_songs = [];

  for (var i=0; i<songsData.length; i++){
    source_song = String(
      "\n(\'" + songsData[i].capture_date + "\', "
      + "\'" + songsData[i].source_id + "\', "
      + "\'" + songsData[i].song_id + "\')"
    );

    source_songs.push(source_song);
  }

  console.log(String(source_songs));


  // Stage the SQL statement
  INSERT INTO source_song
    (capture_date, source_id, song_id)
  VALUES
  ('2022-05-26 01:34:59.601601', '1180', '11940'),
  ('2022-05-26 01:34:59.607607', '1180', '11941'),
  ('2022-05-26 01:34:59.613613', '1180', '11942'),
  ('2022-05-26 01:34:59.616616', '1180', '11943'),
  ('2022-05-26 01:34:59.617617', '1180', '11944'),
  ('2022-05-26 01:34:59.617617', '1180', '11945'),
  ('2022-05-26 01:34:59.617617', '1180', '11946'),
  ('2022-05-26 01:34:59.617617', '1180', '11947'),
  ('2022-05-26 01:34:59.617617', '1180', '11948'),
  ('2022-05-26 01:34:59.617617', '1180', '11949'),
  ('2022-05-26 01:34:59.619619', '1180', '11950'),
  ('2022-05-26 01:34:59.619619', '1180', '11951'),
  ('2022-05-26 01:34:59.619619', '1180', '11952'),
  ('2022-05-26 01:34:59.627627', '1180', '11953')
  ;

  // Update to source_song table
