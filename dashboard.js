// Dashboard page logic

document.addEventListener('DOMContentLoaded', () => {
  // Stats
  const students  = DB.getAll('students');
  const courses   = DB.getAll('courses');
  const faculty   = DB.getAll('faculty');
  const fees      = DB.getAll('fees');
  const notices   = DB.getAll('notices');
  const attendance = DB.getAll('attendance');

  document.getElementById('totalStudents').textContent = students.length;
  document.getElementById('totalCourses').textContent  = courses.length;
  document.getElementById('totalFaculty').textContent  = faculty.length;
  document.getElementById('feePending').textContent    = fees.filter(f => f.status !== 'Paid').length;

  // Recent Students
  const tbody = document.getElementById('recentStudents');
  students.slice(-5).reverse().forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${s.rollNo}</td><td>${s.name}</td><td>${s.branch.split(' ')[0]}</td><td>${s.year}</td>`;
    tbody.appendChild(tr);
  });

  // Bar chart - attendance per session
  const chart = document.getElementById('barChart');
  const maxPct = 100;
  attendance.slice(-5).forEach(a => {
    const pct = a.total ? Math.round((a.present / a.total) * 100) : 0;
    const div = document.createElement('div');
    div.className = 'bar-item';
    div.innerHTML = `
      <span class="bar-value">${pct}%</span>
      <div class="bar" style="height:${pct * 1.3}px; background: ${pct >= 75 ? '#059669' : pct >= 60 ? '#d97706' : '#dc2626'}"></div>
      <span class="bar-label">${a.subject?.substring(0,6) || a.date}</span>
    `;
    chart.appendChild(div);
  });

  // Notices
  const noticeList = document.getElementById('noticeList');
  notices.slice(0,4).forEach(n => {
    const div = document.createElement('div');
    div.className = 'notice-item';
    div.innerHTML = `<div class="notice-title">📌 ${n.title}</div><div class="notice-date">${new Date(n.date).toLocaleDateString('en-IN')}</div>`;
    noticeList.appendChild(div);
  });
});
