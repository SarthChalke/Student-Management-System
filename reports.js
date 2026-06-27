// Reports page logic

function generateReport(type) {
  const output  = document.getElementById('reportOutput');
  const title   = document.getElementById('reportTitle');
  const content = document.getElementById('reportContent');
  output.style.display = 'block';
  output.scrollIntoView({ behavior: 'smooth' });

  const college = 'Smt. Geeta D. Tatkare Polytechnic College, Roha';
  const today   = new Date().toLocaleDateString('en-IN');
  const header  = `<div style="text-align:center;margin-bottom:20px;padding-bottom:12px;border-bottom:2px solid #1a56db;">
    <h2 style="color:#1a56db;">🎓 ${college}</h2>
    <p style="color:#6b7280;">Generated on: ${today}</p>
  </div>`;

  if (type === 'students') {
    title.textContent = 'Student List Report';
    const students = DB.getAll('students');
    const byBranch = {};
    students.forEach(s => { byBranch[s.branch] = (byBranch[s.branch] || []).concat(s); });
    let html = header + `<p><strong>Total Students:</strong> ${students.length}</p><br/>`;
    Object.entries(byBranch).forEach(([branch, list]) => {
      html += `<h4 style="margin:16px 0 8px;color:#1a56db;">${branch} (${list.length} students)</h4>
        <table class="data-table" style="margin-bottom:16px;"><thead><tr><th>Roll No</th><th>Name</th><th>Year</th><th>Gender</th><th>Contact</th><th>Fee Status</th></tr></thead><tbody>
        ${list.map(s => `<tr><td>${s.rollNo}</td><td>${s.name}</td><td>${s.year}st/nd/rd Year</td><td>${s.gender||'-'}</td><td>${s.contact||'-'}</td><td>${s.feeStatus}</td></tr>`).join('')}
        </tbody></table>`;
    });
    content.innerHTML = html;
  } else if (type === 'attendance') {
    title.textContent = 'Attendance Report';
    const records = DB.getAll('attendance');
    let html = header + `<p><strong>Total Sessions:</strong> ${records.length}</p><br/>
      <table class="data-table"><thead><tr><th>Date</th><th>Branch</th><th>Year</th><th>Subject</th><th>Present</th><th>Absent</th><th>Total</th><th>%</th></tr></thead><tbody>
      ${records.map(a => `<tr><td>${a.date}</td><td>${a.branch.split(' ')[0]}</td><td>${a.year}</td><td>${a.subject||'-'}</td>
        <td style="color:#059669;">${a.present}</td><td style="color:#dc2626;">${a.absent}</td><td>${a.total}</td>
        <td>${a.total ? Math.round((a.present/a.total)*100) : 0}%</td></tr>`).join('')}
      </tbody></table>`;
    content.innerHTML = html;
  } else if (type === 'marks') {
    title.textContent = 'Results Report';
    const marks = DB.getAll('marks');
    const pass  = marks.filter(m => m.result === 'Pass').length;
    const fail  = marks.filter(m => m.result === 'Fail').length;
    let html = header + `<div style="display:flex;gap:24px;margin-bottom:20px;">
      <div style="background:#d1fae5;padding:12px 20px;border-radius:8px;"><strong>${pass}</strong> Passed</div>
      <div style="background:#fee2e2;padding:12px 20px;border-radius:8px;"><strong>${fail}</strong> Failed</div>
      <div style="background:#dbeafe;padding:12px 20px;border-radius:8px;"><strong>${marks.length}</strong> Total</div>
    </div>
    <table class="data-table"><thead><tr><th>Roll No</th><th>Name</th><th>Branch</th><th>Sem</th><th>Obtained</th><th>Total</th><th>%</th><th>Grade</th><th>Result</th></tr></thead><tbody>
    ${marks.map(m => `<tr><td>${m.rollNo||'-'}</td><td>${m.studentName||'-'}</td><td>${(m.branch||'').split(' ')[0]}</td>
      <td>Sem ${m.semester}</td><td>${m.obtained}</td><td>${m.totalMarks}</td>
      <td>${m.percentage}%</td><td>${m.grade}</td>
      <td style="color:${m.result==='Pass'?'#059669':'#dc2626'};font-weight:600;">${m.result}</td></tr>`).join('')}
    </tbody></table>`;
    content.innerHTML = html;
  } else if (type === 'fees') {
    title.textContent = 'Fee Collection Report';
    const fees = DB.getAll('fees');
    const totalFee  = fees.reduce((s,f) => s + (f.totalFee||0), 0);
    const totalPaid = fees.reduce((s,f) => s + (f.paid||0), 0);
    let html = header + `<div style="display:flex;gap:24px;margin-bottom:20px;">
      <div style="background:#dbeafe;padding:12px 20px;border-radius:8px;">Total: ₹${totalFee.toLocaleString('en-IN')}</div>
      <div style="background:#d1fae5;padding:12px 20px;border-radius:8px;">Collected: ₹${totalPaid.toLocaleString('en-IN')}</div>
      <div style="background:#fee2e2;padding:12px 20px;border-radius:8px;">Pending: ₹${(totalFee-totalPaid).toLocaleString('en-IN')}</div>
    </div>
    <table class="data-table"><thead><tr><th>Roll No</th><th>Name</th><th>Branch</th><th>Total Fee</th><th>Paid</th><th>Balance</th><th>Status</th></tr></thead><tbody>
    ${fees.map(f => `<tr><td>${f.rollNo||'-'}</td><td>${f.studentName}</td><td>${(f.branch||'').split(' ')[0]}</td>
      <td>₹${(f.totalFee||0).toLocaleString('en-IN')}</td>
      <td style="color:#059669;">₹${(f.paid||0).toLocaleString('en-IN')}</td>
      <td style="color:#dc2626;">₹${(f.balance||0).toLocaleString('en-IN')}</td>
      <td>${f.status}</td></tr>`).join('')}
    </tbody></table>`;
    content.innerHTML = html;
  } else if (type === 'faculty') {
    title.textContent = 'Faculty Report';
    const faculty = DB.getAll('faculty');
    let html = header + `<p><strong>Total Faculty:</strong> ${faculty.length}</p><br/>
    <table class="data-table"><thead><tr><th>Emp ID</th><th>Name</th><th>Department</th><th>Designation</th><th>Qualification</th><th>Experience</th><th>Contact</th></tr></thead><tbody>
    ${faculty.map(f => `<tr><td>${f.empId}</td><td>${f.name}</td><td>${f.dept}</td><td>${f.designation}</td><td>${f.qualification||'-'}</td><td>${f.experience||0} yrs</td><td>${f.contact||'-'}</td></tr>`).join('')}
    </tbody></table>`;
    content.innerHTML = html;
  } else if (type === 'summary') {
    title.textContent = 'College Summary Report';
    const students = DB.getAll('students');
    const faculty  = DB.getAll('faculty');
    const courses  = DB.getAll('courses');
    const marks    = DB.getAll('marks');
    const fees     = DB.getAll('fees');
    const pass     = marks.filter(m => m.result === 'Pass').length;
    const collected = fees.reduce((s,f) => s + (f.paid||0), 0);
    let html = header + `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;">
      <div style="background:#f0f9ff;border:1px solid #bae6fd;padding:16px;border-radius:8px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#0369a1;">${students.length}</div><div>Total Students</div></div>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:16px;border-radius:8px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#15803d;">${faculty.length}</div><div>Faculty Members</div></div>
      <div style="background:#fefce8;border:1px solid #fde047;padding:16px;border-radius:8px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#a16207;">${courses.length}</div><div>Courses</div></div>
      <div style="background:#fdf4ff;border:1px solid #e9d5ff;padding:16px;border-radius:8px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#7e22ce;">${marks.length > 0 ? Math.round((pass/marks.length)*100) : 0}%</div><div>Pass Rate</div></div>
      <div style="background:#fff7ed;border:1px solid #fed7aa;padding:16px;border-radius:8px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#c2410c;">₹${(collected/100000).toFixed(1)}L</div><div>Fee Collected</div></div>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:16px;border-radius:8px;text-align:center;"><div style="font-size:28px;font-weight:700;color:#15803d;">${students.filter(s=>s.feeStatus==='Paid').length}</div><div>Fee Cleared</div></div>
    </div>
    <h4 style="margin-bottom:12px;">Branch-wise Enrollment</h4>
    <table class="data-table"><thead><tr><th>Branch</th><th>1st Year</th><th>2nd Year</th><th>3rd Year</th><th>Total</th></tr></thead><tbody>
    ${courses.map(c => {
      const y1 = students.filter(s=>s.branch===c.name&&s.year===1).length;
      const y2 = students.filter(s=>s.branch===c.name&&s.year===2).length;
      const y3 = students.filter(s=>s.branch===c.name&&s.year===3).length;
      return `<tr><td>${c.name}</td><td>${y1}</td><td>${y2}</td><td>${y3}</td><td><strong>${y1+y2+y3}</strong></td></tr>`;
    }).join('')}
    </tbody></table>`;
    content.innerHTML = html;
  }
}
