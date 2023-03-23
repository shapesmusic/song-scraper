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
    ('New York Times', 'The Playlist', 'Taylor Swift’s ‘Lover’ Outtake, and 8 More New Songs', '2023-03-17 08:35:59.000000', 'https://www.nytimes.com/2023/03/17/arts/music/playlist-taylor-swift-100-gecs.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1551; // SELECT last_insert_rowid();
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
        "title": "All of the Girls You Loved Before",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-03-23 02:50:42.604604",
        "source_id": 1551,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Borrowed Trouble",
        "artist_name": "Feist",
        "video_id": null,
        "capture_date": "2023-03-23 02:50:42.606606",
        "source_id": 1551,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "So Hard So Hot",
        "artist_name": "Alison Goldfrapp",
        "video_id": null,
        "capture_date": "2023-03-23 02:50:42.606606",
        "source_id": 1551,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Stamina",
        "artist_name": "Tiwa Savage, Ayra Starr and Young Jonn",
        "video_id": null,
        "capture_date": "2023-03-23 02:50:42.606606",
        "source_id": 1551,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dumbest Girl Alive",
        "artist_name": "100 gecs",
        "video_id": null,
        "capture_date": "2023-03-23 02:50:42.606606",
        "source_id": 1551,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Horse Has a Voice",
        "artist_name": "Matthew Herbert ft. Theon Cross",
        "video_id": null,
        "capture_date": "2023-03-23 02:50:42.606606",
        "source_id": 1551,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Thing or 2",
        "artist_name": "Pieta Brown and JT Bates",
        "video_id": null,
        "capture_date": "2023-03-23 02:50:42.606606",
        "source_id": 1551,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "5 Leaf Clover",
        "artist_name": "Luke Combs",
        "video_id": null,
        "capture_date": "2023-03-23 02:50:42.606606",
        "source_id": 1551,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Safe to Run",
        "artist_name": "Esther Rose ft. Hurray for the Riff Raff",
        "video_id": null,
        "capture_date": "2023-03-23 02:50:42.606606",
        "source_id": 1551,
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
  ('All of the Girls You Loved Before', 'Taylor Swift', NULL),
  ('Borrowed Trouble', 'Feist', NULL),
  ('So Hard So Hot', 'Alison Goldfrapp', NULL),
  ('Stamina', 'Tiwa Savage, Ayra Starr and Young Jonn', NULL),
  ('Dumbest Girl Alive', '100 gecs', NULL),
  ('The Horse Has a Voice', 'Matthew Herbert ft. Theon Cross', NULL),
  ('Thing or 2', 'Pieta Brown and JT Bates', NULL),
  ('5 Leaf Clover', 'Luke Combs', NULL),
  ('Safe to Run', 'Esther Rose ft. Hurray for the Riff Raff', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 13705; // SELECT last_insert_rowid();

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
  ('2023-03-23 02:50:42.604604', '1551', '13697'),
  ('2023-03-23 02:50:42.606606', '1551', '13698'),
  ('2023-03-23 02:50:42.606606', '1551', '13699'),
  ('2023-03-23 02:50:42.606606', '1551', '13700'),
  ('2023-03-23 02:50:42.606606', '1551', '13701'),
  ('2023-03-23 02:50:42.606606', '1551', '13702'),
  ('2023-03-23 02:50:42.606606', '1551', '13703'),
  ('2023-03-23 02:50:42.606606', '1551', '13704'),
  ('2023-03-23 02:50:42.606606', '1551', '13705')
  ;

  // Update to source_song table
