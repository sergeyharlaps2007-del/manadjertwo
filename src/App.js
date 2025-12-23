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

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

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
    if (!taskText.trim() || !taskDate) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: taskText.trim(),
        date: taskDate,
        status: statuses[0],
      },
    ]);

    setTaskText("");
    setTaskDate("");
  };

  // ===== Удаление задачи (НЕ ТРОГАЕМ) =====
  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // ===== Добавление статуса =====
  const addStatus = () => {
    if (!newStatusText.trim()) return;
    setStatuses([...statuses, newStatusText.trim()]);
    setNewStatusText("");
  };

  // ===== УДАЛЕНИЕ СТАТУСА =====
  const deleteStatus = (statusToDelete) => {
    if (!window.confirm(`Удалить статус "${statusToDelete}"?`)) return;

    const newStatuses = statuses.filter((s) => s !== statusToDelete);
    setStatuses(newStatuses);

    setTasks(
      tasks.map((task) =>
        task.status === statusToDelete
          ? { ...task, status: newStatuses[0] || "" }
          : task
      )
    );
  };

  // ===== Drag & Drop =====
  const handleDrop = (status) => {
    if (draggedId === null) return;

    setTasks(
      tasks.map((task) => (task.id === draggedId ? { ...task, status } : task))
    );

    setDraggedId(null);
  };

  // ===== Сохранение редактирования =====
  const saveEdit = (id) => {
    if (!editingText.trim()) return;

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: editingText.trim() } : task
      )
    );

    setEditingId(null);
    setEditingText("");
  };

  return (
    <div className="App">
      <h1>Менеджер задач</h1>

      {/* Добавление задачи */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
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

      {/* Добавление статуса */}
      <h3>Управление статусами</h3>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Новый статус"
          value={newStatusText}
          onChange={(e) => setNewStatusText(e.target.value)}
        />
        <button onClick={addStatus}>Добавить статус</button>
      </div>

      {/* Переключение вида */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setCurrentView("table")}>Таблица</button>
        <button onClick={() => setCurrentView("blocks")}>Блоки</button>
      </div>

      {/* Таблица */}
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

      {/* Блоки */}
      {currentView === "blocks" && (
        <div style={{ display: "flex", gap: 20 }}>
          {statuses.map((status) => (
            <div
              key={status}
              className="status-column"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(status)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2>{status}</h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteStatus(status);
                  }}
                >
                  🗑
                </button>
              </div>

              {tasks
                .filter((t) => t.status === status)
                .map((task) => (
                  <div
                    key={task.id}
                    className="task-card"
                    draggable
                    onDragStart={() => setDraggedId(task.id)}
                  >
                    <h4>{task.text}</h4>
                    <p>{task.date}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                    >
                      🗑
                    </button>
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
