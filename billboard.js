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
    + "\'" + currentChartLocation + "\');" // use pastChartLocation if not the current week's chart, otherwise use currentChartLocation
  );


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Billboard', 'The Hot 100', 'Week of August 13, 2022', '2022-08-13 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2022-08-13/');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1314; // SELECT last_insert_rowid();
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
        "title": "Cuff It",
        "artist_name": "Beyonce",
        "video_id": null,
        "capture_date": "2022-08-14 02:19:50.330330",
        "source_id": 1314,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Alien Superstar",
        "artist_name": "Beyonce",
        "video_id": null,
        "capture_date": "2022-08-14 02:19:50.330330",
        "source_id": 1314,
        "song_id": 12586,
        "duplicate": true
    },
    {
        "title": "Church Girl",
        "artist_name": "Beyonce",
        "video_id": null,
        "capture_date": "2022-08-14 02:19:50.330330",
        "source_id": 1314,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I'm That Girl",
        "artist_name": "Beyonce",
        "video_id": null,
        "capture_date": "2022-08-14 02:19:50.330330",
        "source_id": 1314,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Energy",
        "artist_name": "Beyonce ft. BEAM",
        "video_id": null,
        "capture_date": "2022-08-14 02:19:50.330330",
        "source_id": 1314,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cozy",
        "artist_name": "Beyonce",
        "video_id": null,
        "capture_date": "2022-08-14 02:19:50.330330",
        "source_id": 1314,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Plastic Off The Sofa",
        "artist_name": "Beyonce",
        "video_id": null,
        "capture_date": "2022-08-14 02:19:50.331331",
        "source_id": 1314,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Virgo's Groove",
        "artist_name": "Beyonce",
        "video_id": null,
        "capture_date": "2022-08-14 02:19:50.331331",
        "source_id": 1314,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Summer Renaissance",
        "artist_name": "Beyonce",
        "video_id": null,
        "capture_date": "2022-08-14 02:19:50.331331",
        "source_id": 1314,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Never Sleep",
        "artist_name": "NAV, Travis Scott & Lil Baby",
        "video_id": null,
        "capture_date": "2022-08-14 02:19:50.331331",
        "source_id": 1314,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Heated",
        "artist_name": "Beyonce",
        "video_id": null,
        "capture_date": "2022-08-14 02:19:50.331331",
        "source_id": 1314,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Thique",
        "artist_name": "Beyonce",
        "video_id": null,
        "capture_date": "2022-08-14 02:19:50.331331",
        "source_id": 1314,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Move",
        "artist_name": "Beyonce ft. Grace Jones & Tems",
        "video_id": null,
        "capture_date": "2022-08-14 02:19:50.331331",
        "source_id": 1314,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pure/Honey",
        "artist_name": "Beyonce",
        "video_id": null,
        "capture_date": "2022-08-14 02:19:50.331331",
        "source_id": 1314,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "America Has A Problem",
        "artist_name": "Beyonce",
        "video_id": null,
        "capture_date": "2022-08-14 02:19:50.332332",
        "source_id": 1314,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "All Up In Your Mind",
        "artist_name": "Beyonce",
        "video_id": null,
        "capture_date": "2022-08-14 02:19:50.332332",
        "source_id": 1314,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Victoria’s Secret",
        "artist_name": "Jax",
        "video_id": null,
        "capture_date": "2022-08-14 02:19:50.332332",
        "source_id": 1314,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dah Dah DahDah",
        "artist_name": "Nardo Wick",
        "video_id": null,
        "capture_date": "2022-08-14 02:19:50.332332",
        "source_id": 1314,
        "song_id": 12557,
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
  // If ’ replaced, check again for duplicate

  INSERT INTO song
    (title, artist_name, video_id)
  VALUES
  ('Cuff It', 'Beyonce', NULL),
  ('Church Girl', 'Beyonce', NULL),
  ('I’m That Girl', 'Beyonce', NULL),
  ('Energy', 'Beyonce ft. BEAM', NULL),
  ('Cozy', 'Beyonce', NULL),
  ('Plastic Off The Sofa', 'Beyonce', NULL),
  ('Virgo’s Groove', 'Beyonce', NULL),
  ('Summer Renaissance', 'Beyonce', NULL),
  ('Never Sleep', 'NAV, Travis Scott & Lil Baby', NULL),
  ('Heated', 'Beyonce', NULL),
  ('Thique', 'Beyonce', NULL),
  ('Move', 'Beyonce ft. Grace Jones & Tems', NULL),
  ('Pure/Honey', 'Beyonce', NULL),
  ('America Has A Problem', 'Beyonce', NULL),
  ('All Up In Your Mind', 'Beyonce', NULL),
  ('Victoria’s Secret', 'Jax', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12614; // SELECT last_insert_rowid();

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
  ('2022-08-14 02:19:50.330330', '1314', '12599'),
  ('2022-08-14 02:19:50.330330', '1314', '12586'),
  ('2022-08-14 02:19:50.330330', '1314', '12600'),
  ('2022-08-14 02:19:50.330330', '1314', '12601'),
  ('2022-08-14 02:19:50.330330', '1314', '12602'),
  ('2022-08-14 02:19:50.330330', '1314', '12603'),
  ('2022-08-14 02:19:50.331331', '1314', '12604'),
  ('2022-08-14 02:19:50.331331', '1314', '12605'),
  ('2022-08-14 02:19:50.331331', '1314', '12606'),
  ('2022-08-14 02:19:50.331331', '1314', '12607'),
  ('2022-08-14 02:19:50.331331', '1314', '12608'),
  ('2022-08-14 02:19:50.331331', '1314', '12609'),
  ('2022-08-14 02:19:50.331331', '1314', '12610'),
  ('2022-08-14 02:19:50.331331', '1314', '12611'),
  ('2022-08-14 02:19:50.332332', '1314', '12612'),
  ('2022-08-14 02:19:50.332332', '1314', '12613'),
  ('2022-08-14 02:19:50.332332', '1314', '12614'),
  ('2022-08-14 02:19:50.332332', '1314', '12557')
  ;

  // Update to source_song table
