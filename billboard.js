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
    ('Billboard', 'The Hot 100', 'Week of September 9, 2023', '2023-09-09 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2023-09-09/');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1696; // SELECT last_insert_rowid();
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
        "title": "Used To Be Young",
        "artist_name": "Miley Cyrus",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.514514",
        "source_id": 1696,
        "song_id": 14675,
        "duplicate": true
    },
    {
        "title": "Hey Driver",
        "artist_name": "Zach Bryan ft. The War And Treaty",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.515515",
        "source_id": 1696,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Spotless",
        "artist_name": "Zach Bryan ft. The Lumineers",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.515515",
        "source_id": 1696,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "East Side Of Sorrow",
        "artist_name": "Zach Bryan",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.515515",
        "source_id": 1696,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Single Soon",
        "artist_name": "Selena Gomez",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.515515",
        "source_id": 1696,
        "song_id": 14679,
        "duplicate": true
    },
    {
        "title": "Tourniquet",
        "artist_name": "Zach Bryan",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.515515",
        "source_id": 1696,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Overtime",
        "artist_name": "Zach Bryan",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.515515",
        "source_id": 1696,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Summertime's Close",
        "artist_name": "Zach Bryan",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.515515",
        "source_id": 1696,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fear And Friday's",
        "artist_name": "Zach Bryan",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.515515",
        "source_id": 1696,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ticking",
        "artist_name": "Zach Bryan",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.515515",
        "source_id": 1696,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "El Dorado",
        "artist_name": "Zach Bryan",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.515515",
        "source_id": 1696,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Holy Roller",
        "artist_name": "Zach Bryan ft. Sierra Ferrell",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.515515",
        "source_id": 1696,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Smaller Acts",
        "artist_name": "Zach Bryan",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.515515",
        "source_id": 1696,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Jake's Piano - Long Island",
        "artist_name": "Zach Bryan",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.516516",
        "source_id": 1696,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tradesman",
        "artist_name": "Zach Bryan",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.516516",
        "source_id": 1696,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Oklahoman Son",
        "artist_name": "Zach Bryan",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.516516",
        "source_id": 1696,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sittin' On Top Of The World",
        "artist_name": "Burna Boy",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.517517",
        "source_id": 1696,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "There I Go",
        "artist_name": "Gucci Mane ft. J. Cole & Mike WiLL Made-It",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.517517",
        "source_id": 1696,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Primera Cita",
        "artist_name": "Carin Leon",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.517517",
        "source_id": 1696,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "On My Mama",
        "artist_name": "Victoria Monet",
        "video_id": null,
        "capture_date": "2023-09-16 09:33:49.517517",
        "source_id": 1696,
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
  ('Hey Driver', 'Zach Bryan ft. The War And Treaty', NULL),
  ('Spotless', 'Zach Bryan ft. The Lumineers', NULL),
  ('East Side Of Sorrow', 'Zach Bryan', NULL),
  ('Tourniquet', 'Zach Bryan', NULL),
  ('Overtime', 'Zach Bryan', NULL),
  ('Summertime’s Close', 'Zach Bryan', NULL),
  ('Fear And Friday’s', 'Zach Bryan', NULL),
  ('Ticking', 'Zach Bryan', NULL),
  ('El Dorado', 'Zach Bryan', NULL),
  ('Holy Roller', 'Zach Bryan ft. Sierra Ferrell', NULL),
  ('Smaller Acts', 'Zach Bryan', NULL),
  ('Jake’s Piano - Long Island', 'Zach Bryan', NULL),
  ('Tradesman', 'Zach Bryan', NULL),
  ('Oklahoman Son', 'Zach Bryan', NULL),
  ('Sittin’ On Top Of The World', 'Burna Boy', NULL),
  ('There I Go', 'Gucci Mane ft. J. Cole & Mike WiLL Made-It', NULL),
  ('Primera Cita', 'Carin Leon', NULL),
  ('On My Mama', 'Victoria Monet', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 14707; // SELECT last_insert_rowid();

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
  ('2023-09-16 09:33:49.514514', '1696', '14675'),
  ('2023-09-16 09:33:49.515515', '1696', '14690'),
  ('2023-09-16 09:33:49.515515', '1696', '14691'),
  ('2023-09-16 09:33:49.515515', '1696', '14692'),
  ('2023-09-16 09:33:49.515515', '1696', '14679'),
  ('2023-09-16 09:33:49.515515', '1696', '14693'),
  ('2023-09-16 09:33:49.515515', '1696', '14694'),
  ('2023-09-16 09:33:49.515515', '1696', '14695'),
  ('2023-09-16 09:33:49.515515', '1696', '14696'),
  ('2023-09-16 09:33:49.515515', '1696', '14697'),
  ('2023-09-16 09:33:49.515515', '1696', '14698'),
  ('2023-09-16 09:33:49.515515', '1696', '14699'),
  ('2023-09-16 09:33:49.515515', '1696', '14700'),
  ('2023-09-16 09:33:49.516516', '1696', '14701'),
  ('2023-09-16 09:33:49.516516', '1696', '14702'),
  ('2023-09-16 09:33:49.516516', '1696', '14703'),
  ('2023-09-16 09:33:49.517517', '1696', '14704'),
  ('2023-09-16 09:33:49.517517', '1696', '14705'),
  ('2023-09-16 09:33:49.517517', '1696', '14706'),
  ('2023-09-16 09:33:49.517517', '1696', '14707')
  ;

  // Update to source_song table
