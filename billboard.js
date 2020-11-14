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
    ('Billboard', 'The Hot 100', 'Week of November 14, 2020', '2020-11-14 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2020-11-14');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 743; // `SELECT last_insert_rowid();`
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
          "title": "34+35",
          "artist_name": "Ariana Grande",
          "video_id": null,
          "capture_date": "2020-11-11 10:39:07.439439",
          "source_id": 743,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Dakiti",
          "artist_name": "Bad Bunny & Jhay Cortez",
          "video_id": null,
          "capture_date": "2020-11-11 10:39:07.439439",
          "source_id": 743,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Motive",
          "artist_name": "Ariana Grande Featuring Doja Cat",
          "video_id": null,
          "capture_date": "2020-11-11 10:39:07.440440",
          "source_id": 743,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Off The Table",
          "artist_name": "Ariana Grande Featuring The Weeknd",
          "video_id": null,
          "capture_date": "2020-11-11 10:39:07.440440",
          "source_id": 743,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "pov",
          "artist_name": "Ariana Grande",
          "video_id": null,
          "capture_date": "2020-11-11 10:39:07.441441",
          "source_id": 743,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Just Like Magic",
          "artist_name": "Ariana Grande",
          "video_id": null,
          "capture_date": "2020-11-11 10:39:07.441441",
          "source_id": 743,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Shut Up",
          "artist_name": "Ariana Grande",
          "video_id": null,
          "capture_date": "2020-11-11 10:39:07.441441",
          "source_id": 743,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Nasty",
          "artist_name": "Ariana Grande",
          "video_id": null,
          "capture_date": "2020-11-11 10:39:07.441441",
          "source_id": 743,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Safety Net",
          "artist_name": "Ariana Grande Featuring Ty Dolla $ign",
          "video_id": null,
          "capture_date": "2020-11-11 10:39:07.441441",
          "source_id": 743,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Six Thirty",
          "artist_name": "Ariana Grande",
          "video_id": null,
          "capture_date": "2020-11-11 10:39:07.442442",
          "source_id": 743,
          "song_id": 9472,
          "duplicate": true
      },
      {
          "title": "My Hair",
          "artist_name": "Ariana Grande",
          "video_id": null,
          "capture_date": "2020-11-11 10:39:07.442442",
          "source_id": 743,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Obvious",
          "artist_name": "Ariana Grande",
          "video_id": null,
          "capture_date": "2020-11-11 10:39:07.442442",
          "source_id": 743,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "West Side",
          "artist_name": "Ariana Grande",
          "video_id": null,
          "capture_date": "2020-11-11 10:39:07.442442",
          "source_id": 743,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Love Language",
          "artist_name": "Ariana Grande",
          "video_id": null,
          "capture_date": "2020-11-11 10:39:07.442442",
          "source_id": 743,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Weeeeee",
          "artist_name": "Trippie Redd",
          "video_id": null,
          "capture_date": "2020-11-11 10:39:07.442442",
          "source_id": 743,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Stay Down",
          "artist_name": "Lil Durk, 6LACK & Young Thug",
          "video_id": null,
          "capture_date": "2020-11-11 10:39:07.443443",
          "source_id": 743,
          "song_id": 9476,
          "duplicate": true
      },
      {
          "title": "Thick",
          "artist_name": "DJ Chose Featuring BeatKing",
          "video_id": null,
          "capture_date": "2020-11-11 10:39:07.443443",
          "source_id": 743,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Take You Dancing",
          "artist_name": "Jason Derulo",
          "video_id": null,
          "capture_date": "2020-11-11 10:39:07.443443",
          "source_id": 743,
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
    ('34+35', 'Ariana Grande', NULL),
    ('Dakiti', 'Bad Bunny & Jhay Cortez', NULL),
    ('Motive', 'Ariana Grande Featuring Doja Cat', NULL),
    ('Off The Table', 'Ariana Grande Featuring The Weeknd', NULL),
    ('pov', 'Ariana Grande', NULL),
    ('Just Like Magic', 'Ariana Grande', NULL),
    ('Shut Up', 'Ariana Grande', NULL),
    ('Nasty', 'Ariana Grande', NULL),
    ('Safety Net', 'Ariana Grande Featuring Ty Dolla $ign', NULL),
    ('My Hair', 'Ariana Grande', NULL),
    ('Obvious', 'Ariana Grande', NULL),
    ('West Side', 'Ariana Grande', NULL),
    ('Love Language', 'Ariana Grande', NULL),
    ('Weeeeee', 'Trippie Redd', NULL),
    ('Thick', 'DJ Chose Featuring BeatKing', NULL),
    ('Take You Dancing', 'Jason Derulo', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9539; // `SELECT last_insert_rowid();`

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
    ('2020-11-11 10:39:07.439439', '743', '9524'),
    ('2020-11-11 10:39:07.439439', '743', '9525'),
    ('2020-11-11 10:39:07.440440', '743', '9526'),
    ('2020-11-11 10:39:07.440440', '743', '9527'),
    ('2020-11-11 10:39:07.441441', '743', '9528'),
    ('2020-11-11 10:39:07.441441', '743', '9529'),
    ('2020-11-11 10:39:07.441441', '743', '9530'),
    ('2020-11-11 10:39:07.441441', '743', '9531'),
    ('2020-11-11 10:39:07.441441', '743', '9532'),
    ('2020-11-11 10:39:07.442442', '743', '9472'),
    ('2020-11-11 10:39:07.442442', '743', '9533'),
    ('2020-11-11 10:39:07.442442', '743', '9534'),
    ('2020-11-11 10:39:07.442442', '743', '9535'),
    ('2020-11-11 10:39:07.442442', '743', '9536'),
    ('2020-11-11 10:39:07.442442', '743', '9537'),
    ('2020-11-11 10:39:07.443443', '743', '9476'),
    ('2020-11-11 10:39:07.443443', '743', '9538'),
    ('2020-11-11 10:39:07.443443', '743', '9539')
  ;

  // Update to source_song table
