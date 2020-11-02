import express from 'express';

let app = express();

app.use(express.json());

app.get('/', function(req, res){
   res.send("Hello from BPB-back!!");
});

app.listen(8080, () => {
    console.log(`Server is listening on port 8080`);
});