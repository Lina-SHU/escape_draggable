// ====== DOM ======
const urgent = document.querySelector('.stacked-list-js.urgent');
const important = document.querySelector('.stacked-list-js.important');
const normal = document.querySelector('.stacked-list-js.normal');

const containers = document.querySelectorAll('#multiple-containers-js .stacked-list-js');
const stackedListJs = document.querySelector('#multiple-containers-js');
const addTodoBtn = document.querySelector('.addTodoBtn-js');
const form = document.getElementById('form');


// ====== Data ======
let defaultData = [
  {
    category: 'urgent',
    data: {
      id: 0,
      title: '第一關',
      done: false,
    }
  },
  {
    category: 'urgent',
    data: {
      id: 1,
      title: '第二關',
      done: true,
    }
  },
  {
    category: 'urgent',
    data: {
      id: 2,
      title: '第三關',
      done: false,
    }
  },
  {
    category: 'urgent',
    data: {
      id: 3,
      title: '第四關',
      done: false,
    }
  },
  {
    category: 'urgent',
    data: {
      id: 4,
      title: '第五關',
      done: false,
    }
  },
  {
    category: 'important',
    data: {
      id: 5,
      title: '第六關',
      done: false,
    }
  },
  {
    category: 'important',
    data: {
      id: 6,
      title: '第七關',
      done: false,
    }
  },
  {
    category: 'important',
    data: {
      id: 7,
      title: '第八關',
      done: false,
    }
  },
  {
    category: 'normal',
    data: {
      id: 8,
      title: '第九關',
      done: false,
    }
  },
  {
    category: 'normal',
    data: {
      id: 9,
      title: '第十關',
      done: false,
    }
  },
];

let todoData = JSON.parse(localStorage.getItem('todoData'))|| defaultData;

// ====== draggable var ======
const containerTwoCapacity = 3;
const limitCapacity = {
  urgent: 5,
  important: 3,
};
// const limitIndexMapping = {
//   urgent: 0,
//   important: 1,
// };
let urgentCount;
let importantCount;
let isUrgentLimit;
let isImportantLimit;


// ====== draggable ======
const sortable = new Sortable.default(
  containers, {
    draggable: '.box--isDraggable',
    mirror: {
      constrainDimensions: true,
    }
  }
)

sortable.on('drag:start', (evt) => {
  // 取得被拖曳的 li
  const draggableLi = evt.data.sensorEvent.data.target; 
  // 若為已經完成的項目不可拖曳
  const targetIsDone = draggableLi.classList.contains('task-done');
  if (targetIsDone) {
    evt.cancel();
  }
  // 確認及刪除項目
  const isDone = draggableLi.classList.contains('task-text');
  const isDelete = draggableLi.classList.contains('task-del-js');
  if (isDone || isDelete) {
    evt.cancel();
  }
  // 取得緊急與重要的數量及限制
  isUrgentLimit = urgent.childElementCount === limitCapacity.urgent;
  isImportantLimit = important.childElementCount === limitCapacity.important;
});

sortable.on('sortable:sort', (evt) => {
  const targetCategory = evt.overContainer.dataset.category
  // console.log(targetCategory)
  
  if (targetCategory === 'urgent' && isUrgentLimit) {
    // 到達緊急的限制就取消拖曳
    evt.cancel();
  } else if (targetCategory === 'important' && isImportantLimit) {
    // 到達重要的限制就取消拖曳
    evt.cancel();
  }
});

sortable.on('sortable:sorted', (evt) => {
  // 取得拖曳的項目加入對應的區塊內
  const id = evt.data.dragEvent.data.source.dataset.id;
  const idx = todoData.findIndex((item) => item.data.id == id);
  // 取得項目的新種類
  const updateCategory = evt.newContainer.dataset.category;
  // 更改種類
  todoData[idx].category = updateCategory;
  localStorage.setItem('todoData', JSON.stringify(todoData));
});


// ====== function ======
function renderTodo(data) {
  let todoStr = {
    urgent: '',
    important: '',
    normal: '',
  };
  data.forEach((item, index) => {
    todoStr[item.category] += `<li class="box box--isDraggable" data-id=${item.data.id}>
          <div class="flex items-center">
            <input class="task-done hover:border-green-500 mr-2 ${item.data.done && 'checked'}" type="checkbox" id=${item.data.id}>
            <label class="task-text cursor-pointer" for="${item.data.id}">${item.data.title}</label>
          </div>
          <div class="text-base text-gray-200 hover:text-orange-700 cursor-pointer"><span class="task-del-js fas fa-times pl-2" data-id=${item.data.id}></span></div>
        </li>`;
  });
  urgent.innerHTML = todoStr['urgent'];
  important.innerHTML = todoStr['important'];
  normal.innerHTML = todoStr['normal'];
}

function doneToggle(id) {
  let index = todoData.findIndex(item => item.data.id == id);
  todoData[index].data.done = !todoData[index].data.done;
  localStorage.setItem('todoData', JSON.stringify(todoData));
}

function addTodo(title) {
  todoData.push({
    category: 'normal',
    data: {
      id: new Date().getTime(), // UNIX Timestamp 
      title: title,
      done: false,
    }
  });
  localStorage.setItem('todoData', JSON.stringify(todoData));
  renderTodo(todoData);
}

function delTodo(id) {
  let index = todoData.findIndex(item => item.data.id == id);
  todoData.splice(index, 1);
  localStorage.setItem('todoData', JSON.stringify(todoData));
  renderTodo(todoData);
}

function init() {
  renderTodo(todoData);
};

// ====== addEventListener ======
stackedListJs.addEventListener('click', function (e) {
  const targetIsDone = e.target.classList.contains('task-done');
  const targetIsDel = e.target.classList.contains('task-del-js');
  if (targetIsDone) {
    e.target.classList.toggle('checked');
    doneToggle(e.target.id);
  } else if (targetIsDel) {
    targetIsDel && delTodo(e.target.dataset.id);
  }
}, false);

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const todoInput = document.getElementById('addTodo');
  addTodo(todoInput.value);
  todoInput.value = '';
}, false);


init();