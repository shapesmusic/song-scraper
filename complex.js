// Scroll to the bottom of the page first, so all the React stuff loads
// Always check the last song name to make sure everything got scraped

//
// Step 0: Check most recent source scraped
//

SELECT instance_name, publication_date FROM source WHERE parent_entity = 'Complex' ORDER BY publication_date DESC LIMIT 8;


//
// Step 1: get source data
//

  chartTitle = document.getElementsByClassName("story-title story-title__article")[0].innerText;
  parentStream = chartTitle.match(/.+?(?=:)/)[0];
  instanceName = chartTitle.match(/[^:]+$/)[0].trim();

  // add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // get and format publicationDate
  publicationDate = document.getElementsByClassName("info-row__datetime")[0].innerHTML.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

  // get and format location
  chartLocation = window.location.href; // "location" is a reserved word

  // build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source \n  (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "\nVALUES \n  (\'Complex\', "
    + "\'" + parentStream + "\', "
    + "\'" + instanceName + "\', "
    + "\'" + publicationDateFormatted + "\', "
    + "\'" + chartLocation + "\');"
  );

//
// Step 2: get songs data
//

  source_id = 727 // SELECT last_insert_rowid();

  elements = document.getElementsByClassName("article-list");
  element = elements[0].getElementsByTagName("h2"); // sometimes h2 or h3
  videoUrl = document.getElementsByClassName("video-lazyload");

  songs = [];

  for (var i=0; i<element.length; i++){
    title = element[i].innerText.match(/, “(.*?)”/)[1]; // may need " or “” type quotation marks, or a comma after the artist name, or may have an &nbsp; instead of a space
    artist_name = element[i].innerText.match(/.+?(?=, “)/)[0]; // may need " or “ type quotation marks
    video_id = videoUrl[i].style.backgroundImage.match(/(?<=vi\/)(.*)(?=\/)/)[0]; // example: url("https://i.ytimg.com/vi/gejbbL1AaJk/hqdefault.jpg")

    capture_date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss.SSSSSS"); // sqlite time format

    song = String(
      "(\'" + capture_date + "\', "
      + source_id + ", "
      + "\'" + title + "\', "
      + "\'" + artist_name + "\', "
      + "\'" + video_id + "\')"
    );

    songs.push(song);

  };

  console.log(String(songs));

//
// Step 3: paste final statements below:
//

INSERT INTO source
  (parent_entity, parent_stream, instance_name, publication_date, location)
VALUES
  ('Complex', 'Best New Music This Week', '21 Savage, Metro Boomin, Megan Thee Stallion, Bryson Tiller, and More', '2020-10-02 12:00:00.000000', 'https://www.complex.com/music/2020/10/best-new-music-this-week-october-2/21-savage-metro-boomin-runnin');

INSERT INTO song
  (capture_date, source_id, title, artist_name, video_id)
VALUES
  ('2020-10-07 03:23:06.957957', 727, 'Runnin', '21 Savage & Metro Boomin', 'jbdROU6eJVg'),('2020-10-07 03:23:06.959959', 727, 'Don’t Stop', 'Megan Thee Stallion f/ Young Thug', '6iuwBio5EUA'),('2020-10-07 03:23:06.959959', 727, 'Outta Time', 'Bryson Tiller f/ Drake', 'FtaW6YMAafk'),('2020-10-07 03:23:06.959959', 727, 'Chocolate Pomegranate', 'Ari Lennox', '0mImzqbi3Qw'),('2020-10-07 03:23:06.959959', 727, 'Big ASAP', 'ASAP Ferg f/ Monica', 'r4xdnCXnRf8'),('2020-10-07 03:23:06.959959', 727, 'All Praises', 'Westside Gunn f/ Boldly James & Jadakiss', 'l3lrYoDU38o'),('2020-10-07 03:23:06.959959', 727, 'Bop It', 'Fivio Foreign f/ Polo G', 'xv10VQcExsw'),('2020-10-07 03:23:06.959959', 727, 'Jealous', 'YG', '2RD_cKtbcfE'),('2020-10-07 03:23:06.959959', 727, 'Bet You Wanna', 'Blackpink f/ Cardi B', 'gXBdvSj9F2I'),('2020-10-07 03:23:06.960960', 727, 'Training Day', 'Dougie F', '4ojvTFUpBes'),('2020-10-07 03:23:06.960960', 727, 'Come Over', 'Jorja Smith f/ Popcaan', 'T9_vgJUylyQ')
;
