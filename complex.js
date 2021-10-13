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
    ('Complex', 'Best New Music This Week', 'Denzel Curry, Benny the Butcher, YNW Melly, and More', '2021-08-13 12:00:00.000000', 'https://www.complex.com/music/best-new-music-this-week-benny-the-butcher-denzel-curry/pinkpanthress-just-for-me');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1041; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("article-list");
  element = elements[0].getElementsByTagName("h2"); // sometimes h2 or h3
  // videoUrl = document.getElementsByClassName("video-lazyload");

  songsData = [];

  for (var i=0; i<element.length; i++){
    title = element[i].innerText.match(/, “(.*?)”/)[1]; // may need " or “” type quotation marks, or a comma after the artist name, or may have an &nbsp; instead of a space
    artist_name = element[i].innerText.match(/.+?(?=, “)/)[0]; // may need " or “ type quotation marks
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
//          find and replace f[slash] with "ft."
//

  songsData =
  [
      {
          "title": "The Game",
          "artist_name": "Denzel Curry",
          "video_id": null,
          "capture_date": "2021-10-13 07:47:04.850850",
          "source_id": 1041,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Fly With Me",
          "artist_name": "Benny the Butcher ft. Conway the Machine",
          "video_id": null,
          "capture_date": "2021-10-13 07:47:04.852852",
          "source_id": 1041,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Rumors",
          "artist_name": "Lizzo ft. Cardi B",
          "video_id": null,
          "capture_date": "2021-10-13 07:47:04.852852",
          "source_id": 1041,
          "song_id": 10710,
          "duplicate": true
      },
      {
          "title": "Mind of Melvin",
          "artist_name": "YNW Melly ft. Lil Uzi Vert",
          "video_id": null,
          "capture_date": "2021-10-13 07:47:04.852852",
          "source_id": 1041,
          "song_id": 10712,
          "duplicate": true
      },
      {
          "title": "Ball is Life",
          "artist_name": "Swae Lee ft. Jack Harlow",
          "video_id": null,
          "capture_date": "2021-10-13 07:47:04.852852",
          "source_id": 1041,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Photographic Memories",
          "artist_name": "Boldy James & The Alchemist ft. Roc Marciano & Earl Sweatshirt",
          "video_id": null,
          "capture_date": "2021-10-13 07:47:04.852852",
          "source_id": 1041,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Essence (Remix)",
          "artist_name": "WizKid ft. Justin Bieber & Tems",
          "video_id": null,
          "capture_date": "2021-10-13 07:47:04.852852",
          "source_id": 1041,
          "song_id": 10653,
          "duplicate": true
      },
      {
          "title": "Down South",
          "artist_name": "Wale, Yella Beezy, & Maxo Kream",
          "video_id": null,
          "capture_date": "2021-10-13 07:47:04.852852",
          "source_id": 1041,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Trim the Fat",
          "artist_name": "Flee Lord & Roc Marciano ft. Stove God Cooks",
          "video_id": null,
          "capture_date": "2021-10-13 07:47:04.852852",
          "source_id": 1041,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Just For Me",
          "artist_name": "PinkPantheress",
          "video_id": null,
          "capture_date": "2021-10-13 07:47:04.853853",
          "source_id": 1041,
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
  ('The Game', 'Denzel Curry', NULL),
  ('Fly With Me', 'Benny the Butcher ft. Conway the Machine', NULL),
  ('Ball is Life', 'Swae Lee ft. Jack Harlow', NULL),
  ('Photographic Memories', 'Boldy James & The Alchemist ft. Roc Marciano & Earl Sweatshirt', NULL),
  ('Down South', 'Wale, Yella Beezy, & Maxo Kream', NULL),
  ('Trim the Fat', 'Flee Lord & Roc Marciano ft. Stove God Cooks', NULL),
  ('Just For Me', 'PinkPantheress', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11075; // SELECT last_insert_rowid();

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
  ('2021-10-13 07:47:04.850850', '1041', '11069'),
  ('2021-10-13 07:47:04.852852', '1041', '11070'),
  ('2021-10-13 07:47:04.852852', '1041', '10710'),
  ('2021-10-13 07:47:04.852852', '1041', '10712'),
  ('2021-10-13 07:47:04.852852', '1041', '11071'),
  ('2021-10-13 07:47:04.852852', '1041', '11072'),
  ('2021-10-13 07:47:04.852852', '1041', '10653'),
  ('2021-10-13 07:47:04.852852', '1041', '11073'),
  ('2021-10-13 07:47:04.852852', '1041', '11074'),
  ('2021-10-13 07:47:04.853853', '1041', '11075')
  ;

  // Update to source_song table
