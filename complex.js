// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT instance_name, publication_date FROM source WHERE parent_entity = 'Complex' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  chartTitle = document.getElementsByClassName("story-title story-title__article")[0].innerText;
  parentStream = chartTitle.match(/.+?(?=:)/)[0];
  instanceName = chartTitle.match(/[^:]+$/)[0].trim();

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format publicationDate
  publicationDate = document.getElementsByClassName("info-row__datetime")[0].innerHTML.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // Get and format location
  chartLocation = window.location.href; // "location" is a reserved word

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Complex\', "
    + "\'" + parentStream + "\', "
    + "\'" + instanceName + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + chartLocation + "\');"
  );


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Complex', 'Best New Music This Week', 'Lil Uzi Vert, Future, 2 Chainz, Billie Eilish, and More', '2020-11-13 12:00:00.000000', 'https://www.complex.com/music/2020/11/best-new-music-this-week-novemeber-13/dj-scheme-corda-ski-mask-the-slump-god-take-a-daytrip-soda');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 747; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("article-list");
  element = elements[0].getElementsByTagName("h2"); // sometimes h2 or h3
  videoUrl = document.getElementsByClassName("video-lazyload");

  songsData = [];

  for (var i=0; i<element.length; i++){
    title = element[i].innerText.match(/, “(.*?)”/)[1]; // may need " or “” type quotation marks, or a comma after the artist name, or may have an &nbsp; instead of a space
    artist_name = element[i].innerText.match(/.+?(?=, “)/)[0]; // may need " or “ type quotation marks
    video_id = videoUrl[i].style.backgroundImage.match(/(?<=vi\/)(.*)(?=\/)/)[0]; // example: url("https://i.ytimg.com/vi/gejbbL1AaJk/hqdefault.jpg")

    capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

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
// Step 3: Stage songsData, find & set any duplicate songs to true, and add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Million Dollar Play",
        "artist_name": "Future & Lil Uzi Vert",
        "video_id": "E4_QFJF7DQ8",
        "capture_date": "2020-11-19 09:47:41.913913",
        "source_id": 747,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Feel a Way",
        "artist_name": "2 Chainz f/ Brent Faiyaz & Kanye West",
        "video_id": "f6vg4ZVyUW8",
        "capture_date": "2020-11-19 09:47:41.915915",
        "source_id": 747,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Therefore I Am",
        "artist_name": "Billie Eilish",
        "video_id": "RUQl6YcMalg",
        "capture_date": "2020-11-19 09:47:41.915915",
        "source_id": 747,
        "song_id": 9565,
        "duplicate": true
    },
    {
        "title": "No Save Point",
        "artist_name": "Run The Jewels",
        "video_id": "o3g0Ts60220",
        "capture_date": "2020-11-19 09:47:41.915915",
        "source_id": 747,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Holiday",
        "artist_name": "Lil Nas X",
        "video_id": "9vMLTcftlyI",
        "capture_date": "2020-11-19 09:47:41.915915",
        "source_id": 747,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "All Week",
        "artist_name": "Rod Wave",
        "video_id": "nS-DLy8yt9s",
        "capture_date": "2020-11-19 09:47:41.915915",
        "source_id": 747,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Top Say",
        "artist_name": "YoungBoy Never Broke Again",
        "video_id": "Y2uzPIxGvfw",
        "capture_date": "2020-11-19 09:47:41.915915",
        "source_id": 747,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Soda",
        "artist_name": "DJ Scheme f/ Cordae, Ski Mask the Slump God & Take a Daytrip",
        "video_id": "1-GXOrIUZjQ",
        "capture_date": "2020-11-19 09:47:41.915915",
        "source_id": 747,
        "song_id": null,
        "duplicate": false
    }
  ]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Stay Down%'
    AND artist_name LIKE '%durk%'
  ;

  // If duplicates:
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
    ('Million Dollar Play', 'Future & Lil Uzi Vert', NULL),
    ('Feel a Way', '2 Chainz f/ Brent Faiyaz & Kanye West', NULL),
    ('No Save Point', 'Run The Jewels', NULL),
    ('Holiday', 'Lil Nas X', NULL),
    ('All Week', 'Rod Wave', NULL),
    ('Top Say', 'YoungBoy Never Broke Again', NULL),
    ('Soda', 'DJ Scheme f/ Cordae, Ski Mask the Slump God & Take a Daytrip', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9574; // SELECT last_insert_rowid();

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
    ('2020-11-19 09:47:41.913913', '747', '9568'),
    ('2020-11-19 09:47:41.915915', '747', '9569'),
    ('2020-11-19 09:47:41.915915', '747', '9565'),
    ('2020-11-19 09:47:41.915915', '747', '9570'),
    ('2020-11-19 09:47:41.915915', '747', '9571'),
    ('2020-11-19 09:47:41.915915', '747', '9572'),
    ('2020-11-19 09:47:41.915915', '747', '9573'),
    ('2020-11-19 09:47:41.915915', '747', '9574')
  ;

  // Update to source_song table
