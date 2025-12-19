import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [currentView, setCurrentView] = useState("table");
  const [taskText, setTaskText] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [newStatusText, setNewStatusText] = useState("");

  // Загрузка LocalStorage
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

  // Сохранение в LocalStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("statuses", JSON.stringify(statuses));
  }, [tasks, statuses]);

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
}
