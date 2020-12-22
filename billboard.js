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
    ('Billboard', 'The Hot 100', 'Week of December 26, 2020', '2020-12-26 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2020-12-26');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 753; // SELECT last_insert_rowid();
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
// Step 3: Stage songsData, find & set any duplicate songs to true, and add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Willow",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.531531",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Champagne Problems",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.533533",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "No Body, No Crime",
        "artist_name": "Taylor Swift Featuring HAIM",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.534534",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "’Tis The Damn Season",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.534534",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gold Rush",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.534534",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tequila Shots",
        "artist_name": "Kid Cudi",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.534534",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tolerate It",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.534534",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Deck The Halls",
        "artist_name": "Nat King Cole",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.534534",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "She Knows This",
        "artist_name": "Kid Cudi",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.534534",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Happiness",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.534534",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Show Out",
        "artist_name": "Kid Cudi, Skepta & Pop Smoke",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.534534",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Evermore",
        "artist_name": "Taylor Swift Featuring Bon Iver",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.534534",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ivy",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.534534",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Coney Island",
        "artist_name": "Taylor Swift Featuring The National",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.535535",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Another Day",
        "artist_name": "Kid Cudi",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.535535",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dorothea",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.535535",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Long Story Short",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.535535",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cowboy Like Me",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.535535",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Way Out",
        "artist_name": "Jack Harlow Featuring Big Sean",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.535535",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Marjorie",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.535535",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mr. Solo Dolo III",
        "artist_name": "Kid Cudi",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.535535",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dive",
        "artist_name": "Kid Cudi",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.535535",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Closure",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.535535",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Heaven On Earth",
        "artist_name": "Kid Cudi",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.535535",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Reminds Me Of You",
        "artist_name": "The Kid LAROI & Juice WRLD",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.535535",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sad People",
        "artist_name": "Kid Cudi",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.535535",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Damaged",
        "artist_name": "Kid Cudi",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.535535",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Beautiful Trip",
        "artist_name": "Kid Cudi",
        "video_id": null,
        "capture_date": "2020-12-22 12:51:52.536536",
        "source_id": 753,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Stay Down%'
    AND artist_name LIKE '%durk%'
  ;

  // If duplicates:
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
    ('Willow', 'Taylor Swift', NULL),
    ('Champagne Problems', 'Taylor Swift', NULL),
    ('No Body, No Crime', 'Taylor Swift Featuring HAIM', NULL),
    ('’Tis The Damn Season', 'Taylor Swift', NULL),
    ('Gold Rush', 'Taylor Swift', NULL),
    ('Tequila Shots', 'Kid Cudi', NULL),
    ('Tolerate It', 'Taylor Swift', NULL),
    ('Deck The Halls', 'Nat King Cole', NULL),
    ('She Knows This', 'Kid Cudi', NULL),
    ('Happiness', 'Taylor Swift', NULL),
    ('Show Out', 'Kid Cudi, Skepta & Pop Smoke', NULL),
    ('Evermore', 'Taylor Swift Featuring Bon Iver', NULL),
    ('Ivy', 'Taylor Swift', NULL),
    ('Coney Island', 'Taylor Swift Featuring The National', NULL),
    ('Another Day', 'Kid Cudi', NULL),
    ('Dorothea', 'Taylor Swift', NULL),
    ('Long Story Short', 'Taylor Swift', NULL),
    ('Cowboy Like Me', 'Taylor Swift', NULL),
    ('Way Out', 'Jack Harlow Featuring Big Sean', NULL),
    ('Marjorie', 'Taylor Swift', NULL),
    ('Mr. Solo Dolo III', 'Kid Cudi', NULL),
    ('Dive', 'Kid Cudi', NULL),
    ('Closure', 'Taylor Swift', NULL),
    ('Heaven On Earth', 'Kid Cudi', NULL),
    ('Reminds Me Of You', 'The Kid LAROI & Juice WRLD', NULL),
    ('Sad People', 'Kid Cudi', NULL),
    ('Damaged', 'Kid Cudi', NULL),
    ('Beautiful Trip', 'Kid Cudi', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9659; // SELECT last_insert_rowid();

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
    ('2020-12-22 12:51:52.531531', '753', '9632'),
    ('2020-12-22 12:51:52.533533', '753', '9633'),
    ('2020-12-22 12:51:52.534534', '753', '9634'),
    ('2020-12-22 12:51:52.534534', '753', '9635'),
    ('2020-12-22 12:51:52.534534', '753', '9636'),
    ('2020-12-22 12:51:52.534534', '753', '9637'),
    ('2020-12-22 12:51:52.534534', '753', '9638'),
    ('2020-12-22 12:51:52.534534', '753', '9639'),
    ('2020-12-22 12:51:52.534534', '753', '9640'),
    ('2020-12-22 12:51:52.534534', '753', '9641'),
    ('2020-12-22 12:51:52.534534', '753', '9642'),
    ('2020-12-22 12:51:52.534534', '753', '9643'),
    ('2020-12-22 12:51:52.534534', '753', '9644'),
    ('2020-12-22 12:51:52.535535', '753', '9645'),
    ('2020-12-22 12:51:52.535535', '753', '9646'),
    ('2020-12-22 12:51:52.535535', '753', '9647'),
    ('2020-12-22 12:51:52.535535', '753', '9648'),
    ('2020-12-22 12:51:52.535535', '753', '9649'),
    ('2020-12-22 12:51:52.535535', '753', '9650'),
    ('2020-12-22 12:51:52.535535', '753', '9651'),
    ('2020-12-22 12:51:52.535535', '753', '9652'),
    ('2020-12-22 12:51:52.535535', '753', '9653'),
    ('2020-12-22 12:51:52.535535', '753', '9654'),
    ('2020-12-22 12:51:52.535535', '753', '9655'),
    ('2020-12-22 12:51:52.535535', '753', '9656'),
    ('2020-12-22 12:51:52.535535', '753', '9657'),
    ('2020-12-22 12:51:52.535535', '753', '9658'),
    ('2020-12-22 12:51:52.536536', '753', '9659')
  ;

  // Update to source_song table
