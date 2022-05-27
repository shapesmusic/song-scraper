// Scroll to the bottom of the page first, so all the lazyload stuff loads.

// NOTE: sometimes two songs are grouped as one entry. This would potentially mess up `video_id` scraping.


//
// Step 0: Check recent scraped
//

  SELECT publication_date, instance_name FROM source WHERE parent_entity = 'New York Times' ORDER BY publication_date DESC LIMIT 3;


//
// Step 1: Scrape source data
//

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format source data
  title = document.getElementsByTagName("h1")[0].innerText;
  instanceName = title.match(/[^:]+$/)[0].trim();
  publicationDate = document.getElementsByTagName("time")[0].dateTime;
  publicationDateFormatted = moment(publicationDate).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format
  chartLocation = window.location.href;

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'New York Times\', "
    + "\'The Playlist\', "
    + "\'" + instanceName + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + chartLocation + "\');"
  );

  // Stage the SQL statement
  // Replace any ' in strings with ’
  // Make sure the publication_date matches the URL's date

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('New York Times', 'The Playlist', 'Camila Cabello Gets in Her Head, and 16 More New Songs', '2022-04-08 09:15:03.000000', 'https://www.nytimes.com/2022/04/08/arts/music/camila-cabello-pink-floyd-playlist.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1184; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("css-1bxm55 eoo0vm40"); // this class changes periodically

  songsData = [];

  for (var i=0; i<elements.length; i++){

    merged = elements[i].innerText;
    title = merged.match(/, ‘(.*?)’$/)[1] // $ gives you the last apostrophe, so it doesn't cut off words like "ain't, etc."
    // if this throws an error, enter `merged` to see the problem song.
    artist_name = merged.match(/.+?(?=, ‘)/)[0];
    video_id = null;
    capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    // vidUrl = document.getElementsByClassName("css-1u3pw94")[i].innerHTML;
    // videoId = vidUrl.match(/embed\/([^"]{0,})/)[1];

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
//          preview chart and prune songs (add video_id later),
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//          find and replace "featur~ing" with "ft."
//

  songsData =
  [
    {
        "title": "Psychofreak",
        "artist_name": "Camila Cabello featuring Willow",
        "video_id": null,
        "capture_date": "2022-05-27 06:45:23.057057",
        "source_id": 1184,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Actin’ Up",
        "artist_name": "Miranda Lambert",
        "video_id": null,
        "capture_date": "2022-05-27 06:45:23.101101",
        "source_id": 1184,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Heartfirst",
        "artist_name": "Kelsea Ballerini",
        "video_id": null,
        "capture_date": "2022-05-27 06:45:23.101101",
        "source_id": 1184,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Meteorite",
        "artist_name": "Banks",
        "video_id": null,
        "capture_date": "2022-05-27 06:45:23.101101",
        "source_id": 1184,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Vente Pa Aca",
        "artist_name": "Pieri",
        "video_id": null,
        "capture_date": "2022-05-27 06:45:23.101101",
        "source_id": 1184,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fast Car",
        "artist_name": "Syd",
        "video_id": null,
        "capture_date": "2022-05-27 06:45:23.101101",
        "source_id": 1184,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Fruit",
        "artist_name": "Oliver Sim",
        "video_id": null,
        "capture_date": "2022-05-27 06:45:23.101101",
        "source_id": 1184,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Red Bird Pt. 2 (Morning)",
        "artist_name": "Florist",
        "video_id": null,
        "capture_date": "2022-05-27 06:45:23.101101",
        "source_id": 1184,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Unpeopled Space",
        "artist_name": "Daniel Rossen",
        "video_id": null,
        "capture_date": "2022-05-27 06:45:23.101101",
        "source_id": 1184,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hey, Hey Rise Up",
        "artist_name": "Pink Floyd featuring Andriy Khlyvnyuk of Boombox",
        "video_id": null,
        "capture_date": "2022-05-27 06:45:23.101101",
        "source_id": 1184,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Gotta Let It Go",
        "artist_name": "Joyce Manor",
        "video_id": null,
        "capture_date": "2022-05-27 06:45:23.101101",
        "source_id": 1184,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Máquina de Dinero",
        "artist_name": "El Alfa, Braulio Fogón, French Montana and Kaly Ocho",
        "video_id": null,
        "capture_date": "2022-05-27 06:45:23.101101",
        "source_id": 1184,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "City of Gods (Part II)",
        "artist_name": "Alicia Keys",
        "video_id": null,
        "capture_date": "2022-05-27 06:45:23.101101",
        "source_id": 1184,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Golden Air",
        "artist_name": "Sun’s Signature",
        "video_id": null,
        "capture_date": "2022-05-27 06:45:23.101101",
        "source_id": 1184,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Sunshower",
        "artist_name": "S. Carey",
        "video_id": null,
        "capture_date": "2022-05-27 06:45:23.102102",
        "source_id": 1184,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Something Real",
        "artist_name": "Sam Gendel and Antonia Cytrynowicz",
        "video_id": null,
        "capture_date": "2022-05-27 06:45:23.102102",
        "source_id": 1184,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "For the Love of Fire and Water: II.",
        "artist_name": "Myra Melford’s Fire and Water Quintet",
        "video_id": null,
        "capture_date": "2022-05-27 06:45:23.102102",
        "source_id": 1184,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%AP%'
    AND artist_name LIKE '%Pop Smoke%'
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
  ('Psychofreak', 'Camila Cabello featuring Willow', NULL),
  ('Actin’ Up', 'Miranda Lambert', NULL),
  ('Heartfirst', 'Kelsea Ballerini', NULL),
  ('Meteorite', 'Banks', NULL),
  ('Vente Pa Aca', 'Pieri', NULL),
  ('Fast Car', 'Syd', NULL),
  ('Fruit', 'Oliver Sim', NULL),
  ('Red Bird Pt. 2 (Morning)', 'Florist', NULL),
  ('Unpeopled Space', 'Daniel Rossen', NULL),
  ('Hey, Hey Rise Up', 'Pink Floyd featuring Andriy Khlyvnyuk of Boombox', NULL),
  ('Gotta Let It Go', 'Joyce Manor', NULL),
  ('Máquina de Dinero', 'El Alfa, Braulio Fogón, French Montana and Kaly Ocho', NULL),
  ('City of Gods (Part II)', 'Alicia Keys', NULL),
  ('Golden Air', 'Sun’s Signature', NULL),
  ('Sunshower', 'S. Carey', NULL),
  ('Something Real', 'Sam Gendel and Antonia Cytrynowicz', NULL),
  ('For the Love of Fire and Water: II.', 'Myra Melford’s Fire and Water Quintet', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 11991; // SELECT last_insert_rowid();

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
  ('2022-05-27 06:45:23.057057', '1184', '11975'),
  ('2022-05-27 06:45:23.101101', '1184', '11976'),
  ('2022-05-27 06:45:23.101101', '1184', '11977'),
  ('2022-05-27 06:45:23.101101', '1184', '11978'),
  ('2022-05-27 06:45:23.101101', '1184', '11979'),
  ('2022-05-27 06:45:23.101101', '1184', '11980'),
  ('2022-05-27 06:45:23.101101', '1184', '11981'),
  ('2022-05-27 06:45:23.101101', '1184', '11982'),
  ('2022-05-27 06:45:23.101101', '1184', '11983'),
  ('2022-05-27 06:45:23.101101', '1184', '11984'),
  ('2022-05-27 06:45:23.101101', '1184', '11985'),
  ('2022-05-27 06:45:23.101101', '1184', '11986'),
  ('2022-05-27 06:45:23.101101', '1184', '11987'),
  ('2022-05-27 06:45:23.101101', '1184', '11988'),
  ('2022-05-27 06:45:23.102102', '1184', '11989'),
  ('2022-05-27 06:45:23.102102', '1184', '11990'),
  ('2022-05-27 06:45:23.102102', '1184', '11991')
  ;

  // Update to source_song table
