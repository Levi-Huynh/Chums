import { init } from './app';
const port = process.env.SERVER_PORT;

init().then(app => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
});