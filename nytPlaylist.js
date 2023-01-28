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
    ('New York Times', 'The Playlist', 'Everything But the Girl’s Long-Awaited Return, and 12 More New Songs', '2023-01-13 09:40:32.000000', 'https://www.nytimes.com/2023/01/13/arts/music/playlist-everything-but-the-girl-miley-cyrus.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1488; // SELECT last_insert_rowid();
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
        "title": "Nothing Left to Lose",
        "artist_name": "Everything But the Girl",
        "video_id": null,
        "capture_date": "2023-01-28 09:48:16.294294",
        "source_id": 1488,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Way Back",
        "artist_name": "Skrillex, Fred again.. and Flowdan",
        "video_id": null,
        "capture_date": "2023-01-28 09:48:16.295295",
        "source_id": 1488,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bzrp Music Sessions, Vol. 53",
        "artist_name": "Bizarrap and Shakira",
        "video_id": null,
        "capture_date": "2023-01-28 09:48:16.295295",
        "source_id": 1488,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Flowers",
        "artist_name": "Miley Cyrus",
        "video_id": null,
        "capture_date": "2023-01-28 09:48:16.295295",
        "source_id": 1488,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "C’est Comme Ça",
        "artist_name": "Paramore",
        "video_id": null,
        "capture_date": "2023-01-28 09:48:16.295295",
        "source_id": 1488,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Carpenter",
        "artist_name": "Vagabon",
        "video_id": null,
        "capture_date": "2023-01-28 09:48:16.295295",
        "source_id": 1488,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Where Do We Go Now?",
        "artist_name": "Gracie Abrams",
        "video_id": null,
        "capture_date": "2023-01-28 09:48:16.295295",
        "source_id": 1488,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Aselestine",
        "artist_name": "Yo La Tengo",
        "video_id": null,
        "capture_date": "2023-01-28 09:48:16.295295",
        "source_id": 1488,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cambiaste",
        "artist_name": "Yahritza y Su Esencia",
        "video_id": null,
        "capture_date": "2023-01-28 09:48:16.295295",
        "source_id": 1488,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "On Wat U On",
        "artist_name": "Moneybagg Yo ft. GloRilla",
        "video_id": null,
        "capture_date": "2023-01-28 09:48:16.295295",
        "source_id": 1488,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "New Atlantis",
        "artist_name": "Iggy Pop",
        "video_id": null,
        "capture_date": "2023-01-28 09:48:16.295295",
        "source_id": 1488,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Oh Me, Oh My",
        "artist_name": "Lonnie Holley ft. Michael Stipe",
        "video_id": null,
        "capture_date": "2023-01-28 09:48:16.295295",
        "source_id": 1488,
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
  ('Nothing Left to Lose', 'Everything But the Girl', NULL),
  ('Way Back', 'Skrillex, Fred again.. and Flowdan', NULL),
  ('Bzrp Music Sessions, Vol. 53', 'Bizarrap and Shakira', NULL),
  ('Flowers', 'Miley Cyrus', NULL),
  ('C’est Comme Ça', 'Paramore', NULL),
  ('Carpenter', 'Vagabon', NULL),
  ('Where Do We Go Now?', 'Gracie Abrams', NULL),
  ('Aselestine', 'Yo La Tengo', NULL),
  ('Cambiaste', 'Yahritza y Su Esencia', NULL),
  ('On Wat U On', 'Moneybagg Yo ft. GloRilla', NULL),
  ('New Atlantis', 'Iggy Pop', NULL),
  ('Oh Me, Oh My', 'Lonnie Holley ft. Michael Stipe', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 13391; // SELECT last_insert_rowid();

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
  ('2023-01-28 09:48:16.294294', '1488', '13380'),
  ('2023-01-28 09:48:16.295295', '1488', '13381'),
  ('2023-01-28 09:48:16.295295', '1488', '13382'),
  ('2023-01-28 09:48:16.295295', '1488', '13383'),
  ('2023-01-28 09:48:16.295295', '1488', '13384'),
  ('2023-01-28 09:48:16.295295', '1488', '13385'),
  ('2023-01-28 09:48:16.295295', '1488', '13386'),
  ('2023-01-28 09:48:16.295295', '1488', '13387'),
  ('2023-01-28 09:48:16.295295', '1488', '13388'),
  ('2023-01-28 09:48:16.295295', '1488', '13389'),
  ('2023-01-28 09:48:16.295295', '1488', '13390'),
  ('2023-01-28 09:48:16.295295', '1488', '13391')
  ;

  // Update to source_song table
