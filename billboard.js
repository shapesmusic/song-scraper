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
    ('Billboard', 'The Hot 100', 'Week of December 19, 2020', '2020-12-19 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2020-12-19');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 752; // SELECT last_insert_rowid();
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
        "title": "On Me",
        "artist_name": "Lil Baby",
        "video_id": null,
        "capture_date": "2020-12-22 12:45:11.938938",
        "source_id": 752,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Errbody",
        "artist_name": "Lil Baby",
        "video_id": null,
        "capture_date": "2020-12-22 12:45:11.939939",
        "source_id": 752,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Without You",
        "artist_name": "The Kid LAROI",
        "video_id": null,
        "capture_date": "2020-12-22 12:45:11.939939",
        "source_id": 752,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Real Shit",
        "artist_name": "Juice WRLD x benny blanco",
        "video_id": null,
        "capture_date": "2020-12-22 12:45:11.939939",
        "source_id": 752,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Oh Santa!",
        "artist_name": "Mariah Carey Featuring Ariana Grande & Jennifer Hudson",
        "video_id": null,
        "capture_date": "2020-12-22 12:45:11.940940",
        "source_id": 752,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Take Me Home For Christmas",
        "artist_name": "Dan + Shay",
        "video_id": null,
        "capture_date": "2020-12-22 12:45:11.940940",
        "source_id": 752,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hallelujah",
        "artist_name": "Carrie Underwood & John Legend",
        "video_id": null,
        "capture_date": "2020-12-22 12:45:11.940940",
        "source_id": 752,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Silent Night",
        "artist_name": "Carrie Underwood",
        "video_id": null,
        "capture_date": "2020-12-22 12:45:11.940940",
        "source_id": 752,
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
    ('On Me', 'Lil Baby', NULL),
    ('Errbody', 'Lil Baby', NULL),
    ('Without You', 'The Kid LAROI', NULL),
    ('Real Shit', 'Juice WRLD x benny blanco', NULL),
    ('Oh Santa!', 'Mariah Carey Featuring Ariana Grande & Jennifer Hudson', NULL),
    ('Take Me Home For Christmas', 'Dan + Shay', NULL),
    ('Hallelujah', 'Carrie Underwood & John Legend', NULL),
    ('Silent Night', 'Carrie Underwood', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9631; // SELECT last_insert_rowid();

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
    ('2020-12-22 12:45:11.938938', '752', '9624'),
    ('2020-12-22 12:45:11.939939', '752', '9625'),
    ('2020-12-22 12:45:11.939939', '752', '9626'),
    ('2020-12-22 12:45:11.939939', '752', '9627'),
    ('2020-12-22 12:45:11.940940', '752', '9628'),
    ('2020-12-22 12:45:11.940940', '752', '9629'),
    ('2020-12-22 12:45:11.940940', '752', '9630'),
    ('2020-12-22 12:45:11.940940', '752', '9631')
  ;

  // Update to source_song table
