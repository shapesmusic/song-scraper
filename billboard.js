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
    ('Billboard', 'The Hot 100', 'Week of April 1, 2023', '2023-04-01 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2023-04-01/2023-04-01');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1555; // SELECT last_insert_rowid();
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
        "title": "All Of The Girls You Loved Before",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-04-19 11:22:42.229229",
        "source_id": 1555,
        "song_id": 13697,
        "duplicate": true
    },
    {
        "title": "Ella Baila Sola",
        "artist_name": "Eslabon Armado X Peso Pluma",
        "video_id": null,
        "capture_date": "2023-04-19 11:22:42.230230",
        "source_id": 1555,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Set Me Free, Pt. 2",
        "artist_name": "Jimin",
        "video_id": null,
        "capture_date": "2023-04-19 11:22:42.230230",
        "source_id": 1555,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "5 Leaf Clover",
        "artist_name": "Luke Combs",
        "video_id": null,
        "capture_date": "2023-04-19 11:22:42.231231",
        "source_id": 1555,
        "song_id": 13704,
        "duplicate": true
    },
    {
        "title": "Eat Your Young",
        "artist_name": "Hozier",
        "video_id": null,
        "capture_date": "2023-04-19 11:22:42.231231",
        "source_id": 1555,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "La Bebe",
        "artist_name": "Yng Lvcas x Peso Pluma",
        "video_id": null,
        "capture_date": "2023-04-19 11:22:42.231231",
        "source_id": 1555,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "El Gordo Trae El Mando",
        "artist_name": "Chino Pacas",
        "video_id": null,
        "capture_date": "2023-04-19 11:22:42.232232",
        "source_id": 1555,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Coco Chanel",
        "artist_name": "Eladio Carrion & Bad Bunny",
        "video_id": null,
        "capture_date": "2023-04-19 11:22:42.232232",
        "source_id": 1555,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "ICU",
        "artist_name": "Coco Jones",
        "video_id": null,
        "capture_date": "2023-04-19 11:22:42.232232",
        "source_id": 1555,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Moonlight",
        "artist_name": "Kali Uchis",
        "video_id": null,
        "capture_date": "2023-04-19 11:22:42.233233",
        "source_id": 1555,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Death",
        "artist_name": "Melanie Martinez",
        "video_id": null,
        "capture_date": "2023-04-19 11:22:42.234234",
        "source_id": 1555,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Nasty",
        "artist_name": "Russ",
        "video_id": null,
        "capture_date": "2023-04-19 11:22:42.234234",
        "source_id": 1555,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cupid",
        "artist_name": "Fifty Fifty",
        "video_id": null,
        "capture_date": "2023-04-19 11:22:42.234234",
        "source_id": 1555,
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
  ('Ella Baila Sola', 'Eslabon Armado X Peso Pluma', NULL),
  ('Set Me Free, Pt. 2', 'Jimin', NULL),
  ('Eat Your Young', 'Hozier', NULL),
  ('La Bebe', 'Yng Lvcas x Peso Pluma', NULL),
  ('El Gordo Trae El Mando', 'Chino Pacas', NULL),
  ('Coco Chanel', 'Eladio Carrion & Bad Bunny', NULL),
  ('ICU', 'Coco Jones', NULL),
  ('Moonlight', 'Kali Uchis', NULL),
  ('Death', 'Melanie Martinez', NULL),
  ('Nasty', 'Russ', NULL),
  ('Cupid', 'Fifty Fifty', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 14011; // SELECT last_insert_rowid();

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
  ('2023-04-19 11:22:42.229229', '1555', '13697'),
  ('2023-04-19 11:22:42.230230', '1555', '14001'),
  ('2023-04-19 11:22:42.230230', '1555', '14002'),
  ('2023-04-19 11:22:42.231231', '1555', '13704'),
  ('2023-04-19 11:22:42.231231', '1555', '14003'),
  ('2023-04-19 11:22:42.231231', '1555', '14004'),
  ('2023-04-19 11:22:42.232232', '1555', '14005'),
  ('2023-04-19 11:22:42.232232', '1555', '14006'),
  ('2023-04-19 11:22:42.232232', '1555', '14007'),
  ('2023-04-19 11:22:42.233233', '1555', '14008'),
  ('2023-04-19 11:22:42.234234', '1555', '14009'),
  ('2023-04-19 11:22:42.234234', '1555', '14010'),
  ('2023-04-19 11:22:42.234234', '1555', '14011')
  ;

  // Update to source_song table
