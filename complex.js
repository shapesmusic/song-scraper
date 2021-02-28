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
    ('Complex', 'Best New Music This Week', 'Ariana Grande, Kenny Mason, Lil Yachty, and More', '2021-02-19 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-ariana-grande-kenny-mason-lil-yachty/kaytranada-caution');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 778; // SELECT last_insert_rowid();
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
// Step 3: Stage songsData, prune unwanted songs, find & set any duplicate songs to true, and add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "Go Crazy (Remix)",
        "artist_name": "Young Thug & Chris Brown f/ Mulatto, Lil Durk & Future",
        "video_id": "frM2nSbtWi4",
        "capture_date": "2021-02-28 03:47:58.214214",
        "source_id": 778,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hit Bout It",
        "artist_name": "Lil Yachty f/ Kodak Black",
        "video_id": "_XqKuHT_09Y",
        "capture_date": "2021-02-28 03:47:58.216216",
        "source_id": 778,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Set",
        "artist_name": "CJ",
        "video_id": "I1BbugHHit0",
        "capture_date": "2021-02-28 03:47:58.216216",
        "source_id": 778,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Southside Forever Freestyle",
        "artist_name": "Megan Thee Stallion",
        "video_id": "S7UV0RSWyyQ",
        "capture_date": "2021-02-28 03:47:58.216216",
        "source_id": 778,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "test drive",
        "artist_name": "Ariana Grande",
        "video_id": "rFA11HZu-RU",
        "capture_date": "2021-02-28 03:47:58.216216",
        "source_id": 778,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Say A Prayer",
        "artist_name": "Jim Jones & Harry Fraud, f/ Currensy & Jay Worthy",
        "video_id": "DZNFPUMDnGU",
        "capture_date": "2021-02-28 03:47:58.216216",
        "source_id": 778,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Partments",
        "artist_name": "Kenny Mason",
        "video_id": "rBAKvRCNixo",
        "capture_date": "2021-02-28 03:47:58.216216",
        "source_id": 778,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gasoline (Remix)",
        "artist_name": "Haim f/ Taylor Swift",
        "video_id": "kQ15Nq1XjRA",
        "capture_date": "2021-02-28 03:47:58.216216",
        "source_id": 778,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Caution",
        "artist_name": "Kaytranada",
        "video_id": "E0PT0Ez4tSQ",
        "capture_date": "2021-02-28 03:47:58.216216",
        "source_id": 778,
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
  ('Go Crazy (Remix)', 'Young Thug & Chris Brown f/ Mulatto, Lil Durk & Future', NULL),
  ('Hit Bout It', 'Lil Yachty f/ Kodak Black', NULL),
  ('Set', 'CJ', NULL),
  ('Southside Forever Freestyle', 'Megan Thee Stallion', NULL),
  ('test drive', 'Ariana Grande', NULL),
  ('Say A Prayer', 'Jim Jones & Harry Fraud, f/ Currensy & Jay Worthy', NULL),
  ('Partments', 'Kenny Mason', NULL),
  ('Gasoline (Remix)', 'Haim f/ Taylor Swift', NULL),
  ('Caution', 'Kaytranada', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9834; // SELECT last_insert_rowid();

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
  ('2021-02-28 03:47:58.214214', '778', '9826'),
  ('2021-02-28 03:47:58.216216', '778', '9827'),
  ('2021-02-28 03:47:58.216216', '778', '9828'),
  ('2021-02-28 03:47:58.216216', '778', '9829'),
  ('2021-02-28 03:47:58.216216', '778', '9830'),
  ('2021-02-28 03:47:58.216216', '778', '9831'),
  ('2021-02-28 03:47:58.216216', '778', '9832'),
  ('2021-02-28 03:47:58.216216', '778', '9833'),
  ('2021-02-28 03:47:58.216216', '778', '9834')
  ;

  // Update to source_song table
