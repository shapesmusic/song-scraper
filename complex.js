// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT instance_name, publication_date FROM source WHERE parent_entity = 'Complex' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  chartTitle = document.getElementsByClassName("story-title story-title__article")[0].innerText;
  parentStream = chartTitle.match(/.+?(?=:)/)[0];
  instanceName = chartTitle.match(/[^:]+$/)[0].trim();

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format publicationDate
  publicationDate = document.getElementsByClassName("info-row__datetime")[0].innerHTML.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // Get and format location
  chartLocation = window.location.href; // "location" is a reserved word

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Complex\', "
    + "\'" + parentStream + "\', "
    + "\'" + instanceName + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + chartLocation + "\');"
  );


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Complex', 'Best New Music This Week', 'Roddy Ricch, Benny the Butcher, Justin Bieber, and More', '2021-03-19 12:00:00.000000', 'https://www.complex.com/music/best-new-music-roddy-benny-bieber/');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 854; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("article-list");
  element = elements[0].getElementsByTagName("h2"); // sometimes h2 or h3
  videoUrl = document.getElementsByClassName("video-lazyload");

  songsData = [];

  for (var i=0; i<element.length; i++){
    title = element[i].innerText.match(/, “(.*?)”/)[1]; // may need " or “” type quotation marks, or a comma after the artist name, or may have an &nbsp; instead of a space
    artist_name = element[i].innerText.match(/.+?(?=, “)/)[0]; // may need " or “ type quotation marks
    video_id = videoUrl[i].style.backgroundImage.match(/(?<=vi\/)(.*)(?=\/)/)[0]; // example: url("https://i.ytimg.com/vi/gejbbL1AaJk/hqdefault.jpg")

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
        "title": "Heartless (Live From LA)",
        "artist_name": "Roddy Ricch",
        "video_id": "bmP7TaTIdMQ",
        "capture_date": "2021-03-23 09:15:39.907907",
        "source_id": 854,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "When Tony Met Sosa",
        "artist_name": "Benny the Butcher & Harry Fraud",
        "video_id": "2bI8XsdNb-c",
        "capture_date": "2021-03-23 09:15:39.908908",
        "source_id": 854,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Peaches",
        "artist_name": "Justin Bieber f/ Giveon & Daniel Caesar",
        "video_id": "tQ0yjYUFKAE",
        "capture_date": "2021-03-23 09:15:39.908908",
        "source_id": 854,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Marigold",
        "artist_name": "Jelani Aryeh",
        "video_id": "phGdPoBcxqs",
        "capture_date": "2021-03-23 09:15:39.908908",
        "source_id": 854,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Twirlanta",
        "artist_name": "22Gz",
        "video_id": "63FjrdZZfp4",
        "capture_date": "2021-03-23 09:15:39.908908",
        "source_id": 854,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Headshot",
        "artist_name": "Lil Tjay, Polo G, & Fivio Foreign",
        "video_id": "aT_nFiTkxy8",
        "capture_date": "2021-03-23 09:15:39.908908",
        "source_id": 854,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Chicken Adobo",
        "artist_name": "Guapdad 4000 & !llmind",
        "video_id": "1DaovaJgytE",
        "capture_date": "2021-03-23 09:15:39.908908",
        "source_id": 854,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Wolves",
        "artist_name": "Kota the Friend & Statik Selektah",
        "video_id": "k9i3nQO5adc",
        "capture_date": "2021-03-23 09:15:39.908908",
        "source_id": 854,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Calabasas",
        "artist_name": "SSGKobe & $NOT",
        "video_id": "yFZR03xYb78",
        "capture_date": "2021-03-23 09:15:39.908908",
        "source_id": 854,
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
  ('Heartless (Live From LA)', 'Roddy Ricch', NULL),
  ('When Tony Met Sosa', 'Benny the Butcher & Harry Fraud', NULL),
  ('Peaches', 'Justin Bieber f/ Giveon & Daniel Caesar', NULL),
  ('Marigold', 'Jelani Aryeh', NULL),
  ('Twirlanta', '22Gz', NULL),
  ('Headshot', 'Lil Tjay, Polo G, & Fivio Foreign', NULL),
  ('Chicken Adobo', 'Guapdad 4000 & !llmind', NULL),
  ('Wolves', 'Kota the Friend & Statik Selektah', NULL),
  ('Calabasas', 'SSGKobe & $NOT', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10031; // SELECT last_insert_rowid();

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
  ('2021-03-23 09:15:39.907907', '854', '10023'),
  ('2021-03-23 09:15:39.908908', '854', '10024'),
  ('2021-03-23 09:15:39.908908', '854', '10025'),
  ('2021-03-23 09:15:39.908908', '854', '10026'),
  ('2021-03-23 09:15:39.908908', '854', '10027'),
  ('2021-03-23 09:15:39.908908', '854', '10028'),
  ('2021-03-23 09:15:39.908908', '854', '10029'),
  ('2021-03-23 09:15:39.908908', '854', '10030'),
  ('2021-03-23 09:15:39.908908', '854', '10031')
  ;

  // Update to source_song table
