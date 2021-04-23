//
// Step 0: Check recent scraped
//

  SELECT parent_stream, instance_name FROM source WHERE parent_entity = 'YouTube' ORDER BY publication_date DESC LIMIT 8;

//
// Step 1: Scrape source data
//

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format publicationDate
  publicationDate = document.getElementsByClassName('style-scope ytmc-dropdown iron-selected')[1].ariaLabel.match(/(?<=–)[^–]*/)[0].trim()
  weekBeginDate = moment(publicationDate).subtract(6, "days");

  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // SQLite time format

  // Get location and format for current or past chart status
  currentChartLocation = window.location.href
    + "/"
    + moment(weekBeginDate, "MMM DD, YYYY").format("YYYYMMDD")
    + "-"
    + moment(publicationDate, "MMM DD, YYYY").format("YYYYMMDD");

pastChartLocation = window.location.href;

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'YouTube\', \'Global Top Songs\', \'Week of " // Change instance_name 'Global Top Songs' if scraping a different YT chart
    + publicationDate + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + currentChartLocation + "\');" // use pastChartLocation if not the current week's chart, otherwise use currentChartLocation
  )


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('YouTube', 'Global Top Songs', 'Week of Apr 8, 2021', '2021-04-08 12:00:00.000000', 'https://charts.youtube.com/charts/TopSongs/global/20210402-20210408');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 886; // SELECT last_insert_rowid();
  song_id = null;

  elements = document.getElementsByClassName('chart-table-row style-scope ytmc-chart-table');

  songsData = [];

  for (var i=0; i<elements.length; i++){
      element = elements[i];

      isNew = element.getElementsByClassName("style-scope ytmc-chart-table")[0].getElementsByClassName("style-scope ytmc-chart-table")[4].getElementsByClassName("style-scope ytmc-chart-table")[2].innerText

      title = element.getElementsByClassName("ytmc-ellipsis-text style-scope")[0].innerText.trim();
      artist_name = element.getElementsByClassName("ytmc-artist-name style-scope ytmc-artists-list")[0].innerText.trim();
      video_id = null;
      capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format
      duplicate = false;

      songData = {
        // 'element': i,
        'title' : title,
        'artist_name' : artist_name,
        'video_id' : video_id,
        'capture_date' : capture_date,
        'source_id' : source_id,
        'song_id' : song_id,
        'duplicate' : duplicate
      };

      if(isNew == "--"){

        songsData.push(songData);
        console.log(i);

      };
  };

  JSON.stringify(songsData, null, 4);


