const router = require('express').Router();
let Problem = require('../models/problem.model');

router.route('/').get((req, res) => {
  Problem.find()
    .then(problems => res.json(problems))
    .catch(err => res.status(400).json(err));
});

router.route('/add').post((req, res) => {
  const link = req.body.link;
  const name = req.body.name;
  const difficulty = Number(req.body.difficulty);
  const folder = req.body.folder;
  const tags = req.body.tags;
  const code = req.body.code;
  const notes = req.body.notes;
  const date = new Date();

  const newProblem = new Problem({
    link,
    name,
    difficulty,
    folder,
    tags,
    code,
    notes,
    date,
  });

  newProblem.save()
    .then(() => res.json('Problem added!'))
    .catch(err => res.status(400).json(err));
});

router.route('/:id').get((req, res) => {
  Problem.findById(req.params.id)
    .then(problem => res.json(problem))
    .catch(err => res.status(400).json(err));
});

router.route('/:id').delete((req, res) => {
  Problem.findByIdAndDelete(req.params.id)
    .then(() => res.json('Problem deleted.'))
    .catch(err => res.status(400).json(err));
});

router.route('/').delete((req, res) => {
  Problem.deleteMany({})
    .then(() => res.json('Problems deleted.'))
    .catch(err => res.status(400).json(err));
});

router.route('/update/:id').post((req, res) => {
  Problem.findById(req.params.id)
    .then(problem => {
      problem.link = req.body.link;
      problem.name = req.body.name;
      problem.difficulty = Number(req.body.difficulty);
      problem.folder = req.body.folder;
      problem.tags = req.body.tags;
      problem.code = req.body.code;
      problem.notes = req.body.notes;
      problem.date = new Date();

      problem.save()
        .then(() => res.json('Problem updated!'))
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;