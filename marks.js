// Marks page logic

function loadMarkStudents() {
  const branch = document.getElementById('markBranch').value;
  const year   = document.getElementById('markYear').value;
  const sem    = document.getElementById('markSemester').value;
  let records  = DB.getAll('marks');
  if (branch) records = records.filter(m => m.branch === branch);
  if (year) records = records.filter(m => String(m.year) === year);
  if (sem) records = records.filter(m => String(m.semester) === sem);
  renderMarks(records);
}

function renderMarks(list) {
  const tbody = document.getElementById('marksTableBody');
  tbody.innerHTML = '';
  if (!list.length) { tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:30px;color:#6b7280;">No records found.</td></tr>'; return; }
  list.forEach(m => {
    const resultBadge = m.result === 'Pass' ? 'badge-success' : 'badge-danger';
    const gradeBadge  = m.grade === 'Distinction' ? 'badge-info' : m.grade === 'First Class' ? 'badge-success' : 'badge-warning';
    tbody.innerHTML += `<tr>
      <td>${m.rollNo || '-'}</td>
      <td>${m.studentName || '-'}</td>
      <td>${(m.branch || '-').split(' ')[0]}</td>
      <td>Sem ${m.semester}</td>
      <td>${m.totalMarks}</td>
      <td>${m.obtained}</td>
      <td><strong>${m.percentage}%</strong></td>
      <td><span class="badge ${gradeBadge}">${m.grade}</span></td>
      <td><span class="badge ${resultBadge}">${m.result}</span></td>
      <td>
        <button class="btn-edit" onclick="editMark(${m.id})">✏️</button>
        <button class="btn-danger" onclick="deleteMark(${m.id})">🗑️</button>
      </td>
    </tr>`;
  });
}

function openMarksModal(id = null) {
  document.getElementById('marksModal').style.display = 'flex';
  document.getElementById('marksForm').reset();
  document.getElementById('marksId').value = '';
  // Populate students dropdown
  const sel = document.getElementById('marksStudent');
  sel.innerHTML = '<option value="">Select Student</option>';
  DB.getAll('students').forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.rollNo} - ${s.name}`;
    sel.appendChild(opt);
  });
  if (id) {
    const m = DB.getById('marks', id);
    if (m) {
      document.getElementById('marksId').value = m.id;
      document.getElementById('marksStudent').value = m.studentId;
      document.getElementById('marksSem').value = m.semester;
      document.getElementById('marksTotal').value = m.totalMarks;
      document.getElementById('marksObtained').value = m.obtained;
      document.getElementById('marksPct').value = m.percentage + '%';
      document.getElementById('marksGrade').value = m.grade;
      document.getElementById('marksResult').value = m.result;
    }
  }
}
function closeMarksModal() { document.getElementById('marksModal').style.display = 'none'; }

function calcGrade() {
  const total = parseInt(document.getElementById('marksTotal').value) || 600;
  const obt   = parseInt(document.getElementById('marksObtained').value) || 0;
  const pct   = total > 0 ? ((obt / total) * 100).toFixed(1) : 0;
  const grade = pct >= 75 ? 'Distinction' : pct >= 60 ? 'First Class' : pct >= 50 ? 'Second Class' : pct >= 40 ? 'Pass Class' : 'Fail';
  document.getElementById('marksPct').value = pct + '%';
  document.getElementById('marksGrade').value = grade;
  document.getElementById('marksResult').value = pct >= 40 ? 'Pass' : 'Fail';
}

function editMark(id) { openMarksModal(id); }
function deleteMark(id) {
  if (!confirm('Delete this record?')) return;
  DB.delete('marks', id);
  loadMarkStudents();
}

document.getElementById('marksForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const id = parseInt(document.getElementById('marksId').value) || null;
  const sId = parseInt(document.getElementById('marksStudent').value);
  const student = DB.getById('students', sId);
  const total = parseInt(document.getElementById('marksTotal').value);
  const obt   = parseInt(document.getElementById('marksObtained').value);
  const pct   = ((obt / total) * 100).toFixed(1);
  const grade = pct >= 75 ? 'Distinction' : pct >= 60 ? 'First Class' : pct >= 50 ? 'Second Class' : pct >= 40 ? 'Pass Class' : 'Fail';
  const data  = { studentId: sId, rollNo: student?.rollNo, studentName: student?.name, branch: student?.branch, year: student?.year, semester: parseInt(document.getElementById('marksSem').value), totalMarks: total, obtained: obt, percentage: parseFloat(pct), grade, result: document.getElementById('marksResult').value };
  id ? DB.update('marks', id, data) : DB.insert('marks', data);
  closeMarksModal();
  loadMarkStudents();
});

document.addEventListener('DOMContentLoaded', () => renderMarks(DB.getAll('marks')));
