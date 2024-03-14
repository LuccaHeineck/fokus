const taskListContainer = document.querySelector('.app__section-task-list');
const formTask = document.querySelector('.app__form-add-task');
const toggleFormTaskBtn = document.querySelector('.app__button--add-task');
const fomrLabel = document.querySelector('.app__form-label');
const textArea = document.querySelector('.app__form-textarea');
const cancelButton = document.querySelector('.app__form-footer__button--cancel');
const localStorageTarefas = localStorage.getItem('tarefas');
const taskActiveDescription = document.querySelector('.app__section-active-task-description');
const btnDeletar = document.querySelector('.app__form-footer__button--delete');
const btnDeletarTodas = document.getElementById('btn-remover-todas');
const btnDeletarConcluidas = document.getElementById('btn-remover-concluidas');

let tarefas = localStorageTarefas ? JSON.parse(localStorageTarefas) : [];

const taskIconSvg = ` 
<svg width="18" height="14" viewBox="0 0 18 14" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
        d="M6 11.1719L16.5938 0.578125L18 1.98438L6 13.9844L0.421875 8.40625L1.82812 7L6 11.1719Z"
        fill="white" />
</svg>`
 
let tarefaSelecionada = null;
let itemTarefaSelecionada = null;

let tarefaEmEdicao = null;
let paragrafoEmEdicao;

const selecionaTarefa = (tarefa, elemento) => {
    if(tarefa.concluida)
    {
        return
    }

        document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
        button.classList.remove('app__section-task-list-item-active')
    })
    
    if (tarefaSelecionada == tarefa) {
        taskActiveDescription.textContent = null
        itemTarefaSelecionada = null
        tarefaSelecionada = null
        return
    }
    
    tarefaSelecionada = tarefa
    itemTarefaSelecionada = elemento
    taskActiveDescription.textContent = tarefa.descricao
    elemento.classList.add('app__section-task-list-item-active')
}

const limparForm = () => {
    tarefaEmEdicao = null;
    paragrafoEmEdicao = null;
    
    textArea.value = '';
    formTask.classList.add('hidden');
}

const selecionaTarefaParaEditar = (tarefa, elemento) => {
    if (tarefaEmEdicao == tarefa)
    {
        limparForm();
        return;
    }

    fomrLabel.textContent = 'Editando tarefa';
    tarefaEmEdicao = tarefa;
    paragrafoEmEdicao = elemento;
    textArea.value = tarefa.descricao;
    formTask.classList.remove('hidden');
}

function createTask(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svgIcon = document.createElement('svg');
    svgIcon.innerHTML = taskIconSvg;

    const paragraph = document.createElement('p');
    paragraph.classList.add('app__section-task-list-item-description');

    paragraph.textContent = tarefa.descricao;

    const button = document.createElement('button');

    button.classList.add('app_button-edit');
    const editIcon = document.createElement('img')
    editIcon.setAttribute('src', './imagens/edit.png')

    button.appendChild(editIcon)

    button.addEventListener('click', (event) => {
        event.stopPropagation();
        selecionaTarefaParaEditar(tarefa, paragraph);

    })

    li.onclick = () => {
        selecionaTarefa(tarefa, li);
    }

    svgIcon.addEventListener('click', (event) => {
        if(tarefa == tarefaSelecionada)
        {
            event.stopPropagation();
            button.setAttribute('disabled', true)
            li.classList.add('app__section-task-list-item-complete');
            tarefaSelecionada.concluida = true;
            updateLocalStorage();
        }
    })

    if(tarefa.concluida)
    {
        button.setAttribute('disabled', true);
        li.classList.add('app__section-task-list-item-complete')
    }

    li.appendChild(svgIcon);
    li.appendChild(paragraph);
    li.appendChild(button);

    return li;
}

tarefas.forEach(task  => {
    const taskItem = createTask(task);
    taskListContainer.appendChild(taskItem);
})

toggleFormTaskBtn.addEventListener('click', () =>{
    fomrLabel.textContent = 'Adicionando tarefa'
    formTask.classList.toggle('hidden');
})

const updateLocalStorage = () => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

formTask.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if(tarefaEmEdicao)
    {
        tarefaEmEdicao.descricao = textArea.value;
        paragrafoEmEdicao.textContent = textArea.value;
    }
    else
    {
    const task = {
        descricao: textArea.value,
        concluida: false
    }
    tarefas.push(task);
    const taskItem = createTask(task);
    taskListContainer.appendChild(taskItem);
    }
    updateLocalStorage();
    limparForm();
})

cancelButton.addEventListener('click', () => {
    formTask.classList.toggle('hidden');
    limparForm();
})

btnDeletar.addEventListener('click', () => {
    if (tarefaSelecionada)
    {
        const index = tarefas.indexOf(tarefaSelecionada);

        if(index !== -1)
        {
            tarefas.splice(index, 1);
        }

        itemTarefaSelecionada.remove();
        tarefas.filter(t=> t!= tarefaSelecionada);
        itemTarefaSelecionada = null;
        tarefaSelecionada = null;
    }
    updateLocalStorage();
    limparForm();
})

btnDeletarTodas.addEventListener('click', () => {
    // Remove todas as tarefas
    tarefas = [];
    taskListContainer.innerHTML = '';
    updateLocalStorage();
    limparForm();
});

btnDeletarConcluidas.addEventListener('click', () => {
    // Remove todas as tarefas concluídas
    tarefas = tarefas.filter(tarefa => !tarefa.concluida);
    taskListContainer.innerHTML = '';
    tarefas.forEach(task => {
        const taskItem = createTask(task);
        taskListContainer.appendChild(taskItem);
    });
    updateLocalStorage();
    limparForm();
});

localStorage.setItem('quantidade', 10)

document.addEventListener('TarefaFinalizada', function (e) {
    if(tarefaSelecionada)
    {
        tarefaSelecionada.concluida = true;
        itemTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        itemTarefaSelecionada.querySelector('button').setAttribute('disabled', true);
        updateLocalStorage();
    }
})