//
// Step 0: Check recent scraped
//

  SELECT instance_name FROM source WHERE parent_entity = 'Billboard' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: Scrape source data
//

  // Add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // Get and format publicationDate
  pubDateUpper = document.getElementsByClassName('c-tagline  a-font-primary-medium-xs u-font-size-11@mobile-max u-letter-spacing-0106 u-letter-spacing-0089@mobile-max lrv-u-line-height-copy lrv-u-text-transform-uppercase lrv-u-margin-a-00 lrv-u-padding-l-075 lrv-u-padding-l-00@mobile-max')[0].innerText.trim();
  pubDateLower = pubDateUpper.toLowerCase();
  publicationDate = pubDateLower.charAt(0).toUpperCase() + pubDateLower.slice(1, 8) + pubDateLower.charAt(8).toUpperCase() + pubDateLower.slice(9);

  publicationDateFormatted = moment(publicationDate.slice(8), "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // Get location and format for current or past chart status
  currentChartLocation = window.location.href + moment(publicationDate.slice(8), "MMM DD, YYYY").format("YYYY-MM-DD");
  pastChartLocation = window.location.href;

  // Build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Billboard\', \'The Hot 100\', \'"
    + publicationDate + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + pastChartLocation + "\');" // use pastChartLocation if not the current week's chart, otherwise use currentChartLocation
  );


  // Stage the SQL statement
  // Replace any ' in strings with ’

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Billboard', 'The Hot 100', 'Week of May 21, 2022', '2022-05-21 12:00:00.000000', 'https://www.billboard.com/charts/hot-100/2022-05-21/');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 1208; // SELECT last_insert_rowid();
  song_id = null;

  // elements = document.getElementsByClassName('chart-list__element display--flex');
  elements = document.getElementsByClassName('o-chart-results-list-row-container');


  songsData = [];

  // if this returns empty songsData[], make sure responsive sizing is for browser, not tablet, etc.
  for (var i=1; i<elements.length; i++){ // does not include the No. 1 song.
      element = elements[i];

      isNew = element.getElementsByClassName('c-label  u-width-40 a-font-primary-bold-xxs lrv-u-color-grey-darkest u-background-color-yellow lrv-u-text-align-center');

      songName = element.getElementsByClassName('c-title  a-no-trucate a-font-primary-bold-s u-letter-spacing-0021 lrv-u-font-size-18@tablet lrv-u-font-size-16 u-line-height-125 u-line-height-normal@mobile-max a-truncate-ellipsis u-max-width-330 u-max-width-230@tablet-only')[0];
      artistName = element.getElementsByClassName('c-label  a-no-trucate a-font-primary-s lrv-u-font-size-14@mobile-max u-line-height-normal@mobile-max u-letter-spacing-0021 lrv-u-display-block a-truncate-ellipsis-2line u-max-width-330 u-max-width-230@tablet-only')[0];

      title = songName.innerText.trim();
      artist_name = artistName.innerText.trim();
      video_id = null;
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

      if(isNew.length == 1 && isNew[0].innerText == "NEW"){

        songsData.push(songData);

      };
  };

  console.log(JSON.stringify(songsData, null, 4));


