const express = require("express");
const cors = require("cors");
const app = express();
port = process.env.PORT || 8080;
const models = require('./models');
//업로드 이미지를 관리하는 스토리지 서버를 연결 멀터를 쓰겟다.
const multer = require('multer');
//이미지파일 어디에 저장할지를 정해줌
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            //어디에 저장할건지?
            cb(null, 'upload/')
        },
        filename: function (req, file, cb) {
            //어떤이름으로 저장할건지? 파일안에 있는 원본이름으로 저장하겠다.
            cb(null, file.originalname)
        }
    })
})

//json형식의 데이터를 처리할 수 있게 설정
app.use(express.json());
//브라우저의 cors이슈를 막기위해 사용하는코드
app.use(cors());
//해당파일을 보여줄때 입력한경로데로 보여주도록 설정
app.use("/upload", express.static("upload"));

app.get("/products", (req, res) => {
    const query = req.query;
    console.log(query);
    //데이터 베이스 조회하기 
    //findAll은 다찾기 
    //조건줄수있음(조회갯수 limit)
    //정렬변경(order)
    //원하는 컬럼만 선택할수있음(attributes)
    models.Products.findAll({
        limit: 10,
        order: [
            ["createdAt", "DESC"]
        ],
        attributes: [
            "id",
            "name",
            "seller",
            "createdAt",
            "seller",
            "imageUrl"
        ]
    }).then((result) => {
        console.log("PRODUCTS:", result);
        res.send({
            product: result
        })
    }).catch((error) => {
        console.error(error);
        res.send("에러발생");
    });
})

//상품하나 조회하기 추가
app.get("/products/:id", (req, res) => {
    const params = req.params;
    const { id } = params;
    //하나의 데이터만 찾을때는 findOne
    models.Products.findOne({
        //조건절
        where: {
            id: id
        }
    }).then((result) => {
        res.send({
            product: result,
        })
    }).catch((error) => {
        console.error(error);
        res.send('상품조회에 에러가 생겼습니다.');
    })
})

app.get('/banners', (req, res) => {
    models.Banner.findAll({
        limit: 3,
    }).then((result) => {
        res.send({
            banners: result,
        })
    })
        .catch((error) => {
            console.error(error);
            res.send('에러가 발생했습니다.');
        })
})

app.post('/products', async (req, res) => {
    const body = req.body;
    const { name, description, price, seller, imageUrl } = body;
    if (!name || !description || !price || !seller || !imageUrl) {
        res.send('모든 필드를 입력해주세요');
    }
    console.log(body);
    models.Products.create({
        name,
        description,
        price,
        imageUrl,
        seller
    }).then((result) => {
        console.log('상품 등록 결과: ', result);
        res.send({
            result,
        })
    })
        .catch((error) => {
            res.send("상품 업로드에 문제가 발생했습니다.");
        })
})
//이미지 파일을 post로 요청이 왔을때 upload라는 폴더에 이미지를저장
//이미지가 하나일때 single
app.post('/image', upload.single('image'), (req, res) => {
    const file = req.file;
    //이미지 파일의 경로를 응답해줌
    res.send({
        imageUrl: file.path
    })
})


app.listen(port, () => {
    console.log('그린의 서버가 돌아가고 있습니다');
    models.sequelize.sync().then(() => {
        console.log('DB연결선공');
    }).catch((error) => {
        console.log('DB연결 에러');
        process.exit();
    })
})