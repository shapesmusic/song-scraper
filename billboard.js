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
    ('Billboard', 'The Hot 100', 'Week of September 11, 2021', '2021-09-11 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-09-11/2021-09-11');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 953; // SELECT last_insert_rowid();
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
//          find and replace "Featured" with "ft."
//

  songsData =
  [
      {
          "title": "Hurricane",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.165165",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Jail",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.166166",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Off The Grid",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.166166",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Ok Ok",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.166166",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Junya",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.167167",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Moon",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.167167",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Family Ties",
          "artist_name": "Baby Keem & Kendrick Lamar",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.167167",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Praise God",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.167167",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Sharing Locations",
          "artist_name": "Meek Mill ft. Lil Baby & Lil Durk",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.167167",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Jesus Lord",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.167167",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Jonah",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.167167",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Believe What I Say",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.167167",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "God Breathed",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.167167",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Remote Control",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.168168",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Heaven And Hell",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.168168",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "24",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.168168",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Pure Souls",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.169169",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "No Child Left Behind",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.169169",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Donda",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.169169",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Keep My Spirit Alive",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.169169",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Jail Pt 2",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.169169",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "I Am Not A Woman, I'm A God",
          "artist_name": "Halsey",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.169169",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "New Again",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.169169",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Lord I Need You",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.169169",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Come To Life",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.169169",
          "source_id": 953,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Tell The Vision",
          "artist_name": "Kanye West",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.170170",
          "source_id": 953,
          "song_id": 10668,
          "duplicate": true
      },
      {
          "title": "In Da Getto",
          "artist_name": "J Balvin & Skrillex",
          "video_id": null,
          "capture_date": "2021-10-11 11:21:38.170170",
          "source_id": 953,
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
  ('Hurricane', 'Kanye West', NULL),
  ('Jail', 'Kanye West', NULL),
  ('Off The Grid', 'Kanye West', NULL),
  ('Ok Ok', 'Kanye West', NULL),
  ('Junya', 'Kanye West', NULL),
  ('Moon', 'Kanye West', NULL),
  ('Family Ties', 'Baby Keem & Kendrick Lamar', NULL),
  ('Praise God', 'Kanye West', NULL),
  ('Sharing Locations', 'Meek Mill ft. Lil Baby & Lil Durk', NULL),
  ('Jesus Lord', 'Kanye West', NULL),
  ('Jonah', 'Kanye West', NULL),
  ('Believe What I Say', 'Kanye West', NULL),
  ('God Breathed', 'Kanye West', NULL),
  ('Remote Control', 'Kanye West', NULL),
  ('Heaven And Hell', 'Kanye West', NULL),
  ('24', 'Kanye West', NULL),
  ('Pure Souls', 'Kanye West', NULL),
  ('No Child Left Behind', 'Kanye West', NULL),
  ('Donda', 'Kanye West', NULL),
  ('Keep My Spirit Alive', 'Kanye West', NULL),
  ('Jail Pt 2', 'Kanye West', NULL),
  ('I Am Not A Woman, I’m A God', 'Halsey', NULL),
  ('New Again', 'Kanye West', NULL),
  ('Lord I Need You', 'Kanye West', NULL),
  ('Come To Life', 'Kanye West', NULL),
  ('In Da Getto', 'J Balvin & Skrillex', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10760; // SELECT last_insert_rowid();

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
  ('2021-10-11 11:21:38.165165', '953', '10735'),
  ('2021-10-11 11:21:38.166166', '953', '10736'),
  ('2021-10-11 11:21:38.166166', '953', '10737'),
  ('2021-10-11 11:21:38.166166', '953', '10738'),
  ('2021-10-11 11:21:38.167167', '953', '10739'),
  ('2021-10-11 11:21:38.167167', '953', '10740'),
  ('2021-10-11 11:21:38.167167', '953', '10741'),
  ('2021-10-11 11:21:38.167167', '953', '10742'),
  ('2021-10-11 11:21:38.167167', '953', '10743'),
  ('2021-10-11 11:21:38.167167', '953', '10744'),
  ('2021-10-11 11:21:38.167167', '953', '10745'),
  ('2021-10-11 11:21:38.167167', '953', '10746'),
  ('2021-10-11 11:21:38.167167', '953', '10747'),
  ('2021-10-11 11:21:38.168168', '953', '10748'),
  ('2021-10-11 11:21:38.168168', '953', '10749'),
  ('2021-10-11 11:21:38.168168', '953', '10750'),
  ('2021-10-11 11:21:38.169169', '953', '10751'),
  ('2021-10-11 11:21:38.169169', '953', '10752'),
  ('2021-10-11 11:21:38.169169', '953', '10753'),
  ('2021-10-11 11:21:38.169169', '953', '10754'),
  ('2021-10-11 11:21:38.169169', '953', '10755'),
  ('2021-10-11 11:21:38.169169', '953', '10756'),
  ('2021-10-11 11:21:38.169169', '953', '10757'),
  ('2021-10-11 11:21:38.169169', '953', '10758'),
  ('2021-10-11 11:21:38.169169', '953', '10759'),
  ('2021-10-11 11:21:38.170170', '953', '10668'),
  ('2021-10-11 11:21:38.170170', '953', '10760')
  ;

  // Update to source_song table
