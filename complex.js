// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'Complex' ORDER BY publication_date DESC LIMIT 8;


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
    ('Complex', 'Best New Music This Week', 'Freddie Gibbs, 42 Dugg, Brockhampton, More', '2021-04-02 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-april-2/lil-tjay-offset-moneybagg-yo-run-it-up');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 877; // SELECT last_insert_rowid();
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
        "title": "Count on Me",
        "artist_name": "Brockhampton feat. ASAP Rocky & SoGone SoFlexy",
        "video_id": "78dEK21wI2g",
        "capture_date": "2021-04-06 06:47:00.715715",
        "source_id": 877,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Big Boss Rabbit",
        "artist_name": "Freddie Gibbs",
        "video_id": "NabmJWtYK5c",
        "capture_date": "2021-04-06 06:47:00.716716",
        "source_id": 877,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "4 Da Gang",
        "artist_name": "42 Dugg f/ Roddy Ricch",
        "video_id": "x6LBEoIF1mk",
        "capture_date": "2021-04-06 06:47:00.716716",
        "source_id": 877,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Rih",
        "artist_name": "Kenny Mason",
        "video_id": "S9mjXP9X8_M",
        "capture_date": "2021-04-06 06:47:00.716716",
        "source_id": 877,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "4U",
        "artist_name": "Pi’erre Bourne",
        "video_id": "2TTR1v6WJOw",
        "capture_date": "2021-04-06 06:47:00.716716",
        "source_id": 877,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Yeah Kool",
        "artist_name": "FXXXXY f/ Lil Uzi Vert",
        "video_id": "rKhQEjh1fjE",
        "capture_date": "2021-04-06 06:47:00.716716",
        "source_id": 877,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Deja Vu",
        "artist_name": "Olivia Rodrigo",
        "video_id": "cii6ruuycQA",
        "capture_date": "2021-04-06 06:47:00.716716",
        "source_id": 877,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Run It Up",
        "artist_name": "Lil Tjay f/ Offset and Moneybagg Yo",
        "video_id": "ML-iBsCUDg8",
        "capture_date": "2021-04-06 06:47:00.716716",
        "source_id": 877,
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
  ('Count on Me', 'Brockhampton feat. ASAP Rocky & SoGone SoFlexy', NULL),
  ('Big Boss Rabbit', 'Freddie Gibbs', NULL),
  ('4 Da Gang', '42 Dugg f/ Roddy Ricch', NULL),
  ('Rih', 'Kenny Mason', NULL),
  ('4U', 'Pi’erre Bourne', NULL),
  ('Yeah Kool', 'FXXXXY f/ Lil Uzi Vert', NULL),
  ('Deja Vu', 'Olivia Rodrigo', NULL),
  ('Run It Up', 'Lil Tjay f/ Offset and Moneybagg Yo', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10143; // SELECT last_insert_rowid();

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
  ('2021-04-06 06:47:00.715715', '877', '10136'),
  ('2021-04-06 06:47:00.716716', '877', '10137'),
  ('2021-04-06 06:47:00.716716', '877', '10138'),
  ('2021-04-06 06:47:00.716716', '877', '10139'),
  ('2021-04-06 06:47:00.716716', '877', '10140'),
  ('2021-04-06 06:47:00.716716', '877', '10141'),
  ('2021-04-06 06:47:00.716716', '877', '10142'),
  ('2021-04-06 06:47:00.716716', '877', '10143')
  ;

  // Update to source_song table
