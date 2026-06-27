/**
 * SMS Database Layer
 * Uses localStorage to simulate SQLite tables.
 */

const DB = {

    // Generic CRUD
    _table(name) {
        return JSON.parse(localStorage.getItem('sms_' + name) || '[]');
    },

    _save(name, data) {
        localStorage.setItem('sms_' + name, JSON.stringify(data));
    },

    _nextId(name) {
        const rows = this._table(name);
        return rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    },

    insert(table, row) {
        const rows = this._table(table);
        row.id = this._nextId(table);
        row.createdAt = new Date().toISOString();
        rows.push(row);
        this._save(table, rows);
        return row;
    },

    update(table, id, changes) {
        const rows = this._table(table);
        const idx = rows.findIndex(r => r.id === id);

        if (idx === -1) return null;

        rows[idx] = {
            ...rows[idx],
            ...changes,
            updatedAt: new Date().toISOString()
        };

        this._save(table, rows);
        return rows[idx];
    },

    delete(table, id) {
        const rows = this._table(table).filter(r => r.id !== id);
        this._save(table, rows);
    },

    getAll(table) {
        return this._table(table);
    },

    getById(table, id) {
        return this._table(table).find(r => r.id === id) || null;
    },

    query(table, fn) {
        return this._table(table).filter(fn);
    },

    // Fresh Database Initialization
    init() {

        if (localStorage.getItem('sms_initialized')) return;

        // Keep only admin login
        this._save('users', [
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                role: 'admin',
                name: 'Administrator'
            }
        ]);

        // Empty tables
        this._save('students', [
{ id:1, enrollmentNo:'24152460311', name:'MAHADIK INDRAYANI GANESH' },
{ id:2, enrollmentNo:'24152460316', name:'KASKAR NIKITA AVADHUT' },
{ id:3, enrollmentNo:'24152460318', name:'THAKUR SNEHA GUNAJI' },
{ id:4, enrollmentNo:'24152460322', name:'PATIL DIPTI PANDURANG' },
{ id:5, enrollmentNo:'24152460326', name:'KALVANKAR PRIYA SAMEER' },
{ id:6, enrollmentNo:'24152460328', name:'KALE SHANTANU SUNIL' },
{ id:7, enrollmentNo:'24152460329', name:'MAHAGAONKAR VIGHNESH' },
{ id:8, enrollmentNo:'24152460331', name:'DHANVI ARYA MAHESH' },
{ id:9, enrollmentNo:'24152460333', name:'GUJAR KASTURI RAVIKIRAN' },
{ id:10, enrollmentNo:'24152460334', name:'POLEKAR GUNJAN NITESH' },
{ id:11, enrollmentNo:'24152460336', name:'NIGUDKAR KUNAL SANDESH' },
{ id:12, enrollmentNo:'24152460337', name:'NAKTI SUMEET SHARAD' },
{ id:13, enrollmentNo:'24152460347', name:'MITHE RUTUJA AJIT' },
{ id:14, enrollmentNo:'24152460350', name:'KAJARE CHAITANYA BABAN' },
{ id:15, enrollmentNo:'24152460351', name:'CHORAGE PRATHMESH' },
{ id:16, enrollmentNo:'24152460352', name:'SAKPAL ROSHAN RAMDAS' },
{ id:17, enrollmentNo:'24152460359', name:'JAWALEKAR PIYUSH' },
{ id:18, enrollmentNo:'24152460360', name:'KANAL SAMRUDDHI VASANT' },
{ id:19, enrollmentNo:'24152460361', name:'SHINDE MANTHAN MAHENDRA' },
{ id:20, enrollmentNo:'24152460428', name:'KOLI BHUMI AMRUT' },
{ id:21, enrollmentNo:'24252271662', name:'SHEDGE SHRUTI DIPAK' },
{ id:22, enrollmentNo:'25152460584', name:'NHAVKAR PUSHKAR DHANAJI' },
{ id:23, enrollmentNo:'25152460585', name:'CHOGALE RAJ MURLIDHAR' },
{ id:24, enrollmentNo:'25152460589', name:'KUMROTKAR PRAVESH KAILAS' },
{ id:25, enrollmentNo:'25152460594', name:'MORE SHUBHAM RUPESH' },

{ id:26, enrollmentNo:'23152460329', name:'RAUT YASH PRADIP' },
{ id:27, enrollmentNo:'24152460312', name:'PAWAR SEJAL RAVINDRA' },
{ id:28, enrollmentNo:'24152460314', name:'TELANGE TANVI TULSHIRAM' },
{ id:29, enrollmentNo:'24152460317', name:'DESHMUKH SARTHAK PRADEEP' },
{ id:30, enrollmentNo:'24152460319', name:'DESHMUKH SHRAVANI GANESH' },
{ id:31, enrollmentNo:'24152460321', name:'BHAGAT SHRAVANI NARESH' },
{ id:32, enrollmentNo:'24152460324', name:'NIRBHAVANE BHUMI VILAS' },
{ id:33, enrollmentNo:'24152460325', name:'BARASKAR TANAYA SHASHIKANT' },
{ id:34, enrollmentNo:'24152460335', name:'MUNDE KUNAL SANTOSH' },
{ id:35, enrollmentNo:'24152460338', name:'JADHAV SHLOKA MANGESH' },
{ id:36, enrollmentNo:'24152460340', name:'KAPSE SRUSHTI SANJAY' },
{ id:37, enrollmentNo:'24152460341', name:'MANDE SHRADDHA NITIN' },
{ id:38, enrollmentNo:'24152460343', name:'KHAIRE SHRAVAN JAYESH' },
{ id:39, enrollmentNo:'24152460345', name:'PATIL NIRAJ MOHAN' },
{ id:40, enrollmentNo:'24152460349', name:'WARGE OM MANGESH' },
{ id:41, enrollmentNo:'24152460353', name:'SHIRKE DEVANSHI DATTA' },
{ id:42, enrollmentNo:'24152460355', name:'MANDLUSKAR MOKSHADA' },
{ id:43, enrollmentNo:'24152460362', name:'PANAVKAR MANTHAN RAJESH' },
{ id:44, enrollmentNo:'24152460365', name:'MEHTA KRISHNA HEMANT' },
{ id:45, enrollmentNo:'24152460367', name:'PAWAR RAJ SANDIP' },
{ id:46, enrollmentNo:'24152460230', name:'PATIL ARYAN NILESH' },
{ id:47, enrollmentNo:'25152460587', name:'ZAWARE ARPITA ASHOK' },
{ id:48, enrollmentNo:'25152460595', name:'KHARIVALE PRAJYOT GIRISH' },
{ id:49, enrollmentNo:'24152460327', name:'THIGALE SARTHAK GANESH' },
{ id:50, enrollmentNo:'25152460590', name:'MANDARKAR VIRAJ SACHIN' },
{ id:51, enrollmentNo:'25152460592', name:'PATIL BHUSHAN LAXMAN' },
{ id:52, enrollmentNo:'24152460346', name:'SONAWALE SIDDHI BHARAT' },
{ id:53, enrollmentNo:'24152460363', name:'KUDEKAR BUSHRA ASIF' },

{ id:54, enrollmentNo:'24152460342', name:'GORIVALE SWARAJ DAYARAM' },
{ id:55, enrollmentNo:'24152460344', name:'DHEBE KAVITA PANDURANG' },
{ id:56, enrollmentNo:'24152460348', name:'MOHITE PRANALI SANJAY' },
{ id:57, enrollmentNo:'24152460354', name:'SHIRKE ARYAN LAXMAN' },
{ id:58, enrollmentNo:'24152460356', name:'SHIRKE SUKANYA SANTOSH' },
{ id:59, enrollmentNo:'24152460357', name:'MAHADESHWAR SHLOK ANAND' },
{ id:60, enrollmentNo:'24152460358', name:'PAWAR OM VILAS' },
{ id:61, enrollmentNo:'24152460366', name:'URAWANE ATHARV SUHAS' },
{ id:62, enrollmentNo:'24213020418', name:'YADAV ABHISHEK RAMDHARI' },
{ id:63, enrollmentNo:'25152460586', name:'TUPE RUTIKA SUJIT' },
{ id:64, enrollmentNo:'25152460591', name:'SHIRKE SHRAVANI DHONDIRAM' },
{ id:65, enrollmentNo:'25152460593', name:'ALGUDE ROHAN SURESH' },

{ id:66, enrollmentNo:'24152460315', name:'PEDHAVI RICHA SANTOSH' },
{ id:67, enrollmentNo:'24152460332', name:'KUNBI SIMRAN DATTARAM' },
{ id:68, enrollmentNo:'25152460588', name:'MALEKAR SAYALI SANDESH' },
{ id:69, enrollmentNo:'24152460339', name:'MAHADIK VEDANT VIJAY' },
{ id:70, enrollmentNo:'24152460320', name:'MHATRE SARTHAK PRADEEP' },
{ id:71, enrollmentNo:'25152460596', name:'MORE TANMAY ADESH' },

{ id:72, enrollmentNo:'24152460313', name:'THAKUR NIDHI VINOD' },
{ id:73, enrollmentNo:'24152460364', name:'THAKUR SAMAR SANDIP' },
{ id:74, enrollmentNo:'24152460368', name:'CHALKE SARTH RAKESH' }
]);
        this._save('courses', []);
        this._save('faculty', []);
        this._save('attendance', []);
        this._save('marks', []);
        this._save('fees', []);
        this._save('notices', []);

        localStorage.setItem('sms_initialized', '1');

        console.log('[SMS DB] Fresh database initialized.');
    },

    // Clear and Reinitialize
    reset() {

        [
            'users',
            'students',
            'courses',
            'attendance',
            'marks',
            'fees',
            'faculty',
            'notices'
        ].forEach(t => localStorage.removeItem('sms_' + t));

        localStorage.removeItem('sms_initialized');

        this.init();
    }

}; // IMPORTANT: Close DB object

// Initialize on page load
DB.init();