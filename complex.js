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
    ('Complex', 'Best New Music This Week', 'NIGO, Latto, Kid Cudi, and More', '2022-03-25 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-nigo-latto-kid-cudi/buddy-hoochie-mama');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1176; // SELECT last_insert_rowid();
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
        "title": "Lost and Found Freestyle 2019",
        "artist_name": "Tyler, the Creator, ASAP Rocky, & NIGO",
        "video_id": null,
        "capture_date": "2022-05-26 08:21:30.129129",
        "source_id": 1176,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Trust No Bitch",
        "artist_name": "Latto",
        "video_id": null,
        "capture_date": "2022-05-26 08:21:30.130130",
        "source_id": 1176,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tamagotchi",
        "artist_name": "Omar Apollo",
        "video_id": null,
        "capture_date": "2022-05-26 08:21:30.130130",
        "source_id": 1176,
        "song_id": 11906,
        "duplicate": true
    },
    {
        "title": "No Love (Extended)",
        "artist_name": "Summer Walker & SZA f/ Cardi B",
        "video_id": null,
        "capture_date": "2022-05-26 08:21:30.130130",
        "source_id": 1176,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sanjuro",
        "artist_name": "Denzel Curry f/ 454",
        "video_id": null,
        "capture_date": "2022-05-26 08:21:30.130130",
        "source_id": 1176,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "We Go Up",
        "artist_name": "Nicki Minaj f/ Fivio Foreign",
        "video_id": null,
        "capture_date": "2022-05-26 08:21:30.130130",
        "source_id": 1176,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Stars in the Sky",
        "artist_name": "Kid Cudi",
        "video_id": null,
        "capture_date": "2022-05-26 08:21:30.130130",
        "source_id": 1176,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Child of God",
        "artist_name": "Chance the Rapper",
        "video_id": null,
        "capture_date": "2022-05-26 08:21:30.130130",
        "source_id": 1176,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "No Rap Cap",
        "artist_name": "Key Glock",
        "video_id": null,
        "capture_date": "2022-05-26 08:21:30.130130",
        "source_id": 1176,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hoochie Mama",
        "artist_name": "Buddy",
        "video_id": null,
        "capture_date": "2022-05-26 08:21:30.130130",
        "source_id": 1176,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Maybe the Next Time",
        "artist_name": "Larry June & Jay Worthy f/ Roc Marciano",
        "video_id": null,
        "capture_date": "2022-05-26 08:21:30.130130",
        "source_id": 1176,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "PEAKING",
        "artist_name": "1 800 PAIN",
        "video_id": null,
        "capture_date": "2022-05-26 08:21:30.131131",
        "source_id": 1176,
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
  ('Lost and Found Freestyle 2019', 'Tyler, the Creator, ASAP Rocky, & NIGO', NULL),
  ('Trust No Bitch', 'Latto', NULL),
  ('No Love (Extended)', 'Summer Walker & SZA f/ Cardi B', NULL),
  ('Sanjuro', 'Denzel Curry f/ 454', NULL),
  ('We Go Up', 'Nicki Minaj f/ Fivio Foreign', NULL),
  ('Stars in the Sky', 'Kid Cudi', NULL),
  ('Child of God', 'Chance the Rapper', NULL),
  ('No Rap Cap', 'Key Glock', NULL),
  ('Hoochie Mama', 'Buddy', NULL),
  ('Maybe the Next Time', 'Larry June & Jay Worthy f/ Roc Marciano', NULL),
  ('PEAKING', '1 800 PAIN', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11922; // SELECT last_insert_rowid();

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
  ('2022-05-26 08:21:30.129129', '1176', '11912'),
  ('2022-05-26 08:21:30.130130', '1176', '11913'),
  ('2022-05-26 08:21:30.130130', '1176', '11906'),
  ('2022-05-26 08:21:30.130130', '1176', '11914'),
  ('2022-05-26 08:21:30.130130', '1176', '11915'),
  ('2022-05-26 08:21:30.130130', '1176', '11916'),
  ('2022-05-26 08:21:30.130130', '1176', '11917'),
  ('2022-05-26 08:21:30.130130', '1176', '11918'),
  ('2022-05-26 08:21:30.130130', '1176', '11919'),
  ('2022-05-26 08:21:30.130130', '1176', '11920'),
  ('2022-05-26 08:21:30.130130', '1176', '11921'),
  ('2022-05-26 08:21:30.131131', '1176', '11922')
  ;

  // Update to source_song table
