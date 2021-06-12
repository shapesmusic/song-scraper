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
    ('Complex', 'Best New Music This Week', 'Lil Baby, Lil Durk, Roddy Ricch, Tinashe, and More', '2021-06-04 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-lil-baby-lil-durk/peter-rosenberg-styles-p-ransom-smoke-dza-srd');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 935; // SELECT last_insert_rowid();
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
        "title": "Hats Off",
        "artist_name": "Lil Baby & Lil Durk f/ Travis Scott",
        "video_id": "f1LO1_3-cVI",
        "capture_date": "2021-06-11 05:31:06.592592",
        "source_id": 935,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Late at Night",
        "artist_name": "Roddy Ricch",
        "video_id": "sJDRfZJFAk0",
        "capture_date": "2021-06-11 05:31:06.593593",
        "source_id": 935,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pasadena",
        "artist_name": "Tinashe & Buddy",
        "video_id": "nCfL5zCyyto",
        "capture_date": "2021-06-11 05:31:06.593593",
        "source_id": 935,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Won",
        "artist_name": "Ty Dolla Sign f/ Jack Harlow & 24kGoldn",
        "video_id": "0tQDja1Z944",
        "capture_date": "2021-06-11 05:31:06.593593",
        "source_id": 935,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Yonaguni",
        "artist_name": "Bad Bunny",
        "video_id": "doLMt10ytHY",
        "capture_date": "2021-06-11 05:31:06.593593",
        "source_id": 935,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Last Train Home",
        "artist_name": "John Mayer",
        "video_id": "66Ne5dVDfLM",
        "capture_date": "2021-06-11 05:31:06.593593",
        "source_id": 935,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Can They Hear Us",
        "artist_name": "Dua Lipa",
        "video_id": "RecnSmIrV4E",
        "capture_date": "2021-06-11 05:31:06.593593",
        "source_id": 935,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pressure / Bow Wow",
        "artist_name": "Brockhampton f/ ssgkobe",
        "video_id": "rmFklGwvVR0",
        "capture_date": "2021-06-11 05:31:06.593593",
        "source_id": 935,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "S.R.D",
        "artist_name": "Peter Rosenberg f/ Styles P, Ransom, & Smoke DZA",
        "video_id": "wzu0ABnDl6o",
        "capture_date": "2021-06-11 05:31:06.593593",
        "source_id": 935,
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
  ('Hats Off', 'Lil Baby & Lil Durk f/ Travis Scott', NULL),
  ('Late at Night', 'Roddy Ricch', NULL),
  ('Pasadena', 'Tinashe & Buddy', NULL),
  ('I Won', 'Ty Dolla Sign f/ Jack Harlow & 24kGoldn', NULL),
  ('Yonaguni', 'Bad Bunny', NULL),
  ('Last Train Home', 'John Mayer', NULL),
  ('Can They Hear Us', 'Dua Lipa', NULL),
  ('Pressure / Bow Wow', 'Brockhampton f/ ssgkobe', NULL),
  ('S.R.D', 'Peter Rosenberg f/ Styles P, Ransom, & Smoke DZA', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10521; // SELECT last_insert_rowid();

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
  ('2021-06-11 05:31:06.592592', '935', '10513'),
  ('2021-06-11 05:31:06.593593', '935', '10514'),
  ('2021-06-11 05:31:06.593593', '935', '10515'),
  ('2021-06-11 05:31:06.593593', '935', '10516'),
  ('2021-06-11 05:31:06.593593', '935', '10517'),
  ('2021-06-11 05:31:06.593593', '935', '10518'),
  ('2021-06-11 05:31:06.593593', '935', '10519'),
  ('2021-06-11 05:31:06.593593', '935', '10520'),
  ('2021-06-11 05:31:06.593593', '935', '10521')
  ;

  // Update to source_song table
