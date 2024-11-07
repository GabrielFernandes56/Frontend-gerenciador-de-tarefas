const apiUrl = 'http://localhost:8080/api/tarefas';


function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;

    document.body.appendChild(notification);

    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(notification), 500);
    }, 2000);
}


async function addTask() {
    const description = document.getElementById('taskDescription').value.trim();
    if (!description) {
        alert('Por favor, insira uma descrição para a tarefa.');
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ descricao: description, concluida: false }),
        });

        if (!response.ok) throw new Error('Erro ao adicionar tarefa');

        
        document.getElementById('taskDescription').value = '';
        showNotification('Tarefa adicionada com sucesso!');
        fetchTasks();  
    } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
        alert("Não foi possível adicionar a tarefa.");
    }
}


async function fetchTasks() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Erro ao buscar tarefas');

        const tasks = await response.json();
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';  

        tasks.forEach(task => {
            const listItem = document.createElement('li');
            
            
            listItem.classList.add(task.concluida ? 'completed' : 'pending');

            listItem.innerHTML = `
                <span>${task.descricao || 'Sem descrição'}</span>
                <div>
                    ${task.concluida ? 
                        '<span class="check-icon">✔</span>' : 
                        '<span class="check-icon"></span>'}
                    <button class="edit" onclick="toggleTask(${task.id}, ${task.concluida}, '${task.descricao}')">
                        ${task.concluida ? 'Desmarcar' : 'Concluir'}
                    </button>
                    <button onclick="deleteTask(${task.id})">Excluir</button>
                </div>
            `;
            taskList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
    }
}


async function toggleTask(id, isCompleted, descricao) {
    try {
        
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                concluida: !isCompleted,  
                descricao: descricao,     
            }),
        });

        if (!response.ok) throw new Error('Erro ao atualizar tarefa');

        showNotification('Tarefa atualizada com sucesso!');
        fetchTasks();  
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
    }
}


async function deleteTask(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao excluir tarefa');

        showNotification('Tarefa excluída com sucesso!');
        fetchTasks(); 
    } catch (error) {
        console.error("Erro ao excluir tarefa:", error);
    }
}


document.addEventListener('DOMContentLoaded', fetchTasks);