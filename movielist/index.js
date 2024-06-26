const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const MOVIES_PER_PAGE = 12
const paginator = document.querySelector('#paginator')
//儲存符合篩選條件的項目，為了分頁從search函式中拉出來當全域變數
let filteredMovies = []
function addToFavorite(id){
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)){
    return alert ('此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies',JSON.stringify(list))
}
// 監聽 data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  }else if (event.target.matches('.btn-add-favorite')){
    addToFavorite(Number(event.target.dataset.id))
  }
})
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    // title, image, id 隨著每個 item 改變
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${POSTER_URL + item.image
      }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
}
//計算並新增分頁器的分頁
function renderPaginator(amount) {
  //計算總頁數
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  //製作 template
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  //放回 HTML
  paginator.innerHTML = rawHTML
}
//依照頁數渲染電影數量
function getMoviesByPage(page) {
  //能用if/else表現，此處用三元運算子，條件 ? 值1 : 值2，如果 條件 為 true，運算子回傳 值 1， 否則回傳 值 2。 
  const data = filteredMovies.length ? filteredMovies : movies
  //計算起始 index，並且預設為0
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  //回傳切割後的新陣列，slice方法參數是[startIndex, endIndex)，即包括 startIndex 但不包括 endIndex，意即page1=0~11，page2=12~23...
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}
axios
  .get(INDEX_URL) // 修改這裡
  .then((response) => {
    // 目標：用 push 方法把 movies 從空陣列變成 [1,2,3]
    // 方法一，movies.push(1, 2, 3); 傳入 3 個參數：1,2,3
    // 方法二，movies.push(...[1, 2, 3]);把陣列用展開運算子打開，打開後就和方法一一模一樣
    // 方法三，const numbers = [1, 2, 3];、movies.push(...numbers);
    movies.push(...response.data.results)
    //呼叫分頁數量函式
    renderPaginator(movies.length)
    //呼叫渲染電影清單函式，並且渲染第一頁分頁的內容當作預設
    renderMovieList(getMoviesByPage(1))
  })
  .catch((err) => console.log(err))
// 發送 Request
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })
}
//監聽分頁點擊事件
paginator.addEventListener('click', function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return

  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  //更新畫面
  renderMovieList(getMoviesByPage(page))
})
//監聽表單提交事件
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  //取消預設事件
  event.preventDefault()
  //取得搜尋關鍵字
  const keyword = searchInput.value.trim().toLowerCase()
  //錯誤處理：輸入無效字串
  // if (!keyword.length) {
  //   return alert('請輸入有效字串！')
  // }
  //條件篩選
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  //錯誤處理：無符合條件的結果
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  //重製分頁器
  renderPaginator(filteredMovies.length)
  //預設顯示第 1 頁的搜尋結果
  renderMovieList(getMoviesByPage(1))
})
