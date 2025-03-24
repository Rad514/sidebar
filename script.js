// Получаем элементы из HTML
const employeeNameInput = document.getElementById('employeeNameInput');
const scheduleBody = document.getElementById('scheduleBody');
const addEmployeeButton = document.getElementById('addEmployee');
const removeEmployeeButton = document.getElementById('removeEmployee');
const quarantineEmployeeInput = document.getElementById('quarantineEmployeeInput');
const addQuarantineEmployeeButton = document.getElementById('addQuarantineEmployee');
const generateScheduleButton = document.getElementById('generateScheduleButton');

let employees = [];
let quarantineEmployees = [];

// Функция для загрузки сотрудников из базы данных
async function loadEmployees() {
    const response = await fetch('/employees');
    employees = await response.json();
    updateSchedule();
}

// Функция для добавления сотрудника
addEmployeeButton.addEventListener('click', async function () {
    const name = employeeNameInput.value.trim();
    if (name && !employees.some(emp => emp.name === name)) {
        await fetch('/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        loadEmployees();
        employeeNameInput.value = '';
    } else {
        alert('Сотрудник с таким именем уже существует или имя не указано.');
    }
});

// Функция для удаления сотрудника
removeEmployeeButton.addEventListener('click', async function () {
    const name = employeeNameInput.value.trim();
    if (name) {
        const employeeToRemove = employees.find(emp => emp.name === name);
        if (employeeToRemove) {
            await fetch(`/employees/${employeeToRemove.id}`, {
                method: 'DELETE'
            });
            loadEmployees();
            employeeNameInput.value = '';
        } else {
            alert('Сотрудник не найден.');
        }
    } else {
        alert('Введите имя сотрудника для удаления.');
    }
});

// Функция для добавления сотрудника в карантин
addQuarantineEmployeeButton.addEventListener('click', function () {
    const name = quarantineEmployeeInput.value.trim();
    if (name && !quarantineEmployees.includes(name)) {
        quarantineEmployees.push(name);
        quarantineEmployeeInput.value = '';
    } else {
        alert('Сотрудник с таким именем уже в карантине или имя не указано.');
    }
});

// Функция для генерации графика смен
generateScheduleButton.addEventListener('click', function () {
    updateSchedule();
});

// Функция для обнов