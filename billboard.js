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
    ('Billboard', 'The Hot 100', 'Week of September 18, 2021', '2021-09-18 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-09-18/2021-09-18');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 954; // SELECT last_insert_rowid();
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
          "title": "Way 2 Sexy",
          "artist_name": "Drake ft. Future & Young Thug",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.402402",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Girls Want Girls",
          "artist_name": "Drake ft. Lil Baby",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.403403",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Fair Trade",
          "artist_name": "Drake ft. Travis Scott",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.404404",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Champagne Poetry",
          "artist_name": "Drake",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.404404",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Knife Talk",
          "artist_name": "Drake ft. 21 Savage & Project Pat",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.404404",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "In The Bible",
          "artist_name": "Drake ft. Lil Durk & Giveon",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.404404",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Papi's Home",
          "artist_name": "Drake",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.404404",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "TSU",
          "artist_name": "Drake",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.404404",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Love All",
          "artist_name": "Drake ft. JAY-Z",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.404404",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "No Friends In The Industry",
          "artist_name": "Drake",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.405405",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "N 2 Deep",
          "artist_name": "Drake ft. Future",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.405405",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Pipe Down",
          "artist_name": "Drake",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.405405",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "7am On Bridle Path",
          "artist_name": "Drake",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.405405",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Race My Mind",
          "artist_name": "Drake",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.405405",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "IMY2",
          "artist_name": "Drake ft. Kid Cudi",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.405405",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Yebba's Heartbreak",
          "artist_name": "Drake & Yebba",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.405405",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "You Only Live Twice",
          "artist_name": "Drake ft. Lil Wayne & Rick Ross",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.405405",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Fountains",
          "artist_name": "Drake ft. Tems",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.405405",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Get Along Better",
          "artist_name": "Drake ft. Ty Dolla $ign",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.405405",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Fucking Fans",
          "artist_name": "Drake",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.406406",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "The Remorse",
          "artist_name": "Drake",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.406406",
          "source_id": 954,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Blue Note$ II",
          "artist_name": "Meek Mill ft. Lil Uzi Vert",
          "video_id": null,
          "capture_date": "2021-10-11 11:58:55.408408",
          "source_id": 954,
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
  ('Way 2 Sexy', 'Drake ft. Future & Young Thug', NULL),
  ('Girls Want Girls', 'Drake ft. Lil Baby', NULL),
  ('Fair Trade', 'Drake ft. Travis Scott', NULL),
  ('Champagne Poetry', 'Drake', NULL),
  ('Knife Talk', 'Drake ft. 21 Savage & Project Pat', NULL),
  ('In The Bible', 'Drake ft. Lil Durk & Giveon', NULL),
  ('Papi’s Home', 'Drake', NULL),
  ('TSU', 'Drake', NULL),
  ('Love All', 'Drake ft. JAY-Z', NULL),
  ('No Friends In The Industry', 'Drake', NULL),
  ('N 2 Deep', 'Drake ft. Future', NULL),
  ('Pipe Down', 'Drake', NULL),
  ('7am On Bridle Path', 'Drake', NULL),
  ('Race My Mind', 'Drake', NULL),
  ('IMY2', 'Drake ft. Kid Cudi', NULL),
  ('Yebba’s Heartbreak', 'Drake & Yebba', NULL),
  ('You Only Live Twice', 'Drake ft. Lil Wayne & Rick Ross', NULL),
  ('Fountains', 'Drake ft. Tems', NULL),
  ('Get Along Better', 'Drake ft. Ty Dolla $ign', NULL),
  ('Fucking Fans', 'Drake', NULL),
  ('The Remorse', 'Drake', NULL),
  ('Blue Note$ II', 'Meek Mill ft. Lil Uzi Vert', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10782; // SELECT last_insert_rowid();

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
  ('2021-10-11 11:58:55.402402', '954', '10761'),
  ('2021-10-11 11:58:55.403403', '954', '10762'),
  ('2021-10-11 11:58:55.404404', '954', '10763'),
  ('2021-10-11 11:58:55.404404', '954', '10764'),
  ('2021-10-11 11:58:55.404404', '954', '10765'),
  ('2021-10-11 11:58:55.404404', '954', '10766'),
  ('2021-10-11 11:58:55.404404', '954', '10767'),
  ('2021-10-11 11:58:55.404404', '954', '10768'),
  ('2021-10-11 11:58:55.404404', '954', '10769'),
  ('2021-10-11 11:58:55.405405', '954', '10770'),
  ('2021-10-11 11:58:55.405405', '954', '10771'),
  ('2021-10-11 11:58:55.405405', '954', '10772'),
  ('2021-10-11 11:58:55.405405', '954', '10773'),
  ('2021-10-11 11:58:55.405405', '954', '10774'),
  ('2021-10-11 11:58:55.405405', '954', '10775'),
  ('2021-10-11 11:58:55.405405', '954', '10776'),
  ('2021-10-11 11:58:55.405405', '954', '10777'),
  ('2021-10-11 11:58:55.405405', '954', '10778'),
  ('2021-10-11 11:58:55.405405', '954', '10779'),
  ('2021-10-11 11:58:55.406406', '954', '10780'),
  ('2021-10-11 11:58:55.406406', '954', '10781'),
  ('2021-10-11 11:58:55.408408', '954', '10782')
  ;

  // Update to source_song table
