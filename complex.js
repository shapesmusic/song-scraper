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
    ('Complex', 'Best New Music This Week', 'Cardi B, Freddie Gibbs, Polo G, and More', '2021-02-05 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-cardi-b-freddie-gibbs-polo-g/morray-kingdom');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 777; // SELECT last_insert_rowid();
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
// Step 3: Stage songsData, prune unwanted songs, find & set any duplicate songs to true, and add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Up",
        "artist_name": "Cardi B",
        "video_id": "rCiBgLOcuKU",
        "capture_date": "2021-02-28 03:42:32.299299",
        "source_id": 777,
        "song_id": 9774,
        "duplicate": true
    },
    {
        "title": "Gang Signs",
        "artist_name": "Freddie Gibbs f/ Schoolboy Q",
        "video_id": "_WnXMMOkubA",
        "capture_date": "2021-02-28 03:42:32.300300",
        "source_id": 777,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "GNF (OKOKOK)",
        "artist_name": "Polo G",
        "video_id": "gxykC33lTiQ",
        "capture_date": "2021-02-28 03:42:32.301301",
        "source_id": 777,
        "song_id": 9777,
        "duplicate": true
    },
    {
        "title": "Love You Too",
        "artist_name": "Lil Durk f/ Kehlani",
        "video_id": "GZagrum0fbQ",
        "capture_date": "2021-02-28 03:42:32.301301",
        "source_id": 777,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Toxic Punk",
        "artist_name": "YoungBoy Never Broke Again",
        "video_id": "q5Cq_bNbZjM",
        "capture_date": "2021-02-28 03:42:32.301301",
        "source_id": 777,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bruuuh (Remix)",
        "artist_name": "JID f/ Denzel Curry",
        "video_id": "yaCNI_W-lNQ",
        "capture_date": "2021-02-28 03:42:32.301301",
        "source_id": 777,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Forest Fire",
        "artist_name": "Jevon",
        "video_id": "8Mhk0SAsY9E",
        "capture_date": "2021-02-28 03:42:32.301301",
        "source_id": 777,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "0006TeslaSpaceForce",
        "artist_name": "Whiterosemoxie",
        "video_id": "R-nv2OPtGb4",
        "capture_date": "2021-02-28 03:42:32.301301",
        "source_id": 777,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Kingdom",
        "artist_name": "Morray",
        "video_id": "X_lO3YrI4Y0",
        "capture_date": "2021-02-28 03:42:32.301301",
        "source_id": 777,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Stay Down%'
    AND artist_name LIKE '%durk%'
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
  ('Gang Signs', 'Freddie Gibbs f/ Schoolboy Q', NULL),
  ('Love You Too', 'Lil Durk f/ Kehlani', NULL),
  ('Toxic Punk', 'YoungBoy Never Broke Again', NULL),
  ('Bruuuh (Remix)', 'JID f/ Denzel Curry', NULL),
  ('Forest Fire', 'Jevon', NULL),
  ('0006TeslaSpaceForce', 'Whiterosemoxie', NULL),
  ('Kingdom', 'Morray', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9825; // SELECT last_insert_rowid();

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
  ('2021-02-28 03:42:32.299299', '777', '9774'),
  ('2021-02-28 03:42:32.300300', '777', '9819'),
  ('2021-02-28 03:42:32.301301', '777', '9777'),
  ('2021-02-28 03:42:32.301301', '777', '9820'),
  ('2021-02-28 03:42:32.301301', '777', '9821'),
  ('2021-02-28 03:42:32.301301', '777', '9822'),
  ('2021-02-28 03:42:32.301301', '777', '9823'),
  ('2021-02-28 03:42:32.301301', '777', '9824'),
  ('2021-02-28 03:42:32.301301', '777', '9825')
  ;

  // Update to source_song table
