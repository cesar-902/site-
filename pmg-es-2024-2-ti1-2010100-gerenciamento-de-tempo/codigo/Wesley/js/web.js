
////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    let isEdit = false;
    let editTaskId = null;
    const overlays = document.querySelectorAll('.overlay');
    const closeOverlay = (id) => document.getElementById(id).style.display = 'none';

    // Função para abrir overlay
    document.querySelectorAll('.overlay-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const overlay = document.getElementById(trigger.dataset.overlay);
            if (overlay) overlay.style.display = 'flex';
        });
    });

    // Fechar overlay quando clica fora
    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-btn') || e.target === overlay) {
                overlay.style.display = 'none';
            }
        });
    });

    // Função para adicionar repetição
    const RepeticaoList = document.getElementById('repeat');
    const addRepetition = () => {
        const tipo = document.getElementById('tipo').selectedOptions[0].text;
        const fimInfinito = document.getElementById('infinito').checked;
        const fimDataLimite = document.getElementById('data-limite').checked;
        const repeticao = `${tipo}${fimInfinito ? '/Infinito' : fimDataLimite ? '/Limite' : ''}`;
        RepeticaoList.textContent = repeticao;
        closeOverlay('overlay-2');
    };

    // Função para adicionar tag
    const tagsInput = document.getElementById('tags');
    const tagsList = document.getElementById('tags-criadas');
    const addTag = () => {
        const tagsValue = tagsInput.value.trim();
        if (tagsValue && !Array.from(tagsList.getElementsByTagName('span')).some(tag => tag.textContent.trim() === `#${tagsValue}`)) {
            tagsList.innerHTML += `<span>#${tagsValue} </span>`;
            tagsInput.value = '';
        } else if (tagsValue) {
            alert('A tag já existe!');
        }
    };

    // Função para validar e adicionar e-mail
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const emailInput = document.getElementById('emails');
    const usersList = document.getElementById('users');
    const addEmail = () => {
        const emailValue = emailInput.value.trim();
        if (emailValue && isValidEmail(emailValue)) {
            if (!Array.from(usersList.getElementsByTagName('span')).some(user => user.textContent.trim() === emailValue)) {
                usersList.innerHTML += `<span>${emailValue}</span> `;
                emailInput.value = '';
                closeOverlay('overlay-4');
            } else {
                alert('Este e-mail já está na lista!');
            }
        } else {
            alert('Por favor, insira um e-mail válido!');
        }
    };

    // Função para adicionar pausas
    const IntervaloInput = document.getElementById('intervalo');
    const IntervaloList = document.getElementById('pauses');
    const addPauses = () => {
        const IntervaloValue = IntervaloInput.value.trim();
        if (IntervaloValue && !isNaN(IntervaloValue)) {
            IntervaloList.textContent = `A cada ${IntervaloValue} Min`;
            closeOverlay('overlay-5');
        }
        else {
            alert('Digite apenas números!');
        }
    };
    //Função para criar uma tarefa
    //////////////////////////////////////////////////////////
    // Recuperar
    const tasks = JSON.parse(localStorage.getItem('tarefas')) || [];
    const loadTasks = () => {
        if (tasks.length > 0) {
            tasks.forEach(task => addDiv(task));
        }
    };

    //Adicionar Div
    const TarefaElement = document.querySelector('.colunas');

    const addDiv = (task) => {
        const TarefaValue = document.createElement('div');
        TarefaValue.classList.add('tarefa');
        TarefaValue.dataset.taskId = task.id;
        TarefaValue.innerHTML = `<h3>${task.nome}</h3>`;
        TarefaElement.appendChild(TarefaValue);
        TarefaValue.addEventListener('click', () => showTasks(task));
    }
    //Descrição
    const descricaoInput = document.getElementById('descricao');
    // Adicionar tarefa
    let taskId = tasks.length > 0 ? tasks[tasks.length - 1].id : 0; //buscar os valores
    const addTarefas = () => {
        //Criar data de criação
        const newDate = new Date();
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, '0'); 
        const day = String(newDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        const nomeInput = document.getElementById('nome');
        const nomeValue = nomeInput.value.trim();
        const dataLimiteValue = document.getElementById('limit-date').value;
        if (nomeValue != '') {
            taskId++;
            // Adicionar dados
            const newTask = {
                id: taskId,
                nome: nomeValue,
                descricao: descricaoInput.value.trim(),
                dataCriacao: formattedDate,
                dataLimite: dataLimiteValue, 
                repeticao: RepeticaoList.textContent,
                tags: Array.from(tagsList.getElementsByTagName('span')).map(tag => tag.textContent.trim()),
                emails: Array.from(usersList.getElementsByTagName('span')).map(email => email.textContent.trim()),
                pausas: IntervaloList.textContent,
                deletado: false,
                progresso: 0,
                status: "Pendente"
            };
            tasks.push(newTask);
            localStorage.setItem('tarefas', JSON.stringify(tasks));
            addDiv(newTask);
            ResetValue(nomeInput); //Passar o nomeinput para resetar
        } else {
            alert('Digite um nome');
        }
    };
    //Reseta valores
    function ResetValue (nomeInput){
        nomeInput.value = '';
        descricaoInput.value = '';
        RepeticaoList.innerHTML = '';
        tagsList.innerHTML = '';
        usersList.innerHTML = '';
        IntervaloList.innerHTML = '';
        document.getElementById('limit-date').value = '';
        console.log(tasks);
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Selecionar
    const addSpan = (spanId, elements) => {
        const span = document.getElementById(spanId);
        span.innerHTML = '';

        elements.forEach(element => {
            span.innerHTML += `<span>${element}</span> `;
        });
    };

    const showTasks = (task) => {
        document.querySelectorAll('.tarefa').forEach(tarefa => {
            tarefa.classList.remove('tarefa-selecionada');
        }); //Retirar borda
        document.getElementById('nome').value = task.nome;
        document.getElementById('descricao').value = task.descricao;
        document.getElementById('limit-date').value = task.dataLimite;
        document.getElementById('repeat').textContent = task.repeticao;
        addSpan('tags-criadas', task.tags);
        addSpan('users', task.emails);
        document.getElementById('pauses').textContent = task.pausas;
        isEdit = true;
        editTaskId = task.id
        const tarefaElement = document.querySelector(`[data-task-id="${task.id}"]`);
        if (tarefaElement) {
            tarefaElement.classList.add('tarefa-selecionada');
        } //atualizar borda
    };
    /////////////////////////////////
    //Atualizar
    const updateTask =() =>{
        if (isEdit && editTaskId !== null){
            const nomeValue = document.getElementById('nome').value.trim();
            if (nomeValue !== ''){
                const dataLimiteValue = document.getElementById('limit-date').value;
                const taskIndex = tasks.findIndex(task => task.id === editTaskId)
                if (taskIndex !== -1){
                    tasks[taskIndex] = {
                        ...tasks[taskIndex],
                        nome: nomeValue,
                        descricao: descricaoInput.value.trim(),
                        dataLimite: dataLimiteValue,
                        repeticao: RepeticaoList.textContent,
                        tags: Array.from(tagsList.getElementsByTagName('span')).map(tag => tag.textContent.trim()),
                        emails: Array.from(usersList.getElementsByTagName('span')).map(email => email.textContent.trim()),
                        pausas: IntervaloList.textContent
                    };
                    localStorage.setItem('tarefas', JSON.stringify(tasks));
                    TarefaElement.innerHTML = '';
                    loadTasks(); //Atualizar tarefas
                    ResetValue(nomeValue);
                    cancelEdit();                }
            }
            else{
                alert('Digite um nome');
            }}
        else{
            alert('Selecione uma tarefa');
        }
    }
    function cancelEdit(){
        isEdit = false;
        editTaskId = false;
    }
    document.querySelector('.acoes.atualizar').addEventListener('click', updateTask);
    /////////////////////////////////
    // Deletar
    const deleteTask = () =>{
        const taskIndex = tasks.findIndex(task => task.id === editTaskId);
        const nomeValue = document.getElementById('nome').value.trim();
        if (taskIndex !== -1) {
            confirm('Você tem certeza?');
            if (confirm){
                tasks.splice(taskIndex, 1);
                localStorage.setItem('tarefas', JSON.stringify(tasks));
                ResetValue(nomeValue);
                TarefaElement.innerHTML = '';
                nomeValue.value = '';
                cancelEdit();
                loadTasks();
                alert('Tarefa excluída com sucesso');
            }}
    }
    document.querySelector('.acoes.deletar').addEventListener('click', deleteTask);
    ///////////////////////////////////////////////////////////////////
    // Adicionar eventos
    const addButtonEvent = (selector, action) => document.querySelector(selector).addEventListener('click', action);
    const addEnterEvent = (inputSelector, action) => {
        document.querySelector(inputSelector).addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                action();
            }
        });
    };
    //Fechar overlay com ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            overlays.forEach(overlay => {
                closeOverlay(overlay.id);
            });
        }
    });
    addButtonEvent('#overlay-2 .ok', addRepetition);
    addButtonEvent('#overlay-3 .ok', addTag);
    addButtonEvent('#overlay-4 .ok', addEmail);
    addButtonEvent('#overlay-5 .ok', addPauses);
    addEnterEvent('#tags', addTag);
    addEnterEvent('#emails', addEmail);
    addEnterEvent('#intervalo', addPauses);
    addButtonEvent('.adicionar', addTarefas);

    loadTasks();
});
/////////////////////////