//
// Step 3:  Stage songsData,
//          prune unwanted songs,
//          find & set any duplicate songs to true,
//          add song_ids for duplicates,
//          find and replace "Featur~ing" with "ft."
//

  songsData =
  [
    {
        "title": "Moscow Mule",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.783783",
        "source_id": 1208,
        "song_id": 12153,
        "duplicate": true
    },
    {
        "title": "Titi Me Pregunto",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.783783",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Despues de La Playa",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.784784",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Me Porto Bonito",
        "artist_name": "Bad Bunny & Chencho Corleone",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.784784",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Thought You Should Know",
        "artist_name": "Morgan Wallen",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.784784",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Party",
        "artist_name": "Bad Bunny & Rauw Alejandro",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.784784",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "The Heart Part 5",
        "artist_name": "Kendrick Lamar",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.784784",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Un Ratito",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.784784",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Tarot",
        "artist_name": "Bad Bunny & Jhay Cortez",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.784784",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dua Lipa",
        "artist_name": "Jack Harlow",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.784784",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Yo No Soy Celoso",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.785785",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Churchill Downs",
        "artist_name": "Jack Harlow ft. Drake",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.785785",
        "source_id": 1208,
        "song_id": 12152,
        "duplicate": true
    },
    {
        "title": "Ojitos Lindos",
        "artist_name": "Bad Bunny & Bomba Estereo",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.785785",
        "source_id": 1208,
        "song_id": 12161,
        "duplicate": true
    },
    {
        "title": "Neverita",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.785785",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "La Corriente",
        "artist_name": "Bad Bunny & Tony Dize",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.785785",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Efecto",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.785785",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Aguacero",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.785785",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Dos Mil 16",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.785785",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Otro Atardecer",
        "artist_name": "Bad Bunny & The Marias",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.786786",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "This Love (Taylor's Version)",
        "artist_name": "Taylor Swift",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.786786",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Andrea",
        "artist_name": "Bad Bunny & Buscabulla",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.786786",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "El Apagon",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.786786",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Un Verano Sin Ti",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.786786",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Un Coco",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.786786",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Me Fui de Vacaciones",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.786786",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Ensename A Bailar",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.786786",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Agosto",
        "artist_name": "Bad Bunny",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.786786",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hold My Hand",
        "artist_name": "Lady Gaga",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.787787",
        "source_id": 1208,
        "song_id": 12144,
        "duplicate": true
    },
    {
        "title": "Whiskey On You",
        "artist_name": "Nate Smith",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.787787",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "I'd Do Anything To Make You Smile",
        "artist_name": "Jack Harlow",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.787787",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Young Harleezy",
        "artist_name": "Jack Harlow",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.787787",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Poison",
        "artist_name": "Jack Harlow ft. Lil Wayne",
        "video_id": null,
        "capture_date": "2022-05-29 05:14:07.787787",
        "source_id": 1208,
        "song_id": null,
        "duplicate": false
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
  ('Titi Me Pregunto', 'Bad Bunny', NULL),
  ('Despues de La Playa', 'Bad Bunny', NULL),
  ('Me Porto Bonito', 'Bad Bunny & Chencho Corleone', NULL),
  ('Thought You Should Know', 'Morgan Wallen', NULL),
  ('Party', 'Bad Bunny & Rauw Alejandro', NULL),
  ('The Heart Part 5', 'Kendrick Lamar', NULL),
  ('Un Ratito', 'Bad Bunny', NULL),
  ('Tarot', 'Bad Bunny & Jhay Cortez', NULL),
  ('Dua Lipa', 'Jack Harlow', NULL),
  ('Yo No Soy Celoso', 'Bad Bunny', NULL),
  ('Neverita', 'Bad Bunny', NULL),
  ('La Corriente', 'Bad Bunny & Tony Dize', NULL),
  ('Efecto', 'Bad Bunny', NULL),
  ('Aguacero', 'Bad Bunny', NULL),
  ('Dos Mil 16', 'Bad Bunny', NULL),
  ('Otro Atardecer', 'Bad Bunny & The Marias', NULL),
  ('This Love (Taylor’s Version)', 'Taylor Swift', NULL),
  ('Andrea', 'Bad Bunny & Buscabulla', NULL),
  ('El Apagon', 'Bad Bunny', NULL),
  ('Un Verano Sin Ti', 'Bad Bunny', NULL),
  ('Un Coco', 'Bad Bunny', NULL),
  ('Me Fui de Vacaciones', 'Bad Bunny', NULL),
  ('Ensename A Bailar', 'Bad Bunny', NULL),
  ('Agosto', 'Bad Bunny', NULL),
  ('Whiskey On You', 'Nate Smith', NULL),
  ('I’d Do Anything To Make You Smile', 'Jack Harlow', NULL),
  ('Young Harleezy', 'Jack Harlow', NULL),
  ('Poison', 'Jack Harlow ft. Lil Wayne', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 12198; // SELECT last_insert_rowid();

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
  ('2022-05-29 05:14:07.783783', '1208', '12153'),
  ('2022-05-29 05:14:07.783783', '1208', '12171'),
  ('2022-05-29 05:14:07.784784', '1208', '12172'),
  ('2022-05-29 05:14:07.784784', '1208', '12173'),
  ('2022-05-29 05:14:07.784784', '1208', '12174'),
  ('2022-05-29 05:14:07.784784', '1208', '12175'),
  ('2022-05-29 05:14:07.784784', '1208', '12176'),
  ('2022-05-29 05:14:07.784784', '1208', '12177'),
  ('2022-05-29 05:14:07.784784', '1208', '12178'),
  ('2022-05-29 05:14:07.784784', '1208', '12179'),
  ('2022-05-29 05:14:07.785785', '1208', '12180'),
  ('2022-05-29 05:14:07.785785', '1208', '12152'),
  ('2022-05-29 05:14:07.785785', '1208', '12161'),
  ('2022-05-29 05:14:07.785785', '1208', '12181'),
  ('2022-05-29 05:14:07.785785', '1208', '12182'),
  ('2022-05-29 05:14:07.785785', '1208', '12183'),
  ('2022-05-29 05:14:07.785785', '1208', '12184'),
  ('2022-05-29 05:14:07.785785', '1208', '12185'),
  ('2022-05-29 05:14:07.786786', '1208', '12186'),
  ('2022-05-29 05:14:07.786786', '1208', '12187'),
  ('2022-05-29 05:14:07.786786', '1208', '12188'),
  ('2022-05-29 05:14:07.786786', '1208', '12189'),
  ('2022-05-29 05:14:07.786786', '1208', '12190'),
  ('2022-05-29 05:14:07.786786', '1208', '12191'),
  ('2022-05-29 05:14:07.786786', '1208', '12192'),
  ('2022-05-29 05:14:07.786786', '1208', '12193'),
  ('2022-05-29 05:14:07.786786', '1208', '12194'),
  ('2022-05-29 05:14:07.787787', '1208', '12144'),
  ('2022-05-29 05:14:07.787787', '1208', '12195'),
  ('2022-05-29 05:14:07.787787', '1208', '12196'),
  ('2022-05-29 05:14:07.787787', '1208', '12197'),
  ('2022-05-29 05:14:07.787787', '1208', '12198')
  ;

  // Update to source_song table
