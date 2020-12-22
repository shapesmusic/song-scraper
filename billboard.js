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
    + "\'" + pastChartLocation + "\');" // use pastChartLocation if not the current week's chart, otherwise use currentChartLocation
  )

  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Billboard', 'The Hot 100', 'Week of November 28, 2020', '2020-11-28 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2020-11-28');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 749; // SELECT last_insert_rowid();
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
          "title": "Drankin N Smokin",
          "artist_name": "Future & Lil Uzi Vert",
          "video_id": null,
          "capture_date": "2020-12-22 09:07:59.771771",
          "source_id": 749,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Holiday",
          "artist_name": "Lil Nas X",
          "video_id": null,
          "capture_date": "2020-12-22 09:07:59.771771",
          "source_id": 749,
          "song_id": 9571,
          "duplicate": true
      },
      {
          "title": "Stripes Like Burberry",
          "artist_name": "Future & Lil Uzi Vert",
          "video_id": null,
          "capture_date": "2020-12-22 09:07:59.771771",
          "source_id": 749,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "That's It",
          "artist_name": "Future & Lil Uzi Vert",
          "video_id": null,
          "capture_date": "2020-12-22 09:07:59.771771",
          "source_id": 749,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Real Baby Pluto",
          "artist_name": "Future & Lil Uzi Vert",
          "video_id": null,
          "capture_date": "2020-12-22 09:07:59.771771",
          "source_id": 749,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Iris",
          "artist_name": "Phoebe & Maggie",
          "video_id": null,
          "capture_date": "2020-12-22 09:07:59.772772",
          "source_id": 749,
          "song_id": 9577,
          "duplicate": true
      },
      {
          "title": "Marni On Me",
          "artist_name": "Future & Lil Uzi Vert",
          "video_id": null,
          "capture_date": "2020-12-22 09:07:59.772772",
          "source_id": 749,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Million Dollar Play",
          "artist_name": "Future & Lil Uzi Vert",
          "video_id": null,
          "capture_date": "2020-12-22 09:07:59.772772",
          "source_id": 749,
          "song_id": 9568,
          "duplicate": true
      },
      {
          "title": "Sleeping On The Floor",
          "artist_name": "Future & Lil Uzi Vert",
          "video_id": null,
          "capture_date": "2020-12-22 09:07:59.772772",
          "source_id": 749,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "What's Your Country Song",
          "artist_name": "Thomas Rhett",
          "video_id": null,
          "capture_date": "2020-12-22 09:07:59.772772",
          "source_id": 749,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Plastic",
          "artist_name": "Future & Lil Uzi Vert",
          "video_id": null,
          "capture_date": "2020-12-22 09:07:59.772772",
          "source_id": 749,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Rockstar Chainz",
          "artist_name": "Future",
          "video_id": null,
          "capture_date": "2020-12-22 09:07:59.773773",
          "source_id": 749,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Bought A Bad Bitch",
          "artist_name": "Future & Lil Uzi Vert",
          "video_id": null,
          "capture_date": "2020-12-22 09:07:59.773773",
          "source_id": 749,
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
    ('Drankin N Smokin', 'Future & Lil Uzi Vert', NULL),
    ('Stripes Like Burberry', 'Future & Lil Uzi Vert', NULL),
    ('That’s It', 'Future & Lil Uzi Vert', NULL),
    ('Real Baby Pluto', 'Future & Lil Uzi Vert', NULL),
    ('Marni On Me', 'Future & Lil Uzi Vert', NULL),
    ('Sleeping On The Floor', 'Future & Lil Uzi Vert', NULL),
    ('What’s Your Country Song', 'Thomas Rhett', NULL),
    ('Plastic', 'Future & Lil Uzi Vert', NULL),
    ('Rockstar Chainz', 'Future', NULL),
    ('Bought A Bad Bitch', 'Future & Lil Uzi Vert', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9590; // SELECT last_insert_rowid();

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
    ('2020-12-22 09:07:59.771771', '749', '9581'),
    ('2020-12-22 09:07:59.771771', '749', '9571'),
    ('2020-12-22 09:07:59.771771', '749', '9582'),
    ('2020-12-22 09:07:59.771771', '749', '9583'),
    ('2020-12-22 09:07:59.771771', '749', '9584'),
    ('2020-12-22 09:07:59.772772', '749', '9577'),
    ('2020-12-22 09:07:59.772772', '749', '9585'),
    ('2020-12-22 09:07:59.772772', '749', '9568'),
    ('2020-12-22 09:07:59.772772', '749', '9586'),
    ('2020-12-22 09:07:59.772772', '749', '9587'),
    ('2020-12-22 09:07:59.772772', '749', '9588'),
    ('2020-12-22 09:07:59.773773', '749', '9589'),
    ('2020-12-22 09:07:59.773773', '749', '9590')
  ;

  // Update to source_song table
