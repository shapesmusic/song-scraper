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
    ('Billboard', 'The Hot 100', 'Week of July 22, 2023', '2023-07-22 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2023-07-22');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1666; // SELECT last_insert_rowid();
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
        "title": "I Can See You (Taylor’s Version) (From The Vault)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.780780",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mine (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.781781",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Back To December (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.781781",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Enchanted (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.781781",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sparks Fly (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.782782",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dear John (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.782782",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Better Than Revenge (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.782782",
        "source_id": 1666,
        "song_id": 14479,
        "duplicate": true
    },
    {
        "title": "Castles Crumbling (Taylor’s Version) (From The Vault)",
        "artist_name": "Taylor Swift ft. Hayley Williams",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.782782",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Speak Now (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.782782",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "When Emma Falls In Love (Taylor’s Version) (From The Vault)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.782782",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Electric Touch (Taylor’s Version) (From The Vault)",
        "artist_name": "Taylor Swift ft. Fall Out Boy",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.782782",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mean (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.782782",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Foolish One (Taylor’s Version) (From The Vault)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.782782",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Story Of Us (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.782782",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Timeless (Taylor’s Version) (From The Vault)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.783783",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Haunted (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.783783",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Long Live (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.783783",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Last Kiss (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.783783",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Never Grow Up (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.783783",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Innocent (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.783783",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Super Shy",
        "artist_name": "NewJeans",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.783783",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ours (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.783783",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Superman (Taylor’s Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.783783",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Point Me 2",
        "artist_name": "FendiDa Rappa With Cardi B",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.784784",
        "source_id": 1666,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "LaLa",
        "artist_name": "Myke Towers",
        "video_id": null,
        "capture_date": "2023-07-22 07:23:56.784784",
        "source_id": 1666,
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
  ('I Can See You (Taylor’s Version) (From The Vault)', 'Taylor Swift', NULL),
  ('Mine (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Back To December (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Enchanted (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Sparks Fly (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Dear John (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Castles Crumbling (Taylor’s Version) (From The Vault)', 'Taylor Swift ft. Hayley Williams', NULL),
  ('Speak Now (Taylor’s Version)', 'Taylor Swift', NULL),
  ('When Emma Falls In Love (Taylor’s Version) (From The Vault)', 'Taylor Swift', NULL),
  ('Electric Touch (Taylor’s Version) (From The Vault)', 'Taylor Swift ft. Fall Out Boy', NULL),
  ('Mean (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Foolish One (Taylor’s Version) (From The Vault)', 'Taylor Swift', NULL),
  ('The Story Of Us (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Timeless (Taylor’s Version) (From The Vault)', 'Taylor Swift', NULL),
  ('Haunted (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Long Live (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Last Kiss (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Never Grow Up (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Innocent (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Super Shy', 'NewJeans', NULL),
  ('Ours (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Superman (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Point Me 2', 'FendiDa Rappa With Cardi B', NULL),
  ('LaLa', 'Myke Towers', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 14520; // SELECT last_insert_rowid();

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
  ('2023-07-22 07:23:56.780780', '1666', '14497'),
  ('2023-07-22 07:23:56.781781', '1666', '14498'),
  ('2023-07-22 07:23:56.781781', '1666', '14499'),
  ('2023-07-22 07:23:56.781781', '1666', '14500'),
  ('2023-07-22 07:23:56.782782', '1666', '14501'),
  ('2023-07-22 07:23:56.782782', '1666', '14502'),
  ('2023-07-22 07:23:56.782782', '1666', '14479'),
  ('2023-07-22 07:23:56.782782', '1666', '14503'),
  ('2023-07-22 07:23:56.782782', '1666', '14504'),
  ('2023-07-22 07:23:56.782782', '1666', '14505'),
  ('2023-07-22 07:23:56.782782', '1666', '14506'),
  ('2023-07-22 07:23:56.782782', '1666', '14507'),
  ('2023-07-22 07:23:56.782782', '1666', '14508'),
  ('2023-07-22 07:23:56.782782', '1666', '14509'),
  ('2023-07-22 07:23:56.783783', '1666', '14510'),
  ('2023-07-22 07:23:56.783783', '1666', '14511'),
  ('2023-07-22 07:23:56.783783', '1666', '14512'),
  ('2023-07-22 07:23:56.783783', '1666', '14513'),
  ('2023-07-22 07:23:56.783783', '1666', '14514'),
  ('2023-07-22 07:23:56.783783', '1666', '14515'),
  ('2023-07-22 07:23:56.783783', '1666', '14516'),
  ('2023-07-22 07:23:56.783783', '1666', '14517'),
  ('2023-07-22 07:23:56.783783', '1666', '14518'),
  ('2023-07-22 07:23:56.784784', '1666', '14519'),
  ('2023-07-22 07:23:56.784784', '1666', '14520')
  ;

  // Update to source_song table
