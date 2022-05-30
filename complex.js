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
    ('Complex', 'Best New Music This Week', 'Lil Durk, Babyface Ray, Quavo, Takeoff, and More', '2022-05-20 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-may-20/dreezy-hit-boy-future-sliders');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1215; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("article-list");
  element = elements[0].getElementsByTagName("h2"); // sometimes h2 or h3
  // videoUrl = document.getElementsByClassName("video-lazyload");

  songsData = [];

  for (var i=0; i<element.length; i++){
    title = element[i].innerText.match(/, “(.*?)”/)[1]; // may need " or “” type quotation marks, or a comma after the artist name, or may have an &nbsp; instead of a space
    artist_name = element[i].innerText.match(/.+?(?=, “)/)[0]; // may need " or “ type quotation marks
    video_id = null
      // replace null with below to grab video IDs (when all songs are YT)
      // videoUrl[i].style.backgroundImage.match(/(?<=vi\/)(.*)(?=\/)/)[0];

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
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//          find and replace f[slash] with "ft."
//

  songsData =
  [
    {
        "title": "Hotel Lobby (Unc and Phew)",
        "artist_name": "Quavo & Takeoff",
        "video_id": null,
        "capture_date": "2022-05-30 07:39:36.028028",
        "source_id": 1215,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Computer Murderers",
        "artist_name": "Lil Durk",
        "video_id": null,
        "capture_date": "2022-05-30 07:39:36.029029",
        "source_id": 1215,
        "song_id": 11891,
        "duplicate": true
    },
    {
        "title": "Congratulations",
        "artist_name": "Babyface Ray ft. DJ ESCO & Lil Yachty",
        "video_id": null,
        "capture_date": "2022-05-30 07:39:36.029029",
        "source_id": 1215,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "GOAT",
        "artist_name": "Symba",
        "video_id": null,
        "capture_date": "2022-05-30 07:39:36.029029",
        "source_id": 1215,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Body",
        "artist_name": "070 Shake ft. Christine and the Queens",
        "video_id": null,
        "capture_date": "2022-05-30 07:39:36.029029",
        "source_id": 1215,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "No Reason",
        "artist_name": "Lil Gnar ft. Lil Keed & Yak Gotti",
        "video_id": null,
        "capture_date": "2022-05-30 07:39:36.029029",
        "source_id": 1215,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "FYK",
        "artist_name": "TiaCorine",
        "video_id": null,
        "capture_date": "2022-05-30 07:39:36.029029",
        "source_id": 1215,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Daydreaming",
        "artist_name": "Harry Styles",
        "video_id": null,
        "capture_date": "2022-05-30 07:39:36.029029",
        "source_id": 1215,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sliders",
        "artist_name": "Dreezy & Hit-Boy ft. Future",
        "video_id": null,
        "capture_date": "2022-05-30 07:39:36.029029",
        "source_id": 1215,
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
  ('Hotel Lobby (Unc and Phew)', 'Quavo & Takeoff', NULL),
  ('Congratulations', 'Babyface Ray ft. DJ ESCO & Lil Yachty', NULL),
  ('GOAT', 'Symba', NULL),
  ('Body', '070 Shake ft. Christine and the Queens', NULL),
  ('No Reason', 'Lil Gnar ft. Lil Keed & Yak Gotti', NULL),
  ('FYK', 'TiaCorine', NULL),
  ('Daydreaming', 'Harry Styles', NULL),
  ('Sliders', 'Dreezy & Hit-Boy ft. Future', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12268; // SELECT last_insert_rowid();

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
  ('2022-05-30 07:39:36.028028', '1215', '12261'),
  ('2022-05-30 07:39:36.029029', '1215', '11891'),
  ('2022-05-30 07:39:36.029029', '1215', '12262'),
  ('2022-05-30 07:39:36.029029', '1215', '12263'),
  ('2022-05-30 07:39:36.029029', '1215', '12264'),
  ('2022-05-30 07:39:36.029029', '1215', '12265'),
  ('2022-05-30 07:39:36.029029', '1215', '12266'),
  ('2022-05-30 07:39:36.029029', '1215', '12267'),
  ('2022-05-30 07:39:36.029029', '1215', '12268')
  ;

  // Update to source_song table
