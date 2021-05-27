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
    ('Complex', 'Best New Music This Week', 'Polo G, 42 Dugg, Latto, and More', '2021-05-21 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-polo-g-42-dugg-latto/city-girls-twerkulator');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 918; // SELECT last_insert_rowid();
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
        "title": "Gang Gang",
        "artist_name": "Polo G f/ Lil Wayne",
        "video_id": "HQE456q4n5U",
        "capture_date": "2021-05-27 06:52:30.734734",
        "source_id": 918,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Stunnaman",
        "artist_name": "Birdman & Roddy Ricch f/ Lil Wayne",
        "video_id": "F5cCfs1COCc",
        "capture_date": "2021-05-27 06:52:30.735735",
        "source_id": 918,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Maybach",
        "artist_name": "42 Dugg f/ Future",
        "video_id": "gVGRIBWy6ig",
        "capture_date": "2021-05-27 06:52:30.736736",
        "source_id": 918,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Biggest",
        "artist_name": "Latto",
        "video_id": "jnu18ElApyc",
        "capture_date": "2021-05-27 06:52:30.736736",
        "source_id": 918,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "We Win",
        "artist_name": "Kirk Franklin & Lil Baby",
        "video_id": "C_hmHcoleYo",
        "capture_date": "2021-05-27 06:52:30.736736",
        "source_id": 918,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sun Goes Down",
        "artist_name": "Lil Nas X",
        "video_id": "U3BVFY9wnTw",
        "capture_date": "2021-05-27 06:52:30.736736",
        "source_id": 918,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "24 Hours",
        "artist_name": "A Boogie f/ Lil Durk",
        "video_id": "1x_pngHLhRk",
        "capture_date": "2021-05-27 06:52:30.736736",
        "source_id": 918,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Traitor",
        "artist_name": "Olivia Rodrigo",
        "video_id": "6tsu2oeZJgo",
        "capture_date": "2021-05-27 06:52:30.736736",
        "source_id": 918,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Twerkulator",
        "artist_name": "City Girls",
        "video_id": "j8CCx7O8PAY",
        "capture_date": "2021-05-27 06:52:30.736736",
        "source_id": 918,
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
  ('Gang Gang', 'Polo G f/ Lil Wayne', NULL),
  ('Stunnaman', 'Birdman & Roddy Ricch f/ Lil Wayne', NULL),
  ('Maybach', '42 Dugg f/ Future', NULL),
  ('The Biggest', 'Latto', NULL),
  ('We Win', 'Kirk Franklin & Lil Baby', NULL),
  ('Sun Goes Down', 'Lil Nas X', NULL),
  ('24 Hours', 'A Boogie f/ Lil Durk', NULL),
  ('Traitor', 'Olivia Rodrigo', NULL),
  ('Twerkulator', 'City Girls', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10438; // SELECT last_insert_rowid();

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
  ('2021-05-27 06:52:30.734734', '918', '10430'),
  ('2021-05-27 06:52:30.735735', '918', '10431'),
  ('2021-05-27 06:52:30.736736', '918', '10432'),
  ('2021-05-27 06:52:30.736736', '918', '10433'),
  ('2021-05-27 06:52:30.736736', '918', '10434'),
  ('2021-05-27 06:52:30.736736', '918', '10435'),
  ('2021-05-27 06:52:30.736736', '918', '10436'),
  ('2021-05-27 06:52:30.736736', '918', '10437'),
  ('2021-05-27 06:52:30.736736', '918', '10438')
  ;

  // Update to source_song table
