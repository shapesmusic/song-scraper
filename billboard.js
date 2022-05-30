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
    ('Billboard', 'The Hot 100', 'Week of May 28, 2022', '2022-05-28 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2022-05-28/');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1213; // SELECT last_insert_rowid();
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
        "title": "N95",
        "artist_name": "Kendrick Lamar",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.468468",
        "source_id": 1213,
        "song_id": 12211,
        "duplicate": true
    },
    {
        "title": "Die Hard",
        "artist_name": "Kendrick Lamar, Blxst & Amanda Reifer",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.469469",
        "source_id": 1213,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "You Proof",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.469469",
        "source_id": 1213,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Silent Hill",
        "artist_name": "Kendrick Lamar & Kodak Black",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.469469",
        "source_id": 1213,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "United In Grief",
        "artist_name": "Kendrick Lamar",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.469469",
        "source_id": 1213,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Father Time",
        "artist_name": "Kendrick Lamar ft. Sampha",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.469469",
        "source_id": 1213,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rich Spirit",
        "artist_name": "Kendrick Lamar",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.469469",
        "source_id": 1213,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "We Cry Together",
        "artist_name": "Kendrick Lamar & Taylour Paige",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.470470",
        "source_id": 1213,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Worldwide Steppers",
        "artist_name": "Kendrick Lamar",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.470470",
        "source_id": 1213,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Count Me Out",
        "artist_name": "Kendrick Lamar",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.470470",
        "source_id": 1213,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Purple Hearts",
        "artist_name": "Kendrick Lamar, Summer Walker & Ghostface Killah",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.470470",
        "source_id": 1213,
        "song_id": 12225,
        "duplicate": true
    },
    {
        "title": "Savior",
        "artist_name": "Kendrick Lamar, Baby Keem, & Sam Dew",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.470470",
        "source_id": 1213,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cooped Up",
        "artist_name": "Post Malone ft. Roddy Ricch",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.470470",
        "source_id": 1213,
        "song_id": 12212,
        "duplicate": true
    },
    {
        "title": "Rich (Interlude)",
        "artist_name": "Kendrick Lamar",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.470470",
        "source_id": 1213,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mr. Morale",
        "artist_name": "Kendrick Lamar & Tanna Leone",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.470470",
        "source_id": 1213,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Crown",
        "artist_name": "Kendrick Lamar",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.470470",
        "source_id": 1213,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Auntie Diaries",
        "artist_name": "Kendrick Lamar",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.470470",
        "source_id": 1213,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Savior (Interlude)",
        "artist_name": "Kendrick Lamar",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.471471",
        "source_id": 1213,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mirror",
        "artist_name": "Kendrick Lamar",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.471471",
        "source_id": 1213,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mother I Sober",
        "artist_name": "Kendrick Lamar ft. Beth Gibbons",
        "video_id": null,
        "capture_date": "2022-05-30 07:27:00.471471",
        "source_id": 1213,
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
  ('Die Hard', 'Kendrick Lamar, Blxst & Amanda Reifer', NULL),
  ('You Proof', 'Morgan Wallen', NULL),
  ('Silent Hill', 'Kendrick Lamar & Kodak Black', NULL),
  ('United In Grief', 'Kendrick Lamar', NULL),
  ('Father Time', 'Kendrick Lamar ft. Sampha', NULL),
  ('Rich Spirit', 'Kendrick Lamar', NULL),
  ('We Cry Together', 'Kendrick Lamar & Taylour Paige', NULL),
  ('Worldwide Steppers', 'Kendrick Lamar', NULL),
  ('Count Me Out', 'Kendrick Lamar', NULL),
  ('Savior', 'Kendrick Lamar, Baby Keem, & Sam Dew', NULL),
  ('Rich (Interlude)', 'Kendrick Lamar', NULL),
  ('Mr. Morale', 'Kendrick Lamar & Tanna Leone', NULL),
  ('Crown', 'Kendrick Lamar', NULL),
  ('Auntie Diaries', 'Kendrick Lamar', NULL),
  ('Savior (Interlude)', 'Kendrick Lamar', NULL),
  ('Mirror', 'Kendrick Lamar', NULL),
  ('Mother I Sober', 'Kendrick Lamar ft. Beth Gibbons', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12245; // SELECT last_insert_rowid();

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
  ('2022-05-30 07:27:00.468468', '1213', '12211'),
  ('2022-05-30 07:27:00.469469', '1213', '12229'),
  ('2022-05-30 07:27:00.469469', '1213', '12230'),
  ('2022-05-30 07:27:00.469469', '1213', '12231'),
  ('2022-05-30 07:27:00.469469', '1213', '12232'),
  ('2022-05-30 07:27:00.469469', '1213', '12233'),
  ('2022-05-30 07:27:00.469469', '1213', '12234'),
  ('2022-05-30 07:27:00.470470', '1213', '12235'),
  ('2022-05-30 07:27:00.470470', '1213', '12236'),
  ('2022-05-30 07:27:00.470470', '1213', '12237'),
  ('2022-05-30 07:27:00.470470', '1213', '12225'),
  ('2022-05-30 07:27:00.470470', '1213', '12238'),
  ('2022-05-30 07:27:00.470470', '1213', '12212'),
  ('2022-05-30 07:27:00.470470', '1213', '12239'),
  ('2022-05-30 07:27:00.470470', '1213', '12240'),
  ('2022-05-30 07:27:00.470470', '1213', '12241'),
  ('2022-05-30 07:27:00.470470', '1213', '12242'),
  ('2022-05-30 07:27:00.471471', '1213', '12243'),
  ('2022-05-30 07:27:00.471471', '1213', '12244'),
  ('2022-05-30 07:27:00.471471', '1213', '12245')
  ;

  // Update to source_song table
