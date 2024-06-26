// DATA /////////////////////////////////////

const players = [
  { name: 'Bernard', email: 'bernard@example.com' },
  { name: 'Youchi', email: 'youchi@example.com' },
  { name: 'Yenting', email: 'yenting@example.com' },
  { name: 'Angela', email: 'angela@example.com' },
  { name: 'Yvonne', email: 'yvonne@example.com' },
  { name: 'Ellen', email: 'ellen@example.com' },
  { name: 'Walter', email: 'walter@example.com' },
  { name: 'Kevin', email: 'kevin@example.com' },
  { name: 'Tim', email: 'tim@example.com' },
  { name: 'Russell', email: 'russell@example.com' }
]
// 用來檢查彩券號碼是否重複
const tickets = []

// FUNCTIONS /////////////////////////////////////

function createTicket() {
  // write your code here
  let ticket = ''
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  ticket += letters[Math.floor(Math.random() * 26)]
  ticket += letters[Math.floor(Math.random() * 26)]
  ticket += Math.floor(Math.random() * 10)
  ticket += Math.floor(Math.random() * 10)
  ticket += Math.floor(Math.random() * 10)
  ticket += Math.floor(Math.random() * 10)
  if (tickets.includes(ticket)) { //若用indexof也能檢測有沒有在裡面，有的話回傳0~n沒有-1
    return createTicket() //重複重跑
  } else {
    tickets.push(ticket)
    return ticket
  }
}

function drawWinner(players, prize) {
  // write your code here
  // 原先在「週年慶摸彩活動：誰是幸運兒」中，將輸出內容寫在 drawWinner 裡，現在請將輸出的部分改放到 announceMsg 中進行處理，將抽與公布的動作分開，以利處理下面第三步的工作。
  const index = Math.floor(Math.random() * players.length) //隨機選出一位得獎者
  const winner = players.splice(index, 1)[0]; // 抽出得獎者並從 players 中移除
  announceMsg(winner, prize) //得獎者資訊
  //若使用return winner 則會需要更改 draw 3 winners and announce the results 的部分
}

function announceMsg(winner, prize) {
  console.log(`${winner.ticket} | ${encodeName(winner.name)} | ${encodeEmail(winner.email)} | ${prize}`)
}

// add more functions here
// 請記得把你在先前作業中寫好的 encode 系列函式也放進來
function encodeName(name) {
  // 請封裝你之前寫好的程式碼，並設計必要參數
  let encodeName = name.slice(0, 2)
  for (let i = 0; i < name.length - 2; i++) {
    encodeName += '*'
  }
  return encodeName
}

function encodeEmail(email) {
  // 請封裝你之前寫好的程式碼，並設計必要參數
  const emailFront = email.slice(0, email.indexOf('@'))
  const emailEnd = email.slice(email.indexOf('@'), email.length)
  email = emailFront.slice(0, Math.floor(emailFront.length / 2)) + '...' + emailEnd

  return email
}
// EXECUTING /////////////////////////////////////

// 1. each player gets a lottery ticket
// write your code here
for (let i = 0; i < players.length; i++) {
  players[i].ticket = createTicket();//點語法，分配每位得獎者的彩票號碼
}

// 2. draw 3 winners and announce the results
drawWinner(players, '頭獎')
drawWinner(players, '貮獎')
drawWinner(players, '叁獎')

// 3. the rest of players get participation award
// 提示：抽出得獎者後，記得要呼叫 announceMsg 在 console 印出得獎者
// write your code here
for (let i = 0; i < players.length; i++) {
  announceMsg(players[i], '參加獎')
}

module.exports = {
  encodeName,
  encodeEmail,
  createTicket,
}