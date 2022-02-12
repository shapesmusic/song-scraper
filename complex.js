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
    ('Complex', 'Best New Music This Week', 'Nicki Minaj, 2 Chainz, $NOT, and More', '2022-02-04 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-nicki-minaj-2-chainz-snot/');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1129; // SELECT last_insert_rowid();
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
        "title": "Do We Have A Problem?",
        "artist_name": "Nicki Minaj ft. Lil Baby",
        "video_id": null,
        "capture_date": "2022-02-12 01:39:05.378378",
        "source_id": 1129,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Scared Money",
        "artist_name": "YG ft. J. Cole & Moneybagg Yo",
        "video_id": null,
        "capture_date": "2022-02-12 01:39:05.379379",
        "source_id": 1129,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Outstanding",
        "artist_name": "2 Chainz ft. Roddy Ricch",
        "video_id": null,
        "capture_date": "2022-02-12 01:39:05.379379",
        "source_id": 1129,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Doja",
        "artist_name": "$NOT ft. A$AP Rocky",
        "video_id": null,
        "capture_date": "2022-02-12 01:39:05.379379",
        "source_id": 1129,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Still",
        "artist_name": "Saba ft. 6LACK & Smino",
        "video_id": null,
        "capture_date": "2022-02-12 01:39:05.379379",
        "source_id": 1129,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "John Woo Flick",
        "artist_name": "Conway the Machine ft. Benny the Butcher & Westside Gunn",
        "video_id": null,
        "capture_date": "2022-02-12 01:39:05.379379",
        "source_id": 1129,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cold Gangsta",
        "artist_name": "Yo Gotti ft. 42 Dugg",
        "video_id": null,
        "capture_date": "2022-02-12 01:39:05.380380",
        "source_id": 1129,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Locked In",
        "artist_name": "G Herbo",
        "video_id": null,
        "capture_date": "2022-02-12 01:39:05.380380",
        "source_id": 1129,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Don’t Play That",
        "artist_name": "King Von ft. 21 Savage",
        "video_id": null,
        "capture_date": "2022-02-12 01:39:05.380380",
        "source_id": 1129,
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
  ('Do We Have A Problem?', 'Nicki Minaj ft. Lil Baby', NULL),
  ('Scared Money', 'YG ft. J. Cole & Moneybagg Yo', NULL),
  ('Outstanding', '2 Chainz ft. Roddy Ricch', NULL),
  ('Doja', '$NOT ft. A$AP Rocky', NULL),
  ('Still', 'Saba ft. 6LACK & Smino', NULL),
  ('John Woo Flick', 'Conway the Machine ft. Benny the Butcher & Westside Gunn', NULL),
  ('Cold Gangsta', 'Yo Gotti ft. 42 Dugg', NULL),
  ('Locked In', 'G Herbo', NULL),
  ('Don’t Play That', 'King Von ft. 21 Savage', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11652; // SELECT last_insert_rowid();

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
  ('2022-02-12 01:39:05.378378', '1129', '11644'),
  ('2022-02-12 01:39:05.379379', '1129', '11645'),
  ('2022-02-12 01:39:05.379379', '1129', '11646'),
  ('2022-02-12 01:39:05.379379', '1129', '11647'),
  ('2022-02-12 01:39:05.379379', '1129', '11648'),
  ('2022-02-12 01:39:05.379379', '1129', '11649'),
  ('2022-02-12 01:39:05.380380', '1129', '11650'),
  ('2022-02-12 01:39:05.380380', '1129', '11651'),
  ('2022-02-12 01:39:05.380380', '1129', '11652')
  ;

  // Update to source_song table
