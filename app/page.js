"use client"

import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "react-feather";

const Home = () => {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState("");
  const [minutes, setMinutes] = useState("");

  const addPerson = (e) => {
    e.preventDefault();
    const departureTime = new Date();
    departureTime.setMinutes(departureTime.getMinutes() + parseInt(minutes));
    setPeople([
      ...people,
      { name, departureTime, initialTime: parseInt(minutes) * 60 * 1000 },
    ]);
    setName("");
    setMinutes("");
  };

  const removePerson = (index) => {
    setPeople(people.filter((_, i) => i !== index));
  };

  const addTime = (index, additionalMinutes) => {
    setPeople(
      people.map((person, i) => {
        if (i === index) {
          const newDepartureTime = new Date(
            person.departureTime.getTime() + additionalMinutes * 60 * 1000
          );
          return {
            ...person,
            departureTime: newDepartureTime,
            initialTime: person.initialTime + additionalMinutes * 60 * 1000,
          };
        }
        return person;
      })
    );
  };

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const getTimeRemaining = (departureTime) => {
    const now = new Date();
    let timeRemaining = departureTime - now;

    if (timeRemaining <= 0) {
      return "00:00:00";
    }

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
  };

  const getProgress = (departureTime, initialTime) => {
    const now = new Date();
    const elapsed = initialTime - (departureTime - now);
    return Math.min(100, (elapsed / initialTime) * 100);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setPeople((prevPeople) => {
        return prevPeople.map((person) => {
          if (person.departureTime <= now) {
            return { ...person, highlight: true };
          }
          return person;
        });
      });

      setPeople((prevPeople) => {
        return prevPeople.filter((person) => {
          if (
            person.departureTime <= now &&
            person.highlight &&
            now - person.departureTime >= 20000
          ) {
            return false;
          }
          return true;
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen m-auto flex flex-col items-center bg-zinc-900">
      <div className="flex flex-col items-center p-6 py-10 text-white">
        <div className="flex flex-col gap-3 justify-center items-center">
          <img
						src="https://pbs.twimg.com/media/F3kcnXdWcAAmXWj.jpg"
            className="h-32 w-32 rounded-2xl"
            alt="Avatar"
          />
          <h1 className="text-4xl mb-8 font-bold">Timer - Prisão</h1>
        </div>
        <form
          className="mb-4 w-full grid grid-cols-2 xl:grid-cols-3 gap-2.5"
          onSubmit={addPerson}
        >
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-zinc-800 placeholder:text-zinc-400 border border-white/0 p-2 rounded-lg outline-none focus:border-white/10"
          />
          <input
            type="number"
            placeholder="Minutos"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="bg-zinc-800 placeholder:text-zinc-400 border border-white/0 p-2 rounded-lg outline-none focus:border-white/10"
          />
          <button
            type="submit"
            className="bg-white text-zinc-900 py-2 px-4 rounded-lg font-semibold col-span-2 lg:col-span-1"
          >
            Adicionar
          </button>
        </form>
        <ul className="w-full">
          {people.map((person, index) => (
            <li
              key={index}
              className={`w-full overflow-hidden relative flex flex-col p-4 pb-6 mb-2 border border-white/10 rounded-xl ${
                person.highlight ? "bg-red-800 pulse" : "bg-zinc-800"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex flex-col">
                  <h1 className="text-white font-semibold text-2xl">
                    {person.name}
                  </h1>
                  <span>
                    <span className="font-medium text-sm">Horário de saída: </span>
                    {person.departureTime.toLocaleTimeString()}
                  </span>
                  <span>
                    <span className="font-medium text-sm">Tempo restante: </span>
                    {getTimeRemaining(person.departureTime)}
                  </span>
                </div>
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => addTime(index, 5)}
                    className="bg-white w-10 h-10 rounded-lg text-black font-bold"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => removePerson(index)}
                    className="bg-red-500 text-white w-10 h-10 rounded-lg flex items-center justify-center"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 flex-grow bg-white/10 w-full h-2">
                <div
                  className="bg-blue-500 h-2"
                  style={{
                    width: `${getProgress(person.departureTime, person.initialTime)}%`,
                    transition: ".2s",
                  }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
