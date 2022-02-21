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
    ('Billboard', 'The Hot 100', 'Week of February 19, 2022', '2022-02-19 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2022-01-19');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1132; // SELECT last_insert_rowid();
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
        "title": "Do We Have A Problem?",
        "artist_name": "Nicki Minaj X Lil Baby",
        "video_id": null,
        "capture_date": "2022-02-20 03:44:11.272272",
        "source_id": 1132,
        "song_id": 11644,
        "duplicate": true
    },
    {
        "title": "Don't Play That",
        "artist_name": "King Von & 21 Savage",
        "video_id": null,
        "capture_date": "2022-02-20 03:44:11.274274",
        "source_id": 1132,
        "song_id": 11652,
        "duplicate": true
    },
    {
        "title": "Cigarettes",
        "artist_name": "Juice WRLD",
        "video_id": null,
        "capture_date": "2022-02-20 03:44:11.275275",
        "source_id": 1132,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "She's All I Wanna Be",
        "artist_name": "Tate McRae",
        "video_id": null,
        "capture_date": "2022-02-20 03:44:11.275275",
        "source_id": 1132,
        "song_id": 11635,
        "duplicate": true
    },
    {
        "title": "Scared Money",
        "artist_name": "YG ft. J. Cole & Moneybagg Yo",
        "video_id": null,
        "capture_date": "2022-02-20 03:44:11.276276",
        "source_id": 1132,
        "song_id": 11645,
        "duplicate": true
    },
    {
        "title": "Emo Girl",
        "artist_name": "Machine Gun Kelly & WILLOW",
        "video_id": null,
        "capture_date": "2022-02-20 03:44:11.276276",
        "source_id": 1132,
        "song_id": 11633,
        "duplicate": true
    },
    {
        "title": "Black Summer",
        "artist_name": "Red Hot Chili Peppers",
        "video_id": null,
        "capture_date": "2022-02-20 03:44:11.276276",
        "source_id": 1132,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Doja",
        "artist_name": "$NOT & A$AP Rocky",
        "video_id": null,
        "capture_date": "2022-02-20 03:44:11.276276",
        "source_id": 1132,
        "song_id": 11647,
        "duplicate": true
    },
    {
        "title": "Hate Our Love",
        "artist_name": "Queen Naija & Big Sean",
        "video_id": null,
        "capture_date": "2022-02-20 03:44:11.276276",
        "source_id": 1132,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "When I'm Gone",
        "artist_name": "Alesso / Katy Perry",
        "video_id": null,
        "capture_date": "2022-02-20 03:44:11.277277",
        "source_id": 1132,
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
  ('Cigarettes', 'Juice WRLD', NULL),
  ('Black Summer', 'Red Hot Chili Peppers', NULL),
  ('Hate Our Love', 'Queen Naija & Big Sean', NULL),
  ('When I’m Gone', 'Alesso / Katy Perry', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11667; // SELECT last_insert_rowid();

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
  ('2022-02-20 03:44:11.272272', '1132', '11644'),
  ('2022-02-20 03:44:11.274274', '1132', '11652'),
  ('2022-02-20 03:44:11.275275', '1132', '11664'),
  ('2022-02-20 03:44:11.275275', '1132', '11635'),
  ('2022-02-20 03:44:11.276276', '1132', '11645'),
  ('2022-02-20 03:44:11.276276', '1132', '11633'),
  ('2022-02-20 03:44:11.276276', '1132', '11665'),
  ('2022-02-20 03:44:11.276276', '1132', '11647'),
  ('2022-02-20 03:44:11.276276', '1132', '11666'),
  ('2022-02-20 03:44:11.277277', '1132', '11667')
  ;

  // Update to source_song table
