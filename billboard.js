//
// Step 0: Check recent scraped
//

  SELECT instance_name FROM source WHERE parent_entity = 'Billboard' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format publicationDate
  publicationDate = document.getElementsByClassName('date-selector__button button--link')[0].innerText.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // Get location and format for current or past chart status
  currentChartLocation = window.location.href + "/" + moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD");
  pastChartLocation = window.location.href;

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Billboard\', \'The Hot 100\', \'Week of "
    + publicationDate + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + pastChartLocation + "\');" // use pastChartLocation if not the current week's chart, otherwise use currentChartLocation
  )


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Billboard', 'The Hot 100', 'Week of February 13, 2021', '2021-02-13 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-02-13');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 770; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName('chart-list__element display--flex');

  songsData = [];

  for (var i=0; i<elements.length; i++){
      element = elements[i];
      isNew = element.getElementsByClassName('chart-element__trend chart-element__trend--new color--accent');
      songName = element.getElementsByClassName('chart-element__information__song text--truncate color--primary')[0];
      artistName = element.getElementsByClassName('chart-element__information__artist text--truncate color--secondary')[0];

      title = songName.innerText.trim();
      artist_name = artistName.innerText.trim();
      video_id = null;
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

      if(isNew.length == 1 && isNew[0].innerText == "New"){ // because innerText can also be "Re-Enter"

        songsData.push(songData);

      };
  };

  JSON.stringify(songsData, null, 4);


//
// Step 3: Stage songsData, prune unwanted songs, find & set any duplicate songs to true, and add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Finesse Out The Gang Way",
        "artist_name": "Lil Durk Featuring Lil Baby",
        "video_id": null,
        "capture_date": "2021-02-27 08:23:17.500500",
        "source_id": 770,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Should've Ducked",
        "artist_name": "Lil Durk Featuring Pooh Shiesty",
        "video_id": null,
        "capture_date": "2021-02-27 08:23:17.501501",
        "source_id": 770,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gravity",
        "artist_name": "Brent Faiyaz & DJ Dahi Featuring Tyler, The Creator",
        "video_id": null,
        "capture_date": "2021-02-27 08:23:17.502502",
        "source_id": 770,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Baila Conmigo",
        "artist_name": "Selena Gomez With Rauw Alejandro",
        "video_id": null,
        "capture_date": "2021-02-27 08:23:17.502502",
        "source_id": 770,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Kanye Krazy",
        "artist_name": "Lil Durk",
        "video_id": null,
        "capture_date": "2021-02-27 08:23:17.503503",
        "source_id": 770,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fake Woke",
        "artist_name": "Tom MacDonald",
        "video_id": null,
        "capture_date": "2021-02-27 08:23:17.503503",
        "source_id": 770,
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
  ('Finesse Out The Gang Way', 'Lil Durk Featuring Lil Baby', NULL),
  ('Should’ve Ducked', 'Lil Durk Featuring Pooh Shiesty', NULL),
  ('Gravity', 'Brent Faiyaz & DJ Dahi Featuring Tyler, The Creator', NULL),
  ('Baila Conmigo', 'Selena Gomez With Rauw Alejandro', NULL),
  ('Kanye Krazy', 'Lil Durk', NULL),
  ('Fake Woke', 'Tom MacDonald', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9773; // SELECT last_insert_rowid();

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
  ('2021-02-27 08:23:17.500500', '770', '9768'),
  ('2021-02-27 08:23:17.501501', '770', '9769'),
  ('2021-02-27 08:23:17.502502', '770', '9770'),
  ('2021-02-27 08:23:17.502502', '770', '9771'),
  ('2021-02-27 08:23:17.503503', '770', '9772'),
  ('2021-02-27 08:23:17.503503', '770', '9773')
  ;

  // Update to source_song table
