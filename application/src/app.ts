import express from 'express';

let app = express();

app.use(express.json());

app.listen(8080, () => {
    console.log(`Server is listening on port 8080`);
});