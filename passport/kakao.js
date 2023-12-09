const passport = require('passport');
const Profile = require('../models/profile');
const Strategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
    passport.use(new Strategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/user/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await User.findOne({
                where: { id: profile.id }
            });

            if (user)
                done(null, user);
            else {
                const newUser = await User.create({
                    id: profile.id,
                    name: profile.username,
                    // description: profile._json.properties.profile_image
                });
                await Profile.create({
                    userId: newUser.userId,
                    profileName: profile.username,
                    profileImage: profile._json.properties.profile_image
                },{
                    where: { userId: newUser.userId }
                });

                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};
