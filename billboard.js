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
    ('Billboard', 'The Hot 100', 'Week of December 12, 2020', '2020-12-12 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2020-12-12');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 751; // SELECT last_insert_rowid();
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
        "title": "La Noche de Anoche",
        "artist_name": "Bad Bunny & ROSALIA",
        "video_id": null,
        "capture_date": "2020-12-22 12:36:27.865865",
        "source_id": 751,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Te Mudaste",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2020-12-22 12:36:27.865865",
        "source_id": 751,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Yo Visto Asi",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2020-12-22 12:36:27.865865",
        "source_id": 751,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dicked Down In Dallas",
        "artist_name": "Trey Lewis",
        "video_id": null,
        "capture_date": "2020-12-22 12:36:27.865865",
        "source_id": 751,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Haciendo Que Me Amas",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2020-12-22 12:36:27.865865",
        "source_id": 751,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Te Deseo Lo Mejor",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2020-12-22 12:36:27.865865",
        "source_id": 751,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Under The Mistletoe",
        "artist_name": "Kelly Clarkson & Brett Eldredge",
        "video_id": null,
        "capture_date": "2020-12-22 12:36:27.865865",
        "source_id": 751,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Booker T",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2020-12-22 12:36:27.866866",
        "source_id": 751,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "El Mundo Es Mio",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2020-12-22 12:36:27.866866",
        "source_id": 751,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hoy Cobre",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2020-12-22 12:36:27.866866",
        "source_id": 751,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rockin' Around The Christmas Tree",
        "artist_name": "Justin Bieber",
        "video_id": null,
        "capture_date": "2020-12-22 12:36:27.866866",
        "source_id": 751,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Maldita Pobreza",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2020-12-22 12:36:27.866866",
        "source_id": 751,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "La Droga",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2020-12-22 12:36:27.866866",
        "source_id": 751,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Favorite Time Of Year",
        "artist_name": "Carrie Underwood",
        "video_id": null,
        "capture_date": "2020-12-22 12:36:27.866866",
        "source_id": 751,
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
    ('La Noche de Anoche', 'Bad Bunny & ROSALIA', NULL),
    ('Te Mudaste', 'Bad Bunny', NULL),
    ('Yo Visto Asi', 'Bad Bunny', NULL),
    ('Dicked Down In Dallas', 'Trey Lewis', NULL),
    ('Haciendo Que Me Amas', 'Bad Bunny', NULL),
    ('Te Deseo Lo Mejor', 'Bad Bunny', NULL),
    ('Under The Mistletoe', 'Kelly Clarkson & Brett Eldredge', NULL),
    ('Booker T', 'Bad Bunny', NULL),
    ('El Mundo Es Mio', 'Bad Bunny', NULL),
    ('Hoy Cobre', 'Bad Bunny', NULL),
    ('Rockin’ Around The Christmas Tree', 'Justin Bieber', NULL),
    ('Maldita Pobreza', 'Bad Bunny', NULL),
    ('La Droga', 'Bad Bunny', NULL),
    ('Favorite Time Of Year', 'Carrie Underwood', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9623; // SELECT last_insert_rowid();

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
    ('2020-12-22 12:36:27.865865', '751', '9610'),
    ('2020-12-22 12:36:27.865865', '751', '9611'),
    ('2020-12-22 12:36:27.865865', '751', '9612'),
    ('2020-12-22 12:36:27.865865', '751', '9613'),
    ('2020-12-22 12:36:27.865865', '751', '9614'),
    ('2020-12-22 12:36:27.865865', '751', '9615'),
    ('2020-12-22 12:36:27.865865', '751', '9616'),
    ('2020-12-22 12:36:27.866866', '751', '9617'),
    ('2020-12-22 12:36:27.866866', '751', '9618'),
    ('2020-12-22 12:36:27.866866', '751', '9619'),
    ('2020-12-22 12:36:27.866866', '751', '9620'),
    ('2020-12-22 12:36:27.866866', '751', '9621'),
    ('2020-12-22 12:36:27.866866', '751', '9622'),
    ('2020-12-22 12:36:27.866866', '751', '9623')
  ;

  // Update to source_song table
