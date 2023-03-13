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
    ('New York Times', 'The Playlist', 'U.S. Girls’ Luxuriously Absurd Disco, and 9 More New Songs', '2023-02-24 09:45:54.000000', 'https://www.nytimes.com/2023/02/24/arts/music/playlist-us-girls-skrillex-gracie-abrams.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1541; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("css-kypbrf eoo0vm40"); // this class changes periodically

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
        "title": "Tux (Your Body Fills Me, Boo)",
        "artist_name": "U.S. Girls",
        "video_id": null,
        "capture_date": "2023-03-12 08:37:38.544544",
        "source_id": 1541,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Painting Rainbows",
        "artist_name": "Skrillex and Bibi Bourelly",
        "video_id": null,
        "capture_date": "2023-03-12 08:37:38.545545",
        "source_id": 1541,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "What You Did",
        "artist_name": "Hannah Jadagu",
        "video_id": null,
        "capture_date": "2023-03-12 08:37:38.545545",
        "source_id": 1541,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "All We Have Is Now",
        "artist_name": "Fishbone",
        "video_id": null,
        "capture_date": "2023-03-12 08:37:38.545545",
        "source_id": 1541,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Light on in the Kitchen",
        "artist_name": "Ashley McBryde",
        "video_id": null,
        "capture_date": "2023-03-12 08:37:38.545545",
        "source_id": 1541,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Know It Won’t Work",
        "artist_name": "Gracie Abrams",
        "video_id": null,
        "capture_date": "2023-03-12 08:37:38.545545",
        "source_id": 1541,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Underneath My Toe",
        "artist_name": "Bernice",
        "video_id": null,
        "capture_date": "2023-03-12 08:37:38.545545",
        "source_id": 1541,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "To Remain/To Return",
        "artist_name": "Arooj Aftab, Vijay Iyer, Shahzad Ismaily",
        "video_id": null,
        "capture_date": "2023-03-12 08:37:38.545545",
        "source_id": 1541,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Manitou",
        "artist_name": "Zoon",
        "video_id": null,
        "capture_date": "2023-03-12 08:37:38.545545",
        "source_id": 1541,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ngo Ma",
        "artist_name": "IzangoMa",
        "video_id": null,
        "capture_date": "2023-03-12 08:37:38.545545",
        "source_id": 1541,
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
  // If ’ replaced, check again for duplicate

  INSERT INTO song
    (title, artist_name, video_id)
  VALUES
  ('Tux (Your Body Fills Me, Boo)', 'U.S. Girls', NULL),
  ('Painting Rainbows', 'Skrillex and Bibi Bourelly', NULL),
  ('What You Did', 'Hannah Jadagu', NULL),
  ('All We Have Is Now', 'Fishbone', NULL),
  ('Light on in the Kitchen', 'Ashley McBryde', NULL),
  ('I Know It Won’t Work', 'Gracie Abrams', NULL),
  ('Underneath My Toe', 'Bernice', NULL),
  ('To Remain/To Return', 'Arooj Aftab, Vijay Iyer, Shahzad Ismaily', NULL),
  ('Manitou', 'Zoon', NULL),
  ('Ngo Ma', 'IzangoMa', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 13609; // SELECT last_insert_rowid();

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
  ('2023-03-12 08:37:38.544544', '1541', '13600'),
  ('2023-03-12 08:37:38.545545', '1541', '13601'),
  ('2023-03-12 08:37:38.545545', '1541', '13602'),
  ('2023-03-12 08:37:38.545545', '1541', '13603'),
  ('2023-03-12 08:37:38.545545', '1541', '13604'),
  ('2023-03-12 08:37:38.545545', '1541', '13605'),
  ('2023-03-12 08:37:38.545545', '1541', '13606'),
  ('2023-03-12 08:37:38.545545', '1541', '13607'),
  ('2023-03-12 08:37:38.545545', '1541', '13608'),
  ('2023-03-12 08:37:38.545545', '1541', '13609')
  ;

  // Update to source_song table
