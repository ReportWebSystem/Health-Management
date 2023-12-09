const express = require('express');
const HealthFood = require('../models/healthFood');

const { isLoggedIn } = require('./helpers');

// localhost:5001/healthFood
const router = express.Router();

// 건강 식품 등록하기
// localhost:5001/healthFood/create
router.route('/create')
    .get(isLoggedIn, (req, res) => {
        res.render('healthFood-modify', {
            api: 'create',
            title: require('../package.json').name,
            port: process.env.PORT
        });
    })
    .post(async (req, res, next) => {
        try {
            const { healthFoodName, description } = req.body;
            const userId = req.user.userId;
            const food = await HealthFood.create({
                healthFoodName,
                userId,
                description
            });

            if (food) {
                res.status(200).json({
                    result: 'success',
                    error: null,
                    data: null
                });
            }
            else {
                res.json({
                    result: 'fail',
                    error: '건강 식품 생성에 실패하였습니다.',
                    data: null
                });
            }
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

// 건강 식품 정보 관리 하기
// localhost:5001/healthFood/view
router.get('/view', isLoggedIn, async (req, res, next) => {
    try {
        const foods = await HealthFood.findAll({
            attributes: ['healthFoodID', 'healthFoodName', 'description'],
            where: { userId: req.user.userId }
        });

        if (foods) {
            res.json(foods);
        }
        else {
            res.json({
                result: 'fail',
                error: '건강 식품 조회 실패',
                data: null
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 건강 식품 인덱스 페이지
// localhost:5001/healthFood
router.get('/', isLoggedIn, (req, res) => {
    res.render('healthFood-index', {
        title: require('../package.json').name,
        port: process.env.PORT
    });
});

router.get('/update', isLoggedIn, async (req, res, next) => {
    try {
        const foods = await HealthFood.findAll({
            attributes: ['healthFoodId', 'healthFoodName', 'description'],
            where: { userId: req.user.userId }
        });

        if (foods.length > 0) {
            res.render('healthFood-form', {
                title: '건강 식품 정보 수정',
                foods: foods,
                api: 'update'
            });
        } else {
            res.json({
                result: 'fail',
                error: '생성되어 있는 건강 식품이 없습니다.',
                data: null
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/update', isLoggedIn, async (req, res, next) => {
    try {
        const { healthFoodName } = req.body;
        const food = await HealthFood.findOne({
            where: {
                userId: req.user.userId,
                healthFoodName
            }
        });

        if (food) {
            const port = process.env.PORT;
            return res.redirect(`http://localhost:${port}/healthFood/update/${food.healthFoodId}`);
        } else {
            res.json({
                result: 'fail',
                error: '해당 이름의 건강 식품을 찾을 수 없습니다.',
                data: null
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});


// 건강 식품 수정
// localhost:5001/healthFood/update/:healthFoodId
router.route('/update/:healthFoodId')
    .get((req, res) => {
        res.render('healthFood-modify', {
            api: 'update',
            title: require('../package.json').name,
            healthFoodId: req.params.healthFoodId,
            port: process.env.PORT
        });
    })
    .post(async (req, res, next) => {
        const healthFoodId = req.params.healthFoodId;
        const { healthFoodName, description } = req.body;
        try {
            const result = await HealthFood.update({
                healthFoodName,
                description
            }, {
                where: { healthFoodId }
            });

            if (result) {
                res.status(200).json({
                    result: 'success',
                    error: null,
                    data: null
                });
            }
            else {
                res.json({
                    result: 'fail',
                    error: '건강 식품 정보 수정 실패!',
                    data: null
                });
            }
        } catch (err) {
            console.error(err);
            next(err);
        }
    });


// 건강식품 삭제하기
router.get('/delete', isLoggedIn, async (req, res, next) => {
    try {
        const foods = await HealthFood.findAll({
            attributes: ['healthFoodId', 'healthFoodName', 'description'],
            where: { userId: req.user.userId }
        });

        if (foods.length > 0) {
            res.render('healthFood-form', {
                title: '건강 식품 정보 삭제',
                foods: foods,
                api: 'delete'
            });
        } else {
            res.json({
                result: 'fail',
                error: '생성되어 있는 건강 식품이 없습니다.',
                data: null
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});
router.post('/delete', isLoggedIn, async (req, res, next) => {
    try {
        const { healthFoodName } = req.body;
        const food = await HealthFood.findOne({
            where: {
                userId: req.user.userId,
                healthFoodName
            }
        });

        if (food) {
            const port = process.env.PORT;
            return res.redirect(`http://localhost:${port}/healthFood/delete/${food.healthFoodId}`);
        } else {
            res.json({
                result: 'fail',
                error: '해당 이름의 건강 식품을 찾을 수 없습니다.',
                data: null
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/delete/:healthFoodId', async (req, res, next) => {
    try {
        const result = await HealthFood.destroy({
            where: { healthFoodId: req.params.healthFoodId },
        });

        if (result) {
            res.status(200).json({
                result: 'success',
                error: null,
                data: null
            });
        }
        else {
            res.json({
                result: 'fail',
                error: '건강 식품 삭제 실패!',
                data: null
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;