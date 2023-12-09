const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt')
const User = require('../models/user');
const Profile = require('../models/profile');

// localhost:5000/user
const router = express.Router();

// 회원가입
// localhost:5000/user/sign-up
router.route('/sign-up')
    .get((_, res) => {
        res.render('sign-up', {
            title: require('../package.json').name,
            port: process.env.PORT
        });
    })
    .post(async (req, res, next) => {
        const { id, password, name } = req.body;
        if (!id) return next('아이디를 입력하세요.');
        if (!password) return next('비밀번호를 입력하세요.');

        const user = await User.findOne({ where: { id } });
        if (user) return next('이미 등록된 사용자 아이디입니다.');

        try {
            const hash = await bcrypt.hash(password, 12);
            const user = await User.create({
                id,
                password: hash,
                name
            });

            if (user) res.redirect(`/profile/create/${user.userId}`);
            else {
                res.json({
                    result: 'fail',
                    error: '회원가입이 되지 않았습니다!',
                    data: null
                });
            }
        } catch (err) {
            console.error(err);
            next(err);
        }
    });


// 로컬 로그인
// localhost:5000/user/login
router.post('/login', (req, res, next) => {
    // authenticate에 전달되는 값이 'local'이면 -> 일반 로그인이다.(로컬 전략)
    // 로컬 전략을 실행하다라는 의미 => passport/index.js를 호출한 후, local()을 호출하여 passport/local.js를 호출한다.
    passport.authenticate('local', (authError, user, info) => {
        if (user) req.login(user, loginError => res.redirect('/'));
        else next(info);
    })(req, res, next);
});

// 카카오 로그인
// localhost:5000/user/kakaoLogin
// authenticate에 전달되는 값이 'kakao'이면 -> 카카오 로그인이다.(카카오 전략)
// 카카오 전략을 실행하다라는 의미 => passport/index.js를 호출한 후, kakao()을 호출하여 passport/kakao.js를 호출한다.
router.get('/kakao', passport.authenticate('kakao'));

// localhost:5000/Auth/kakao/callback
router.get('/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/' }),
    (req, res) => res.redirect('/')
);

// 로그아웃
// localhost:5000/user/logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy();
        res.redirect('/');
    });
});

// 유저 정보 세부조회
router.get('/info', async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { userId: req.user.userId },
            include: {
                model: Profile
            }
        });
        if (user) {
            res.json({
                result: 'success',
                error: null,
                data: user
            });
        }
        else {
            res.json({
                result: 'fail',
                error: '정보 조회에 실패하였습니다!',
                data: null
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 회원 탈퇴
router.get('/delete', async (req, res, next) => {
    try {
        const result = await User.destroy({
            where: { userId: req.user.userId }
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
                error: '회원 탈퇴에 실패하였습니다!',
                data: null
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;