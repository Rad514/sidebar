import sqlite3
import openpyxl
from datetime import datetime, timedelta
import random
import requests
from bs4 import BeautifulSoup

# Получение HTML-кода с веб-сайта
try:
    response = requests.get('https://raw.githubusercontent.com/Rad514/sidebar/main/index.html')  # URL к HTML-файлу
    response.raise_for_status()  # Проверка на ошибки HTTP
    html_content = response.text  # Получаем текст HTML
except requests.RequestException as e:
    print(f"Ошибка при получении данных: {e}")
    exit(1)

# Парсинг HTML для извлечения сотрудников
soup = BeautifulSoup(html_content, 'html.parser')
employee_list = soup.find('ul', id='employeeList')
employees = [li.text for li in employee_list.find_all('li')]

# Проверка наличия сотрудников
if len(employees) < 6:
    print("Недостаточно сотрудников для формирования расписания.")
    exit(1)

# Создание или подключение к базе данных
conn = sqlite3.connect('employees.db')
cursor = conn.cursor()

# Создание таблицы для расписания смен
cursor.execute('''
CREATE TABLE IF NOT EXISTS schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    shift TEXT NOT NULL,
    master TEXT NOT NULL,
    operator TEXT NOT NULL,
    assistant1 TEXT NOT NULL,
    assistant2 TEXT NOT NULL,
    assistant3 TEXT NOT NULL,
    assistant4 TEXT NOT NULL
)
''')

# Создаем новую книгу и активный лист
workbook = openpyxl.Workbook()
sheet = workbook.active

# Заголовки таблицы
headers = ["Дата", "Смена", "Мастер", "Оператор", "Помощник 1", "Помощник 2", "Помощник 3", "Помощник 4"]
sheet.append(headers)

# Начальная дата и количество дней в месяце
start_date = datetime(2025, 3, 1)  # Замените на нужный вам месяц и год
num_days = 1  # Количество дней в месяце (можно изменить в зависимости от месяца)

# Заполняем таблицу данными
for day in range(num_days):
    current_date = start_date + timedelta(days=day)
    date_str = current_date.strftime("%d.%m")
    
    # Выбираем случайного мастера и оператора
    master = random.choice(employees)
    operator = random.choice(employees)
    
    # Выбираем 4 случайных помощника (операторы могут быть помощниками)
    selected_assistants = random.sample(employees, 4)

    # Добавляем дневную смену
    shift_data = [date_str, "Дневная", master, operator] + selected_assistants
    sheet.append(shift_data)
    
    # Сохраняем данные в базу данных
    cursor.execute('''
    INSERT INTO schedule (date, shift, master, operator, assistant1, assistant2, assistant3, assistant4)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', shift_data)

    # Добавляем ночную смену
    shift_data_night = [date_str, "Ночная", master, operator] + selected_assistants
    sheet.append(shift_data_night)
    
    # Сохраняем данные в базу данных
    cursor.execute('''
    INSERT INTO schedule (date, shift, master, operator, assistant1, assistant2, assistant3, assistant4)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', shift_data_night)

# Сохраняем изменения в базе данных и закрываем соединение
conn.commit()
conn.close()

# Сохраняем книгу
workbook.save("monthly_schedule.xlsx")