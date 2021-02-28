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
    ('Complex', 'Best New Music This Week', 'Saweetie, Westside Gunn, Dsvn, and More', '2021-01-08 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-saweetie-westside-gunn-dvsn/yg-day-sulan-d3szn-hit-em-up');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 773; // SELECT last_insert_rowid();
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
        "title": "MAZZA",
        "artist_name": "Slowthai f/ ASAP Rocky",
        "video_id": "1NhyFEZKq48",
        "capture_date": "2021-02-28 08:26:52.082082",
        "source_id": 773,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Girl Like Me",
        "artist_name": "Jazmine Sullivan f/ H.E.R",
        "video_id": "8TLty1mCrPA",
        "capture_date": "2021-02-28 08:26:52.083083",
        "source_id": 773,
        "song_id": 9755,
        "duplicate": true
    },
    {
        "title": "The Hurt Business",
        "artist_name": "Westside Gunn, Smoke DZA & Wale",
        "video_id": "a5HySSrw9JE",
        "capture_date": "2021-02-28 08:26:52.083083",
        "source_id": 773,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Her Honeymoon",
        "artist_name": "RMR",
        "video_id": "K464rsGt9J8",
        "capture_date": "2021-02-28 08:26:52.083083",
        "source_id": 773,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Best Friend",
        "artist_name": "Saweetie f/ Doja Cat",
        "video_id": "_xJUCsyMQes",
        "capture_date": "2021-02-28 08:26:52.083083",
        "source_id": 773,
        "song_id": 9741,
        "duplicate": true
    },
    {
        "title": "Use Somebody",
        "artist_name": "Dvsn",
        "video_id": "yiMrzqdFiA4",
        "capture_date": "2021-02-28 08:26:52.083083",
        "source_id": 773,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Chicken N Dumplins",
        "artist_name": "GRIP",
        "video_id": "7IsbOmJDLT8",
        "capture_date": "2021-02-28 08:26:52.083083",
        "source_id": 773,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hit Em Up",
        "artist_name": "YG, Day Sulan, and D3szn",
        "video_id": "TRRqR5rRRec",
        "capture_date": "2021-02-28 08:26:52.083083",
        "source_id": 773,
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
  ('MAZZA', 'Slowthai f/ ASAP Rocky', NULL),
  ('The Hurt Business', 'Westside Gunn, Smoke DZA & Wale', NULL),
  ('Her Honeymoon', 'RMR', NULL),
  ('Use Somebody', 'Dvsn', NULL),
  ('Chicken N Dumplins', 'GRIP', NULL),
  ('Hit Em Up', 'YG, Day Sulan, and D3szn', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9799; // SELECT last_insert_rowid();

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
  ('2021-02-28 08:26:52.082082', '773', '9794'),
  ('2021-02-28 08:26:52.083083', '773', '9755'),
  ('2021-02-28 08:26:52.083083', '773', '9795'),
  ('2021-02-28 08:26:52.083083', '773', '9796'),
  ('2021-02-28 08:26:52.083083', '773', '9741'),
  ('2021-02-28 08:26:52.083083', '773', '9797'),
  ('2021-02-28 08:26:52.083083', '773', '9798'),
  ('2021-02-28 08:26:52.083083', '773', '9799')
  ;

  // Update to source_song table
