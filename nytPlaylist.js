// Scroll to the bottom of the page first, so all the lazyload stuff loads.

// NOTE: sometimes two songs are grouped as one entry. This would potentially mess up `video_id` scraping.


//
// Step 0: Check recent scraped
//

  SELECT instance_name, publication_date FROM source WHERE parent_entity = 'New York Times' ORDER BY publication_date DESC LIMIT 8;


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

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('New York Times', 'The Playlist', 'St. Vincent’s Synth-Funk ‘Pain,’ and 9 More New Songs', '2021-03-05 09:09:36.000000', 'https://www.nytimes.com/2021/03/05/arts/music/playlist-drake-bruno-mars-st-vincent.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 806; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("css-ow6j0y eoo0vm40"); // this class changes periodically

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

  JSON.stringify(songsData, null, 4);


//
// Step 3:  Stage songsData,
//          preview chart and prune songs,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Pay Your Way in Pain",
        "artist_name": "St. Vincent",
        "video_id": null,
        "capture_date": "2021-03-09 03:18:33.479479",
        "source_id": 806,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Spinning",
        "artist_name": "No Rome featuring Charli XCX and the 1975",
        "video_id": null,
        "capture_date": "2021-03-09 03:18:33.480480",
        "source_id": 806,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Leave the Door Open",
        "artist_name": "Bruno Mars, Anderson .Paak, Silk Sonic",
        "video_id": null,
        "capture_date": "2021-03-09 03:18:33.480480",
        "source_id": 806,
        "song_id": 9951,
        "duplicate": true
    },
    {
        "title": "Lemon Pepper Freestyle",
        "artist_name": "Drake featuring Rick Ross",
        "video_id": null,
        "capture_date": "2021-03-09 03:18:33.480480",
        "source_id": 806,
        "song_id": 9948,
        "duplicate": true
    },
    {
        "title": "Sacrifice",
        "artist_name": "Bebe Rexha",
        "video_id": null,
        "capture_date": "2021-03-09 03:18:33.480480",
        "source_id": 806,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Can’t Let It Show",
        "artist_name": "Tank",
        "video_id": null,
        "capture_date": "2021-03-09 03:18:33.480480",
        "source_id": 806,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Beautiful Mistakes",
        "artist_name": "Maroon 5 featuring Megan Thee Stallion",
        "video_id": null,
        "capture_date": "2021-03-09 03:18:33.480480",
        "source_id": 806,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Til Forever Falls Apart",
        "artist_name": "Ashe and Finneas",
        "video_id": null,
        "capture_date": "2021-03-09 03:18:33.480480",
        "source_id": 806,
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
  ('Pay Your Way in Pain', 'St. Vincent', NULL),
  ('Spinning', 'No Rome featuring Charli XCX and the 1975', NULL),
  ('Sacrifice', 'Bebe Rexha', NULL),
  ('Can’t Let It Show', 'Tank', NULL),
  ('Beautiful Mistakes', 'Maroon 5 featuring Megan Thee Stallion', NULL),
  ('Til Forever Falls Apart', 'Ashe and Finneas', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9966; // SELECT last_insert_rowid();

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
  ('2021-03-09 03:18:33.479479', '806', '9961'),
  ('2021-03-09 03:18:33.480480', '806', '9962'),
  ('2021-03-09 03:18:33.480480', '806', '9951'),
  ('2021-03-09 03:18:33.480480', '806', '9948'),
  ('2021-03-09 03:18:33.480480', '806', '9963'),
  ('2021-03-09 03:18:33.480480', '806', '9964'),
  ('2021-03-09 03:18:33.480480', '806', '9965'),
  ('2021-03-09 03:18:33.480480', '806', '9966')
  ;

  // Update to source_song table
