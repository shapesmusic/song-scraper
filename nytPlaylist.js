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
    ('New York Times', 'The Playlist', 'A Rare Look at Bob Dylan in the Studio, and 13 More New Songs', '2021-09-21 09:04:44.000000', 'https://www.nytimes.com/2021/09/17/arts/music/playlist-bob-dylan-tems.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 973; // SELECT last_insert_rowid();
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
          "title": "Don’t Fall Apart on Me Tonight (Version 2)",
          "artist_name": "Bob Dylan",
          "video_id": null,
          "capture_date": "2021-10-12 10:14:59.612612",
          "source_id": 973,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "I Don’t Live Here Anymore",
          "artist_name": "The War on Drugs ft. Lucius",
          "video_id": null,
          "capture_date": "2021-10-12 10:14:59.613613",
          "source_id": 973,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Found",
          "artist_name": "Tems ft. Brent Faiyaz",
          "video_id": null,
          "capture_date": "2021-10-12 10:14:59.613613",
          "source_id": 973,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Never Wanted to Be That Girl",
          "artist_name": "Carly Pearce and Ashley McBryde",
          "video_id": null,
          "capture_date": "2021-10-12 10:14:59.613613",
          "source_id": 973,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Mean-Hearted Woman",
          "artist_name": "Adia Victoria",
          "video_id": null,
          "capture_date": "2021-10-12 10:14:59.613613",
          "source_id": 973,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Under the Sun",
          "artist_name": "Cuco",
          "video_id": null,
          "capture_date": "2021-10-12 10:14:59.613613",
          "source_id": 973,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Valentine",
          "artist_name": "Snail Mail",
          "video_id": null,
          "capture_date": "2021-10-12 10:14:59.613613",
          "source_id": 973,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Rogue Waves",
          "artist_name": "Moor Mother",
          "video_id": null,
          "capture_date": "2021-10-12 10:14:59.613613",
          "source_id": 973,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Tales From the Trash Stratum",
          "artist_name": "Oneohtrix Point Never and Elizabeth Fraser",
          "video_id": null,
          "capture_date": "2021-10-12 10:14:59.613613",
          "source_id": 973,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Sad Girlz Luv Money (Official Remix)",
          "artist_name": "Amaarae ft. Kali Uchis",
          "video_id": null,
          "capture_date": "2021-10-12 10:14:59.613613",
          "source_id": 973,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Swan Song",
          "artist_name": "Lindsey Buckingham",
          "video_id": null,
          "capture_date": "2021-10-12 10:14:59.614614",
          "source_id": 973,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "V12",
          "artist_name": "Iann Dior ft. Lil Uzi Vert",
          "video_id": null,
          "capture_date": "2021-10-12 10:14:59.614614",
          "source_id": 973,
          "song_id": null,
          "duplicate": false
      },
      {
          "title": "Chains",
          "artist_name": "Ouri",
          "video_id": null,
          "capture_date": "2021-10-12 10:14:59.614614",
          "source_id": 973,
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
  ('Don’t Fall Apart on Me Tonight (Version 2)', 'Bob Dylan', NULL),
  ('I Don’t Live Here Anymore', 'The War on Drugs ft. Lucius', NULL),
  ('Found', 'Tems ft. Brent Faiyaz', NULL),
  ('Never Wanted to Be That Girl', 'Carly Pearce and Ashley McBryde', NULL),
  ('Mean-Hearted Woman', 'Adia Victoria', NULL),
  ('Under the Sun', 'Cuco', NULL),
  ('Valentine', 'Snail Mail', NULL),
  ('Rogue Waves', 'Moor Mother', NULL),
  ('Tales From the Trash Stratum', 'Oneohtrix Point Never and Elizabeth Fraser', NULL),
  ('Sad Girlz Luv Money (Official Remix)', 'Amaarae ft. Kali Uchis', NULL),
  ('Swan Song', 'Lindsey Buckingham', NULL),
  ('V12', 'Iann Dior ft. Lil Uzi Vert', NULL),
  ('Chains', 'Ouri', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10966; // SELECT last_insert_rowid();

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
  ('2021-10-12 10:14:59.612612', '973', '10954'),
  ('2021-10-12 10:14:59.613613', '973', '10955'),
  ('2021-10-12 10:14:59.613613', '973', '10956'),
  ('2021-10-12 10:14:59.613613', '973', '10957'),
  ('2021-10-12 10:14:59.613613', '973', '10958'),
  ('2021-10-12 10:14:59.613613', '973', '10959'),
  ('2021-10-12 10:14:59.613613', '973', '10960'),
  ('2021-10-12 10:14:59.613613', '973', '10961'),
  ('2021-10-12 10:14:59.613613', '973', '10962'),
  ('2021-10-12 10:14:59.613613', '973', '10963'),
  ('2021-10-12 10:14:59.614614', '973', '10964'),
  ('2021-10-12 10:14:59.614614', '973', '10965'),
  ('2021-10-12 10:14:59.614614', '973', '10966')
  ;

  // Update to source_song table
