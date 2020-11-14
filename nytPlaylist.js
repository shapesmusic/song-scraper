// Scroll to the bottom of the page first, so all the lazyload stuff loads.

// NOTE: sometimes two songs are grouped as one entry. This would potentially mess up `video_id` scraping.


//
// Step 0: Check recent scraped
//

  SELECT instance_name, publication_date FROM source WHERE parent_entity = 'New York Times' ORDER BY publication_date DESC LIMIT 8;


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
    ('New York Times', 'The Playlist', 'Burna Boy’s Cry for Nigeria, and 9 More New Songs', '2020-11-08 06:53:46.000000', 'https://www.nytimes.com/2020/11/06/arts/music/playlist-burna-boy-weeknd-missy-elliott.html');

  // Update to source table


//
// Step 2: Scrape song data into an array
//

  source_id = 745; // SELECT last_insert_rowid();
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

  JSON.stringify(songsData, null, 4);


//
// Step 3: Stage songsData, preview chart and prune songs, find & set any duplicate songs to true, and add song_ids for duplicates
//

  songsData =
  [
    {
        "title": "20 10 20",
        "artist_name": "Burna Boy",
        "video_id": null,
        "capture_date": "2020-11-13 08:21:08.153153",
        "source_id": 745,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Hawái Remix",
        "artist_name": "Maluma and the Weeknd",
        "video_id": null,
        "capture_date": "2020-11-13 08:21:08.154154",
        "source_id": 745,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Headstart",
        "artist_name": "Jade Bird",
        "video_id": null,
        "capture_date": "2020-11-13 08:21:08.154154",
        "source_id": 745,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Cool Girl",
        "artist_name": "dodie",
        "video_id": null,
        "capture_date": "2020-11-13 08:21:08.155155",
        "source_id": 745,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Woven Song",
        "artist_name": "Ólafur Arnalds",
        "video_id": null,
        "capture_date": "2020-11-13 08:21:08.155155",
        "source_id": 745,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "April Ha Ha",
        "artist_name": "Nothing",
        "video_id": null,
        "capture_date": "2020-11-13 08:21:08.155155",
        "source_id": 745,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "Under Pressure",
        "artist_name": "Karen O and Willie Nelson",
        "video_id": null,
        "capture_date": "2020-11-13 08:21:08.155155",
        "source_id": 745,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "A Revival",
        "artist_name": "Michael Penn",
        "video_id": null,
        "capture_date": "2020-11-13 08:21:08.155155",
        "source_id": 745,
        "song_id": null,
        "duplicate": false
    },
    {
        "title": "ATM",
        "artist_name": "Bree Runway featuring Missy Elliott",
        "video_id": null,
        "capture_date": "2020-11-13 08:21:08.155155",
        "source_id": 745,
        "song_id": null,
        "duplicate": false
    }
]

  // Check each song for duplicates in the database
  SELECT id, title, artist_name FROM song WHERE
    title LIKE '%Stay Down%'
    AND artist_name LIKE '%durk%'
  ;

  // If duplicates:
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
    ('20 10 20', 'Burna Boy', NULL),
    ('Hawái Remix', 'Maluma and the Weeknd', NULL),
    ('Headstart', 'Jade Bird', NULL),
    ('Cool Girl', 'dodie', NULL),
    ('Wouldn’t It Be Loverly', 'Fred Hersch', NULL),
    ('Woven Song', 'Ólafur Arnalds', NULL),
    ('April Ha Ha', 'Nothing', NULL),
    ('Under Pressure', 'Karen O and Willie Nelson', NULL),
    ('A Revival', 'Michael Penn', NULL),
    ('ATM', 'Bree Runway featuring Missy Elliott', NULL)
  ;

   // Update to song table


 //
 // Step 5: Add new song_ids and update all songs to the source_song table.
 //

  // Get the last song_id inserted
  song_id = 9555; // SELECT last_insert_rowid();

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
    ('2020-11-13 08:21:08.153153', '745', '9546'),
    ('2020-11-13 08:21:08.154154', '745', '9547'),
    ('2020-11-13 08:21:08.154154', '745', '9548'),
    ('2020-11-13 08:21:08.155155', '745', '9549'),
    ('2020-11-13 08:21:08.155155', '745', '9550'),
    ('2020-11-13 08:21:08.155155', '745', '9551'),
    ('2020-11-13 08:21:08.155155', '745', '9552'),
    ('2020-11-13 08:21:08.155155', '745', '9553'),
    ('2020-11-13 08:21:08.155155', '745', '9554'),
    ('2020-11-13 08:21:08.155155', '745', '9555')
  ;

  // Update to source_song table
