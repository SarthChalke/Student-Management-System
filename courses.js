// Courses page logic

function renderCourses() {
  const courses  = DB.getAll('courses');
  const students = DB.getAll('students');
  const grid = document.getElementById('coursesGrid');
  grid.innerHTML = '';
  courses.forEach(c => {
    const enrolled = students.filter(s => s.branch === c.name).length;
    const div = document.createElement('div');
    div.className = 'course-card';
    div.innerHTML = `
      <h3>${c.name}</h3>
      <p>📅 Duration: ${c.duration || '3 Years'}</p>
      <p>🎯 Intake: ${c.intake || 60} seats</p>
      <p>👨‍🎓 Enrolled: ${enrolled} students</p>
      <p>💰 Annual Fee: ₹${(c.fee || 0).toLocaleString('en-IN')}</p>
      <p style="margin-top:8px;font-size:13px;color:#6b7280;">${c.desc || ''}</p>
      <div class="course-actions">
        <button class="btn-edit" onclick="editCourse(${c.id})">✏️ Edit</button>
        <button class="btn-danger" onclick="deleteCourse(${c.id})">🗑️ Delete</button>
      </div>
    `;
    grid.appendChild(div);
  });
}

function openCourseModal(id = null) {
  document.getElementById('courseModal').style.display = 'flex';
  document.getElementById('courseForm').reset();
  document.getElementById('courseId').value = '';
  document.getElementById('courseModalTitle').textContent = id ? 'Edit Course' : 'Add Course';
  if (id) {
    const c = DB.getById('courses', id);
    if (c) {
      document.getElementById('courseId').value = c.id;
      document.getElementById('cName').value = c.name;
      document.getElementById('cDuration').value = c.duration || '';
      document.getElementById('cIntake').value = c.intake || '';
      document.getElementById('cDesc').value = c.desc || '';
      document.getElementById('cFee').value = c.fee || '';
    }
  }
}
function closeCourseModal() { document.getElementById('courseModal').style.display = 'none'; }
function editCourse(id) { openCourseModal(id); }
function deleteCourse(id) {
  if (!confirm('Delete this course?')) return;
  DB.delete('courses', id);
  renderCourses();
}

document.getElementById('courseForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const id = parseInt(document.getElementById('courseId').value) || null;
  const data = {
    name:     document.getElementById('cName').value,
    duration: document.getElementById('cDuration').value,
    intake:   parseInt(document.getElementById('cIntake').value) || 60,
    desc:     document.getElementById('cDesc').value,
    fee:      parseFloat(document.getElementById('cFee').value) || 0,
  };
  id ? DB.update('courses', id, data) : DB.insert('courses', data);
  closeCourseModal();
  renderCourses();
});

document.addEventListener('DOMContentLoaded', renderCourses);
