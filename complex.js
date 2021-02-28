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
    ('Complex', 'Best New Music This Week', 'Brent Faiyaz, Lil Durk, Ty Dolla Sign, and More', '2021-01-29 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-brent-faiyaz-lil-durk-ty-dolla-sign/madlib-hopprock');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 776; // SELECT last_insert_rowid();
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
        "title": "Gravity",
        "artist_name": "Brent Faiyaz f/ Tyler, the Creator",
        "video_id": "FBM4cdml6Qs",
        "capture_date": "2021-02-28 02:02:23.781781",
        "source_id": 776,
        "song_id": 9770,
        "duplicate": true
    },
    {
        "title": "Kanye Krazy",
        "artist_name": "Lil Durk",
        "video_id": "pLBCPLhQ_HY",
        "capture_date": "2021-02-28 02:02:23.782782",
        "source_id": 776,
        "song_id": 9772,
        "duplicate": true
    },
    {
        "title": "Spicy Remix",
        "artist_name": "Ty Dolla Sign f/ J Balvin, YG, Tyga, & Post Malone",
        "video_id": "E_95Zi9BZVw",
        "capture_date": "2021-02-28 02:02:23.782782",
        "source_id": 776,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Burner on Deck",
        "artist_name": "Fredo f/ Pop Smoke & Young Adz",
        "video_id": "2Mi5b4GgWNs",
        "capture_date": "2021-02-28 02:02:23.783783",
        "source_id": 776,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "GFU",
        "artist_name": "Yak Gotti & Yung Kayo f/ Sheck Wes",
        "video_id": "LdqijGtpXig",
        "capture_date": "2021-02-28 02:02:23.783783",
        "source_id": 776,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bop",
        "artist_name": "CJ",
        "video_id": "ph4XVAPeZxk",
        "capture_date": "2021-02-28 02:02:23.783783",
        "source_id": 776,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hopprock",
        "artist_name": "Madlib",
        "video_id": "iOmgkVF5Anw",
        "capture_date": "2021-02-28 02:02:23.783783",
        "source_id": 776,
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
  ('Spicy Remix', 'Ty Dolla Sign f/ J Balvin, YG, Tyga, & Post Malone', NULL),
  ('Burner on Deck', 'Fredo f/ Pop Smoke & Young Adz', NULL),
  ('GFU', 'Yak Gotti & Yung Kayo f/ Sheck Wes', NULL),
  ('Bop', 'CJ', NULL),
  ('Hopprock', 'Madlib', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9818; // SELECT last_insert_rowid();

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
  ('2021-02-28 02:02:23.781781', '776', '9770'),
  ('2021-02-28 02:02:23.782782', '776', '9772'),
  ('2021-02-28 02:02:23.782782', '776', '9814'),
  ('2021-02-28 02:02:23.783783', '776', '9815'),
  ('2021-02-28 02:02:23.783783', '776', '9816'),
  ('2021-02-28 02:02:23.783783', '776', '9817'),
  ('2021-02-28 02:02:23.783783', '776', '9818')
  ;

  // Update to source_song table
