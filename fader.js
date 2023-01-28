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
      'Week of January 23, 2022', -- Mondays (for the previous week, including the publication_date)
      '2023-01-23 12:00:00.000000', -- Dont forget this!
      'https://www.thefader.com/tag/songs-you-need-in-your-life');

      // Update to source table


  //
  // Step 2: Enter source info into an array & create blank template songs
  //

    source_id = 1493; // SELECT last_insert_rowid();

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
        "title": "Just Say (remix)",
        "artist_name": "DJ Sliink and Coco & Breezy",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Black Firework",
        "artist_name": "Dave Okumu",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Count of Three (You Can Eat $#@!)",
        "artist_name": "Underscores",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lemonade",
        "artist_name": "Max B",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Telephone",
        "artist_name": "Andy Shauf",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Kurt Rambis",
        "artist_name": "Papo2oo4",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Brody Trippin",
        "artist_name": "CEO Trayle ft. Baby Drill",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Injury Detail",
        "artist_name": "Mandy, Indiana",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Mystery Boy (remix)",
        "artist_name": "Vegyn and Sassy 009",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cnt Go Back",
        "artist_name": "Pink Siifu",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Walked In",
        "artist_name": "Eem Triplin",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Time",
        "artist_name": "Nico Paulo",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "NOISE OF YOU",
        "artist_name": "John Cale",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Maybae Baeby",
        "artist_name": "Xiu Xiu",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Oh Me, Oh My",
        "artist_name": "Lonnie Holley ft. Michael Stipe",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": 13391,
        "duplicate": true
    },
    {
        "title": "Blicky Bop",
        "artist_name": "Fly Anakin",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Try Again",
        "artist_name": "Oddisee",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": 13371,
        "duplicate": true
    },
    {
        "title": "C Class",
        "artist_name": "Wizz Havinn",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hypnic Jerk",
        "artist_name": "Oozing Wound",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dorothee Thines",
        "artist_name": "Asian Glow",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dogwood",
        "artist_name": "Nicole Dollanganger",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "So Hard To Tell",
        "artist_name": "Debby Friday",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "One of Us",
        "artist_name": "Goodfight",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Aftershow",
        "artist_name": "Império Pacifico & Panda Bear",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Last Time I Checked",
        "artist_name": "Bandmanrill",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Painted the Room",
        "artist_name": "Rozi Plain",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Unit",
        "artist_name": "Isyti",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Choujin",
        "artist_name": "betcover!!",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Huge Fire",
        "artist_name": "Mount Eerie",
        "video_id": null,
        "capture_date": "2023-01-28 10:12:36.254000",
        "source_id": 1493,
        "song_id": 13376,
        "duplicate": true
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
    ('Just Say (remix)', 'DJ Sliink and Coco & Breezy', NULL),
    ('Black Firework', 'Dave Okumu', NULL),
    ('Count of Three (You Can Eat $#@!)', 'Underscores', NULL),
    ('Lemonade', 'Max B', NULL),
    ('Telephone', 'Andy Shauf', NULL),
    ('Kurt Rambis', 'Papo2oo4', NULL),
    ('Brody Trippin', 'CEO Trayle ft. Baby Drill', NULL),
    ('Injury Detail', 'Mandy, Indiana', NULL),
    ('Mystery Boy (remix)', 'Vegyn and Sassy 009', NULL),
    ('Cnt Go Back', 'Pink Siifu', NULL),
    ('Walked In', 'Eem Triplin', NULL),
    ('Time', 'Nico Paulo', NULL),
    ('NOISE OF YOU', 'John Cale', NULL),
    ('Maybae Baeby', 'Xiu Xiu', NULL),
    ('Blicky Bop', 'Fly Anakin', NULL),
    ('C Class', 'Wizz Havinn', NULL),
    ('Hypnic Jerk', 'Oozing Wound', NULL),
    ('Dorothee Thines', 'Asian Glow', NULL),
    ('Dogwood', 'Nicole Dollanganger', NULL),
    ('So Hard To Tell', 'Debby Friday', NULL),
    ('One of Us', 'Goodfight', NULL),
    ('Aftershow', 'Império Pacifico & Panda Bear', NULL),
    ('Last Time I Checked', 'Bandmanrill', NULL),
    ('Painted the Room', 'Rozi Plain', NULL),
    ('Unit', 'Isyti', NULL),
    ('Choujin', 'betcover!!', NULL)
    ;

     // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 13439; // SELECT last_insert_rowid();

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
  ('2023-01-28 10:12:36.254000', '1493', '13414'),
  ('2023-01-28 10:12:36.254000', '1493', '13415'),
  ('2023-01-28 10:12:36.254000', '1493', '13416'),
  ('2023-01-28 10:12:36.254000', '1493', '13417'),
  ('2023-01-28 10:12:36.254000', '1493', '13418'),
  ('2023-01-28 10:12:36.254000', '1493', '13419'),
  ('2023-01-28 10:12:36.254000', '1493', '13420'),
  ('2023-01-28 10:12:36.254000', '1493', '13421'),
  ('2023-01-28 10:12:36.254000', '1493', '13422'),
  ('2023-01-28 10:12:36.254000', '1493', '13423'),
  ('2023-01-28 10:12:36.254000', '1493', '13424'),
  ('2023-01-28 10:12:36.254000', '1493', '13425'),
  ('2023-01-28 10:12:36.254000', '1493', '13426'),
  ('2023-01-28 10:12:36.254000', '1493', '13427'),
  ('2023-01-28 10:12:36.254000', '1493', '13391'),
  ('2023-01-28 10:12:36.254000', '1493', '13428'),
  ('2023-01-28 10:12:36.254000', '1493', '13371'),
  ('2023-01-28 10:12:36.254000', '1493', '13429'),
  ('2023-01-28 10:12:36.254000', '1493', '13430'),
  ('2023-01-28 10:12:36.254000', '1493', '13431'),
  ('2023-01-28 10:12:36.254000', '1493', '13432'),
  ('2023-01-28 10:12:36.254000', '1493', '13433'),
  ('2023-01-28 10:12:36.254000', '1493', '13434'),
  ('2023-01-28 10:12:36.254000', '1493', '13435'),
  ('2023-01-28 10:12:36.254000', '1493', '13436'),
  ('2023-01-28 10:12:36.254000', '1493', '13437'),
  ('2023-01-28 10:12:36.254000', '1493', '13438'),
  ('2023-01-28 10:12:36.254000', '1493', '13439'),
  ('2023-01-28 10:12:36.254000', '1493', '13376')
  ;

  // Update to source_song table
