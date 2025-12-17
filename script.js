const TIET_TIME = {
  1: ["06:45", "08:00"],
  2: ["08:10", "09:25"],
  3: ["09:35", "10:50"],
  4: ["11:00", "12:15"],
  5: ["13:00", "14:15"],
  6: ["14:25", "15:40"],
  7: ["15:50", "17:05"],
  8: ["17:15", "18:30"],
  9: ["18:40", "19:55"],
};

const schedule = [
  { day: "T3", start: 5, duration: 2, subject: "Pháp luật đại cương", room: "D-304" },
  { day: "T5", start: 3, duration: 2, subject: "Toán cho các nhà kinh tế", room: "D-407" },
  { day: "T6", start: 1, duration: 2, subject: "Kinh tế vi mô 1", room: "D-501" },
];

const app = document.getElementById("app");
const cd = document.getElementById("countdown");

const dayMap = ["CN","T2","T3","T4","T5","T6","T7"];
let mode = "today";

// ===== UTIL =====
function toMinutes(t) {
  const [h,m] = t.split(":").map(Number);
  return h * 60 + m;
}

function nowInfo() {
  const n = new Date();
  return {
    day: dayMap[n.getDay()],
    min: n.getHours()*60 + n.getMinutes()
  };
}

// ===== RENDER =====
function render() {
  app.innerHTML = "";
  const { day, min } = nowInfo();

  const days = mode === "today"
    ? [day]
    : ["T2","T3","T4","T5","T6","T7"];

  days.forEach(d => {
    const items = schedule.filter(s => s.day === d);
    if (items.length === 0) return;

    const div = document.createElement("div");
    div.className = "day";
    div.innerHTML = `<h3>${d}${d === day ? " (Hôm nay)" : ""}</h3>`;

    items.forEach(s => {
      const start = TIET_TIME[s.start][0];
      const end = TIET_TIME[s.start + s.duration - 1][1];

      const isCurrent =
        d === day &&
        min >= toMinutes(start) &&
        min <= toMinutes(end);

      div.innerHTML += `
        <div class="card ${isCurrent ? "current" : ""}">
          <div class="time">${start} – ${end} ${isCurrent ? "🟢 ĐANG HỌC" : ""}</div>
          <div class="subject">${s.subject}</div>
          <div class="room">📍 ${s.room}</div>
        </div>
      `;
    });

    app.appendChild(div);
  });

  updateCountdown(day, min);
}

// ===== COUNTDOWN =====
function updateCountdown(today, min) {
  const next = schedule
    .filter(s => s.day === today)
    .map(s => ({ ...s, t: toMinutes(TIET_TIME[s.start][0]) }))
    .filter(s => s.t > min)
    .sort((a,b) => a.t - b.t)[0];

  if (!next) {
    cd.innerHTML = "🎉 Hôm nay không còn tiết nào nữa";
  } else {
    cd.innerHTML =
      `⏳ Còn <b>${next.t - min}</b> phút nữa tới <b>${next.subject}</b> (${next.room})`;
  }
}

// ===== BUTTONS =====
function showToday() {
  mode = "today";
  render();
}

function showAll() {
  mode = "all";
  render();
}

// ===== AUTO REFRESH =====
render();
setInterval(render, 60000);
