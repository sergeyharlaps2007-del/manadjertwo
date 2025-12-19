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
    const savedStatuses =
      JSON.parse(localStorage.getItem("statuses")) || [
        "На очереди",
        "В работе",
        "На проверке",
        "Завершено",
      ];
    setTasks(savedTasks);
    setStatuses(savedStatuses);
  }, []);