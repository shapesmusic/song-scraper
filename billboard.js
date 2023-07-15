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
    ('Billboard', 'The Hot 100', 'Week of July 15, 2023', '2023-07-15 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2023-07-15');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1662; // SELECT last_insert_rowid();
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
        "title": "Flooded The Face",
        "artist_name": "Lil Uzi Vert",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.922922",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Endless Fashion",
        "artist_name": "Lil Uzi Vert ft. Nicki Minaj",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.928928",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Suicide Doors",
        "artist_name": "Lil Uzi Vert",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.928928",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Aye",
        "artist_name": "Lil Uzi Vert ft. Travis Scott",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.928928",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tulum",
        "artist_name": "Peso Pluma & Grupo Frontera",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.929929",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Gotta",
        "artist_name": "Lil Uzi Vert",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.929929",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Spin Again",
        "artist_name": "Lil Uzi Vert",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.932932",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Crush Em",
        "artist_name": "Lil Uzi Vert",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.932932",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "X2",
        "artist_name": "Lil Uzi Vert",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.932932",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mojabi Ghost",
        "artist_name": "Tainy & Bad Bunny",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.932932",
        "source_id": 1662,
        "song_id": 14443,
        "duplicate": true
    },
    {
        "title": "Pluto To Mars",
        "artist_name": "Lil Uzi Vert",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.935935",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mama, I'm Sorry",
        "artist_name": "Lil Uzi Vert",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.936936",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Amped",
        "artist_name": "Lil Uzi Vert",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.936936",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Patience",
        "artist_name": "Lil Uzi Vert ft. Don Toliver",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.936936",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Nakamura",
        "artist_name": "Lil Uzi Vert",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.936936",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "All Alone",
        "artist_name": "Lil Uzi Vert",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.936936",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Died And Came Back",
        "artist_name": "Lil Uzi Vert",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.936936",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Werewolf",
        "artist_name": "Lil Uzi Vert ft. Bring Me The Horizon",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.936936",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Zoom",
        "artist_name": "Lil Uzi Vert",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.937937",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "That Fiya",
        "artist_name": "Lil Uzi Vert",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.937937",
        "source_id": 1662,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "We Didn't Start The Fire",
        "artist_name": "Fall Out Boy",
        "video_id": null,
        "capture_date": "2023-07-14 07:02:36.937937",
        "source_id": 1662,
        "song_id": 14445,
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
  ('Flooded The Face', 'Lil Uzi Vert', NULL),
  ('Endless Fashion', 'Lil Uzi Vert ft. Nicki Minaj', NULL),
  ('Suicide Doors', 'Lil Uzi Vert', NULL),
  ('Aye', 'Lil Uzi Vert ft. Travis Scott', NULL),
  ('Tulum', 'Peso Pluma & Grupo Frontera', NULL),
  ('I Gotta', 'Lil Uzi Vert', NULL),
  ('Spin Again', 'Lil Uzi Vert', NULL),
  ('Crush Em', 'Lil Uzi Vert', NULL),
  ('X2', 'Lil Uzi Vert', NULL),
  ('Pluto To Mars', 'Lil Uzi Vert', NULL),
  ('Mama, I’m Sorry', 'Lil Uzi Vert', NULL),
  ('Amped', 'Lil Uzi Vert', NULL),
  ('Patience', 'Lil Uzi Vert ft. Don Toliver', NULL),
  ('Nakamura', 'Lil Uzi Vert', NULL),
  ('All Alone', 'Lil Uzi Vert', NULL),
  ('Died And Came Back', 'Lil Uzi Vert', NULL),
  ('Werewolf', 'Lil Uzi Vert ft. Bring Me The Horizon', NULL),
  ('Zoom', 'Lil Uzi Vert', NULL),
  ('That Fiya', 'Lil Uzi Vert', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 14478; // SELECT last_insert_rowid();

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
  ('2023-07-14 07:02:36.922922', '1662', '14460'),
  ('2023-07-14 07:02:36.928928', '1662', '14461'),
  ('2023-07-14 07:02:36.928928', '1662', '14462'),
  ('2023-07-14 07:02:36.928928', '1662', '14463'),
  ('2023-07-14 07:02:36.929929', '1662', '14464'),
  ('2023-07-14 07:02:36.929929', '1662', '14465'),
  ('2023-07-14 07:02:36.932932', '1662', '14466'),
  ('2023-07-14 07:02:36.932932', '1662', '14467'),
  ('2023-07-14 07:02:36.932932', '1662', '14468'),
  ('2023-07-14 07:02:36.932932', '1662', '14443'),
  ('2023-07-14 07:02:36.935935', '1662', '14469'),
  ('2023-07-14 07:02:36.936936', '1662', '14470'),
  ('2023-07-14 07:02:36.936936', '1662', '14471'),
  ('2023-07-14 07:02:36.936936', '1662', '14472'),
  ('2023-07-14 07:02:36.936936', '1662', '14473'),
  ('2023-07-14 07:02:36.936936', '1662', '14474'),
  ('2023-07-14 07:02:36.936936', '1662', '14475'),
  ('2023-07-14 07:02:36.936936', '1662', '14476'),
  ('2023-07-14 07:02:36.937937', '1662', '14477'),
  ('2023-07-14 07:02:36.937937', '1662', '14478'),
  ('2023-07-14 07:02:36.937937', '1662', '14445')
  ;

  // Update to source_song table
