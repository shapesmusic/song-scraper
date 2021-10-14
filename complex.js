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
    ('Complex', 'Best New Music This Week', 'Don Toliver, Lil Wayne, Nas, and More', '2021-10-08 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-don-toliver-lil-wayne-nas/kelis-midnight-snacks');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1047; // SELECT last_insert_rowid();
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
          "title": "Ya Dig",
          "artist_name": "Lil Wayne",
          "video_id": null,
          "capture_date": "2021-10-13 08:33:28.149149",
          "source_id": 1047,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Swangin On Westheimer",
          "artist_name": "Don Toliver",
          "video_id": null,
          "capture_date": "2021-10-13 08:33:28.149149",
          "source_id": 1047,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Big Nas",
          "artist_name": "Nas & Hit-Boy",
          "video_id": null,
          "capture_date": "2021-10-13 08:33:28.149149",
          "source_id": 1047,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Who Want Smoke??",
          "artist_name": "Nardo Wick ft. Lil Durk, 21 Savage, & G Herbo",
          "video_id": null,
          "capture_date": "2021-10-13 08:33:28.149149",
          "source_id": 1047,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Super",
          "artist_name": "Cordae",
          "video_id": null,
          "capture_date": "2021-10-13 08:33:28.150150",
          "source_id": 1047,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Piano Love",
          "artist_name": "Conway the Machine",
          "video_id": null,
          "capture_date": "2021-10-13 08:33:28.150150",
          "source_id": 1047,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Foot Forward",
          "artist_name": "James Blake",
          "video_id": null,
          "capture_date": "2021-10-13 08:33:28.150150",
          "source_id": 1047,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Play Stupid",
          "artist_name": "Strick ft. Swae Lee",
          "video_id": null,
          "capture_date": "2021-10-13 08:33:28.150150",
          "source_id": 1047,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Hands Up",
          "artist_name": "Tyla Yaweh ft. Morray",
          "video_id": null,
          "capture_date": "2021-10-13 08:33:28.150150",
          "source_id": 1047,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Midnight Snacks",
          "artist_name": "Kelis",
          "video_id": null,
          "capture_date": "2021-10-13 08:33:28.150150",
          "source_id": 1047,
          "song_id": 10996,
          "duplicate": true
      },
      {
          "title": "Hitman",
          "artist_name": "Sleepy Hallow",
          "video_id": null,
          "capture_date": "2021-10-13 08:33:28.150150",
          "source_id": 1047,
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
  ('Ya Dig', 'Lil Wayne', NULL),
  ('Swangin On Westheimer', 'Don Toliver', NULL),
  ('Big Nas', 'Nas & Hit-Boy', NULL),
  ('Who Want Smoke??', 'Nardo Wick ft. Lil Durk, 21 Savage, & G Herbo', NULL),
  ('Super', 'Cordae', NULL),
  ('Piano Love', 'Conway the Machine', NULL),
  ('Foot Forward', 'James Blake', NULL),
  ('Play Stupid', 'Strick ft. Swae Lee', NULL),
  ('Hands Up', 'Tyla Yaweh ft. Morray', NULL),
  ('Hitman', 'Sleepy Hallow', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11113; // SELECT last_insert_rowid();

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
  ('2021-10-13 08:33:28.149149', '1047', '11104'),
  ('2021-10-13 08:33:28.149149', '1047', '11105'),
  ('2021-10-13 08:33:28.149149', '1047', '11106'),
  ('2021-10-13 08:33:28.149149', '1047', '11107'),
  ('2021-10-13 08:33:28.150150', '1047', '11108'),
  ('2021-10-13 08:33:28.150150', '1047', '11109'),
  ('2021-10-13 08:33:28.150150', '1047', '11110'),
  ('2021-10-13 08:33:28.150150', '1047', '11111'),
  ('2021-10-13 08:33:28.150150', '1047', '11112'),
  ('2021-10-13 08:33:28.150150', '1047', '10996'),
  ('2021-10-13 08:33:28.150150', '1047', '11113')
  ;

  // Update to source_song table
