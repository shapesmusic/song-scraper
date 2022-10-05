// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped
// If no roundup this week, manually add songs (steps at the end of this file)


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'The Fader' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  fader_no = 254 // from the chart page

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format publicationDate
  publicationDate = document.getElementsByClassName("posted")[0].innerText.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // Get source name info
  chartTitle = document.getElementsByTagName("h1")[0].innerText;
  parentStream = chartTitle;
  instanceName = "No. " + fader_no + " Week of " + publicationDate;

  // Get and format location
  chartLocation = window.location.href; // "location" is a reserved word

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'The Fader\', "
    + "\'" + parentStream + "\', "
    + "\'" + instanceName + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + chartLocation + "\');"
  );


  // Stage the SQL statement
  // Replace any ' in strings with ’
  // If ’ replaced, check again for duplicate

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('The Fader', '10 songs you need in your life this week', 'No. 254 Week of May 23, 2022', '2022-05-23 12:00:00.000000', 'https://www.thefader.com/2022/05/23/10-songs-you-need-in-your-life-harry-styles-mozzy-shordie-four-tet-2022');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1216; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("headline");

  songsData = [];

  for (var i=0; i<elements.length; i++){
    title = elements[i].innerText.match(/[“"](.*?)[”"]/)[1];
    artist_name = elements[i].innerText.match(/[–-—-] ([\s\S]*)$/)[1]; // still gets stuck on &nbsp;
    video_id = null
      // replace null with below to grab video IDs (when all songs are YT)
      // videoUrl[i].style.backgroundImage.match(/(?<=vi\/)(.*)(?=\/)/)[0];

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

    songsData.push(songData);

  };

  console.log(JSON.stringify(songsData, null, 4));


