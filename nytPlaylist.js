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
    ('New York Times', 'The Playlist', 'Drake Surprises With a Kim Kardashian Sample, and 11 More New Songs', '2023-04-07 10:43:48.000000', 'https://www.nytimes.com/2023/04/07/arts/music/playlist-drake-kaytramine.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1567; // SELECT last_insert_rowid();
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
        "title": "Search & Rescue",
        "artist_name": "Drake",
        "video_id": null,
        "capture_date": "2023-04-22 08:25:36.817817",
        "source_id": 1567,
        "song_id": 14077,
        "duplicate": true
    },
    {
        "title": "4EVA",
        "artist_name": "Kaytraminé ft. Pharrell Williams",
        "video_id": null,
        "capture_date": "2023-04-22 08:25:36.818818",
        "source_id": 1567,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Terms and Conditions",
        "artist_name": "Mahalia",
        "video_id": null,
        "capture_date": "2023-04-22 08:25:36.818818",
        "source_id": 1567,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "You Can Be Mean",
        "artist_name": "Indigo De Souza",
        "video_id": null,
        "capture_date": "2023-04-22 08:25:36.818818",
        "source_id": 1567,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Salad",
        "artist_name": "Blondshell",
        "video_id": null,
        "capture_date": "2023-04-22 08:25:36.818818",
        "source_id": 1567,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "New York Comeback",
        "artist_name": "Lucinda Williams",
        "video_id": null,
        "capture_date": "2023-04-22 08:25:36.818818",
        "source_id": 1567,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Passed Me By",
        "artist_name": "Yaeji",
        "video_id": null,
        "capture_date": "2023-04-22 08:25:36.819819",
        "source_id": 1567,
        "song_id": 14076,
        "duplicate": true
    },
    {
        "title": "Asylum",
        "artist_name": "Uncle Waffles",
        "video_id": null,
        "capture_date": "2023-04-22 08:25:36.819819",
        "source_id": 1567,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "7 O’Clock Clap",
        "artist_name": "Arthur Moon",
        "video_id": null,
        "capture_date": "2023-04-22 08:25:36.819819",
        "source_id": 1567,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Never Felt So Alone",
        "artist_name": "Labrinth",
        "video_id": null,
        "capture_date": "2023-04-22 08:25:36.819819",
        "source_id": 1567,
        "song_id": 14083,
        "duplicate": true
    },
    {
        "title": "I/O",
        "artist_name": "Peter Gabriel",
        "video_id": null,
        "capture_date": "2023-04-22 08:25:36.819819",
        "source_id": 1567,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Inside/Outside",
        "artist_name": "This Is the Kit",
        "video_id": null,
        "capture_date": "2023-04-22 08:25:36.820820",
        "source_id": 1567,
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
  ('4EVA', 'Kaytraminé ft. Pharrell Williams', NULL),
  ('Terms and Conditions', 'Mahalia', NULL),
  ('You Can Be Mean', 'Indigo De Souza', NULL),
  ('Salad', 'Blondshell', NULL),
  ('New York Comeback', 'Lucinda Williams', NULL),
  ('Asylum', 'Uncle Waffles', NULL),
  ('7 O’Clock Clap', 'Arthur Moon', NULL),
  ('I/O', 'Peter Gabriel', NULL),
  ('Inside/Outside', 'This Is the Kit', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 14093; // SELECT last_insert_rowid();

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
  ('2023-04-22 08:25:36.817817', '1567', '14077'),
  ('2023-04-22 08:25:36.818818', '1567', '14085'),
  ('2023-04-22 08:25:36.818818', '1567', '14086'),
  ('2023-04-22 08:25:36.818818', '1567', '14087'),
  ('2023-04-22 08:25:36.818818', '1567', '14088'),
  ('2023-04-22 08:25:36.818818', '1567', '14089'),
  ('2023-04-22 08:25:36.819819', '1567', '14076'),
  ('2023-04-22 08:25:36.819819', '1567', '14090'),
  ('2023-04-22 08:25:36.819819', '1567', '14091'),
  ('2023-04-22 08:25:36.819819', '1567', '14083'),
  ('2023-04-22 08:25:36.819819', '1567', '14092'),
  ('2023-04-22 08:25:36.820820', '1567', '14093')
  ;

  // Update to source_song table
