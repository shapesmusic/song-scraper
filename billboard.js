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
    + "\'" + currentChartLocation + "\');" // use pastChartLocation if not the current week's chart
  )

  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Billboard', 'The Hot 100', 'Week of November 21, 2020', '2020-11-21 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2020-11-21');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 746; // SELECT last_insert_rowid();
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
// Step 3: Stage songsData, find & set any duplicate songs to true, and add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "What That Speed Bout!?",
        "artist_name": "Mike WiLL Made-It, Nicki Minaj & YoungBoy Never Broke Again",
        "video_id": null,
        "capture_date": "2020-11-19 09:36:35.079079",
        "source_id": 746,
        "song_id": 9540,
        "duplicate": true
    },
    {
        "title": "Took Her To The O",
        "artist_name": "King Von",
        "video_id": null,
        "capture_date": "2020-11-19 09:36:35.079079",
        "source_id": 746,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Don't Need Friends",
        "artist_name": "NAV Featuring Lil Baby",
        "video_id": null,
        "capture_date": "2020-11-19 09:36:35.079079",
        "source_id": 746,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Code",
        "artist_name": "King Von Featuring Polo G",
        "video_id": null,
        "capture_date": "2020-11-19 09:36:35.080080",
        "source_id": 746,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tragic",
        "artist_name": "The Kid LAROI Featuring YoungBoy Never Brok Again & Internet Money",
        "video_id": null,
        "capture_date": "2020-11-19 09:36:35.080080",
        "source_id": 746,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "All These N**gas",
        "artist_name": "King Von Featuring Lil Durk",
        "video_id": null,
        "capture_date": "2020-11-19 09:36:35.080080",
        "source_id": 746,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Crazy Story 2.0",
        "artist_name": "King Von Featuring Lil Durk",
        "video_id": null,
        "capture_date": "2020-11-19 09:36:35.080080",
        "source_id": 746,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Always Do",
        "artist_name": "The Kid LAROI",
        "video_id": null,
        "capture_date": "2020-11-19 09:36:35.080080",
        "source_id": 746,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Young Wheezy",
        "artist_name": "NAV With Gunna",
        "video_id": null,
        "capture_date": "2020-11-19 09:36:35.080080",
        "source_id": 746,
        "song_id": 9543,
        "duplicate": true
    },
    {
        "title": "Beers And Sunshine",
        "artist_name": "Darius Rucker",
        "video_id": null,
        "capture_date": "2020-11-19 09:36:35.081081",
        "source_id": 746,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Therefore I Am",
        "artist_name": "Billie Eilish",
        "video_id": null,
        "capture_date": "2020-11-19 09:36:35.081081",
        "source_id": 746,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Whoopty",
        "artist_name": "CJ",
        "video_id": null,
        "capture_date": "2020-11-19 09:36:35.081081",
        "source_id": 746,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "F*ck You, Goodbye",
        "artist_name": "The Kid LAROI Featuring Machine Gun Kelly",
        "video_id": null,
        "capture_date": "2020-11-19 09:36:35.081081",
        "source_id": 746,
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
    ('Took Her To The O', 'King Von', NULL),
    ('Don’t Need Friends', 'NAV Featuring Lil Baby', NULL),
    ('The Code', 'King Von Featuring Polo G', NULL),
    ('Tragic', 'The Kid LAROI Featuring YoungBoy Never Brok Again & Internet Money', NULL),
    ('All These N**gas', 'King Von Featuring Lil Durk', NULL),
    ('Crazy Story 2.0', 'King Von Featuring Lil Durk', NULL),
    ('Always Do', 'The Kid LAROI', NULL),
    ('Beers And Sunshine', 'Darius Rucker', NULL),
    ('Therefore I Am', 'Billie Eilish', NULL),
    ('Whoopty', 'CJ', NULL),
    ('F*ck You, Goodbye', 'The Kid LAROI Featuring Machine Gun Kelly', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9567; // SELECT last_insert_rowid();

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
    ('2020-11-19 09:36:35.079079', '746', '9540'),
    ('2020-11-19 09:36:35.079079', '746', '9557'),
    ('2020-11-19 09:36:35.079079', '746', '9558'),
    ('2020-11-19 09:36:35.080080', '746', '9559'),
    ('2020-11-19 09:36:35.080080', '746', '9560'),
    ('2020-11-19 09:36:35.080080', '746', '9561'),
    ('2020-11-19 09:36:35.080080', '746', '9562'),
    ('2020-11-19 09:36:35.080080', '746', '9563'),
    ('2020-11-19 09:36:35.080080', '746', '9543'),
    ('2020-11-19 09:36:35.081081', '746', '9564'),
    ('2020-11-19 09:36:35.081081', '746', '9565'),
    ('2020-11-19 09:36:35.081081', '746', '9566'),
    ('2020-11-19 09:36:35.081081', '746', '9567')
  ;

  // Update to source_song table
