(function () {
  if (document.cookie.split('; ').find(row => row.startsWith('legacy_cookie='))) {
    return
  }

  BX.ajax({
    url: '/bitrix/tools/dbogdanoff_cookie_options.php',
    method: 'POST',
    dataType: 'json',
    data: {
      'SITE_ID': BX.message('SITE_ID'),
    },
    onsuccess: function (options) {
      handleContentLoaded(options)
    },
    onfailure: function (error) {
      console.error('Ошибка при запросе опций модуля dbogdanoff.cookie', error)
    },
  })
})();

function handleContentLoaded (options) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      insertCookieDiv(options.data)
    })
  }
  else {
    insertCookieDiv(options.data)
  }
}

// Функция для вставки HTML-разметки
function insertCookieDiv (options) {
  // Создаем элементы
  let cookieDiv = document.createElement('div')
  cookieDiv.style.zIndex = options.zIndex
  cookieDiv.id = 'legacy-cookie-wrap'
  cookieDiv.className = 'legacy-cookie'
  if (options.disableMob === 'Y') {
    cookieDiv.classList.add('legacy-cookie--d-mob-none')
  }

  let innerDiv = document.createElement('div')
  let cookieText = document.createElement('div')
  cookieText.className = 'legacy-cookie__text'

  cookieText.innerHTML = options.text
  if (options.color) {
    let anchor = cookieText.querySelector('a')
    if (anchor) {
      anchor.style.color = options.color
    }
  }

  let closeImg = document.createElement('img')
  closeImg.src = '/bitrix/images/dbogdanoff.cookie/close.svg'
  closeImg.onclick = sendCookieRequestAndRemoveElement

  // Собираем и вставляем в документ
  innerDiv.appendChild(cookieText)
  innerDiv.appendChild(closeImg)
  cookieDiv.appendChild(innerDiv)
  document.body.appendChild(cookieDiv)
}

function sendCookieRequestAndRemoveElement () {
  BX.ajax({
    url: '/bitrix/tools/dbogdanoff_cookie_save.php',
  })
  let element = document.getElementById('legacy-cookie-wrap')
  if (element) {
    element.remove()
  }
}
