const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/questions', async (req, res) => {
  try {
    const result = await pool.query(`SELECT fq.id AS question_id, fq.question, 
                 json_agg(json_build_object('option_id', fqo.id, 'text', fqo.option_text, 'field_id', fqo.field_id)) AS options
          FROM field_questions fq
          JOIN field_question_options fqo ON fq.id = fqo.question_id
          GROUP BY fq.id
          ORDER BY fq.id;`);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/determine', async (req, res) => {
  try {
    const { answers } = req.body;
    let fieldScores = {};

    answers.forEach(({ fieldId }) => {
      fieldScores[fieldId] = (fieldScores[fieldId] || 0) + 1;
    });

    const maxScore = Math.max(...Object.values(fieldScores));
    const bestFields = Object.keys(fieldScores).filter(
      (key) => fieldScores[key] === maxScore
    );

    const bestFieldId =
      bestFields.length === 1
        ? bestFields[0]
        : bestFields[Math.floor(Math.random() * bestFields.length)];

    const fieldResult = await pool.query(
      `SELECT name FROM fields WHERE id = $1`,
      [bestFieldId]
    );

    const bestFieldName = fieldResult.rows[0]?.name || 'Unknown Field';
    console.log(bestFieldName);
    console.log(bestFieldId);

    const questionsResult = await pool.query(
      `SELECT id AS question_id, question
       FROM program_questions
       WHERE field_id = $1
       ORDER BY id`,
      [bestFieldId]
    );
    const questions = questionsResult.rows;

    const questionIds = questions.map((q) => q.question_id);
    const answersResult = await pool.query(
      `SELECT id AS answer_id, question_id, answer_text, program_code
       FROM program_answers
       WHERE question_id = ANY($1::int[])`,
      [questionIds]
    );

    const answerMap = {};
    answersResult.rows.forEach((answer) => {
      if (!answerMap[answer.question_id]) {
        answerMap[answer.question_id] = [];
      }
      answerMap[answer.question_id].push({
        answerId: answer.answer_id,
        text: answer.answer_text,
        programCode: answer.program_code,
      });
    });

    const questionsWithAnswers = questions.map((q) => ({
      questionId: q.question_id,
      question: q.question,
      answers: answerMap[q.question_id] || [],
    }));

    res.status(200).json({
      data: {
        fieldId: parseInt(bestFieldId),
        fieldName: bestFieldName,
        nextQuestions: questionsWithAnswers,
      },
    });
  } catch (error) {
    console.error('Error fetching answer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/questions/program-result', async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res
        .status(400)
        .json({ message: 'Invalid or missing answers array.' });
    }

    // Count scores per program
    const programScores = {};
    answers.forEach(({ programCode }) => {
      if (programCode) {
        programScores[programCode] = (programScores[programCode] || 0) + 1;
      }
    });

    const maxScore = Math.max(...Object.values(programScores));
    const bestPrograms = Object.keys(programScores).filter(
      (key) => programScores[key] === maxScore
    );

    const bestProgramCode =
      bestPrograms.length === 1
        ? bestPrograms[0]
        : bestPrograms[Math.floor(Math.random() * bestPrograms.length)];

    // Get the selected program details
    const programQuery = await pool.query(
      `SELECT program_code, name, description, top_skills, link, jobs, requirements
       FROM programs
       WHERE program_code = $1`,
      [bestProgramCode]
    );

    const program = programQuery.rows[0];

    if (!program) {
      return res.status(404).json({ message: 'Program not found.' });
    }

    res.status(200).json({
      data: {
        programCode: program.program_code,
        programName: program.name,
        description: program.description,
        topSkills: program.top_skills,
        link: program.link,
        jobs: program.jobs,
        requirements: program.requirements,
      },
    });
  } catch (error) {
    console.error('Error determining best program:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
