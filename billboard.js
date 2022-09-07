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
    ('Billboard', 'The Hot 100', 'Week of September 10, 2022', '2022-09-10 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2022-09-10');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1352; // SELECT last_insert_rowid();
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
        "title": "Hold Me Closer",
        "artist_name": "Elton John & Britney Spears",
        "video_id": null,
        "capture_date": "2022-09-07 03:17:48.250250",
        "source_id": 1352,
        "song_id": 12713,
        "duplicate": true
    },
    {
        "title": "God Did",
        "artist_name": "DJ Khaled ft. Rick Ross, Lil Wayne, JAY-Z, John Legend & Fridayy",
        "video_id": null,
        "capture_date": "2022-09-07 03:17:48.251251",
        "source_id": 1352,
        "song_id": 12721,
        "duplicate": true
    },
    {
        "title": "Beautiful",
        "artist_name": "DJ Khaled ft. Future & SZA",
        "video_id": null,
        "capture_date": "2022-09-07 03:17:48.251251",
        "source_id": 1352,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Big Time",
        "artist_name": "DJ Khaled ft. Future & Lil Baby",
        "video_id": null,
        "capture_date": "2022-09-07 03:17:48.252252",
        "source_id": 1352,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Beat The Odds",
        "artist_name": "Lil Tjay",
        "video_id": null,
        "capture_date": "2022-09-07 03:17:48.252252",
        "source_id": 1352,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gatubela",
        "artist_name": "Karol G x Maldy",
        "video_id": null,
        "capture_date": "2022-09-07 03:17:48.252252",
        "source_id": 1352,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Use This Gospel (Remix)",
        "artist_name": "DJ Khaled ft. Kanye West & Eminem",
        "video_id": null,
        "capture_date": "2022-09-07 03:17:48.253253",
        "source_id": 1352,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Juice WRLD Did",
        "artist_name": "DJ Khaled ft. Juice WRLD",
        "video_id": null,
        "capture_date": "2022-09-07 03:17:48.253253",
        "source_id": 1352,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Keep Going",
        "artist_name": "DJ Khaled ft. Lil Durk, 21 Savage & Roddy Ricch",
        "video_id": null,
        "capture_date": "2022-09-07 03:17:48.253253",
        "source_id": 1352,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Party",
        "artist_name": "DJ Khaled ft. Quavo & Takeoff",
        "video_id": null,
        "capture_date": "2022-09-07 03:17:48.254254",
        "source_id": 1352,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Golden Hour",
        "artist_name": "JVKE",
        "video_id": null,
        "capture_date": "2022-09-07 03:17:48.254254",
        "source_id": 1352,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "It Ain't Safe",
        "artist_name": "DJ Khaled ft. Nardo Wick & Kodak Black",
        "video_id": null,
        "capture_date": "2022-09-07 03:17:48.254254",
        "source_id": 1352,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "No Secret",
        "artist_name": "DJ Khaled ft. Drake",
        "video_id": null,
        "capture_date": "2022-09-07 03:17:48.254254",
        "source_id": 1352,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I'm Good (Blue)",
        "artist_name": "David Guetta & Bebe Rexha",
        "video_id": null,
        "capture_date": "2022-09-07 03:17:48.254254",
        "source_id": 1352,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Let's Pray",
        "artist_name": "DJ Khaled ft. Don Toliver & Travis Scott",
        "video_id": null,
        "capture_date": "2022-09-07 03:17:48.254254",
        "source_id": 1352,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Wait In The Truck",
        "artist_name": "HARDY ft. Lainey Wilson",
        "video_id": null,
        "capture_date": "2022-09-07 03:17:48.254254",
        "source_id": 1352,
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
  ('Beautiful', 'DJ Khaled ft. Future & SZA', NULL),
  ('Big Time', 'DJ Khaled ft. Future & Lil Baby', NULL),
  ('Beat The Odds', 'Lil Tjay', NULL),
  ('Gatubela', 'Karol G x Maldy', NULL),
  ('Use This Gospel (Remix)', 'DJ Khaled ft. Kanye West & Eminem', NULL),
  ('Juice WRLD Did', 'DJ Khaled ft. Juice WRLD', NULL),
  ('Keep Going', 'DJ Khaled ft. Lil Durk, 21 Savage & Roddy Ricch', NULL),
  ('Party', 'DJ Khaled ft. Quavo & Takeoff', NULL),
  ('Golden Hour', 'JVKE', NULL),
  ('It Ain’t Safe', 'DJ Khaled ft. Nardo Wick & Kodak Black', NULL),
  ('No Secret', 'DJ Khaled ft. Drake', NULL),
  ('I’m Good (Blue)', 'David Guetta & Bebe Rexha', NULL),
  ('Let’s Pray', 'DJ Khaled ft. Don Toliver & Travis Scott', NULL),
  ('Wait In The Truck', 'HARDY ft. Lainey Wilson', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12773; // SELECT last_insert_rowid();

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
  ('2022-09-07 03:17:48.250250', '1352', '12713'),
  ('2022-09-07 03:17:48.251251', '1352', '12721'),
  ('2022-09-07 03:17:48.251251', '1352', '12760'),
  ('2022-09-07 03:17:48.252252', '1352', '12761'),
  ('2022-09-07 03:17:48.252252', '1352', '12762'),
  ('2022-09-07 03:17:48.252252', '1352', '12763'),
  ('2022-09-07 03:17:48.253253', '1352', '12764'),
  ('2022-09-07 03:17:48.253253', '1352', '12765'),
  ('2022-09-07 03:17:48.253253', '1352', '12766'),
  ('2022-09-07 03:17:48.254254', '1352', '12767'),
  ('2022-09-07 03:17:48.254254', '1352', '12768'),
  ('2022-09-07 03:17:48.254254', '1352', '12769'),
  ('2022-09-07 03:17:48.254254', '1352', '12770'),
  ('2022-09-07 03:17:48.254254', '1352', '12771'),
  ('2022-09-07 03:17:48.254254', '1352', '12772'),
  ('2022-09-07 03:17:48.254254', '1352', '12773')
  ;

  // Update to source_song table
