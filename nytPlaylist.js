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
    ('New York Times', 'The Playlist', 'Selena Gomez’s Boldly Revealing Ballad, and 9 More New Songs', '2022-11-08 07:31:02.000000', 'https://www.nytimes.com/2022/11/04/arts/music/playlist-selena-gomez-tiesto-tate-mcrae.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1428; // SELECT last_insert_rowid();
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
        "title": "My Mind & Me",
        "artist_name": "Selena Gomez",
        "video_id": null,
        "capture_date": "2022-11-11 03:57:43.788788",
        "source_id": 1428,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Muse",
        "artist_name": "Lucius",
        "video_id": null,
        "capture_date": "2022-11-11 03:57:43.788788",
        "source_id": 1428,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "10:35",
        "artist_name": "Tiësto ft. Tate McRae",
        "video_id": null,
        "capture_date": "2022-11-11 03:57:43.788788",
        "source_id": 1428,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Quiet Culture",
        "artist_name": "Ibrahim Maalouf ft. De La Soul",
        "video_id": null,
        "capture_date": "2022-11-11 03:57:43.789789",
        "source_id": 1428,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "God Is a Circle",
        "artist_name": "Yves Tumor",
        "video_id": null,
        "capture_date": "2022-11-11 03:57:43.789789",
        "source_id": 1428,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Irreversible Damage",
        "artist_name": "Algiers ft. Zack de la Rocha",
        "video_id": null,
        "capture_date": "2022-11-11 03:57:43.789789",
        "source_id": 1428,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fallout",
        "artist_name": "Yo La Tengo",
        "video_id": null,
        "capture_date": "2022-11-11 03:57:43.789789",
        "source_id": 1428,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Arms",
        "artist_name": "Sipho",
        "video_id": null,
        "capture_date": "2022-11-11 03:57:43.789789",
        "source_id": 1428,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Itch",
        "artist_name": "quinnie",
        "video_id": null,
        "capture_date": "2022-11-11 03:57:43.789789",
        "source_id": 1428,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Corpus",
        "artist_name": "Old Fire ft. Bill Callahan",
        "video_id": null,
        "capture_date": "2022-11-11 03:57:43.789789",
        "source_id": 1428,
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
  ('My Mind & Me', 'Selena Gomez', NULL),
  ('Muse', 'Lucius', NULL),
  ('10:35', 'Tiësto ft. Tate McRae', NULL),
  ('Quiet Culture', 'Ibrahim Maalouf ft. De La Soul', NULL),
  ('God Is a Circle', 'Yves Tumor', NULL),
  ('Irreversible Damage', 'Algiers ft. Zack de la Rocha', NULL),
  ('Fallout', 'Yo La Tengo', NULL),
  ('Arms', 'Sipho', NULL),
  ('Itch', 'quinnie', NULL),
  ('Corpus', 'Old Fire ft. Bill Callahan', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 13130; // SELECT last_insert_rowid();

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
  ('2022-11-11 03:57:43.788788', '1428', '13121'),
  ('2022-11-11 03:57:43.788788', '1428', '13122'),
  ('2022-11-11 03:57:43.788788', '1428', '13123'),
  ('2022-11-11 03:57:43.789789', '1428', '13124'),
  ('2022-11-11 03:57:43.789789', '1428', '13125'),
  ('2022-11-11 03:57:43.789789', '1428', '13126'),
  ('2022-11-11 03:57:43.789789', '1428', '13127'),
  ('2022-11-11 03:57:43.789789', '1428', '13128'),
  ('2022-11-11 03:57:43.789789', '1428', '13129'),
  ('2022-11-11 03:57:43.789789', '1428', '13130')
  ;

  // Update to source_song table
