// Seed data for Math Crush (5 Levels, 10 questions each)

const initialLevels = [
  {
    order_number: 1,
    title: "Fraction Fundamentals 🍬",
    topic: "Fractions",
    difficulty: "Grade 6 Easy"
  },
  {
    order_number: 2,
    title: "Decimal Discoveries 🍭",
    topic: "Decimals",
    difficulty: "Grade 6 Medium"
  },
  {
    order_number: 3,
    title: "Percentage Power ⭐",
    topic: "Percentages",
    difficulty: "Grade 7 Medium"
  },
  {
    order_number: 4,
    title: "Ratio Realms 👑",
    topic: "Ratios",
    difficulty: "Grade 7 Hard"
  },
  {
    order_number: 5,
    title: "Algebra & Geometry Quest 🏆",
    topic: "Basic Algebra & Geometry",
    difficulty: "Grade 8 Hard"
  }
];

const initialQuestions = {
  1: [ // Level 1: Fractions (10 questions)
    {
      question_text: "What is 1/2 + 1/4?",
      option_a: "1/2",
      option_b: "3/4",
      option_c: "2/4",
      option_d: "1/8",
      correct_answer: "B",
      explanation: "Convert 1/2 to 2/4. Then 2/4 + 1/4 = 3/4."
    },
    {
      question_text: "What is 3/5 - 1/5?",
      option_a: "2/5",
      option_b: "4/5",
      option_c: "2/10",
      option_d: "1/5",
      correct_answer: "A",
      explanation: "Subtract numerators: 3 - 1 = 2. Denominator stays 5. So 2/5."
    },
    {
      question_text: "Which fraction is equivalent to 2/4?",
      option_a: "1/3",
      option_b: "3/4",
      option_c: "1/2",
      option_d: "4/8",
      correct_answer: "C",
      explanation: "Divide numerator and denominator of 2/4 by 2 to get 1/2."
    },
    {
      question_text: "What is 2/3 multiplied by 3/4?",
      option_a: "6/12 or 1/2",
      option_b: "5/7",
      option_c: "8/9",
      option_d: "6/7",
      correct_answer: "A",
      explanation: "(2 × 3) / (3 × 4) = 6/12 = 1/2."
    },
    {
      question_text: "What is 1/2 divided by 1/4?",
      option_a: "1/8",
      option_b: "2",
      option_c: "1/2",
      option_d: "4",
      correct_answer: "B",
      explanation: "Multiply 1/2 by the reciprocal of 1/4 (which is 4/1): 1/2 × 4 = 2."
    },
    {
      question_text: "Convert the mixed number 2 1/3 into an improper fraction.",
      option_a: "7/3",
      option_b: "5/3",
      option_c: "6/3",
      option_d: "3/2",
      correct_answer: "A",
      explanation: "(2 × 3) + 1 = 7, so 7/3."
    },
    {
      question_text: "Which fraction is the largest?",
      option_a: "1/4",
      option_b: "1/2",
      option_c: "3/4",
      option_d: "2/3",
      correct_answer: "C",
      explanation: "3/4 is 0.75, which is greater than 1/4 (0.25), 1/2 (0.5), and 2/3 (0.66)."
    },
    {
      question_text: "Simplify the fraction 12/16 to its lowest terms.",
      option_a: "6/8",
      option_b: "3/4",
      option_c: "4/5",
      option_d: "2/3",
      correct_answer: "B",
      explanation: "Divide both 12 and 16 by 4 to get 3/4."
    },
    {
      question_text: "What is 5/8 + 1/8?",
      option_a: "6/8 or 3/4",
      option_b: "6/16",
      option_c: "4/8",
      option_d: "5/16",
      correct_answer: "A",
      explanation: "5/8 + 1/8 = 6/8, simplified to 3/4."
    },
    {
      question_text: "What is 1 - 3/7?",
      option_a: "4/7",
      option_b: "2/7",
      option_c: "3/7",
      option_d: "5/7",
      correct_answer: "A",
      explanation: "1 is equal to 7/7. 7/7 - 3/7 = 4/7."
    }
  ],
  2: [ // Level 2: Decimals (10 questions)
    {
      question_text: "What is 0.5 + 0.25?",
      option_a: "0.75",
      option_b: "0.30",
      option_c: "0.85",
      option_d: "0.70",
      correct_answer: "A",
      explanation: "0.50 + 0.25 = 0.75."
    },
    {
      question_text: "What is 1.2 × 0.3?",
      option_a: "3.6",
      option_b: "0.36",
      option_c: "0.036",
      option_d: "0.48",
      correct_answer: "B",
      explanation: "12 × 3 = 36. Two decimal places give 0.36."
    },
    {
      question_text: "What is 4.8 ÷ 2?",
      option_a: "2.4",
      option_b: "2.8",
      option_c: "1.4",
      option_d: "9.6",
      correct_answer: "A",
      explanation: "4.8 divided by 2 equals 2.4."
    },
    {
      question_text: "Convert 0.75 into a fraction in simplest form.",
      option_a: "7/5",
      option_b: "3/4",
      option_c: "1/2",
      option_d: "4/5",
      correct_answer: "B",
      explanation: "0.75 = 75/100 = 3/4."
    },
    {
      question_text: "Which decimal is smaller: 0.08 or 0.8?",
      option_a: "0.8",
      option_b: "0.08",
      option_c: "They are equal",
      option_d: "Neither",
      correct_answer: "B",
      explanation: "0.08 is 8 hundredths, which is less than 8 tenths (0.80)."
    },
    {
      question_text: "Round 3.14159 to two decimal places.",
      option_a: "3.14",
      option_b: "3.15",
      option_c: "3.10",
      option_d: "3.20",
      correct_answer: "A",
      explanation: "The third decimal place is 1 (< 5), so we round down to 3.14."
    },
    {
      question_text: "What is 10 - 2.65?",
      option_a: "7.45",
      option_b: "7.35",
      option_c: "8.35",
      option_d: "7.65",
      correct_answer: "B",
      explanation: "10.00 - 2.65 = 7.35."
    },
    {
      question_text: "What is 0.04 × 100?",
      option_a: "0.4",
      option_b: "40",
      option_c: "4",
      option_d: "400",
      correct_answer: "C",
      explanation: "Move the decimal point 2 places to the right: 4."
    },
    {
      question_text: "What is 0.6 divided by 0.2?",
      option_a: "0.3",
      option_b: "3",
      option_c: "30",
      option_d: "0.12",
      correct_answer: "B",
      explanation: "0.6 ÷ 0.2 is equal to 6 ÷ 2 = 3."
    },
    {
      question_text: "Order from least to greatest: 0.45, 0.405, 0.5.",
      option_a: "0.5, 0.45, 0.405",
      option_b: "0.405, 0.45, 0.5",
      option_c: "0.45, 0.405, 0.5",
      option_d: "0.405, 0.5, 0.45",
      correct_answer: "B",
      explanation: "0.405 < 0.450 < 0.500."
    }
  ],
  3: [ // Level 3: Percentages (10 questions)
    {
      question_text: "What is 50% of 80?",
      option_a: "20",
      option_b: "40",
      option_c: "30",
      option_d: "50",
      correct_answer: "B",
      explanation: "50% is half. 80 / 2 = 40."
    },
    {
      question_text: "Convert 25% to a decimal.",
      option_a: "2.5",
      option_b: "0.025",
      option_c: "0.25",
      option_d: "25.0",
      correct_answer: "C",
      explanation: "25 ÷ 100 = 0.25."
    },
    {
      question_text: "What is 10% of 250?",
      option_a: "25",
      option_b: "2.5",
      option_c: "50",
      option_d: "15",
      correct_answer: "A",
      explanation: "10% of 250 = 250 / 10 = 25."
    },
    {
      question_text: "A $50 shirt is on sale for 20% off. How much is the discount?",
      option_a: "$5",
      option_b: "$10",
      option_c: "$20",
      option_d: "$15",
      correct_answer: "B",
      explanation: "20% of $50 = 0.20 × 50 = $10."
    },
    {
      question_text: "What percentage is 15 out of 60?",
      option_a: "15%",
      option_b: "20%",
      option_c: "25%",
      option_d: "30%",
      correct_answer: "C",
      explanation: "15 / 60 = 1/4 = 0.25 = 25%."
    },
    {
      question_text: "What is 150% of 20?",
      option_a: "30",
      option_b: "25",
      option_c: "35",
      option_d: "40",
      correct_answer: "A",
      explanation: "1.5 × 20 = 30."
    },
    {
      question_text: "If a student scores 18 out of 20 on a quiz, what percentage is that?",
      option_a: "85%",
      option_b: "90%",
      option_c: "95%",
      option_d: "80%",
      correct_answer: "B",
      explanation: "18 / 20 = 9/10 = 90%."
    },
    {
      question_text: "What is 75% expressed as a simplified fraction?",
      option_a: "3/4",
      option_b: "7/10",
      option_c: "4/5",
      option_d: "2/3",
      correct_answer: "A",
      explanation: "75/100 = 3/4."
    },
    {
      question_text: "An item increases from $40 to $50. What is the percentage increase?",
      option_a: "10%",
      option_b: "25%",
      option_c: "20%",
      option_d: "15%",
      correct_answer: "B",
      explanation: "Increase = $10. Percentage increase = (10 / 40) × 100 = 25%."
    },
    {
      question_text: "What is 5% of 300?",
      option_a: "15",
      option_b: "30",
      option_c: "5",
      option_d: "25",
      correct_answer: "A",
      explanation: "10% of 300 = 30, so 5% is half of 30 = 15."
    }
  ],
  4: [ // Level 4: Ratios & Proportions (10 questions)
    {
      question_text: "Simplify the ratio 8 : 12.",
      option_a: "4 : 6",
      option_b: "2 : 3",
      option_c: "1 : 2",
      option_d: "3 : 4",
      correct_answer: "B",
      explanation: "Divide both 8 and 12 by 4 to get 2 : 3."
    },
    {
      question_text: "If 2 apples cost $3, how much do 6 apples cost?",
      option_a: "$6",
      option_b: "$9",
      option_c: "$12",
      option_d: "$8",
      correct_answer: "B",
      explanation: "6 apples is 3 times 2 apples. $3 × 3 = $9."
    },
    {
      question_text: "A recipe uses 3 cups of flour for every 2 cups of sugar. What is the ratio of flour to sugar?",
      option_a: "2 : 3",
      option_b: "3 : 2",
      option_c: "3 : 5",
      option_d: "1 : 1",
      correct_answer: "B",
      explanation: "Flour : Sugar = 3 : 2."
    },
    {
      question_text: "Solve for x: 3/4 = x/12.",
      option_a: "9",
      option_b: "6",
      option_c: "8",
      option_d: "10",
      correct_answer: "A",
      explanation: "3 × 12 = 4 × x -> 36 = 4x -> x = 9."
    },
    {
      question_text: "In a class of 30 students, the ratio of boys to girls is 2 : 3. How many boys are there?",
      option_a: "10",
      option_b: "12",
      option_c: "18",
      option_d: "15",
      correct_answer: "B",
      explanation: "Total parts = 2 + 3 = 5. Each part = 30 / 5 = 6. Boys = 2 × 6 = 12."
    },
    {
      question_text: "A car travels 150 miles in 3 hours. What is its average speed in mph?",
      option_a: "45 mph",
      option_b: "50 mph",
      option_c: "60 mph",
      option_d: "55 mph",
      correct_answer: "B",
      explanation: "Speed = Distance / Time = 150 / 3 = 50 mph."
    },
    {
      question_text: "Which ratio is equivalent to 1 : 4?",
      option_a: "2 : 6",
      option_b: "3 : 12",
      option_c: "4 : 15",
      option_d: "5 : 16",
      correct_answer: "B",
      explanation: "3 : 12 simplifies to 1 : 4."
    },
    {
      question_text: "If a map scale is 1 cm : 10 km, how far is 4.5 cm on the map in reality?",
      option_a: "45 km",
      option_b: "4.5 km",
      option_c: "450 km",
      option_d: "40 km",
      correct_answer: "A",
      explanation: "4.5 × 10 km = 45 km."
    },
    {
      question_text: "Divide $40 in the ratio 1 : 3.",
      option_a: "$10 and $30",
      option_b: "$15 and $25",
      option_c: "$20 and $20",
      option_d: "$8 and $32",
      correct_answer: "A",
      explanation: "Total parts = 4. 1 part = $10. So $10 and $30."
    },
    {
      question_text: "If 5 workers build a wall in 4 hours, how long would it take 1 worker at the same speed?",
      option_a: "10 hours",
      option_b: "20 hours",
      option_c: "15 hours",
      option_d: "25 hours",
      correct_answer: "B",
      explanation: "Total worker-hours = 5 × 4 = 20 worker-hours. 1 worker takes 20 hours."
    }
  ],
  5: [ // Level 5: Basic Algebra & Geometry (10 questions)
    {
      question_text: "Solve for x: 2x + 5 = 15.",
      option_a: "x = 5",
      option_b: "x = 10",
      option_c: "x = 7.5",
      option_d: "x = 4",
      correct_answer: "A",
      explanation: "Subtract 5: 2x = 10. Divide by 2: x = 5."
    },
    {
      question_text: "What is the area of a rectangle with length 8 cm and width 5 cm?",
      option_a: "13 cm²",
      option_b: "26 cm²",
      option_c: "40 cm²",
      option_d: "35 cm²",
      correct_answer: "C",
      explanation: "Area = length × width = 8 × 5 = 40 cm²."
    },
    {
      question_text: "Evaluate the expression 3a - 2 for a = 4.",
      option_a: "10",
      option_b: "8",
      option_c: "12",
      option_d: "6",
      correct_answer: "A",
      explanation: "3(4) - 2 = 12 - 2 = 10."
    },
    {
      question_text: "What is the perimeter of a square with side length 6 cm?",
      option_a: "36 cm",
      option_b: "24 cm",
      option_c: "18 cm",
      option_d: "12 cm",
      correct_answer: "B",
      explanation: "Perimeter = 4 × side = 4 × 6 = 24 cm."
    },
    {
      question_text: "Solve for y: y / 3 = 9.",
      option_a: "y = 3",
      option_b: "y = 27",
      option_c: "y = 12",
      option_d: "y = 18",
      correct_answer: "B",
      explanation: "Multiply both sides by 3: y = 27."
    },
    {
      question_text: "What is the sum of interior angles in a triangle?",
      option_a: "90°",
      option_b: "180°",
      option_c: "360°",
      option_d: "270°",
      correct_answer: "B",
      explanation: "The angles of any triangle always add up to 180°."
    },
    {
      question_text: "What is the area of a triangle with base 10 cm and height 6 cm?",
      option_a: "60 cm²",
      option_b: "30 cm²",
      option_c: "15 cm²",
      option_d: "45 cm²",
      correct_answer: "B",
      explanation: "Area = 1/2 × base × height = 1/2 × 10 × 6 = 30 cm²."
    },
    {
      question_text: "Simplify: 4x + 2x - 3x.",
      option_a: "3x",
      option_b: "5x",
      option_c: "2x",
      option_d: "9x",
      correct_answer: "A",
      explanation: "(4 + 2 - 3)x = 3x."
    },
    {
      question_text: "If a right-angled triangle has legs of length 3 cm and 4 cm, what is the hypotenuse?",
      option_a: "5 cm",
      option_b: "6 cm",
      option_c: "7 cm",
      option_d: "25 cm",
      correct_answer: "A",
      explanation: "Pythagorean theorem: c² = 3² + 4² = 9 + 16 = 25. √25 = 5 cm."
    },
    {
      question_text: "Solve for x: 5x - 3 = 2x + 9.",
      option_a: "x = 3",
      option_b: "x = 4",
      option_c: "x = 2",
      option_d: "x = 6",
      correct_answer: "B",
      explanation: "5x - 2x = 9 + 3 -> 3x = 12 -> x = 4."
    }
  ]
};

module.exports = {
  initialLevels,
  initialQuestions
};
