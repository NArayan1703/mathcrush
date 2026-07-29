-- Math Crush Seed Data (5 Levels, 50 Math Questions)

-- 1. Insert 5 Math Levels
INSERT INTO levels (order_number, title, topic, difficulty) VALUES
(1, 'Fraction Fundamentals 🍬', 'Fractions', 'Grade 6 Easy'),
(2, 'Decimal Discoveries 🍭', 'Decimals', 'Grade 6 Medium'),
(3, 'Percentage Power ⭐', 'Percentages', 'Grade 7 Medium'),
(4, 'Ratio Realms 👑', 'Ratios', 'Grade 7 Hard'),
(5, 'Algebra & Geometry Quest 🏆', 'Basic Algebra & Geometry', 'Grade 8 Hard')
ON CONFLICT (order_number) DO NOTHING;

-- 2. Insert Math Questions for Level 1: Fractions
INSERT INTO questions (level_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(1, 'What is 1/2 + 1/4?', '1/2', '3/4', '2/4', '1/8', 'B', 'Convert 1/2 to 2/4. Then 2/4 + 1/4 = 3/4.'),
(1, 'What is 3/5 - 1/5?', '2/5', '4/5', '2/10', '1/5', 'A', 'Subtract numerators: 3 - 1 = 2. Denominator stays 5. So 2/5.'),
(1, 'Which fraction is equivalent to 2/4?', '1/3', '3/4', '1/2', '4/8', 'C', 'Divide numerator and denominator of 2/4 by 2 to get 1/2.'),
(1, 'What is 2/3 multiplied by 3/4?', '6/12 or 1/2', '5/7', '8/9', '6/7', 'A', '(2 × 3) / (3 × 4) = 6/12 = 1/2.'),
(1, 'What is 1/2 divided by 1/4?', '1/8', '2', '1/2', '4', 'B', 'Multiply 1/2 by the reciprocal of 1/4 (which is 4/1): 1/2 × 4 = 2.'),
(1, 'Convert the mixed number 2 1/3 into an improper fraction.', '7/3', '5/3', '6/3', '3/2', 'A', '(2 × 3) + 1 = 7, so 7/3.'),
(1, 'Which fraction is the largest?', '1/4', '1/2', '3/4', '2/3', 'C', '3/4 is 0.75, which is greater than 1/4 (0.25), 1/2 (0.5), and 2/3 (0.66).'),
(1, 'Simplify the fraction 12/16 to its lowest terms.', '6/8', '3/4', '4/5', '2/3', 'B', 'Divide both 12 and 16 by 4 to get 3/4.'),
(1, 'What is 5/8 + 1/8?', '6/8 or 3/4', '6/16', '4/8', '5/16', 'A', '5/8 + 1/8 = 6/8, simplified to 3/4.'),
(1, 'What is 1 - 3/7?', '4/7', '2/7', '3/7', '5/7', 'A', '1 is equal to 7/7. 7/7 - 3/7 = 4/7.');

-- 3. Insert Math Questions for Level 2: Decimals
INSERT INTO questions (level_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(2, 'What is 0.5 + 0.25?', '0.75', '0.30', '0.85', '0.70', 'A', '0.50 + 0.25 = 0.75.'),
(2, 'What is 1.2 × 0.3?', '3.6', '0.36', '0.036', '0.48', 'B', '12 × 3 = 36. Two decimal places give 0.36.'),
(2, 'What is 4.8 ÷ 2?', '2.4', '2.8', '1.4', '9.6', 'A', '4.8 divided by 2 equals 2.4.'),
(2, 'Convert 0.75 into a fraction in simplest form.', '7/5', '3/4', '1/2', '4/5', 'B', '0.75 = 75/100 = 3/4.'),
(2, 'Which decimal is smaller: 0.08 or 0.8?', '0.8', '0.08', 'They are equal', 'Neither', 'B', '0.08 is 8 hundredths, which is less than 8 tenths (0.80).'),
(2, 'Round 3.14159 to two decimal places.', '3.14', '3.15', '3.10', '3.20', 'A', 'The third decimal place is 1 (< 5), so we round down to 3.14.'),
(2, 'What is 10 - 2.65?', '7.45', '7.35', '8.35', '7.65', 'B', '10.00 - 2.65 = 7.35.'),
(2, 'What is 0.04 × 100?', '0.4', '40', '4', '400', 'C', 'Move the decimal point 2 places to the right: 4.'),
(2, 'What is 0.6 divided by 0.2?', '0.3', '3', '30', '0.12', 'B', '0.6 ÷ 0.2 is equal to 6 ÷ 2 = 3.'),
(2, 'Order from least to greatest: 0.45, 0.405, 0.5.', '0.5, 0.45, 0.405', '0.405, 0.45, 0.5', '0.45, 0.405, 0.5', '0.405, 0.5, 0.45', 'B', '0.405 < 0.450 < 0.500.');

-- 4. Insert Math Questions for Level 3: Percentages
INSERT INTO questions (level_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(3, 'What is 50% of 80?', '20', '40', '30', '50', 'B', '50% is half. 80 / 2 = 40.'),
(3, 'Convert 25% to a decimal.', '2.5', '0.025', '0.25', '25.0', 'C', '25 ÷ 100 = 0.25.'),
(3, 'What is 10% of 250?', '25', '2.5', '50', '15', 'A', '10% of 250 = 250 / 10 = 25.'),
(3, 'A $50 shirt is on sale for 20% off. How much is the discount?', '$5', '$10', '$20', '$15', 'B', '20% of $50 = 0.20 × 50 = $10.'),
(3, 'What percentage is 15 out of 60?', '15%', '20%', '25%', '30%', 'C', '15 / 60 = 1/4 = 0.25 = 25%.'),
(3, 'What is 150% of 20?', '30', '25', '35', '40', 'A', '1.5 × 20 = 30.'),
(3, 'If a student scores 18 out of 20 on a quiz, what percentage is that?', '85%', '90%', '95%', '80%', 'B', '18 / 20 = 9/10 = 90%.'),
(3, 'What is 75% expressed as a simplified fraction?', '3/4', '7/10', '4/5', '2/3', 'A', '75/100 = 3/4.'),
(3, 'An item increases from $40 to $50. What is the percentage increase?', '10%', '25%', '20%', '15%', 'B', 'Increase = $10. Percentage increase = (10 / 40) × 100 = 25%.'),
(3, 'What is 5% of 300?', '15', '30', '5', '25', 'A', '10% of 300 = 30, so 5% is half of 30 = 15.');

-- 5. Insert Math Questions for Level 4: Ratios
INSERT INTO questions (level_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(4, 'Simplify the ratio 8 : 12.', '4 : 6', '2 : 3', '1 : 2', '3 : 4', 'B', 'Divide both 8 and 12 by 4 to get 2 : 3.'),
(4, 'If 2 apples cost $3, how much do 6 apples cost?', '$6', '$9', '$12', '$8', 'B', '6 apples is 3 times 2 apples. $3 × 3 = $9.'),
(4, 'A recipe uses 3 cups of flour for every 2 cups of sugar. What is the ratio of flour to sugar?', '2 : 3', '3 : 2', '3 : 5', '1 : 1', 'B', 'Flour : Sugar = 3 : 2.'),
(4, 'Solve for x: 3/4 = x/12.', '9', '6', '8', '10', 'A', '3 × 12 = 4 × x -> 36 = 4x -> x = 9.'),
(4, 'In a class of 30 students, the ratio of boys to girls is 2 : 3. How many boys are there?', '10', '12', '18', '15', 'B', 'Total parts = 2 + 3 = 5. Each part = 30 / 5 = 6. Boys = 2 × 6 = 12.'),
(4, 'A car travels 150 miles in 3 hours. What is its average speed in mph?', '45 mph', '50 mph', '60 mph', '55 mph', 'B', 'Speed = Distance / Time = 150 / 3 = 50 mph.'),
(4, 'Which ratio is equivalent to 1 : 4?', '2 : 6', '3 : 12', '4 : 15', '5 : 16', 'B', '3 : 12 simplifies to 1 : 4.'),
(4, 'If a map scale is 1 cm : 10 km, how far is 4.5 cm on the map in reality?', '45 km', '4.5 km', '450 km', '40 km', 'A', '4.5 × 10 km = 45 km.'),
(4, 'Divide $40 in the ratio 1 : 3.', '$10 and $30', '$15 and $25', '$20 and $20', '$8 and $32', 'A', 'Total parts = 4. 1 part = $10. So $10 and $30.'),
(4, 'If 5 workers build a wall in 4 hours, how long would it take 1 worker at the same speed?', '10 hours', '20 hours', '15 hours', '25 hours', 'B', 'Total worker-hours = 5 × 4 = 20 worker-hours. 1 worker takes 20 hours.');

-- 6. Insert Math Questions for Level 5: Basic Algebra & Geometry
INSERT INTO questions (level_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(5, 'Solve for x: 2x + 5 = 15.', 'x = 5', 'x = 10', 'x = 7.5', 'x = 4', 'A', 'Subtract 5: 2x = 10. Divide by 2: x = 5.'),
(5, 'What is the area of a rectangle with length 8 cm and width 5 cm?', '13 cm²', '26 cm²', '40 cm²', '35 cm²', 'C', 'Area = length × width = 8 × 5 = 40 cm².'),
(5, 'Evaluate the expression 3a - 2 for a = 4.', '10', '8', '12', '6', 'A', '3(4) - 2 = 12 - 2 = 10.'),
(5, 'What is the perimeter of a square with side length 6 cm?', '36 cm', '24 cm', '18 cm', '12 cm', 'B', 'Perimeter = 4 × side = 4 × 6 = 24 cm.'),
(5, 'Solve for y: y / 3 = 9.', 'y = 3', 'y = 27', 'y = 12', 'y = 18', 'B', 'Multiply both sides by 3: y = 27.'),
(5, 'What is the sum of interior angles in a triangle?', '90°', '180°', '360°', '270°', 'B', 'The angles of any triangle always add up to 180°.'),
(5, 'What is the area of a triangle with base 10 cm and height 6 cm?', '60 cm²', '30 cm²', '15 cm²', '45 cm²', 'B', 'Area = 1/2 × base × height = 1/2 × 10 × 6 = 30 cm².'),
(5, 'Simplify: 4x + 2x - 3x.', '3x', '5x', '2x', '9x', 'A', '(4 + 2 - 3)x = 3x.'),
(5, 'If a right-angled triangle has legs of length 3 cm and 4 cm, what is the hypotenuse?', '5 cm', '6 cm', '7 cm', '25 cm', 'A', 'Pythagorean theorem: c² = 3² + 4² = 9 + 16 = 25. √25 = 5 cm.'),
(5, 'Solve for x: 5x - 3 = 2x + 9.', 'x = 3', 'x = 4', 'x = 2', 'x = 6', 'B', '5x - 2x = 9 + 3 -> 3x = 12 -> x = 4.');
