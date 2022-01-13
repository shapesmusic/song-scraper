// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'Stereogum' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format publicationDate
  publicationDate = document.getElementsByClassName("date")[0].innerText.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // Get source name info
  chartTitle = document.getElementsByClassName("hero__title headline")[0].innerText;
  parentStream = chartTitle;
  instanceName = "Week of " + publicationDate;

  // Get and format location
  chartLocation = window.location.href; // "location" is a reserved word

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Stereogum\', "
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
    ('Stereogum', 'The 5 Best Songs Of The Week', 'Week of January 7, 2022', '2022-01-07 12:00:00.000000', 'https://www.stereogum.com/2172203/the-5-best-songs-of-the-week-415/lists/the-5-best-songs-of-the-week/');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1099; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("list-module__title small");

  songsData = [];

  for (var i=0; i<elements.length; i++){
    title = elements[i].innerText.match(/- "(.*?)"/)[1]; // may need " or “” type quotation marks
    artist_name = elements[i].innerText.match(/.+?(?=- ")/)[0]; // may need " or “ type quotation marks
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
//          find and replace "ft."
//

  songsData =
  [
      {
          "title": "Alien Sex",
          "artist_name": "Ski Mask The Slump God ",
          "video_id": null,
          "capture_date": "2022-01-12 10:04:19.635635",
          "source_id": 1099,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Hard Drive",
          "artist_name": "Thanks For Coming ",
          "video_id": null,
          "capture_date": "2022-01-12 10:04:19.636636",
          "source_id": 1099,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Everything Is Simple",
          "artist_name": "Widowspeak ",
          "video_id": null,
          "capture_date": "2022-01-12 10:04:19.637637",
          "source_id": 1099,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Happy New Year",
          "artist_name": "Let's Eat Grandma ",
          "video_id": null,
          "capture_date": "2022-01-12 10:04:19.637637",
          "source_id": 1099,
          "song_id": 11473,
          "duplicate": true
      },
      {
          "title": "You Will Never Work In Television Again",
          "artist_name": "The Smile ",
          "video_id": null,
          "capture_date": "2022-01-12 10:04:19.637637",
          "source_id": 1099,
          "song_id": 11453,
          "duplicate": true
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
  ('Alien Sex', 'Ski Mask The Slump God ', NULL),
  ('Hard Drive', 'Thanks For Coming ', NULL),
  ('Everything Is Simple', 'Widowspeak ', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11489; // SELECT last_insert_rowid();

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
  ('2022-01-12 10:04:19.635635', '1099', '11487'),
  ('2022-01-12 10:04:19.636636', '1099', '11488'),
  ('2022-01-12 10:04:19.637637', '1099', '11489'),
  ('2022-01-12 10:04:19.637637', '1099', '11473'),
  ('2022-01-12 10:04:19.637637', '1099', '11453')
  ;

  // Update to source_song table
