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

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('New York Times', 'The Playlist', 'Mitski’s Sharp Take on a Creative Life, and 12 More New Songs', '2021-10-08 12:29:07.000000', 'https://www.nytimes.com/2021/10/08/arts/music/playlist-mitski-arca-bad-bunny.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 976; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName("css-ow6j0y eoo0vm40"); // this class changes periodically

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
//          find and replace "Featured" with "ft."
//

  songsData =
  [
      {
          "title": "Working for the Knife",
          "artist_name": "Mitski",
          "video_id": null,
          "capture_date": "2021-10-12 10:34:10.989989",
          "source_id": 976,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Born Yesterday",
          "artist_name": "Arca ft. Sia",
          "video_id": null,
          "capture_date": "2021-10-12 10:34:10.990990",
          "source_id": 976,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Lo Siento BB:/",
          "artist_name": "Tainy with Bad Bunny and Julieta Venegas",
          "video_id": null,
          "capture_date": "2021-10-12 10:34:10.990990",
          "source_id": 976,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Shine",
          "artist_name": "Robert Glasper ft. D Smoke & Tiffany Gouché",
          "video_id": null,
          "capture_date": "2021-10-12 10:34:10.990990",
          "source_id": 976,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Mental Anguish",
          "artist_name": "glaive and ericdoa",
          "video_id": null,
          "capture_date": "2021-10-12 10:34:10.990990",
          "source_id": 976,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Coming Back",
          "artist_name": "James Blake ft. SZA",
          "video_id": null,
          "capture_date": "2021-10-12 10:34:10.990990",
          "source_id": 976,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Red Eye",
          "artist_name": "Justin Bieber ft. TroyBoi",
          "video_id": null,
          "capture_date": "2021-10-12 10:34:10.991991",
          "source_id": 976,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Ateo",
          "artist_name": "C. Tangana and Nathy Peluso",
          "video_id": null,
          "capture_date": "2021-10-12 10:34:10.991991",
          "source_id": 976,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Midnight Snacks",
          "artist_name": "Kelis",
          "video_id": null,
          "capture_date": "2021-10-12 10:34:10.991991",
          "source_id": 976,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Estos Días",
          "artist_name": "Tambino",
          "video_id": null,
          "capture_date": "2021-10-12 10:34:10.991991",
          "source_id": 976,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Negra del Alma",
          "artist_name": "Susana Baca",
          "video_id": null,
          "capture_date": "2021-10-12 10:34:10.991991",
          "source_id": 976,
          "song_id": 10982,
          "duplicate": true
      },
      {
          "title": "Morning Spring",
          "artist_name": "Suzanne Ciani",
          "video_id": null,
          "capture_date": "2021-10-12 10:34:10.991991",
          "source_id": 976,
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
  ('Working for the Knife', 'Mitski', NULL),
  ('Born Yesterday', 'Arca ft. Sia', NULL),
  ('Lo Siento BB:/', 'Tainy with Bad Bunny and Julieta Venegas', NULL),
  ('Shine', 'Robert Glasper ft. D Smoke & Tiffany Gouché', NULL),
  ('Mental Anguish', 'glaive and ericdoa', NULL),
  ('Coming Back', 'James Blake ft. SZA', NULL),
  ('Red Eye', 'Justin Bieber ft. TroyBoi', NULL),
  ('Ateo', 'C. Tangana and Nathy Peluso', NULL),
  ('Midnight Snacks', 'Kelis', NULL),
  ('Estos Días', 'Tambino', NULL),
  ('Morning Spring', 'Suzanne Ciani', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10998; // SELECT last_insert_rowid();

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
  ('2021-10-12 10:34:10.989989', '976', '10988'),
  ('2021-10-12 10:34:10.990990', '976', '10989'),
  ('2021-10-12 10:34:10.990990', '976', '10990'),
  ('2021-10-12 10:34:10.990990', '976', '10991'),
  ('2021-10-12 10:34:10.990990', '976', '10992'),
  ('2021-10-12 10:34:10.990990', '976', '10993'),
  ('2021-10-12 10:34:10.991991', '976', '10994'),
  ('2021-10-12 10:34:10.991991', '976', '10995'),
  ('2021-10-12 10:34:10.991991', '976', '10996'),
  ('2021-10-12 10:34:10.991991', '976', '10997'),
  ('2021-10-12 10:34:10.991991', '976', '10982'),
  ('2021-10-12 10:34:10.991991', '976', '10998')
  ;

  // Update to source_song table
