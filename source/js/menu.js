const nav = document.querySelector('.site-nav')
nav.classList.add('enhanced')

const submenus = nav.querySelectorAll(
  '.menu__item[data-has-children]'
)
const dropdowns = nav.querySelectorAll(
  '.menu__item[data-has-children] > .menu'
)

const icon = `
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    aria-hidden="true"
    class="menu__btn-icon"
  >
  <path fill="currentColor" d="M5.64645 8.64645c.19526-.19527.51184-.19527.7071 0L12 14.2929l5.6464-5.64645c.1953-.19527.5119-.19527.7072 0 .1952.19526.1952.51184 0 .7071L12 15.7071 5.64645 9.35355c-.19527-.19526-.19527-.51184 0-.7071Z"></path>
  </svg>
`

// Находим подменю, заменяем в нём span на кнопку
submenus.forEach((item) => {
  const dropdown = item.querySelector(':scope > .menu');
  dropdown.setAttribute('hidden', '');

  const button = item.querySelector(':scope > .menu__btn');

  // Добавляем иконку к кнопке, чтобы визуально было
  // понятно открыто меню или нет
  button.innerHTML += icon;

  button.addEventListener('click', function (e) {
    toggleDropdown(button, dropdown)
  });

  // Обрабатываем нажатие на Esc
  dropdown.addEventListener('keydown', (e) => {
    e.stopImmediatePropagation();
// e.stopImmediatePropagation() - вызывается у объекта события (Event) и запрещает дальнейшее распространение этого события.
// Отличие от stopPropagation():stopPropagation() просто прекращает распространение события по DOM (во всех последующих элементах), но оставляет срабатывать другие обработчики на том же элементе.
// stopImmediatePropagation() не только прекращает распространение, но и останавливает выполнение всех остальных обработчиков на том же элементе, которые должны были сработать после текущего.

// применяется когда нужно полностью локализовать обработку события в текущем обработчике и не допустить никого другого на этом элементе отреагировать на него.

// :stopImmediatePropagation() не отменяет поведение по умолчанию.
// Чтобы запретить браузеру выполнить дефолтное действие, нужно вызвать e.preventDefault() отдельно.

// В контексте кода:внутри обработчика keydown на dropdown вызывается e.stopImmediatePropagation(), чтобы ни одно другое обработчик на dropdown для события keydown не выполнился после этого.

// Пример использования:если у элемента есть несколько слушателей keydown и нужно, чтобы после обработки этого конкретного обработчика другие не мешали, можно вызвать stopImmediatePropagation.

// Коротко: прекращает выполнение всех остальных обработчиков того же события на том же элементе и не позволяет событию раскатиться дальше по DOM.


    // e.keyCode === 27
    if ( e.key === 'Escape' && focusIsInside(dropdown))  {
      toggleDropdown(button, dropdown);
      button.focus();
    }
  }, true)

  // false — раньше называлось useCapture.false означает, что обработчик будет срабатывать в фазе всплытия (bubbling), а не в фазе погружения (capturing).
// По умолчанию это значение и так false, поэтому часто его не указывают. Если бы стояло true, обработчик сработал бы во время погружения, раньше чем другие обработчики в фазе всплытия.
})

function toggleDropdown(button, dropdown) {
  if (button.getAttribute('aria-expanded') === 'true') {
    button.setAttribute('aria-expanded', 'false')
    dropdown.setAttribute('hidden', '')
  } else {
    button.setAttribute('aria-expanded', 'true')
    dropdown.removeAttribute('hidden')
  }
}

function focusIsInside(element) {
  return element.contains(document.activeElement);

//   Эта функция проверяет, находится ли текущий фокус внутри переданного элемента.
// document.activeElement — элемент, в котором сейчас стоит фокус.
// element.contains(...) — возвращает true, если активный элемент является потомком element или самим element.
// Итого:
// focusIsInside(element) вернёт true, если фокус либо на элементе, либо внутри его потомков.
// Вернёт false, если фокус вне этого элемента.
// Пример: если фокус на кнопке внутри dropdown, focusIsInside(dropdown) даст true.
}


function collapseDropdownsWhenTabbingOutsideNav(e) {
  if (e.keyCode === 9 && !focusIsInside(nav)) {
      console.log('за её пределы');

    dropdowns.forEach(function (dropdown) {
      dropdown.setAttribute('hidden', '')
      const btn = dropdown.parentNode.querySelector('button')
      btn.setAttribute('aria-expanded', 'false')
    })
  }
}

function collapseDropdownsWhenClickingOutsideNav(e) {
  const target = e.target

  dropdowns.forEach(function (dropdown) {
    if (!dropdown.parentNode.contains(target)) {
      dropdown.setAttribute('hidden', '');
      const btn = dropdown.parentNode.querySelector('button');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

// Закрываем навигацию, если протапались за её пределы
document.addEventListener('keyup', collapseDropdownsWhenTabbingOutsideNav);
// если протапать до "просто кнопка" - меню закроется
// // Закрываем навигацию, если кликнули вне навигации
window.addEventListener('click', collapseDropdownsWhenClickingOutsideNav);
