// Scroll to the bottom of the page first, so all the React stuff loads.
// FIXME: sometimes two songs are grouped as one entry. this messes up vIDs.

//
// Step 0: Check most recent scraped
//

SELECT instance_name, publication_date FROM source WHERE parent_entity = 'New York Times' ORDER BY publication_date DESC LIMIT 8;

//
// Step 1: get source data
//

  // add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // get and format source data
  title = document.getElementsByTagName("h1")[0].innerText;
  instanceName = title.match(/[^:]+$/)[0].trim();
  publicationDate = document.getElementsByTagName("time")[0].dateTime;
  publicationDateFormatted = moment(publicationDate).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format
  chartLocation = window.location.href;

  // build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'New York Times\', "
    + "\'The Playlist\', "
    + "\'" + instanceName + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + chartLocation + "\');"
  );

//
// Step 2: get songs data
//

  source_id = 734; // SELECT last_insert_rowid();

  songs = [];

  elements = document.getElementsByClassName("css-ow6j0y eoo0vm40"); // this class changes periodically
  for (var i=0; i<elements.length; i++){

    merged = elements[i].innerText;
    title = merged.match(/, ‘(.*?)’$/)[1] // $ gives you the last apostrophe, so it doesn't cut off words like "ain't, etc."
    // if this throws an error, enter `merged` to see the problem song.
    artist_name = merged.match(/.+?(?=, ‘)/)[0];
    capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    // vidUrl = document.getElementsByClassName("css-1u3pw94")[i].innerHTML;
    // videoId = vidUrl.match(/embed\/([^"]{0,})/)[1];

    song = String(
      "\n(\'" + capture_date + "\', "
      + source_id + ", "
      + "\'" + title + "\', "
      + "\'" + artist_name + "\', "
      + "\'\')"
    );

    songs.push(song);

  };

  console.log(String(songs));

  // Add videoIds manually & prune songs

//
// Step 3: paste final statements below:
//

INSERT INTO source
  (parent_entity, parent_stream, instance_name, publication_date, location)
VALUES
  ('New York Times', 'The Playlist', 'Stevie Wonder Demands Justice, and 12 More New Songs', '2020-10-16 08:59:34.000000', 'https://www.nytimes.com/2020/10/16/arts/music/playlist-stevie-wonder-demi-lovato.html');


INSERT INTO song
  (capture_date, source_id, title, artist_name, video_id)
VALUES
  ('2020-10-20 08:02:01.673673', 734, 'Can’t Put It in the Hands of Fate', 'Stevie Wonder featuring Rapsody, Cordae, Chika and Busta Rhymes', 'Kgdfxeh0WtE'),
  ('2020-10-20 08:02:01.674674', 734, 'American Landfill', 'Kristeen Young featuring David Bowie', 'd7_DEdmYLFI'),
  ('2020-10-20 08:02:01.674674', 734, 'Commander in Chief', 'Demi Lovato', 'n9Y-lS1trhw'),
  ('2020-10-20 08:02:01.674674', 734, 'Let Me Love You Like a Woman', 'Lana Del Rey', 'd-Uvy-aKoao'),
  ('2020-10-20 08:02:01.674674', 734, 'Before', 'James Blake', 'xbUvNFUrkpc'),
  ('2020-10-20 08:02:01.674674', 734, 'Chismiten', 'Mdou Moctar', 'y23ewhFf_hs'),
  ('2020-10-20 08:02:01.674674', 734, 'Free Your Mind', 'Made Kuti', 'wyoAbMANuyc'),
  ('2020-10-20 08:02:01.674674', 734, 'Love’s Refrain', 'Julie Byrne & Jefre Cantu-Ledesma', '07d_coPy7Ws'),
  ('2020-10-20 08:02:01.674674', 734, 'Robber', 'The Weather Station', 'OJ9SYLVaIUI'),
  ('2020-10-20 08:02:01.675675', 734, 'Lonely', 'Justin Bieber and Benny Blanco', 'xQOO2xGQ1Pc'),
  ('2020-10-20 08:02:01.675675', 734, 'Alone', 'Bonzie', 'qpMPDUL3nkg')
;
