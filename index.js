const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const {createWorker} = require('tesseract.js');
const worker = createWorker();


const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,"./uploads")
    },
    filename: (req,file,cb)=>{
        cb(null,file.originalname);
    }
    
});

const upload = multer({storage: storage}).single("avatar");
app.set('view engine', 'ejs'); 

app.get('/',(req,res)=>{
    res.render('index');
})
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Server ${PORT}`));

app.post('/uploads',async (req,res)=>{
upload(req,res, err=>{
    fs.readFile(`./uploads/${req.file.originalname}`,async(err,data)=>{
         if(err) return console.log('Error');
         await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(`./uploads/${req.file.originalname}`);
        console.log(text);
        await worker.terminate();
    })
    //console.log(req.file);
});

})