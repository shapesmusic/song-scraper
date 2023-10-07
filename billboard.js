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
    ('Billboard', 'The Hot 100', 'Week of October 7, 2023', '2023-10-07 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2023-10-07');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1727; // SELECT last_insert_rowid();
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
        "title": "Sarah's Place",
        "artist_name": "Zach Bryan ft. Noah Kahan",
        "video_id": null,
        "capture_date": "2023-10-07 01:44:36.341341",
        "source_id": 1727,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Agora Hills",
        "artist_name": "Doja Cat",
        "video_id": null,
        "capture_date": "2023-10-07 01:44:36.342342",
        "source_id": 1727,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Boys Of Faith",
        "artist_name": "Zach Bryan ft. Bon Iver",
        "video_id": null,
        "capture_date": "2023-10-07 01:44:36.342342",
        "source_id": 1727,
        "song_id": 14816,
        "duplicate": true
    },
    {
        "title": "Deep Satin",
        "artist_name": "Zach Bryan",
        "video_id": null,
        "capture_date": "2023-10-07 01:44:36.343343",
        "source_id": 1727,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Nine Ball",
        "artist_name": "Zach Bryan",
        "video_id": null,
        "capture_date": "2023-10-07 01:44:36.343343",
        "source_id": 1727,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "El Jefe",
        "artist_name": "Shakira X Fuerza Regida",
        "video_id": null,
        "capture_date": "2023-10-07 01:44:36.343343",
        "source_id": 1727,
        "song_id": 14820,
        "duplicate": true
    },
    {
        "title": "500lbs",
        "artist_name": "Lil Tecca",
        "video_id": null,
        "capture_date": "2023-10-07 01:44:36.343343",
        "source_id": 1727,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "One More Time",
        "artist_name": "Blink-182",
        "video_id": null,
        "capture_date": "2023-10-07 01:44:36.343343",
        "source_id": 1727,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Un Preview",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2023-10-07 01:44:36.343343",
        "source_id": 1727,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Pain, Sweet, Pain",
        "artist_name": "Zach Bryan",
        "video_id": null,
        "capture_date": "2023-10-07 01:44:36.343343",
        "source_id": 1727,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "My Love Mine All Mine",
        "artist_name": "Mitski",
        "video_id": null,
        "capture_date": "2023-10-07 01:44:36.344344",
        "source_id": 1727,
        "song_id": 14781,
        "duplicate": true
    },
    {
        "title": "Segun Quien",
        "artist_name": "Maluma & Carin Leon",
        "video_id": null,
        "capture_date": "2023-10-07 01:44:36.344344",
        "source_id": 1727,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "HVN On Earth",
        "artist_name": "Lil Tecca & Kodak Black",
        "video_id": null,
        "capture_date": "2023-10-07 01:44:36.344344",
        "source_id": 1727,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Can't Have Mine",
        "artist_name": "Dylan Scott",
        "video_id": null,
        "capture_date": "2023-10-07 01:44:36.344344",
        "source_id": 1727,
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
  // If ’ replaced, check again for duplicate

  INSERT INTO song
    (title, artist_name, video_id)
  VALUES
  ('Sarah’s Place', 'Zach Bryan ft. Noah Kahan', NULL),
  ('Agora Hills', 'Doja Cat', NULL),
  ('Deep Satin', 'Zach Bryan', NULL),
  ('Nine Ball', 'Zach Bryan', NULL),
  ('500lbs', 'Lil Tecca', NULL),
  ('One More Time', 'Blink-182', NULL),
  ('Un Preview', 'Bad Bunny', NULL),
  ('Pain, Sweet, Pain', 'Zach Bryan', NULL),
  ('Segun Quien', 'Maluma & Carin Leon', NULL),
  ('HVN On Earth', 'Lil Tecca & Kodak Black', NULL),
  ('Can’t Have Mine', 'Dylan Scott', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 14840; // SELECT last_insert_rowid();

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
  ('2023-10-07 01:44:36.341341', '1727', '14830'),
  ('2023-10-07 01:44:36.342342', '1727', '14831'),
  ('2023-10-07 01:44:36.342342', '1727', '14816'),
  ('2023-10-07 01:44:36.343343', '1727', '14832'),
  ('2023-10-07 01:44:36.343343', '1727', '14833'),
  ('2023-10-07 01:44:36.343343', '1727', '14820'),
  ('2023-10-07 01:44:36.343343', '1727', '14834'),
  ('2023-10-07 01:44:36.343343', '1727', '14835'),
  ('2023-10-07 01:44:36.343343', '1727', '14836'),
  ('2023-10-07 01:44:36.343343', '1727', '14837'),
  ('2023-10-07 01:44:36.344344', '1727', '14781'),
  ('2023-10-07 01:44:36.344344', '1727', '14838'),
  ('2023-10-07 01:44:36.344344', '1727', '14839'),
  ('2023-10-07 01:44:36.344344', '1727', '14840')
  ;

  // Update to source_song table
