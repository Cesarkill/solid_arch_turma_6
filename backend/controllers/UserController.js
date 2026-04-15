const user = require('*../models/user')
const bcrypt = require('bcryptjs')

module.exports = class UserController {
    static async register(req, res){
        const { name, email, phone, password, confirmpassword } = req.body
        if (!name) {
            res.status(422).json({message: 'telefone e obrigatiro'})
            return
        }
        if(!password) {
            res.status(422).json({message: 'Senha e obrigatiro'})
            return
        }
        if(!confirmpassword) {
            res.status(422).json({message: 'confirme sua senha'})
            return
        }
        if(password !== confirmpassword) {
            res.status(422).json({message: 'as senhas nao conferem'})
            return
        }
        const userExist = await User.findOne({ email: email})
        if (userExist) {
                res.status(422).json({ message: 'por favor, utilize outro email'})
                return
        }
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const user = new User({
            name,
            email,
            phone,
            password: passwordHash
        })
        try {
            const newUser = await user.save()
            res.status(201).json({message: 'usuario criado com sucesso!'})
        } catch (err) {
            res.status(201).json({message: 'aconteceu um erro no servidor, tente novamente mais tarde!'})
        }
    }
}