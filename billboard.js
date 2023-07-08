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
    ('Billboard', 'The Hot 100', 'Week of July 8, 2023', '2023-07-08 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2023-07-08');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1658; // SELECT last_insert_rowid();
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
        "title": "Barbie World",
        "artist_name": "Nicki Minaj & Ice Spice With Aqua",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.080080",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Oh U Went",
        "artist_name": "Young Thug ft. Drake",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.081081",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sabor Fresa",
        "artist_name": "Fuerza Regida",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.081081",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Luna",
        "artist_name": "Peso Pluma & Junior H",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.082082",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lady Gaga",
        "artist_name": "Peso Pluma, Gabito Ballesteros & Junior H",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.082082",
        "source_id": 1658,
        "song_id": 14417,
        "duplicate": true
    },
    {
        "title": "Parade On Cleveland",
        "artist_name": "Young Thug ft. Drake",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.082082",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cars Bring Me Out",
        "artist_name": "Young Thug ft. Future",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.082082",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "VVS",
        "artist_name": "Peso Pluma, Edgardo Nunez & Los Dareyes de La Sierra",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.082082",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Wit Da Racks",
        "artist_name": "Young Thug ft. 21 Savage, Travis Scott & Yak Gotti",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.083083",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Doomsday.",
        "artist_name": "Juice WRLD & Cordae",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.083083",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Want Me Dead",
        "artist_name": "Young Thug ft. 21 Savage",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.083083",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rubicon",
        "artist_name": "Peso Pluma",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.083083",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hellcat Kenny",
        "artist_name": "Young Thug ft. Lil Uzi Vert",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.083083",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Money On The Dresser",
        "artist_name": "Young Thug",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.083083",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Uncle M",
        "artist_name": "Young Thug",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.083083",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Nueva Vida",
        "artist_name": "Peso Pluma",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.084084",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Watermelon Moonshine",
        "artist_name": "Lainey Wilson",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.084084",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lagunas",
        "artist_name": "Peso Pluma & Jasiel Nunez",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.084084",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rosa Pastel",
        "artist_name": "Peso Pluma & Jasiel Nunez",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.084084",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Abracadabra",
        "artist_name": "Young Thug ft. Travis Scott",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.084084",
        "source_id": 1658,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gucci Grocery Bag",
        "artist_name": "Young Thug",
        "video_id": null,
        "capture_date": "2023-07-07 05:51:44.084084",
        "source_id": 1658,
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
  ('Barbie World', 'Nicki Minaj & Ice Spice With Aqua', NULL),
  ('Oh U Went', 'Young Thug ft. Drake', NULL),
  ('Sabor Fresa', 'Fuerza Regida', NULL),
  ('Luna', 'Peso Pluma & Junior H', NULL),
  ('Parade On Cleveland', 'Young Thug ft. Drake', NULL),
  ('Cars Bring Me Out', 'Young Thug ft. Future', NULL),
  ('VVS', 'Peso Pluma, Edgardo Nunez & Los Dareyes de La Sierra', NULL),
  ('Wit Da Racks', 'Young Thug ft. 21 Savage, Travis Scott & Yak Gotti', NULL),
  ('Doomsday.', 'Juice WRLD & Cordae', NULL),
  ('Want Me Dead', 'Young Thug ft. 21 Savage', NULL),
  ('Rubicon', 'Peso Pluma', NULL),
  ('Hellcat Kenny', 'Young Thug ft. Lil Uzi Vert', NULL),
  ('Money On The Dresser', 'Young Thug', NULL),
  ('Uncle M', 'Young Thug', NULL),
  ('Nueva Vida', 'Peso Pluma', NULL),
  ('Watermelon Moonshine', 'Lainey Wilson', NULL),
  ('Lagunas', 'Peso Pluma & Jasiel Nunez', NULL),
  ('Rosa Pastel', 'Peso Pluma & Jasiel Nunez', NULL),
  ('Abracadabra', 'Young Thug ft. Travis Scott', NULL),
  ('Gucci Grocery Bag', 'Young Thug', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 14442; // SELECT last_insert_rowid();

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
  ('2023-07-07 05:51:44.080080', '1658', '14423'),
  ('2023-07-07 05:51:44.081081', '1658', '14424'),
  ('2023-07-07 05:51:44.081081', '1658', '14425'),
  ('2023-07-07 05:51:44.082082', '1658', '14426'),
  ('2023-07-07 05:51:44.082082', '1658', '14417'),
  ('2023-07-07 05:51:44.082082', '1658', '14427'),
  ('2023-07-07 05:51:44.082082', '1658', '14428'),
  ('2023-07-07 05:51:44.082082', '1658', '14429'),
  ('2023-07-07 05:51:44.083083', '1658', '14430'),
  ('2023-07-07 05:51:44.083083', '1658', '14431'),
  ('2023-07-07 05:51:44.083083', '1658', '14432'),
  ('2023-07-07 05:51:44.083083', '1658', '14433'),
  ('2023-07-07 05:51:44.083083', '1658', '14434'),
  ('2023-07-07 05:51:44.083083', '1658', '14435'),
  ('2023-07-07 05:51:44.083083', '1658', '14436'),
  ('2023-07-07 05:51:44.084084', '1658', '14437'),
  ('2023-07-07 05:51:44.084084', '1658', '14438'),
  ('2023-07-07 05:51:44.084084', '1658', '14439'),
  ('2023-07-07 05:51:44.084084', '1658', '14440'),
  ('2023-07-07 05:51:44.084084', '1658', '14441'),
  ('2023-07-07 05:51:44.084084', '1658', '14442')
  ;

  // Update to source_song table
