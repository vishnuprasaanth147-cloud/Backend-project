const express = require('express');
const { randomUUID } = require('crypto');

const app = express();
app.use(express.json());

// In-memory data store for registrations
let registrations = [];
const MAX_CAPACITY = 50;

/**
 * 1. Register for the Event
 * POST /register
 */
app.post('/register', (req, res) => {
    let { name, email, college } = req.body || {};

    // Handle invalid/missing information
    if (typeof name !== 'string' || typeof email !== 'string' ||
        !name.trim() || !email.trim()) {
        return res.status(400).json({
            error: "Invalid/missing information. Name and email are required."
        });
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
    }

    // Check for duplicate registration by email
    if (registrations.some(r => r.email === email)) {
        return res.status(409).json({
            error: "Duplicate registration: This email is already registered."
        });
    }

    // Handle Event Capacity (Maximum 50 participants)
    if (registrations.length >= MAX_CAPACITY) {
        return res.status(409).json({ error: "Event is full" });
    }

    // Create new registration record
    const newRegistration = {
        id: randomUUID(),
        name,
        email,
        college: typeof college === 'string' && college.trim()
            ? college.trim()
            : "Not Provided",
        registrationTime: new Date().toISOString()
    };

    registrations.push(newRegistration);

    return res.status(201).json({
        message: "Successful registration",
        data: newRegistration,
        seatsRemaining: MAX_CAPACITY - registrations.length
    });
});

/**
 * 2. View All Registrations
 * GET /registrations
 */
app.get('/registrations', (req, res) => {
    return res.status(200).json({
        event: "Backend Development Workshop",
        capacity: MAX_CAPACITY,
        totalRegistered: registrations.length,
        registrations
    });
});

/**
 * 3. View a Single Registration by ID
 * GET /registrations/:id
 */
app.get('/registrations/:id', (req, res) => {
    const registration = registrations.find(r => r.id === req.params.id);

    // Handle registration not found
    if (!registration) {
        return res.status(404).json({ error: "Registration not found" });
    }

    return res.status(200).json(registration);
});

// Start server only when run directly (lets tests import the app)
const PORT = process.env.PORT || 3000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