//
// Step 3:  Stage songsData,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//          find and replace fe~at. with "ft."
//

  songsData =
  [
    {
        "title": "Pokke Koebês",
        "artist_name": "Free Radicals and Jitsvinger",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.130130",
        "source_id": 1216,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Selfish Soul",
        "artist_name": "Sudan Archives",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.138138",
        "source_id": 1216,
        "song_id": 12251,
        "duplicate": true
    },
    {
        "title": "Idk What Love Is",
        "artist_name": "Dazegxd",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.139139",
        "source_id": 1216,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Frozen On Fire",
        "artist_name": "Madonna and Sickick",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.139139",
        "source_id": 1216,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Radiation",
        "artist_name": "Lucy",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.139139",
        "source_id": 1216,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Looking At Your Pager",
        "artist_name": "KH",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.139139",
        "source_id": 1216,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "(Herman's) House",
        "artist_name": "Special Interest",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.139139",
        "source_id": 1216,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tell The Truth",
        "artist_name": "Mozzie and Shordie Shordie",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.139139",
        "source_id": 1216,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Love Of My Life",
        "artist_name": "Harry Styles",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.139139",
        "source_id": 1216,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hit It Light It Twist It",
        "artist_name": "Jim Legxacy",
        "video_id": null,
        "capture_date": "2022-05-30 07:43:31.139139",
        "source_id": 1216,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Set%'
    AND artist_name LIKE '%CJ%'
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
  ('Pokke Koebês', 'Free Radicals and Jitsvinger', NULL),
  ('Idk What Love Is', 'Dazegxd', NULL),
  ('Frozen On Fire', 'Madonna and Sickick', NULL),
  ('Radiation', 'Lucy', NULL),
  ('Looking At Your Pager', 'KH', NULL),
  ('(Herman’s) House', 'Special Interest', NULL),
  ('Tell The Truth', 'Mozzie and Shordie Shordie', NULL),
  ('Love Of My Life', 'Harry Styles', NULL),
  ('Hit It Light It Twist It', 'Jim Legxacy', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12277; // SELECT last_insert_rowid();

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
  ('2022-05-30 07:43:31.130130', '1216', '12269'),
  ('2022-05-30 07:43:31.138138', '1216', '12251'),
  ('2022-05-30 07:43:31.139139', '1216', '12270'),
  ('2022-05-30 07:43:31.139139', '1216', '12271'),
  ('2022-05-30 07:43:31.139139', '1216', '12272'),
  ('2022-05-30 07:43:31.139139', '1216', '12273'),
  ('2022-05-30 07:43:31.139139', '1216', '12274'),
  ('2022-05-30 07:43:31.139139', '1216', '12275'),
  ('2022-05-30 07:43:31.139139', '1216', '12276'),
  ('2022-05-30 07:43:31.139139', '1216', '12277')
  ;

  // Update to source_song table


  ---
  Manual Additions

  //
  // Step 1: Fill in the source data manually
  //

    // Fill in manually:

    INSERT INTO source
      (parent_entity, parent_stream, instance_name, publication_date, location)
    VALUES
      ('The Fader',
      'Songs You Need',
      'Week of October 4, 2022', -- Mondays (for the previous week, including the publication_date)
      '2022-10-04 12:00:00.000000', -- Dont forget this!
      'https://www.thefader.com/tag/songs-you-need-in-your-life');

      // Update to source table


  //
  // Step 2: Enter source info into an array & create blank template songs
  //

    source_id = 1375; // SELECT last_insert_rowid();

    // Create a blank template song
    title = ""
    artist_name = ""
    video_id = null // if not adding video_id, set to null

    song_id = null;

    // Add moment.js to the header (make sure scripts aren't blocked in the browser)
    momentjs = document.createElement("script");
    momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
    document.head.appendChild(momentjs);

    capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    // build template songsData
    songsData =
    [
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": title,
          "artist_name": artist_name,
          "video_id": video_id,
          "capture_date": capture_date,
          "source_id": source_id,
          "song_id": null,
          "duplicate": false
      }
  ]

    console.log(JSON.stringify(songsData, null, 4));


  //
  // Step 3: Stage songsData
  //

    // manually add titles and artists,
    // find & set any duplicate songs to true,
    // add song_ids for duplicates
    // add or remove blank songs as needed

    // the top song is the most recent song
    songsData =
    [
    {
        "title": "Heart On Froze",
        "artist_name": "Rome Streetz",
        "video_id": null,
        "capture_date": "2022-10-05 09:47:11.271000",
        "source_id": 1375,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "BLUE CRUSH ANGEL",
        "artist_name": "Bladee",
        "video_id": null,
        "capture_date": "2022-10-05 09:47:11.271000",
        "source_id": 1375,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Give Her Soul",
        "artist_name": "ICYTWAT",
        "video_id": null,
        "capture_date": "2022-10-05 09:47:11.271000",
        "source_id": 1375,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Steel Wing",
        "artist_name": "Arima Ederra",
        "video_id": null,
        "capture_date": "2022-10-05 09:47:11.271000",
        "source_id": 1375,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Your Last Everything",
        "artist_name": "Soft Crash ft. Marie Davidson",
        "video_id": null,
        "capture_date": "2022-10-05 09:47:11.271000",
        "source_id": 1375,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Saffron",
        "artist_name": "Dawn Richard and Spencer Zahn",
        "video_id": null,
        "capture_date": "2022-10-05 09:47:11.271000",
        "source_id": 1375,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Wall of Sleep",
        "artist_name": "Daniel Avery ft. HAAi",
        "video_id": null,
        "capture_date": "2022-10-05 09:47:11.271000",
        "source_id": 1375,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "World Sandwiches 2",
        "artist_name": "Persher",
        "video_id": null,
        "capture_date": "2022-10-05 09:47:11.271000",
        "source_id": 1375,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lieber Honig (Remix)",
        "artist_name": "Yann Tiersen",
        "video_id": null,
        "capture_date": "2022-10-05 09:47:11.271000",
        "source_id": 1375,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "rien dire",
        "artist_name": "Christine and the Queens",
        "video_id": null,
        "capture_date": "2022-10-05 09:47:11.271000",
        "source_id": 1375,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Nothing Even Matters",
        "artist_name": "SiR",
        "video_id": null,
        "capture_date": "2022-10-05 09:47:11.271000",
        "source_id": 1375,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Early Morning Waiting",
        "artist_name": "Alex G",
        "video_id": null,
        "capture_date": "2022-10-05 09:47:11.271000",
        "source_id": 1375,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Emotional",
        "artist_name": "Benedek",
        "video_id": null,
        "capture_date": "2022-10-05 09:47:11.271000",
        "source_id": 1375,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Life of a Fly",
        "artist_name": "James K",
        "video_id": null,
        "capture_date": "2022-10-05 09:47:11.271000",
        "source_id": 1375,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Not My Job",
        "artist_name": "FLO",
        "video_id": null,
        "capture_date": "2022-10-05 09:47:11.271000",
        "source_id": 1375,
        "song_id": 12881,
        "duplicate": true
    },
    {
        "title": "careful what you wish for",
        "artist_name": "isomonstrosity",
        "video_id": null,
        "capture_date": "2022-10-05 09:47:11.271000",
        "source_id": 1375,
        "song_id": null,
        "duplicate": false
    }
]

    // Check each song for duplicates in the database
    SELECT id, title, artist_name FROM song WHERE
      title LIKE '%Up%'
      AND artist_name LIKE '%Cardi%'
    ;

    // Add var songsData = the deduplicated list above


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


    // Stage the SQL statement
    // Replace any ' in strings with ’

    INSERT INTO song
      (title, artist_name, video_id)
    VALUES
    ('Heart On Froze', 'Rome Streetz', NULL),
    ('BLUE CRUSH ANGEL', 'Bladee', NULL),
    ('Give Her Soul', 'ICYTWAT', NULL),
    ('Steel Wing', 'Arima Ederra', NULL),
    ('Your Last Everything', 'Soft Crash ft. Marie Davidson', NULL),
    ('Saffron', 'Dawn Richard and Spencer Zahn', NULL),
    ('Wall of Sleep', 'Daniel Avery ft. HAAi', NULL),
    ('World Sandwiches 2', 'Persher', NULL),
    ('Lieber Honig (Remix)', 'Yann Tiersen', NULL),
    ('rien dire', 'Christine and the Queens', NULL),
    ('Nothing Even Matters', 'SiR', NULL),
    ('Early Morning Waiting', 'Alex G', NULL),
    ('Emotional', 'Benedek', NULL),
    ('Life of a Fly', 'James K', NULL),
    ('careful what you wish for', 'isomonstrosity', NULL)
    ;

     // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12935; // SELECT last_insert_rowid();

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
  ('2022-10-05 09:47:11.271000', '1375', '12921'),
  ('2022-10-05 09:47:11.271000', '1375', '12922'),
  ('2022-10-05 09:47:11.271000', '1375', '12923'),
  ('2022-10-05 09:47:11.271000', '1375', '12924'),
  ('2022-10-05 09:47:11.271000', '1375', '12925'),
  ('2022-10-05 09:47:11.271000', '1375', '12926'),
  ('2022-10-05 09:47:11.271000', '1375', '12927'),
  ('2022-10-05 09:47:11.271000', '1375', '12928'),
  ('2022-10-05 09:47:11.271000', '1375', '12929'),
  ('2022-10-05 09:47:11.271000', '1375', '12930'),
  ('2022-10-05 09:47:11.271000', '1375', '12931'),
  ('2022-10-05 09:47:11.271000', '1375', '12932'),
  ('2022-10-05 09:47:11.271000', '1375', '12933'),
  ('2022-10-05 09:47:11.271000', '1375', '12934'),
  ('2022-10-05 09:47:11.271000', '1375', '12881'),
  ('2022-10-05 09:47:11.271000', '1375', '12935')
  ;

  // Update to source_song table
