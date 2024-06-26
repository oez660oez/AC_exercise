const BASE_URL = "https://webdev.alphacamp.io/api/lyrics/";
const songList = document.querySelector("#song-list");
const lyricsPanel = document.querySelector("#lyrics-panel");
const album = {
  artist: "Adele",
  album: "25",
  tracks: [
    "Hello",
    "Send My Love (To Your New Lover)",
    "I Miss You",
    "When We Were Young",
    "Remedy",
    "Water Under the Bridge",
    "River Lea",
    "Love in the Dark",
    "Million Years Ago",
    "All I Ask",
    "Sweetest Devotion"
  ]
};

// WRITE YOUR CODE ////////////////////////
let songListContent = "";
const AlbumTracks = album.tracks;
AlbumTracks.forEach(
  (track) =>
  (songListContent += `  <li class="nav-item">
    <a class="nav-link" href="#">${track}</a></li>`)
);
songList.innerHTML = songListContent;

songList.addEventListener("click", (event) => {
  // 檢查點擊的元素是否是 <a> 標籤。
  if (event.target.tagName === "A") {
    // 移除當前 `.active` class
    const currentActive = document.querySelector(".nav-link.active");
    if (currentActive) {
      currentActive.classList.remove("active");
    }

    // 將 `active` class 添加到當前點擊的項目上
    event.target.classList.add("active");

    // 取得點擊的歌曲名稱
    const lyricsOrder = event.target.innerText;

    // 發送請求獲取歌詞
    axios
      .get(`https://api.lyrics.ovh/v1/Adele/${lyricsOrder}`)
      .then((response) => {
        // 預計加入插入調整字體大小的按鈕，並且透過bootstrap的h1~h6控制大小
        lyricsPanel.innerHTML = `
          <h1>${lyricsOrder}</h1>
          <div>
            <ul class="nav nav-pills">
              <li class="nav-item">
                <a class="nav-link font-size-btn" data-size="h6" href="#">小</a>
              </li>
              <li class="nav-item">
                <a class="nav-link font-size-btn active" data-size="h4" href="#">中</a>
              </li>
              <li class="nav-item">
                <a class="nav-link font-size-btn" data-size="h2" href="#">大</a>
              </li>
            </ul>
          </div>
          <pre id="lyrics-text" class="h4">${response.data.lyrics}</pre>
        `;
      })
      .catch((error) => console.log(error));
  }
});

// 添加字體大小判斷式
lyricsPanel.addEventListener('click', (event) => {
  if (event.target.tagName === 'A' && event.target.classList.contains('font-size-btn')) {
    const size = event.target.dataset.size;
    const lyricsText = document.querySelector('#lyrics-text');

    // 移除所有大小 class
    lyricsText.classList.remove('h6', 'h4', 'h2');
    // 移除所有 font-size-btn 的 active class
    document.querySelectorAll('.font-size-btn').forEach(btn => btn.classList.remove('active'));

    // 添加對應的大小 class
    lyricsText.classList.add(size);
    // 為當前點擊的按鈕添加 active class
    event.target.classList.add('active');
  }
});
