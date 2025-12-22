import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [currentView, setCurrentView] = useState("table");

  const [taskText, setTaskText] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [newStatusText, setNewStatusText] = useState("");

  const [draggedId, setDraggedId] = useState(null);

  // ===== Загрузка из LocalStorage =====
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const savedStatuses = JSON.parse(localStorage.getItem("statuses")) || [
      "На очереди",
      "В работе",
      "На проверке",
      "Завершено",
    ];

    setTasks(savedTasks);
    setStatuses(savedStatuses);
  }, []);

  // ===== Сохранение в LocalStorage =====
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("statuses", JSON.stringify(statuses));
  }, [tasks, statuses]);

  // ===== Добавление задачи =====
  const addTask = () => {
    if (!taskText.trim() || !taskDate) {
      alert("Введите текст и дату задачи");
      return;
    }

    const newTask = {
      id: Date.now(),
      text: taskText.trim(),
      date: taskDate,
      status: statuses[0],
    };

    setTasks([...tasks, newTask]);
    setTaskText("");
    setTaskDate("");
  };

  // ===== Удаление задачи =====
  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // ===== Добавление статуса =====
  const addStatus = () => {
    if (!newStatusText.trim()) return;
    setStatuses([...statuses, newStatusText.trim()]);
    setNewStatusText("");
  };

  // ===== Drag & Drop =====
  const handleDrop = (status) => {
    if (draggedId === null) return;

    setTasks(
      tasks.map((task) => (task.id === draggedId ? { ...task, status } : task))
    );

    setDraggedId(null);
  };

  return (
    <div className="App">
      <h1>Менеджер задач</h1>

      {/* ===== Добавление задачи ===== */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Текст задачи"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <input
          type="date"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
        />
        <button onClick={addTask}>Добавить</button>
      </div>

      {/* ===== Управление статусами ===== */}
      <h3>Управление статусами</h3>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Новый статус"
          value={newStatusText}
          onChange={(e) => setNewStatusText(e.target.value)}
        />
        <button onClick={addStatus}>Добавить статус</button>
      </div>

      {/* ===== Переключение видов ===== */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setCurrentView("table")}>Таблица</button>
        <button onClick={() => setCurrentView("blocks")}>Блоки</button>
      </div>

      {/* ===== Табличный вид ===== */}
      {currentView === "table" && (
        <table border="1" width="700">
          <thead>
            <tr>
              <th>ID</th>
              <th>Задача</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.text}</td>
                <td>{task.date}</td>
                <td>{task.status}</td>
                <td>
                  <button onClick={() => deleteTask(task.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ===== Блочный вид (Drag & Drop) ===== */}
      {currentView === "blocks" && (
        <div style={{ display: "flex", gap: "20px" }}>
          {statuses.map((status) => (
            <div
              key={status}
              className="status-column"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(status)}
            >
              <h2>{status}</h2>

              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <div
                    key={task.id}
                    className="task-card"
                    draggable
                    onDragStart={() => setDraggedId(task.id)}
                  >
                    <h4>{task.text}</h4>
                    <p>{task.date}</p>
                    <button onClick={() => deleteTask(task.id)}>🗑</button>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
