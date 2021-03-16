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
  publicationDate = document.getElementsByClassName('date-selector__button button--link')[0].innerText.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // Get location and format for current or past chart status
  currentChartLocation = window.location.href + "/" + moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD");
  pastChartLocation = window.location.href;

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Billboard\', \'The Hot 100\', \'Week of "
    + publicationDate + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + currentChartLocation + "\');" // use pastChartLocation if not the current week's chart, otherwise use currentChartLocation
  )


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Billboard', 'The Hot 100', 'Week of March 20, 2021', '2021-03-20 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2021-03-20');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 848; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName('chart-list__element display--flex');

  songsData = [];

  for (var i=0; i<elements.length; i++){
      element = elements[i];
      isNew = element.getElementsByClassName('chart-element__trend chart-element__trend--new color--accent');
      songName = element.getElementsByClassName('chart-element__information__song text--truncate color--primary')[0];
      artistName = element.getElementsByClassName('chart-element__information__artist text--truncate color--secondary')[0];

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

      if(isNew.length == 1 && isNew[0].innerText == "New"){ // because innerText can also be "Re-Enter"

        songsData.push(songData);

      };
  };

  JSON.stringify(songsData, null, 4);


//
// Step 3:  Stage songsData,
//          prune unwanted songs,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//

  songsData =
  [
      {
          "title": "What's Next",
          "artist_name": "Drake",
          "video_id": null,
          "capture_date": "2021-03-16 08:50:09.437437",
          "source_id": 848,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Wants And Needs",
          "artist_name": "Drake Featuring Lil Baby",
          "video_id": null,
          "capture_date": "2021-03-16 08:50:09.438438",
          "source_id": 848,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Lemon Pepper Freestyle",
          "artist_name": "Drake Featuring Rick Ross",
          "video_id": null,
          "capture_date": "2021-03-16 08:50:09.438438",
          "source_id": 848,
          "song_id": 9948,
          "duplicate": true
      },
      {
          "title": "Leave The Door Open",
          "artist_name": "Silk Sonic (Bruno Mars & Anderson .Paak)",
          "video_id": null,
          "capture_date": "2021-03-16 08:50:09.438438",
          "source_id": 848,
          "song_id": 9951,
          "duplicate": true
      },
      {
          "title": "Hold On",
          "artist_name": "Justin Bieber",
          "video_id": null,
          "capture_date": "2021-03-16 08:50:09.439439",
          "source_id": 848,
          "song_id": 9952,
          "duplicate": true
      },
      {
          "title": "Real As It Gets",
          "artist_name": "Lil Baby Featuring EST Gee",
          "video_id": null,
          "capture_date": "2021-03-16 08:50:09.439439",
          "source_id": 848,
          "song_id": 9949,
          "duplicate": true
      },
      {
          "title": "Beautiful Mistakes",
          "artist_name": "Maroon 5 Featuring Megan Thee Stallion",
          "video_id": null,
          "capture_date": "2021-03-16 08:50:09.439439",
          "source_id": 848,
          "song_id": 9965,
          "duplicate": true
      },
      {
          "title": "Hellcats & Trackhawks",
          "artist_name": "Lil Durk",
          "video_id": null,
          "capture_date": "2021-03-16 08:50:09.440440",
          "source_id": 848,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Life's A Mess II",
          "artist_name": "Juice WRLD, Clever & Post Malone",
          "video_id": null,
          "capture_date": "2021-03-16 08:50:09.440440",
          "source_id": 848,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Lil Bit",
          "artist_name": "Nelly & Florida Georgia Line",
          "video_id": null,
          "capture_date": "2021-03-16 08:50:09.440440",
          "source_id": 848,
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
  ('What’s Next', 'Drake', NULL),
  ('Wants And Needs', 'Drake Featuring Lil Baby', NULL),
  ('Hellcats & Trackhawks', 'Lil Durk', NULL),
  ('Life’s A Mess II', 'Juice WRLD, Clever & Post Malone', NULL),
  ('Lil Bit', 'Nelly & Florida Georgia Line', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9992; // SELECT last_insert_rowid();

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
  ('2021-03-16 08:50:09.437437', '848', '9988'),
  ('2021-03-16 08:50:09.438438', '848', '9989'),
  ('2021-03-16 08:50:09.438438', '848', '9948'),
  ('2021-03-16 08:50:09.438438', '848', '9951'),
  ('2021-03-16 08:50:09.439439', '848', '9952'),
  ('2021-03-16 08:50:09.439439', '848', '9949'),
  ('2021-03-16 08:50:09.439439', '848', '9965'),
  ('2021-03-16 08:50:09.440440', '848', '9990'),
  ('2021-03-16 08:50:09.440440', '848', '9991'),
  ('2021-03-16 08:50:09.440440', '848', '9992')
  ;

  // Update to source_song table
