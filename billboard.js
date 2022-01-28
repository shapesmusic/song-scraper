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
  currentChartLocation = window.location.href + moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD");
  currentChartLocation = window.location.href;

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
    ('Billboard', 'The Hot 100', 'Week of January 22, 2022', '2022-01-22 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2022-01-22/');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1100; // SELECT last_insert_rowid();
  song_id = null;

  // elements = document.getElementsByClassName('chart-list__element display--flex');
  elements = document.getElementsByClassName('o-chart-results-list-row-container');


  songsData = [];

  for (var i=1; i<elements.length; i++){ // does not include the No. 1 song
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
        "title": "Pushin P",
        "artist_name": "Gunna & Future ft. Young Thug",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.538538",
        "source_id": 1100,
        "song_id": 11461,
        "duplicate": true
    },
    {
        "title": "Sacrifice",
        "artist_name": "The Weeknd",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.538538",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Thought I Was Playing",
        "artist_name": "Gunna & 21 Savage",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.539539",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "25k Jacket",
        "artist_name": "Gunna ft. Lil Baby",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.539539",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gasoline",
        "artist_name": "The Weeknd",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.540540",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Is There Someone Else?",
        "artist_name": "The Weeknd",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.540540",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Out Of Time",
        "artist_name": "The Weeknd",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.540540",
        "source_id": 1100,
        "song_id": 11460,
        "duplicate": true
    },
    {
        "title": "How Do I Make You Love Me?",
        "artist_name": "The Weeknd",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.540540",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Poochie Gown",
        "artist_name": "Gunna",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.540540",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mop",
        "artist_name": "Gunna ft. Young Thug",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.540540",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Alotta Cake",
        "artist_name": "Gunna",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.540540",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "How You Did That",
        "artist_name": "Gunna ft. Kodak Black",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.540540",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Here We Go... Again",
        "artist_name": "The Weeknd ft. Tyler, The Creator",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.540540",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Less Than Zero",
        "artist_name": "The Weeknd",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.541541",
        "source_id": 1100,
        "song_id": 11481,
        "duplicate": true
    },
    {
        "title": "IDK That Bitch",
        "artist_name": "Gunna ft. G Herbo",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.541541",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Best Friends",
        "artist_name": "The Weeknd",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.541541",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Livin Wild",
        "artist_name": "Gunna",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.541541",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Heard You're Married",
        "artist_name": "The Weeknd ft. Lil Wayne",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.541541",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Circles Around This Town",
        "artist_name": "Maren Morris",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.541541",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dawn FM",
        "artist_name": "The Weeknd",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.541541",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Private Island",
        "artist_name": "Gunna",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.541541",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "South To West",
        "artist_name": "Gunna",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.541541",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "You & Me",
        "artist_name": "Gunna & Chloe",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.541541",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Starry Eyes",
        "artist_name": "The Weeknd",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.542542",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Don't Break My Heart",
        "artist_name": "The Weeknd",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.542542",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Flooded",
        "artist_name": "Gunna",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.542542",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Die Alone",
        "artist_name": "Gunna & Chris Brown ft. Yung Bleu",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.542542",
        "source_id": 1100,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Every Angel Is Terrifying",
        "artist_name": "The Weeknd",
        "video_id": null,
        "capture_date": "2022-01-27 05:04:35.542542",
        "source_id": 1100,
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
  ('Sacrifice', 'The Weeknd', NULL),
  ('Thought I Was Playing', 'Gunna & 21 Savage', NULL),
  ('25k Jacket', 'Gunna ft. Lil Baby', NULL),
  ('Gasoline', 'The Weeknd', NULL),
  ('Is There Someone Else?', 'The Weeknd', NULL),
  ('How Do I Make You Love Me?', 'The Weeknd', NULL),
  ('Poochie Gown', 'Gunna', NULL),
  ('Mop', 'Gunna ft. Young Thug', NULL),
  ('Alotta Cake', 'Gunna', NULL),
  ('How You Did That', 'Gunna ft. Kodak Black', NULL),
  ('Here We Go... Again', 'The Weeknd ft. Tyler, The Creator', NULL),
  ('IDK That Bitch', 'Gunna ft. G Herbo', NULL),
  ('Best Friends', 'The Weeknd', NULL),
  ('Livin Wild', 'Gunna', NULL),
  ('I Heard You’re Married', 'The Weeknd ft. Lil Wayne', NULL),
  ('Circles Around This Town', 'Maren Morris', NULL),
  ('Dawn FM', 'The Weeknd', NULL),
  ('Private Island', 'Gunna', NULL),
  ('South To West', 'Gunna', NULL),
  ('You & Me', 'Gunna & Chloe', NULL),
  ('Starry Eyes', 'The Weeknd', NULL),
  ('Don’t Break My Heart', 'The Weeknd', NULL),
  ('Flooded', 'Gunna', NULL),
  ('Die Alone', 'Gunna & Chris Brown ft. Yung Bleu', NULL),
  ('Every Angel Is Terrifying', 'The Weeknd', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11514; // SELECT last_insert_rowid();

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
  ('2022-01-27 05:04:35.538538', '1100', '11461'),
  ('2022-01-27 05:04:35.538538', '1100', '11490'),
  ('2022-01-27 05:04:35.539539', '1100', '11491'),
  ('2022-01-27 05:04:35.539539', '1100', '11492'),
  ('2022-01-27 05:04:35.540540', '1100', '11493'),
  ('2022-01-27 05:04:35.540540', '1100', '11494'),
  ('2022-01-27 05:04:35.540540', '1100', '11460'),
  ('2022-01-27 05:04:35.540540', '1100', '11495'),
  ('2022-01-27 05:04:35.540540', '1100', '11496'),
  ('2022-01-27 05:04:35.540540', '1100', '11497'),
  ('2022-01-27 05:04:35.540540', '1100', '11498'),
  ('2022-01-27 05:04:35.540540', '1100', '11499'),
  ('2022-01-27 05:04:35.540540', '1100', '11500'),
  ('2022-01-27 05:04:35.541541', '1100', '11481'),
  ('2022-01-27 05:04:35.541541', '1100', '11501'),
  ('2022-01-27 05:04:35.541541', '1100', '11502'),
  ('2022-01-27 05:04:35.541541', '1100', '11503'),
  ('2022-01-27 05:04:35.541541', '1100', '11504'),
  ('2022-01-27 05:04:35.541541', '1100', '11505'),
  ('2022-01-27 05:04:35.541541', '1100', '11506'),
  ('2022-01-27 05:04:35.541541', '1100', '11507'),
  ('2022-01-27 05:04:35.541541', '1100', '11508'),
  ('2022-01-27 05:04:35.541541', '1100', '11509'),
  ('2022-01-27 05:04:35.542542', '1100', '11510'),
  ('2022-01-27 05:04:35.542542', '1100', '11511'),
  ('2022-01-27 05:04:35.542542', '1100', '11512'),
  ('2022-01-27 05:04:35.542542', '1100', '11513'),
  ('2022-01-27 05:04:35.542542', '1100', '11514')
  ;

  // Update to source_song table
