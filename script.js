document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleButton');
    const sidebar = document.getElementById('sidebar');
    const employeeList = document.getElementById('employeeList');
    const employeeNameInput = document.getElementById('employeeName');

    // Функция для загрузки сотрудников из localStorage
    function loadEmployees() {
        const employees = JSON.parse(localStorage.getItem('employees')) || [];
        employees.forEach(employeeName => {
            addEmployeeToList(employeeName);
        });
    }

    // Функция для добавления сотрудника в список
    function addEmployeeToList(employeeName) {
        const newEmployeeItem = document.createElement('li');
        newEmployeeItem.textContent = employeeName;

        // Добавляем обработчик события для выбора элемента
        newEmployeeItem.addEventListener('click', function() {
            this.classList.toggle('selected');
        });

        employeeList.appendChild(newEmployeeItem);
    }

    // Загрузка сотрудников при загрузке страницы
    loadEmployees();

    // Обработчик события для кнопки переключения боковой панели
    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('active');

        if (sidebar.classList.contains('active')) {
            this.textContent = '←';
        } else {
            this.textContent = '→';
        }
    });

    // Обработчик события для кнопки "Добавить сотрудника"
    document.getElementById('addEmployeeButton').addEventListener('click', function() {
        const employeeName = employeeNameInput.value.trim();

        if (employeeName) {
            addEmployeeToList(employeeName);

            // Сохраняем нового сотрудника в localStorage
            const employees = JSON.parse(localStorage.getItem('employees')) || [];
            employees.push(employeeName);
            localStorage.setItem('employees', JSON.stringify(employees));

            employeeNameInput.value = '';
        } else {
            alert('Пожалуйста, введите имя сотрудника.');
        }
    });

    // Обработчик события для кнопки "Удалить выбранного сотрудника"
    document.getElementById('removeEmployeeButton').addEventListener('click', function() {
        const selectedEmployees = employeeList.querySelectorAll('.selected');

        selectedEmployees.forEach(employee => {
            employeeList.removeChild(employee);
        });

        // Обновляем localStorage
        const employees = Array.from(employeeList.children).map(item => item.textContent);
        localStorage.setItem('employees', JSON.stringify(employees));
    });
});
