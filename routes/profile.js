const express = require('express');
const { User } = require('../../HealthGuide/models');
const Profile = require('../models/profile');
const { isLoggedIn } = require('./helpers');

// localhost:5001/profile
const router = express.Router();

// 프로필 생성
router.route('/create/:userId')
    .get((req, res) => {
        res.render('profile-modify', {
            title: require('../package.json').name,
            api: 'create',
            userId: req.params.userId
        });
    })
    .post(async (req, res, next) => {
        const { profileInfoDate, age, height, weight, bloodType, smoke, drink } = req.body;
        const userId = req.params.userId;

        try {
            const profile = await Profile.create({
                userId,
                profileInfoDate,
                age,
                height,
                weight,
                bloodType,
                smoke,
                drink
            });

            if (profile) {
                const user = await User.findOne({
                    where: { userId },
                    include: {
                        model: Profile
                    }
                });
                res.json({
                    result: 'success',
                    error: null,
                    data: user
                });
            }
            else {
                res.json({
                    result: 'fail',
                    error: '건강 정보 생성에 실패하였습니다!',
                    data: null
                });
            }
        } catch (err) {
            console.error(err);
            next(err);
        }
    });



// 건강정보 수정
router.route('/update')
    .get(isLoggedIn, (req, res) => {
        res.render('profile-modify', {
            title: require('../package.json').name,
            api: 'update',
            userId: req.user.userId,
            port: process.env.PORT
        });
    })
    .post(isLoggedIn, async (req, res, next) => {
        const { profileInfoDate, age, height, weight, smoke, drink } = req.body;

        try {
            const profile = await Profile.update({
                userId: req.user.userId,
                profileInfoDate,
                age,
                height,
                weight,
                smoke,
                drink
            }, {
                where: { userId: req.user.userId }
            });

            if (profile) {
                res.json({
                    result: 'success',
                    error: null,
                    data: null
                });
            }
            else {
                res.json({
                    result: 'fail',
                    error: '건강정보 업데이트에 실패하였습니다!',
                    data: null
                });
            }
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

module.exports = router;