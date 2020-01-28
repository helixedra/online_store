const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const getData = require('./modules/get_data')

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {

        // const user = await getUserByEmail(email)
        const user = await getData('SELECT * FROM customers WHERE email = ?', email)

     
        /*
    
        ------------------------------------------------
        
        CHECK IS EMAIL IS CONFIRMED AND STATUS = ACTIVE

        ------------------------------------------------
        
        */



        //...
        // console.log(user);
        // console.log(user);
        // console.log(user.password);
        
        if(user == null) {
            return done(null, false, { message: 'Неверный логин или пароль!' }) // user have not found
            // return false
        }

        if(user.status == 'inactive') {
            return done(null, false, { message: 'Аккаунт не подтвержден' }) // User is not active
            // return false
        }


        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user, { message: 'Вы успешно вошли!'}) // successful login
                // return user
            } else {
                return done(null, false, { message: 'Неверный логин или пароль!'}) // incorrect password
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => { 
        return done(null, getUserById(id))
    })
}

module.exports = initialize