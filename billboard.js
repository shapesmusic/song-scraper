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
  ('Billboard', 'The Hot 100', 'Week of April 16, 2022', '2022-04-16 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2022-04-16/');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1183; // SELECT last_insert_rowid();
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
        "title": "In My Head",
        "artist_name": "Lil Tjay",
        "video_id": null,
        "capture_date": "2022-05-27 06:39:50.431431",
        "source_id": 1183,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "When You're Gone",
        "artist_name": "Shawn Mendes",
        "video_id": null,
        "capture_date": "2022-05-27 06:39:50.431431",
        "source_id": 1183,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Stick",
        "artist_name": "JID & J. Cole Featuring Kenny Mason & Sheck Wes",
        "video_id": null,
        "capture_date": "2022-05-27 06:39:50.433433",
        "source_id": 1183,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Damn Strait",
        "artist_name": "Scotty McCreery",
        "video_id": null,
        "capture_date": "2022-05-27 06:39:50.434434",
        "source_id": 1183,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Take My Name",
        "artist_name": "Parmalee",
        "video_id": null,
        "capture_date": "2022-05-27 06:39:50.434434",
        "source_id": 1183,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Complete Mess",
        "artist_name": "5 Seconds Of Summer",
        "video_id": null,
        "capture_date": "2022-05-27 06:39:50.434434",
        "source_id": 1183,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "4KT Baby",
        "artist_name": "YoungBoy Never Broke Again",
        "video_id": null,
        "capture_date": "2022-05-27 06:39:50.435435",
        "source_id": 1183,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Blood All On It",
        "artist_name": "Gucci Mane Featuring Key Glock & Young Dolph",
        "video_id": null,
        "capture_date": "2022-05-27 06:39:50.435435",
        "source_id": 1183,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Desesperados",
        "artist_name": "Rauw Alejandro & Chencho Corleone",
        "video_id": null,
        "capture_date": "2022-05-27 06:39:50.435435",
        "source_id": 1183,
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
  ('In My Head', 'Lil Tjay', NULL),
  ('When You’re Gone', 'Shawn Mendes', NULL),
  ('Stick', 'JID & J. Cole Featuring Kenny Mason & Sheck Wes', NULL),
  ('Damn Strait', 'Scotty McCreery', NULL),
  ('Take My Name', 'Parmalee', NULL),
  ('Complete Mess', '5 Seconds Of Summer', NULL),
  ('4KT Baby', 'YoungBoy Never Broke Again', NULL),
  ('Blood All On It', 'Gucci Mane Featuring Key Glock & Young Dolph', NULL),
  ('Desesperados', 'Rauw Alejandro & Chencho Corleone', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11974; // SELECT last_insert_rowid();

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
  ('2022-05-27 06:39:50.431431', '1183', '11966'),
  ('2022-05-27 06:39:50.431431', '1183', '11967'),
  ('2022-05-27 06:39:50.433433', '1183', '11968'),
  ('2022-05-27 06:39:50.434434', '1183', '11969'),
  ('2022-05-27 06:39:50.434434', '1183', '11970'),
  ('2022-05-27 06:39:50.434434', '1183', '11971'),
  ('2022-05-27 06:39:50.435435', '1183', '11972'),
  ('2022-05-27 06:39:50.435435', '1183', '11973'),
  ('2022-05-27 06:39:50.435435', '1183', '11974')
  ;

  // Update to source_song table
