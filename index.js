/**
 * 시계 구현
 */
const play_clock = () => {
  let date_obj = new Date();

  let month = (date_obj.getMonth() + 1).toString().padStart(2, '0');
  let date = date_obj.getDate().toString().padStart(2, '0');
  let hours = date_obj.getHours().toString().padStart(2, '0');
  let minutes = date_obj.getMinutes().toString().padStart(2, '0');
  let seconds = date_obj.getSeconds().toString().padStart(2, '0');

  let ele_clock = document.querySelector('h2.clock');
  ele_clock.innerHTML = `${month}월 ${date}일 ${hours}:${minutes}:${seconds}`;
};

play_clock();
setInterval(play_clock, 1000);

/**
 * 로그인 구현
 */

const login_form = document.querySelector('#login_form');
const todo_form = document.querySelector('#todo_form');
const greeting_area = document.getElementById('greeting_area');
const todo_area = document.getElementById('todo_area');
let saved_username = '';
login_form.addEventListener('submit', (e) => {
  let login_username = document.getElementById('username').value;
  e.preventDefault();
  localStorage.setItem('username', login_username);
  loginCheck();
  load_todo_list();
});
const loginCheck = () => {
  saved_username = localStorage.getItem('username');
  if (saved_username === null) {
    login_form.classList.remove('hidden');
    greeting_area.classList.add('hidden');
    todo_area.classList.add('hidden');
    return null;
  } else {
    login_form.classList.add('hidden');
    greeting_area.classList.remove('hidden');
    greeting_area.querySelector('h2').innerText = `Hello ${saved_username}!!`;
    todo_area.classList.remove('hidden');
    let saved_todo_list = JSON.parse(localStorage.getItem('todo_list'));

    if (saved_todo_list[saved_username] == undefined) {
      saved_todo_list[saved_username] = [];
      localStorage.setItem('todo_list', JSON.stringify(saved_todo_list));
    }
  }
};
const logout = () => {
  localStorage.removeItem('username');
  reset_todo_list();
  loginCheck();
};
document.getElementById('logout').onclick = logout;
loginCheck();

/**
 * Todo 구현
 */
const reset_todo_list = () => {
  document.getElementById('todo_list').innerHTML = '';
};
const load_todo_list = () => {
  let saved_todo_list = JSON.parse(localStorage.getItem('todo_list'));
  let todo_list_area = document.getElementById('todo_list');
  todo_list_area.innerHTML = '';
  if (saved_todo_list[saved_username] !== undefined) {
    saved_todo_list[saved_username].forEach((todo, i) => {
      todo_list_area.innerHTML += `
        <li class='todo_detail'>
          <input type="checkbox" name="todocheck"  ${
            todo.is_checked ? 'checked' : ''
          }/>
          <span data-index="${i}" class=${
        todo.is_checked ? 'todo_checked' : ''
      }> ${todo.text} </span>
        </li>
      `;
    });

    let checkbox_todo_list = todo_list.querySelectorAll('input');
    for (box of checkbox_todo_list) {
      box.addEventListener('click', actionCheckbox);
    }
  }
};
todo_form.addEventListener('submit', (e) => {
  e.preventDefault();
  let todo_input = document.getElementById('todo_input').value;
  document.getElementById('todo_input').value = '';
  let saved_todo_list = JSON.parse(localStorage.getItem('todo_list'));
  let new_todo_detail = {
    is_checked: false,
    text: todo_input,
  };
  saved_todo_list[saved_username].push(new_todo_detail);
  localStorage.setItem('todo_list', JSON.stringify(saved_todo_list));
  load_todo_list();
});

const actionCheckbox = (e) => {
  if (e.target.checked) {
    e.target.nextElementSibling.classList.add('todo_checked');
  } else {
    e.target.nextElementSibling.classList.remove('todo_checked');
  }
  let data_index = e.target.nextElementSibling.dataset.index;
  let saved_todo_list = JSON.parse(localStorage.getItem('todo_list'));
  saved_todo_list[saved_username][data_index].is_checked = e.target.checked;
  localStorage.setItem('todo_list', JSON.stringify(saved_todo_list));
};
load_todo_list();

/**
 * 랜덤 배경 이미지
 */
let random_image = Math.floor(Math.random() * 3) + '.jpg';

document.body.style.backgroundImage = `url(img/${random_image})`;

/**
 *  위치 및 날씨 가져오기
 */
let current_lat = '';
let current_lng = '';

navigator.geolocation.getCurrentPosition((position) => {
  current_lat = position.coords.latitude;
  current_lng = position.coords.longitude;

  console.log('My coords is ', current_lat, current_lng);
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${current_lat}&lon=${current_lng}&appid=3f4c1486c96ff8368c52a618709edf9a`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let city = data.name;
      let weather = data.weather[0].main;
      console.log(city, weather);
      document.querySelector('#weather span:first-child').innerHTML = city;
      document.querySelector('#weather span:last-child').innerHTML = weather;
    });
});
