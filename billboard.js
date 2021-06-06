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
    ('Billboard', 'The Hot 100', 'Week of June 5, 2021', '2021-06-05 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-06-05');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 930; // SELECT last_insert_rowid();
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
        "title": "Butter",
        "artist_name": "BTS",
        "video_id": null,
        "capture_date": "2021-06-06 03:17:39.698698",
        "source_id": 930,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Traitor",
        "artist_name": "Olivia Rodrigo",
        "video_id": null,
        "capture_date": "2021-06-06 03:17:39.700700",
        "source_id": 930,
        "song_id": 10437,
        "duplicate": true
    },
    {
        "title": "Brutal",
        "artist_name": "Olivia Rodrigo",
        "video_id": null,
        "capture_date": "2021-06-06 03:17:39.700700",
        "source_id": 930,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Enough For You",
        "artist_name": "Olivia Rodrigo",
        "video_id": null,
        "capture_date": "2021-06-06 03:17:39.700700",
        "source_id": 930,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Happier",
        "artist_name": "Olivia Rodrigo",
        "video_id": null,
        "capture_date": "2021-06-06 03:17:39.700700",
        "source_id": 930,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Favorite Crime",
        "artist_name": "Olivia Rodrigo",
        "video_id": null,
        "capture_date": "2021-06-06 03:17:39.701701",
        "source_id": 930,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "1 Step Forward, 3 Steps Back",
        "artist_name": "Olivia Rodrigo",
        "video_id": null,
        "capture_date": "2021-06-06 03:17:39.701701",
        "source_id": 930,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Jealousy, Jealousy",
        "artist_name": "Olivia Rodrigo",
        "video_id": null,
        "capture_date": "2021-06-06 03:17:39.701701",
        "source_id": 930,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hope Ur OK",
        "artist_name": "Olivia Rodrigo",
        "video_id": null,
        "capture_date": "2021-06-06 03:17:39.701701",
        "source_id": 930,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gang Gang",
        "artist_name": "Polo G & Lil Wayne",
        "video_id": null,
        "capture_date": "2021-06-06 03:17:39.701701",
        "source_id": 930,
        "song_id": 10430,
        "duplicate": true
    },
    {
        "title": "Twerkulator",
        "artist_name": "City Girls",
        "video_id": null,
        "capture_date": "2021-06-06 03:17:39.702702",
        "source_id": 930,
        "song_id": 10438,
        "duplicate": true
    },
    {
        "title": "Sun Goes Down",
        "artist_name": "Lil Nas X",
        "video_id": null,
        "capture_date": "2021-06-06 03:17:39.702702",
        "source_id": 930,
        "song_id": 10435,
        "duplicate": true
    },
    {
        "title": "Maybach",
        "artist_name": "42 Dugg Featuring Future",
        "video_id": null,
        "capture_date": "2021-06-06 03:17:39.702702",
        "source_id": 930,
        "song_id": 10432,
        "duplicate": true
    },
    {
        "title": "Leave Before You Love Me",
        "artist_name": "Marshmello X Jonas Brothers",
        "video_id": null,
        "capture_date": "2021-06-06 03:17:39.703703",
        "source_id": 930,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "24 Hours",
        "artist_name": "A Boogie Wit da Hoodie Featuring Lil Durk",
        "video_id": null,
        "capture_date": "2021-06-06 03:17:39.703703",
        "source_id": 930,
        "song_id": 10436,
        "duplicate": true
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
  ('Butter', 'BTS', NULL),
  ('Brutal', 'Olivia Rodrigo', NULL),
  ('Enough For You', 'Olivia Rodrigo', NULL),
  ('Happier', 'Olivia Rodrigo', NULL),
  ('Favorite Crime', 'Olivia Rodrigo', NULL),
  ('1 Step Forward, 3 Steps Back', 'Olivia Rodrigo', NULL),
  ('Jealousy, Jealousy', 'Olivia Rodrigo', NULL),
  ('Hope Ur OK', 'Olivia Rodrigo', NULL),
  ('Leave Before You Love Me', 'Marshmello X Jonas Brothers', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10474; // SELECT last_insert_rowid();

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
  ('2021-06-06 03:17:39.698698', '930', '10466'),
  ('2021-06-06 03:17:39.700700', '930', '10437'),
  ('2021-06-06 03:17:39.700700', '930', '10467'),
  ('2021-06-06 03:17:39.700700', '930', '10468'),
  ('2021-06-06 03:17:39.700700', '930', '10469'),
  ('2021-06-06 03:17:39.701701', '930', '10470'),
  ('2021-06-06 03:17:39.701701', '930', '10471'),
  ('2021-06-06 03:17:39.701701', '930', '10472'),
  ('2021-06-06 03:17:39.701701', '930', '10473'),
  ('2021-06-06 03:17:39.701701', '930', '10430'),
  ('2021-06-06 03:17:39.702702', '930', '10438'),
  ('2021-06-06 03:17:39.702702', '930', '10435'),
  ('2021-06-06 03:17:39.702702', '930', '10432'),
  ('2021-06-06 03:17:39.703703', '930', '10474'),
  ('2021-06-06 03:17:39.703703', '930', '10436')
  ;

  // Update to source_song table
