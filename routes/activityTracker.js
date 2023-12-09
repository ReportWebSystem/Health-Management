const express = require('express');
const Activity = require('../models/activityTracker');
const { isLoggedIn } = require('./helpers');

// localhost:5001/activity
const router = express.Router();

router.route('/')
    .get(isLoggedIn, (req, res) => {
        res.render('activity', {
            title: require('../package.json').name,
            port: process.env.PORT
        });
    });

// 운동량 등록하기
// localhost:5001/activity/create/:activityId
router.route('/create')
    .get(isLoggedIn, (req, res) => {
        res.locals.title = require('../package.json').name;
        res.locals.activityId = req.params.activityId;
        res.render('activity-modify', {
            title: require('../package.json').name,
            port: process.env.PORT,
            api: 'create'
        });
    })
    .post(isLoggedIn, async (req, res, next) => {
        try {
            const {activityInfoDate, activityPlace, activityType, duration, distance, calories } = req.body;
            const userId = req.user.userId;
            const activity = await Activity.create({
                activityInfoDate,
                activityPlace,
                userId,
                activityType,
                duration,
                distance,
                calories
            });

            if (activity) {
                res.status(200).json({
                    result: 'success',
                    error: null,
                    data: null
                });
            } else {
                res.json({
                    result: 'fail',
                    error: '운동량 등록에 실패하였습니다.',
                    data: null
                });
            }
        } catch (err) {
            console.error(err);
            next(err);
        }

    });

// 운동량 수정하기
router.get('/update', isLoggedIn, async (req, res, next) => {
    try {
        const activities = await Activity.findAll({
            attributes: ['activityInfoDate', 'duration', 'distance', 'calories'],
            where: {userId: req.user.userId}
        });

        if (activities.length > 0) {
            res.render('activity-form.html', {
                title: '운동량 정보 수정',
                activities: activities,
                api: 'update'
            });
        } else {
            res.json({
                result: 'fail',
                error: '생성된 운동량 정보가 없습니다.',
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
        const { activityType, activityPlace } = req.body;
        const activity = await Activity.findOne({
            where: {
                userId: req.user.userId,
                activityType,
                activityPlace
            }
        });

        if (activity) {
            const port = process.env.PORT;
            return res.redirect(`http://localhost:${port}/activity/update/${activity.activityId}`);
        } else {
            res.json({
                result: 'fail',
                error: '해당 날짜의 운동 정보를 찾을 수 없습니다.',
                data: null
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});
router.get('/update2/:activityId', (req, res) => {
    res.render('test');
});
router.route('/update/:activityId')
    .get(isLoggedIn, (req, res) => {
        res.render('activity-modify', {
            title: require('../package.json').name,
            activityId: req.params.activityId,
            port: process.env.PORT,
            api: 'update'
        });
    })
    .post(isLoggedIn, async (req, res, next) => {
        const activityId = req.params.activityId;
        const { activityInfoDate, activityPlace, activityType, duration, distance, calories } = req.body;

        try {
            const result = await Activity.update({
                activityInfoDate,
                activityPlace,
                activityType,
                duration,
                distance,
                calories
            }, {
                where: { activityId }
            });

            if (result) {
                res.json({
                    result: 'success',
                    error: null,
                    data: null
                });
            }
            else {
                res.json({
                    result: 'fail',
                    error: '운동량 수정에 실패하였습니다!',
                    data: null
                });
            }
        } catch (err) {
            console.error(err);
            next(err);
        }
    });


// 제품 삭제하기
router.get('/delete', isLoggedIn, async(req, res, next) => {
    try {
        const activities = await Activity.findAll({
            attributes: ['activityId', 'activityInfoDate', 'activityPlace', 'activityType', 'duration', 'distance', 'calories'],
            where: { userId: req.user.userId }
        });

        if (activities.length > 0) {
            res.render('activity-form', {
                title: '운동량 정보 삭제',
                activities: activities,
                api: 'delete'
            });
        } else {
            res.json({
                result: 'fail',
                error: '생성되어 있는 운동 정보가 없습니다.',
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
        const { activityType, activityPlace } = req.body;
        const activity = await Activity.findOne({
            where: {
                userId: req.user.userId,
                activityType,
                activityPlace
            }
        });

        if (activity) {
            const port = process.env.PORT;
            return res.redirect(`http://localhost:${port}/activity/delete/${activity.activityId}`);
        } else {
            res.json({
                result: 'fail',
                error: '해당 운동량 정보를 찾을 수 없습니다.',
                data: null
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});
router.get('/delete/:activityId', isLoggedIn, async (req, res, next) => {
    try {
        const result = await Activity.destroy({
            where: { activityId: req.params.activityId }
        });

        if (result) {
            res.json({
                result: 'success',
                error: null,
                data: null
            });
        }
        else {
            res.json({
                result: 'fail',
                error: '운동량 삭제에 실패하였습니다!',
                data: null
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/running', isLoggedIn, async (req, res, next) => {
    try {
        // const exercises = await Activity.findAll({
        //     attributes: ['activityId', 'activityInfoDate', 'activityPlace', 'activityType', 'duration', 'distance', 'calories', 'runtime'],
        //     where: { userId: req.user.userId}
        // });

        res.render('activity-running', {
            title: require('../package.json').name,
            port: process.env.PORT
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/running', isLoggedIn, async (req, res, next) => {
    console.log(req.body);
    try {
        const { activityPlace, activityType, distance, runtime } = req.body;
        const cleanedRuntime = runtime.replace(/\s/g, '');
        const exercise = await Activity.create({
                userId: req.user.userId,
                activityPlace,
                activityType,
                distance,
                runtime: cleanedRuntime
        });
        console.log(exercise);
        if (exercise) {
            const port = process.env.PORT;
            return res.redirect(`http://localhost:${port}/activity/running/${exercise.activityId}`);
        } else {
            res.json({
                result: 'fail',
                error: '운동 정보에 실패하였습니다.',
                data: null
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/view', isLoggedIn, async (req, res, next) => {
    try {
        const exercise = await Activity.findAll({
            attributes: ['activityInfoDate', 'activityPlace', 'activityType', 'duration', 'calories', 'runtime'],
            where: { userId: req.user.userId}
        });

        if (exercise) {
            res.json(exercise);
        } else {
            res.json({
                result: 'fail',
                error: '운동 정보 조회 실패',
                data: null
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// router.route('/running/:activityId')
//     .post(async (req, res, next) => {
//         const activityId = req.params.activityId;
//         const { activityPlace, activityType, distance, runtime } = req.body;
//         try {
//             const result = await Activity.create({
//                 activityPlace,
//                 activityType,
//                 distance,
//                 runtime
//             }, {
//                 where: { activityId }
//             });
//
//             if (result) {
//                 res.status(200).json({
//                     result: 'success',
//                     error: null,
//                     data: null
//                 });
//             } else {
//                 res.json({
//                     result: 'fail',
//                     error: '러닝 정보 생성 실패',
//                     data: null
//                 });
//             }
//         } catch (err) {
//             console.error(err);
//             next(err);
//         }
//     });





module.exports = router;