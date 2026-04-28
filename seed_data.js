const db = require('./server/config/db');

async function seed() {
    console.log('--- Seeding House Of God Database ---');
    try {
        // 1. Seed Departments
        const departments = ['Media & Tech', 'Worship & Arts', 'Ushering & Protocol', 'Children Ministry', 'Integration & Welcome'];
        for (const dept of departments) {
            const [existing] = await db.execute('SELECT id FROM departments WHERE name = $1', [dept]);
            if (existing.length === 0) {
                await db.execute('INSERT INTO departments (name, description) VALUES ($1, $2)', [dept, `Department for ${dept}`]);
                console.log(`Created department: ${dept}`);
            }
        }

        const [allDepts] = await db.execute('SELECT id FROM departments');
        const deptIds = allDepts.map(d => d.id);

        // 2. Seed Members (African Names)
        const members = [
            { first: 'Kwame', last: 'Nkrumah', email: 'kwame@hog.com', phone: '+250780000001', status: 'active', civ: 'Mr' },
            { first: 'Amara', last: 'Okafor', email: 'amara@hog.com', phone: '+250780000002', status: 'active', civ: 'Mme' },
            { first: 'Kofi', last: 'Annan', email: 'kofi@hog.com', phone: '+250780000003', status: 'active', civ: 'Mr' },
            { first: 'Zola', last: 'Tshabalala', email: 'zola@hog.com', phone: '+250780000004', status: 'active', civ: 'Mlle' },
            { first: 'Chinua', last: 'Achebe', email: 'chinua@hog.com', phone: '+250780000005', status: 'active', civ: 'Mr' },
            { first: 'Ifeanyi', last: 'Ejiofor', email: 'ifeanyi@hog.com', phone: '+250780000006', status: 'active', civ: 'Mr' },
            { first: 'Nia', last: 'Mbeki', email: 'nia@hog.com', phone: '+250780000007', status: 'active', civ: 'Mme' },
            { first: 'Jabari', last: 'Toure', email: 'jabari@hog.com', phone: '+250780000008', status: 'active', civ: 'Mr' },
            { first: 'Malika', last: 'Sow', email: 'malika@hog.com', phone: '+250780000009', status: 'active', civ: 'Mlle' },
            { first: 'Sekai', last: 'Kamara', email: 'sekai@hog.com', phone: '+250780000010', status: 'active', civ: 'Mme' }
        ];

        for (let i = 0; i < members.length; i++) {
            const m = members[i];
            const [existing] = await db.execute('SELECT id FROM members WHERE email = $1', [m.email]);
            if (existing.length === 0) {
                await db.execute(
                    `INSERT INTO members (civilite, first_name, last_name, email, phone, status, department_id, accepted_christ, want_to_join_icc) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                    [m.civ, m.first, m.last, m.email, m.phone, m.status, deptIds[i % deptIds.length], true, true]
                );
                console.log(`Created member: ${m.first} ${m.last}`);
            }
        }

        // 3. Seed Events
        const events = [
            { title: 'Sunday Celebration Service', desc: 'Main weekly service', loc: 'Auditorium HOG', date: '2024-05-05' },
            { title: 'Mid-week Prayer & Word', desc: 'Diving deeper into scriptures', loc: 'HOG Chapel', date: '2024-05-08' },
            { title: 'Youth Impact Hangout', desc: 'Networking and faith for the next gen', loc: 'HOG Gardens', date: '2024-05-11' }
        ];

        for (const e of events) {
            const [existing] = await db.execute('SELECT id FROM events WHERE title = $1 AND date = $2', [e.title, e.date]);
            if (existing.length === 0) {
                await db.execute(
                    'INSERT INTO events (title, description, location, date, time) VALUES ($1, $2, $3, $4, $5)',
                    [e.title, e.desc, e.loc, e.date, '09:00']
                );
                console.log(`Created event: ${e.title}`);
            }
        }

        console.log('--- Seeding Complete ---');
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        process.exit(0);
    }
}

seed();
