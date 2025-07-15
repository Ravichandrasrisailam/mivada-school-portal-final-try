const express = require('express');
const router = express.Router();

// Placeholder for FAQ data. In a real application, this data would be fetched
// from a MongoDB collection using a Mongoose model.
const faqsData = {
    "intents": [
        {
            "tag": "what_is_mivada_school",
            "patterns": [
                "What is Mivada School?",
                "Tell me about Mivada School"
            ],
            "responses": [
                "Mivada School is an educational institution dedicated to fostering academic excellence and holistic development."
            ]
        },
        {
            "tag": "who_can_use",
            "patterns": [
                "Who can use Mivada School portal?",
                "Who are the users of Mivada School?"
            ],
            "responses": [
                "The Mivada School portal is primarily used by students, parents, teachers, and administrative staff."
            ]
        },
        {
            "tag": "mark_attendance",
            "patterns": [
                "How do I mark student attendance?",
                "Attendance marking process"
            ],
            "responses": [
                "Go to the Attendance tab → Select Class → Mark Present/Absent for each student → Submit."
            ]
        },
        {
            "tag": "view_attendance_history",
            "patterns": [
                "Can I view attendance history?",
                "How to check attendance history for a student?"
            ],
            "responses": [
                "Yes, go to the Student Profile → Attendance → Filter by month to view daily records."
            ]
        },
        {
            "tag": "reset_password",
            "patterns": [
                "I forgot my password",
                "How do I reset my Mivada School password?"
            ],
            "responses": [
                "Click 'Forgot Password' on the login screen → Enter registered email → Follow the reset link."
            ]
        },
        {
            "tag": "set_reminders",
            "patterns": [
                "Can I set reminders for morning prayer?",
                "Set end-of-day message reminder"
            ],
            "responses": [
                "Yes. From Principal’s panel → Reminders → Choose time & recipient group → Enter message → Schedule."
            ]
        },
        {
            "tag": "subscription_plans",
            "patterns": [
                "What are the features of Plan A and Plan B?",
                "Tell me about Mivada School plans"
            ],
            "responses": [
                "Plan A (₹49,000/year): Unlimited teachers, 1000 students, 1 Principal, 1 AO, 1 MD. Up to 96 hours downtime per year.",
                "Plan B (₹1.99 L/year): Unlimited students, multi-branch support, shared logins for Principal/AO, and dedicated support. <12 hours downtime/year."
            ]
        }
    ]
};

// @route   GET /api/faqs
// @desc    Get all FAQs
// @access  Public
router.get('/', (req, res) => {
    // In a production application, you would fetch this data from your MongoDB
    // using a Mongoose model, e.g.:
    // const faqs = await Faq.find();
    // res.json(faqs);
    res.json(faqsData.intents); // For now, we're sending the hardcoded data
});

// @route   GET /api/faqs/:tag
// @desc    Get a single FAQ by its tag
// @access  Public
router.get('/:tag', (req, res) => {
    const tag = req.params.tag;
    const faq = faqsData.intents.find(item => item.tag === tag);
    if (faq) {
        res.json(faq);
    } else {
        res.status(404).json({ msg: 'FAQ not found' });
    }
});

module.exports = router; // Export the router