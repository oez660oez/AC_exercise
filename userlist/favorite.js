const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users";
const User_URL = BASE_URL + "/api/v1/users/";
const Users = JSON.parse(localStorage.getItem('favoriteUser')) || []
const dataPanel = document.querySelector("#data-panel");
// 監聽 data panel
dataPanel.addEventListener("click", function onPanelClicked(event) {
  const target = event.target;
  if (event.target.matches('.btn-remove-favorite')) {
    event.stopPropagation();
    removeFromFavorite(Number(event.target.dataset.id))
  } else {
    const card = target.closest('.card');
    if (card) {
      const id = card.dataset.id;
      showUserModal(id);
    }
  }
});
function removeFromFavorite(id) {
  if (!Users || !Users.length) return
  const UserIndex = Users.findIndex((user) => user.id === id)
  if (UserIndex === -1) return
  Users.splice(UserIndex, 1)
  localStorage.setItem('favoriteUser', JSON.stringify(Users))
  renderUserList(Users)
}
function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card" data-id="${item.id}">
        <img src="${item.avatar}" class="card-img-top" alt="User Photo">
        <div class="card-body">
          <h5 class="card-title">${item.name} ${item.surname}</h5>
          <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
        </div>
      </div>
    </div>
  </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}
function showUserModal(id) {
  const modalName = document.querySelector("#User-modal-Name");
  const modalImage = document.querySelector("#User-modal-image");
  const modalContent = document.querySelector("#User-modal-content");
  axios.get(User_URL + id).then((response) => {
    const data = response.data;
    modalName.innerHTML = `<h5 class="modal-Name" id="User-modal-Name">${data.name} ${data.surname}</h5>`;
    modalContent.innerHTML = `<p>Gender:${data.gender}</p><p>Age:${data.age}</p><p>${data.email}</p><p>${data.region}</p><p>${data.birthday}</p><p>${data.created_at}</p><p>${data.updated_at}</p>`;
    modalImage.innerHTML = `<img src="${data.avatar}" alt="User Photo" class="img-fluid">`;
    const userModal = new bootstrap.Modal(document.getElementById('User-modal'));
    userModal.show();
  });
}
renderUserList(Users)