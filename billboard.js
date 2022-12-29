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
    ('Billboard', 'The Hot 100', 'Week of December 17, 2022', '2022-12-17 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2022-12-17/2022-12-17');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1465; // SELECT last_insert_rowid();
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
        "title": "Creepin'",
        "artist_name": "Metro Boomin, The Weeknd & 21 Savage",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.206206",
        "source_id": 1465,
        "song_id": 13260,
        "duplicate": true
    },
    {
        "title": "Superhero (Heroes & Villains)",
        "artist_name": "Metro Boomin, Future & Chris Brown",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.206206",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Too Many Nights",
        "artist_name": "Metro Boomin ft. Don Toliver & Future",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.207207",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Umbrella",
        "artist_name": "Metro Boomin, 21 Savage & Young Nudy",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.207207",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Niagara Falls (Foot Or 2)",
        "artist_name": "Metro Boomin, Travis Scott & 21 Savage",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.208208",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Raindrops (Insane)",
        "artist_name": "Metro Boomin & Travis Scott",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.208208",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "One Thing At A Time",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.208208",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Trance",
        "artist_name": "Metro Boomin, Travis Scott & Young Thug",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.208208",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Metro Spider",
        "artist_name": "Metro Boomin & Young Thug",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.208208",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "On Time",
        "artist_name": "Metro Boomin & John Legend",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.208208",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tennessee Fan",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.208208",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Walk Em Down (Don't Kill Civilians)",
        "artist_name": "Metro Boomin & 21 Savage ft. Mustafa",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.208208",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Around Me",
        "artist_name": "Metro Boomin ft. Don Toliver",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.208208",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Can't Save You (Interlude)",
        "artist_name": "Metro Boomin & Future ft. Don Toliver",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.209209",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Days That End In Why",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.209209",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Feel The Fiyaaaah",
        "artist_name": "Metro Boomin & A$AP Rocky ft. Takeoff",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.209209",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "All The Money (Bonus)",
        "artist_name": "Metro Boomin & Gunna",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.209209",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "La Jumpa",
        "artist_name": "Arcangel & Bad Bunny",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.209209",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lock On Me",
        "artist_name": "Metro Boomin, Travis Scott & Future",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.209209",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Wild Flower",
        "artist_name": "RM With Youjeen",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.209209",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Santa, Can't You Hear Me",
        "artist_name": "Kelly Clarkson & Ariana Grande",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.210210",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Blue Christmas",
        "artist_name": "Kane Brown",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.210210",
        "source_id": 1465,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Escapism",
        "artist_name": "RAYE ft. 070 Shake",
        "video_id": null,
        "capture_date": "2022-12-28 08:14:09.210210",
        "source_id": 1465,
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
  ('Superhero (Heroes & Villains)', 'Metro Boomin, Future & Chris Brown', NULL),
  ('Too Many Nights', 'Metro Boomin ft. Don Toliver & Future', NULL),
  ('Umbrella', 'Metro Boomin, 21 Savage & Young Nudy', NULL),
  ('Niagara Falls (Foot Or 2)', 'Metro Boomin, Travis Scott & 21 Savage', NULL),
  ('Raindrops (Insane)', 'Metro Boomin & Travis Scott', NULL),
  ('One Thing At A Time', 'Morgan Wallen', NULL),
  ('Trance', 'Metro Boomin, Travis Scott & Young Thug', NULL),
  ('Metro Spider', 'Metro Boomin & Young Thug', NULL),
  ('On Time', 'Metro Boomin & John Legend', NULL),
  ('Tennessee Fan', 'Morgan Wallen', NULL),
  ('Walk Em Down (Don’t Kill Civilians)', 'Metro Boomin & 21 Savage ft. Mustafa', NULL),
  ('Around Me', 'Metro Boomin ft. Don Toliver', NULL),
  ('I Can’t Save You (Interlude)', 'Metro Boomin & Future ft. Don Toliver', NULL),
  ('Days That End In Why', 'Morgan Wallen', NULL),
  ('Feel The Fiyaaaah', 'Metro Boomin & A$AP Rocky ft. Takeoff', NULL),
  ('All The Money (Bonus)', 'Metro Boomin & Gunna', NULL),
  ('La Jumpa', 'Arcangel & Bad Bunny', NULL),
  ('Lock On Me', 'Metro Boomin, Travis Scott & Future', NULL),
  ('Wild Flower', 'RM With Youjeen', NULL),
  ('Santa, Can’t You Hear Me', 'Kelly Clarkson & Ariana Grande', NULL),
  ('Blue Christmas', 'Kane Brown', NULL),
  ('Escapism', 'RAYE ft. 070 Shake', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 13289; // SELECT last_insert_rowid();

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
  ('2022-12-28 08:14:09.206206', '1465', '13260'),
  ('2022-12-28 08:14:09.206206', '1465', '13268'),
  ('2022-12-28 08:14:09.207207', '1465', '13269'),
  ('2022-12-28 08:14:09.207207', '1465', '13270'),
  ('2022-12-28 08:14:09.208208', '1465', '13271'),
  ('2022-12-28 08:14:09.208208', '1465', '13272'),
  ('2022-12-28 08:14:09.208208', '1465', '13273'),
  ('2022-12-28 08:14:09.208208', '1465', '13274'),
  ('2022-12-28 08:14:09.208208', '1465', '13275'),
  ('2022-12-28 08:14:09.208208', '1465', '13276'),
  ('2022-12-28 08:14:09.208208', '1465', '13277'),
  ('2022-12-28 08:14:09.208208', '1465', '13278'),
  ('2022-12-28 08:14:09.208208', '1465', '13279'),
  ('2022-12-28 08:14:09.209209', '1465', '13280'),
  ('2022-12-28 08:14:09.209209', '1465', '13281'),
  ('2022-12-28 08:14:09.209209', '1465', '13282'),
  ('2022-12-28 08:14:09.209209', '1465', '13283'),
  ('2022-12-28 08:14:09.209209', '1465', '13284'),
  ('2022-12-28 08:14:09.209209', '1465', '13285'),
  ('2022-12-28 08:14:09.209209', '1465', '13286'),
  ('2022-12-28 08:14:09.210210', '1465', '13287'),
  ('2022-12-28 08:14:09.210210', '1465', '13288'),
  ('2022-12-28 08:14:09.210210', '1465', '13289')
  ;

  // Update to source_song table
