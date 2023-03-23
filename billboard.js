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
    ('Billboard', 'The Hot 100', 'Week of March 18, 2023', '2023-03-18 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2023-03-18/');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1547; // SELECT last_insert_rowid();
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
        "title": "Thinkin' Bout Me",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.963963",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ain't That Some",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.963963",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Red Ruby Da Sleeze",
        "artist_name": "Nicki Minaj",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.966966",
        "source_id": 1547,
        "song_id": 13631,
        "duplicate": true
    },
    {
        "title": "Man Made A Bar",
        "artist_name": "Morgan Wallen ft. Eric Church",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.966966",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "'98 Braves",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.967967",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Devil Don't Know",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.967967",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sunrise",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.967967",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Born With A Beer In My Hand",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.967967",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Whiskey Friends",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.967967",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tennessee Numbers",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.968968",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cowgirls",
        "artist_name": "Morgan Wallen ft. ERNEST",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.968968",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hope That's True",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.968968",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dying Man",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.968968",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Keith Whitley",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.968968",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "In The Bible",
        "artist_name": "Morgan Wallen ft. HARDY",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.968968",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Neon Star (Country Boy Lullaby)",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.968968",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Me + All Your Reasons",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.968968",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Deserve A Drink",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.968968",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "F150-50",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.968968",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Single Than She Was",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.968968",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Wine Into Water",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.969969",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "On The Street",
        "artist_name": "j-hope With J. Cole",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.969969",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "180 (Lifestyle)",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.969969",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Last Drive Down Main",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.969969",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Good Girl Gone Missin'",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.969969",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Me To Me",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.969969",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Money On Me",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.969969",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Had It",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.969969",
        "source_id": 1547,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Outlook",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2023-03-23 02:26:49.969969",
        "source_id": 1547,
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
  ('Thinkin’ Bout Me', 'Morgan Wallen', NULL),
  ('Ain’t That Some', 'Morgan Wallen', NULL),
  ('Man Made A Bar', 'Morgan Wallen ft. Eric Church', NULL),
  ('’98 Braves', 'Morgan Wallen', NULL),
  ('Devil Don’t Know', 'Morgan Wallen', NULL),
  ('Sunrise', 'Morgan Wallen', NULL),
  ('Born With A Beer In My Hand', 'Morgan Wallen', NULL),
  ('Whiskey Friends', 'Morgan Wallen', NULL),
  ('Tennessee Numbers', 'Morgan Wallen', NULL),
  ('Cowgirls', 'Morgan Wallen ft. ERNEST', NULL),
  ('Hope That’s True', 'Morgan Wallen', NULL),
  ('Dying Man', 'Morgan Wallen', NULL),
  ('Keith Whitley', 'Morgan Wallen', NULL),
  ('In The Bible', 'Morgan Wallen ft. HARDY', NULL),
  ('Neon Star (Country Boy Lullaby)', 'Morgan Wallen', NULL),
  ('Me + All Your Reasons', 'Morgan Wallen', NULL),
  ('I Deserve A Drink', 'Morgan Wallen', NULL),
  ('F150-50', 'Morgan Wallen', NULL),
  ('Single Than She Was', 'Morgan Wallen', NULL),
  ('Wine Into Water', 'Morgan Wallen', NULL),
  ('On The Street', 'j-hope With J. Cole', NULL),
  ('180 (Lifestyle)', 'Morgan Wallen', NULL),
  ('Last Drive Down Main', 'Morgan Wallen', NULL),
  ('Good Girl Gone Missin’', 'Morgan Wallen', NULL),
  ('Me To Me', 'Morgan Wallen', NULL),
  ('Money On Me', 'Morgan Wallen', NULL),
  ('Had It', 'Morgan Wallen', NULL),
  ('Outlook', 'Morgan Wallen', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 13678; // SELECT last_insert_rowid();

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
  ('2023-03-23 02:26:49.963963', '1547', '13651'),
  ('2023-03-23 02:26:49.963963', '1547', '13652'),
  ('2023-03-23 02:26:49.966966', '1547', '13631'),
  ('2023-03-23 02:26:49.966966', '1547', '13653'),
  ('2023-03-23 02:26:49.967967', '1547', '13654'),
  ('2023-03-23 02:26:49.967967', '1547', '13655'),
  ('2023-03-23 02:26:49.967967', '1547', '13656'),
  ('2023-03-23 02:26:49.967967', '1547', '13657'),
  ('2023-03-23 02:26:49.967967', '1547', '13658'),
  ('2023-03-23 02:26:49.968968', '1547', '13659'),
  ('2023-03-23 02:26:49.968968', '1547', '13660'),
  ('2023-03-23 02:26:49.968968', '1547', '13661'),
  ('2023-03-23 02:26:49.968968', '1547', '13662'),
  ('2023-03-23 02:26:49.968968', '1547', '13663'),
  ('2023-03-23 02:26:49.968968', '1547', '13664'),
  ('2023-03-23 02:26:49.968968', '1547', '13665'),
  ('2023-03-23 02:26:49.968968', '1547', '13666'),
  ('2023-03-23 02:26:49.968968', '1547', '13667'),
  ('2023-03-23 02:26:49.968968', '1547', '13668'),
  ('2023-03-23 02:26:49.968968', '1547', '13669'),
  ('2023-03-23 02:26:49.969969', '1547', '13670'),
  ('2023-03-23 02:26:49.969969', '1547', '13671'),
  ('2023-03-23 02:26:49.969969', '1547', '13672'),
  ('2023-03-23 02:26:49.969969', '1547', '13673'),
  ('2023-03-23 02:26:49.969969', '1547', '13674'),
  ('2023-03-23 02:26:49.969969', '1547', '13675'),
  ('2023-03-23 02:26:49.969969', '1547', '13676'),
  ('2023-03-23 02:26:49.969969', '1547', '13677'),
  ('2023-03-23 02:26:49.969969', '1547', '13678')
  ;

  // Update to source_song table
