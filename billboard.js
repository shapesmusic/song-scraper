//
// Step 0: check recent scraped
//

SELECT instance_name FROM source WHERE parent_entity = 'Billboard' ORDER BY publication_date DESC LIMIT 8;

//
// Step 1: get source data
//

  // add moment.js to the header (make sure scripts aren't blocked in the browser)
  momentjs = document.createElement("script");
  momentjs.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min.js";
  document.head.appendChild(momentjs);

  // get and format publicationDate
  publicationDate = document.getElementsByClassName('date-selector__button button--link')[0].innerText.trim();
  publicationDateFormatted = moment(publicationDate, "MMM DD, YYYY").format(); // to ISO

  // URL changes once current chart is archived
  currentChartLocation = window.location.href + "/" + moment(publicationDate, "MMM DD, YYYY").format("YYYY-MM-DD");
  pastChartLocation = window.location.href;

  // build the INSERT statement
  console.log(
    "INSERT INTO "
    + "source (parent_entity, parent_stream, instance_name, publication_date, location) "
    + "VALUES (\'Billboard\', \'The Hot 100\', \'Week of "
    + publicationDate + "\', \'"
    + publicationDateFormatted + "\', \'"
    + currentChartLocation + "\');"
  )

//
// Step 2: get songs data
//

  source_id = 726 // SELECT last_insert_rowid();

  elements = document.getElementsByClassName('chart-list__element display--flex');

  songs = [];

  for (var i=0; i<elements.length; i++){
      element = elements[i];
      isNew = element.getElementsByClassName('chart-element__trend chart-element__trend--new color--accent');
      songName = element.getElementsByClassName('chart-element__information__song text--truncate color--primary')[0];
      artistName = element.getElementsByClassName('chart-element__information__artist text--truncate color--secondary')[0];

      capture_date = moment(new Date()).format();
      title = songName.innerText.trim();
      artist_name = artistName.innerText.trim();
      video_id = ""; // excluding from SQL statement

      song = String(
        "(\'" + capture_date + "\', "
        + "\'" + source_id + "\', "
        + "\'" + title + "\', "
        + "\'" + artist_name + "\')"
      );

      if(isNew.length == 1 && isNew[0].innerText == "New"){ // because innerText can also be "Re-Enter"

        songs.push(song);

      };
  };

  console.log(songs);

  // Copy into songs.json (scratchpad)
  // remove all "

//
// Step 3: paste final statements below:
//

  INSERT INTO source
    (parent_entity, parent_stream, instance_name, publication_date, location)
  VALUES
    ('Billboard', 'The Hot 100', 'Week of October 10, 2020', '2020-10-10T00:00:00-07:00', 'https://www.billboard.com/charts/hot-100/2020-10-10');


  INSERT INTO song
    (capture_date, source_id, title, artist_name)
  VALUES
    ('2020-10-06T22:21:10-07:00', '726', 'Franchise', 'Travis Scott Featuring Young Thug & M.I.A.'), ('2020-10-06T22:21:10-07:00', '726', 'Forget Me Too', 'Machine Gun Kelly & Halsey'), ('2020-10-06T22:21:10-07:00', '726', 'Epidemic', 'Polo G'), ('2020-10-06T22:21:10-07:00', '726', 'Bloody Valentine', 'Machine Gun Kelly'), ('2020-10-06T22:21:10-07:00', '726', 'U 2 Luv', 'Ne-Yo & Jeremih'), ('2020-10-06T22:21:10-07:00', '726', 'Better', 'Zayn'), ('2020-10-06T22:21:10-07:00', '726', 'Drunk Face', 'Machine Gun Kelly'), ('2020-10-06T22:21:10-07:00', '726', 'Big, Big Plans', 'Chris Lane'), ('2020-10-06T22:21:10-07:00', '726', 'Ay, Dios Mio!', 'Karol G'), ('2020-10-06T22:21:10-07:00', '726', 'Good Time', 'Niko Moon'), ('2020-10-06T22:21:10-07:00', '726', 'Put Your Records On', 'Ritt Momney'), ('2020-10-06T22:21:10-07:00', '726', 'Money Over Fallouts', 'Tory Lanez')
  ;
