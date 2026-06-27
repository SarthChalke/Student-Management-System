// Attendance page logic

function loadAttStudents() {
  const branch = document.getElementById('attBranch').value;
  const year   = document.getElementById('attYear').value;
  const container = document.getElementById('attendanceList');
  if (!branch || !year) { container.innerHTML = '<p style="color:#6b7280">Select branch and year to load students.</p>'; return; }
  const students = DB.query('students', s => s.branch === branch && String(s.year) === year);
  if (!students.length) { container.innerHTML = '<p style="color:#6b7280">No students found for this selection.</p>'; return; }
  let html = '<table class="data-table"><thead><tr><th>Roll No</th><th>Name</th><th>Present</th><th>Absent</th></tr></thead><tbody>';
  students.forEach(s => {
    html += `<tr>
      <td>${s.rollNo}</td><td>${s.name}</td>
      <td><label style="cursor:pointer"><input type="radio" name="att_${s.id}" value="Present" checked> Present</label></td>
      <td><label style="cursor:pointer"><input type="radio" name="att_${s.id}" value="Absent"> Absent</label></td>
    </tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
  container.dataset.students = JSON.stringify(students.map(s => ({ id: s.id, rollNo: s.rollNo, name: s.name })));
}

function saveAttendance() {
  const branch  = document.getElementById('attBranch').value;
  const year    = document.getElementById('attYear').value;
  const date    = document.getElementById('attDate').value;
  const subject = document.getElementById('attSubject').value;
  const container = document.getElementById('attendanceList');
  if (!branch || !year || !date) { alert('Please select branch, year and date.'); return; }
  const students = JSON.parse(container.dataset.students || '[]');
  if (!students.length) { alert('No students loaded.'); return; }
  const records = students.map(s => {
    const radios = document.querySelectorAll(`input[name="att_${s.id}"]`);
    let status = 'Present';
    radios.forEach(r => { if (r.checked) status = r.value; });
    return { studentId: s.id, rollNo: s.rollNo, name: s.name, status };
  });
  const present = records.filter(r => r.status === 'Present').length;
  DB.insert('attendance', { date, branch, year: parseInt(year), subject, records, present, absent: records.length - present, total: records.length });
  alert('Attendance saved successfully!');
  loadAttRecords();
}

function loadAttRecords() {
  const tbody = document.getElementById('attRecords');
  const records = DB.getAll('attendance').reverse();
  tbody.innerHTML = '';
  if (!records.length) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;color:#6b7280;">No records yet.</td></tr>'; return; }
  records.forEach(a => {
    tbody.innerHTML += `<tr>
      <td>${a.date}</td><td>${a.branch}</td><td>${a.year}</td>
      <td>${a.subject || '-'}</td>
      <td style="color:#059669;font-weight:600;">${a.present}</td>
      <td style="color:#dc2626;font-weight:600;">${a.absent}</td>
      <td>${a.total}</td>
    </tr>`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('attDate').value = new Date().toISOString().split('T')[0];
  loadAttRecords();
});
