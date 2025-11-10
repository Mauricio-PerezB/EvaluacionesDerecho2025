import { AppDataSource } from "../data-source.js";
import { UsuarioSchema } from "../entities/usuario.entity.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { nombre, apellido, rut, email, password, rol } = req.body;

    if (!nombre || !apellido || !rut || !email || !password) {
        return res.status(400).json({ msg: "Faltan campos obligatorios." });
    }

    try {
        const userRepo = AppDataSource.getRepository(UsuarioSchema);

        const userExists = await userRepo.findOne({
            where: [{ email: email }, { rut: rut }],
        });

        if (userExists) {
            return res.status(400).json({ msg: "El email o RUT ya están registrados." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = userRepo.create({
            nombre,
            apellido,
            rut,
            email,
            password: hashedPassword,
            rol: rol || "ALUMNO",
        });

        await userRepo.save(newUser);

        const { password: _, ...userRegistered } = newUser;

        res.status(201).json({ 
            msg: "Usuario registrado exitosamente.",
            usuario: userRegistered 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor al registrar." });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: "Email y password son requeridos." });
    }

    try {
        const userRepo = AppDataSource.getRepository(UsuarioSchema);

        const user = await userRepo
            .createQueryBuilder("usuario")
            .where("usuario.email = :email", { email: email })
            .addSelect("usuario.password")
            .getOne();

        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ msg: "Credenciales incorrectas." });
        }

        const payload = {
            id: user.id,
            nombre: user.nombre,
            rol: user.rol,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || "tu_secreto_temporal", {
            expiresIn: "8h",
        });

        res.json({
            msg: "Login exitoso.",
            token,
            usuario: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor al iniciar sesión." });
    }
};