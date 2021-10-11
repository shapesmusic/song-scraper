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
    + "\'" + currentChartLocation + "\');" // use pastChartLocation if not the current week's chart, otherwise use currentChartLocation
  );


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Billboard', 'The Hot 100', 'Week of July 10, 2021', '2021-07-10 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-07-10/2021-07-10');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 944; // SELECT last_insert_rowid();
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
        "title": "Bad Habits",
        "artist_name": "Ed Sheeran",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.978978",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "You Right",
        "artist_name": "Doja Cat & The Weeknd",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.979979",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "WUSYANAME",
        "artist_name": "Tyler, The Creator ft. YoungBoy Never Broke Again & Ty Dolla $ign",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.979979",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ain't Shit",
        "artist_name": "Doja Cat",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.979979",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Juggernaut",
        "artist_name": "Tyler, The Creator ft. Lil Uzi Vert & Pharrell Williams",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.980980",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "AM",
        "artist_name": "Nio Garcia X J Balvin X Bad Bunny",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.980980",
        "source_id": 944,
        "song_id": 10225,
        "duplicate": true
    },
    {
        "title": "Lemonhead",
        "artist_name": "Tyler, The Creator ft. 42 Dugg",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.980980",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hot Wind Blows",
        "artist_name": "Tyler, The Creator ft. Lil Wayne",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.980980",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Red Light Green Light",
        "artist_name": "DaBaby",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.981981",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Corso",
        "artist_name": "Tyler, The Creator",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.981981",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Don't Do Drugs",
        "artist_name": "Doja Cat ft. Ariana Grande",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.981981",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sir Baudelaire",
        "artist_name": "Tyler, The Creator ft. DJ Drama",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.981981",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sweet / I Thought You Wanted To Dance",
        "artist_name": "Tyler, The Creator ft. Brent Faiyaz & Fana Hues",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.981981",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Massa",
        "artist_name": "Tyler, The Creator",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.981981",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "RunItUp",
        "artist_name": "Tyler, The Creator ft. Teezo Touchdown",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.981981",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Beggin'",
        "artist_name": "Maneskin",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.982982",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Manifesto",
        "artist_name": "Tyler, The Creator ft. Domo Genesis",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.982982",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Woman",
        "artist_name": "Doja Cat",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.983983",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Get Into It (Yuh)",
        "artist_name": "Doja Cat",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.983983",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Wilshire",
        "artist_name": "Tyler, The Creator",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.983983",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rise!",
        "artist_name": "Tyler, The Creator ft. Daisy World",
        "video_id": null,
        "capture_date": "2021-10-10 11:02:27.984984",
        "source_id": 944,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Up%'
    AND artist_name LIKE '%Cardi%'
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
  ('Bad Habits', 'Ed Sheeran', NULL),
  ('You Right', 'Doja Cat & The Weeknd', NULL),
  ('WUSYANAME', 'Tyler, The Creator ft. YoungBoy Never Broke Again & Ty Dolla $ign', NULL),
  ('Ain’t Shit', 'Doja Cat', NULL),
  ('Juggernaut', 'Tyler, The Creator ft. Lil Uzi Vert & Pharrell Williams', NULL),
  ('Lemonhead', 'Tyler, The Creator ft. 42 Dugg', NULL),
  ('Hot Wind Blows', 'Tyler, The Creator ft. Lil Wayne', NULL),
  ('Red Light Green Light', 'DaBaby', NULL),
  ('Corso', 'Tyler, The Creator', NULL),
  ('I Don’t Do Drugs', 'Doja Cat ft. Ariana Grande', NULL),
  ('Sir Baudelaire', 'Tyler, The Creator ft. DJ Drama', NULL),
  ('Sweet / I Thought You Wanted To Dance', 'Tyler, The Creator ft. Brent Faiyaz & Fana Hues', NULL),
  ('Massa', 'Tyler, The Creator', NULL),
  ('RunItUp', 'Tyler, The Creator ft. Teezo Touchdown', NULL),
  ('Beggin’', 'Maneskin', NULL),
  ('Manifesto', 'Tyler, The Creator ft. Domo Genesis', NULL),
  ('Woman', 'Doja Cat', NULL),
  ('Get Into It (Yuh)', 'Doja Cat', NULL),
  ('Wilshire', 'Tyler, The Creator', NULL),
  ('Rise!', 'Tyler, The Creator ft. Daisy World', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10648; // SELECT last_insert_rowid();

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
  ('2021-10-10 11:02:27.978978', '944', '10629'),
  ('2021-10-10 11:02:27.979979', '944', '10630'),
  ('2021-10-10 11:02:27.979979', '944', '10631'),
  ('2021-10-10 11:02:27.979979', '944', '10632'),
  ('2021-10-10 11:02:27.980980', '944', '10633'),
  ('2021-10-10 11:02:27.980980', '944', '10225'),
  ('2021-10-10 11:02:27.980980', '944', '10634'),
  ('2021-10-10 11:02:27.980980', '944', '10635'),
  ('2021-10-10 11:02:27.981981', '944', '10636'),
  ('2021-10-10 11:02:27.981981', '944', '10637'),
  ('2021-10-10 11:02:27.981981', '944', '10638'),
  ('2021-10-10 11:02:27.981981', '944', '10639'),
  ('2021-10-10 11:02:27.981981', '944', '10640'),
  ('2021-10-10 11:02:27.981981', '944', '10641'),
  ('2021-10-10 11:02:27.981981', '944', '10642'),
  ('2021-10-10 11:02:27.982982', '944', '10643'),
  ('2021-10-10 11:02:27.982982', '944', '10644'),
  ('2021-10-10 11:02:27.983983', '944', '10645'),
  ('2021-10-10 11:02:27.983983', '944', '10646'),
  ('2021-10-10 11:02:27.983983', '944', '10647'),
  ('2021-10-10 11:02:27.984984', '944', '10648')
  ;

  // Update to source_song table
