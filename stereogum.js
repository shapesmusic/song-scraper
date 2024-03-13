// Stereogum

const elements = document.getElementsByClassName("list-module__title small");

const songsData = [];

for (var i = 0; i < elements.length; i++) {
  title = elements[i].innerText.match(/- "(.*?)"/)[1]; // may need " or “” type quotation marks. also check the dash type (usually -)
  const artist_name = elements[i].innerText.match(/.+?(?= - ")/)[0]; // may need " or “ type quotation marks
  const video_id = null;
  // replace null with below to grab video IDs (when all songs are YT)
  // videoUrl[i].style.backgroundImage.match(/(?<=vi\/)(.*)(?=\/)/)[0];

  const songData = {
    title: title,
    artist_name: artist_name,
    video_id: video_id
  };

  songsData.push(songData);
}

// Build the SQL Statement
const songs = [];

for (let i = 0; i < songsData.length; i++) {
  const title = songsData[i].title.replace(/'/g, "’");
  const artistName = songsData[i].artist_name.replace(/'/g, "’");

  const song = `  ('${title}', '${artistName}', NULL)`;
  songs.push(song);
}

console.log(
  `INSERT INTO NMT
  (title, artist_name, video_id)
VALUES
${songs.join(",\n")}
;`
);
