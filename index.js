const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: "Course1" },
  { id: 2, name: "Course2" },
  { id: 3, name: "Course3" },
];
app.get("/", (req, res) => {
  res.send("Hello World!!");
});
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course)
    return res.status(404).send("The course with the given ID was not found.");
  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const result = validateCourse(req.body);
  //400 Bad Request
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  //Look up the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  const result = validateCourse(req.body);
  if (result.error)
    return res.status(404).send(result.error.details[0].message);

  //Update course
  course.name = req.body.name;
  //Return the updated course
  res.send(course);
});

//DELETE course

app.delete("/api/courses/:id", (req, res) => {
  //Look up the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  //Not existing , return 404
  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  //Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  //Return the same course
  res.send(course);
});

function validateCourse(course) {
  //Validate
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}
//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}...`));
