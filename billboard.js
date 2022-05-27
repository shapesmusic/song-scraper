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
  pubDateUpper = document.getElementsByClassName('c-tagline  a-font-primary-medium-xs u-font-size-11@mobile-max u-letter-spacing-0106 u-letter-spacing-0089@mobile-max lrv-u-line-height-copy lrv-u-text-transform-uppercase lrv-u-margin-a-00 lrv-u-padding-l-075 lrv-u-padding-l-00@mobile-max')[0].innerText.trim();
  pubDateLower = pubDateUpper.toLowerCase();
  publicationDate = pubDateLower.charAt(0).toUpperCase() + pubDateLower.slice(1, 8) + pubDateLower.charAt(8).toUpperCase() + pubDateLower.slice(9);

  publicationDateFormatted = moment(publicationDate.slice(8), "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // Get location and format for current or past chart status
  currentChartLocation = window.location.href + moment(publicationDate.slice(8), "MMM DD, YYYY").format("YYYY-MM-DD");
  pastChartLocation = window.location.href;

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Billboard\', \'The Hot 100\', \'"
    + publicationDate + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + pastChartLocation + "\');" // use pastChartLocation if not the current week's chart, otherwise use currentChartLocation
  );


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Billboard', 'The Hot 100', 'Week of April 9, 2022', '2022-04-09 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2022-04-09/');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1179; // SELECT last_insert_rowid();
  song_id = null;

  // elements = document.getElementsByClassName('chart-list__element display--flex');
  elements = document.getElementsByClassName('o-chart-results-list-row-container');


  songsData = [];

  // if this returns empty songsData[], make sure responsive sizing is for browser, not tablet, etc.
  for (var i=1; i<elements.length; i++){ // does not include the No. 1 song.
      element = elements[i];

      isNew = element.getElementsByClassName('c-label  u-width-40 a-font-primary-bold-xxs lrv-u-color-grey-darkest u-background-color-yellow lrv-u-text-align-center');

      songName = element.getElementsByClassName('c-title  a-no-trucate a-font-primary-bold-s u-letter-spacing-0021 lrv-u-font-size-18@tablet lrv-u-font-size-16 u-line-height-125 u-line-height-normal@mobile-max a-truncate-ellipsis u-max-width-330 u-max-width-230@tablet-only')[0];
      artistName = element.getElementsByClassName('c-label  a-no-trucate a-font-primary-s lrv-u-font-size-14@mobile-max u-line-height-normal@mobile-max u-letter-spacing-0021 lrv-u-display-block a-truncate-ellipsis-2line u-max-width-330 u-max-width-230@tablet-only')[0];

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

      if(isNew.length == 1 && isNew[0].innerText == "NEW"){

        songsData.push(songData);

      };
  };

  console.log(JSON.stringify(songsData, null, 4));


//
// Step 3:  Stage songsData,
//          prune unwanted songs,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates,
//          find and replace "Featur~ing" with "ft."
//

  songsData =
  [
    {
        "title": "Soy El Unico",
        "artist_name": "Yahritza y Su Esencia",
        "video_id": null,
        "capture_date": "2022-05-26 12:59:31.984984",
        "source_id": 1179,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "We Go Up",
        "artist_name": "Nicki Minaj & Fivio Foreign",
        "video_id": null,
        "capture_date": "2022-05-26 12:59:31.994994",
        "source_id": 1179,
        "song_id": 11916,
        "duplicate": true
    },
    {
        "title": "Make Up Sex",
        "artist_name": "Machine Gun Kelly X blackbear",
        "video_id": null,
        "capture_date": "2022-05-26 12:59:31.994994",
        "source_id": 1179,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "X Ultima Vez",
        "artist_name": "Daddy Yankee & Bad Bunny",
        "video_id": null,
        "capture_date": "2022-05-26 12:59:31.998998",
        "source_id": 1179,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Envolver",
        "artist_name": "Anitta",
        "video_id": null,
        "capture_date": "2022-05-26 12:59:31.999999",
        "source_id": 1179,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Chaotic",
        "artist_name": "Tate McRae",
        "video_id": null,
        "capture_date": "2022-05-26 12:59:32.000000",
        "source_id": 1179,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sigue",
        "artist_name": "J Balvin & Ed Sheeran",
        "video_id": null,
        "capture_date": "2022-05-26 12:59:32.002002",
        "source_id": 1179,
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
  ('Soy El Unico', 'Yahritza y Su Esencia', NULL),
  ('Make Up Sex', 'Machine Gun Kelly X blackbear', NULL),
  ('X Ultima Vez', 'Daddy Yankee & Bad Bunny', NULL),
  ('Envolver', 'Anitta', NULL),
  ('Chaotic', 'Tate McRae', NULL),
  ('Sigue', 'J Balvin & Ed Sheeran', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11939; // SELECT last_insert_rowid();

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
  ('2022-05-26 12:59:31.984984', '1179', '11934'),
  ('2022-05-26 12:59:31.994994', '1179', '11916'),
  ('2022-05-26 12:59:31.994994', '1179', '11935'),
  ('2022-05-26 12:59:31.998998', '1179', '11936'),
  ('2022-05-26 12:59:31.999999', '1179', '11937'),
  ('2022-05-26 12:59:32.000000', '1179', '11938'),
  ('2022-05-26 12:59:32.002002', '1179', '11939')
  ;

  // Update to source_song table
