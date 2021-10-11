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
    ('Billboard', 'The Hot 100', 'Week of July 17, 2021', '2021-07-17 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-07-17/2021-07-17');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 945; // SELECT last_insert_rowid();
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
        "title": "Am I The Only One",
        "artist_name": "Aaron Lewis",
        "video_id": null,
        "capture_date": "2021-10-11 08:28:40.161161",
        "source_id": 945,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Wasting Time",
        "artist_name": "Brent Faiyaz ft. Drake",
        "video_id": null,
        "capture_date": "2021-10-11 08:28:40.163163",
        "source_id": 945,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Renegade",
        "artist_name": "Big Red Machine ft. Taylor Swift",
        "video_id": null,
        "capture_date": "2021-10-11 08:28:40.164164",
        "source_id": 945,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cry No More",
        "artist_name": "G Herbo ft. Polo G & Lil Tjay",
        "video_id": null,
        "capture_date": "2021-10-11 08:28:40.164164",
        "source_id": 945,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Essence",
        "artist_name": "Wizkid ft. Justin Bieber & Tems",
        "video_id": null,
        "capture_date": "2021-10-11 08:28:40.164164",
        "source_id": 945,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "A-O-K",
        "artist_name": "Tai Verdes",
        "video_id": null,
        "capture_date": "2021-10-11 08:28:40.164164",
        "source_id": 945,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "You Should Probably Leave",
        "artist_name": "Chris Stapleton",
        "video_id": null,
        "capture_date": "2021-10-11 08:28:40.164164",
        "source_id": 945,
        "song_id": 9578,
        "duplicate": true
    },
    {
        "title": "I Was On A Boat That Day",
        "artist_name": "Old Dominion",
        "video_id": null,
        "capture_date": "2021-10-11 08:28:40.164164",
        "source_id": 945,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cold Beer Calling My Name",
        "artist_name": "Jameson Rodgers ft. Luke Combs",
        "video_id": null,
        "capture_date": "2021-10-11 08:28:40.164164",
        "source_id": 945,
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
  ('Am I The Only One', 'Aaron Lewis', NULL),
  ('Wasting Time', 'Brent Faiyaz ft. Drake', NULL),
  ('Renegade', 'Big Red Machine ft. Taylor Swift', NULL),
  ('Cry No More', 'G Herbo ft. Polo G & Lil Tjay', NULL),
  ('Essence', 'Wizkid ft. Justin Bieber & Tems', NULL),
  ('A-O-K', 'Tai Verdes', NULL),
  ('I Was On A Boat That Day', 'Old Dominion', NULL),
  ('Cold Beer Calling My Name', 'Jameson Rodgers ft. Luke Combs', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10656; // SELECT last_insert_rowid();

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
  ('2021-10-11 08:28:40.161161', '945', '10649'),
  ('2021-10-11 08:28:40.163163', '945', '10650'),
  ('2021-10-11 08:28:40.164164', '945', '10651'),
  ('2021-10-11 08:28:40.164164', '945', '10652'),
  ('2021-10-11 08:28:40.164164', '945', '10653'),
  ('2021-10-11 08:28:40.164164', '945', '10654'),
  ('2021-10-11 08:28:40.164164', '945', '9578'),
  ('2021-10-11 08:28:40.164164', '945', '10655'),
  ('2021-10-11 08:28:40.164164', '945', '10656')
  ;

  // Update to source_song table
