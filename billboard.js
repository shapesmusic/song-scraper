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
    ('Billboard', 'The Hot 100', 'Week of October 28, 2023', '2023-10-28 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2023-10-28');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1742; // SELECT last_insert_rowid();
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
        "title": "Monaco",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.926926",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fina",
        "artist_name": "Bad Bunny & Young Miko",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.926926",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Perro Negro",
        "artist_name": "Bad Bunny & Feid",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.926926",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Nadie Sabe",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.926926",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hibiki",
        "artist_name": "Bad Bunny & Mora",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.927927",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mr. October",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.927927",
        "source_id": 1742,
        "song_id": 14907,
        "duplicate": true
    },
    {
        "title": "Cybertruck",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.927927",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Telefono Nuevo",
        "artist_name": "Bad Bunny & Luar La L",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.927927",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Baby Nueva",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.927927",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Seda",
        "artist_name": "Bad Bunny & Bryant Myers",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.927927",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Say My Grace",
        "artist_name": "Offset ft. Travis Scott",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.927927",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gracias Por Nada",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.927927",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Vou 787",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.927927",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mercedes Carota",
        "artist_name": "Bad Bunny & YOVNGCHIMI",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.928928",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Los Pits",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.928928",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "No Me Quiero Casar",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.928928",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Vuelve Candy B",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.928928",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Baticano",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.928928",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Thunder y Lightning",
        "artist_name": "Bad Bunny & Eladio Carrion",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.928928",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Acho PR",
        "artist_name": "Bad Bunny, Arcangel, De La Ghetto & Nengo Flow",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.928928",
        "source_id": 1742,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Worth It",
        "artist_name": "Offset & Don Toliver",
        "video_id": null,
        "capture_date": "2023-10-31 04:22:05.929929",
        "source_id": 1742,
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
  ('Monaco', 'Bad Bunny', NULL),
  ('Fina', 'Bad Bunny & Young Miko', NULL),
  ('Perro Negro', 'Bad Bunny & Feid', NULL),
  ('Nadie Sabe', 'Bad Bunny', NULL),
  ('Hibiki', 'Bad Bunny & Mora', NULL),
  ('Cybertruck', 'Bad Bunny', NULL),
  ('Telefono Nuevo', 'Bad Bunny & Luar La L', NULL),
  ('Baby Nueva', 'Bad Bunny', NULL),
  ('Seda', 'Bad Bunny & Bryant Myers', NULL),
  ('Say My Grace', 'Offset ft. Travis Scott', NULL),
  ('Gracias Por Nada', 'Bad Bunny', NULL),
  ('Vou 787', 'Bad Bunny', NULL),
  ('Mercedes Carota', 'Bad Bunny & YOVNGCHIMI', NULL),
  ('Los Pits', 'Bad Bunny', NULL),
  ('No Me Quiero Casar', 'Bad Bunny', NULL),
  ('Vuelve Candy B', 'Bad Bunny', NULL),
  ('Baticano', 'Bad Bunny', NULL),
  ('Thunder y Lightning', 'Bad Bunny & Eladio Carrion', NULL),
  ('Acho PR', 'Bad Bunny, Arcangel, De La Ghetto & Nengo Flow', NULL),
  ('Worth It', 'Offset & Don Toliver', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 14945; // SELECT last_insert_rowid();

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
  ('2023-10-31 04:22:05.926926', '1742', '14926'),
  ('2023-10-31 04:22:05.926926', '1742', '14927'),
  ('2023-10-31 04:22:05.926926', '1742', '14928'),
  ('2023-10-31 04:22:05.926926', '1742', '14929'),
  ('2023-10-31 04:22:05.927927', '1742', '14930'),
  ('2023-10-31 04:22:05.927927', '1742', '14907'),
  ('2023-10-31 04:22:05.927927', '1742', '14931'),
  ('2023-10-31 04:22:05.927927', '1742', '14932'),
  ('2023-10-31 04:22:05.927927', '1742', '14933'),
  ('2023-10-31 04:22:05.927927', '1742', '14934'),
  ('2023-10-31 04:22:05.927927', '1742', '14935'),
  ('2023-10-31 04:22:05.927927', '1742', '14936'),
  ('2023-10-31 04:22:05.927927', '1742', '14937'),
  ('2023-10-31 04:22:05.928928', '1742', '14938'),
  ('2023-10-31 04:22:05.928928', '1742', '14939'),
  ('2023-10-31 04:22:05.928928', '1742', '14940'),
  ('2023-10-31 04:22:05.928928', '1742', '14941'),
  ('2023-10-31 04:22:05.928928', '1742', '14942'),
  ('2023-10-31 04:22:05.928928', '1742', '14943'),
  ('2023-10-31 04:22:05.928928', '1742', '14944'),
  ('2023-10-31 04:22:05.929929', '1742', '14945')
  ;

  // Update to source_song table
