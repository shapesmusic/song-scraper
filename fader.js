// Scroll to the bottom of the page first, so all the lazyload stuff loads
// Always check the last song name to make sure everything got scraped


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'The Fader' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  fader_no = 245 // from the chart page

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

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('The Fader', '10 songs you need in your life this week', 'No. 245 Week of March 16, 2022', '2022-03-16 12:00:00.000000', 'https://www.thefader.com/2022/03/16/songs-you-need-megan-thee-stallion-orion-sun-nia-archives');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1172; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("headline");

  songsData = [];

  for (var i=0; i<elements.length; i++){
    title = elements[i].innerText.match(/“|"(.*?)”|"/)[1];
    artist_name = elements[i].innerText.match(/–|-|— ([\s\S]*)$/)[1]
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
        "title": "Sweetest Pie",
        "artist_name": "Megan Thee Stallion & Dua Lipa",
        "video_id": null,
        "capture_date": "2022-03-22 08:40:53.131131",
        "source_id": 1172,
        "song_id": 11809,
        "duplicate": true
    },
    {
        "title": "Intro",
        "artist_name": "Orion Sun",
        "video_id": null,
        "capture_date": "2022-03-22 08:40:53.132132",
        "source_id": 1172,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Part of Me",
        "artist_name": "Nia Archives",
        "video_id": null,
        "capture_date": "2022-03-22 08:40:53.133133",
        "source_id": 1172,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Zookies",
        "artist_name": "8ruki",
        "video_id": null,
        "capture_date": "2022-03-22 08:40:53.133133",
        "source_id": 1172,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Vocoder",
        "artist_name": "Floating Points",
        "video_id": null,
        "capture_date": "2022-03-22 08:40:53.133133",
        "source_id": 1172,
        "song_id": 11819,
        "duplicate": true
    },
    {
        "title": "History Solved",
        "artist_name": "La Neve",
        "video_id": null,
        "capture_date": "2022-03-22 08:40:53.133133",
        "source_id": 1172,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "aero3",
        "artist_name": "seiji oda",
        "video_id": null,
        "capture_date": "2022-03-22 08:40:53.133133",
        "source_id": 1172,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cherry Forest",
        "artist_name": "Lucky Daye",
        "video_id": null,
        "capture_date": "2022-03-22 08:40:53.133133",
        "source_id": 1172,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Freaky",
        "artist_name": "Lolingo x Elf",
        "video_id": null,
        "capture_date": "2022-03-22 08:40:53.133133",
        "source_id": 1172,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Last Laugh",
        "artist_name": "Angelnumber 8",
        "video_id": null,
        "capture_date": "2022-03-22 08:40:53.133133",
        "source_id": 1172,
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
  ('Intro', 'Orion Sun', NULL),
  ('Part of Me', 'Nia Archives', NULL),
  ('Zookies', '8ruki', NULL),
  ('History Solved', 'La Neve', NULL),
  ('aero3', 'seiji oda', NULL),
  ('Cherry Forest', 'Lucky Daye', NULL),
  ('Freaky', 'Lolingo x Elf', NULL),
  ('Last Laugh', 'Angelnumber 8', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11885; // SELECT last_insert_rowid();

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
  ('2022-03-22 08:40:53.131131', '1172', '11809'),
  ('2022-03-22 08:40:53.132132', '1172', '11878'),
  ('2022-03-22 08:40:53.133133', '1172', '11879'),
  ('2022-03-22 08:40:53.133133', '1172', '11880'),
  ('2022-03-22 08:40:53.133133', '1172', '11819'),
  ('2022-03-22 08:40:53.133133', '1172', '11881'),
  ('2022-03-22 08:40:53.133133', '1172', '11882'),
  ('2022-03-22 08:40:53.133133', '1172', '11883'),
  ('2022-03-22 08:40:53.133133', '1172', '11884'),
  ('2022-03-22 08:40:53.133133', '1172', '11885')
  ;

  // Update to source_song table