//
// Step 3:  Stage songsData,
//          move any artists out of titles,
//          prune unwanted songs,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "deja vu",
        "artist_name": "Olivia Rodrigo",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.032032",
        "source_id": 886,
        "song_id": 10142,
        "duplicate": true
    },
    {
        "title": "Pani Di Gal",
        "artist_name": "Maninder Buttar",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.033033",
        "source_id": 886,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Galat",
        "artist_name": "Asees Kaur",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.033033",
        "source_id": 886,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Lehja",
        "artist_name": "Abhi Dutt",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.034034",
        "source_id": 886,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "La Curiosidad",
        "artist_name": "Jay Wheeler",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.034034",
        "source_id": 886,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "CHỈ LÀ KHÔNG CÙNG NHAU (Live)",
        "artist_name": "Tăng Phúc feat. Trương Thảo Nhi",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.034034",
        "source_id": 886,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dancing With the Devil",
        "artist_name": "Demi Lovato",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.035035",
        "source_id": 886,
        "song_id": 10183,
        "duplicate": true
    },
    {
        "title": "Runaway",
        "artist_name": "AURORA",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.035035",
        "source_id": 886,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Nishaan",
        "artist_name": "Kaka",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.035035",
        "source_id": 886,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "WACHA",
        "artist_name": "KHEA",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.036036",
        "source_id": 886,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Новая Волна",
        "artist_name": "DJ Smash",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.036036",
        "source_id": 886,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Thoda Thoda Pyaar",
        "artist_name": "Stebin Ben",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.036036",
        "source_id": 886,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Talking to the Moon",
        "artist_name": "Bruno Mars",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.036036",
        "source_id": 886,
        "song_id": 10079,
        "duplicate": true
    },
    {
        "title": "El Efecto",
        "artist_name": "Rauw Alejandro",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.037037",
        "source_id": 886,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Calling My Phone",
        "artist_name": "Lil Tjay feat. 6LACK",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.037037",
        "source_id": 886,
        "song_id": 9786,
        "duplicate": true
    },
    {
        "title": "Vroum Vroum",
        "artist_name": "Moha K",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.037037",
        "source_id": 886,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "First Day Out (Beat Box)",
        "artist_name": "NLE Choppa",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.037037",
        "source_id": 886,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Bismillah Cinta",
        "artist_name": "Ungu, Lesti",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.038038",
        "source_id": 886,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Patoreakcja",
        "artist_name": "Mata",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.038038",
        "source_id": 886,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Somebody That I Used To Know",
        "artist_name": "Gotye",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.038038",
        "source_id": 886,
        "song_id": 5580,
        "duplicate": true
    },
    {
        "title": "Wellerman (Sea Shanty)",
        "artist_name": "Nathan Evans",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.038038",
        "source_id": 886,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Track Star",
        "artist_name": "Mooski",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.038038",
        "source_id": 886,
        "song_id": 9943,
        "duplicate": true
    },
    {
        "title": "Sweater Weather",
        "artist_name": "The Neighbourhood",
        "video_id": null,
        "capture_date": "2021-04-22 05:28:47.039039",
        "source_id": 886,
        "song_id": 4778,
        "duplicate": true
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Up%'
    AND artist_name LIKE '%Cardi%'
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
  ('Pani Di Gal', 'Maninder Buttar', NULL),
  ('Galat', 'Asees Kaur', NULL),
  ('Lehja', 'Abhi Dutt', NULL),
  ('La Curiosidad', 'Jay Wheeler', NULL),
  ('CHỈ LÀ KHÔNG CÙNG NHAU (Live)', 'Tăng Phúc feat. Trương Thảo Nhi', NULL),
  ('Runaway', 'AURORA', NULL),
  ('Nishaan', 'Kaka', NULL),
  ('WACHA', 'KHEA', NULL),
  ('Новая Волна', 'DJ Smash', NULL),
  ('Thoda Thoda Pyaar', 'Stebin Ben', NULL),
  ('El Efecto', 'Rauw Alejandro', NULL),
  ('Vroum Vroum', 'Moha K', NULL),
  ('First Day Out (Beat Box)', 'NLE Choppa', NULL),
  ('Bismillah Cinta', 'Ungu, Lesti', NULL),
  ('Patoreakcja', 'Mata', NULL),
  ('Wellerman (Sea Shanty)', 'Nathan Evans', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 10218; // SELECT last_insert_rowid();

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
  ('2021-04-22 05:28:47.032032', '886', '10142'),
  ('2021-04-22 05:28:47.033033', '886', '10203'),
  ('2021-04-22 05:28:47.033033', '886', '10204'),
  ('2021-04-22 05:28:47.034034', '886', '10205'),
  ('2021-04-22 05:28:47.034034', '886', '10206'),
  ('2021-04-22 05:28:47.034034', '886', '10207'),
  ('2021-04-22 05:28:47.035035', '886', '10183'),
  ('2021-04-22 05:28:47.035035', '886', '10208'),
  ('2021-04-22 05:28:47.035035', '886', '10209'),
  ('2021-04-22 05:28:47.036036', '886', '10210'),
  ('2021-04-22 05:28:47.036036', '886', '10211'),
  ('2021-04-22 05:28:47.036036', '886', '10212'),
  ('2021-04-22 05:28:47.036036', '886', '10079'),
  ('2021-04-22 05:28:47.037037', '886', '10213'),
  ('2021-04-22 05:28:47.037037', '886', '9786'),
  ('2021-04-22 05:28:47.037037', '886', '10214'),
  ('2021-04-22 05:28:47.037037', '886', '10215'),
  ('2021-04-22 05:28:47.038038', '886', '10216'),
  ('2021-04-22 05:28:47.038038', '886', '10217'),
  ('2021-04-22 05:28:47.038038', '886', '5580'),
  ('2021-04-22 05:28:47.038038', '886', '10218'),
  ('2021-04-22 05:28:47.038038', '886', '9943'),
  ('2021-04-22 05:28:47.039039', '886', '4778')
  ;

  // Update to source_song table
