let players = [
  { name: '櫻木花道', pts: 0, reb: 0, ast: 0, stl: 0, blk: 2 },
  { name: '流川楓', pts: 30, reb: 6, ast: 3, stl: 3, blk: 0 },
  { name: '赤木剛憲', pts: 16, reb: 10, ast: 0, stl: 0, blk: 5 },
  { name: '宮城良田', pts: 6, reb: 0, ast: 7, stl: 6, blk: 0 },
  { name: '三井壽', pts: 21, reb: 4, ast: 3, stl: 0, blk: 0 }
]

const dataPanel = document.querySelector('#data-panel')

// write your code here
function displayPlayerList(players) {
  let Content = ""

  players.forEach((Player) => {
    Content += "<tr>"
    for (let key in Player) {
      if (key === "name") {
        Content += `<td>${Player[key]}</td>`
      }
      else {
        //宣告id變數，為了讓每個icon都有不同的id，使用${key}-${playerIndex}
        // const valueId = `${key}-${playerIndex}`;
        // const plusId = `plus-${valueId}`;
        // const minusId = `minus-${valueId}`;
        //新增id，<span id="${valueId}" style="font-size:25px">${player[key]}</span>
        // <i id="${plusId}" class="fa fa-plus-circle up" style="font-size: 20px; color: black; padding: 0px;" aria-hidden="true"></i>
        // <i id="${minusId}" class="fa fa-minus-circle down" style="font-size: 20px; color: black; padding: 0px;" aria-hidden="true"></i>
        Content += ` 
         <td>
         <span style = "font-size:25px">${Player[key]}</span>
         <i class ="fa fa-plus-circle up" style = "font-size: 20px; color: black; padding: 0px;"aria-hidden="true" ></i>
         <i class ="fa fa-minus-circle down" style = "font-size: 20px; color: black; padding: 0px;"aria-hidden="true" ></i>
         </td>`
      }
    }
  });
  Content += "</tr>"
  dataPanel.innerHTML = Content
}

// Add event listeners for all plus and minus buttons
//   players.forEach((player, playerIndex) => {
//     for (let key in player) {
//   //要處理上面迴圈中 if (key === "name")的else部分所以直接!=="name" 
//       if (key !== "name") {
//         const valueId = `${key}-${playerIndex}`;
//         const plusId = `plus-${valueId}`;
//         const minusId = `minus-${valueId}`;
//         //需要抓到對應id的元素，也能使用querySelector，改為querySelector(`#${valueId}`)...
//         const valueElement = document.getElementById(valueId);
//         const plusElement = document.getElementById(plusId);
//         const minusElement = document.getElementById(minusId);
//         //新增+符號的監聽器
//         plusElement.addEventListener('click', () => {
//           //需要用valueElement.textContent抓取數字的字串再使用parseInt轉為數字整數
//           let currentValue = parseInt(valueElement.textContent);
//           //點+符號後+1的值替換原來的值
//           valueElement.textContent = currentValue + 1;
//         });
//         //新增-符號的監聽器
//         minusElement.addEventListener('click', () => {
//           let currentValue = parseInt(valueElement.textContent);
//           //設置條件讓數字的值不會變成-1的狀況
//           if (currentValue > 0) {
//             valueElement.textContent = currentValue - 1;
//           }
//         });
//       }
//     }
//   });
// }
dataPanel.addEventListener("click", (Score) => {
  //也能使用Score.target.classList.contains，但較不佳
  if (Score.target.matches('.fa-plus-circle') || Score.target.matches('.fa-minus-circle')) {
    let ScoreParent = Score.target.parentElement.children[0]
    let Point = parseInt(ScoreParent.textContent)
    if (Score.target.matches('.fa-plus-circle')) {
      Point += 1
    } else {
      Point -= 1
      if (Point < 0) Point = 0
    }
    ScoreParent.textContent = Point
  }
})
displayPlayerList(players);
