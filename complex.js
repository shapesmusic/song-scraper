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
    ('Complex', 'Best New Music This Week', 'Rowdy Rebel, Juice WRLD, Joey Badass, and More', '2021-01-22 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-rowdy-rebel-juice-wrld-joey-badass/smino-mlk-dr');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 775; // SELECT last_insert_rowid();
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
        "title": "Re Route",
        "artist_name": "Rowdy Rebel & Funk Flex",
        "video_id": "Y0kyvUNKkoU",
        "capture_date": "2021-02-28 08:43:15.103103",
        "source_id": 775,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Let It Breathe",
        "artist_name": "Joey Badass",
        "video_id": "0WGPP_3BPPQ",
        "capture_date": "2021-02-28 08:43:15.104104",
        "source_id": 775,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Buck 50",
        "artist_name": "Juice WRLD & DJ Scheme",
        "video_id": "hwCEFbJDCqg",
        "capture_date": "2021-02-28 08:43:15.104104",
        "source_id": 775,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lo Vas Olvidar",
        "artist_name": "Billie Eilish & ROSALÍA",
        "video_id": "8TsWkuWWXgc",
        "capture_date": "2021-02-28 08:43:15.104104",
        "source_id": 775,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pomegranate",
        "artist_name": "Kota the Friend",
        "video_id": "F7XZEZRA8hk",
        "capture_date": "2021-02-28 08:43:15.104104",
        "source_id": 775,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Soldiers Steppin",
        "artist_name": "Duke Deuce",
        "video_id": "cZhvZrMo4Ao",
        "capture_date": "2021-02-28 08:43:15.104104",
        "source_id": 775,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Nasty",
        "artist_name": "Rich the Kid f/ Mulatto, Flo Milli & Rubi Rose",
        "video_id": "xgqKglrS3X4",
        "capture_date": "2021-02-28 08:43:15.104104",
        "source_id": 775,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rose Gold",
        "artist_name": "PnB Rock f/ King Von",
        "video_id": "HPMXd2CMvuQ",
        "capture_date": "2021-02-28 08:43:15.104104",
        "source_id": 775,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Take 5",
        "artist_name": "Lil Skies",
        "video_id": "XmAtvFYmzN4",
        "capture_date": "2021-02-28 08:43:15.104104",
        "source_id": 775,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "MLK Dr",
        "artist_name": "Smino",
        "video_id": "AGscu-qCHh8",
        "capture_date": "2021-02-28 08:43:15.104104",
        "source_id": 775,
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
  ('Re Route', 'Rowdy Rebel & Funk Flex', NULL),
  ('Let It Breathe', 'Joey Badass', NULL),
  ('Buck 50', 'Juice WRLD & DJ Scheme', NULL),
  ('Lo Vas Olvidar', 'Billie Eilish & ROSALÍA', NULL),
  ('Pomegranate', 'Kota the Friend', NULL),
  ('Soldiers Steppin', 'Duke Deuce', NULL),
  ('Nasty', 'Rich the Kid f/ Mulatto, Flo Milli & Rubi Rose', NULL),
  ('Rose Gold', 'PnB Rock f/ King Von', NULL),
  ('Take 5', 'Lil Skies', NULL),
  ('MLK Dr', 'Smino', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9813; // SELECT last_insert_rowid();

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
  ('2021-02-28 08:43:15.103103', '775', '9804'),
  ('2021-02-28 08:43:15.104104', '775', '9805'),
  ('2021-02-28 08:43:15.104104', '775', '9806'),
  ('2021-02-28 08:43:15.104104', '775', '9807'),
  ('2021-02-28 08:43:15.104104', '775', '9808'),
  ('2021-02-28 08:43:15.104104', '775', '9809'),
  ('2021-02-28 08:43:15.104104', '775', '9810'),
  ('2021-02-28 08:43:15.104104', '775', '9811'),
  ('2021-02-28 08:43:15.104104', '775', '9812'),
  ('2021-02-28 08:43:15.104104', '775', '9813')
  ;

  // Update to source_song table
