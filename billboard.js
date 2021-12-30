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
    ('Billboard', 'The Hot 100', 'Week of November 20, 2021', '2021-11-20 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-11-20/');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1055; // SELECT last_insert_rowid();
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
        "title": "One Right Now",
        "artist_name": "Post Malone & The Weeknd",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.596596",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Smokin Out The Window",
        "artist_name": "Silk Sonic (Bruno Mars & Anderson .Paak)",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.596596",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Escape Plan",
        "artist_name": "Travis Scott",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.596596",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "No Love",
        "artist_name": "Summer Walker & SZA",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.597597",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bitter",
        "artist_name": "Summer Walker & Cardi B",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.597597",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mafia",
        "artist_name": "Travis Scott",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.597597",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Throw It Away",
        "artist_name": "Summer Walker",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.598598",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Reciprocate",
        "artist_name": "Summer Walker",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.598598",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Toxic",
        "artist_name": "Summer Walker Featuring Lil Durk",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.598598",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Unloyal",
        "artist_name": "Summer Walker & Ari Lennox",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.598598",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Constant Bulls**t",
        "artist_name": "Summer Walker",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.598598",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "You Don't Know Me",
        "artist_name": "Summer Walker",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.598598",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Insane",
        "artist_name": "Summer Walker",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.599599",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Circus",
        "artist_name": "Summer Walker",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.599599",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "4th Baby Mama",
        "artist_name": "Summer Walker",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.599599",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Switch A N*gga Out",
        "artist_name": "Summer Walker",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.599599",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Closure",
        "artist_name": "Summer Walker",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.599599",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Session 33",
        "artist_name": "Summer Walker",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.599599",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Screwin",
        "artist_name": "Summer Walker & Omarion",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.600600",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Broken Promises",
        "artist_name": "Summer Walker",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.600600",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dat Right There",
        "artist_name": "Summer Walker, Pharrell Williams & The Neptunes",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.600600",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sad Girlz Luv Money",
        "artist_name": "Amaarae & Moliy Featuring Kali Uchis",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.600600",
        "source_id": 1055,
        "song_id": 10963,
        "duplicate": true
    },
    {
        "title": "Slow Down Summer",
        "artist_name": "Thomas Rhett",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.600600",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Jumpin",
        "artist_name": "NLE Choppa Featuring Polo G",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.600600",
        "source_id": 1055,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Super Gremlin",
        "artist_name": "Kodak Black",
        "video_id": null,
        "capture_date": "2021-12-30 09:42:00.600600",
        "source_id": 1055,
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
  ('One Right Now', 'Post Malone & The Weeknd', NULL),
  ('Smokin Out The Window', 'Silk Sonic (Bruno Mars & Anderson .Paak)', NULL),
  ('Escape Plan', 'Travis Scott', NULL),
  ('No Love', 'Summer Walker & SZA', NULL),
  ('Bitter', 'Summer Walker & Cardi B', NULL),
  ('Mafia', 'Travis Scott', NULL),
  ('Throw It Away', 'Summer Walker', NULL),
  ('Reciprocate', 'Summer Walker', NULL),
  ('Toxic', 'Summer Walker Featuring Lil Durk', NULL),
  ('Unloyal', 'Summer Walker & Ari Lennox', NULL),
  ('Constant Bulls**t', 'Summer Walker', NULL),
  ('You Don’t Know Me', 'Summer Walker', NULL),
  ('Insane', 'Summer Walker', NULL),
  ('Circus', 'Summer Walker', NULL),
  ('4th Baby Mama', 'Summer Walker', NULL),
  ('Switch A N*gga Out', 'Summer Walker', NULL),
  ('Closure', 'Summer Walker', NULL),
  ('Session 33', 'Summer Walker', NULL),
  ('Screwin', 'Summer Walker & Omarion', NULL),
  ('Broken Promises', 'Summer Walker', NULL),
  ('Dat Right There', 'Summer Walker, Pharrell Williams & The Neptunes', NULL),
  ('Slow Down Summer', 'Thomas Rhett', NULL),
  ('Jumpin', 'NLE Choppa Featuring Polo G', NULL),
  ('Super Gremlin', 'Kodak Black', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11190; // SELECT last_insert_rowid();

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
  ('2021-12-30 09:42:00.596596', '1055', '11167'),
  ('2021-12-30 09:42:00.596596', '1055', '11168'),
  ('2021-12-30 09:42:00.596596', '1055', '11169'),
  ('2021-12-30 09:42:00.597597', '1055', '11170'),
  ('2021-12-30 09:42:00.597597', '1055', '11171'),
  ('2021-12-30 09:42:00.597597', '1055', '11172'),
  ('2021-12-30 09:42:00.598598', '1055', '11173'),
  ('2021-12-30 09:42:00.598598', '1055', '11174'),
  ('2021-12-30 09:42:00.598598', '1055', '11175'),
  ('2021-12-30 09:42:00.598598', '1055', '11176'),
  ('2021-12-30 09:42:00.598598', '1055', '11177'),
  ('2021-12-30 09:42:00.598598', '1055', '11178'),
  ('2021-12-30 09:42:00.599599', '1055', '11179'),
  ('2021-12-30 09:42:00.599599', '1055', '11180'),
  ('2021-12-30 09:42:00.599599', '1055', '11181'),
  ('2021-12-30 09:42:00.599599', '1055', '11182'),
  ('2021-12-30 09:42:00.599599', '1055', '11183'),
  ('2021-12-30 09:42:00.599599', '1055', '11184'),
  ('2021-12-30 09:42:00.600600', '1055', '11185'),
  ('2021-12-30 09:42:00.600600', '1055', '11186'),
  ('2021-12-30 09:42:00.600600', '1055', '11187'),
  ('2021-12-30 09:42:00.600600', '1055', '10963'),
  ('2021-12-30 09:42:00.600600', '1055', '11188'),
  ('2021-12-30 09:42:00.600600', '1055', '11189'),
  ('2021-12-30 09:42:00.600600', '1055', '11190')
  ;

  // Update to source_song table
