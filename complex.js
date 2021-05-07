// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'Complex' ORDER BY publication_date DESC LIMIT 8;


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
    ('Complex', 'Best New Music This Week', 'Baby Keem, Morray, DJ Khaled, and More', '2021-04-30 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-baby-keem-morray-dj-khaled/lil-eazzyy-ride-together');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 905; // SELECT last_insert_rowid();
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

  console.log(JSON.stringify(songsData, null, 4));


//
// Step 3:  Stage songsData,
//          prune unwanted songs,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Durag Activity",
        "artist_name": "Baby Keem & Travis Scott",
        "video_id": "YbgT-H39cnQ",
        "capture_date": "2021-05-07 05:58:19.014014",
        "source_id": 905,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Can’t Use Me",
        "artist_name": "Morray",
        "video_id": "NrlZ4t_rIIA",
        "capture_date": "2021-05-07 05:58:19.015015",
        "source_id": 905,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sorry Not Sorry",
        "artist_name": "DJ Khaled f/ Jay-Z, Nas, James Fauntleroy, and The Hive",
        "video_id": "mON6_EQfQFI",
        "capture_date": "2021-05-07 05:58:19.015015",
        "source_id": 905,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "All Pride Aside",
        "artist_name": "Shelley f/ Summer Walker",
        "video_id": "s7xL9RVncfA",
        "capture_date": "2021-05-07 05:58:19.015015",
        "source_id": 905,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Spiral",
        "artist_name": "21 Savage",
        "video_id": "g59R3fMnUuc",
        "capture_date": "2021-05-07 05:58:19.015015",
        "source_id": 905,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "On Me (Remix)",
        "artist_name": "Lil Baby f/ Megan Thee Stallion",
        "video_id": "8BlQPORtSsQ",
        "capture_date": "2021-05-07 05:58:19.015015",
        "source_id": 905,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Your Power",
        "artist_name": "Billie Eilish",
        "video_id": "fzeWc3zh01g",
        "capture_date": "2021-05-07 05:58:19.015015",
        "source_id": 905,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ride Together",
        "artist_name": "Lil Eazzyy",
        "video_id": "p0yvZx7zPvU",
        "capture_date": "2021-05-07 05:58:19.015015",
        "source_id": 905,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Set%'
    AND artist_name LIKE '%CJ%'
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
  ('Durag Activity', 'Baby Keem & Travis Scott', NULL),
  ('Can’t Use Me', 'Morray', NULL),
  ('Sorry Not Sorry', 'DJ Khaled f/ Jay-Z, Nas, James Fauntleroy, and The Hive', NULL),
  ('All Pride Aside', 'Shelley f/ Summer Walker', NULL),
  ('Spiral', '21 Savage', NULL),
  ('On Me (Remix)', 'Lil Baby f/ Megan Thee Stallion', NULL),
  ('Your Power', 'Billie Eilish', NULL),
  ('Ride Together', 'Lil Eazzyy', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10314; // SELECT last_insert_rowid();

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
  ('2021-05-07 05:58:19.014014', '905', '10307'),
  ('2021-05-07 05:58:19.015015', '905', '10308'),
  ('2021-05-07 05:58:19.015015', '905', '10309'),
  ('2021-05-07 05:58:19.015015', '905', '10310'),
  ('2021-05-07 05:58:19.015015', '905', '10311'),
  ('2021-05-07 05:58:19.015015', '905', '10312'),
  ('2021-05-07 05:58:19.015015', '905', '10313'),
  ('2021-05-07 05:58:19.015015', '905', '10314')
  ;

  // Update to source_song table
