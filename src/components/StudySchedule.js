import React, { useState, useEffect, useRef } from "react";
import "./StudySlider.css";

const StudySlider = () => {
  const schedule = [
    { day: "Monday", subject: "Computer Graphics + Lab", time: "4:00 PM - 6:30 PM" },
    { day: "Tuesday", subject: "Operating Systems + Lab", time: "4:00 PM - 6:30 PM" },
    { day: "Wednesday", subject: "Computer Networks", time: "4:00 PM - 6:30 PM" },
    { day: "Thursday", subject: "Organizational Behavior", time: "4:00 PM - 6:30 PM" },
    { day: "Friday", subject: "Aptitude Building", time: "4:00 PM - 6:30 PM" },
    { day: "Saturday", subject: "Indian Constitution", time: "4:00 PM - 6:30 PM" },
    { day: "Sunday", subject: "Relax & Enjoy!", time: "No Studies Today" },
  ];

  const [currentDay, setCurrentDay] = useState("");
  const cardContainerRef = useRef(null);

  useEffect(() => {
    const today = new Date().toLocaleString("en-US", { weekday: "long" });
    setCurrentDay(today);

    // Center today's card after the component renders
    const index = schedule.findIndex((session) => session.day === today);
    if (index !== -1 && cardContainerRef.current) {
      const card = cardContainerRef.current.children[index];
      const containerWidth = cardContainerRef.current.offsetWidth;
      const cardWidth = card.offsetWidth;
      const scrollPosition = card.offsetLeft - containerWidth / 2 + cardWidth / 2;

      cardContainerRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
    }
  }, [schedule]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!cardContainerRef.current) return;

    const scrollAmount = 300; // Pixels to scroll with each key press
    if (e.key === "ArrowRight") {
      cardContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    } else if (e.key === "ArrowLeft") {
      cardContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Add keydown event listener
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      // Cleanup on unmount
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="slider-container">
      <button
        className="slider-button"
        onClick={() =>
          cardContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
        }
      >
        {"<"}
      </button>
      <div className="card-container" ref={cardContainerRef}>
        {schedule.map((session, index) => (
          <div
            key={index}
            className={`study-card ${
              session.day === currentDay ? "highlighted" : ""
            }`}
          >
            <p className="day-text">{session.day}</p>
            <p className="subject-text">{session.subject}</p>
            <p className="time-text">{session.time}</p>
          </div>
        ))}
      </div>
      <button
        className="slider-button"
        onClick={() =>
          cardContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
        }
      >
        {">"}
      </button>
    </div>
  );
};

export default StudySlider;
