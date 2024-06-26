const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users";
const User_URL = BASE_URL + "/api/v1/users/";
const Users = [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const USERS_PER_PAGE = 8
const paginator = document.querySelector('#paginator')
let filteredUsers = []
//追蹤當前顯示的頁碼，製作動態顯示頁碼
let currentPage = 1
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUser')) || []
  const User = Users.find((user) => user.id === id)
  if (list.some((user) => user.id === id)) {
    return alert('已經儲存此對象！')
  }
  //預設可挑選分組人數為4人，不能多加
  if (list.length >= 4) {
    return alert('您儲存的對象數量已超出限制！')
  }
  list.push(User)
  localStorage.setItem('favoriteUser', JSON.stringify(list))
}
// 監聽 data panel
dataPanel.addEventListener("click", function onPanelClicked(event) {
  const target = event.target;
  // 判斷是否點擊收藏按鈕
  if (target.matches('.btn-add-favorite')) {
    // 阻止事件冒泡
    event.stopPropagation();
    addToFavorite(Number(target.dataset.id));
  } else {
    // 找到最近的 card 元素並取得其 data-id
    const card = target.closest('.card');
    if (card) {
      const id = card.dataset.id;
      showUserModal(id);
    }
  }
});
//渲染使用者名單
function renderUserList(data) {
  let rawHTML = "";
  //輸入名稱不包含時渲染空白
  if (data.length === 0) {
    dataPanel.innerHTML = rawHTML;
    return;
  }
  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3 ">
      <div class="mb-2">
        <div class="card" data-id="${item.id}">
          <img src="${item.avatar}" class="card-img-top" alt="User Photo">
          <div class="card-body">
            <h5 class="card-name">${item.name} ${item.surname}</h5>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
    </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}
//參數page的默認值設為1
function renderPaginator(amount, page = 1) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  let rawHTML = ''
  //名稱不包含時，分頁不顯示
  if (amount === 0) {
    paginator.innerHTML = rawHTML;
    return;
  }
  //最多顯示三頁
  const maxPagesToShow = 3
  //Math.max(a, b)：返回 a 和 b 之中的最大值，目標是在點擊第3頁開始，要抓到前一個數字。
  let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2))
  //Math.min(a, b)：返回 a 和 b 之中的最小值，目標是在點擊第3頁開始，要抓到後一個數字。
  let endPage = Math.min(numberOfPages, startPage + maxPagesToShow - 1)
  //檢查目前顯示的頁碼區間是否小於預期顯示的頁碼數量，目標是在點最尾頁時，抓到前兩個數字
  if (endPage - startPage < maxPagesToShow - 1) {
    //不使用startPage = endPage - maxPagesToShow + 1避免只有兩頁時，抓不到第1頁
    startPage = Math.max(1, endPage - maxPagesToShow + 1)
  }
  // << 代表上一頁，並且在第一頁時不運作
  //使用<span aria-hidden="true">會導致點擊icon有時無反應，更新為aria-disabled解決
  rawHTML += `<li class="page-item ${page === 1 ? 'disabled' : ''}">
    <a class="page-link" href="#" aria-label="Previous" data-page="${page - 1}" aria-disabled="${page === 1}">&laquo;
    </a>
  </li>`
  //新增startpage+當前點擊頁數+endpage，總共固定三頁顯示
  for (let i = startPage; i <= endPage; i++) {
    rawHTML += `<li class="page-item ${i === page ? 'active' : ''}">
      <a class="page-link" href="#" data-page="${i}">${i}</a>
    </li>`
  }
  // >> 代表下一頁，並且在最尾頁時不運作
  rawHTML += `<li class="page-item ${page === numberOfPages ? 'disabled' : ''}">
    <a class="page-link" href="#" aria-label="Next" data-page="${page + 1}" aria-disabled="${page === numberOfPages}">&raquo;
    </a>
  </li>`

  paginator.innerHTML = rawHTML
}
function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : Users
  const startIndex = (page - 1) * USERS_PER_PAGE
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

axios
  .get(INDEX_URL)
  .then((response) => {
    Users.push(...response.data.results);
    renderPaginator(Users.length)
    renderUserList(getUsersByPage(1));
  })
  .catch((err) => console.log(err));

function showUserModal(id) {
  const modalName = document.querySelector("#User-modal-Name");
  const modalImage = document.querySelector("#User-modal-image");
  const modalContent = document.querySelector("#User-modal-content");
  axios.get(User_URL + id).then((response) => {
    const data = response.data;
    modalName.innerHTML = `<h5 class="modal-Name" id="User-modal-Name">${data.name} ${data.surname}</h5>`;
    modalContent.innerHTML = `<p>Gender:${data.gender}</p><p>Age:${data.age}</p><p>${data.email}</p><p>${data.region}</p><p>${data.birthday}</p><p>${data.created_at}</p><p>${data.updated_at}</p>`;
    modalImage.innerHTML = `<img src="${data.avatar}" alt="User Photo" class="img-fluid">`;
    // 因為抓id也無法依靠html的modal顯示，後來直接改用 JavaScript 顯示 Modal
    const userModal = new bootstrap.Modal(document.getElementById('User-modal'));
    userModal.show();
  });
}

//監聽分頁點擊事件
paginator.addEventListener('click', function onPaginatorClicked(event) {
  //新增 || 確保頁碼更新和重新渲染的準確性
  if (event.target.tagName !== 'A' || event.target.parentElement.classList.contains('disabled')) return
  const page = Number(event.target.dataset.page)
  // 如果頁碼不是有效的數字，則返回
  if (isNaN(page) || page === currentPage) return
  // 更新當前頁碼
  currentPage = page
  renderUserList(getUsersByPage(page))
  renderPaginator(filteredUsers.length ? filteredUsers.length : Users.length, page)
})
// 監聽搜尋輸入框的即時輸入事件，當輸入關鍵字時即時更新搜尋結果
//'submit'改為'input'，並且刪除掌控瀏覽器預設行為的程式碼
searchInput.addEventListener('input', function onSearchInputChanged(event) {
  const keyword = event.target.value.trim().toLowerCase()
  filteredUsers = Users.filter((user) =>
    user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword)
  )
  // 新搜索時總是從第一頁開始查看結果，並且更新currentPage不直接使用1
  currentPage = 1
  //搜尋時的keyword不是角色名稱顯示空白
  if (filteredUsers.length === 0) {
    renderPaginator(0);
    renderUserList([]);
  } else {
    renderPaginator(filteredUsers.length, currentPage);
    renderUserList(getUsersByPage(currentPage));
  }
})
