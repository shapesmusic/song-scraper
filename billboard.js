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
    ('Billboard', 'The Hot 100', 'Week of August 12, 2023', '2023-08-12 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2023-08-12');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1683; // SELECT last_insert_rowid();
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
        "title": "Meltdown",
        "artist_name": "Travis Scott ft. Drake",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.407407",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "FE!N",
        "artist_name": "Travis Scott ft. Playboi Carti",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.408408",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I Know ?",
        "artist_name": "Travis Scott",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.408408",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hyaena",
        "artist_name": "Travis Scott",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.408408",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Thank God",
        "artist_name": "Travis Scott",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.409409",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Topia Twins",
        "artist_name": "Travis Scott ft. Rob49 & 21 Savage",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.409409",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "My Eyes",
        "artist_name": "Travis Scott",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.409409",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Modern Jam",
        "artist_name": "Travis Scott ft. Teezo Touchdown",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.409409",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Delresto (Echoes)",
        "artist_name": "Travis Scott & Beyonce",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.409409",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Telekinesis",
        "artist_name": "Travis Scott ft. SZA & Future",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.409409",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sirens",
        "artist_name": "Travis Scott",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.409409",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "God's Country",
        "artist_name": "Travis Scott",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.409409",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Skitzo",
        "artist_name": "Travis Scott ft. Young Thug",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.409409",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Circus Maximus",
        "artist_name": "Travis Scott ft. The Weeknd & Swae Lee",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.409409",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Til Further Notice",
        "artist_name": "Travis Scott ft. James Blake & 21 Savage",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.410410",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "In Your Love",
        "artist_name": "Tyler Childers",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.410410",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lost Forever",
        "artist_name": "Travis Scott ft. Westside Gunn",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.410410",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Looove",
        "artist_name": "Travis Scott ft. Kid Cudi",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.410410",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Parasail",
        "artist_name": "Travis Scott ft. Yung Lean & Dave Chappelle",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.410410",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Jealousy",
        "artist_name": "Offset & Cardi B",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.410410",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Enough Is Enough",
        "artist_name": "Post Malone",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.410410",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Something Real",
        "artist_name": "Post Malone",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.410410",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "On The Radar Freestyle",
        "artist_name": "Drake & Central Cee",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.411411",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Too Cool To Die",
        "artist_name": "Post Malone",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.411411",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Don't Understand",
        "artist_name": "Post Malone",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.411411",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Aqui Te Espero",
        "artist_name": "Ivan Cornejo",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.411411",
        "source_id": 1683,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Novacandy",
        "artist_name": "Post Malone",
        "video_id": null,
        "capture_date": "2023-08-14 05:55:47.411411",
        "source_id": 1683,
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
  ('Meltdown', 'Travis Scott ft. Drake', NULL),
  ('FE!N', 'Travis Scott ft. Playboi Carti', NULL),
  ('I Know ?', 'Travis Scott', NULL),
  ('Hyaena', 'Travis Scott', NULL),
  ('Thank God', 'Travis Scott', NULL),
  ('Topia Twins', 'Travis Scott ft. Rob49 & 21 Savage', NULL),
  ('My Eyes', 'Travis Scott', NULL),
  ('Modern Jam', 'Travis Scott ft. Teezo Touchdown', NULL),
  ('Delresto (Echoes)', 'Travis Scott & Beyonce', NULL),
  ('Telekinesis', 'Travis Scott ft. SZA & Future', NULL),
  ('Sirens', 'Travis Scott', NULL),
  ('God’s Country', 'Travis Scott', NULL),
  ('Skitzo', 'Travis Scott ft. Young Thug', NULL),
  ('Circus Maximus', 'Travis Scott ft. The Weeknd & Swae Lee', NULL),
  ('Til Further Notice', 'Travis Scott ft. James Blake & 21 Savage', NULL),
  ('In Your Love', 'Tyler Childers', NULL),
  ('Lost Forever', 'Travis Scott ft. Westside Gunn', NULL),
  ('Looove', 'Travis Scott ft. Kid Cudi', NULL),
  ('Parasail', 'Travis Scott ft. Yung Lean & Dave Chappelle', NULL),
  ('Jealousy', 'Offset & Cardi B', NULL),
  ('Enough Is Enough', 'Post Malone', NULL),
  ('Something Real', 'Post Malone', NULL),
  ('On The Radar Freestyle', 'Drake & Central Cee', NULL),
  ('Too Cool To Die', 'Post Malone', NULL),
  ('Don’t Understand', 'Post Malone', NULL),
  ('Aqui Te Espero', 'Ivan Cornejo', NULL),
  ('Novacandy', 'Post Malone', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 14609; // SELECT last_insert_rowid();

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
  ('2023-08-14 05:55:47.407407', '1683', '14583'),
  ('2023-08-14 05:55:47.408408', '1683', '14584'),
  ('2023-08-14 05:55:47.408408', '1683', '14585'),
  ('2023-08-14 05:55:47.408408', '1683', '14586'),
  ('2023-08-14 05:55:47.409409', '1683', '14587'),
  ('2023-08-14 05:55:47.409409', '1683', '14588'),
  ('2023-08-14 05:55:47.409409', '1683', '14589'),
  ('2023-08-14 05:55:47.409409', '1683', '14590'),
  ('2023-08-14 05:55:47.409409', '1683', '14591'),
  ('2023-08-14 05:55:47.409409', '1683', '14592'),
  ('2023-08-14 05:55:47.409409', '1683', '14593'),
  ('2023-08-14 05:55:47.409409', '1683', '14594'),
  ('2023-08-14 05:55:47.409409', '1683', '14595'),
  ('2023-08-14 05:55:47.409409', '1683', '14596'),
  ('2023-08-14 05:55:47.410410', '1683', '14597'),
  ('2023-08-14 05:55:47.410410', '1683', '14598'),
  ('2023-08-14 05:55:47.410410', '1683', '14599'),
  ('2023-08-14 05:55:47.410410', '1683', '14600'),
  ('2023-08-14 05:55:47.410410', '1683', '14601'),
  ('2023-08-14 05:55:47.410410', '1683', '14602'),
  ('2023-08-14 05:55:47.410410', '1683', '14603'),
  ('2023-08-14 05:55:47.410410', '1683', '14604'),
  ('2023-08-14 05:55:47.411411', '1683', '14605'),
  ('2023-08-14 05:55:47.411411', '1683', '14606'),
  ('2023-08-14 05:55:47.411411', '1683', '14607'),
  ('2023-08-14 05:55:47.411411', '1683', '14608'),
  ('2023-08-14 05:55:47.411411', '1683', '14609')
  ;

  // Update to source_song table
