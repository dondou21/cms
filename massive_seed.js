const db = require('./server/config/db');

const africanFirstNames = [
    'Abeba', 'Kwame', 'Zola', 'Oluchi', 'Tariro', 'Moussa', 'Jabari', 'Amara', 'Babatunde', 'Chidi',
    'Desta', 'Ekon', 'Femi', 'Gamba', 'Hakeem', 'Idris', 'Jelani', 'Kofi', 'Lekan', 'Makena'
];
const africanLastNames = [
    'Okonkwo', 'Traoré', 'Mbeki', 'Abiola', 'Mensah', 'Gueye', 'Keita', 'Diallo', 'Sow', 'Bello',
    'Ndiaye', 'Balewa', 'Selassie', 'Toure', 'Kenyatta', 'Azikiwe', 'Machel', 'Nkrumah', 'Lumumba', 'Sankara'
];

async function seed() {
    console.log('--- Starting Massive Seeding (10+ records each) ---');
    try {
        // 1. Seed Departments
        const depts = [
            ['SECRETARIAT', 'Administration and official church records'],
            ['M.U.A', 'Musique Universelle et Adoration (Choir)'],
            ['INTERCESSION', 'Spiritual warfare and prayer team'],
            ['MULTIMEDIA', 'Sound, video, and social media production'],
            ['ACCUEIL', 'Welcoming and protocol'],
            ['ECODIM', 'Children church (Ecole du Dimanche)'],
            ['MAINTENANCE', 'Facility management and cleaning'],
            ['LOGISTICS', 'Event setup and transport'],
            ['EVANGELISM', 'Outreach and soul winning'],
            ['INTEGRATION', 'New converts and visitors follow-up']
        ];
        
        const deptIds = [];
        for (const [name, desc] of depts) {
            const [res] = await db.execute('INSERT INTO departments (name, description) VALUES ($1, $2) RETURNING id', [name, desc]);
            deptIds.push(res[0].id);
        }
        console.log(`Seeded ${deptIds.length} departments.`);

        // 2. Seed Members (30 members, some STAR)
        const memberIds = [];
        for (let i = 0; i < 30; i++) {
            const firstName = africanFirstNames[i % africanFirstNames.length];
            const lastName = africanLastNames[i % africanLastNames.length];
            const isStar = i % 3 === 0; // Every 3rd member is STAR
            const status = i % 5 === 0 ? 'visitor' : 'active';
            
            const [res] = await db.execute(
                `INSERT INTO members (first_name, last_name, email, phone, is_star, status, remarks) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
                [
                    firstName, 
                    lastName, 
                    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
                    `+25078${Math.floor(1000000 + Math.random() * 9000000)}`,
                    isStar,
                    status,
                    isStar ? 'Fidèle serviteur engagé.' : 'Membre régulier.'
                ]
            );
            memberIds.push(res[0].id);
        }
        console.log(`Seeded ${memberIds.length} members.`);

        // 3. Seed Roles (Leaders and Vice Leaders for each dept)
        for (const deptId of deptIds) {
            const leaderId = memberIds[Math.floor(Math.random() * memberIds.length)];
            const viceId = memberIds[Math.floor(Math.random() * memberIds.length)];
            
            await db.execute('INSERT INTO department_roles (department_id, member_id, role_name) VALUES ($1, $2, $3)', [deptId, leaderId, 'Leader']);
            await db.execute('INSERT INTO department_roles (department_id, member_id, role_name) VALUES ($1, $2, $3)', [deptId, viceId, 'Vice Leader']);
        }
        console.log('Seeded Department Roles.');

        // 4. Seed Weekly Programs
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        for (const deptId of deptIds) {
            await db.execute(
                'INSERT INTO department_programs (department_id, day_of_week, time, activity) VALUES ($1, $2, $3, $4)',
                [deptId, days[Math.floor(Math.random() * 7)], '18:00', 'Réunion hebdomadaire et prière.']
            );
        }
        console.log('Seeded Weekly Programs.');

        // 5. Seed Events
        const eventIds = [];
        for (let i = 1; i <= 10; i++) {
            const [res] = await db.execute(
                'INSERT INTO events (title, description, date, time, location) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [`Grand Événement ${i}`, `Description pour l'événement spirituel ${i}`, `2024-05-${10 + i}`, '17:00', 'Auditorium Principal']
            );
            eventIds.push(res[0].id);
        }
        console.log('Seeded 10 events.');

        // 6. Seed Announcements
        for (let i = 1; i <= 10; i++) {
            await db.execute(
                'INSERT INTO service_orders (title, date, description, announcements) VALUES ($1, $2, $3, $4)',
                ['Template d\'Annonce', '2024-04-28', 'System Template', JSON.stringify([{ id: Date.now() + i, title: `Annonce Importante ${i}`, description: `Ceci est le contenu de l'annonce numéro ${i} pour la communauté.` }])]
            );
        }
        console.log('Seeded 10 Announcements (via service_orders templates).');

        // 7. Seed Service Orders
        for (let i = 1; i <= 10; i++) {
            const sequences = [
                { id: '1', start: '08:00', end: '08:15', subject: 'Intercession', duration: '15\'', intervenants: 'Equipe A', type: 'normal' },
                { id: '2', start: '08:15', end: '09:00', subject: 'Louange', duration: '45\'', intervenants: 'MUA', type: 'normal' }
            ];
            await db.execute(
                'INSERT INTO service_orders (title, date, theme, sequences) VALUES ($1, $2, $3, $4)',
                [`Service du Dimanche ${i}`, `2024-05-${i}`, 'La Puissance de la Foi', JSON.stringify(sequences)]
            );
        }
        console.log('Seeded 10 Service Orders.');

        console.log('--- Massive Seeding Complete ---');
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        process.exit(0);
    }
}

seed();
