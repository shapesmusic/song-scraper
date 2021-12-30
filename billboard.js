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
  currentChartLocation = window.location.href + "/" + moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD");
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
    ('Billboard', 'The Hot 100', 'Week of November 27, 2021', '2021-11-27 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-11-27/');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1056; // SELECT last_insert_rowid();
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
//          find & set any duplicate songs to true (use ’ type apostrophe in searches),
//          add song_ids for duplicates,
//          find and replace "Featur~ing" with "ft."
//

  songsData =
  [
    {
        "title": "All Too Well (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.168168",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "State Of Grace (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.168168",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Already Dead",
        "artist_name": "Juice WRLD",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.168168",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Bet You Think About Me (Taylor’s Version)",
        "artist_name": "Taylor Swift Featuring Chris Stapleton",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.168168",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Red (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.168168",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Nothing New (Taylor’s Version)",
        "artist_name": "Taylor Swift Featuring Phoebe Bridgers",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.169169",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Message In A Bottle (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.169169",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Knew You Were Trouble (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.169169",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Run (Taylor’s Version)",
        "artist_name": "Taylor Swift Featuring Ed Sheeran",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.169169",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bad Man (Smooth Criminal)",
        "artist_name": "Polo G",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.169169",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Better Man (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.169169",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "22 (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.169169",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Doin’ This",
        "artist_name": "Luke Combs",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.169169",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Treacherous (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.169169",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "We Are Never Ever Getting Back Together (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.169169",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Almost Do (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.169169",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Very First Night (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.169169",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Everything Has Changed (Taylor’s Version)",
        "artist_name": "Taylor Swift Featuring Ed Sheeran",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.169169",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Last Time (Taylor’s Version)",
        "artist_name": "Taylor Swift Featuring Gary Lightbody Of Snow Patrol",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.170170",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Stay Stay Stay (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.170170",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "After Last Night",
        "artist_name": "Silk Sonic (Bruno Mars & Anderson .Paak) With Thundercat & Bootsy Collins",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.170170",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Babe (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.170170",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Blast Off",
        "artist_name": "Silk Sonic (Bruno Mars & Anderson .Paak)",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.170170",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Holy Ground (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.170170",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Begin Again (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.170170",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Put On A Smile",
        "artist_name": "Silk Sonic (Bruno Mars & Anderson .Paak)",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.170170",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Forever Winter (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.170170",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fly As Me",
        "artist_name": "Silk Sonic (Bruno Mars & Anderson .Paak)",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.170170",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Moment I Knew (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.170170",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Lucky One (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.170170",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sad Beautiful Tragic (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.170170",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Come Back...Be Here (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.170170",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Starlight (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.171171",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "La Fama",
        "artist_name": "Rosalia Featuring The Weeknd",
        "video_id": null,
        "capture_date": "2021-12-30 01:14:46.171171",
        "source_id": 1056,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  // Remember: use ’ type apostrophe in searches
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
  ('All Too Well (Taylor’s Version)', 'Taylor Swift', NULL),
  ('State Of Grace (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Already Dead', 'Juice WRLD', NULL),
  ('I Bet You Think About Me (Taylor’s Version)', 'Taylor Swift Featuring Chris Stapleton', NULL),
  ('Red (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Nothing New (Taylor’s Version)', 'Taylor Swift Featuring Phoebe Bridgers', NULL),
  ('Message In A Bottle (Taylor’s Version)', 'Taylor Swift', NULL),
  ('I Knew You Were Trouble (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Run (Taylor’s Version)', 'Taylor Swift Featuring Ed Sheeran', NULL),
  ('Bad Man (Smooth Criminal)', 'Polo G', NULL),
  ('Better Man (Taylor’s Version)', 'Taylor Swift', NULL),
  ('22 (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Doin’ This', 'Luke Combs', NULL),
  ('Treacherous (Taylor’s Version)', 'Taylor Swift', NULL),
  ('We Are Never Ever Getting Back Together (Taylor’s Version)', 'Taylor Swift', NULL),
  ('I Almost Do (Taylor’s Version)', 'Taylor Swift', NULL),
  ('The Very First Night (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Everything Has Changed (Taylor’s Version)', 'Taylor Swift Featuring Ed Sheeran', NULL),
  ('The Last Time (Taylor’s Version)', 'Taylor Swift Featuring Gary Lightbody Of Snow Patrol', NULL),
  ('Stay Stay Stay (Taylor’s Version)', 'Taylor Swift', NULL),
  ('After Last Night', 'Silk Sonic (Bruno Mars & Anderson .Paak) With Thundercat & Bootsy Collins', NULL),
  ('Babe (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Blast Off', 'Silk Sonic (Bruno Mars & Anderson .Paak)', NULL),
  ('Holy Ground (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Begin Again (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Put On A Smile', 'Silk Sonic (Bruno Mars & Anderson .Paak)', NULL),
  ('Forever Winter (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Fly As Me', 'Silk Sonic (Bruno Mars & Anderson .Paak)', NULL),
  ('The Moment I Knew (Taylor’s Version)', 'Taylor Swift', NULL),
  ('The Lucky One (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Sad Beautiful Tragic (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Come Back...Be Here (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Starlight (Taylor’s Version)', 'Taylor Swift', NULL),
  ('La Fama', 'Rosalia Featuring The Weeknd', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11224; // SELECT last_insert_rowid();

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
  ('2021-12-30 01:14:46.168168', '1056', '11191'),
  ('2021-12-30 01:14:46.168168', '1056', '11192'),
  ('2021-12-30 01:14:46.168168', '1056', '11193'),
  ('2021-12-30 01:14:46.168168', '1056', '11194'),
  ('2021-12-30 01:14:46.168168', '1056', '11195'),
  ('2021-12-30 01:14:46.169169', '1056', '11196'),
  ('2021-12-30 01:14:46.169169', '1056', '11197'),
  ('2021-12-30 01:14:46.169169', '1056', '11198'),
  ('2021-12-30 01:14:46.169169', '1056', '11199'),
  ('2021-12-30 01:14:46.169169', '1056', '11200'),
  ('2021-12-30 01:14:46.169169', '1056', '11201'),
  ('2021-12-30 01:14:46.169169', '1056', '11202'),
  ('2021-12-30 01:14:46.169169', '1056', '11203'),
  ('2021-12-30 01:14:46.169169', '1056', '11204'),
  ('2021-12-30 01:14:46.169169', '1056', '11205'),
  ('2021-12-30 01:14:46.169169', '1056', '11206'),
  ('2021-12-30 01:14:46.169169', '1056', '11207'),
  ('2021-12-30 01:14:46.169169', '1056', '11208'),
  ('2021-12-30 01:14:46.170170', '1056', '11209'),
  ('2021-12-30 01:14:46.170170', '1056', '11210'),
  ('2021-12-30 01:14:46.170170', '1056', '11211'),
  ('2021-12-30 01:14:46.170170', '1056', '11212'),
  ('2021-12-30 01:14:46.170170', '1056', '11213'),
  ('2021-12-30 01:14:46.170170', '1056', '11214'),
  ('2021-12-30 01:14:46.170170', '1056', '11215'),
  ('2021-12-30 01:14:46.170170', '1056', '11216'),
  ('2021-12-30 01:14:46.170170', '1056', '11217'),
  ('2021-12-30 01:14:46.170170', '1056', '11218'),
  ('2021-12-30 01:14:46.170170', '1056', '11219'),
  ('2021-12-30 01:14:46.170170', '1056', '11220'),
  ('2021-12-30 01:14:46.170170', '1056', '11221'),
  ('2021-12-30 01:14:46.170170', '1056', '11222'),
  ('2021-12-30 01:14:46.171171', '1056', '11223'),
  ('2021-12-30 01:14:46.171171', '1056', '11224')
  ;

  // Update to source_song table
