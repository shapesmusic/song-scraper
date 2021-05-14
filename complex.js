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
    ('Complex', 'Best New Music This Week', 'J. Cole, Isaiah Rashad, Don Toliver, and More', '2021-05-07 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-j-cole-isaiah-rashad/');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 910; // SELECT last_insert_rowid();
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
        "title": "Interlude",
        "artist_name": "J. Cole",
        "video_id": "XK60CAyxqfE",
        "capture_date": "2021-05-14 07:28:30.751751",
        "source_id": 910,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lean Wit Ya",
        "artist_name": "Isaiah Rashad f/ Duke Deuce",
        "video_id": "dzrQCsJzr70",
        "capture_date": "2021-05-14 07:28:30.752752",
        "source_id": 910,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "What You Need",
        "artist_name": "Don Toliver",
        "video_id": "qFIJHaylMu4",
        "capture_date": "2021-05-14 07:28:30.752752",
        "source_id": 910,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bout Me",
        "artist_name": "Coi Leray",
        "video_id": "wLKbKYDmonk",
        "capture_date": "2021-05-14 07:28:30.752752",
        "source_id": 910,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Miss the Rage",
        "artist_name": "Trippie Redd f/ Playboi Carti",
        "video_id": "lqrVRKlVLXM",
        "capture_date": "2021-05-14 07:28:30.752752",
        "source_id": 910,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Purple Baby",
        "artist_name": "Quando Rondo",
        "video_id": "d56G9W4n4vQ",
        "capture_date": "2021-05-14 07:28:30.752752",
        "source_id": 910,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Grizzley Talk",
        "artist_name": "Tee Grizzley",
        "video_id": "wxPr1rFLVDs",
        "capture_date": "2021-05-14 07:28:30.752752",
        "source_id": 910,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fast (Motion)",
        "artist_name": "Saweetie",
        "video_id": "mkiA9tuJ-xM",
        "capture_date": "2021-05-14 07:28:30.752752",
        "source_id": 910,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Czarwyn’s Theory of People Getting Loose",
        "artist_name": "MF DOOM & Czarface f/ Kendra Morris",
        "video_id": "JMvjBLxOAHk",
        "capture_date": "2021-05-14 07:28:30.752752",
        "source_id": 910,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "On Gang",
        "artist_name": "Chief Keef, Tadoe, & Ballout",
        "video_id": "kKaDyKx_9II",
        "capture_date": "2021-05-14 07:28:30.752752",
        "source_id": 910,
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
  ('Interlude', 'J. Cole', NULL),
  ('Lean Wit Ya', 'Isaiah Rashad f/ Duke Deuce', NULL),
  ('What You Need', 'Don Toliver', NULL),
  ('Bout Me', 'Coi Leray', NULL),
  ('Miss the Rage', 'Trippie Redd f/ Playboi Carti', NULL),
  ('Purple Baby', 'Quando Rondo', NULL),
  ('Grizzley Talk', 'Tee Grizzley', NULL),
  ('Fast (Motion)', 'Saweetie', NULL),
  ('Czarwyn’s Theory of People Getting Loose', 'MF DOOM & Czarface f/ Kendra Morris', NULL),
  ('On Gang', 'Chief Keef, Tadoe, & Ballout', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10357; // SELECT last_insert_rowid();

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
  ('2021-05-14 07:28:30.751751', '910', '10348'),
  ('2021-05-14 07:28:30.752752', '910', '10349'),
  ('2021-05-14 07:28:30.752752', '910', '10350'),
  ('2021-05-14 07:28:30.752752', '910', '10351'),
  ('2021-05-14 07:28:30.752752', '910', '10352'),
  ('2021-05-14 07:28:30.752752', '910', '10353'),
  ('2021-05-14 07:28:30.752752', '910', '10354'),
  ('2021-05-14 07:28:30.752752', '910', '10355'),
  ('2021-05-14 07:28:30.752752', '910', '10356'),
  ('2021-05-14 07:28:30.752752', '910', '10357')
  ;

  // Update to source_song table
